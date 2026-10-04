import { Award, ExternalLink, Calendar } from 'lucide-react';
import { useCertifications } from '@/hooks/useCertifications';
import { sanitizeHref } from '@/lib/url';

export default function CertificationsSection() {
  const { certifications, loading, error } = useCertifications();

  if (loading) return null;
  if (error) return null;
  if (!certifications || certifications.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="mb-5 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Certifications</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications?.map((c) => (
          <div key={c.id} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-blue-500 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-blue-500">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                {c.image_url ? (
                  <img src={c.image_url} alt="" className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <Award size={24} className="text-slate-300 dark:text-slate-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h4>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{c.issuer}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Calendar size={10} /> {c.issue_date}{c.expiry_date ? ` — ${c.expiry_date}` : ''}
                </p>
              </div>
            </div>
            {c.description && <p className="mb-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{c.description}</p>}
            {c.credential_url && (
              <a href={sanitizeHref(c.credential_url)} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                <ExternalLink size={12} /> Verify Credential
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
