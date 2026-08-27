import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseGoClickMeta } from './click-meta';

describe('parseGoClickMeta', () => {
  it('reads utm_* from request URL and referrer from header', () => {
    const url = new URL(
      'https://example.com/go/mic-boya-m1?utm_source=tiktok&utm_medium=bio&utm_campaign=hook-3s',
    );
    const headers = new Headers({ referer: 'https://www.tiktok.com/@quankiu' });
    const meta = parseGoClickMeta(url, headers);
    assert.equal(meta.utm_source, 'tiktok');
    assert.equal(meta.utm_medium, 'bio');
    assert.equal(meta.utm_campaign, 'hook-3s');
    assert.equal(meta.referrer, 'https://www.tiktok.com/@quankiu');
  });

  it('returns nulls when utm and referrer are missing', () => {
    const url = new URL('https://example.com/go/mic-boya-m1');
    const meta = parseGoClickMeta(url, new Headers());
    assert.equal(meta.utm_source, null);
    assert.equal(meta.utm_medium, null);
    assert.equal(meta.utm_campaign, null);
    assert.equal(meta.referrer, null);
  });
});
