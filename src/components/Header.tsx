import { useState } from 'react';
import { Download, Mail, Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import resumePDF from '@/assets/ojal_rathee_resume.pdf';
import profilePhoto from '@/assets/desktop_magic.png';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const email = 'ojalrathee.working@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-20 bg-white/90 dark:bg-[#060e20]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] shadow-sm dark:shadow-[0_1px_8px_rgba(0,0,0,0.4)] transition-colors duration-200">
      <div className="h-full w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Window Controls + Console Title + Status Indicators */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Traffic light window controls */}
          <div className="flex items-center gap-2 pl-1">
            <span className="w-3 h-3 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400">
            <span className="text-slate-400 dark:text-[#64748B]">SYS //</span>
            <span className="text-slate-800 dark:text-[#dae2fd]">OPERATOR CONSOLE</span>
          </div>

          <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-white/10" />

          {/* Telemetry badges */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="font-mono text-[11px] font-bold tracking-wider text-[#00a572] dark:text-[#4edea3]">
                STATUS: AVAILABLE
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="text-slate-400 dark:text-[#64748B]">TZ:</span>
              <span className="text-slate-700 dark:text-[#dae2fd]">GMT+5:30</span>
            </div>

            <div className="hidden xl:flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="text-slate-400 dark:text-[#64748B]">RESP:</span>
              <span className="text-[#2563eb] dark:text-[#3B82F6] font-semibold">&lt;24H</span>
            </div>
          </div>
        </div>

        {/* Right: Email chip + Theme Toggle + Download CV + Profile capsule */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Email button with copy feedback */}
          <button
            onClick={handleCopyEmail}
            title="Click to copy email"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171f33] dark:hover:bg-[#222a3d] border border-slate-200 dark:border-white/[0.06] transition-colors group cursor-pointer"
          >
            <Mail size={14} className="text-slate-500 dark:text-slate-400 group-hover:text-[#2563eb] dark:group-hover:text-[#3B82F6] transition-colors" />
            <span className="font-mono text-[11px] text-slate-700 dark:text-[#c3c6d7] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {copied ? 'Copied to clipboard!' : email}
            </span>
          </button>

          {/* Theme Quick Switcher */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle system color theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171f33] dark:hover:bg-[#222a3d] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-[#c3c6d7] hover:text-[#2563eb] dark:hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-amber-400 animate-in fade-in" />
            ) : (
              <Moon size={17} className="text-blue-600 animate-in fade-in" />
            )}
          </button>

          {/* Download CV CTA */}
          <a
            href={resumePDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#2563eb] text-white font-semibold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all"
          >
            <Download size={14} />
            <span>Download CV</span>
            <ArrowUpRight size={13} className="hidden sm:inline opacity-70" />
          </a>

          {/* Profile Capsule */}
          <div className="flex items-center gap-2.5 sm:gap-3 pl-1 sm:pl-2">
            <div className="text-right hidden sm:block">
              <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-[#dae2fd] leading-tight">
                Ojal Rathee
              </div>
              <div className="font-mono text-[10px] font-bold tracking-wider text-slate-400 dark:text-[#64748B] uppercase">
                OPERATOR / 01
              </div>
            </div>
            <div className="relative">
              <img
                src={profilePhoto}
                alt="Ojal Rathee"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#3B82F6]/40 shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white dark:border-[#060e20]" />
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={onMenuToggle}
            aria-label="Toggle navigation"
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
