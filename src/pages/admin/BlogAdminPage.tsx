import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, Calendar, Code2 } from 'lucide-react';
import MarkdownContent from '@/components/MarkdownContent';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';
import type { BlogPost } from '@/hooks/useBlog';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | 'new' | null>(null);

  const load = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts((data as BlogPost[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    load();
  };

  if (loading) return <p className="text-slate-400">Loading blog posts…</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Blog Posts</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{posts.length} post{posts.length !== 1 ? 's' : ''} total.</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-blue-900/40"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="h-14 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              {p.cover_image_url && <img src={p.cover_image_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-bold text-slate-900 dark:text-white">{p.title}</h3>
                {p.published ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <Eye size={10} /> Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                    <EyeOff size={10} /> Draft
                  </span>
                )}
              </div>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{p.excerpt}</p>
              <p className="mt-1 text-xs text-slate-400">
                {p.published_at ? new Date(p.published_at).toLocaleDateString() : 'Not published'} · /{p.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(p)}
                className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/50"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(p.id, p.title)}
                className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/40"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <BlogFormModal post={editing === 'new' ? null : editing} onClose={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

function BlogFormModal({ post, onClose }: { post: BlogPost | null; onClose: () => void }) {
  const [form, setForm] = useState({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    cover_image_url: post?.cover_image_url ?? '',
    tags: (post?.tags ?? []).join(', '),
    published: post?.published ?? false,
    published_at: post?.published_at ? post.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentMode, setContentMode] = useState<'write' | 'preview'>('write');

  const set = (key: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

      const row = {
        title: form.title,
        slug,
        excerpt: form.excerpt,
        content: form.content,
        cover_image_url: form.cover_image_url || null,
        tags,
        published: form.published,
        published_at: form.published ? form.published_at : null,
        updated_at: new Date().toISOString(),
      };

      if (post) {
        const { error: updErr } = await supabase.from('blog_posts').update(row).eq('id', post.id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase.from('blog_posts').insert({ ...row, created_at: new Date().toISOString() });
        if (insErr) throw insErr;
      }
      onClose();
    } catch (err) {
      setError(toSafeErrorMessage(err, 'Failed to save post.'));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{post ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={onClose} className="rounded-xl bg-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Slug (URL)</label>
              <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="my-first-post"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
            </div>
          </div>

          <ImageUploadField label="Cover Image" value={form.cover_image_url} folder="blog" placeholder="https://example.com/image.jpg" onChange={(v) => set('cover_image_url', v)} />

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Excerpt</label>
            <textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={2}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content</label>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Markdown supported</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-1 border-b border-slate-200 p-1.5 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setContentMode('write')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${contentMode === 'write' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                >
                  <Code2 size={13} /> Write
                </button>
                <button
                  type="button"
                  onClick={() => setContentMode('preview')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${contentMode === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                >
                  <Eye size={13} /> Preview
                </button>
              </div>
              {contentMode === 'write' ? (
                <textarea value={form.content} onChange={(e) => set('content', e.target.value)} rows={12} placeholder={'# Heading\\n\\nWrite **bold** text, add [links](https://example.com), lists, quotes, and code blocks.'}
                  className="w-full resize-y border-0 bg-transparent px-3 py-2.5 text-sm leading-relaxed text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 dark:text-white dark:focus:ring-blue-900/40" />
              ) : (
                <div className="min-h-[300px] px-4 py-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {form.content.trim() ? <MarkdownContent content={form.content} /> : <p className="text-slate-400">Nothing to preview yet.</p>}
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-400">Use # headings, **bold**, *italic*, [links](https://example.com), - lists, &gt; quotes, and fenced code blocks.</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="AWS, DevOps, Serverless"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Publish Date</label>
              <div className="relative">
                <Calendar size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="date" value={form.published_at} onChange={(e) => set('published_at', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="h-4 w-4 rounded accent-blue-600" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Published</span>
              </label>
            </div>
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
            <Save size={16} /> {saving ? 'Saving…' : 'Save Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
