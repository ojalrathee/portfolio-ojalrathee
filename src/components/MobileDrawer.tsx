import { NavLink } from 'react-router-dom';
import { X, ExternalLink, Sun, Moon } from 'lucide-react';
import { CONSOLE_NAV_ITEMS } from '@/lib/navigation';
import { useTheme } from '@/context/ThemeContext';
import resumePDF from '@/assets/ojal_rathee_resume.pdf';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white/98 dark:bg-[#0b1326]/95 backdrop-blur-2xl p-6 text-slate-900 dark:text-[#dae2fd] animate-fadeIn transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-[#c3c6d7]">
            OPERATOR NAVIGATION //
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.1] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col justify-center gap-2.5 py-6">
        {CONSOLE_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                isActive
                  ? 'bg-[#2563eb] text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'bg-slate-100 dark:bg-[#131b2e] text-slate-700 dark:text-[#c3c6d7] hover:bg-slate-200 dark:hover:bg-[#171f33] hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <span>{item.label}</span>
            <span className="font-mono text-xs opacity-75">{item.code}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/[0.08]">
        <div className="flex items-center justify-between gap-3">
          <a
            href={resumePDF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563eb] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all"
          >
            <span>DOWNLOAD CV</span>
            <ExternalLink size={13} />
          </a>

          <button
            onClick={toggleTheme}
            type="button"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] font-mono text-xs font-bold text-slate-800 dark:text-[#4edea3] transition-colors"
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-blue-600" />}
            <span>{theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 pt-2 font-mono text-xs text-slate-500 dark:text-[#64748B]">
          <a href="https://github.com/ojalrathee" target="_blank" rel="me noopener noreferrer" title="Ojal Rathee on GitHub" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            GitHub
          </a>
          <span>•</span>
          <a href="https://www.linkedin.com/in/ojalrathee/" target="_blank" rel="me noopener noreferrer" title="Ojal Rathee on LinkedIn" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            LinkedIn
          </a>
          <span>•</span>
          <a href="https://x.com/OjalRathee" target="_blank" rel="me noopener noreferrer" title="Ojal Rathee on X" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            X
          </a>
        </div>
      </div>
    </div>
  );
}
