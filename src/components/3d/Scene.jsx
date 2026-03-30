'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollCamera } from '@/hooks/useScrollCamera';

// ─── Neural network particle nodes ───────────────────────────────────────────
const NODE_COUNT = 120;
const EDGE_THRESHOLD = 1.8; // max distance to draw an edge

function NeuralNetwork({ mouseRef }) {
  const pointsRef = useRef();
  const linesRef = useRef();

  // Generate stable node positions
  const { positions, linePositions } = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    const nodes = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      nodes.push(new THREE.Vector3(x, y, z));
    }

    // Build edges between close nodes
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < EDGE_THRESHOLD) {
          edges.push(nodes[i].x, nodes[i].y, nodes[i].z);
          edges.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }

    return { positions: pos, linePositions: new Float32Array(edges) };
  }, []);

  // Per-frame animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.04 + mx * 0.15;
      pointsRef.current.rotation.x = t * 0.02 + my * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.04 + mx * 0.15;
      linesRef.current.rotation.x = t * 0.02 + my * 0.1;
    }
  });

  return (
    <group>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={NODE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#00f5ff"
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      {/* Edges */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// ─── Ambient glowing light orb (visible in footer pan) ───────────────────────
function GlowOrb() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity =
        0.8 + Math.sin(clock.getElapsedTime() * 1.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 8, -4]}>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial
        color="#bf5fff"
        emissive="#bf5fff"
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// ─── Camera controller — reads from GSAP-driven scroll state ─────────────────
function CameraController({ scrollState }) {
  const { camera } = useThree();

  useFrame(() => {
    const { x, y, z, lookAtY } = scrollState.current;
    // Smooth damp toward target
    camera.position.x += (x - camera.position.x) * 0.05;
    camera.position.y += (y - camera.position.y) * 0.05;
    camera.position.z += (z - camera.position.z) * 0.05;
    camera.lookAt(0, lookAtY, 0);
  });

  return null;
}

// ─── Scene contents (inside Canvas) ─────────────────────────────────────────
function SceneContents({ mouseRef, scrollState }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[0, 8, -4]} intensity={6} color="#bf5fff" distance={12} decay={2} />
      <pointLight position={[-4, -3, 2]} intensity={3} color="#00f5ff" distance={10} decay={2} />

      <NeuralNetwork mouseRef={mouseRef} />
      <GlowOrb />
      <CameraController scrollState={scrollState} />
      <Preload all />
    </>
  );
}

// ─── Top-level exported Scene component ──────────────────────────────────────
export default function Scene() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollState = useScrollCamera();

  // Track normalised mouse position
  useEffect(() => {
    function onMouseMove(e) {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div id="three-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneContents mouseRef={mouseRef} scrollState={scrollState} />
      </Canvas>
    </div>
  );
}
