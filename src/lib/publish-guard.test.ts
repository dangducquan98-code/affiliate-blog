import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { findMissingAffiliateProducts } from './publish-guard';

describe('findMissingAffiliateProducts', () => {
  it('returns products attached to the post that lack affiliate_url', () => {
    const missing = findMissingAffiliateProducts(
      [{ slug: 'mic-boya-m1' }, { slug: 'den-ring-light-10' }],
      new Map([
        [
          'mic-boya-m1',
          { slug: 'mic-boya-m1', name: 'Mic Boya', affiliate_url: 'https://s.shopee.vn/x' },
        ],
        [
          'den-ring-light-10',
          { slug: 'den-ring-light-10', name: 'Ring light 10"', affiliate_url: null },
        ],
      ]),
    );
    assert.deepEqual(missing, [{ slug: 'den-ring-light-10', name: 'Ring light 10"' }]);
  });

  it('ignores products not attached to the post', () => {
    const missing = findMissingAffiliateProducts(
      [{ slug: 'mic-boya-m1' }],
      new Map([
        ['mic-boya-m1', { slug: 'mic-boya-m1', name: 'Mic', affiliate_url: 'https://s.shopee.vn/x' }],
        ['other', { slug: 'other', name: 'Other', affiliate_url: null }],
      ]),
    );
    assert.equal(missing.length, 0);
  });

  it('treats empty string affiliate_url as missing', () => {
    const missing = findMissingAffiliateProducts(
      [{ slug: 'a' }],
      new Map([['a', { slug: 'a', name: 'A', affiliate_url: '  ' }]]),
    );
    assert.equal(missing.length, 1);
    assert.equal(missing[0]?.name, 'A');
  });
});
