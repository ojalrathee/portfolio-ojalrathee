import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Terminal,
  Server,
  Layers,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useProject, type ArchitectureItem, type ChallengeItem, type DeploymentStep } from '@/hooks/useProjects';
import { sanitizeHref } from '@/lib/url';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, error } = useProject(id);

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-sm text-slate-500 dark:text-[#64748B]">
        Initializing telemetry node &amp; architecture specifications…
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-red-500 dark:text-red-400 font-mono text-sm">
          {error ? `Failed to load project: ${error}` : 'Project not found in registry.'}
        </p>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs uppercase"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 transition-colors duration-200">
      {/* Back button */}
      <div>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-[#64748B] hover:text-[#2563eb] dark:hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Repositories &amp; Artifacts</span>
        </Link>
      </div>

      {/* 1. Header Spec Panel */}
      <header className="relative rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-lg shadow-slate-200/50 dark:shadow-2xl overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-[#2563eb]/20 border border-blue-200 dark:border-[#2563eb]/30 text-[#2563eb] dark:text-[#b4c5ff] font-mono text-[11px] font-bold">
            {project.category.toUpperCase()}
          </span>
          <span className="font-mono text-xs text-slate-500 dark:text-[#64748B] flex items-center gap-1.5 ml-2">
            <Calendar size={13} />
            {project.year}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight">
          {project.title}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-[#c3c6d7] max-w-3xl leading-relaxed">
          {project.short_description}
        </p>

        {/* Tech Chips */}
        <div className="flex flex-wrap gap-2 mt-6">
          {(project.technologies?.length > 0
            ? project.technologies.map((t) => t.name)
            : project.tech_stack
          ).map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-[#dae2fd]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-white/[0.06]">
          {project.live_demo_url && (
            <a
              href={sanitizeHref(project.live_demo_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563eb] text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:brightness-110 transition-all"
            >
              <ExternalLink size={16} />
              <span>Launch Live System</span>
            </a>
          )}
          {project.github_url && (
            <a
              href={sanitizeHref(project.github_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171f33] dark:hover:bg-[#222a3d] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-[#dae2fd] font-bold text-sm transition-all"
            >
              <Github size={16} />
              <span>Source Repository</span>
            </a>
          )}
        </div>
      </header>

      {/* Hero Visual Preview */}
      {project.hero_image_url && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#060e20] shadow-lg">
          <div className="h-9 px-4 bg-slate-100 dark:bg-[#171f33] border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="font-mono text-xs text-slate-500 dark:text-[#64748B] ml-2">architecture-diagram.png</span>
            </div>
            <span className="font-mono text-xs text-[#2563eb] dark:text-[#3B82F6]">TOPOLOGY INSPECTOR</span>
          </div>
          <div className="w-full aspect-[16/9] overflow-hidden">
            <img
              src={project.hero_image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* 2. Overview Section */}
      <section className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase">
          <Server size={14} />
          <span>PROJECT OVERVIEW</span>
        </div>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
          {project.long_description || project.overview}
        </p>
      </section>

      {/* 3. System Architecture & Technical Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Architecture */}
        <section className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 shadow-sm dark:shadow-xl space-y-5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#00a572] dark:text-[#4edea3] uppercase">
            <Layers size={14} />
            <span>SYSTEM ARCHITECTURE</span>
          </div>

          <div className="space-y-3">
            {project.architecture?.length > 0
              ? project.architecture.map((item: ArchitectureItem) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#171f33]/60 border border-slate-200/80 dark:border-white/[0.04] space-y-1"
                  >
                    <h2 className="font-bold text-sm text-slate-900 dark:text-[#dae2fd]">{item.title}</h2>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#c3c6d7]">{item.description}</p>
                    )}
                  </div>
                ))
              : project.system_architecture.map((arch, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#171f33]/60 border border-slate-200/80 dark:border-white/[0.04]"
                  >
                    <CheckCircle2 size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-[#c3c6d7] leading-relaxed">{arch}</span>
                  </div>
                ))}
          </div>
        </section>

        {/* Technical Challenges */}
        <section className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 shadow-sm dark:shadow-xl space-y-5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#F59E0B] uppercase">
            <Terminal size={14} />
            <span>ENGINEERING CHALLENGES &amp; MITIGATIONS</span>
          </div>

          <div className="space-y-3">
            {project.challenges?.length > 0
              ? project.challenges.map((item: ChallengeItem) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#171f33]/60 border border-slate-200/80 dark:border-white/[0.04] space-y-1"
                  >
                    <h2 className="font-bold text-sm text-slate-900 dark:text-[#dae2fd]">{item.title}</h2>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#c3c6d7]">{item.description}</p>
                    )}
                  </div>
                ))
              : project.technical_challenges.map((chal, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#171f33]/60 border border-slate-200/80 dark:border-white/[0.04]"
                  >
                    <span className="font-mono text-xs font-bold text-[#F59E0B] mt-0.5">[{idx + 1}]</span>
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-[#c3c6d7] leading-relaxed">{chal}</span>
                  </div>
                ))}
          </div>
        </section>
      </div>

      {/* 4. Deployment Steps */}
      {((project.deployment && project.deployment.length > 0) ||
        (project.deployment_details && project.deployment_details.length > 0)) && (
        <section className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-sm dark:shadow-xl space-y-5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase">
            <CheckCircle2 size={14} />
            <span>DEPLOYMENT PIPELINE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.deployment?.length > 0
              ? project.deployment.map((step: DeploymentStep) => (
                  <div
                    key={step.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#171f33]/60 border border-slate-200/80 dark:border-white/[0.04] space-y-2"
                  >
                    <div className="font-mono text-xs text-[#2563eb] dark:text-[#3B82F6] font-bold">
                      STEP 0{step.step_number}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-[#c3c6d7]">{step.description}</p>
                  </div>
                ))
              : project.deployment_details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#171f33]/60 border border-slate-200/80 dark:border-white/[0.04] space-y-2"
                  >
                    <div className="font-mono text-xs text-[#2563eb] dark:text-[#3B82F6] font-bold">
                      STEP 0{idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-[#c3c6d7]">{detail}</p>
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* Back button */}
      <div>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-[#64748B] hover:text-[#2563eb] dark:hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Repositories &amp; Artifacts</span>
        </Link>
      </div>
    </div>
  );
}
