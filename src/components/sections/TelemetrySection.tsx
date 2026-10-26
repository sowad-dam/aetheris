'use client';

import { useState, useEffect } from 'react';
import { Activity, Cpu, Shield, Zap, RefreshCw, Server, Globe2, Wifi } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function TelemetrySection() {
  const [currentPing, setCurrentPing]       = useState(38);
  const [loadLevel, setLoadLevel]           = useState(120);
  const [sparkline, setSparkline]           = useState<number[]>(
    [38, 42, 39, 44, 36, 41, 37, 43, 39, 36, 40, 42, 38, 41, 35, 39]
  );

  useEffect(() => {
    const id = setInterval(() => {
      const base   = 34 + Math.round((loadLevel / 500) * 8);
      const jitter = Math.floor(Math.random() * 7) - 3;
      const next   = Math.min(44, Math.max(30, base + jitter));
      setCurrentPing(next);
      setSparkline(p => [...p.slice(1), next]);
    }, 1200);
    return () => clearInterval(id);
  }, [loadLevel]);

  // SVG sparkline
  const MIN_V = 25, MAX_V = 50, W = 320, H = 56;
  const step = W / (sparkline.length - 1);
  const pts  = sparkline.map((v, i) => {
    const x = i * step;
    const y = H - ((v - MIN_V) / (MAX_V - MIN_V)) * H;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const area = `${pts} L ${W} ${H} L 0 ${H} Z`;

  const edgeNodes = [
    { region: 'US-EAST',    loc: 'Virginia',    ping: '18ms', nodes: '48' },
    { region: 'EU-CENTRAL', loc: 'Frankfurt',   ping: '32ms', nodes: '42' },
    { region: 'AP-EAST',    loc: 'Tokyo',       ping: '41ms', nodes: '34' },
    { region: 'SA-EAST',    loc: 'São Paulo',   ping: '44ms', nodes: '18' },
  ];

  return (
    <section
      id="telemetry"
      className="relative min-h-screen w-full flex items-center px-4 sm:px-6 lg:px-8 py-24 z-10"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* ── Left Column ───────────────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col gap-8">

          {/* Header */}
          <div>
            <div className="tag-cerulean inline-flex items-center gap-2 mb-3">
              <Activity className="w-3 h-3 animate-pulse" />
              TELEMETRY MATRIX // REAL-TIME OBSERVABILITY
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-[0.04em] text-white uppercase mb-4">
              Zero-Human<br />
              <span className="text-[#00a4e4] glow-cerulean">Latency Consensus.</span>
            </h2>
            <p className="text-[#94a3b8] text-base sm:text-lg leading-relaxed max-w-xl">
              Continuous multi-region telemetry orchestrates distributed agent handshakes,
              vector synchronization, and Byzantine fault isolation under sub-45ms execution.
            </p>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-jet">

            {/* Latency */}
            <div
              onMouseEnter={() => sound.playHover()}
              className="glass p-5 hover:border-[#ff007f]/50 hover:shadow-[0_0_25px_rgba(255,0,127,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between text-[#94a3b8] text-[11px] mb-2">
                <span>LATENCY OVERHEAD</span>
                <Zap className="w-4 h-4 text-[#00a4e4]" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                &lt;&nbsp;{currentPing}
                <span className="text-base text-[#00a4e4] ml-1">ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SLA: &lt;45ms
              </div>
            </div>

            {/* Fault Recovery */}
            <div
              onMouseEnter={() => sound.playHover()}
              className="glass p-5 hover:border-[#ff007f]/50 hover:shadow-[0_0_25px_rgba(255,0,127,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between text-[#94a3b8] text-[11px] mb-2">
                <span>FAULT RECOVERY</span>
                <Shield className="w-4 h-4 text-[#ff007f]" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                99.98<span className="text-base text-[#ff007f] ml-1">%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
                <RefreshCw className="w-3 h-3 text-[#ff007f]" />
                Autonomous Self-Heal
              </div>
            </div>

            {/* Active Nodes */}
            <div
              onMouseEnter={() => sound.playHover()}
              className="glass p-5 hover:border-[#ff007f]/50 hover:shadow-[0_0_25px_rgba(255,0,127,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between text-[#94a3b8] text-[11px] mb-2">
                <span>ACTIVE NODES</span>
                <Cpu className="w-4 h-4 text-[#00a4e4]" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                140<span className="text-base text-[#00a4e4] ml-1">+</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
                <Server className="w-3 h-3 text-[#00a4e4]" />
                Multi-Region Swarm
              </div>
            </div>
          </div>

          {/* Live SVG Sparkline */}
          <div className="glass p-6 font-mono-jet relative overflow-hidden scan-line">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-[11px] text-[#94a3b8] uppercase tracking-wider">
                  Live Consensus Latency Buffer
                </div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  {currentPing}ms
                  <span className="tag-cerulean text-[10px]">JITTER ±2ms</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#94a3b8]">
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                100 Hz STREAM
              </div>
            </div>

            <div className="w-full rounded-xl bg-black/50 p-2 border border-white/5 overflow-hidden">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#00a4e4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00a4e4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* 45ms threshold line */}
                <line
                  x1="0" y1={H - ((45-MIN_V)/(MAX_V-MIN_V))*H}
                  x2={W} y2={H - ((45-MIN_V)/(MAX_V-MIN_V))*H}
                  stroke="#ff007f" strokeDasharray="5 4" strokeWidth="1" opacity="0.6"
                />
                <path d={area} fill="url(#spkGrad)" />
                <path d={pts}  fill="none" stroke="#00a4e4" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex justify-between text-[10px] text-[#94a3b8]/60 mt-1.5 px-1">
                <span>T-30s</span>
                <span className="text-[#ff007f]/80 font-bold">45ms SLA THRESHOLD</span>
                <span>NOW</span>
              </div>
            </div>

            {/* Stress slider */}
            <div className="mt-5 pt-4 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[12px] text-white font-semibold block">Simulate Throughput:</span>
                <span className="text-[11px] text-[#94a3b8]">{loadLevel}k req/s</span>
              </div>
              <div className="w-full sm:w-64 flex items-center gap-3">
                <input
                  type="range" min="20" max="450" value={loadLevel}
                  onChange={(e) => { setLoadLevel(Number(e.target.value)); sound.playHover(); }}
                  className="w-full accent-[#00a4e4] cursor-pointer h-1.5 rounded-full"
                />
                <span className="text-[#00a4e4] font-bold text-xs shrink-0">{loadLevel}k</span>
              </div>
            </div>
          </div>

          {/* Edge node grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-jet text-xs">
            {edgeNodes.map(n => (
              <div key={n.region}
                className="glass p-3 hover:border-[#ff007f]/50 hover:shadow-[0_0_25px_rgba(255,0,127,0.2)] transition-all duration-300"
              >
                <div className="flex items-center justify-between text-[#94a3b8] text-[10px] mb-1">
                  <span>{n.region}</span>
                  <Globe2 className="w-3 h-3 text-[#00a4e4]" />
                </div>
                <div className="text-white font-bold">{n.ping}</div>
                <div className="text-[10px] text-[#94a3b8] mt-0.5">{n.nodes} nodes</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: 3D core annotation ─────────────────────────────── */}
        <div className="hidden lg:flex lg:col-span-5 h-[480px] pointer-events-none items-center justify-center">
          <div className="glass p-6 max-w-xs font-mono-jet text-xs text-[#94a3b8]">
            <div className="flex items-center gap-2 text-[#00a4e4] font-bold mb-2">
              <Cpu className="w-4 h-4" />
              CORE TARGET: (2.2, 0.0, -1.0)
            </div>
            <p className="text-[11px] leading-relaxed">
              Neural Core dynamically transposed to sector-right to
              unveil the autonomous telemetry inspection plane.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
