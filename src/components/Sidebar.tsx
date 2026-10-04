import { NavLink } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { CONSOLE_NAV_ITEMS } from '@/lib/navigation';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-4 lg:left-6 top-24 bottom-6 w-64 z-30 hidden lg:flex flex-col rounded-3xl bg-white/95 dark:bg-[#131b2e]/90 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] shadow-lg shadow-slate-200/50 dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] p-5 justify-between transition-colors duration-200">
      {/* Top Section */}
      <div className="flex flex-col gap-5">
        {/* Node Active Header */}
        <div className="flex items-center justify-between pb-3 bg-slate-50 dark:bg-[#171f33]/60 rounded-xl p-3 border border-slate-200/80 dark:border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] dark:bg-[#4edea3] shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-[#dae2fd] tracking-wider uppercase">
              NODE // ACTIVE
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400 dark:text-[#64748B]">v2.6</span>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5" aria-label="Console Navigation">
          {CONSOLE_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 rounded-xl transition-all font-sans text-sm ${
                  isActive
                    ? 'bg-[#2563eb] text-white font-bold shadow-[0_0_14px_rgba(37,99,235,0.4)]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#c3c6d7] dark:hover:bg-[#222a3d] dark:hover:text-[#dae2fd]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="font-semibold text-[15px]">{item.label}</span>
                  <span
                    className={`font-mono text-[11px] ${
                      isActive ? 'text-white/80' : 'text-slate-400 dark:text-[#64748B]'
                    }`}
                  >
                    {item.code}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4 pt-4 border-t border-slate-200 dark:border-white/[0.06]">
        {/* Theme pill */}
        <button
          onClick={toggleTheme}
          type="button"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171f33] dark:hover:bg-[#222a3d] border border-slate-200/80 dark:border-white/[0.04] transition-colors cursor-pointer group"
          title="Toggle system color theme"
        >
          <span className="font-mono text-[11px] text-slate-500 dark:text-[#64748B] group-hover:text-slate-800 dark:group-hover:text-slate-300">
            THEME
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold text-[#2563eb] dark:text-[#4edea3]">
              {theme === 'dark' ? 'DARK' : 'LIGHT'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                theme === 'dark' ? 'bg-[#00a572]' : 'bg-[#2563eb]'
              }`}
            />
          </div>
        </button>

        {/* Social channels */}
        <div className="flex items-center justify-between px-2 text-slate-500 dark:text-[#64748B] font-mono text-[11px]">
          <a
            href="https://github.com/ojalrathee"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            GH
          </a>
          <span className="text-slate-300 dark:text-white/10">•</span>
          <a
            href="https://www.linkedin.com/in/ojalrathee/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            LI
          </a>
          <span className="text-slate-300 dark:text-white/10">•</span>
          <a
            href="https://x.com/OjalRathee"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            X
          </a>
          <span className="text-slate-300 dark:text-white/10">•</span>
          <NavLink to="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            RSS
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
