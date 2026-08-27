/** Shared admin client helpers (toast, loading, word count). */

import { categorySelectOptions, DEFAULT_CATEGORY_SLUG } from '../lib/categories';

export { DEFAULT_CATEGORY_SLUG };

export function showToast(message: string, type: 'ok' | 'err' = 'ok'): void {
  let host = document.getElementById('admin-toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'admin-toast-host';
    host.className = 'admin-toast-host';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = `admin-toast admin-toast--${type}`;
  el.textContent = message;
  host.appendChild(el);
  window.setTimeout(() => {
    el.classList.add('admin-toast--out');
    window.setTimeout(() => el.remove(), 280);
  }, 2800);
}

export function setLoading(btn: HTMLButtonElement | null, loading: boolean, label?: string): void {
  if (!btn) return;
  if (loading) {
    btn.dataset.prevLabel = btn.textContent || '';
    btn.disabled = true;
    btn.textContent = label || 'Đang xử lý…';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.prevLabel || btn.textContent || '';
  }
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export const POST_CATEGORIES = categorySelectOptions();

export const MARKDOWN_HINT = `Gợi ý Markdown: # tiêu đề · **đậm** · *nghiêng* · [text](/go/slug) · - checklist · > trích`;
