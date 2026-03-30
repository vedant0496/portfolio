'use client';

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { Preload, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollCamera } from '@/hooks/useScrollCamera';

// ─── Neural network particle nodes ───────────────────────────────────────────
const NODE_COUNT = 60; // lightweight; visually identical above ~50
const EDGE_THRESHOLD = 1.6;

function NeuralNetwork({ mouseRef }) {
  const groupRef = useRef();

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

  // Expose groupRef to parent via a callback-free pattern — just read in parent's useFrame
  useEffect(() => {
    NeuralNetwork._groupRef = groupRef;
  }, []);

  return (
    <group ref={groupRef}>
      <points>
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

      <lineSegments>
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
NeuralNetwork._groupRef = { current: null };

// ─── Ambient glowing light orb ───────────────────────────────────────────────
function GlowOrb() {
  const meshRef = useRef();
  // Expose to parent
  useEffect(() => { GlowOrb._meshRef = meshRef; }, []);

  return (
    <mesh ref={meshRef} position={[0, 8, -4]}>
      <sphereGeometry args={[0.4, 12, 12]} />
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
GlowOrb._meshRef = { current: null };

// ─── Single unified animation loop ──────────────────────────────────────────
// Replaces 3 separate useFrame hooks with 1 — cuts per-frame overhead by 2/3.
function AnimationLoop({ mouseRef, scrollState }) {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // 1. Rotate network
    const group = NeuralNetwork._groupRef.current;
    if (group) {
      group.rotation.y = t * 0.04 + mx * 0.15;
      group.rotation.x = t * 0.02 + my * 0.1;
    }

    // 2. Pulse orb
    const orb = GlowOrb._meshRef?.current;
    if (orb) {
      orb.material.emissiveIntensity = 0.8 + Math.sin(t * 1.5) * 0.3;
    }

    // 3. Lerp camera
    const { x, y, z, lookAtY } = scrollState.current;
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
      <AnimationLoop mouseRef={mouseRef} scrollState={scrollState} />
      <AdaptiveDpr pixelated />
      <Preload all />
    </>
  );
}

// ─── Top-level exported Scene component ──────────────────────────────────────
export default function Scene() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollState = useScrollCamera();

  // Throttled mouse tracking — only update & invalidate at ~60fps max
  useEffect(() => {
    let last = 0;
    function onMouseMove(e) {
      const now = performance.now();
      if (now - last < 16) return;          // skip if < 16 ms since last
      last = now;
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      invalidate();                          // wake the demand loop
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Invalidate on scroll so camera lerp runs
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => { invalidate(); ticking = false; });
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div id="three-canvas-container">
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <SceneContents mouseRef={mouseRef} scrollState={scrollState} />
      </Canvas>
    </div>
  );
}
