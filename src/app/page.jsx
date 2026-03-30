'use client';

import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/sections/Hero';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Footer from '@/components/sections/Footer';

// Dynamically import the 3D Scene (no SSR — Three.js requires browser APIs)
const Scene = dynamic(() => import('@/components/3d/Scene'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <>
      {/* Fixed full-screen 3D canvas — sits behind all content */}
      <Scene />

      {/* Scrollable HTML content */}
      <div id="content">
        <Nav />
        <Hero />
        <Experience />
        <Projects />
        <Footer />
      </div>
    </>
  );
}
