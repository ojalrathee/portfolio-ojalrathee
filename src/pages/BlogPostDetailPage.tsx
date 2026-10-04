import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag, BookOpen } from 'lucide-react';
import { useBlogPost } from '@/hooks/useBlog';
import MarkdownContent from '@/components/MarkdownContent';
import { useSEO } from '@/hooks/useSEO';

export default function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug);

  useSEO({
    title: post ? `${post.title} | Ojal Rathee Engineering Blog` : 'Article | Ojal Rathee',
    description: post?.excerpt || 'Technical blog post and architecture writeup by Ojal Rathee (ojalrathee).',
    canonicalPath: slug ? `/blog/${slug}` : '/blog',
  });


  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-sm text-slate-500 dark:text-[#64748B]">
        Retrieving document analysis from telemetry log…
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-red-500 dark:text-red-400 font-mono text-sm">
          {error ? `Failed to load article: ${error}` : 'Article not found.'}
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs uppercase"
        >
          <ArrowLeft size={16} />
          <span>Back to Blog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto transition-colors duration-200">
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-[#64748B] hover:text-[#2563eb] dark:hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Engineering Logs</span>
        </Link>
      </div>

      <header className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-lg shadow-slate-200/50 dark:shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-[#64748B]">
          <span className="flex items-center gap-1.5 text-[#2563eb] dark:text-[#3B82F6] font-bold">
            <BookOpen size={14} />
            <span>ENGINEERING LOG</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {post.published_at
              ? new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'DRAFT'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
          {post.title}
        </h1>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 font-mono text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.06] text-[#2563eb] dark:text-[#b4c5ff]"
              >
                <Tag size={11} /> {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.cover_image_url && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#060e20] shadow-xl">
          <div className="aspect-video w-full">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <article className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 md:p-12 shadow-sm dark:shadow-2xl">
        <MarkdownContent content={post.content} />
      </article>

      <div className="pt-4 flex justify-between items-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-[#2563eb] dark:text-[#64748B] dark:hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Logs</span>
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs uppercase shadow-md hover:brightness-110 transition-all"
        >
          <span>Discuss with Ojal</span>
        </Link>
      </div>
    </div>
  );
}
