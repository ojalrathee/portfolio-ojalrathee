import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from '@/components/ErrorBoundary';
import StartupError from '@/components/StartupError';
import { envValidation } from '@/lib/env';
import './index.css';

const root = createRoot(document.getElementById('root')!);

if (!envValidation.isValid) {
  root.render(
    <StrictMode>
      <StartupError errors={envValidation.errors} />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

