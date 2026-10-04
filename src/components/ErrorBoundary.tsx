import { Component, type ReactNode } from 'react';
import { generateCorrelationId } from '@/lib/error';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  correlationId: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, correlationId: null };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true, correlationId: generateCorrelationId() };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Detailed error output goes to internal logs only, never rendered in client UI
    if (import.meta.env.DEV) {
      console.error(`[ErrorBoundary Log] [${this.state.correlationId}]`, error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              The application encountered an unexpected error. Please refresh the page or try again later.
            </p>
            {this.state.correlationId && (
              <p className="mt-3 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                Correlation ID: <span className="text-slate-600 dark:text-slate-300 select-all">{this.state.correlationId}</span>
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 cursor-pointer"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
