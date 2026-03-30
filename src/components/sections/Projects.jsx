'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const projects = [
  {
    id: 1,
    title: 'AI Incident\nResolution Agent',
    description:
      'Internal LangGraph & LangChain agent at Ciena that automates log analysis, identifies root causes across distributed services, and reduces Mean Time To Resolution (MTTR) for production incidents.',
    tags: ['LangGraph', 'LangChain', 'Python', 'K8s', 'Redis'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    accent: '#00f5ff',
    number: '01',
  },
  {
    id: 2,
    title: 'Multi-Agent Alarm\nResolution (RAG Pipeline)',
    description:
      'Closed-loop autonomous alarm resolution for Ciena\'s Blueplanet UAA platform. Agent 1 detects & pulls active customer alarms. Agent 2 (core RAG engine) queries a Vector DB of historical resolutions. Agent 3 triggers resource creation at the southbound BPO layer. Agent 4 verifies resolution and feeds state back to Agent 1 — forming a fully autonomous quality-assurance loop.',
    tags: ['RAG', 'Vector DB', 'Multi-Agent', 'Python', 'Blueplanet UAA', 'gRPC'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    accent: '#bf5fff',
    number: '02',
  },
  {
    id: 3,
    title: '5G Network Slicing\nMicroservices Platform',
    description:
      'Led decoupling of monolithic legacy modules into independent Python microservices for 5G Network Slicing. Designed a non-blocking architecture increasing provisioning throughput by 30% for L2/L3 services. Integrated southbound network devices using YANG models and implemented AWS auto-scaling for zero-downtime burst handling.',
    tags: ['Python', 'Microservices', 'YANG Models', 'AWS', 'Docker'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    accent: '#00f5ff',
    number: '03',
  },
  {
    id: 4,
    title: 'High-Throughput\nTelemetry Control Plane',
    description:
      'Containerised microservices layer on K8s/Docker managing lifecycle for high-volume telemetry data with 99.99% availability. Re-engineered Python control planes with async processing and Redis caching, slashing API P99 latency by 200ms. Parallelised GitLab CI pipelines cut deployment times by 40%.',
    tags: ['K8s', 'Docker', 'Python', 'Redis', 'GitLab CI', 'Terraform'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    accent: '#bf5fff',
    number: '04',
  },
];

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0 w-[85vw] md:w-[540px] h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="glass rounded-2xl overflow-hidden h-full flex flex-col group transition-[border-color] duration-500 hover:border-white/15">
        {/* Image container with CSS-based distortion fallback */}
        <div className="relative overflow-hidden h-[260px] md:h-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{
              filter: hovered
                ? 'saturate(1.2) brightness(1.05)'
                : 'saturate(0.85) brightness(0.9)',
              transition: 'filter 0.5s ease, transform 0.7s ease',
            }}
          />

          {/* RGB split overlay on hover */}
          {hovered && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${project.accent}15 0%, transparent 70%)`,
                mixBlendMode: 'screen',
                animation: 'rgbPulse 1.5s ease infinite',
              }}
            />
          )}

          {/* Project number */}
          <div
            className="absolute top-4 right-4 font-heading font-bold text-6xl leading-none opacity-20 select-none"
            style={{ color: project.accent }}
          >
            {project.number}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-xl md:text-2xl text-white mb-3 whitespace-pre-line leading-tight">
            {project.title}
          </h3>
          <p className="text-[#777] text-sm leading-relaxed mb-5 flex-1">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border"
                style={{
                  borderColor: `${project.accent}40`,
                  color: project.accent,
                  background: `${project.accent}08`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);
  const stRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  // Keep progress in a ref to avoid React re-renders on every scroll frame.
  // Only flush to state at ~15fps via rAF so the dots/buttons stay in sync
  // without competing with GSAP's animation loop.
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Prevent GSAP from making huge jumps after tab-switch / JS pauses
    gsap.ticker.lagSmoothing(0);

    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 96);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          scrub: 0.8,         // tighter catch-up: more responsive, still smooth
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            stRef.current = self;
            progressRef.current = self.progress;
            // Batch the React state update — only one setState per animation frame
            if (!rafRef.current) {
              rafRef.current = requestAnimationFrame(() => {
                setProgress(progressRef.current);
                rafRef.current = null;
              });
            }
          },
          onRefresh: (self) => { stRef.current = self; },
        },
      });
    });

    return () => {
      ctx.revert();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      gsap.ticker.lagSmoothing(500, 33); // restore default on unmount
    };
  }, []);

  const scrollByCard = useCallback((direction) => {
    const st = stRef.current;
    if (!st) return;
    const totalScroll = st.end - st.start;
    const step = totalScroll / projects.length;
    const target = Math.max(st.start, Math.min(st.end, window.scrollY + direction * step));
    // Use GSAP to tween window scroll — keeps control inside GSAP's loop,
    // no conflict with native smooth scroll
    gsap.to(window, { scrollTo: target, duration: 0.6, ease: 'power2.inOut',
      overwrite: 'auto' });
  }, []);

  const atStart = progress <= 0.02;
  const atEnd   = progress >= 0.98;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section horizontal-scroll-section"
      style={{ height: '100vh' }}
    >
      <div className="flex flex-col h-full pt-20 pb-8 px-8 md:px-24">
        {/* Header */}
        <div ref={titleRef} className="mb-12 flex-shrink-0 flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-sans text-xs tracking-[0.3em] uppercase text-neon-cyan mb-3"
            >
              Selected Work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-bold text-4xl md:text-5xl text-white"
            >
              Featured <span className="gradient-text">Projects</span>
            </motion.h2>
          </div>

          {/* Arrow controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Previous project"
              className="group flex items-center justify-center w-11 h-11 rounded-full border transition-[border-color,color,opacity] duration-300"
              style={{
                borderColor: atStart ? 'rgba(255,255,255,0.08)' : 'rgba(0,245,255,0.35)',
                background: atStart ? 'transparent' : 'rgba(0,245,255,0.05)',
                cursor: atStart ? 'not-allowed' : 'pointer',
              }}
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                style={{ color: atStart ? '#333' : '#00f5ff' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
            </button>

            <button
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Next project"
              className="group flex items-center justify-center w-11 h-11 rounded-full border transition-[border-color,color,opacity] duration-300"
              style={{
                borderColor: atEnd ? 'rgba(255,255,255,0.08)' : 'rgba(0,245,255,0.35)',
                background: atEnd ? 'transparent' : 'rgba(0,245,255,0.05)',
                cursor: atEnd ? 'not-allowed' : 'pointer',
              }}
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                style={{ color: atEnd ? '#333' : '#00f5ff' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>

            {/* Progress dots */}
            <div className="hidden md:flex items-center gap-1.5 ml-2">
              {projects.map((_, i) => {
                const isActive = Math.round(progress * (projects.length - 1)) === i;
                return (
                  <button
                    key={i}
                    aria-label={`Go to project ${i + 1}`}
                    onClick={() => {
                      const st = stRef.current;
                      if (!st) return;
                      const target = st.start + (st.end - st.start) * (i / (projects.length - 1));
                      gsap.to(window, { scrollTo: target, duration: 0.6, ease: 'power2.inOut',
                        overwrite: 'auto' });
                    }}
                    className="rounded-full transition-[background-color,transform] duration-300"
                    style={{
                      width: isActive ? '20px' : '6px',
                      height: '6px',
                      background: isActive ? '#00f5ff' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 flex-1"
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {/* End padding card */}
          <div className="flex-shrink-0 w-24" />
        </div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-4 flex-shrink-0 text-[#444] text-xs tracking-widest uppercase flex items-center gap-2"
        >
          <span>Scroll or use arrows to explore</span>
          <svg className="w-10 h-[1px]" viewBox="0 0 40 1" fill="none">
            <line x1="0" y1="0.5" x2="40" y2="0.5" stroke="#444" strokeDasharray="3 3" />
          </svg>
        </motion.p>
      </div>

      <style jsx>{`
        @keyframes rgbPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
