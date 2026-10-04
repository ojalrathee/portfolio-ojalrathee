import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { useBlogPosts, type BlogPost } from '@/hooks/useBlog';

export default function BlogPage() {
  const { posts, loading, error } = useBlogPosts();
  const published = posts.filter((p) => p.published);

  return (
    <div className="space-y-10 pb-16 transition-colors duration-200">
      {/* 1. Header */}
      <div className="relative rounded-3xl bg-white/90 dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-lg shadow-slate-200/50 dark:shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
            <span>/ LOG</span>
            <span>ENGINEERING LOGS &amp; DEEP DIVES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
            Thoughts on Cloud, DevOps &amp; Engineering.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
            Technical notes, architecture blueprints, and insights from building cloud infrastructure and web applications.
          </p>
        </div>
      </div>

      {loading && (
        <div className="p-8 text-center font-mono text-sm text-slate-500 dark:text-[#64748B]">
          Fetching engineering logs…
        </div>
      )}

      {error && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-mono text-sm">
          Failed to load blog posts: {error}
        </div>
      )}

      {!loading && !error && published.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-[#131b2e] p-12 text-center">
          <BookOpen size={36} className="mx-auto text-slate-400 dark:text-[#64748B] mb-3" />
          <p className="font-mono text-sm text-slate-600 dark:text-[#c3c6d7]">No published logs found yet.</p>
        </div>
      )}

      {/* Grid of posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {published.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#2563eb] dark:text-[#64748B] dark:hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Home Console</span>
        </Link>
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-sm dark:shadow-xl hover:border-blue-300 dark:hover:border-[#3B82F6]/50 hover:shadow-md dark:hover:shadow-[0_12px_30px_-10px_rgba(37,99,235,0.25)] transition-all"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-[#060e20] border-b border-slate-200 dark:border-white/[0.06]">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-75"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-3xl font-extrabold text-slate-300 dark:text-[#64748B]">
            LOG // {post.title.charAt(0)}
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 flex flex-1 flex-col justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-[#64748B] mb-2">
            <Calendar size={13} />
            <span>
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'DRAFT'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-[#dae2fd] group-hover:text-[#2563eb] dark:group-hover:text-[#3B82F6] transition-colors">
            {post.title}
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/[0.06]">
          <span className="font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Read Article</span>
            <ArrowRight size={14} />
          </span>
          {post.tags?.length > 0 && (
            <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#171f33]">
              {post.tags[0]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
