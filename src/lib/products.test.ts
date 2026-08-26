/**
 * Unit tests for product / post product helpers (node:test).
 * Run: node --import tsx --test src/lib/products.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isMissingProductsTableError, parseProductPayload } from './products.ts';
import {
  normalizeStoredProducts,
  parseProductsInput,
  resolveDisplayProducts,
} from './admin-posts.ts';

describe('isMissingProductsTableError', () => {
  it('detects schema cache / missing table messages', () => {
    assert.equal(
      isMissingProductsTableError('Could not find the table \'public.products\' in the schema cache'),
      true,
    );
    assert.equal(isMissingProductsTableError('relation "products" does not exist'), true);
    assert.equal(isMissingProductsTableError('permission denied'), false);
  });
});

describe('parseProductPayload', () => {
  it('requires name and category; slugifies from name', () => {
    const parsed = parseProductPayload({
      name: 'Mic Boya M1',
      category: 'mic',
      price_hint: '~200k',
    });
    assert.ok(parsed.data);
    assert.equal(parsed.data?.slug, 'mic-boya-m1');
    assert.equal(parsed.data?.affiliate_url, null);
  });

  it('rejects empty name', () => {
    const parsed = parseProductPayload({ name: '', category: 'mic' });
    assert.equal(parsed.error, 'Thiếu tên sản phẩm.');
  });
});

describe('parseProductsInput / normalizeStoredProducts', () => {
  it('accepts slug-only catalog refs', () => {
    const products = parseProductsInput([{ slug: 'mic-boya-m1' }, { slug: '' }]);
    assert.deepEqual(products, [{ slug: 'mic-boya-m1' }]);
  });

  it('keeps legacy name/priceHint/goSlug', () => {
    const products = parseProductsInput([
      { name: 'Hub', priceHint: '300k', goSlug: 'ugreen-hub-uno' },
    ]);
    assert.deepEqual(products, [
      { name: 'Hub', priceHint: '300k', goSlug: 'ugreen-hub-uno' },
    ]);
  });

  it('normalizeStoredProducts prefers slug form', () => {
    assert.deepEqual(normalizeStoredProducts([{ slug: 'a' }, { name: 'X', goSlug: 'x', priceHint: '' }]), [
      { slug: 'a' },
      { name: 'X', priceHint: '', goSlug: 'x' },
    ]);
  });
});

describe('resolveDisplayProducts', () => {
  it('joins catalog by slug and falls back to legacy fields', () => {
    const catalog = new Map([
      [
        'mic-boya-m1',
        {
          id: '1',
          slug: 'mic-boya-m1',
          name: 'Mic Boya',
          category: 'mic',
          price_hint: '~200k',
          affiliate_url: null,
          image: null,
          created_at: '',
          updated_at: '',
        },
      ],
    ]);
    const display = resolveDisplayProducts(
      [{ slug: 'mic-boya-m1' }, { name: 'Hub cũ', priceHint: '300k', goSlug: 'ugreen-hub-uno' }],
      catalog,
    );
    assert.deepEqual(display, [
      { slug: 'mic-boya-m1', name: 'Mic Boya', priceHint: '~200k' },
      { slug: 'ugreen-hub-uno', name: 'Hub cũ', priceHint: '300k' },
    ]);
  });

  it('uses slug as name when catalog miss', () => {
    const display = resolveDisplayProducts([{ slug: 'unknown-gear' }], new Map());
    assert.deepEqual(display, [
      { slug: 'unknown-gear', name: 'unknown-gear', priceHint: '' },
    ]);
  });
});
