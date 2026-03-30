'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const timeline = [
  {
    period: 'Jan 2024 — Present',
    role: 'Senior Software Engineer (Systems 2A)',
    company: 'Ciena',
    focus: 'K8s · Python Control Planes · AI Agents · GitLab CI',
    description:
      'Architected a containerised microservices layer using K8s/Docker, managing lifecycle for high-volume telemetry data with 99.99% availability. Re-engineered Python control planes with async processing and Redis caching, slashing API P99 latency by 200ms. Built parallelised GitLab CI pipelines cutting deployment times by 40%. Developed internal AI agents (LangGraph & LangChain) to automate log analysis and reduce MTTR. Mentored 5 engineers on distributed design patterns.',
    accent: '#00f5ff',
  },
  {
    period: 'Jan 2022 — Dec 2023',
    role: 'Software Engineer (Systems 1B)',
    company: 'Ciena',
    focus: 'Microservices · 5G Network Slicing · YANG Models · AWS',
    description:
      'Led the decoupling of monolithic legacy modules into independent Python microservices for 5G Network Slicing. Designed a non-blocking architecture increasing provisioning throughput by 30% for L2/L3 services. Spearheaded integration of southbound network devices using YANG models. Implemented AWS auto-scaling policies to handle burst traffic with zero downtime.',
    accent: '#bf5fff',
  },
  {
    period: 'Jan 2020 — Dec 2021',
    role: 'Software Engineer',
    company: 'Nagarro Inc.',
    focus: 'Django · Flask · Celery · PostgreSQL · OpenStack',
    description:
      'Developed a custom CRM backend using Django/Flask with Celery task queues to offload heavy reporting jobs. Refactored complex SQL queries and implemented strategic indexing on PostgreSQL, supporting 50% growth in daily users. Integrated OpenStack APIs to automate virtual resource provisioning, reducing manual server setup time by 90%.',
    accent: '#00f5ff',
  },
];

const skills = [
  { label: 'Python (Advanced)', category: 'Language' },
  { label: 'Kubernetes (K8s)', category: 'DevOps' },
  { label: 'Docker', category: 'DevOps' },
  { label: 'AWS (EKS, Lambda)', category: 'Cloud' },
  { label: 'Microservices', category: 'Architecture' },
  { label: 'gRPC', category: 'APIs' },
  { label: 'Kafka', category: 'Streaming' },
  { label: 'PostgreSQL', category: 'Data' },
  { label: 'Redis', category: 'Data' },
  { label: 'Vector DB', category: 'AI/ML' },
  { label: 'LangGraph / LangChain', category: 'AI/ML' },
  { label: 'Terraform · GitLab CI', category: 'DevOps' },
];

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-8 pb-16 last:pb-0"
    >
      {/* Vertical line */}
      <div
        className="absolute left-0 top-2 bottom-0 w-[1px]"
        style={{ background: `linear-gradient(to bottom, ${item.accent}40, transparent)` }}
      />
      {/* Dot */}
      <div
        className="absolute left-[-4px] top-2 w-2 h-2 rounded-full"
        style={{ backgroundColor: item.accent, boxShadow: `0 0 10px ${item.accent}` }}
      />

      <p className="text-xs tracking-widest uppercase mb-2" style={{ color: item.accent }}>
        {item.period}
      </p>
      <h3 className="font-heading font-semibold text-2xl text-white mb-1">{item.role}</h3>
      <p className="text-sm text-[#666] mb-3">{item.company} · {item.focus}</p>
      <p className="text-[#888] leading-relaxed text-sm max-w-lg">{item.description}</p>
    </motion.div>
  );
}

function SkillTag({ skill, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-xl px-4 py-3 flex flex-col gap-1 hover:border-neon-cyan/30 transition-colors duration-300 cursor-default"
    >
      <span className="text-[10px] uppercase tracking-widest text-[#555]">{skill.category}</span>
      <span className="font-heading font-medium text-sm text-white">{skill.label}</span>
    </motion.div>
  );
}

export default function Experience() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });

  return (
    <section id="experience" className="section py-32 px-8 md:px-24">
      {/* Section header */}
      <motion.p
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="font-sans text-xs tracking-[0.3em] uppercase text-neon-cyan mb-4"
      >
        Background
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
        {/* Left — sticky label */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-4xl md:text-5xl xl:text-6xl text-white leading-tight mb-6"
          >
            6 Years of
            <br />
            <span className="gradient-text">Engineering</span>
            <br />
            Excellence.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#666] text-sm leading-relaxed max-w-sm"
          >
            From CRM backends to 5G network slicing and AI-powered incident
            resolution — building distributed systems that hold up under pressure.
          </motion.p>

          {/* Skills bento grid */}
          <div className="mt-12">
            <p className="text-xs uppercase tracking-widest text-[#444] mb-4">Core Proficiencies</p>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((s, i) => (
                <SkillTag key={s.label} skill={s} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — scrollable timeline */}
        <div className="pt-2">
          {timeline.map((item, i) => (
            <TimelineItem key={item.company} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
