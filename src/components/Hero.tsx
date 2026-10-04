import { useEffect, useState } from 'react';
import { ChevronDown, Download, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import resumePDF from '@/assets/ojal_rathee_resume.pdf';
import profilePhoto from '@/assets/desktop_magic.png';

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.2 2H21l-6.5 7.4L22 22h-6.8l-4.7-6.2L4.9 22H2l7-8L2 2h7l4.3 5.7L18.2 2zm-2.4 18h1.9L8.2 4H6.1l9.7 16z" />
    </svg>
  );
}

function getInitialExpansionState() {
  if (typeof window === 'undefined') return true;
  return !window.matchMedia('(max-width: 1023px)').matches;
}

const iconButtonClass = 'rounded-lg bg-slate-100 p-2.5 transition-all hover:scale-110 dark:bg-slate-800';

export default function Hero() {
  const [isExpanded, setIsExpanded] = useState(getInitialExpansionState);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsExpanded(!event.matches);
    };

    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none md:p-7">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="ml-auto font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">operator console</span>
        </div>

        <div className="hidden lg:grid lg:grid-cols-[1.15fr_1fr_1fr] lg:divide-x lg:divide-slate-100 lg:dark:divide-slate-800">
          <div className="flex items-center gap-5 pr-7">
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-blue-600 bg-slate-100 p-1 shadow-md dark:bg-slate-800">
              <img src={profilePhoto} alt="Ojal Rathee" className="h-full w-full rounded-2xl object-cover object-top" />
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Ojal <span className="font-medium text-slate-500">Rathee</span></p>
              <p className="mt-1 text-base font-semibold text-slate-700 dark:text-slate-200">Cloud Software Engineer</p>
              <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">operator / 01</p>
            </div>
          </div>

          <div className="px-7">
            <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">System Status</p>
            <div className="space-y-3 font-mono text-sm text-slate-600 dark:text-slate-300">
              <p><span className="inline-block w-24 text-slate-400">status:</span><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />available</p>
              <p><span className="inline-block w-24 text-slate-400">tz:</span> GMT+5:30</p>
              <p><span className="inline-block w-24 text-slate-400">response:</span> &lt;24h</p>
            </div>
          </div>

          <div className="flex flex-col items-end pl-7">
            <a href={resumePDF} target="_blank" rel="noopener noreferrer" className="inline-flex w-full max-w-[236px] items-center justify-center gap-2 rounded-2xl border-2 border-blue-600 px-4 py-4 text-base font-bold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white dark:text-blue-400">
              <Download size={19} /> Download CV <ExternalLink size={14} />
            </a>
            <a href="mailto:ojalrathee.working@gmail.com" className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400">
              <Mail size={18} /> ojalrathee.working@gmail.com
            </a>
            <div className="mt-5 flex gap-2">
              <a href="https://github.com/ojalrathee" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`${iconButtonClass} text-slate-700 hover:bg-slate-900 hover:text-white dark:text-slate-200`}><Github size={17} /></a>
              <a href="https://www.linkedin.com/in/ojalrathee/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${iconButtonClass} text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white dark:text-[#4D9CE8]`}><Linkedin size={17} /></a>
              <a href="https://x.com/OjalRathee" target="_blank" rel="noopener noreferrer" aria-label="X" className={`${iconButtonClass} text-slate-900 hover:bg-black hover:text-white dark:text-white`}><XIcon size={15} /></a>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="flex items-center gap-4 py-5">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-blue-600 bg-slate-100 p-1 shadow-md dark:bg-slate-800">
              <img src={profilePhoto} alt="Ojal Rathee" className="h-full w-full rounded-2xl object-cover object-top" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Ojal <span className="font-medium text-slate-500">Rathee</span></p>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">AWS Cloud &amp; Web Developer</p>
              <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">operator / 01</p>
            </div>
          </div>

          <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="min-h-0">
              <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                  <span><span className="text-slate-400">status:</span> <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />available</span>
                  <span><span className="text-slate-400">tz:</span> IST (GMT+5:30)</span>
                </div>
              </div>

              <div className="border-t border-slate-100 py-5 dark:border-slate-800">
                <a href="mailto:ojalrathee@gmail.com" className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400">
                  <Mail size={17} /> <span className="break-all">ojalrathee@gmail.com</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
                <a href={resumePDF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-blue-900/40">
                  <Download size={16} /> Download CV <ExternalLink size={13} />
                </a>
                <div className="flex gap-2">
                  <a href="https://github.com/ojalrathee" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`${iconButtonClass} text-slate-700 hover:bg-slate-900 hover:text-white dark:text-slate-200`}><Github size={16} /></a>
                  <a href="https://www.linkedin.com/in/ojalrathee/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${iconButtonClass} text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white dark:text-[#4D9CE8]`}><Linkedin size={16} /></a>
                  <a href="https://x.com/OjalRathee" target="_blank" rel="noopener noreferrer" aria-label="X" className={`${iconButtonClass} text-slate-900 hover:bg-black hover:text-white dark:text-white`}><XIcon size={14} /></a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1 flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse operator console' : 'Expand operator console'}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
            >
              <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
