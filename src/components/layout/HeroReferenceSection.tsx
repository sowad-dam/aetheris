'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function HeroReferenceSection() {
  const [activeTab, setActiveTab] = useState('home');

  const scrollToSection = (id: string) => {
    sound.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[720px] max-h-[1080px] bg-transparent flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden select-none z-30">
      {/* ── BACKGROUND AMBIENT BLOOM (60-30-10: Platinum Depth & Neon Rose Sheen) ── */}
      <div className="ambient-platinum-bloom pointer-events-none" />
      <div className="ambient-rose-bloom pointer-events-none" />

      {/* ── TOP HEADER NAVIGATION ── */}
      <header className="relative z-40 w-full flex items-center justify-between">
        {/* Left: Sleek Agency Branding */}
        <div className="flex items-center gap-2.5">
          <span className="font-outfit text-xl sm:text-2xl font-black tracking-[0.22em] text-white">
            AETHERIS
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff007f] inline-block mb-1 shadow-[0_0_8px_#ff007f]" />
        </div>

        {/* Center: Clean Menu Items */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-11 font-outfit text-xs font-semibold tracking-[0.2em] text-[#94a3b8]">
          {[
            { id: 'home', label: 'HOME' },
            { id: 'capabilities', label: 'CAPABILITIES' },
            { id: 'architecture', label: 'ARCHITECTURE' },
            { id: 'consultation', label: 'CONSULTATION' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                sound.playHover();
                if (item.id === 'capabilities' || item.id === 'architecture') {
                  scrollToSection('showcase');
                } else if (item.id === 'consultation') {
                  scrollToSection('contact-section');
                }
              }}
              className={`transition-colors hover:text-white uppercase cursor-pointer ${
                activeTab === item.id ? 'text-white font-bold' : 'text-[#94a3b8]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Pill-Shaped Liquid Glass CTA Buttons */}
        <div className="flex items-center p-1 pill-container-glass">
          <button
            onClick={() => scrollToSection('contact-section')}
            onMouseEnter={() => sound.playHover()}
            className="pill-button-solid cursor-pointer"
          >
            Review Brief
          </button>
          <button
            onClick={() => scrollToSection('showcase')}
            onMouseEnter={() => sound.playHover()}
            className="px-4 py-1.5 text-xs font-outfit font-medium text-[#cbd5e1] hover:text-white transition-colors cursor-pointer"
          >
            Capabilities
          </button>
        </div>
      </header>

      {/* ── CENTER STAGE (THE 3-LAYER DEPTH SYSTEM) ── */}
      <div className="relative flex-1 w-full flex items-center justify-center pointer-events-none">
        {/* LAYER 1: BACKDROP MASSIVE TYPOGRAPHY (Ethereal Tinted Platinum-White sitting cleanly behind 3D element) */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <h1 className="reference-backdrop-text">
            AETHERIS
          </h1>
        </div>

        {/* LAYER 3: FOREGROUND UI - MARGIN METADATA */}
        {/* Left Margin: Rotated Year Text (2026) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-30 hidden sm:flex items-center pointer-events-none">
          <span className="vertical-year-text">2026 // SYSTEM V4.8</span>
        </div>

        {/* Right Margin: Vertical Coordinates / Status */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center gap-6 text-[#94a3b8] pointer-events-auto font-space text-[10px] tracking-widest uppercase">
          <span className="writing-mode-vertical rotate-180 text-white/50">COORDINATES: 42°N 71°W</span>
          <span className="w-1 h-8 bg-white/10 rounded-full" />
          <span className="text-[#ff007f] font-mono-t">ONLINE</span>
        </div>
      </div>

      {/* ── BOTTOM INFORMATION BAR ── */}
      <footer className="relative z-40 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pointer-events-auto">
        {/* Bottom-Left: Agency Subtext & Micro-Label */}
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2 text-[11px] font-space tracking-wider uppercase text-[#ff007f]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff007f] shadow-[0_0_8px_#ff007f]" />
            <span className="font-semibold text-white/90">
              AUTONOMOUS SYSTEMS &amp; COGNITIVE DIGITAL ARCHITECTURE
            </span>
          </div>
          <h2 className="font-outfit text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight mb-2">
            ENGINEERING SELF-GOVERNING ENTERPRISE INTELLIGENCE.
          </h2>
          <p className="font-outfit text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
            We build custom multi-agent frameworks, proprietary LLM automation pipelines, and high-performance spatial digital products for market leaders.
          </p>
        </div>

        {/* Bottom-Right: Sleek Glassmorphism Pill Button */}
        <div>
          <button
            onClick={() => scrollToSection('showcase')}
            onMouseEnter={() => sound.playHover()}
            className="glass-action-pill group cursor-pointer"
          >
            <span>Explore Architecture</span>
            <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center transition-transform group-hover:scale-110">
              <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
            </div>
          </button>
        </div>
      </footer>
    </section>
  );
}
