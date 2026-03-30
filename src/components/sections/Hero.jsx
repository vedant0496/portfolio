'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useMagneticHover } from '@/hooks/useMagneticHover';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const magneticRef = useMagneticHover(0.35);

  function scrollToWork() {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section
      id="hero"
      className="section relative flex items-center justify-start min-h-screen px-8 md:px-24"
    >
      {/* Subtle radial glow behind text */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 245, 255, 0.06) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-sm tracking-[0.3em] uppercase text-neon-cyan mb-6"
        >
          Senior Backend Engineer · Distributed Systems · Cloud Architecture
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-heading font-bold leading-[1.05] text-5xl md:text-7xl lg:text-8xl text-white mb-8"
        >
          Scaling Systems
          <br />
          to <span className="gradient-text">99.99%</span>
          <br />
          Availability.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-lg md:text-xl text-[#888] max-w-xl mb-12 leading-relaxed"
        >
          Vedant Kaushik — Senior Backend Engineer with 6+ years designing
          high-throughput distributed systems. Expert in Python, Kubernetes,
          and Cloud Architecture. Reducing P99 latency by 40% at Ciena.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <div ref={magneticRef} className="magnetic-btn inline-block">
            <button
              onClick={scrollToWork}
              className="relative group font-heading font-semibold text-base tracking-wide px-10 py-4 rounded-full overflow-hidden border border-neon-cyan/40 text-neon-cyan transition-colors duration-300 hover:border-neon-cyan"
            >
              {/* Background fill on hover */}
              <span className="absolute inset-0 rounded-full bg-neon-cyan opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                Explore Work
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-20 flex items-center gap-3 text-[#555] text-xs tracking-widest uppercase"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-[1px] h-8 bg-gradient-to-b from-neon-cyan to-transparent"
          />
          Scroll
        </motion.div>
      </motion.div>
    </section>
  );
}
