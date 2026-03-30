'use client';

import { useEffect, useRef } from 'react';

/**
 * Magnetic hover effect — moves element toward cursor within a radius.
 * Returns a ref to attach to the element.
 */
export function useMagneticHover(strength = 0.4) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMouseMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    }

    function onMouseLeave() {
      el.style.transform = 'translate(0px, 0px)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    }

    function onMouseEnter() {
      el.style.transition = 'transform 0.1s linear';
    }

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseenter', onMouseEnter);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [strength]);

  return ref;
}
