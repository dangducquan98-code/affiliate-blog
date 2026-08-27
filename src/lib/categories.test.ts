/**
 * Unit tests for shared category config.
 * Run: node --import tsx --test src/lib/categories.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORIES,
  DEFAULT_CATEGORY_SLUG,
  categorySelectOptions,
  getCategoryBySlug,
  getCategoryLabel,
  isValidCategorySlug,
} from './categories.ts';

describe('CATEGORIES', () => {
  it('has exactly 5 approved slugs', () => {
    assert.deepEqual(
      CATEGORIES.map((c) => c.slug),
      ['lam-tiktok', 'affiliate', 'review-gear', 'ai-cong-cu', 'deal'],
    );
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
    const cat = getCategoryBySlug('lam-tiktok');
    assert.equal(cat?.label, 'Làm TikTok');
    assert.equal(getCategoryLabel('lam-tiktok'), 'Làm TikTok');
    assert.equal(isValidCategorySlug('lam-tiktok'), true);
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
    assert.equal(opts[0]?.value, 'lam-tiktok');
    assert.equal(DEFAULT_CATEGORY_SLUG, 'lam-tiktok');
  });
});
