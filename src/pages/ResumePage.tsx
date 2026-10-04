import {
  Briefcase,
  GraduationCap,
  Cpu,
  Wrench,
  Download,
  ExternalLink,
} from 'lucide-react';
import { useResume, RESUME_CATEGORIES, type ResumeCategory, type ResumeEntry } from '@/hooks/useResume';
import resumePDF from '@/assets/ojal_rathee_resume.pdf';
import { useSEO } from '@/hooks/useSEO';

const CATEGORY_META: Record<
  ResumeCategory,
  { icon: typeof Briefcase; label: string; code: string; color: string; bg: string }
> = {
  Experience: {
    icon: Briefcase,
    label: 'Experience',
    code: '01 / EXP',
    color: 'text-[#2563eb] dark:text-[#3B82F6]',
    bg: 'bg-blue-50 dark:bg-[#2563eb]/15 border-blue-200 dark:border-[#2563eb]/25',
  },
  Education: {
    icon: GraduationCap,
    label: 'Education',
    code: '02 / EDU',
    color: 'text-[#00a572] dark:text-[#10B981]',
    bg: 'bg-emerald-50 dark:bg-[#10B981]/15 border-emerald-200 dark:border-[#10B981]/25',
  },
  'Core Competency': {
    icon: Cpu,
    label: 'Core Competency',
    code: '03 / SKL',
    color: 'text-[#7d4ce7] dark:text-[#d0bcff]',
    bg: 'bg-purple-50 dark:bg-[#7d4ce7]/20 border-purple-200 dark:border-[#7d4ce7]/25',
  },
  Tools: {
    icon: Wrench,
    label: 'Tools & Technologies',
    code: '04 / TLS',
    color: 'text-[#F59E0B]',
    bg: 'bg-amber-50 dark:bg-[#F59E0B]/15 border-amber-200 dark:border-[#F59E0B]/25',
  },
};

export default function ResumePage() {
  const { entries, loading, error } = useResume();

  useSEO({
    title: 'Resume & Cloud Credentials | Ojal Rathee (ojalrathee)',
    description:
      'Official resume, AWS cloud credentials, technical competencies, and software engineering experience of Ojal Rathee (ojalrathee).',
    canonicalPath: '/resume',
    keywords:
      'Ojal Rathee resume, ojalrathee CV, cloud software engineer resume, AWS credentials, dev.ojalrathee.com',
  });


  return (
    <div className="space-y-10 pb-16 transition-colors duration-200">
      {/* 1. Header / Spec Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-[#131b2e]/80 border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-lg shadow-slate-200/50 dark:shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
              <span>/ SPEC</span>
              <span>TECHNICAL SPECIFICATION &amp; RESUME</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
              Resume &amp; Credentials
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
              Final-year BCA student specializing in AWS Cloud Architecture, Computer Networking, and modern JavaScript development.
            </p>
          </div>

          <a
            href={resumePDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:brightness-110 transition-all self-start md:self-auto"
          >
            <Download size={18} />
            <span>Download Official PDF</span>
            <ExternalLink size={13} className="opacity-70" />
          </a>
        </div>
      </div>

      {loading && (
        <div className="p-8 text-center font-mono text-sm text-slate-500 dark:text-[#64748B]">
          Streaming resume specification nodes…
        </div>
      )}

      {error && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-mono text-sm">
          Failed to load resume: {error}
        </div>
      )}

      {/* 2. Sections Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {RESUME_CATEGORIES.map((category) => {
            const meta = CATEGORY_META[category];
            const Icon = meta.icon;
            const items = entries.filter((e) => e.category === category);

            return (
              <section
                key={category}
                className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 shadow-sm dark:shadow-xl space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${meta.bg} ${meta.color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 dark:text-[#64748B] tracking-wider uppercase">
                          {meta.code}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-[#dae2fd]">
                          {meta.label}
                        </h2>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-slate-400 dark:text-[#64748B]">
                      {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
                    </span>
                  </div>

                  {/* Items List */}
                  {items.length === 0 ? (
                    <p className="font-mono text-xs text-slate-400 dark:text-[#64748B] italic py-4">
                      No records indexed in this category.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <ResumeItemCard key={item.id} entry={item} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 text-right">
                  <span className="font-mono text-[10px] text-slate-400 dark:text-[#64748B] uppercase">
                    DATA REGISTRY VERIFIED
                  </span>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResumeItemCard({ entry }: { entry: ResumeEntry }) {
  const hasTimeline = entry.start_date || entry.end_date;

  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-[#171f33]/60 border border-slate-200/80 dark:border-white/[0.04] p-4 sm:p-5 space-y-2 hover:border-slate-300 dark:hover:border-white/[0.08] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-[#dae2fd]">
          {entry.title}
        </h3>
        {hasTimeline && (
          <span className="font-mono text-[11px] text-[#2563eb] dark:text-[#3B82F6] font-bold self-start sm:self-auto px-2 py-0.5 rounded bg-blue-50 dark:bg-[#2563eb]/20 border border-blue-200 dark:border-[#2563eb]/30">
            {entry.start_date} {entry.end_date ? `— ${entry.end_date}` : ''}
          </span>
        )}
      </div>

      {entry.organization && (
        <div className="text-xs font-semibold text-[#00a572] dark:text-[#4edea3]">
          {entry.organization}
        </div>
      )}

      {entry.description && (
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed pt-1">
          {entry.description}
        </p>
      )}
    </div>
  );
}
