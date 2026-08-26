export const BRAND_NAME = 'Quân Kiu Daily';

export function getBrandName(): string {
  return BRAND_NAME;
}

export function getSiteUrl(): string {
  return process.env.SITE_URL || 'http://localhost:4321';
}

function loadAllEnv(): Record<string, string> {
  return process.env as Record<string, string>;
}

export { loadAllEnv };
