import { parse } from 'yaml';
import affiliatesYaml from '../data/affiliates.yaml?raw';
import { loadAllEnv } from './site';

export interface Affiliate {
  slug: string;
  name: string;
  category: string;
}

export function getAffiliates(): Affiliate[] {
  return parse(affiliatesYaml) as Affiliate[];
}

export function getAffiliate(slug: string): Affiliate | undefined {
  return getAffiliates().find((item) => item.slug === slug);
}

/** slug `cu-sac-20w` → `AFFILIATE_CU_SAC_20W` */
export function slugToEnvKey(slug: string): string {
  return `AFFILIATE_${slug.replace(/-/g, '_').toUpperCase()}`;
}

export function resolveAffiliateUrl(slug: string): string | null {
  const key = slugToEnvKey(slug);
  const env = loadAllEnv();
  const url = env[key];
  if (typeof url === 'string' && url.trim().length > 0) {
    return url.trim();
  }
  return null;
}
