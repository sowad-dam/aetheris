'use client';

import React, { useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import {
  Play, ArrowRight, ShieldCheck, Cpu, Lock, Server, FileText, CheckCircle2, RotateCcw, TrendingUp,
  Database, Calendar, ArrowUp, ChevronRight, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/sound';
import { scrollState } from '@/lib/scrollState';

const Hero3DObject = dynamic(() => import('@/components/canvas/Hero3DObject'), {
  ssr: false,
  loading: () => null,
});

const CAPABILITIES = [
  {
    num: '01',
    title: 'Autonomous Agent Orchestration',
    tag: 'MULTI-AGENT CONSENSUS & TASK LOOPS',
    desc: 'Self-healing multi-agent task loops that execute complex enterprise workflows without human bottlenecks. Engineered with mathematical fault tolerance and deterministic execution guarantees.',
    specs: ['Raft Byzantine Quorum', 'Zero-Copy Shared Memory', 'Autonomous Task Partitioning'],
    metrics: [
      { label: 'Decision Latency', val: '< 8ms' },
      { label: 'Fault Recovery', val: '99.98%' },
      { label: 'Throughput Gain', val: '4.2×' },
    ],
  },
  {
    num: '02',
    title: 'Real-Time Cognitive Data Fabrics',
    tag: 'VECTOR PIPELINES & SOVEREIGN ENCLAVES',
    desc: 'Low-latency vector pipelines and private fine-tuned model deployments built directly into sovereign enterprise clouds. Eliminates data exfiltration risks with hardware-isolated enclaves.',
    specs: ['Sub-12ms Embedding Sync', 'Automated HNSW Rebalancing', 'FIPS 140-3 Hardware'],
    metrics: [
      { label: 'Dynamic Vectors', val: '1.8B' },
      { label: 'Availability SLA', val: '99.99%' },
      { label: 'Compliance Level', val: 'Zero-Trust' },
    ],
  },
  {
    num: '03',
    title: 'Spatial 3D & Immersive Platforms',
    tag: 'HARDWARE-ACCELERATED SPATIAL SIMULATION',
    desc: 'WebGL/R3F interactive product experiences engineered for spatial simulations and customer engagement. Locked 60 FPS performance across desktop, mobile, and vision headsets.',
    specs: ['60 FPS Acceleration', 'GPU-Instanced Systems', 'Spatial Fidelity Matrix'],
    metrics: [
      { label: 'Frame Pacing', val: '60 FPS' },
      { label: 'Render Glitch Rate', val: '0.00%' },
      { label: 'Graphics API', val: 'WebGL 2.0' },
    ],
  },
];

const SOLUTIONS = [
  {
    code: 'AF-01',
    name: 'AetherFlow Engine',
    category: 'DISTRIBUTED DECISION MESH',
    summary: 'Decentralized multi-agent consensus orchestrator with automated failover and zero-knowledge telemetry validation.',
    tags: ['Consensus Quorum', 'Self-Healing DAG', 'Multi-Cloud'],
  },
  {
    code: 'SG-02',
    name: 'Synapse Guard',
    category: 'SOVEREIGN PRIVACY ENCLAVE',
    summary: 'FIPS 140-3 validated hardware firewall preventing prompt injections, model extraction, and unauthorized data egress in real time.',
    tags: ['Zero-Knowledge Proofs', 'FIPS 140-3', 'Audit Enclave'],
  },
  {
    code: 'PT-03',
    name: 'Pulse Telemetry',
    category: 'REAL-TIME VECTOR SYNC',
    summary: 'Continuous vector database synchronization engine supporting billions of dynamic embeddings with instant drift detection.',
    tags: ['Sub-12ms Sync', 'HNSW Indexing', 'Live Drift Guard'],
  },
];

const VERIFIED_METRICS = [
  { icon: ShieldCheck, value: '99.98%', label: 'Agent Fault Tolerance', sub: 'Autonomous self-healing across nodes' },
  { icon: TrendingUp, value: '4.2×', label: 'Pipeline Throughput Gain', sub: 'Measured on sovereign LLM clusters' },
  { icon: Cpu, value: '$14.8M', label: 'Capital Saved Across Fleets', sub: 'Annualized enterprise infrastructure savings' },
  { icon: Database, value: '< 12ms', label: 'Global Synapse Latency', sub: 'Direct vector memory fabric sync' },
];

const FLEET_SCALES = [
  '10 - 50 Agents (Pilot)',
  '50 - 250 Autonomous Agents',
  '250+ Global Enterprise Swarm',
];

const DEPLOY_TARGETS = [
  'Multi-Cloud Sovereign Mesh (AWS / GCP / Azure)',
  'Dedicated On-Premise Sovereign Enclave',
  'Air-Gapped Bare Metal Infrastructure',
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'SOC2 TYPE II', sub: 'Continuous Audit' },
  { icon: Lock, label: 'ISO 27001', sub: 'Certified Enclaves' },
  { icon: Server, label: '99.999% SLA', sub: 'Financial Grade' },
  { icon: FileText, label: 'FIPS 140-3', sub: 'Hardware Validated' },
];

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null!);
  const [activeNav, setActiveNav] = useState('overview');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fleet, setFleet] = useState(FLEET_SCALES[1]);
  const [deploy, setDeploy] = useState(DEPLOY_TARGETS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const max = scrollHeight - clientHeight;
    const p = max > 0 ? scrollTop / max : 0;
    scrollState.progress = p;

    const nextNav = p < 0.25 ? 'home' : p < 0.55 ? 'overview' : p < 0.8 ? 'solutions' : 'architecture';
    setActiveNav((prev) => (prev !== nextNav ? nextNav : prev));
  };

  const scrollTo = (id: string) => {
    sound.playClick();
    const el = document.getElementById(id);
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sound.playClick();
    setSubmitting(true);

    setTimeout(() => {
      setBookingRef(`AE-${Math.floor(1000 + Math.random() * 9000)}-ALPHA`);
      setSubmitting(false);
      setBooked(true);
      sound.playSuccess();
      try {
        confetti({
          particleCount: 95,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#ff0055', '#ffffff', '#e2e8f0', '#94a3b8'],
        });
      } catch {
        // fallback
      }
    }, 1200);
  };

  const resetForm = () => {
    sound.playClick();
    setBooked(false);
    setName('');
    setEmail('');
  };

  return (
    <div
      id="framed-root"
      className="w-full min-h-screen min-h-dvh h-screen h-dvh overflow-hidden bg-[#050508] flex items-center justify-center p-1 sm:p-4 lg:p-6 select-none"
    >
      <div className="w-full sm:w-[95vw] max-w-[1720px] h-full sm:h-[94vh] lg:h-[92vh] my-auto mx-auto rounded-[18px] sm:rounded-[32px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col bg-[#08080c]/90 backdrop-blur-md hardware-composited-frame">
        <div className="ambient-red-bloom pointer-events-none" />
        <div className="ambient-platinum-bloom pointer-events-none" />

        {/* 3D CANVAS: Optimized - Mobile/Samsung-e model ektu upore scale down */}
        <div className="absolute inset-0 pointer-events-none z-10 hardware-composited-frame transition-transform duration-300 transform-gpu -translate-y-28 sm:-translate-y-8 md:translate-y-0 scale-[0.72] sm:scale-95 md:scale-100">
          <Suspense fallback={null}>
            <Hero3DObject />
          </Suspense>
        </div>

        {/* Header Bar */}
        <div className="absolute top-2.5 sm:top-5 left-0 right-0 z-40 px-2.5 sm:px-8 flex justify-center pointer-events-none">
          <header className="pointer-events-auto w-full max-w-4xl pill-header-bar px-3.5 sm:px-7 py-2 sm:py-2.5 flex items-center justify-between">
            <div
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <span className="font-outfit text-sm sm:text-xl font-black tracking-[0.2em] sm:tracking-[0.22em] text-white transition-colors">
                AETHERIS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] inline-block mb-0.5 shadow-[0_0_8px_#ff0055]" />
            </div>

            <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-outfit text-xs font-semibold tracking-[0.2em]">
              {[
                { id: 'overview', label: 'OVERVIEW' },
                { id: 'solutions', label: 'SOLUTIONS' },
                { id: 'architecture', label: 'ARCHITECTURE' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  onMouseEnter={() => sound.playHover()}
                  className={`transition-colors uppercase cursor-pointer ${
                    activeNav === item.id ? 'text-white font-bold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center">
              <button
                onClick={() => scrollTo('architecture')}
                onMouseEnter={() => sound.playHover()}
                className="pill-cta-red cursor-pointer flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm px-3 sm:px-5 py-1.5"
              >
                <span>Consultation</span>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </header>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="relative z-20 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth framed-scroll pt-16 sm:pt-28"
        >
          {/* SECTION 1: HERO VIEWPORT */}
          <section
            id="hero"
            className="relative w-full min-h-[calc(100dvh-4.2rem)] sm:min-h-[calc(92vh-7rem)] flex flex-col justify-between pb-4 sm:pb-10 px-3 sm:px-12 lg:px-16 overflow-hidden select-none"
          >
            {/* 1. Backdrop Typography: SAMSUNG-SPECIFIC LEFT-STICK REDESIGN */}
            <div className="absolute inset-x-0 top-[18%] sm:top-1/3 flex items-center max-[420px]:justify-start justify-center z-10 pointer-events-none px-3 select-none overflow-hidden">
              <h1 className="reference-backdrop-text max-[420px]:text-left max-[420px]:text-3xl max-[420px]:font-mono max-[420px]:tracking-[0.35em] max-[420px]:opacity-40 max-[420px]:text-[#ff0055]/30 text-[clamp(28px,7.8vw,170px)] tracking-tight whitespace-nowrap opacity-20 font-black text-center max-w-full">
                AETHERIS
              </h1>
            </div>

            {/* Desktop margin metadata */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center pointer-events-none">
              <span className="vertical-year-text">2026 // SYSTEM V4.8</span>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4 text-[#94a3b8] font-space text-[10px] tracking-widest uppercase pointer-events-none">
              <span className="writing-mode-vertical rotate-180 text-white/40">SOVEREIGN ENCLAVE</span>
              <span className="w-1 h-6 bg-white/10 rounded-full" />
              <span className="text-[#ff0055] font-mono-t font-bold">ONLINE</span>
            </div>

            {/* Spacing for 3D stage */}
            <div className="flex-1 w-full min-h-[190px] sm:min-h-[240px] md:min-h-[220px]" />

            {/* 2. REAL APPLE GLASSMORPHISM CONTAINER */}
            <div className="relative z-30 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-3.5 sm:gap-6 bg-white/[0.04] md:bg-transparent p-4 sm:p-5 md:p-0 rounded-2xl md:rounded-none backdrop-blur-3xl md:backdrop-blur-none border border-white/15 md:border-none shadow-[0_15px_45px_rgba(0,0,0,0.85)] md:shadow-none">
              <div className="max-w-xl w-full">
                {/* Autonomous Systems Badge */}
                <div className="inline-flex items-center gap-1.5 mb-2.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] shadow-[0_0_8px_#ff0055] shrink-0" />
                  <span className="text-[9px] sm:text-[11px] font-space tracking-wider uppercase font-semibold text-white/95">
                    AUTONOMOUS SYSTEMS // ARCHITECTURE
                  </span>
                </div>

                <h2 className="font-outfit text-base sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug sm:leading-tight mb-2">
                  ENGINEERING SELF-GOVERNING ENTERPRISE INTELLIGENCE.
                </h2>
                <p className="font-outfit text-[11px] sm:text-sm text-[#cbd5e1] leading-relaxed">
                  We build custom multi-agent frameworks, proprietary LLM automation pipelines, and high-performance spatial digital products for market leaders.
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  onClick={() => scrollTo('overview')}
                  onMouseEnter={() => sound.playHover()}
                  className="glass-action-pill group cursor-pointer w-full sm:w-auto justify-center py-2 sm:py-3 text-xs"
                >
                  <span>Explore Solutions</span>
                  <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2: OVERVIEW */}
          <section
            id="overview"
            className="relative w-full py-14 sm:py-24 px-3 sm:px-12 lg:px-16 border-t border-white/5 scroll-mt-16 sm:scroll-mt-32"
          >
            <div className="max-w-6xl mx-auto flex flex-col gap-8 sm:gap-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-space text-[#ff0055] font-semibold mb-2.5 sm:mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] animate-pulse" />
                    <span>01 // SYSTEM OVERVIEW</span>
                  </div>
                  <h2 className="font-outfit text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    Cognitive Capabilities for{' '}
                    <span className="bg-gradient-to-r from-white via-[#e2e8f0] to-[#ff0055] bg-clip-text text-transparent">
                      Sovereign Scale.
                    </span>
                  </h2>
                </div>
                <p className="font-space text-xs sm:text-sm text-[#94a3b8] max-w-md leading-relaxed">
                  Deterministic multi-agent execution topologies deployed directly into zero-trust enterprise enclaves with rigorous mathematical verification.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                {CAPABILITIES.map((cap) => (
                  <div
                    key={cap.num}
                    onMouseEnter={() => sound.playHover()}
                    className="apple-glass-card p-5 sm:p-8 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-space text-[#94a3b8] mb-3 sm:mb-4">
                        <span className="font-bold tracking-widest text-[#ff0055]">
                          {cap.num} // ARCHITECTURE
                        </span>
                        <span className="text-white/40 font-mono-t">SYSTEM READY</span>
                      </div>

                      <h3 className="font-outfit text-lg sm:text-2xl font-black text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                        {cap.title}
                      </h3>
                      <div className="text-[10px] sm:text-[11px] font-space font-semibold tracking-wider text-[#cbd5e1] mb-3 sm:mb-4">
                        {cap.tag}
                      </div>

                      <p className="font-outfit text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-5 sm:mb-6">
                        {cap.desc}
                      </p>

                      <div className="space-y-2 mb-5 sm:mb-6">
                        <div className="text-[10px] font-space tracking-widest uppercase text-white/50">
                          Execution Specs:
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {cap.specs.map((s) => (
                            <span
                              key={s}
                              className="px-2 sm:px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-space text-[#e2e8f0]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-white/5 mb-3 sm:mb-4">
                        {cap.metrics.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-white/5 flex flex-col items-center text-center"
                          >
                            <span className="font-outfit font-black text-white text-xs sm:text-sm">
                              {m.val}
                            </span>
                            <span className="font-space text-[8px] sm:text-[9px] text-[#94a3b8] leading-tight mt-0.5">
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => scrollTo('solutions')}
                        className="w-full flex items-center justify-between pt-3 border-t border-white/10 text-xs font-outfit font-semibold text-white group-hover:text-[#ff0055] transition-colors cursor-pointer"
                      >
                        <span>View Platform Architecture</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: SOLUTIONS */}
          <section
            id="solutions"
            className="relative w-full py-14 sm:py-24 px-3 sm:px-12 lg:px-16 border-t border-white/5 scroll-mt-16 sm:scroll-mt-32"
          >
            <div className="max-w-6xl mx-auto flex flex-col gap-8 sm:gap-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-space text-[#ff0055] font-semibold mb-2.5 sm:mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] animate-pulse" />
                    <span>02 // ENTERPRISE PLATFORMS</span>
                  </div>
                  <h2 className="font-outfit text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    Production-Grade AI{' '}
                    <span className="bg-gradient-to-r from-white via-[#e2e8f0] to-[#ff0055] bg-clip-text text-transparent">
                      Workload Mesh.
                    </span>
                  </h2>
                </div>
                <p className="font-space text-xs sm:text-sm text-[#94a3b8] max-w-md leading-relaxed">
                  Turnkey sovereign intelligence modules battle-tested across financial, healthcare, and critical logistics workflows.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                {SOLUTIONS.map((sol) => (
                  <div
                    key={sol.code}
                    onMouseEnter={() => sound.playHover()}
                    className="apple-glass-card p-5 sm:p-8 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-space text-[#94a3b8] mb-3">
                        <span className="text-[#ff0055] font-bold tracking-wider">
                          {sol.code}
                        </span>
                        <span className="text-white/40 font-mono-t">{sol.category}</span>
                      </div>

                      <h3 className="font-outfit text-lg sm:text-2xl font-black text-white mb-2 sm:mb-3">
                        {sol.name}
                      </h3>

                      <p className="font-outfit text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mb-5 sm:mb-6">
                        {sol.summary}
                      </p>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                        {sol.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 sm:px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-space text-[#e2e8f0]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => scrollTo('architecture')}
                      className="w-full flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 text-xs font-outfit font-semibold text-white group-hover:text-[#ff0055] transition-colors cursor-pointer"
                    >
                      <span>Deploy to Enclave</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: ARCHITECTURE & CONSULTATION */}
          <section
            id="architecture"
            className="relative w-full py-14 sm:py-24 px-3 sm:px-12 lg:px-16 border-t border-white/5 scroll-mt-16 sm:scroll-mt-32"
          >
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 sm:gap-14">
              <div>
                <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-space text-[#ff0055] font-semibold mb-2.5 sm:mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] animate-pulse" />
                    <span>03 // MEASURED ENTERPRISE IMPACT</span>
                  </div>
                  <h2 className="font-outfit text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Deterministic Performance at Scale.
                  </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  {VERIFIED_METRICS.map((m, idx) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={idx}
                        className="apple-glass-card p-3.5 sm:p-6 flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-2 sm:mb-3 text-[#ff0055]">
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                          <div className="font-outfit text-xl sm:text-3xl font-black text-white mb-0.5 sm:mb-1">
                            {m.value}
                          </div>
                          <div className="font-outfit text-[11px] sm:text-sm font-bold text-[#e2e8f0] mb-0.5 sm:mb-1">
                            {m.label}
                          </div>
                        </div>
                        <div className="font-space text-[9px] sm:text-[11px] text-[#94a3b8] mt-1.5 pt-1.5 border-t border-white/5">
                          {m.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="apple-glass-card p-5 sm:p-12 relative overflow-hidden">
                <div className="text-center mb-6 sm:mb-10 relative z-10">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-space text-[#ff0055] font-semibold mb-2.5 sm:mb-3">
                    <Lock className="w-3 h-3 text-[#ff0055]" />
                    <span>CONFIDENTIAL ARCHITECTURE BRIEFING</span>
                  </div>
                  <h3 className="font-outfit text-lg sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                    Initialize Your Autonomous{' '}
                    <span className="bg-gradient-to-r from-white via-[#e2e8f0] to-[#ff0055] bg-clip-text text-transparent">
                      Enterprise Mesh.
                    </span>
                  </h3>
                  <p className="font-space text-[11px] sm:text-sm text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
                    Schedule a confidential briefing with Aetheris systems architects to design workload topology, fault tolerance, and compliance parameters.
                  </p>
                </div>

                {!booked ? (
                  <form onSubmit={handleSubmit} className="relative z-10 space-y-4 sm:space-y-6 font-space">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                      <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-1.5 sm:mb-2">
                          Executive Name & Title
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Elena Vance, VP of AI"
                          className="w-full px-3.5 py-2.5 sm:py-3.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#ff0055] transition-all font-outfit"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-1.5 sm:mb-2">
                          Corporate Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.vance@enterprise.com"
                          className="w-full px-3.5 py-2.5 sm:py-3.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#ff0055] transition-all font-outfit"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-1.5 sm:mb-2">
                        Target Autonomous Fleet Scale
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        {FLEET_SCALES.map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => {
                              setFleet(s);
                              sound.playClick();
                            }}
                            className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-[11px] sm:text-xs text-left transition-all border cursor-pointer ${
                              fleet === s
                                ? 'bg-[#ff0055]/15 border-[#ff0055] text-white shadow-[0_0_15px_rgba(255,0,85,0.3)] font-bold'
                                : 'bg-black/40 border-white/10 text-[#94a3b8] hover:border-white/20'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-1.5 sm:mb-2">
                        Preferred Infrastructure Target
                      </label>
                      <select
                        value={deploy}
                        onChange={(e) => setDeploy(e.target.value)}
                        className="w-full px-3.5 py-2.5 sm:py-3.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ff0055] transition-all font-outfit cursor-pointer"
                      >
                        {DEPLOY_TARGETS.map((t) => (
                          <option key={t} value={t} className="bg-[#08080c] text-white">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-1 sm:pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        onMouseEnter={() => sound.playHover()}
                        className="w-full py-3 sm:py-4 rounded-full font-outfit text-xs sm:text-sm font-bold tracking-wider uppercase bg-white hover:bg-[#ff0055] text-black hover:text-white shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,0,85,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Sparkles className="w-4 h-4 animate-spin text-inherit" />
                            <span>Authenticating Cluster Enclave...</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4 text-inherit" />
                            <span>Schedule Architecture Review</span>
                            <ArrowRight className="w-4 h-4 text-inherit" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="relative z-10 py-5 text-center space-y-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#ff0055]/15 border border-[#ff0055]/40 mx-auto flex items-center justify-center text-[#ff0055]">
                      <CheckCircle2 className="w-7 h-7 sm:w-9 sm:h-9" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff0055]/20 text-[#ff0055] text-xs font-semibold mb-2">
                        CONFIDENTIAL REVIEW DISPATCHED
                      </div>
                      <h3 className="font-outfit text-xl sm:text-3xl font-extrabold text-white">
                        Architecture Review Confirmed
                      </h3>
                      <p className="text-[#94a3b8] text-xs sm:text-sm max-w-md mx-auto mt-2 font-space">
                        Welcome to the mesh, <strong className="text-white">{name || 'Executive'}</strong>. A dedicated Autonomous Systems Architect has been provisioned.
                      </p>
                    </div>

                    <div className="max-w-md mx-auto p-3.5 sm:p-5 rounded-xl bg-black/60 border border-white/10 font-space text-xs text-left space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#94a3b8]">BOOKING REF:</span>
                        <span className="text-[#ff0055] font-bold">{bookingRef}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94a3b8]">CLEARANCE:</span>
                        <span className="text-white font-bold">LEVEL-4 SOVEREIGN</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94a3b8]">FLEET SCALE:</span>
                        <span className="text-white">{fleet}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94a3b8]">DISPATCH TO:</span>
                        <span className="text-white truncate max-w-[180px]">{email}</span>
                      </div>
                    </div>

                    <button
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-outfit text-white hover:text-[#ff0055] transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Configure Another Cluster</span>
                    </button>
                  </div>
                )}

                <div className="relative z-10 mt-6 sm:mt-10 pt-5 sm:pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center font-space text-xs text-[#94a3b8]">
                  {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff0055]" />
                      <span className="text-white font-bold text-[10px] sm:text-xs">{label}</span>
                      <span className="text-[9px] sm:text-[11px] text-[#94a3b8]">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="relative z-30 border-t border-white/5 py-6 sm:py-10 px-3 sm:px-12 bg-black/40 font-space text-xs text-[#94a3b8]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#ff0055] to-white p-[1px] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#08080c] flex items-center justify-center">
                    <span className="font-outfit font-black text-[9px] sm:text-[10px] text-white">Æ</span>
                  </div>
                </div>
                <div>
                  <div className="font-outfit text-[11px] sm:text-xs font-bold text-white tracking-[0.16em] uppercase">
                    AETHERIS SYSTEMS CORP.
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-[#94a3b8]">
                    Autonomous Digital Infrastructure © 2026
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] sm:text-xs text-[#cbd5e1]">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff0055] animate-pulse shadow-[0_0_8px_#ff0055]" />
                  <span className="text-white font-semibold">SOVEREIGN MESH ONLINE</span>
                </div>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="text-[#94a3b8]">UPTIME: 99.999%</span>
              </div>

              <button
                onClick={() => scrollTo('hero')}
                onMouseEnter={() => sound.playHover()}
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs font-outfit text-[#cbd5e1] hover:text-white transition-all cursor-pointer"
              >
                <span>ASCEND TO CORE</span>
                <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff0055]" />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}