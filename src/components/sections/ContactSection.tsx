'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar, ShieldCheck, CheckCircle2, Lock, ArrowRight,
  Server, FileText, Sparkles, RotateCcw, TrendingUp, Cpu, Database
} from 'lucide-react';
import { sound } from '@/lib/sound';

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

const VERIFIED_METRICS = [
  { icon: ShieldCheck, value: '99.98%', label: 'Agent Fault Tolerance', sub: 'Autonomous self-healing across nodes' },
  { icon: TrendingUp, value: '4.2×', label: 'Pipeline Throughput Gain', sub: 'Measured on sovereign LLM clusters' },
  { icon: Cpu, value: '$14.8M', label: 'Capital Saved Across Fleets', sub: 'Annualized enterprise infrastructure savings' },
  { icon: Database, value: '< 12ms', label: 'Global Synapse Latency', sub: 'Direct vector memory fabric sync' },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'SOC2 TYPE II', sub: 'Continuous Audit' },
  { icon: Lock, label: 'ISO 27001', sub: 'Certified Enclaves' },
  { icon: Server, label: '99.999% SLA', sub: 'Financial Grade' },
  { icon: FileText, label: 'FIPS 140-3', sub: 'Hardware Validated' },
];

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fleet, setFleet] = useState(FLEET_SCALES[1]);
  const [deploy, setDeploy] = useState(DEPLOY_TARGETS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

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
          particleCount: 90,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#ff007f', '#ffffff', '#e2e8f0', '#94a3b8'],
        });
      } catch {
        // fallback
      }
    }, 1200);
  };

  const reset = () => {
    sound.playClick();
    setBooked(false);
    setName('');
    setEmail('');
  };

  return (
    <section
      id="contact-section"
      className="relative w-full py-32 px-6 sm:px-10 lg:px-16 bg-transparent z-30 border-t border-white/5"
    >
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-16">
        {/* ── HIGH-VALUE VERIFIED IMPACT METRICS ── */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full pill-container-glass text-[11px] font-space text-[#ff007f] font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff007f] animate-pulse" />
              <span>MEASURED ENTERPRISE IMPACT</span>
            </div>
            <h2 className="font-outfit text-2xl sm:text-4xl font-black text-white tracking-tight">
              Deterministic Performance at Scale.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VERIFIED_METRICS.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="executive-card p-6 flex flex-col justify-between border-white/10 hover:border-[#ff007f]/40 transition-all"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 text-[#ff007f]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-outfit text-3xl sm:text-4xl font-black text-white mb-1">
                      {m.value}
                    </div>
                    <div className="font-outfit text-sm font-bold text-[#e2e8f0] mb-1">
                      {m.label}
                    </div>
                  </div>
                  <div className="font-space text-xs text-[#94a3b8] mt-3 pt-3 border-t border-white/5">
                    {m.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CONSULTATION & ARCHITECTURE REVIEW CARD ── */}
        <div className="relative executive-card p-8 sm:p-12 overflow-hidden border-white/15">
          {/* Subtle Ambient Backlight (Neon Rose 10% Accent) */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Header */}
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full pill-container-glass text-[11px] font-space text-[#ff007f] font-semibold mb-3">
              <Lock className="w-3 h-3 text-[#ff007f]" />
              <span>ENTERPRISE CONSULTATION // ARCHITECTURE REVIEW</span>
            </div>
            <h3 className="font-outfit text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
              Initialize Your Autonomous{' '}
              <span className="bg-gradient-to-r from-white via-[#e2e8f0] to-[#ff007f] bg-clip-text text-transparent">
                Enterprise Mesh.
              </span>
            </h3>
            <p className="font-space text-sm text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
              Schedule a confidential architecture briefing with Aetheris systems architects to design workload topology, fault tolerance, and compliance parameters.
            </p>
          </div>

          {!booked ? (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6 font-space">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-2">
                    Executive Name &amp; Title
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Vance, VP of AI Infrastructure"
                    className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff007f] focus:ring-1 focus:ring-[#ff007f]/50 transition-all font-outfit"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-2">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.vance@enterprise.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff007f] focus:ring-1 focus:ring-[#ff007f]/50 transition-all font-outfit"
                  />
                </div>
              </div>

              {/* Fleet Scale Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-2">
                  Target Autonomous Fleet Scale
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {FLEET_SCALES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => {
                        setFleet(s);
                        sound.playClick();
                      }}
                      className={`px-4 py-3 rounded-xl text-xs text-left transition-all border cursor-pointer ${
                        fleet === s
                          ? 'bg-[#ff007f]/15 border-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.3)] font-bold'
                          : 'bg-black/40 border-white/10 text-[#94a3b8] hover:border-white/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deployment Environment */}
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-2">
                  Preferred Infrastructure Target
                </label>
                <select
                  value={deploy}
                  onChange={(e) => setDeploy(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff007f] transition-all font-outfit cursor-pointer"
                >
                  {DEPLOY_TARGETS.map((t) => (
                    <option key={t} value={t} className="bg-[#050508] text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  onMouseEnter={() => sound.playHover()}
                  className="w-full py-4 rounded-full font-outfit text-sm font-bold tracking-wider uppercase bg-white hover:bg-[#ff007f] text-black hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_45px_rgba(255,0,127,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
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
            /* Confirmed Booking State */
            <div className="relative z-10 py-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#ff007f]/15 border border-[#ff007f]/40 mx-auto flex items-center justify-center text-[#ff007f] shadow-[0_0_25px_rgba(255,0,127,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff007f]/20 text-[#ff007f] text-xs font-semibold mb-2">
                  CONFIDENTIAL REVIEW DISPATCHED
                </div>
                <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-white">
                  Architecture Review Confirmed
                </h3>
                <p className="text-[#94a3b8] text-sm max-w-md mx-auto mt-2 font-space">
                  Welcome to the mesh, <strong className="text-white">{name || 'Executive'}</strong>. A dedicated Autonomous Systems Architect has been provisioned.
                </p>
              </div>

              <div className="max-w-md mx-auto p-5 rounded-xl bg-black/60 border border-white/10 font-space text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">BOOKING REF:</span>
                  <span className="text-[#ff007f] font-bold">{bookingRef}</span>
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
                  <span className="text-white truncate max-w-[200px]">{email}</span>
                </div>
              </div>

              <button
                onClick={reset}
                className="px-6 py-2.5 rounded-full pill-container-glass text-xs font-outfit text-white hover:text-[#ff007f] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Configure Another Cluster</span>
              </button>
            </div>
          )}

          {/* Compliance & Trust Badges */}
          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-space text-xs text-[#94a3b8]">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-4 h-4 text-[#ff007f]" />
                <span className="text-white font-bold">{label}</span>
                <span className="text-[11px] text-[#94a3b8]">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
