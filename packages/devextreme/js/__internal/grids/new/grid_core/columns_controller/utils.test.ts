import { describe, expect, it } from '@jest/globals';

import { getColumnFormat, getVisibleIndexes, normalizeColumn } from './utils';

describe('getVisibleIndexes', () => {
  it('should create visible indexes if not present', () => {
    expect(getVisibleIndexes([
      undefined, undefined, undefined, undefined,
    ])).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it('should preserve visible indexes if present', () => {
    expect(getVisibleIndexes([
      3, 1, 0, 2,
    ])).toEqual([
      3, 1, 0, 2,
    ]);
  });

  it('should fill in missing indexes', () => {
    expect(getVisibleIndexes([
      3, undefined, 0, undefined,
    ])).toEqual([
      3, 1, 0, 2,
    ]);
  });
});

describe('normalizeColumn', () => {
  describe('when column is unbound', () => {
    const column = normalizeColumn({
      name: 'asd',
      visibleIndex: 0,
    });

    it('should have allowSorting=false by default', () => {
      expect(column.allowSorting).toBe(false);
    });
    it('should have allowFiltering=false by default', () => {
      expect(column.allowSorting).toBe(false);
    });
    it('should have allowHeaderFiltering=false by default', () => {
      expect(column.allowSorting).toBe(false);
    });
  });
});

describe('getColumnFormat', () => {
  it('should return column.format when explicitly set', () => {
    expect(getColumnFormat({ format: 'yyyy-MM-dd', dataType: 'date' })).toBe('yyyy-MM-dd');
  });

  it('should return shortDate for date dataType', () => {
    expect(getColumnFormat({ dataType: 'date' })).toBe('shortDate');
  });

  it('should return shortDateShortTime for datetime dataType', () => {
    expect(getColumnFormat({ dataType: 'datetime' })).toBe('shortDateShortTime');
  });

  it('should return undefined for non-date dataType', () => {
    expect(getColumnFormat({ dataType: 'string' })).toBeUndefined();
    expect(getColumnFormat({ dataType: 'number' })).toBeUndefined();
    expect(getColumnFormat({ dataType: 'boolean' })).toBeUndefined();
  });

  it('should return undefined when no format and no dataType', () => {
    expect(getColumnFormat({})).toBeUndefined();
  });
});
