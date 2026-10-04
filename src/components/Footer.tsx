import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-12 border-t border-slate-200 dark:border-white/[0.06] transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-[#64748B] font-mono text-[11px]">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
          <span>© {new Date().getFullYear()} Ojal Rathee.</span>
          <span className="hidden sm:inline text-slate-300 dark:text-white/10">•</span>
          <span>Cloud Software Engineer Portfolio</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-slate-600 dark:text-[#c3c6d7]">
          <span className="flex items-center gap-1.5 text-[#10B981] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            SYSTEM ONLINE
          </span>

          <span className="text-slate-300 dark:text-white/10">•</span>

          <span className="text-slate-400 dark:text-slate-500 hidden xs:inline">LATENCY: 18MS</span>

          <span className="text-slate-300 dark:text-white/10 hidden xs:inline">•</span>

          {/* Tiny Admin Button to access admin page easily */}
          <Link
            to="/admin"
            title="Access Admin Console"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:bg-[#171f33] dark:hover:bg-[#222a3d] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-[#c3c6d7] dark:hover:text-white transition-all font-mono text-[11px] font-bold tracking-wider shadow-sm group cursor-pointer"
          >
            <Shield size={12} className="text-[#2563eb] dark:text-[#3B82F6] group-hover:scale-110 transition-transform" />
            <span>ADMIN</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
