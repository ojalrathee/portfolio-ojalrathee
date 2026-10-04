import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Terminal,
  Award,
  ShieldCheck,
  Code2,
  ExternalLink,
  ArrowUpRight,
  Key,
} from 'lucide-react';
import { useProjects, type Project } from '@/hooks/useProjects';
import { useCertifications, type Certification } from '@/hooks/useCertifications';
import { useBadges, type Badge } from '@/hooks/useBadges';
import { useVibeCoding, type VibeCoding } from '@/hooks/useVibeCoding';
import { sanitizeHref } from '@/lib/url';

type FilterCategory = 'All' | 'Projects' | 'Certifications' | 'Badges' | 'Vibe Coding';

export default function FeaturedProjects() {
  const { projects, loading: lp, error: ep } = useProjects();
  const { certifications, loading: lc, error: ec } = useCertifications();
  const { badges, loading: lb, error: eb } = useBadges();
  const { items: vibeCoding, loading: lv, error: ev } = useVibeCoding();

  const [activeTab, setActiveTab] = useState<FilterCategory>('All');

  const loading = lp || lc || lb || lv;
  const error = ep ?? ec ?? eb ?? ev;

  const counts: Record<FilterCategory, number> = {
    All: projects.length + certifications.length + badges.length + vibeCoding.length,
    Projects: projects.length,
    Certifications: certifications.length,
    Badges: badges.length,
    'Vibe Coding': vibeCoding.length,
  };

  const featuredProject = projects[0] || null;
  const restProjects = projects.slice(1);

  return (
    <div className="space-y-12 pb-16 transition-colors duration-200">
      {/* 1. Header & Workspace Metadata */}
      <header className="flex flex-col gap-2 relative">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#2563eb] dark:text-[#3B82F6]">
          <span>/</span>
          <span>02</span>
          <span className="text-slate-400 dark:text-[#64748B] px-1">—</span>
          <span className="text-slate-500 dark:text-[#64748B]">REPOSITORIES &amp; VERIFIED WORK</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-1">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight">
              Cloud Engineer Portfolio<span className="text-[#2563eb] dark:text-[#3B82F6]">.</span>
            </h1>
            <p className="text-base text-slate-600 dark:text-[#c3c6d7] max-w-2xl mt-2 leading-relaxed">
              Cloud infrastructure, AWS serverless architectures, and frontend development projects.
            </p>
          </div>

          {/* Telemetry Pill Indicator */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.06] px-4 py-2 rounded-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#00a572] dark:text-[#4edea3]">
              VERIFIED
            </span>
            <span className="text-slate-300 dark:text-white/10">•</span>
            <span className="font-mono text-xs text-slate-500 dark:text-[#64748B]">AWS &amp; FULL STACK</span>
          </div>
        </div>
      </header>

      {/* 2. Interactive Filter Bar */}
      <nav aria-label="Artifact Filters" className="flex flex-wrap items-center gap-2 p-1.5 bg-white/90 dark:bg-[#131b2e]/80 border border-slate-200 dark:border-white/[0.06] backdrop-blur-md rounded-2xl shadow-sm">
        <FilterButton
          active={activeTab === 'All'}
          label="All"
          count={counts.All}
          icon={Layers}
          onClick={() => setActiveTab('All')}
        />
        <FilterButton
          active={activeTab === 'Projects'}
          label="Projects"
          count={counts.Projects}
          icon={Terminal}
          onClick={() => setActiveTab('Projects')}
        />
        <FilterButton
          active={activeTab === 'Certifications'}
          label="Certifications"
          count={counts.Certifications}
          icon={ShieldCheck}
          onClick={() => setActiveTab('Certifications')}
        />
        <FilterButton
          active={activeTab === 'Badges'}
          label="Badges"
          count={counts.Badges}
          icon={Award}
          onClick={() => setActiveTab('Badges')}
        />
        <FilterButton
          active={activeTab === 'Vibe Coding'}
          label="Vibe Coding"
          count={counts['Vibe Coding']}
          icon={Code2}
          onClick={() => setActiveTab('Vibe Coding')}
        />
      </nav>

      {loading && (
        <div className="p-12 text-center font-mono text-sm text-slate-500 dark:text-[#64748B]">
          Fetching verified artifacts from database…
        </div>
      )}

      {error && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 font-mono text-sm">
          Failed to load artifacts: {error}
        </div>
      )}

      {!loading && !error && counts[activeTab] === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#131b2e]/40 border border-dashed border-slate-300 dark:border-white/10">
          <p className="font-mono text-sm text-slate-500 dark:text-[#64748B]">No items found in this category.</p>
        </div>
      )}

      {/* 3. SECTION: PROJECTS */}
      {!loading && (activeTab === 'All' || activeTab === 'Projects') && projects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-4 rounded-full bg-[#2563eb] dark:bg-[#3B82F6]" />
              <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-[#dae2fd]">
                Projects
              </h2>
              <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.04]">
                {projects.length} {projects.length === 1 ? 'DEPLOYMENT' : 'DEPLOYMENTS'}
              </span>
            </div>
          </div>

          {/* Featured Project Card */}
          {featuredProject && (
            <article className="group relative rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 lg:p-10 overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-2xl hover:shadow-xl dark:hover:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.2)] transition-all duration-300">
              <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#3B82F6]/20 transition-all duration-500" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Diagram Window Preview */}
                <div className="lg:col-span-6 w-full rounded-2xl overflow-hidden bg-slate-900 dark:bg-[#060e20] border border-slate-800 dark:border-white/[0.08] shadow-xl relative">
                  <div className="h-8 px-4 bg-slate-800 dark:bg-[#171f33] border-b border-slate-700 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-[#64748B]">
                      {featuredProject.id}.diag
                    </span>
                    <span className="font-mono text-[10px] text-[#2563eb] dark:text-[#3B82F6] font-bold">
                      {featuredProject.category || 'PROJECT'}
                    </span>
                  </div>

                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950 dark:bg-[#060e20]">
                    <img
                      src={
                        featuredProject.hero_image_url ||
                        featuredProject.thumbnail_url ||
                        'https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&w=1600'
                      }
                      alt={featuredProject.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 dark:from-[#060e20] via-transparent to-transparent opacity-60" />
                  </div>
                </div>

                {/* Project Specs & Content */}
                <div className="lg:col-span-6 flex flex-col justify-between h-full gap-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-[#2563eb]/20 border border-blue-200 dark:border-[#2563eb]/30 text-[#2563eb] dark:text-[#b4c5ff] font-mono text-[11px] font-bold">
                          FEATURED
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#171f33] font-mono text-[11px] text-slate-600 dark:text-[#64748B]">
                          {featuredProject.category}
                        </span>
                        <span className="font-mono text-xs text-slate-500 dark:text-[#64748B] ml-1">
                          {featuredProject.year}
                        </span>
                      </div>
                      <Link
                        to={`/project/${featuredProject.id}`}
                        aria-label="Open Project Details"
                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#171f33] hover:bg-[#2563eb] text-slate-700 dark:text-[#3B82F6] hover:text-white border border-slate-200 dark:border-white/[0.06] flex items-center justify-center transition-all group/arrow"
                      >
                        <ArrowUpRight size={18} className="transition-transform group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5" />
                      </Link>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] mt-1 group-hover:text-[#2563eb] dark:group-hover:text-[#b4c5ff] transition-colors">
                        {featuredProject.title}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
                      {featuredProject.short_description || featuredProject.overview}
                    </p>
                  </div>

                  {/* Tech chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {(featuredProject.technologies?.length > 0
                      ? featuredProject.technologies.map((t) => t.name)
                      : featuredProject.tech_stack || []
                    ).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-[#c3c6d7]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      to={`/project/${featuredProject.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-sm hover:brightness-110 shadow-md shadow-blue-500/20 transition-all"
                    >
                      <Terminal size={16} />
                      <span>Inspect Details</span>
                    </Link>
                    {featuredProject.github_url && (
                      <a
                        href={featuredProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171f33] dark:hover:bg-[#222a3d] border border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-[#c3c6d7] hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition-all"
                      >
                        <Code2 size={16} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Grid of Other Projects */}
          {restProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {restProjects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i + 2} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. SECTION: CERTIFICATIONS */}
      {!loading && (activeTab === 'All' || activeTab === 'Certifications') && certifications.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-4 rounded-full bg-[#10B981]" />
              <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-[#dae2fd]">
                Certifications
              </h2>
              <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.04]">
                {certifications.length} {certifications.length === 1 ? 'CREDENTIAL' : 'CREDENTIALS'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((c) => (
              <CertificationCard key={c.id} cert={c} />
            ))}
          </div>
        </section>
      )}

      {/* 5. SECTION: BADGES */}
      {!loading && (activeTab === 'All' || activeTab === 'Badges') && badges.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-4 rounded-full bg-[#F59E0B]" />
              <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-[#dae2fd]">
                Badges
              </h2>
              <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.04]">
                {badges.length} {badges.length === 1 ? 'BADGE' : 'BADGES'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((b) => (
              <BadgeCard key={b.id} badge={b} />
            ))}
          </div>
        </section>
      )}

      {/* 6. SECTION: VIBE CODING */}
      {!loading && (activeTab === 'All' || activeTab === 'Vibe Coding') && vibeCoding.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-4 rounded-full bg-[#7d4ce7] dark:bg-[#d0bcff]" />
              <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-[#dae2fd]">
                Vibe Coding
              </h2>
              <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.04]">
                {vibeCoding.length} {vibeCoding.length === 1 ? 'BUILD' : 'BUILDS'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vibeCoding.map((v) => (
              <VibeCodingCard key={v.id} item={v} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Bottom Verification Status Strip */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131b2e]/60 border border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-[#10B981] flex-shrink-0" />
          <span className="text-sm text-slate-600 dark:text-[#c3c6d7]">
            All listed projects, certifications, and experiments are maintained by Ojal Rathee.
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#2563eb] dark:text-[#3B82F6]">
          <span>VERIFIED CREDENTIALS</span>
          <Key size={14} />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-components
// -------------------------------------------------------------
function FilterButton({
  active,
  label,
  count,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  icon: typeof Layers;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
        active
          ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/25'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#c3c6d7] dark:hover:text-white dark:hover:bg-[#171f33]'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
      <span
        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
          active
            ? 'bg-white/20 text-white'
            : 'bg-slate-100 text-slate-600 dark:bg-[#171f33] dark:text-[#64748B]'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group flex flex-col rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.06] overflow-hidden shadow-sm dark:shadow-lg hover:border-blue-300 dark:hover:border-[#3B82F6]/50 hover:shadow-md dark:hover:shadow-[0_12px_30px_-10px_rgba(37,99,235,0.25)] transition-all">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-[#060e20] border-b border-slate-200 dark:border-white/[0.06]">
        <img
          src={
            project.thumbnail_url ||
            project.hero_image_url ||
            'https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
          alt={project.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg?auto=compress&cs=tinysrgb&w=1200';
          }}
        />
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#060e20]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/[0.08] font-mono text-[10px] font-bold text-[#2563eb] dark:text-[#3B82F6]">
          {project.category}
        </div>
      </div>

      <div className="p-6 flex flex-1 flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-slate-400 dark:text-[#64748B]">#{String(index).padStart(2, '0')}</span>
            <span className="font-mono text-xs text-slate-500 dark:text-[#64748B]">{project.year}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-[#dae2fd] group-hover:text-[#2563eb] dark:group-hover:text-[#3B82F6] transition-colors">
            {project.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed line-clamp-3">
            {project.short_description || project.overview}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {(project.technologies?.length > 0
              ? project.technologies.slice(0, 3).map((t) => t.name)
              : (project.tech_stack || []).slice(0, 3)
            ).map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#171f33] text-slate-700 dark:text-[#c3c6d7] border border-slate-200 dark:border-white/[0.04]"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/[0.06]">
            <Link
              to={`/project/${project.id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] hover:underline transition-colors"
            >
              <span>Explore Case Study</span>
              <ArrowUpRight size={14} />
            </Link>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Source on GitHub"
                className="text-slate-400 hover:text-slate-900 dark:text-[#64748B] dark:hover:text-white transition-colors"
              >
                <Code2 size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function CertificationCard({ cert }: { cert: Certification }) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(cert.image_url) && !imgError;

  return (
    <article className="group flex flex-col rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.06] p-6 shadow-sm dark:shadow-md hover:border-emerald-300 dark:hover:border-[#10B981]/40 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center p-1.5 flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
          {showImage ? (
            <img
              src={cert.image_url!}
              alt={cert.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-emerald-50 dark:bg-[#00a572]/20 border border-emerald-200 dark:border-[#00a572]/30 flex items-center justify-center text-[#10B981]">
              <ShieldCheck size={24} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[10px] text-[#00a572] dark:text-[#4edea3] font-bold uppercase tracking-wider">
            {cert.issuer}
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-[#dae2fd] mt-0.5 group-hover:text-[#10B981] transition-colors">
            {cert.title}
          </h3>
        </div>
      </div>

      {cert.description && (
        <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed flex-1">
          {cert.description}
        </p>
      )}

      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500 dark:text-[#64748B]">Issued: {cert.issue_date}</span>
        {cert.credential_url && (
          <a
            href={sanitizeHref(cert.credential_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#2563eb] dark:text-[#3B82F6] hover:underline"
          >
            <span>Verify</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(badge.image_url) && !imgError;

  return (
    <article className="group flex flex-col items-center text-center rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.06] p-6 shadow-sm dark:shadow-md hover:border-amber-300 dark:hover:border-[#F59E0B]/40 transition-all">
      <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center p-2 mb-4 group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
        {showImage ? (
          <img
            src={badge.image_url!}
            alt={badge.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-xl"
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-amber-50 dark:bg-[#F59E0B]/15 border border-amber-200 dark:border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
            <Award size={32} />
          </div>
        )}
      </div>

      <h3 className="text-sm font-bold text-slate-900 dark:text-[#dae2fd] group-hover:text-[#F59E0B] transition-colors">
        {badge.title}
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-[#64748B] font-mono">{badge.issuer}</p>

      {badge.description && (
        <p className="mt-2 text-xs text-slate-600 dark:text-[#c3c6d7] leading-relaxed line-clamp-2">
          {badge.description}
        </p>
      )}

      {badge.credential_url && (
        <a
          href={sanitizeHref(badge.credential_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#2563eb] dark:text-[#3B82F6] hover:underline"
        >
          <span>Credly Badge</span>
          <ExternalLink size={11} />
        </a>
      )}
    </article>
  );
}

function VibeCodingCard({ item }: { item: VibeCoding }) {
  return (
    <article className="group flex flex-col rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.06] overflow-hidden shadow-sm dark:shadow-md hover:border-purple-300 dark:hover:border-[#7d4ce7]/40 transition-all">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-[#060e20] border-b border-slate-200 dark:border-white/[0.06]">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-50 dark:bg-[#7d4ce7]/10 text-[#7d4ce7] dark:text-[#d0bcff]">
            <Code2 size={36} />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-1 flex-col justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-[#dae2fd] group-hover:text-[#7d4ce7] dark:group-hover:text-[#d0bcff] transition-colors">
            {item.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="space-y-4">
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#171f33] text-slate-700 dark:text-[#c3c6d7] border border-slate-200 dark:border-white/[0.04]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
            {item.demo_url && (
              <a
                href={sanitizeHref(item.demo_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] hover:underline"
              >
                <span>Launch Demo</span>
                <ExternalLink size={12} />
              </a>
            )}
            {item.github_url && (
              <a
                href={sanitizeHref(item.github_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-slate-900 dark:text-[#64748B] dark:hover:text-white transition-colors"
              >
                <Code2 size={13} />
                <span>Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
