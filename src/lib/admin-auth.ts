import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

export const ADMIN_COOKIE = 'admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getPassword(): string {
  return (process.env.ADMIN_PASSWORD || '').trim();
}

function getSessionSecret(): string {
  const secret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  if (secret) return secret;
  return getPassword() || 'dev-only-insecure-secret';
}

function sign(payload: string): string {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function isAdminPasswordValid(password: string): boolean {
  const expected = getPassword();
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionToken(now = Date.now()): string {
  const exp = String(now + SESSION_TTL_MS);
  const sig = sign(exp);
  return `${exp}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig) return false;
  const expected = sign(exp);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const expMs = Number(exp);
  if (!Number.isFinite(expMs) || Date.now() > expMs) return false;
  return true;
}

export function readAdminSession(cookies: AstroCookies): boolean {
  return verifySessionToken(cookies.get(ADMIN_COOKIE)?.value);
}

export function setAdminSessionCookie(cookies: AstroCookies): void {
  cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearAdminSessionCookie(cookies: AstroCookies): void {
  cookies.delete(ADMIN_COOKIE, { path: '/' });
}

export function requireAdmin(cookies: AstroCookies): boolean {
  return readAdminSession(cookies);
}
