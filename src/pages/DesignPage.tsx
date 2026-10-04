import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';

const CONSOLE_COLOR_RAMPS = [
  {
    name: 'Electric Cobalt (Primary)',
    desc: 'Main CTA triggers, highlighted nodes, active navigation',
    shades: [
      { label: 'dim', hex: '#b4c5ff' },
      { label: 'vivid', hex: '#3B82F6' },
      { label: 'core', hex: '#2563eb' },
      { label: 'container', hex: '#1d4ed8' },
      { label: 'deep', hex: '#002a78' },
    ],
  },
  {
    name: 'Operational Emerald (Secondary)',
    desc: 'Healthy system heartbeats, 99.9% uptime, verified pips',
    shades: [
      { label: 'light', hex: '#6ffbbe' },
      { label: 'active', hex: '#4edea3' },
      { label: 'core', hex: '#10B981' },
      { label: 'container', hex: '#00a572' },
      { label: 'deep', hex: '#003824' },
    ],
  },
  {
    name: 'Telemetry Amber (Status)',
    desc: 'Observation, latency warnings, metrics markers',
    shades: [
      { label: 'light', hex: '#fef3c7' },
      { label: 'bright', hex: '#fbbf24' },
      { label: 'core', hex: '#F59E0B' },
      { label: 'deep', hex: '#b45309' },
      { label: 'dark', hex: '#451a03' },
    ],
  },
  {
    name: 'Destructive Coral (Window)',
    desc: 'System close button, irreversible actions, errors',
    shades: [
      { label: 'light', hex: '#fee2e2' },
      { label: 'core', hex: '#EF4444' },
      { label: 'container', hex: '#dc2626' },
      { label: 'deep', hex: '#991b1b' },
      { label: 'dark', hex: '#450a0a' },
    ],
  },
  {
    name: 'Radiant Violet (Vibe & Prototyping)',
    desc: 'Creative experiments, vibe coding, ML tokens',
    shades: [
      { label: 'light', hex: '#e9ddff' },
      { label: 'fixed', hex: '#d0bcff' },
      { label: 'core', hex: '#8B5CF6' },
      { label: 'container', hex: '#7d4ce7' },
      { label: 'deep', hex: '#3c0091' },
    ],
  },
  {
    name: 'Surface Hierarchy (Dark Slate)',
    desc: 'Depth layering from canvas base to floating panels',
    shades: [
      { label: 'lowest', hex: '#060e20' },
      { label: 'canvas', hex: '#0b1326' },
      { label: 'low', hex: '#131b2e' },
      { label: 'container', hex: '#171f33' },
      { label: 'high', hex: '#222a3d' },
    ],
  },
];

export default function DesignPage() {
  useSEO({
    title: 'Design System & UI Tokens | Ojal Rathee',
    description:
      'Design tokens, color palette, surface hierarchy, and UI telemetry components of the Ojal Rathee (ojalrathee) portfolio system.',
    canonicalPath: '/design',
  });

  return (
    <div className="space-y-12 pb-16 transition-colors duration-200">
      {/* 1. Header */}
      <div className="relative rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-lg shadow-slate-200/50 dark:shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
            <span>/ DS</span>
            <span>DESIGN SYSTEM &amp; DESIGN TOKENS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
            Cloud Operator Console
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
            A precision-crafted visual language built for technical agency, telemetry ergonomics, and cloud engineering craftsmanship.
          </p>
        </div>
      </div>

      {/* 2. Color System */}
      <section className="space-y-6">
        <div>
          <span className="font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
            TOKENS // 01
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">Color Architecture</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CONSOLE_COLOR_RAMPS.map((ramp) => (
            <div
              key={ramp.name}
              className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#131b2e] p-5 space-y-3 shadow-sm"
            >
              <div>
                <p className="font-mono text-xs font-bold text-slate-900 dark:text-[#dae2fd]">{ramp.name}</p>
                <p className="text-xs text-slate-500 dark:text-[#64748B] mt-0.5">{ramp.desc}</p>
              </div>

              <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
                {ramp.shades.map((shade) => (
                  <div key={shade.label} className="flex-1">
                    <div className="h-14" style={{ backgroundColor: shade.hex }} />
                    <div className="bg-slate-100 dark:bg-[#060e20] border-t border-slate-200 dark:border-white/[0.06] px-1 py-1.5 text-center">
                      <p className="font-mono text-[9px] font-bold text-slate-600 dark:text-[#64748B] truncate">
                        {shade.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Typography Hierarchy */}
      <section className="space-y-6">
        <div>
          <span className="font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
            TOKENS // 02
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">Typography Hierarchy</h2>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#131b2e] p-6 sm:p-8 shadow-sm">
          <div className="pb-4 border-b border-slate-200 dark:border-white/[0.06]">
            <p className="font-mono text-xs text-slate-500 dark:text-[#64748B] uppercase tracking-wider mb-1">
              DISPLAY 48PX / BOLD
            </p>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-[#dae2fd]">
              Distributed Core Architecture
            </p>
          </div>

          <div className="pb-4 border-b border-slate-200 dark:border-white/[0.06]">
            <p className="font-mono text-xs text-slate-500 dark:text-[#64748B] uppercase tracking-wider mb-1">
              HEADING 24PX / SEMIBOLD
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">
              Infrastructure as Code &amp; Edge Delivery
            </p>
          </div>

          <div className="pb-4 border-b border-slate-200 dark:border-white/[0.06]">
            <p className="font-mono text-xs text-slate-500 dark:text-[#64748B] uppercase tracking-wider mb-1">
              BODY 16PX / REGULAR
            </p>
            <p className="text-base text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
              Precision-engineered systems designed for maximum resiliency, low operational overhead, and scalable performance.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs text-slate-500 dark:text-[#64748B] uppercase tracking-wider mb-1">
              MONOSPACE TELEMETRY 12PX
            </p>
            <p className="font-mono text-xs text-[#2563eb] dark:text-[#3B82F6]">
              STATUS // HEALTH_OK (NODE_01: 99.995% UPTIME)
            </p>
          </div>
        </div>
      </section>

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#2563eb] dark:text-[#64748B] dark:hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Home Overview</span>
        </Link>
      </div>
    </div>
  );
}
