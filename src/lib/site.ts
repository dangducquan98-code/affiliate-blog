export const BRAND_NAME = 'Quân Kiu Daily';

export function getBrandName(): string {
  return BRAND_NAME;
}

export function getSiteUrl(): string {
  return (
    process.env.SITE_URL ||
    (typeof import.meta !== 'undefined' && import.meta.env?.SITE_URL) ||
    'http://localhost:4321'
  );
}

/** Merge process.env + import.meta.env (Astro/Vite may only expose some keys on one side). */
function loadAllEnv(): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === 'string') merged[key] = value;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    for (const [key, value] of Object.entries(import.meta.env as Record<string, unknown>)) {
      if (typeof value === 'string' && value.length > 0) {
        merged[key] = value;
      }
    }
  }
  return merged;
}

export { loadAllEnv };
