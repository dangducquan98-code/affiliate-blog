import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const PLACEHOLDER_MARKERS = ['placeholder', 'https://placeholder.supabase.co'];

export function getSupabaseUrl(): string {
  return (process.env.SUPABASE_URL || '').trim();
}

export function getSupabaseAnonKey(): string {
  return (process.env.SUPABASE_ANON_KEY || '').trim();
}

export function getSupabaseServiceRoleKey(): string {
  return (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  if (!url || !anon) return false;
  const lowered = `${url} ${anon}`.toLowerCase();
  return !PLACEHOLDER_MARKERS.some((marker) => lowered.includes(marker));
}

export function isSupabaseServiceConfigured(): boolean {
  if (!isSupabaseConfigured()) return false;
  const service = getSupabaseServiceRoleKey();
  if (!service) return false;
  return !service.toLowerCase().includes('placeholder');
}

export function createAnonClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createServiceClient(): SupabaseClient | null {
  if (!isSupabaseServiceConfigured()) return null;
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getPublicStorageUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSupabaseUrl().replace(/\/$/, '');
  if (!base || base.includes('placeholder')) return null;
  const clean = pathOrUrl.replace(/^\/+/, '');
  return `${base}/storage/v1/object/public/blog-images/${clean}`;
}

export function withImageTransform(
  url: string,
  options: { width?: number; quality?: number } = {},
): string {
  const width = options.width ?? 1200;
  const quality = options.quality ?? 75;
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}width=${width}&quality=${quality}`;
}
