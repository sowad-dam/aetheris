'use client';

import { ArrowUp } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function Footer() {
  const scrollTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-30 border-t border-white/5 py-12 px-6 sm:px-10 lg:px-16 bg-[#050508] font-space text-xs text-[#94a3b8]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff007f] to-white p-[1px] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center">
              <span className="font-outfit font-black text-[11px] text-white">Æ</span>
            </div>
          </div>
          <div>
            <div className="font-outfit text-sm font-bold text-white tracking-[0.18em] uppercase">
              AETHERIS SYSTEMS CORP.
            </div>
            <div className="text-[11px] text-[#94a3b8]">
              Autonomous Digital Infrastructure &copy; 2026
            </div>
          </div>
        </div>

        {/* Global Nodes Status */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#cbd5e1]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff007f] animate-pulse shadow-[0_0_8px_#ff007f]" />
            <span className="text-white font-semibold">GLOBAL MESH ACTIVE</span>
          </div>
          <span className="text-white/20">&bull;</span>
          <span className="text-[#94a3b8]">UPTIME: 99.999%</span>
          <span className="text-white/20">&bull;</span>
          <span className="text-[#94a3b8]">LATENCY: &lt; 12MS</span>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollTop}
          onMouseEnter={() => sound.playHover()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full pill-container-glass text-xs font-outfit text-[#cbd5e1] hover:text-white hover:border-[#ff007f]/40 transition-all cursor-pointer"
        >
          <span>ASCEND TO CORE</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#ff007f]" />
        </button>
      </div>
    </footer>
  );
}
