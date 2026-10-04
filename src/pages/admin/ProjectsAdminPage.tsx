import { useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Save, X, GripVertical } from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';
import { useProjects, type Project, type Technology, type ArchitectureItem, type ChallengeItem, type DeploymentStep } from '@/hooks/useProjects';

export default function ProjectsAdminPage() {
  const { projects, loading, error } = useProjects();
  const [editing, setEditing] = useState<Project | 'new' | null>(null);

  if (loading) return <p className="text-slate-400">Loading projects…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Projects</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio.</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-blue-900/40"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              {p.thumbnail_url && <img src={p.thumbnail_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold text-slate-900 dark:text-white">{p.title}</h3>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{p.short_description}</p>
              <p className="mt-1 text-xs text-slate-400">Order: {p.sort_order} · {p.year}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(p)}
                className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/50"
              >
                <Pencil size={16} />
              </button>
              <DeleteButton project={p} />
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProjectFormModal
          project={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function DeleteButton({ project }: { project: Project }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await supabase.from('project_technologies').delete().eq('project_id', project.id);
    await supabase.from('project_architecture').delete().eq('project_id', project.id);
    await supabase.from('project_challenges').delete().eq('project_id', project.id);
    await supabase.from('project_deployment').delete().eq('project_id', project.id);
    await supabase.from('projects').delete().eq('id', project.id);
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
  id: string;
  title: string;
  short_description: string;
  overview: string;
  year: string;
  github_url: string;
  live_demo_url: string;
  demo_video_url: string;
  thumbnail_url: string;
  hero_image_url: string;
  sort_order: string;
  category: string;
  tech_stack: string[];
  system_architecture: string[];
  technical_challenges: string[];
  deployment_details: string[];
  technologies: Technology[];
  architecture: ArchitectureItem[];
  challenges: ChallengeItem[];
  deployment: DeploymentStep[];
}

function ProjectFormModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [form, setForm] = useState<FormData>({
    id: project?.id ?? '',
    title: project?.title ?? '',
    short_description: project?.short_description ?? '',
    overview: project?.overview ?? '',
    year: project?.year ?? String(new Date().getFullYear()),
    github_url: project?.github_url ?? '',
    live_demo_url: project?.live_demo_url ?? '',
    demo_video_url: project?.demo_video_url ?? '',
    thumbnail_url: project?.thumbnail_url ?? '',
    hero_image_url: project?.hero_image_url ?? '',
    sort_order: String(project?.sort_order ?? 0),
    category: project?.category ?? 'Projects',
    tech_stack: project?.tech_stack ?? [],
    system_architecture: project?.system_architecture ?? [],
    technical_challenges: project?.technical_challenges ?? [],
    deployment_details: project?.deployment_details ?? [],
    technologies: project?.technologies ?? [],
    architecture: project?.architecture ?? [],
    challenges: project?.challenges ?? [],
    deployment: project?.deployment ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const projectId = form.id || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

      const projectRow = {
        id: projectId,
        title: form.title,
        short_description: form.short_description,
        overview: form.overview,
        year: form.year,
        github_url: form.github_url,
        live_demo_url: form.live_demo_url,
        demo_video_url: form.demo_video_url,
        thumbnail_url: form.thumbnail_url || null,
        hero_image_url: form.hero_image_url || null,
        sort_order: parseInt(form.sort_order, 10) || 0,
        category: form.category,
        tech_stack: form.tech_stack,
        system_architecture: form.system_architecture,
        technical_challenges: form.technical_challenges,
        deployment_details: form.deployment_details,
        updated_at: new Date().toISOString(),
      };

      if (project) {
        const { error: updErr } = await supabase.from('projects').update(projectRow).eq('id', project.id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase.from('projects').insert({ ...projectRow, created_at: new Date().toISOString() });
        if (insErr) throw insErr;
      }

      // Sync child rows: delete old, insert new
      await Promise.all([
        supabase.from('project_technologies').delete().eq('project_id', projectId),
        supabase.from('project_architecture').delete().eq('project_id', projectId),
        supabase.from('project_challenges').delete().eq('project_id', projectId),
        supabase.from('project_deployment').delete().eq('project_id', projectId),
      ]);

      if (form.technologies.length > 0) {
        await supabase.from('project_technologies').insert(
          form.technologies.map((t, i) => ({ project_id: projectId, name: t.name, category: t.category, icon: t.icon, sort_order: i }))
        );
      }
      if (form.architecture.length > 0) {
        await supabase.from('project_architecture').insert(
          form.architecture.map((a, i) => ({ project_id: projectId, title: a.title, description: a.description, sort_order: i }))
        );
      }
      if (form.challenges.length > 0) {
        await supabase.from('project_challenges').insert(
          form.challenges.map((c, i) => ({ project_id: projectId, title: c.title, description: c.description, sort_order: i }))
        );
      }
      if (form.deployment.length > 0) {
        await supabase.from('project_deployment').insert(
          form.deployment.map((d, i) => ({ project_id: projectId, step_number: i + 1, description: d.description, sort_order: i }))
        );
      }

      window.location.reload();
    } catch (err) {
      setError(toSafeErrorMessage(err, 'Failed to save project.'));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="rounded-xl bg-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          <ImageUploadField label="Card Thumbnail" hint="Small image on project cards" value={form.thumbnail_url} folder="projects-thumbnails" onChange={(v) => set('thumbnail_url', v)} />
          <ImageUploadField label="Hero Image" hint="Large image on the detail page" value={form.hero_image_url} folder="projects-hero" onChange={(v) => set('hero_image_url', v)} />

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" value={form.title} onChange={(v) => set('title', v)} />
            <Field label="Year" value={form.year} onChange={(v) => set('year', v)} />
          </div>
          <Field label="Short Description" value={form.short_description} onChange={(v) => set('short_description', v)} />
          <TextArea label="Overview" value={form.overview} onChange={(v) => set('overview', v)} />

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="GitHub URL" value={form.github_url} onChange={(v) => set('github_url', v)} />
            <Field label="Live Demo URL" value={form.live_demo_url} onChange={(v) => set('live_demo_url', v)} />
          </div>
          <Field label="Demo Video URL" value={form.demo_video_url} onChange={(v) => set('demo_video_url', v)} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Sort Order" type="number" value={form.sort_order} onChange={(v) => set('sort_order', v)} />
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40"
              >
                <option>Projects</option>
                <option>Certifications</option>
                <option>Badges</option>
                <option>Vibe Coding</option>
              </select>
            </div>
          </div>

          {/* Technologies */}
          <ArrayEditor
            label="Technologies"
            items={form.technologies}
            onChange={(items) => set('technologies', items)}
            renderItem={(item, update) => (
              <div className="grid gap-2 sm:grid-cols-3">
                <Field label="Name" value={item.name} onChange={(v) => update({ ...item, name: v })} compact />
                <Field label="Category" value={item.category ?? ''} onChange={(v) => update({ ...item, category: v || null })} compact />
                <Field label="Icon" value={item.icon ?? ''} onChange={(v) => update({ ...item, icon: v || null })} compact />
              </div>
            )}
            createItem={() => ({ id: crypto.randomUUID(), name: '', category: null, icon: null, sort_order: 0 })}
          />

          {/* System Architecture */}
          <ArrayEditor
            label="System Architecture"
            items={form.architecture}
            onChange={(items) => set('architecture', items)}
            renderItem={(item, update) => (
              <div className="space-y-2">
                <Field label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} compact />
                <TextArea label="Description" value={item.description ?? ''} onChange={(v) => update({ ...item, description: v || null })} compact />
              </div>
            )}
            createItem={() => ({ id: crypto.randomUUID(), title: '', description: null, sort_order: 0 })}
          />

          {/* Technical Challenges */}
          <ArrayEditor
            label="Technical Challenges"
            items={form.challenges}
            onChange={(items) => set('challenges', items)}
            renderItem={(item, update) => (
              <div className="space-y-2">
                <Field label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} compact />
                <TextArea label="Description" value={item.description ?? ''} onChange={(v) => update({ ...item, description: v || null })} compact />
              </div>
            )}
            createItem={() => ({ id: crypto.randomUUID(), title: '', description: null, sort_order: 0 })}
          />

          {/* Deployment Steps */}
          <ArrayEditor
            label="Deployment Steps"
            items={form.deployment}
            onChange={(items) => set('deployment', items)}
            renderItem={(item, update) => (
              <TextArea label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} compact />
            )}
            createItem={() => ({ id: crypto.randomUUID(), step_number: 0, description: '', sort_order: 0 })}
          />

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 rounded-b-3xl border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <button onClick={onClose} className="rounded-2xl px-5 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50 dark:shadow-blue-900/40"
          >
            <Save size={16} /> {saving ? 'Saving…' : 'Save Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Reusable form components ---

function Field({ label, value, onChange, type = 'text', compact = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; compact?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40 ${compact ? 'px-3 py-2' : 'px-3 py-2.5'}`} />
    </div>
  );
}

function TextArea({ label, value, onChange, compact = false }: { label: string; value: string; onChange: (v: string) => void; compact?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={compact ? 3 : 5}
        className={`w-full resize-y rounded-xl border border-slate-200 bg-white text-sm leading-relaxed text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40 ${compact ? 'px-3 py-2' : 'px-3 py-2.5'}`} />
    </div>
  );
}

function ArrayEditor<T extends { id: string }>({ label, items, onChange, renderItem, createItem }: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (item: T) => void) => React.ReactNode;
  createItem: () => T;
}) {
  const update = useCallback((id: string, newItem: T) => {
    onChange(items.map((it) => (it.id === id ? newItem : it)));
  }, [items, onChange]);

  const remove = useCallback((id: string) => {
    onChange(items.filter((it) => it.id !== id));
  }, [items, onChange]);

  const add = useCallback(() => {
    onChange([...items, createItem()]);
  }, [items, onChange, createItem]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/40">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</label>
        <button onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-blue-950/50">
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <GripVertical size={12} /> {idx + 1}
              </span>
              <button onClick={() => remove(item.id)} className="text-slate-400 transition-colors hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
            {renderItem(item, (newItem) => update(item.id, newItem))}
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400">No items yet. Click "Add" to create one.</p>}
      </div>
    </div>
  );
}
