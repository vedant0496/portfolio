'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ─── Custom shader material for image distortion ─────────────────────────────
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uHover;     // 0 → 1 (animated on hover)
  uniform float uTime;
  varying vec2 vUv;

  // Simplex-like smooth noise
  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
      u.y
    );
    return res * 2.0 - 1.0;
  }

  void main() {
    float strength = uHover * 0.025;
    float n = noise(vUv * 6.0 + uTime * 0.5);

    // Liquid distortion UV warp
    vec2 distortedUv = vUv + vec2(n * strength, n * strength * 0.6);

    // RGB split (chromatic aberration)
    float split = uHover * 0.008;
    float r = texture2D(uTexture, distortedUv + vec2(split, 0.0)).r;
    float g = texture2D(uTexture, distortedUv).g;
    float b = texture2D(uTexture, distortedUv - vec2(split, 0.0)).b;

    vec4 color = vec4(r, g, b, 1.0);

    // Subtle vignette
    vec2 uv2 = vUv * (1.0 - vUv.yx);
    float vignette = uv2.x * uv2.y * 15.0;
    vignette = pow(vignette, 0.25);
    color.rgb *= mix(1.0, vignette, 0.35);

    // Neon tint on hover
    vec3 cyanTint = vec3(0.0, 0.96, 1.0);
    color.rgb = mix(color.rgb, color.rgb + cyanTint * 0.06, uHover);

    gl_FragColor = color;
  }
`;

class DistortionMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: null },
        uHover: { value: 0 },
        uTime: { value: 0 },
      },
    });
  }
}

extend({ DistortionMaterial });

// ─── Individual WebGL project card ───────────────────────────────────────────
export function ProjectCardMesh({ imageUrl, isHovered, position = [0, 0, 0] }) {
  const matRef = useRef();
  const texture = useTexture(imageUrl);
  const targetHover = useRef(0);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    // Smooth hover lerp
    targetHover.current += (isHovered ? 1 : 0 - targetHover.current) * 0.08;
    matRef.current.uniforms.uHover.value = targetHover.current;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[3.2, 2, 1, 1]} />
      <distortionMaterial ref={matRef} uTexture={texture} transparent={false} />
    </mesh>
  );
}
