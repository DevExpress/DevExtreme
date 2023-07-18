import { toNumber } from '../type_conversion';

describe('toNumber', () => {
  it('should return 0 with undefined or empty argument', () => {
    expect(toNumber(undefined)).toBe(0);
    expect(toNumber('')).toBe(0);
  });

  it('should return number when argument has px unit', () => {
    expect(toNumber('12px')).toBe(12);
    expect(toNumber('0.5px')).toBe(0.5);
    expect(toNumber('-15px')).toBe(-15);
  });

  it('should return NaN when argument has no number', () => {
    expect(toNumber('0p1x')).toBe(NaN);
    expect(toNumber('abcd')).toBe(NaN);
  });
});
