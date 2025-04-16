import { describe, expect, it } from '@jest/globals';

import { getValueDataType, getVisibleIndexes } from './utils';

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
describe('getValueDataType', () => {
  it('should return correct types for primitives', () => {
    expect(getValueDataType(123)).toBe('number');
    expect(getValueDataType(true)).toBe('boolean');
    expect(getValueDataType(new Date())).toBe('date');
    expect(getValueDataType({})).toBe('object');
  });

  it('should refine strings using getColumnDataTypeFromValue', () => {
    expect(getValueDataType('123')).toBe('number');
    expect(getValueDataType('2024-01-01')).toBe('date');
    expect(getValueDataType('2024-01-01T12:30:00')).toBe('datetime');
    expect(getValueDataType('hello')).toBe('string');
  });

  it('should return undefined for unsupported types', () => {
    expect(getValueDataType(() => {})).toBeUndefined();
    expect(getValueDataType(Symbol('s'))).toBeUndefined();
  });
});
