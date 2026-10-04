import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Award, ExternalLink, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';
import { sanitizeHref } from '@/lib/url';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useBadges, type Badge } from '@/hooks/useBadges';

export default function BadgesAdminPage() {
  const { badges, loading, error } = useBadges();
  const [editing, setEditing] = useState<Badge | 'new' | null>(null);

  if (loading) return <p className="text-slate-400">Loading badges…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Badges</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{badges.length} badge{badges.length !== 1 ? 's' : ''} in your portfolio.</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-blue-900/40"
        >
          <Plus size={18} /> New Badge
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {badges?.map((b) => (
          <div key={b.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-1.5 dark:border-white/[0.08] dark:bg-[#060e20]">
              {b.image_url ? (
                <img src={b.image_url} alt="" className="h-full w-full object-contain rounded-xl" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <Award size={24} className="text-slate-300 dark:text-slate-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold text-slate-900 dark:text-white">{b.title}</h3>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{b.issuer}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1"><Calendar size={11} /> {b.issue_date}</span>
                {b.description && <span className="truncate max-w-xs">{b.description}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              {b.credential_url && (
                <a href={sanitizeHref(b.credential_url)} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/50">
                  <ExternalLink size={16} />
                </a>
              )}
              <button onClick={() => setEditing(b)} className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/50">
                <Pencil size={16} />
              </button>
              <DeleteButton badge={b} />
            </div>
          </div>
        ))}

        {(!badges || badges.length === 0) && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <Award size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-400">No badges yet. Click "New Badge" to add one.</p>
          </div>
        )}
      </div>

      {editing && <BadgeFormModal badge={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function DeleteButton({ badge }: { badge: Badge }) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!confirm(`Delete "${badge.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await supabase.from('badges').delete().eq('id', badge.id);
    setDeleting(false);
    window.location.reload();
  };
  return (
    <button onClick={handleDelete} disabled={deleting} className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/40">
      <Trash2 size={16} />
    </button>
  );
}

interface FormData {
  title: string;
  issuer: string;
  issue_date: string;
  image_url: string;
  credential_url: string;
  description: string;
  sort_order: string;
}

function BadgeFormModal({ badge, onClose }: { badge: Badge | null; onClose: () => void }) {
  const [form, setForm] = useState<FormData>({
    title: badge?.title ?? '',
    issuer: badge?.issuer ?? '',
    issue_date: badge?.issue_date ?? '',
    image_url: badge?.image_url ?? '',
    credential_url: badge?.credential_url ?? '',
    description: badge?.description ?? '',
    sort_order: String(badge?.sort_order ?? 0),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    if (!form.title || !form.issuer || !form.issue_date) {
      setError('Title, issuer, and issue date are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const row = {
        title: form.title,
        issuer: form.issuer,
        issue_date: form.issue_date,
        image_url: form.image_url || null,
        credential_url: form.credential_url || null,
        description: form.description || null,
        sort_order: parseInt(form.sort_order, 10) || 0,
        updated_at: new Date().toISOString(),
      };
      if (badge) {
        const { error: updErr } = await supabase.from('badges').update(row).eq('id', badge.id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase.from('badges').insert({ ...row, created_at: new Date().toISOString() });
        if (insErr) throw insErr;
      }
      window.location.reload();
    } catch (err) {
      setError(toSafeErrorMessage(err, 'Failed to save badge.'));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{badge ? 'Edit Badge' : 'New Badge'}</h2>
          <button onClick={onClose} className="rounded-xl bg-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <ImageUploadField label="Badge Image" value={form.image_url} folder="badges" placeholder="https://example.com/badge.png" previewClassName="h-20 w-20" onChange={(v) => set('image_url', v)} />
          <Field label="Title" value={form.title} onChange={(v) => set('title', v)} placeholder="AWS Cloud Practitioner Badge" />
          <Field label="Issuer" value={form.issuer} onChange={(v) => set('issuer', v)} placeholder="Amazon Web Services" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Issue Date</label>
              <input type="date" value={form.issue_date} onChange={(e) => set('issue_date', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
            </div>
            <Field label="Sort Order" type="number" value={form.sort_order} onChange={(v) => set('sort_order', v)} />
          </div>
          <Field label="Credential URL" value={form.credential_url} onChange={(v) => set('credential_url', v)} placeholder="https://credly.com/..." />
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}
        </div>
        <div className="sticky bottom-0 flex items-center justify-end gap-3 rounded-b-3xl border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <button onClick={onClose} className="rounded-2xl px-5 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50 dark:shadow-blue-900/40">
            <Save size={16} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
    </div>
  );
}
