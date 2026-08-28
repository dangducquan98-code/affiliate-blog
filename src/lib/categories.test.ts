/**
 * Unit tests for shared category config.
 * Run: node --import tsx --test src/lib/categories.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORIES,
  DEFAULT_CATEGORY_SLUG,
  LEGACY_CATEGORY_REDIRECTS,
  categorySelectOptions,
  getCategoryBySlug,
  getCategoryLabel,
  getLegacyCategoryRedirect,
  isValidCategorySlug,
} from './categories.ts';

describe('CATEGORIES', () => {
  it('has exactly 6 pillar slugs', () => {
    assert.deepEqual(CATEGORIES.map((c) => c.slug), [
      'mmo',
      'tu-duy',
      'tai-chinh',
      'review-sach',
      'cong-nghe',
      'trai-nghiem',
    ]);
  });

  it('every category has non-empty label and description', () => {
    for (const c of CATEGORIES) {
      assert.ok(c.label.trim().length > 0, c.slug);
      assert.ok(c.description.trim().length > 0, c.slug);
    }
  });
});

describe('getCategoryBySlug / getCategoryLabel / isValidCategorySlug', () => {
  it('resolves known slug', () => {
    const cat = getCategoryBySlug('mmo');
    assert.equal(cat?.label, 'MMO — Kiếm tiền online');
    assert.equal(getCategoryLabel('mmo'), 'MMO — Kiếm tiền online');
    assert.equal(isValidCategorySlug('mmo'), true);
  });

  it('falls back for unknown slug', () => {
    assert.equal(getCategoryBySlug('unknown'), undefined);
    assert.equal(getCategoryLabel('unknown'), 'unknown');
    assert.equal(isValidCategorySlug('unknown'), false);
  });
});

describe('categorySelectOptions', () => {
  it('mirrors CATEGORIES for admin dropdown', () => {
    const opts = categorySelectOptions();
    assert.equal(opts.length, CATEGORIES.length);
    assert.equal(opts[0]?.value, 'mmo');
    assert.equal(DEFAULT_CATEGORY_SLUG, 'mmo');
  });
});

describe('LEGACY_CATEGORY_REDIRECTS', () => {
  it('maps old category slugs to pillar routes', () => {
    assert.equal(getLegacyCategoryRedirect('lam-tiktok'), '/category/mmo');
    assert.equal(getLegacyCategoryRedirect('affiliate'), '/category/mmo');
    assert.equal(getLegacyCategoryRedirect('review-gear'), '/category/cong-nghe');
    assert.equal(getLegacyCategoryRedirect('ai-cong-cu'), '/category/cong-nghe');
    assert.equal(getLegacyCategoryRedirect('deal'), '/deals');
    assert.equal(getLegacyCategoryRedirect('mmo'), undefined);
  });

  it('covers all legacy slugs in redirect map', () => {
    assert.equal(Object.keys(LEGACY_CATEGORY_REDIRECTS).length, 5);
  });
});
