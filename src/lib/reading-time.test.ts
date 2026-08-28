import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { estimateReadingMinutes, formatReadingTime } from './reading-time';

describe('reading-time', () => {
  it('returns at least 1 minute', () => {
    assert.equal(estimateReadingMinutes(''), 1);
    assert.equal(estimateReadingMinutes('một hai ba'), 1);
  });

  it('scales with word count', () => {
    const words = Array.from({ length: 400 }, (_, i) => `w${i}`).join(' ');
    assert.equal(estimateReadingMinutes(words), 2);
  });

  it('formats Vietnamese label', () => {
    assert.equal(formatReadingTime(3), '3 phút đọc');
  });
});
