'use client';

import { useState } from 'react';
import { ArrowRight, Cpu, Layers, Sparkles, ShieldCheck, Zap, Activity } from 'lucide-react';
import { sound } from '@/lib/sound';

const CAPABILITIES = [
  {
    id: 'cap-01',
    num: '01',
    title: 'Autonomous Agent Orchestration',
    tagline: 'MULTI-AGENT CONSENSUS & TASK PARTITIONING',
    description:
      'Self-healing multi-agent task loops that execute complex enterprise workflows without manual oversight. Engineered with mathematical fault tolerance and deterministic execution guarantees.',
    highlights: [
      'Raft Byzantine Quorum',
      'Zero-Copy Shared Memory',
      'Autonomous Task Partitioning',
    ],
    metrics: [
      { label: 'Decision Latency', val: '< 8ms', icon: Zap },
      { label: 'Fault Recovery', val: '99.98%', icon: ShieldCheck },
      { label: 'Throughput Gain', val: '4.2×', icon: Activity },
    ],
    accent: '#ff007f',
  },
  {
    id: 'cap-02',
    num: '02',
    title: 'Real-Time Cognitive Data Fabrics',
    tagline: 'VECTOR PIPELINES & PRIVATE MODEL DEPLOYMENTS',
    description:
      'Low-latency vector pipelines and private fine-tuned model deployments built directly into sovereign enterprise clouds. Eliminates data exfiltration risks with hardware-isolated enclaves.',
    highlights: [
      'Sub-12ms Embedding Sync',
      'Automated HNSW Rebalancing',
      'Zero-Trust Enclaves',
    ],
    metrics: [
      { label: 'Dynamic Vectors', val: '1.8B', icon: Layers },
      { label: 'Availability SLA', val: '99.99%', icon: ShieldCheck },
      { label: 'Hardware Spec', val: 'FIPS 140-3', icon: Sparkles },
    ],
    accent: '#ffffff',
  },
  {
    id: 'cap-03',
    num: '03',
    title: 'Spatial 3D & Immersive Platforms',
    tagline: 'HARDWARE-ACCELERATED WEBGL CHOREOGRAPHY',
    description:
      'WebGL/R3F interactive product experiences engineered for unprecedented customer engagement and spatial simulation. Locked 60 FPS performance across desktop, mobile, and vision headsets.',
    highlights: [
      '60 FPS Acceleration',
      'GPU-Instanced Systems',
      'Spatial Fidelity Matrix',
    ],
    metrics: [
      { label: 'Frame Pacing', val: '60 FPS', icon: Cpu },
      { label: 'Render Glitch Rate', val: '0.00%', icon: ShieldCheck },
      { label: 'Standard Support', val: 'WebGL 2.0', icon: Zap },
    ],
    accent: '#ff007f',
  },
];

export default function ShowcaseSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scrollToContact = () => {
    sound.playClick();
    const el = document.getElementById('contact-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="showcase"
      className="relative w-full py-32 px-6 sm:px-10 lg:px-16 bg-transparent z-30 border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full pill-container-glass text-[11px] font-space text-[#ff007f] font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff007f] animate-pulse" />
              <span>01 // CORE COGNITIVE CAPABILITIES</span>
            </div>
            <h2 className="font-outfit text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Architecting Autonomous{' '}
              <span className="bg-gradient-to-r from-white via-[#e2e8f0] to-[#ff007f] bg-clip-text text-transparent">
                Enterprise Mesh.
              </span>
            </h2>
          </div>
          <p className="font-space text-sm sm:text-base text-[#94a3b8] max-w-md leading-relaxed">
            High-reliability agentic workflows deployed into sovereign enterprise cloud environments with deterministic SLAs and self-correcting topologies.
          </p>
        </div>

        {/* 3 Executive Liquid Glass Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CAPABILITIES.map((cap) => {
            const isHovered = hoveredId === cap.id;
            return (
              <div
                key={cap.id}
                onMouseEnter={() => {
                  setHoveredId(cap.id);
                  sound.playHover();
                }}
                onMouseLeave={() => setHoveredId(null)}
                className={`executive-card p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                  isHovered ? 'border-[#ff007f]/50' : 'border-white/10'
                }`}
              >
                {/* Top Subtle Edge Sheen */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                  style={{
                    background:
                      cap.accent === '#ff007f'
                        ? 'linear-gradient(90deg, transparent, #ff007f, transparent)'
                        : 'linear-gradient(90deg, transparent, #ffffff, transparent)',
                    opacity: isHovered ? 1 : 0.35,
                  }}
                />

                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between text-xs font-space text-[#94a3b8] mb-4">
                    <span className="font-bold tracking-widest text-[#ff007f]">
                      {cap.num} // ARCHITECTURE
                    </span>
                    <span className="text-white/40 font-mono-t">{cap.id.toUpperCase()}</span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-outfit text-2xl font-black text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                    {cap.title}
                  </h3>
                  <div className="text-[11px] font-space font-semibold tracking-wider text-[#cbd5e1] mb-4">
                    {cap.tagline}
                  </div>

                  {/* Body Copy */}
                  <p className="font-outfit text-sm text-[#94a3b8] leading-relaxed mb-6">
                    {cap.description}
                  </p>

                  {/* Technical Highlights / Specs */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[10px] font-space tracking-widest uppercase text-white/50">
                      Technical Architecture:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cap.highlights.map((h) => (
                        <span
                          key={h}
                          className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-space text-[#e2e8f0]"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {/* Verified Metrics Row */}
                  <div className="grid grid-cols-3 gap-2.5 mb-6 pt-4 border-t border-white/5">
                    {cap.metrics.map((m, idx) => {
                      const Icon = m.icon;
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-black/50 border border-white/5 flex flex-col items-center text-center"
                        >
                          <Icon className="w-3.5 h-3.5 mb-1 text-[#ff007f]" />
                          <span className="font-outfit font-black text-white text-sm">
                            {m.val}
                          </span>
                          <span className="font-space text-[9px] text-[#94a3b8] leading-tight mt-0.5">
                            {m.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Link */}
                  <button
                    onClick={scrollToContact}
                    className="w-full flex items-center justify-between pt-4 border-t border-white/10 text-xs font-outfit font-semibold text-white group-hover:text-[#ff007f] transition-colors cursor-pointer"
                  >
                    <span>Request Technical Blueprint</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
