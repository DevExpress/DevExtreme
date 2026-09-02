import { describe, expect, it } from '@jest/globals';

import {
  asPattern, getNthOccurrence, getRealSeparatorIndex, splitByIndex,
} from '../utils';

describe('getNthOccurrence', () => {
  it('returns the position of the requested occurrence', () => {
    expect(getNthOccurrence('1.234.567', '.', 1)).toBe(1);
    expect(getNthOccurrence('1.234.567', '.', 2)).toBe(5);
  });

  it('returns -1 when the character is absent', () => {
    expect(getNthOccurrence('1234', '.', 1)).toBe(-1);
    expect(getNthOccurrence('', '.', 1)).toBe(-1);
  });

  it('returns -1 when there are fewer occurrences than requested', () => {
    expect(getNthOccurrence('abc.d', '.', 2)).toBe(-1);
    expect(getNthOccurrence('abc.d', '.', 3)).toBe(-1);
    expect(getNthOccurrence('a.b.c', '.', 4)).toBe(-1);
    expect(getNthOccurrence('a.b.c', '.', 5)).toBe(-1);
  });

  it('returns -1 when no occurrence is requested', () => {
    expect(getNthOccurrence('1.2', '.', 0)).toBe(-1);
  });

  it('counts adjacent occurrences separately', () => {
    expect(getNthOccurrence('...', '.', 1)).toBe(0);
    expect(getNthOccurrence('...', '.', 3)).toBe(2);
    expect(getNthOccurrence('...', '.', 4)).toBe(-1);
  });
});

describe('getRealSeparatorIndex', () => {
  it('reports the first separator of a plain pattern', () => {
    expect(getRealSeparatorIndex('#0.00')).toEqual({ occurrence: 1, index: 2 });
    expect(getRealSeparatorIndex('#,##0.##')).toEqual({ occurrence: 1, index: 5 });
  });

  it('skips separators inside escaped stubs', () => {
    expect(getRealSeparatorIndex("'.'#0.00")).toEqual({ occurrence: 2, index: 5 });
    expect(getRealSeparatorIndex("'..' #0.00")).toEqual({ occurrence: 3, index: 7 });
  });

  it('reports a missing separator for patterns without a float part', () => {
    expect(getRealSeparatorIndex('#,##0')).toEqual({ occurrence: 1, index: -1 });
  });

  it('treats a format that is not a pattern as having no separator', () => {
    expect(getRealSeparatorIndex({ type: 'fixedPoint', precision: 2 }))
      .toEqual({ occurrence: 1, index: -1 });
    expect(getRealSeparatorIndex(undefined)).toEqual({ occurrence: 1, index: -1 });
  });

  it('locates the separator of a stubbed pattern in the formatted text', () => {
    const { occurrence } = getRealSeparatorIndex("'...' #0.0");

    expect(getNthOccurrence('... 12.5', '.', occurrence)).toBe(6);
    expect(getNthOccurrence('.. 12', '.', occurrence)).toBe(-1);
  });
});

describe('splitByIndex', () => {
  it('splits the text around the given index', () => {
    expect(splitByIndex('12.34', 2)).toEqual(['12', '34']);
  });

  it('keeps the text whole when there is no split point', () => {
    expect(splitByIndex('1234', -1)).toEqual(['1234']);
  });
});

describe('asPattern', () => {
  it('passes a pattern string through', () => {
    expect(asPattern('#0.00')).toBe('#0.00');
  });

  it('reports an empty pattern for formats that are not strings', () => {
    expect(asPattern(undefined)).toBe('');
    expect(asPattern({ type: 'currency' })).toBe('');
    expect(asPattern((value: number): string => String(value))).toBe('');
  });
});
