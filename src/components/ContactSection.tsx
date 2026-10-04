import { useState } from 'react';
import {
  Mail,
  MapPin,
  Briefcase,
  Copy,
  Check,
  Download,
  ExternalLink,
} from 'lucide-react';
import ContactForm from './ContactForm';
import resumePDF from '@/assets/ojal_rathee_resume.pdf';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = 'ojalrathee.working@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-10 pb-16 transition-colors duration-200">
      {/* 1. Header / Console Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-[#131b2e]/80 border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-2xl p-6 sm:p-8 md:p-10">
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#4edea3]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Telemetry Subheader Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 bg-slate-50 dark:bg-[#171f33]/40 border border-slate-200 dark:border-white/[0.04] rounded-2xl px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#2563eb] dark:text-[#3B82F6]">/ 03</span>
            <span className="text-slate-300 dark:text-white/20">•</span>
            <span className="tracking-widest text-slate-500 dark:text-[#64748B] uppercase">
              SYS_DISPATCH // INCOMING CHANNEL
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              <span className="text-[#00a572] dark:text-[#4edea3] font-bold">SECURE CHANNEL</span>
            </div>
            <span className="text-slate-400 dark:text-[#64748B] hidden sm:inline">&lt;24H RESPONSE SLA</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
              <span>/ 03</span>
              <span>COMMUNICATION PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
              Message Me
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
              Have a cloud architecture challenge, job opportunity, or just want to connect? Send a note below or reach out via email.
            </p>
          </div>

          {/* Metric micro-stats ribbon */}
          <div className="flex items-center gap-4 bg-slate-100 dark:bg-[#222a3d]/60 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md rounded-2xl p-2.5 self-start lg:self-auto">
            <div className="px-4 py-1 text-left">
              <div className="font-mono text-[10px] text-slate-500 dark:text-[#64748B] uppercase">TYPICAL RESPONSE</div>
              <div className="text-sm sm:text-base font-bold text-[#00a572] dark:text-[#4edea3] mt-0.5">
                &lt; 24 HOURS
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-white/10" />
            <div className="px-4 py-1 text-left">
              <div className="font-mono text-[10px] text-slate-500 dark:text-[#64748B] uppercase">TIMEZONE</div>
              <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-[#dae2fd] mt-0.5">
                UTC+05:30
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Contact Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Contact & Status Info (5 Columns) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* 1. Email Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#171f33]/70 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md p-6 transition-all duration-300 hover:border-blue-300 dark:hover:bg-[#222a3d] shadow-sm dark:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#2563eb]/20 border border-blue-200 dark:border-[#2563eb]/30 flex items-center justify-center text-[#2563eb] dark:text-[#3B82F6] group-hover:scale-110 group-hover:bg-[#2563eb] group-hover:text-white transition-all shadow-sm">
                  <Mail size={22} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-[#64748B] tracking-wider uppercase">
                      EMAIL ADDRESS
                    </span>
                    <span className="font-mono text-[10px] text-[#00a572] dark:text-[#4edea3] flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> DIRECT
                    </span>
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="block text-sm sm:text-base font-bold text-slate-900 dark:text-[#dae2fd] hover:text-[#2563eb] dark:hover:text-[#3B82F6] transition-colors truncate"
                  >
                    {email}
                  </a>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-[#2563eb] dark:text-[#3B82F6] hover:underline transition-colors cursor-pointer"
                    >
                      {copied ? <Check size={13} className="text-[#10B981]" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied to clipboard!' : 'Copy to clipboard'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Location Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#171f33]/70 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md p-6 transition-all duration-300 hover:border-blue-300 dark:hover:bg-[#222a3d] shadow-sm dark:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#3B82F6]/20 border border-blue-200 dark:border-[#3B82F6]/30 flex items-center justify-center text-[#2563eb] dark:text-[#3B82F6] group-hover:scale-110 group-hover:bg-[#2563eb] group-hover:text-white transition-all shadow-sm">
                  <MapPin size={22} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-[#64748B] tracking-wider uppercase">
                      LOCATION
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B]">GEO // ASIA-IN</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#dae2fd]">
                    India · Open to Remote Globally
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#c3c6d7]">
                    Available across IST, UTC, and US business hours overlap.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Availability Status Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#171f33]/70 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md p-6 transition-all duration-300 hover:border-emerald-300 dark:hover:bg-[#222a3d] shadow-sm dark:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 dark:bg-[#00a572]/20 border border-emerald-200 dark:border-[#00a572]/30 flex items-center justify-center text-[#00a572] dark:text-[#4edea3] group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-white transition-all shadow-sm">
                  <Briefcase size={22} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-[#64748B] tracking-wider uppercase">
                      STATUS
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#00a572] dark:text-[#4edea3] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                      AVAILABLE
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#dae2fd]">
                    Open for Opportunities
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#c3c6d7]">
                    Seeking Cloud Engineering, DevOps, and Full-Stack roles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Official CV Banner */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/[0.08] p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-mono text-[10px] text-slate-400 dark:text-[#64748B] uppercase">CURRICULUM VITAE</div>
              <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-[#dae2fd]">
                Ojal Rathee Resume (PDF)
              </div>
            </div>
            <a
              href={resumePDF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all flex-shrink-0"
            >
              <Download size={13} />
              <span>Download</span>
              <ExternalLink size={11} className="opacity-70" />
            </a>
          </div>
        </div>

        {/* Right Column: Console Contact Form (7 Columns) */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] shadow-lg shadow-slate-200/50 dark:shadow-2xl overflow-hidden p-6 sm:p-8">
            {/* Header window controls */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="font-mono text-xs text-slate-400 dark:text-[#64748B] ml-2">
                  dispatch_form.ts
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#2563eb] dark:text-[#3B82F6] font-bold">
                POST /v1/messages
              </span>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
