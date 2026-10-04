import { Award, ExternalLink } from 'lucide-react';
import { useBadges } from '@/hooks/useBadges';
import { sanitizeHref } from '@/lib/url';

export default function BadgesSection() {
  const { badges, loading, error } = useBadges();

  if (loading) return null;
  if (error) return null;
  if (!badges || badges.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="mb-5 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Badges</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {badges?.map((b) => (
          <div key={b.id} className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:shadow-none">
            <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-white transition-transform group-hover:scale-105 dark:border-slate-700 dark:bg-slate-900">
              {b.image_url ? (
                <img src={b.image_url} alt={b.title} className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <Award size={32} className="text-slate-300 dark:text-slate-600" />
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{b.title}</h4>
            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{b.issuer}</p>
            {b.credential_url && (
              <a href={sanitizeHref(b.credential_url)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                <ExternalLink size={10} /> Verify
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
