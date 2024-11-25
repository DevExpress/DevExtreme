import { describe, expect, it } from '@jest/globals';

import { toMilliseconds } from './toMilliseconds';

describe('toMilliseconds', () => {
  it('milliseconds to milliseconds', () => {
    expect(toMilliseconds('millisecond')).toBe(1);
  });

  it('second to milliseconds', () => {
    expect(toMilliseconds('second')).toBe(1000);
  });

  it('minute to milliseconds', () => {
    expect(toMilliseconds('minute')).toBe(60000);
  });

  it('hour to milliseconds', () => {
    expect(toMilliseconds('hour')).toBe(3600000);
  });

  it('day to milliseconds', () => {
    expect(toMilliseconds('day')).toBe(86400000);
  });

  it('week to milliseconds', () => {
    expect(toMilliseconds('week')).toBe(604800000);
  });

  it('month to milliseconds', () => {
    expect(toMilliseconds('month')).toBe(2592000000);
  });

  it('quarter to milliseconds', () => {
    expect(toMilliseconds('quarter')).toBe(7776000000);
  });

  it('year to milliseconds', () => {
    expect(toMilliseconds('year')).toBe(31536000000);
  });
});
