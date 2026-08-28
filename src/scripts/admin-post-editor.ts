import { marked } from 'marked';
import {
  DEFAULT_CATEGORY_SLUG,
  MARKDOWN_HINT,
  POST_CATEGORIES,
  countWords,
  setLoading,
  showToast,
} from './admin-shared';

marked.setOptions({ gfm: true, breaks: false });

export type CatalogItem = {
  slug: string;
  name: string;
  price_hint: string;
  has_affiliate: boolean;
};

type EditorOptions = {
  mode: 'create' | 'edit';
  postId?: string;
  initialPublished?: boolean;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function initPostEditor(opts: EditorOptions): void {
  const form = document.getElementById('post-form') as HTMLFormElement | null;
  const productsEl = document.getElementById('products');
  const errorEl = document.getElementById('error');
  const wordCountEl = document.getElementById('word-count');
  const hintEl = document.getElementById('md-hint');
  const contentEl = document.getElementById('content') as HTMLTextAreaElement | null;
  const previewEl = document.getElementById('preview');
  const coverInput = document.getElementById('cover_image') as HTMLInputElement | null;
  const coverFile = document.getElementById('cover_file') as HTMLInputElement | null;
  const coverPreview = document.getElementById('cover-preview') as HTMLImageElement | null;
  const coverPreviewWrap = document.getElementById('cover-preview-wrap');
  const uploadBtn = document.getElementById('upload-cover') as HTMLButtonElement | null;
  const productSearch = document.getElementById('product-search') as HTMLInputElement | null;
  const categorySelect = document.getElementById('category') as HTMLSelectElement | null;
  const titleInput = document.getElementById('title') as HTMLInputElement | null;
  const slugInput = document.getElementById('slug') as HTMLInputElement | null;
  const saveDraftBtn = document.getElementById('save-draft') as HTMLButtonElement | null;
  const publishBtn = document.getElementById('save-publish') as HTMLButtonElement | null;
  const unpublishBtn = document.getElementById('unpublish') as HTMLButtonElement | null;
  const deleteBtn = document.getElementById('delete-post') as HTMLButtonElement | null;
  const tabEdit = document.getElementById('tab-edit') as HTMLButtonElement | null;
  const tabPreview = document.getElementById('tab-preview') as HTMLButtonElement | null;
  const tabSplit = document.getElementById('tab-split') as HTMLButtonElement | null;
  const panes = document.getElementById('editor-panes');
  const editPane = document.getElementById('edit-pane');
  const previewPane = document.getElementById('preview-pane');
  const quickSubmit = document.getElementById('qp-submit') as HTMLButtonElement | null;

  if (hintEl) hintEl.textContent = MARKDOWN_HINT;

  // Keep select options in sync with shared categories config
  if (categorySelect) {
    const current =
      categorySelect.dataset.current || categorySelect.value || DEFAULT_CATEGORY_SLUG;
    categorySelect.innerHTML = POST_CATEGORIES.map(
      (c) =>
        `<option value="${c.value}" ${c.value === current ? 'selected' : ''}>${c.label}</option>`,
    ).join('');
  }

  let catalog: CatalogItem[] = productsEl?.dataset.catalog
    ? JSON.parse(productsEl.dataset.catalog)
    : [];
  const selected = new Set<string>(
    productsEl?.dataset.selected ? JSON.parse(productsEl.dataset.selected) : [],
  );

  let slugTouched = opts.mode === 'edit';

  function updateWordCount() {
    if (!wordCountEl || !contentEl) return;
    const n = countWords(contentEl.value);
    wordCountEl.textContent = `${n} từ`;
  }

  function renderPreview() {
    if (!previewEl || !contentEl) return;
    previewEl.innerHTML = marked.parse(contentEl.value || '', { async: false }) as string;
  }

  function updatePublishGuard() {
    const banner = document.getElementById('publish-guard');
    if (!banner) return;
    const missing = [...selected]
      .map((slug) => catalog.find((p) => p.slug === slug))
      .filter((p) => p && !p.has_affiliate);
    if (missing.length === 0) {
      banner.hidden = true;
      banner.innerHTML = '';
      return;
    }
    banner.hidden = false;
    const names = missing.map((p) => p!.name).join(', ');
    banner.innerHTML = `<strong>Không thể xuất bản</strong> Sản phẩm chưa dán link affiliate: ${escapeHtml(names)}. Vào <a href="/admin/products">Sản phẩm</a> để dán URL trước.`;
  }

  function renderCatalog() {
    if (!productsEl) return;
    const q = (productSearch?.value || '').trim().toLowerCase();
    const list = catalog.filter((p) => {
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.price_hint || '').toLowerCase().includes(q)
      );
    });
    if (catalog.length === 0) {
      productsEl.innerHTML =
        '<p class="fallback-notice">Catalog trống. Thêm nhanh bên dưới hoặc <a href="/admin/products/new">tạo sản phẩm</a>.</p>';
      return;
    }
    if (list.length === 0) {
      productsEl.innerHTML = '<p class="fallback-notice">Không khớp tìm kiếm.</p>';
      return;
    }
    productsEl.innerHTML = list
      .map((p) => {
        const badge = p.has_affiliate
          ? '<span class="admin-badge admin-badge--ok">Đã dán link</span>'
          : '<span class="admin-badge admin-badge--warn">Trống affiliate</span>';
        return `
      <label class="admin-products-pick__item">
        <input type="checkbox" data-slug="${escapeHtml(p.slug)}" ${selected.has(p.slug) ? 'checked' : ''} />
        <span>
          <strong>${escapeHtml(p.name)}</strong>
          <code>${escapeHtml(p.slug)}</code>
          ${badge}
          ${p.price_hint ? `<span class="muted">${escapeHtml(p.price_hint)}</span>` : ''}
        </span>
      </label>`;
      })
      .join('');

    productsEl.querySelectorAll<HTMLInputElement>('input[data-slug]').forEach((input) => {
      input.addEventListener('change', () => {
        const slug = input.dataset.slug || '';
        if (!slug) return;
        if (input.checked) selected.add(slug);
        else selected.delete(slug);
        updatePublishGuard();
      });
    });
    updatePublishGuard();
  }

  function readProducts(): { slug: string }[] {
    return [...selected].map((slug) => ({ slug }));
  }

  function setView(mode: 'edit' | 'preview' | 'split') {
    tabEdit?.setAttribute('aria-selected', mode === 'edit' ? 'true' : 'false');
    tabPreview?.setAttribute('aria-selected', mode === 'preview' ? 'true' : 'false');
    tabSplit?.setAttribute('aria-selected', mode === 'split' ? 'true' : 'false');
    panes?.classList.toggle('admin-editor__panes--split', mode === 'split');
    if (editPane) editPane.hidden = mode === 'preview';
    if (previewPane) previewPane.hidden = mode === 'edit';
    if (mode !== 'edit') renderPreview();
  }

  function updateCoverPreview(src: string | null) {
    if (!coverPreview || !coverPreviewWrap) return;
    if (!src) {
      coverPreviewWrap.hidden = true;
      coverPreview.removeAttribute('src');
      return;
    }
    coverPreview.src = src;
    coverPreviewWrap.hidden = false;
  }

  function buildPayload(published: boolean) {
    if (!form) return null;
    const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    if (!title) {
      showToast('Tiêu đề bắt buộc.', 'err');
      titleInput?.focus();
      return null;
    }
    const category = String(data.get('category') || '').trim();
    if (!category) {
      showToast('Chọn category.', 'err');
      return null;
    }
    return {
      title,
      slug: String(data.get('slug') || '').trim(),
      description: String(data.get('description') || ''),
      category,
      tags: String(data.get('tags') || ''),
      cover_image: String(data.get('cover_image') || ''),
      content: String(data.get('content') || ''),
      published,
      products: readProducts(),
    };
  }

  async function save(published: boolean, btn: HTMLButtonElement | null) {
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
    const payload = buildPayload(published);
    if (!payload) return;

    setLoading(btn, true, 'Đang lưu…');
    const url =
      opts.mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${opts.postId}`;
    const method = opts.mode === 'create' ? 'POST' : 'PUT';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    setLoading(btn, false);

    if (!res.ok) {
      const msg = result.error || 'Lưu thất bại.';
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = msg;
      }
      showToast(msg, 'err');
      return;
    }

    showToast(published ? 'Đã xuất bản.' : 'Đã lưu nháp.');
    if (opts.mode === 'create' && result.post?.id) {
      window.location.href = `/admin/posts/${result.post.id}`;
      return;
    }
    if (opts.mode === 'edit') {
      const pubCheckbox = form?.elements.namedItem('published') as HTMLInputElement | null;
      if (pubCheckbox) pubCheckbox.checked = published;
      if (unpublishBtn) unpublishBtn.hidden = !published;
      if (publishBtn) publishBtn.hidden = published;
    }
  }

  // Events
  contentEl?.addEventListener('input', () => {
    updateWordCount();
    if (previewPane && !previewPane.hidden) renderPreview();
  });
  productSearch?.addEventListener('input', renderCatalog);
  tabEdit?.addEventListener('click', () => setView('edit'));
  tabPreview?.addEventListener('click', () => setView('preview'));
  tabSplit?.addEventListener('click', () => setView('split'));

  titleInput?.addEventListener('input', () => {
    if (slugTouched || !slugInput || opts.mode === 'edit') return;
    const raw = titleInput.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
    slugInput.value = raw;
  });
  slugInput?.addEventListener('input', () => {
    slugTouched = true;
  });

  coverFile?.addEventListener('change', () => {
    const file = coverFile.files?.[0];
    if (!file) return;
    updateCoverPreview(URL.createObjectURL(file));
  });

  coverInput?.addEventListener('change', () => {
    const v = coverInput.value.trim();
    if (!v) {
      updateCoverPreview(null);
      return;
    }
    // Public storage paths are served via /api or absolute URL; show as-is if URL-like
    if (/^https?:\/\//i.test(v) || v.startsWith('/')) updateCoverPreview(v);
  });

  uploadBtn?.addEventListener('click', async () => {
    if (!coverFile?.files?.[0]) {
      showToast('Chọn file ảnh trước.', 'err');
      return;
    }
    setLoading(uploadBtn, true, 'Đang upload…');
    const body = new FormData();
    body.append('file', coverFile.files[0]);
    const res = await fetch('/api/admin/upload', { method: 'POST', body });
    const payload = await res.json().catch(() => ({}));
    setLoading(uploadBtn, false);
    if (!res.ok) {
      showToast(payload.error || 'Upload thất bại', 'err');
      return;
    }
    const path = payload.path || payload.url || '';
    if (coverInput) coverInput.value = path;
    if (payload.url) updateCoverPreview(payload.url);
    else if (path.startsWith('http') || path.startsWith('/')) updateCoverPreview(path);
    showToast('Upload ảnh cover OK.');
  });

  saveDraftBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    void save(false, saveDraftBtn);
  });
  publishBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    void save(true, publishBtn);
  });
  unpublishBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (opts.mode !== 'edit' || !opts.postId) return;
    setLoading(unpublishBtn, true, 'Đang huỷ…');
    const res = await fetch(`/api/admin/posts/${opts.postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: false }),
    });
    setLoading(unpublishBtn, false);
    if (!res.ok) {
      showToast('Huỷ xuất bản thất bại.', 'err');
      return;
    }
    showToast('Đã chuyển về nháp.');
    const pubCheckbox = form?.elements.namedItem('published') as HTMLInputElement | null;
    if (pubCheckbox) pubCheckbox.checked = false;
    unpublishBtn.hidden = true;
    if (publishBtn) publishBtn.hidden = false;
  });

  deleteBtn?.addEventListener('click', async () => {
    if (opts.mode !== 'edit' || !opts.postId) return;
    if (!confirm('Xoá bài này vĩnh viễn?')) return;
    setLoading(deleteBtn, true, 'Đang xoá…');
    const res = await fetch(`/api/admin/posts/${opts.postId}`, { method: 'DELETE' });
    setLoading(deleteBtn, false);
    if (!res.ok) {
      showToast('Xoá thất bại.', 'err');
      return;
    }
    showToast('Đã xoá.');
    window.location.href = '/admin';
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const published =
      (form.elements.namedItem('published') as HTMLInputElement | null)?.checked ?? false;
    void save(published, saveDraftBtn || publishBtn);
  });

  quickSubmit?.addEventListener('click', async () => {
    const name = (document.getElementById('qp-name') as HTMLInputElement | null)?.value || '';
    const slug = (document.getElementById('qp-slug') as HTMLInputElement | null)?.value || '';
    const category =
      (document.getElementById('qp-category') as HTMLInputElement | null)?.value || 'khac';
    const price_hint =
      (document.getElementById('qp-price') as HTMLInputElement | null)?.value || '';
    const affiliate_url =
      (document.getElementById('qp-aff') as HTMLInputElement | null)?.value || '';
    if (!name.trim()) {
      showToast('Nhập tên sản phẩm.', 'err');
      return;
    }
    setLoading(quickSubmit, true, 'Đang tạo…');
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        slug,
        category,
        price_hint,
        affiliate_url,
        image: '',
      }),
    });
    const result = await res.json().catch(() => ({}));
    setLoading(quickSubmit, false);
    if (!res.ok) {
      showToast(result.error || 'Tạo sản phẩm thất bại.', 'err');
      return;
    }
    const p = result.product;
    catalog = [
      {
        slug: p.slug,
        name: p.name,
        price_hint: p.price_hint || '',
        has_affiliate: Boolean(p.affiliate_url),
      },
      ...catalog.filter((x) => x.slug !== p.slug),
    ];
    selected.add(p.slug);
    if (productsEl) productsEl.dataset.catalog = JSON.stringify(catalog);
    for (const id of ['qp-name', 'qp-slug', 'qp-price', 'qp-aff'] as const) {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.value = '';
    }
    const cat = document.getElementById('qp-category') as HTMLInputElement | null;
    if (cat) cat.value = 'khac';
    renderCatalog();
    showToast(`Đã thêm “${p.name}” và gắn vào bài.`);
    updatePublishGuard();
  });

  // Init
  if (coverInput?.value) {
    const v = coverInput.value.trim();
    if (/^https?:\/\//i.test(v) || v.startsWith('/')) updateCoverPreview(v);
  }
  if (opts.mode === 'edit') {
    if (unpublishBtn) unpublishBtn.hidden = !opts.initialPublished;
    if (publishBtn) publishBtn.hidden = !!opts.initialPublished;
  }
  renderCatalog();
  updatePublishGuard();
  updateWordCount();
  setView(window.matchMedia('(min-width: 900px)').matches ? 'split' : 'edit');
}
