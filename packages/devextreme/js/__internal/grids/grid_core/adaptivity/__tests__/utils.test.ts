import { describe, expect, it } from '@jest/globals';

import { getAdaptiveDetailRowIndex, resolveAdaptiveDetailRowTarget } from '../utils';

describe('resolveAdaptiveDetailRowTarget', () => {
  it('expands the row when no adaptive detail row is expanded', () => {
    expect(resolveAdaptiveDetailRowTarget('key_1', 2, -1, false)).toEqual({
      key: 'key_1',
      rowIndex: 2,
    });
  });

  it('expands the row when another adaptive detail row is expanded', () => {
    expect(resolveAdaptiveDetailRowTarget('key_1', 2, 5, false)).toEqual({
      key: 'key_1',
      rowIndex: 2,
    });
  });

  it('collapses the row when its adaptive detail row is expanded', () => {
    expect(resolveAdaptiveDetailRowTarget('key_1', 2, 2, false)).toEqual({
      key: undefined,
      rowIndex: -1,
    });
  });

  it('keeps the row expanded when the adaptive detail row should always be expanded', () => {
    expect(resolveAdaptiveDetailRowTarget('key_1', 2, 2, true)).toEqual({
      key: 'key_1',
      rowIndex: 2,
    });
  });

  it('keeps the key when neither the key nor the expanded key is loaded', () => {
    expect(resolveAdaptiveDetailRowTarget('key_1', -1, -1, false)).toEqual({
      key: 'key_1',
      rowIndex: -1,
    });
  });
});

describe('getAdaptiveDetailRowIndex', () => {
  it('returns the index of the row that follows the data row', () => {
    expect(getAdaptiveDetailRowIndex(2)).toBe(3);
  });

  it('subtracts the row index delta', () => {
    expect(getAdaptiveDetailRowIndex(20, 15)).toBe(6);
  });

  it('keeps a negative index of a row that is not loaded', () => {
    expect(getAdaptiveDetailRowIndex(-1)).toBe(-1);
    expect(getAdaptiveDetailRowIndex(-1, 15)).toBe(-16);
  });
});
