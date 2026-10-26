'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Terminal, Cpu, Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/sound';

interface NavbarProps { currentSection?: string; }

export default function Navbar({ currentSection = 'hero' }: NavbarProps) {
  const [timeStr, setTimeStr]   = useState('00:00:00 UTC');
  const [isMuted, setIsMuted]   = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTimeStr(
        `${String(n.getUTCHours()).padStart(2,'0')}:${String(n.getUTCMinutes()).padStart(2,'0')}:${String(n.getUTCSeconds()).padStart(2,'0')} UTC`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearInterval(id); window.removeEventListener('scroll', onScroll); };
  }, []);

  const goto = (id: string) => {
    sound.playClick();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const navLinks = [
    { id: 'telemetry',    label: 'TELEMETRY',    num: '01' },
    { id: 'solutions',    label: 'SOLUTIONS',     num: '02' },
    { id: 'architecture', label: 'ARCHITECTURE',  num: '03' },
    { id: 'contact',      label: 'CONSULTATION',  num: '04' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass py-3 rounded-none border-x-0 border-t-0 rounded-b-none'
          : 'bg-transparent py-5 border-b border-white/5'
      }`}
      style={{ backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* ── Brand ──────────────────────────────────────────────────── */}
        <button
          onClick={() => goto('hero')}
          onMouseEnter={() => sound.playHover()}
          className="group flex items-center gap-3 text-left"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00a4e4]/25 to-[#ff007f]/20 border border-[#00a4e4]/40 flex items-center justify-center overflow-hidden group-hover:border-[#ff007f]/60 transition-colors shadow-[0_0_16px_rgba(0,164,228,0.22)]">
            <div className="absolute inset-0 bg-[radial-gradient(#00a4e4_1px,transparent_1px)] [background-size:7px_7px] opacity-30" />
            <Cpu className="w-5 h-5 text-[#00a4e4] relative z-10 transition-transform duration-500 group-hover:rotate-45" />
          </div>
          <div>
            <div className="font-display font-bold text-lg tracking-[0.15em] text-white group-hover:text-[#00a4e4] transition-colors uppercase">
              Aetheris
            </div>
            <div className="hidden md:block font-mono-jet text-[9px] text-[#94a3b8] tracking-wider">
              Autonomous Digital Infrastructure
            </div>
          </div>
        </button>

        {/* ── Nav Links ─────────────────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-7 font-mono-jet text-[11px] text-[#94a3b8]">
          {navLinks.map(({ id, label, num }) => (
            <button
              key={id}
              onClick={() => goto(id)}
              onMouseEnter={() => sound.playHover()}
              className={`flex items-center gap-1.5 transition-colors hover:text-[#00a4e4] ${
                currentSection === id ? 'text-[#00a4e4]' : ''
              }`}
            >
              <span className="text-[#00a4e4]/50">{num} //</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* ── Right Controls ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Node count badge */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#00a4e4]/10 border border-[#00a4e4]/25 font-mono-jet text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a4e4] opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a4e4]" />
            </span>
            <span className="text-[#00a4e4] font-semibold">140+</span>
            <span className="text-[#94a3b8]">NODES</span>
          </div>

          {/* UTC Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/8 font-mono-jet text-[11px] text-[#94a3b8]">
            <Terminal className="w-3 h-3 text-[#ff007f]" />
            {timeStr}
          </div>

          {/* Audio */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-[#0d1322] border border-white/10 text-[#94a3b8] hover:text-[#00a4e4] hover:border-[#00a4e4]/50 transition-all"
          >
            {isMuted
              ? <VolumeX className="w-4 h-4" />
              : <Volume2 className="w-4 h-4 text-[#00a4e4]" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => goto('contact')}
            onMouseEnter={() => sound.playHover()}
            className="relative group overflow-hidden px-4 py-2 rounded-xl font-display text-[11px] font-semibold tracking-widest bg-gradient-to-r from-[#00a4e4] to-[#ff007f] text-black shadow-[0_0_22px_rgba(0,164,228,0.35)] hover:shadow-[0_0_36px_rgba(255,0,127,0.45)] transition-all transform hover:-translate-y-0.5 uppercase"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              DEPLOY MESH
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
