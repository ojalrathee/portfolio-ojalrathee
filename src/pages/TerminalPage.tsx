import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Terminal as TerminalIcon,
  ArrowLeft,
  Eraser,
  Keyboard,
  Cloud,
  Box,
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
}

export default function TerminalPage() {
  const navigate = useNavigate();
  const { projects } = useProjects();

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [, setCommandHistory] = useState<string[]>([]);
  const [, setHistoryIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Initial welcome command execution
  useEffect(() => {
    setHistory([
      {
        id: 'initial-help',
        command: 'help',
        output: (
          <div className="pl-2 space-y-2 text-[#c3c6d7]">
            <p className="font-mono text-xs text-[#3B82F6] font-bold">
              SYSTEM COMMAND DIRECTORY:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-1 font-mono text-xs">
              <div className="flex items-baseline gap-3">
                <span className="text-[#4edea3] font-bold w-24">about</span>
                <span className="text-[#64748B]">Identity, cloud background &amp; focus</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[#3B82F6] font-bold w-24">skills</span>
                <span className="text-[#64748B]">AWS, VPC, Terraform, React &amp; stack</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[#d0bcff] font-bold w-24">projects</span>
                <span className="text-[#64748B]">Verified deployments &amp; case studies</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[#F59E0B] font-bold w-24">experience</span>
                <span className="text-[#64748B]">Real career record &amp; education</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[#b4c5ff] font-bold w-24">contact</span>
                <span className="text-[#64748B]">Direct email &amp; social endpoints</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[#EF4444] font-bold w-24">clear</span>
                <span className="text-[#64748B]">Purge current shell viewport buffer</span>
              </div>
            </div>
          </div>
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = useCallback(
    (rawCmd: string) => {
      const trimmed = rawCmd.trim();
      if (!trimmed) return;

      const parts = trimmed.split(/\s+/);
      const main = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      if (main === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      let outputNode: React.ReactNode;

      switch (main) {
        case 'help':
          outputNode = (
            <div className="pl-2 space-y-2 text-[#c3c6d7]">
              <p className="font-mono text-xs text-[#3B82F6] font-bold">
                SYSTEM COMMAND DIRECTORY:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-xs">
                <div><span className="text-[#4edea3] font-bold w-24 inline-block">about</span> Identity &amp; cloud bio</div>
                <div><span className="text-[#3B82F6] font-bold w-24 inline-block">skills</span> Engineering stack &amp; toolchain</div>
                <div><span className="text-[#d0bcff] font-bold w-24 inline-block">projects</span> Production workload portfolio</div>
                <div><span className="text-[#F59E0B] font-bold w-24 inline-block">experience</span> Real work history &amp; education</div>
                <div><span className="text-[#b4c5ff] font-bold w-24 inline-block">contact</span> Communication endpoints</div>
                <div><span className="text-[#EF4444] font-bold w-24 inline-block">clear</span> Flush current screen</div>
                <div><span className="text-[#4edea3] font-bold w-24 inline-block">ping</span> Echo network latency probe</div>
                <div><span className="text-[#3B82F6] font-bold w-24 inline-block">whoami</span> Inspect active operator session</div>
              </div>
            </div>
          );
          break;

        case 'about':
          outputNode = (
            <div className="pl-2 space-y-2 font-mono text-xs text-[#c3c6d7]">
              <div className="text-[#dae2fd] font-bold text-sm">Ojal Rathee — Cloud &amp; Software Engineer</div>
              <p className="text-slate-300 leading-relaxed max-w-2xl font-sans text-sm">
                Final-year BCA student specializing in AWS Cloud Architecture, Computer Networking, and JavaScript development.
                Passionate about serverless computing, infrastructure automation with Terraform, and shipping reliable web applications.
              </p>
              <div className="text-[#4edea3]">Location: India (GMT+5:30) • Open for Opportunities</div>
            </div>
          );
          break;

        case 'skills':
          outputNode = (
            <div className="pl-2 space-y-2 font-mono text-xs text-[#c3c6d7]">
              <div className="text-[#3B82F6] font-bold">CORE TECHNICAL ARSENAL:</div>
              <div className="space-y-1 text-slate-300">
                <div><span className="text-white font-bold">Cloud &amp; Serverless:</span> AWS (Lambda, DynamoDB, S3, CloudFront, VPC, IAM, Route 53)</div>
                <div><span className="text-white font-bold">Frontend &amp; Languages:</span> TypeScript, JavaScript, React, Tailwind CSS, Node.js</div>
                <div><span className="text-white font-bold">DevOps &amp; IaC:</span> Terraform, GitHub Actions CI/CD, Git, Linux, Bash</div>
                <div><span className="text-white font-bold">Networking:</span> TCP/IP, DNS, Subnets, Routing, Security Groups</div>
              </div>
            </div>
          );
          break;

        case 'projects':
          outputNode = (
            <div className="pl-2 space-y-3 font-mono text-xs text-[#c3c6d7]">
              <div className="text-[#d0bcff] font-bold">VERIFIED REPOSITORIES &amp; DEPLOYMENTS:</div>
              <div className="space-y-2">
                {projects.map((p, idx) => (
                  <div key={p.id} className="space-y-0.5">
                    <div className="text-white font-bold">
                      {String(idx + 1).padStart(2, '0')}. {p.title} // [{p.category}]
                    </div>
                    <p className="text-[#64748B] font-sans text-xs">{p.short_description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
          break;

        case 'experience':
          outputNode = (
            <div className="pl-2 space-y-2 font-mono text-xs text-[#c3c6d7]">
              <div className="text-[#F59E0B] font-bold">EXPERIENCE &amp; EDUCATION TIMELINE:</div>
              <div className="space-y-2 text-slate-300">
                <div>
                  <span className="text-white font-bold">Cloud Engineering Intern</span> — 2025 - PRESENT<br />
                  <span className="text-[#64748B]">AWS Learning &amp; Freelance Projects: Designing serverless workloads &amp; cloud automation.</span>
                </div>
                <div>
                  <span className="text-white font-bold">Frontend Developer</span> — 2024 - PRESENT<br />
                  <span className="text-[#64748B]">Academic and Personal Projects: Responsive React, TypeScript &amp; cloud-integrated UX.</span>
                </div>
                <div>
                  <span className="text-white font-bold">Bachelor of Computer Applications</span> — 2023 - 2026<br />
                  <span className="text-[#64748B]">Final-year BCA student: Software engineering, networking, cloud systems &amp; databases.</span>
                </div>
              </div>
            </div>
          );
          break;

        case 'contact':
          outputNode = (
            <div className="pl-2 space-y-2 font-mono text-xs text-[#c3c6d7]">
              <div className="text-[#b4c5ff] font-bold">COMMUNICATION ENDPOINTS:</div>
              <div className="space-y-1 text-slate-300">
                <div>Email: <a href="mailto:ojalrathee.working@gmail.com" className="text-[#3B82F6] underline">ojalrathee.working@gmail.com</a></div>
                <div>GitHub: <a href="https://github.com/ojalrathee" target="_blank" rel="noopener noreferrer" className="text-white underline">github.com/ojalrathee</a></div>
                <div>LinkedIn: <a href="https://www.linkedin.com/in/ojalrathee/" target="_blank" rel="noopener noreferrer" className="text-white underline">linkedin.com/in/ojalrathee</a></div>
                <div>Timezone: India (GMT+5:30) • Response time: &lt; 24h</div>
              </div>
            </div>
          );
          break;

        case 'ping':
          outputNode = (
            <div className="pl-2 font-mono text-xs text-[#4edea3] space-y-1">
              <div>PING portfolio.infra (127.0.0.1): 56 data bytes</div>
              <div>64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.018 ms</div>
              <div>64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.021 ms</div>
              <div className="text-[#64748B] pt-1">--- portfolio.infra ping statistics: 0% packet loss, rtt min/avg/max = 0.018/0.019/0.021 ms ---</div>
            </div>
          );
          break;

        case 'whoami':
          outputNode = (
            <div className="pl-2 font-mono text-xs text-[#d0bcff]">
              guest-operator@mesh-node-01 (permissions: READ_SYSTEM, EXEC_TELEMETRY)
            </div>
          );
          break;

        case 'cat':
          if (!arg) {
            outputNode = <div className="pl-2 font-mono text-xs text-[#EF4444]">cat: missing file parameter</div>;
          } else if (arg.includes('bio') || arg.includes('about')) {
            executeCommand('about');
            return;
          } else {
            outputNode = <div className="pl-2 font-mono text-xs text-[#EF4444]">cat: {arg}: No such file or directory</div>;
          }
          break;

        case 'exit':
          navigate('/');
          return;

        default:
          outputNode = (
            <div className="pl-2 font-mono text-xs text-[#EF4444]">
              bash: command not found: {main}. Type "help" to inspect catalog.
            </div>
          );
      }

      setHistory((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          command: trimmed,
          output: outputNode,
        },
      ]);
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIdx(-1);
      setInput('');
    },
    [projects, navigate]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  return (
    <div className="space-y-10 pb-16 transition-colors duration-200">
      {/* 1. Header Overview Panel */}
      <div className="relative rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-lg shadow-slate-200/50 dark:shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider">
              <span>/ SH</span>
              <span>INTERACTIVE OPERATOR SHELL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
              Terminal Emulator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
              Execute shell commands, inspect system architecture nodes, and query projects directly in the browser terminal.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs bg-slate-100 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.06] px-4 py-2.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-[#00a572] dark:text-[#4edea3] font-bold">SESSION LIVE</span>
            <span className="text-slate-300 dark:text-white/10">•</span>
            <span className="text-slate-500 dark:text-[#64748B]">TTY 01</span>
          </div>
        </div>
      </div>

      {/* 2. Main Terminal Console Container */}
      <div className="relative rounded-2xl bg-[#060e20] border border-slate-300 dark:border-white/[0.08] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Top Window Bar / Traffic Lights */}
        <div className="h-11 bg-[#131b2e] border-b border-white/[0.06] px-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHistory([])}
                title="Clear Console"
                className="w-3 h-3 rounded-full bg-[#EF4444] shadow-[0_0_6px_rgba(239,68,68,0.5)] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => executeCommand('help')}
                title="Reset View"
                className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_6px_rgba(245,158,11,0.5)] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => executeCommand('whoami')}
                title="Toggle Status"
                className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.5)] cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#64748B]">
              <TerminalIcon size={14} />
              <span>ojalrathee@portfolio ~ bash</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-[#64748B]">
            <span className="px-2 py-0.5 rounded bg-[#171f33] text-[#c3c6d7]">UTF-8</span>
            <span className="text-[#4edea3] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              CONNECTED
            </span>
          </div>
        </div>

        {/* Terminal Viewport */}
        <div
          ref={viewportRef}
          onClick={() => inputRef.current?.focus()}
          className="p-5 sm:p-6 min-h-[380px] max-h-[500px] overflow-y-auto font-mono text-xs sm:text-sm space-y-4 cursor-text bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.06),_transparent_70%)]"
        >
          {/* Welcome ASCII Meta Header */}
          <div className="space-y-1 text-[#64748B]">
            <div className="text-[#3B82F6] font-bold">
              Portfolio Terminal — Cloud Architecture Shell
            </div>
            <div>
              Type <span className="text-[#b4c5ff] font-bold">"help"</span> for commands,{' '}
              <span className="text-[#b4c5ff] font-bold">"about"</span> for profile, or{' '}
              <span className="text-[#b4c5ff] font-bold">"clear"</span> to wipe screen.
            </div>
          </div>

          {/* History stream */}
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#4edea3] font-bold">ojalrathee@portfolio</span>
                  <span className="text-[#64748B]">:</span>
                  <span className="text-[#3B82F6]">~</span>
                  <span className="text-[#64748B]">$</span>
                  <span className="text-[#dae2fd]">{item.command}</span>
                </div>
                <div>{item.output}</div>
              </div>
            ))}
          </div>

          {/* Prompt input row */}
          <div className="flex items-center gap-2 pt-2 text-[#dae2fd]">
            <span className="text-[#4edea3] font-bold whitespace-nowrap">ojalrathee@portfolio</span>
            <span className="text-[#64748B]">:</span>
            <span className="text-[#3B82F6]">~</span>
            <span className="text-[#64748B]">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs sm:text-sm text-[#dae2fd] focus:ring-0 p-0 caret-[#10B981]"
            />
          </div>
        </div>

        {/* Quick Command Tray */}
        <div className="bg-[#131b2e] border-t border-white/[0.06] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider mr-1">
              QUICK QUERY:
            </span>
            <button
              onClick={() => executeCommand('about')}
              className="px-2.5 py-1 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#4edea3] font-mono text-[11px] transition-colors border border-white/[0.04] cursor-pointer"
            >
              <span>cat </span>
              <span className="text-[#dae2fd]">bio.md</span>
            </button>
            <button
              onClick={() => executeCommand('skills')}
              className="px-2.5 py-1 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#3B82F6] font-mono text-[11px] transition-colors border border-white/[0.04] cursor-pointer"
            >
              <span>skills </span>
              <span className="text-[#dae2fd]">--all</span>
            </button>
            <button
              onClick={() => executeCommand('projects')}
              className="px-2.5 py-1 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#d0bcff] font-mono text-[11px] transition-colors border border-white/[0.04] cursor-pointer"
            >
              <span>ls -la </span>
              <span className="text-[#dae2fd]">projects/</span>
            </button>
            <button
              onClick={() => executeCommand('experience')}
              className="px-2.5 py-1 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#F59E0B] font-mono text-[11px] transition-colors border border-white/[0.04] cursor-pointer"
            >
              <span>git </span>
              <span className="text-[#dae2fd]">log</span>
            </button>
            <button
              onClick={() => executeCommand('contact')}
              className="px-2.5 py-1 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#b4c5ff] font-mono text-[11px] transition-colors border border-white/[0.04] cursor-pointer"
            >
              <span>curl </span>
              <span className="text-[#dae2fd]">/contact</span>
            </button>
          </div>

          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1.5 text-[#64748B] hover:text-[#EF4444] font-mono text-[11px] transition-colors px-2 py-1 rounded hover:bg-[#171f33] cursor-pointer"
            title="Purge Shell"
          >
            <Eraser size={14} />
            <span>CLEAR</span>
          </button>
        </div>
      </div>

      {/* 3. Technical Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Card 1 */}
        <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#2563eb] dark:text-[#3B82F6] uppercase tracking-wider font-bold">
                CLOUD ARCHITECTURE
              </span>
              <Cloud size={18} className="text-[#2563eb] dark:text-[#3B82F6]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-[#dae2fd]">AWS Serverless</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
              Infrastructure automation using Terraform, AWS Lambda, API Gateway, DynamoDB, and CloudFront.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#171f33] rounded-xl p-3 border border-slate-200 dark:border-white/[0.04]">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 dark:text-[#64748B]">
              <span>STACK STATUS</span>
              <span className="text-[#00a572] dark:text-[#4edea3] font-bold">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#00a572] dark:text-[#4edea3] uppercase tracking-wider font-bold">
                CI/CD PIPELINES
              </span>
              <Box size={18} className="text-[#00a572] dark:text-[#4edea3]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-[#dae2fd]">GitHub Actions</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
              Automated testing, linting, building, and zero-downtime deployment pipelines directly into AWS S3.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#171f33] rounded-xl p-3 border border-slate-200 dark:border-white/[0.04]">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 dark:text-[#64748B]">
              <span>DEPLOYMENT SLA</span>
              <span className="text-[#2563eb] dark:text-[#3B82F6] font-bold">AUTOMATED</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#7d4ce7] dark:text-[#d0bcff] uppercase tracking-wider font-bold">
                SHORTCUTS
              </span>
              <Keyboard size={18} className="text-[#7d4ce7] dark:text-[#d0bcff]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-[#dae2fd]">Console Hotkeys</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
              Click the prompt or use the quick query chips to run commands and inspect projects.
            </p>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#171f33] border border-slate-200 dark:border-white/[0.04]">
              <span className="text-slate-600 dark:text-[#c3c6d7]">Focus Prompt</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-[#222a3d] text-[#2563eb] dark:text-[#3B82F6] font-bold">/</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Return to Home Overview */}
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2563eb] dark:text-[#64748B] dark:hover:text-[#3B82F6] transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Back to Home Overview</span>
        </Link>
      </div>
    </div>
  );
}
