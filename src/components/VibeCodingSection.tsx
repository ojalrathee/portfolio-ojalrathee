import { Code2, ExternalLink, Github } from 'lucide-react';
import { useVibeCoding } from '@/hooks/useVibeCoding';
import { sanitizeHref } from '@/lib/url';

export default function VibeCodingSection() {
  const { items, loading, error } = useVibeCoding();

  if (loading) return null;
  if (error) return null;
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="mb-5">
        <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Vibe Coding</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">AI-assisted experiments and rapid prototypes.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((v) => (
          <div key={v.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:shadow-none">
            <div className="aspect-video overflow-hidden border-b border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700">
              {v.image_url ? (
                <img src={v.image_url} alt={v.title} className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Code2 size={32} className="text-slate-300 dark:text-slate-600" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{v.title}</h4>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{v.description}</p>
              {v.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {v.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-medium text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">{t}</span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-2">
                {v.github_url && (
                  <a href={sanitizeHref(v.github_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                    <Github size={12} /> Code
                  </a>
                )}
                {v.demo_url && (
                  <a href={sanitizeHref(v.demo_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200">
                    <ExternalLink size={12} /> Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
