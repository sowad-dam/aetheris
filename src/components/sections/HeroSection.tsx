'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Cpu, Terminal, Layers } from 'lucide-react';
import { sound } from '@/lib/sound';

// Service tags that float around the hero viewport — mirrors the reference image layout
const SERVICE_TAGS = [
  { label: 'AI WORKFLOWS',       cls: 'absolute top-[18%]  left-[4%]  sm:left-[6%]  float-a' },
  { label: 'WEBGL',              cls: 'absolute top-[14%]  right-[4%] sm:right-[8%] float-b' },
  { label: 'AUTONOMOUS AGENTS',  cls: 'absolute top-[40%]  left-[2%]  sm:left-[4%]  float-c' },
  { label: 'NEURAL MESH',        cls: 'absolute top-[62%]  right-[3%] sm:right-[6%] float-a' },
  { label: 'MAIN FOCUS',         cls: 'absolute top-[52%]  left-[5%]  sm:left-[8%]  float-d' },
  { label: 'VECTOR DB',          cls: 'absolute top-[28%]  right-[2%] sm:right-[5%] float-c' },
  { label: 'LLM FIREWALL',       cls: 'absolute bottom-[22%] left-[4%] sm:left-[7%]  float-b' },
  { label: 'ENTERPRISE TIER',    cls: 'absolute bottom-[28%] right-[4%] sm:right-[7%] float-d' },
];

const AGENT_LOGS = [
  { id: 'NODE-09', msg: 'Raft consensus synchronized',            region: 'us-east-1',    ms: '12ms' },
  { id: 'MESH-42', msg: 'Self-healing failover resolved anomaly', region: 'eu-central-1', ms: '18ms' },
  { id: 'GUARD-04',msg: 'Synapse firewall sanitized payload',     region: 'us-west-2',    ms: '8ms'  },
];

export default function HeroSection() {
  const [logIdx, setLogIdx] = useState(0);
  const goto = (id: string) => {
    sound.playClick();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const id = setInterval(() => setLogIdx(p => (p + 1) % AGENT_LOGS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const log = AGENT_LOGS[logIdx];

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 z-10 overflow-hidden"
    >

      {/* ── LAYER 1: Massive editorial background text (reference image) ── */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <span className="editorial-bg-text tracking-tighter opacity-70">AETHERIS</span>
        <span className="editorial-bg-text tracking-tighter opacity-40 mt-[-0.12em]">SYSTEMS</span>
      </div>

      {/* ── LAYER 2: Floating service tags (reference image composition) ── */}
      <div className="absolute inset-0 pointer-events-none z-20 hidden sm:block" aria-hidden="true">
        {SERVICE_TAGS.map(({ label, cls }) => (
          <div key={label} className={`${cls} service-tag`}>{label}</div>
        ))}
      </div>

      {/* ── LAYER 3: Foreground hero content ─────────────────────────── */}
      <div className="relative z-30 max-w-3xl mx-auto text-center flex flex-col items-center">

        {/* Status pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass mb-8 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a4e4] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a4e4]" />
          </span>
          <span className="font-mono-jet text-[11px] tracking-widest text-[#00a4e4] font-bold uppercase">
            System Online // Mesh Active
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-black text-3xl sm:text-5xl md:text-[3.4rem] tracking-[0.04em] text-white leading-[1.1] mb-5 uppercase">
          Engineer{' '}
          <span className="bg-gradient-to-r from-[#00a4e4] via-white to-[#ff007f] bg-clip-text text-transparent">
            Autonomous AI
          </span>{' '}
          <br className="hidden sm:block" />
          Infrastructure
        </h1>

        {/* Value proposition */}
        <p className="font-body text-base sm:text-lg text-[#94a3b8] max-w-xl leading-relaxed mb-9">
          Aetheris orchestrates self-correcting agentic workflows, real-time LLM
          pipelines, and distributed neural mesh deployments — at enterprise scale.
        </p>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
          <button
            onClick={() => goto('contact')}
            onMouseEnter={() => sound.playHover()}
            className="w-full sm:w-auto group px-7 py-3.5 rounded-xl font-display text-[13px] font-bold tracking-[0.1em] uppercase bg-gradient-to-r from-[#00a4e4] to-[#ff007f] text-black shadow-[0_0_28px_rgba(0,164,228,0.4)] hover:shadow-[0_0_44px_rgba(255,0,127,0.55)] transition-all transform hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              <Cpu className="w-4 h-4" />
              Deploy Cluster
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => goto('telemetry')}
            onMouseEnter={() => sound.playHover()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-display text-[13px] font-semibold tracking-[0.1em] uppercase glass hover:border-[#ff007f]/40 hover:shadow-[0_0_22px_rgba(255,0,127,0.18)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4 text-[#00a4e4]" />
              View Telemetry
            </span>
          </button>
        </div>

        {/* Live agent stream ticker */}
        <div className="w-full max-w-lg px-4 py-2.5 rounded-xl glass font-mono-jet text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[#00a4e4] font-bold shrink-0">[{log.id}]</span>
            <span className="text-[#94a3b8] truncate">{log.msg}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:block text-[#94a3b8]/50">{log.region}</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-bold text-[10px]">
              {log.ms}
            </span>
          </div>
        </div>

        {/* Mouse-tracking hint copy */}
        <p className="mt-5 font-mono-jet text-[10px] tracking-widest text-[#94a3b8]/40 uppercase">
          Move cursor — the AI watches
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => goto('telemetry')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#94a3b8]/50 hover:text-[#00a4e4] transition-colors z-30"
      >
        <span className="font-mono-jet text-[9px] tracking-widest uppercase">Scroll</span>
        <div className="w-4 h-7 rounded-full border border-[#94a3b8]/25 hover:border-[#00a4e4] flex items-start justify-center pt-1 transition-colors">
          <div className="w-1 h-1.5 rounded-full bg-[#00a4e4] animate-bounce" />
        </div>
      </button>
    </section>
  );
}
