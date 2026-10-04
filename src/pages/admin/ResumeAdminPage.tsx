import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Briefcase, GraduationCap, Cpu, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';
import { useResume, RESUME_CATEGORIES, type ResumeCategory, type ResumeEntry } from '@/hooks/useResume';

const CATEGORY_ICONS: Record<ResumeCategory, typeof Briefcase> = {
  Experience: Briefcase,
  Education: GraduationCap,
  'Core Competency': Cpu,
  Tools: Wrench,
};

export default function ResumeAdminPage() {
  const { entries, loading, error } = useResume();
  const [editing, setEditing] = useState<ResumeEntry | 'new' | null>(null);

  if (loading) return <p className="text-slate-400">Loading resume entries…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Resume</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{entries.length} entries across {RESUME_CATEGORIES.length} categories.</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-blue-900/40"
        >
          <Plus size={18} /> New Entry
        </button>
      </div>

      <div className="mt-6 space-y-8">
        {RESUME_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category];
          const items = entries.filter((e) => e.category === category);
          return (
            <div key={category}>
              <div className="mb-3 flex items-center gap-2">
                <Icon size={16} className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{category}</h2>
              </div>
              <div className="space-y-3">
                {items.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                    <p className="text-sm text-slate-400">No entries in this category yet.</p>
                  </div>
                )}
                {items.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-slate-900 dark:text-white">{entry.title}</h3>
                      {entry.organization && <p className="truncate text-sm text-slate-500 dark:text-slate-400">{entry.organization}</p>}
                      {entry.description && <p className="mt-1 line-clamp-2 text-xs text-slate-400">{entry.description}</p>}
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                        {[entry.start_date, entry.end_date].filter(Boolean).join(' — ') && (
                          <span>{[entry.start_date, entry.end_date].filter(Boolean).join(' — ')}</span>
                        )}
                        <span>Order: {entry.sort_order}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(entry)}
                        className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/50"
                      >
                        <Pencil size={16} />
                      </button>
                      <DeleteButton entry={entry} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <ResumeFormModal entry={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function DeleteButton({ entry }: { entry: ResumeEntry }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${entry.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await supabase.from('resume_entries').delete().eq('id', entry.id);
    setDeleting(false);
    window.location.reload();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/40"
    >
      <Trash2 size={16} />
    </button>
  );
}

interface FormData {
  category: ResumeCategory;
  title: string;
  organization: string;
  description: string;
  start_date: string;
  end_date: string;
  sort_order: string;
}

function ResumeFormModal({ entry, onClose }: { entry: ResumeEntry | null; onClose: () => void }) {
  const [form, setForm] = useState<FormData>({
    category: entry?.category ?? 'Experience',
    title: entry?.title ?? '',
    organization: entry?.organization ?? '',
    description: entry?.description ?? '',
    start_date: entry?.start_date ?? '',
    end_date: entry?.end_date ?? '',
    sort_order: String(entry?.sort_order ?? 0),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = async () => {
    if (!form.title) {
      setError('Title is required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const row = {
        category: form.category,
        title: form.title,
        organization: form.organization || null,
        description: form.description || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        sort_order: parseInt(form.sort_order, 10) || 0,
        updated_at: new Date().toISOString(),
      };

      if (entry) {
        const { error: updErr } = await supabase.from('resume_entries').update(row).eq('id', entry.id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase.from('resume_entries').insert({ ...row, created_at: new Date().toISOString() });
        if (insErr) throw insErr;
      }

      window.location.reload();
    } catch (err) {
      setError(toSafeErrorMessage(err, 'Failed to save entry.'));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{entry ? 'Edit Entry' : 'New Entry'}</h2>
          <button onClick={onClose} className="rounded-xl bg-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value as ResumeCategory)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40"
            >
              {RESUME_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Field label="Title" value={form.title} onChange={(v) => set('title', v)} placeholder="AWS Certified Solutions Architect" />
          <Field label="Organization (optional)" value={form.organization} onChange={(v) => set('organization', v)} placeholder="Amazon Web Services" />

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Start Date (optional)" value={form.start_date} onChange={(v) => set('start_date', v)} placeholder="2024" />
            <Field label="End Date (optional)" value={form.end_date} onChange={(v) => set('end_date', v)} placeholder="Present" />
            <Field label="Sort Order" type="number" value={form.sort_order} onChange={(v) => set('sort_order', v)} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
          </div>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 rounded-b-3xl border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <button onClick={onClose} className="rounded-2xl px-5 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50 dark:shadow-blue-900/40"
          >
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
