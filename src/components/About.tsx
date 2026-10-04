import { Link } from 'react-router-dom';
import {
  Cloud,
  Database,
  Terminal,
  GitBranch,
  ShieldCheck,
  Zap,
  GraduationCap,
  Cpu,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import profilePhoto from '@/assets/desktop_magic.png';
import { useResume } from '@/hooks/useResume';

export default function About() {
  const { entries } = useResume();

  const competencies = [
    {
      code: '01 / AWS',
      label: 'Cloud Architecture',
      desc: 'AWS, VPC networking, IAM security, and serverless infrastructure design with high availability.',
      tags: ['AWS', 'VPC', 'CloudWatch', 'IAM'],
      icon: Cloud,
      color: 'text-[#2563eb] dark:text-[#3B82F6] bg-blue-50 dark:bg-[#3B82F6]/10 border-blue-200 dark:border-[#3B82F6]/20',
      hoverGlow: 'hover:shadow-[0_12px_30px_-10px_rgba(59,130,246,0.25)]',
    },
    {
      code: '02 / SRV',
      label: 'Serverless Systems',
      desc: 'AWS Lambda, API Gateway, and DynamoDB event-driven architectures with low latency.',
      tags: ['Lambda', 'DynamoDB', 'EventBridge'],
      icon: Database,
      color: 'text-[#00a572] dark:text-[#4edea3] bg-emerald-50 dark:bg-[#00a572]/15 border-emerald-200 dark:border-[#00a572]/20',
      hoverGlow: 'hover:shadow-[0_12px_30px_-10px_rgba(78,222,163,0.25)]',
    },
    {
      code: '03 / UI',
      label: 'Full-Stack Development',
      desc: 'React, TypeScript, and Tailwind CSS for responsive, production-ready web interfaces.',
      tags: ['React', 'TypeScript', 'Tailwind'],
      icon: Terminal,
      color: 'text-[#7d4ce7] dark:text-[#d0bcff] bg-purple-50 dark:bg-[#7d4ce7]/20 border-purple-200 dark:border-[#7d4ce7]/25',
      hoverGlow: 'hover:shadow-[0_12px_30px_-10px_rgba(125,76,231,0.25)]',
    },
    {
      code: '04 / OPS',
      label: 'CI/CD & Automation',
      desc: 'GitHub Actions automated pipelines, static site deployments, and Terraform infrastructure-as-code.',
      tags: ['Terraform', 'GitHub Actions', 'S3'],
      icon: GitBranch,
      color: 'text-[#2563eb] dark:text-[#3B82F6] bg-blue-50 dark:bg-[#2563eb]/20 border-blue-200 dark:border-[#2563eb]/25',
      hoverGlow: 'hover:shadow-[0_12px_30px_-10px_rgba(37,99,235,0.25)]',
    },
    {
      code: '05 / NET',
      label: 'Computer Networking',
      desc: 'TCP/IP, DNS, subnetting, routing tables, and secure cloud perimeter controls.',
      tags: ['TCP/IP', 'DNS', 'Subnets', 'Security Groups'],
      icon: ShieldCheck,
      color: 'text-[#10B981] bg-emerald-50 dark:bg-[#10B981]/15 border-emerald-200 dark:border-[#10B981]/20',
      hoverGlow: 'hover:shadow-[0_12px_30px_-10px_rgba(16,185,129,0.25)]',
    },
    {
      code: '06 / PERF',
      label: 'Performance & Edge CDN',
      desc: 'CloudFront caching, latency optimization, asset bundling, and proactive monitoring.',
      tags: ['CloudFront', 'Route 53', 'Monitoring'],
      icon: Zap,
      color: 'text-[#F59E0B] bg-amber-50 dark:bg-[#F59E0B]/15 border-amber-200 dark:border-[#F59E0B]/20',
      hoverGlow: 'hover:shadow-[0_12px_30px_-10px_rgba(245,158,11,0.25)]',
    },
  ];

  // Dynamic experience items from database (falling back gracefully to real Ojal Rathee data)
  const experienceEntries = entries.filter((e) => e.category === 'Experience');
  const displayExperience =
    experienceEntries.length > 0
      ? experienceEntries.map((e, idx) => ({
          role: e.title,
          type: e.organization || 'Project',
          badge: idx === 0 ? 'CURRENT ROLE' : undefined,
          period: e.start_date ? `${e.start_date} — ${e.end_date || 'Present'}` : 'Present',
          desc: e.description,
          tags: ['AWS', 'TypeScript', 'Serverless', 'React'],
          active: idx === 0,
        }))
      : [
          {
            role: 'Cloud Engineering Intern',
            type: 'AWS Learning & Freelance Projects',
            badge: 'CURRENT ROLE',
            period: '2025 — PRESENT',
            desc: 'Designing serverless applications, documenting cloud architecture, and practicing infrastructure automation as a final-year BCA student.',
            tags: ['AWS Lambda', 'Terraform', 'DynamoDB', 'S3'],
            active: true,
          },
          {
            role: 'Frontend Developer',
            type: 'Academic and Personal Projects',
            period: '2024 — PRESENT',
            desc: 'Building responsive portfolio experiences and JavaScript applications with a focus on clear UX, clean architecture, and maintainable code.',
            tags: ['React', 'TypeScript', 'Tailwind CSS'],
            active: false,
          },
        ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero / Profile Identity Overview Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-[#131b2e]/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 border border-slate-200 dark:border-white/[0.08] shadow-lg shadow-slate-200/50 dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-colors duration-200">
        {/* Ambient Glow Accents */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#2563eb]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#00a572]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Avatar & Title info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#10B981] opacity-30 group-hover:opacity-75 blur-sm transition-all duration-500" />
              <img
                src={profilePhoto}
                alt="Ojal Rathee (ojalrathee) - Cloud Software Engineer & Systems Architect"
                title="Ojal Rathee (ojalrathee)"
                width={112}
                height={112}
                fetchPriority="high"
                loading="eager"
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-xl ring-1 ring-slate-200 dark:ring-white/10"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-[#060e20] flex items-center justify-center shadow-sm">
                <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-[11px] font-bold text-[#2563eb] dark:text-[#b4c5ff] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#2563eb]/20 border border-blue-200 dark:border-[#2563eb]/30">
                  OPERATOR // 01
                </span>
                <span className="font-mono text-[11px] text-[#00a572] dark:text-[#4edea3] flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  NODE ACTIVE
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight">
                Ojal <span className="text-slate-500 dark:text-[#c3c6d7] font-medium">Rathee</span>
              </h1>
              <p className="text-base sm:text-lg font-semibold text-[#2563eb] dark:text-[#b4c5ff]">
                Cloud Software Engineer &amp; Systems Architect
              </p>
            </div>
          </div>

          {/* Telemetry HUD Matrix */}
          <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#171f33]/70 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md">
            <div className="space-y-1">
              <div className="font-mono text-[11px] text-slate-500 dark:text-[#64748B] tracking-wider uppercase">
                STATUS
              </div>
              <div className="text-sm font-bold text-[#10B981] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Available
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-[11px] text-slate-500 dark:text-[#64748B] tracking-wider uppercase">
                LOCATION
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-[#dae2fd]">
                GMT+5:30 · IN
              </div>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <div className="font-mono text-[11px] text-slate-500 dark:text-[#64748B] tracking-wider uppercase">
                DISPATCH
              </div>
              <div className="text-sm font-bold text-[#2563eb] dark:text-[#3B82F6]">
                &lt; 24h SLA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Editorial Synopsis & Intro */}
      <div className="space-y-3 max-w-4xl">
        <div className="flex items-center gap-2 font-mono text-[12px] font-bold text-[#2563eb] dark:text-[#3B82F6]">
          <span>/ 01</span>
          <span className="text-slate-400 dark:text-[#64748B] tracking-widest uppercase">SYNOPSIS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight">
          About Me
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
          I'm a final-year BCA student and cloud software engineer specializing in building scalable,
          resilient, and cost-efficient systems on AWS. I design serverless architectures, write modern
          code in TypeScript and React, and automate continuous integration and deployment with
          GitHub Actions and Terraform.
        </p>
      </div>

      {/* 3. Live Telemetry KPI Metrics Banner (Clean, Real Profile Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e]/70 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md flex flex-col justify-between group hover:border-blue-300 dark:hover:bg-[#171f33]/80 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-[#64748B] mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider">Education</span>
            <GraduationCap size={18} className="text-[#2563eb] dark:text-[#3B82F6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight group-hover:text-[#2563eb] dark:group-hover:text-[#b4c5ff] transition-colors">
            BCA
          </div>
          <div className="font-mono text-[11px] text-slate-500 dark:text-[#64748B] mt-1">Final-year student</div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e]/70 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md flex flex-col justify-between group hover:border-emerald-300 dark:hover:bg-[#171f33]/80 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-[#64748B] mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider">Specialization</span>
            <Cloud size={18} className="text-[#10B981]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight group-hover:text-[#10B981] dark:group-hover:text-[#4edea3] transition-colors">
            AWS
          </div>
          <div className="font-mono text-[11px] text-slate-500 dark:text-[#64748B] mt-1">Cloud &amp; Serverless</div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e]/70 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md flex flex-col justify-between group hover:border-purple-300 dark:hover:bg-[#171f33]/80 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-[#64748B] mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider">Frontend Stack</span>
            <Cpu size={18} className="text-[#7d4ce7] dark:text-[#d0bcff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight group-hover:text-[#7d4ce7] dark:group-hover:text-[#d0bcff] transition-colors">
            React
          </div>
          <div className="font-mono text-[11px] text-slate-500 dark:text-[#64748B] mt-1">TypeScript &amp; Tailwind</div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e]/70 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md flex flex-col justify-between group hover:border-amber-300 dark:hover:bg-[#171f33]/80 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-[#64748B] mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider">Availability</span>
            <CheckCircle2 size={18} className="text-[#F59E0B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight group-hover:text-[#F59E0B] transition-colors">
            Open
          </div>
          <div className="font-mono text-[11px] text-slate-500 dark:text-[#64748B] mt-1">Full-time &amp; Internships</div>
        </div>
      </div>

      {/* 4. Core Architecture Competencies (3x2 Grid) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
              PILLARS // 06
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">
              Core Architecture Competencies
            </h3>
          </div>
          <span className="font-mono text-[11px] text-slate-400 dark:text-[#64748B] hidden sm:block uppercase tracking-wider">
            SYSTEM RUNTIME CAPABILITIES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competencies.map((comp) => {
            const Icon = comp.icon;
            return (
              <div
                key={comp.code}
                className={`group relative rounded-2xl bg-white dark:bg-[#131b2e]/90 backdrop-blur-md p-6 border border-slate-200 dark:border-white/[0.06] hover:bg-slate-50/80 dark:hover:bg-[#171f33] transition-all duration-300 shadow-sm dark:shadow-lg hover:-translate-y-1 ${comp.hoverGlow}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform ${comp.color}`}>
                    <Icon size={22} />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-[#64748B] group-hover:text-slate-700 dark:group-hover:text-white transition-colors">
                    {comp.code}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-[#dae2fd] group-hover:text-[#2563eb] dark:group-hover:text-white transition-colors mb-2">
                  {comp.label}
                </h4>

                <p className="text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed mb-4">
                  {comp.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {comp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#171f33] border border-slate-200/80 dark:border-white/[0.04] text-slate-700 dark:text-[#c3c6d7]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Career Experience Sequence (Connected to Real Resume Database Entries) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
              CHRONOLOGY // LOGS
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">
              Experience
            </h3>
          </div>
          <div className="font-mono text-[11px] text-slate-400 dark:text-[#64748B]">
            SORT: DESCENDING
          </div>
        </div>

        <div className="space-y-4">
          {displayExperience.map((node, i) => (
            <div
              key={`${node.period}-${i}`}
              className="group relative rounded-2xl bg-white dark:bg-[#131b2e]/80 backdrop-blur-md p-5 sm:p-6 border border-slate-200 dark:border-white/[0.06] hover:bg-slate-50/80 dark:hover:bg-[#171f33] transition-all duration-300 shadow-sm dark:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      node.active
                        ? 'bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                        : 'bg-slate-300 dark:bg-[#64748B] group-hover:bg-[#2563eb] dark:group-hover:bg-[#3B82F6] transition-colors'
                    }`}
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-base text-slate-900 dark:text-[#dae2fd]">
                        {node.role}
                      </span>
                      <span className="text-slate-300 dark:text-[#64748B]">•</span>
                      <span className="text-sm font-medium text-[#00a572] dark:text-[#4edea3]">
                        {node.type}
                      </span>
                      {node.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[#00a572]/20 border border-emerald-200 dark:border-[#00a572]/30 text-[#00a572] dark:text-[#4edea3] font-mono text-[10px] font-bold">
                          {node.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed max-w-3xl">
                      {node.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {node.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-slate-100 dark:bg-[#171f33] border border-slate-200/80 dark:border-white/[0.04] text-[#2563eb] dark:text-[#3B82F6]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={`font-mono text-xs px-3 py-1.5 rounded-lg whitespace-nowrap self-start ${
                    node.active
                      ? 'bg-blue-50 dark:bg-[#2563eb]/20 text-[#2563eb] dark:text-[#3B82F6] border border-blue-200 dark:border-[#2563eb]/30 font-bold'
                      : 'bg-slate-100 dark:bg-[#171f33] text-slate-500 dark:text-[#64748B]'
                  }`}
                >
                  {node.period}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Active Terminal Telemetry Quick Link Box */}
      <div className="rounded-2xl bg-slate-900 dark:bg-[#060e20]/90 border border-slate-800 dark:border-white/[0.08] backdrop-blur-md p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 pl-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          </div>
          <div className="font-mono text-xs sm:text-sm text-slate-300 dark:text-[#c3c6d7]">
            <span className="text-[#4edea3]">ojal@cloud:~$</span>{' '}
            <span className="text-white dark:text-[#dae2fd]">cat profile.json | jq '.competencies'</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            to="/terminal"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-[#171f33] dark:hover:bg-[#222a3d] border border-slate-700 dark:border-white/[0.06] text-white dark:text-[#dae2fd] text-xs sm:text-sm font-semibold transition-all"
          >
            <Terminal size={16} />
            <span>Open Shell</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs sm:text-sm font-bold shadow-[0_0_12px_rgba(37,99,235,0.4)] hover:brightness-110 transition-all"
          >
            <Mail size={16} />
            <span>Contact Me</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
