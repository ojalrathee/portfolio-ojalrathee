import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Code2, ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';
import { sanitizeHref } from '@/lib/url';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useVibeCoding, type VibeCoding } from '@/hooks/useVibeCoding';

export default function VibeCodingAdminPage() {
  const { items, loading, error } = useVibeCoding();
  const [editing, setEditing] = useState<VibeCoding | 'new' | null>(null);

  if (loading) return <p className="text-slate-400">Loading vibe coding…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Vibe Coding</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{items.length} vibe coding experiment{items.length !== 1 ? 's' : ''}.</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-blue-900/40"
        >
          <Plus size={18} /> New Experiment
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items?.map((v) => (
          <div key={v.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              {v.image_url ? (
                <img src={v.image_url} alt="" className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <Code2 size={24} className="text-slate-300 dark:text-slate-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{v.description}</p>
              {v.tags?.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {v.tags.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {v.github_url && (
                <a href={sanitizeHref(v.github_url)} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/50">
                  <Github size={16} />
                </a>
              )}
              {v.demo_url && (
                <a href={sanitizeHref(v.demo_url)} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/50">
                  <ExternalLink size={16} />
                </a>
              )}
              <button onClick={() => setEditing(v)} className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/50">
                <Pencil size={16} />
              </button>
              <DeleteButton item={v} />
            </div>
          </div>
        ))}

        {(!items || items.length === 0) && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <Code2 size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-400">No vibe coding experiments yet. Click "New Experiment" to add one.</p>
          </div>
        )}
      </div>

      {editing && <VibeCodingFormModal item={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function DeleteButton({ item }: { item: VibeCoding }) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await supabase.from('vibe_coding').delete().eq('id', item.id);
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
  description: string;
  image_url: string;
  demo_url: string;
  github_url: string;
  tags: string;
  sort_order: string;
}

function VibeCodingFormModal({ item, onClose }: { item: VibeCoding | null; onClose: () => void }) {
  const [form, setForm] = useState<FormData>({
    title: item?.title ?? '',
    description: item?.description ?? '',
    image_url: item?.image_url ?? '',
    demo_url: item?.demo_url ?? '',
    github_url: item?.github_url ?? '',
    tags: (item?.tags ?? []).join(', '),
    sort_order: String(item?.sort_order ?? 0),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    if (!form.title || !form.description) {
      setError('Title and description are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const row = {
        title: form.title,
        description: form.description,
        image_url: form.image_url || null,
        demo_url: form.demo_url || null,
        github_url: form.github_url || null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        sort_order: parseInt(form.sort_order, 10) || 0,
        updated_at: new Date().toISOString(),
      };
      if (item) {
        const { error: updErr } = await supabase.from('vibe_coding').update(row).eq('id', item.id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase.from('vibe_coding').insert({ ...row, created_at: new Date().toISOString() });
        if (insErr) throw insErr;
      }
      window.location.reload();
    } catch (err) {
      setError(toSafeErrorMessage(err, 'Failed to save.'));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{item ? 'Edit Experiment' : 'New Experiment'}</h2>
          <button onClick={onClose} className="rounded-xl bg-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <ImageUploadField label="Experiment Image" value={form.image_url} folder="vibe-coding" placeholder="https://example.com/screenshot.png" previewClassName="h-20 w-20" onChange={(v) => set('image_url', v)} />
          <Field label="Title" value={form.title} onChange={(v) => set('title', v)} placeholder="AI-Powered Code Review Bot" />
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
          </div>
          <Field label="Tags (comma-separated)" value={form.tags} onChange={(v) => set('tags', v)} placeholder="AI, React, OpenAI" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Demo URL" value={form.demo_url} onChange={(v) => set('demo_url', v)} placeholder="https://demo.example.com" />
            <Field label="GitHub URL" value={form.github_url} onChange={(v) => set('github_url', v)} placeholder="https://github.com/..." />
          </div>
          <Field label="Sort Order" type="number" value={form.sort_order} onChange={(v) => set('sort_order', v)} />
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
