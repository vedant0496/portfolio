'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/vedant0496',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/vedant',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:vedant.1610183@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <footer
      id="footer"
      ref={ref}
      className="section relative flex flex-col items-center justify-center min-h-screen px-8 text-center overflow-hidden"
    >
      {/* Background radial gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(191, 95, 255, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading font-bold text-6xl md:text-8xl lg:text-[120px] xl:text-[140px] leading-none text-white mb-6"
      >
        Let&#39;s Build
        <br />
        <span className="gradient-text">Something.</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-[#666] text-lg max-w-md mb-14 leading-relaxed"
      >
        Open to interesting engineering challenges, collaborations, and
        conversations about distributed systems, AI, and cloud architecture.
      </motion.p>

      {/* Social links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="flex items-center gap-4 mb-20"
      >
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.label !== 'Email' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="glass flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-sans text-[#aaa] hover:text-neon-cyan hover:border-neon-cyan/30 transition-colors duration-300 group"
          >
            <span className="group-hover:text-neon-cyan transition-colors duration-300">
              {link.icon}
            </span>
            {link.label}
          </a>
        ))}
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute bottom-8 left-0 right-0 px-8 md:px-24 flex items-center justify-between text-[11px] text-[#333] tracking-widest uppercase"
      >
        <span>Vedant Kaushik © {new Date().getFullYear()}</span>
        <span>Senior Backend Engineer · Distributed Systems · Cloud</span>
      </motion.div>
    </footer>
  );
}
