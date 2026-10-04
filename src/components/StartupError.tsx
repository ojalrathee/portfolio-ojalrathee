import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface StartupErrorProps {
  errors: string[];
}

export default function StartupError({ errors }: StartupErrorProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-red-500/30 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-xl font-mono font-bold tracking-tight text-white">Startup Refused</h1>
            <p className="text-xs font-mono text-red-400">Security Gate: Missing Critical Environment Variables</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          The application refused to start because critical configuration variables are not set. To protect system integrity and prevent unauthorized operations, startup has been halted.
        </p>

        <div className="rounded-xl bg-red-950/40 border border-red-900/50 p-4 mb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-red-400 mb-2">
            <AlertTriangle size={14} />
            <span>Missing / Invalid Variables</span>
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-red-300">
            {errors.map((err, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>{err}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-slate-800/60 p-4 text-xs font-mono text-slate-400 leading-relaxed">
          Please check your <code className="text-blue-400 font-bold">.env</code> file or deployment platform environment settings (e.g., Vercel, Netlify) and supply all required keys before deploying or starting.
        </div>
      </div>
    </div>
  );
}
