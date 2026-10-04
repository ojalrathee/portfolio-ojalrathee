import { useEffect, useState } from 'react';
import { FolderKanban, Mail, BookOpen, Award, Terminal } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalProjects: number;
  totalMessages: number;
  totalBlogPosts: number;
  totalCertifications: number;
  latestProject: string | null;
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: projects }, { count: totalMessages }, { count: totalBlogPosts }, { count: totalCertifications }] = await Promise.all([
        supabase.from('projects').select('title, created_at').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('certifications').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalProjects: projects?.length ?? 0,
        totalMessages: totalMessages ?? 0,
        totalBlogPosts: totalBlogPosts ?? 0,
        totalCertifications: totalCertifications ?? 0,
        latestProject: (projects?.[0] as { title?: string } | undefined)?.title ?? null,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="font-mono text-xs text-slate-500 dark:text-[#64748B]">Querying console telemetry…</p>;

  const cards = [
    { label: 'Total Projects', value: stats?.totalProjects ?? 0, icon: FolderKanban, color: 'text-[#2563eb] dark:text-[#3B82F6] bg-blue-50 dark:bg-[#2563eb]/20' },
    { label: 'Certifications', value: stats?.totalCertifications ?? 0, icon: Award, color: 'text-[#10B981] bg-emerald-50 dark:bg-[#10B981]/20' },
    { label: 'Blog Posts', value: stats?.totalBlogPosts ?? 0, icon: BookOpen, color: 'text-[#7d4ce7] dark:text-[#d0bcff] bg-purple-50 dark:bg-[#7d4ce7]/25' },
    { label: 'Total Messages', value: stats?.totalMessages ?? 0, icon: Mail, color: 'text-[#F59E0B] bg-amber-50 dark:bg-[#F59E0B]/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
          TELEMETRY // SNAPSHOT
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">Overview</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-[#64748B]">Live system health and content catalog summary.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#131b2e] p-5 shadow-sm space-y-3"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#dae2fd]">{card.value}</p>
                <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#64748B]">
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {stats?.latestProject && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-[#2563eb] dark:text-[#3B82F6]" />
            <div>
              <div className="font-mono text-[10px] text-slate-400 dark:text-[#64748B] uppercase">LATEST DISPATCH</div>
              <div className="font-bold text-sm text-slate-900 dark:text-[#dae2fd]">{stats.latestProject}</div>
            </div>
          </div>
          <span className="font-mono text-[10px] text-[#00a572] dark:text-[#10B981] font-semibold bg-emerald-50 dark:bg-[#10B981]/15 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-[#10B981]/25">
            READY
          </span>
        </div>
      )}
    </div>
  );
}
