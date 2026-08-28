import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { affiliateUrlError, isValidAffiliateUrl } from './affiliate-url';

describe('affiliate-url', () => {
  it('accepts empty url', () => {
    assert.equal(isValidAffiliateUrl(''), true);
    assert.equal(affiliateUrlError(''), null);
  });

  it('accepts shopee domains', () => {
    assert.equal(isValidAffiliateUrl('https://s.shopee.vn/abc'), true);
    assert.equal(isValidAffiliateUrl('https://shopee.vn/product/1'), true);
  });

  it('rejects non-shopee urls', () => {
    assert.equal(isValidAffiliateUrl('https://example.com'), false);
    assert.match(affiliateUrlError('https://example.com') || '', /Shopee/);
  });
});
