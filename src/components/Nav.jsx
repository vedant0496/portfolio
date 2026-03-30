'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#footer' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function smoothScroll(e, href) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-8 md:px-24 py-6 flex items-center justify-between"
    >
      {/* Glass background when scrolled */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 glass border-b border-white/5"
          />
        )}
      </AnimatePresence>

      {/* Logo */}
      <a href="#hero" onClick={(e) => smoothScroll(e, '#hero')} className="relative z-10">
        <span className="font-heading font-bold text-lg text-white tracking-tight">
          VK<span className="text-neon-cyan">.</span>
        </span>
      </a>

      {/* Links */}
      <div className="relative z-10 hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => smoothScroll(e, link.href)}
            className="font-sans text-sm text-[#888] hover:text-white transition-colors duration-300 tracking-wide"
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
