import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  LogOut,
  Menu,
  X,
  ExternalLink,
  BookOpen,
  Award,
  BadgeCheck,
  Code2,
  FileText,
  Terminal,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSEO } from '@/hooks/useSEO';

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true, code: '00' },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban, end: false, code: '01' },
  { to: '/admin/certifications', label: 'Certifications', icon: Award, end: false, code: '02' },
  { to: '/admin/badges', label: 'Badges', icon: BadgeCheck, end: false, code: '03' },
  { to: '/admin/vibe-coding', label: 'Vibe Coding', icon: Code2, end: false, code: '04' },
  { to: '/admin/resume', label: 'Resume', icon: FileText, end: false, code: '05' },
  { to: '/admin/blog', label: 'Blog', icon: BookOpen, end: false, code: '06' },
  { to: '/admin/messages', label: 'Messages', icon: Mail, end: false, code: '07' },
];

export default function AdminLayout() {
  useSEO({
    title: 'Admin Console | Ojal Rathee',
    noindex: true,
  });

  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/signin');
  }, [loading, user, navigate]);


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0b1326]">
        <p className="font-mono text-xs text-slate-500 dark:text-[#64748B]">Authenticating operator credentials…</p>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = () => signOut().then(() => navigate('/'));

  const sidebarContent = (
    <>
      <div className="mb-6 px-2 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#dae2fd]">ADMIN CONSOLE</span>
        </div>
        <p className="font-mono text-[10px] text-slate-500 dark:text-[#64748B] uppercase tracking-wider">
          OJAL RATHEE // OPERATOR
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2563eb] text-white font-bold shadow-[0_0_14px_rgba(37,99,235,0.45)]'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-[#c3c6d7] dark:hover:bg-[#171f33] hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 dark:text-[#64748B]">{item.code}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-1.5 border-t border-slate-200 dark:border-white/[0.08] pt-4">
        <a
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#c3c6d7] dark:hover:bg-[#171f33] dark:hover:text-white transition-colors"
        >
          <ExternalLink size={15} />
          <span>Live Site</span>
        </a>
        <a
          href="/terminal"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#c3c6d7] dark:hover:bg-[#171f33] dark:hover:text-white transition-colors"
        >
          <Terminal size={15} />
          <span>Interactive Shell</span>
        </a>
        <button
          onClick={toggleTheme}
          type="button"
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-[#c3c6d7] dark:hover:bg-[#171f33] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B]">THEME</span>
          <span className="font-mono text-[10px] text-[#2563eb] dark:text-[#4edea3] font-bold flex items-center gap-1">
            {theme === 'dark' ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} className="text-blue-600" />}
            {theme === 'dark' ? 'DARK' : 'LIGHT'}
          </span>
        </button>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#EF4444] hover:bg-red-50 dark:hover:bg-[#EF4444]/10 transition-colors"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] transition-colors duration-200">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#131b2e] p-5 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#131b2e]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <p className="font-mono text-xs font-bold text-slate-900 dark:text-white uppercase">Operator Console</p>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl bg-[#2563eb] p-2 text-white"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0b1326] p-5 lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs font-bold text-slate-900 dark:text-white uppercase">NAVIGATION</p>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-slate-100 dark:bg-[#171f33] p-2 text-slate-700 dark:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-1 flex-col">{sidebarContent}</div>
        </div>
      )}

      {/* Main content */}
      <main className="px-4 pb-12 pt-20 lg:ml-64 lg:px-8 lg:pt-8 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
