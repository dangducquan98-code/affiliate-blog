import { loadEnv } from 'vite';

export function getSiteUrl(): string {
  const env = loadAllEnv();
  return env.SITE_URL || 'http://localhost:4321';
}

function loadAllEnv(): Record<string, string> {
  const mode = import.meta.env.MODE || process.env.NODE_ENV || 'development';
  return {
    ...loadEnv(mode, process.cwd(), ''),
    ...(process.env as Record<string, string>),
  };
}

export { loadAllEnv };
