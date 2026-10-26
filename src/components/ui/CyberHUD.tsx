'use client';

import { Activity, Radio } from 'lucide-react';
import { sound } from '@/lib/sound';

// Unified coords interface that works for both BotScene and legacy Scene3D
interface Coords {
  x: number; y: number; z: number;
  rotX?: number; rotY?: number;
  fps: number;
}

interface CyberHUDProps {
  coords: Coords;
  currentSection: string;
}

const sections = [
  { id: 'hero',      label: '01  BOT' },
  { id: 'telemetry', label: '02  TELEMETRY' },
  { id: 'solutions', label: '03  SOLUTIONS' },
  { id: 'contact',   label: '04  DEPLOY' },
];

export default function CyberHUD({ coords, currentSection }: CyberHUDProps) {
  const goto = (id: string) => {
    sound.playClick();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const fmtV = (v: number) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">

      {/* Corner brackets */}
      {(['top-20 left-4 border-t border-l', 'top-20 right-4 border-t border-r',
         'bottom-6 left-4 border-b border-l', 'bottom-6 right-4 border-b border-r'] as const)
        .map((cls, i) => (
          <div key={i} className={`absolute ${cls} border-[#00a4e4]/35 w-5 h-5`} />
      ))}

      {/* Bottom-left telemetry readout */}
      <div className="absolute bottom-8 left-6 sm:left-10 hidden md:flex items-center gap-4 px-3.5 py-2 rounded-xl bg-[#08080a]/80 backdrop-blur-xl border border-white/8 font-mono-jet text-[11px] text-[#94a3b8]">
        <div className="flex items-center gap-1.5 text-[#00a4e4]">
          <Radio className="w-3 h-3 animate-pulse" />
          <span className="font-bold">BOT:</span>
        </div>
        <span>X <strong className="text-white">{fmtV(coords.x)}</strong></span>
        <span>Y <strong className="text-white">{fmtV(coords.y)}</strong></span>
        <span>Z <strong className="text-white">{fmtV(coords.z)}</strong></span>
        <div className="w-px h-3.5 bg-white/15" />
        <div className="flex items-center gap-1 text-emerald-400">
          <Activity className="w-3 h-3" />
          <span>{coords.fps || 60} FPS</span>
        </div>
      </div>

      {/* Right section nav dots */}
      <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 pointer-events-auto">
        {sections.map(({ id, label }) => {
          const active = currentSection === id;
          return (
            <button
              key={id}
              onClick={() => goto(id)}
              onMouseEnter={() => sound.playHover()}
              className="group flex items-center justify-end gap-2 font-mono-jet text-[10px] tracking-widest transition-all"
            >
              <span className={`transition-colors ${active ? 'text-[#00a4e4] font-bold' : 'text-[#94a3b8]/50 group-hover:text-[#94a3b8]'}`}>
                {label}
              </span>
              <div className={`w-2 h-2 rounded-full transition-all ${
                active
                  ? 'bg-[#00a4e4] scale-125 shadow-[0_0_10px_#00a4e4]'
                  : 'bg-zinc-700 group-hover:bg-[#ff007f]/70'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
