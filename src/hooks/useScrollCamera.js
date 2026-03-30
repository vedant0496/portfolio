'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives the Three.js camera position via data attributes read from GSAP ScrollTrigger.
 * Returns a ref object { current: { x, y, z, lookAtY } } that is updated each scroll frame.
 * Attach the returned ref to the Scene component so useFrame can pick it up.
 */
export function useScrollCamera() {
  const cameraState = useRef({
    x: 0,
    y: 0,
    z: 6,
    lookAtY: 0,
  });

  useEffect(() => {
    // Proxy object GSAP will tween
    const proxy = { x: 0, y: 0, z: 6, lookAtY: 0 };

    const ctx = gsap.context(() => {
      // ── Hero → Experience: camera drifts closer
      gsap.to(proxy, {
        z: 3.5,
        y: -0.5,
        lookAtY: -0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '#experience',
          start: 'top bottom',
          end: 'center center',
          scrub: 1.5,
          onUpdate: () => {
            cameraState.current = { ...proxy };
          },
        },
      });

      // ── Experience → Projects: pull back slightly
      gsap.to(proxy, {
        z: 5,
        y: -1,
        lookAtY: -1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top bottom',
          end: 'top center',
          scrub: 1.5,
          onUpdate: () => {
            cameraState.current = { ...proxy };
          },
        },
      });

      // ── Footer: camera pans up toward light
      gsap.to(proxy, {
        z: 7,
        y: 2.5,
        lookAtY: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '#footer',
          start: 'top bottom',
          end: 'center center',
          scrub: 2,
          onUpdate: () => {
            cameraState.current = { ...proxy };
          },
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return cameraState;
}
