import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { isKeyShapeValid, normalizeKey } from '../utils';

describe('normalizeKey', () => {
  it('returns a string key as-is', () => {
    expect(normalizeKey('abc')).toBe('abc');
  });

  it('returns a number key as-is', () => {
    expect(normalizeKey(42)).toBe(42);
  });

  it('converts a single-element CompositeKeyPair array to an object', () => {
    expect(normalizeKey([{ field: 'id', value: 1 }])).toEqual({ id: 1 });
  });

  it('converts a multi-element CompositeKeyPair array to an object', () => {
    const pairs = [
      { field: 'region', value: 'us' },
      { field: 'code', value: 100 },
    ];

    expect(normalizeKey(pairs)).toEqual({ region: 'us', code: 100 });
  });

  it('returns an empty object for an empty array', () => {
    expect(normalizeKey([])).toEqual({});
  });
});

describe('isKeyShapeValid', () => {
  describe('single-field keyExpr (string)', () => {
    it('accepts a string key', () => {
      expect(isKeyShapeValid('id', 'abc')).toBe(true);
    });

    it('accepts a number key', () => {
      expect(isKeyShapeValid('id', 42)).toBe(true);
    });

    it('rejects an object key', () => {
      expect(isKeyShapeValid('id', { id: 1 })).toBe(false);
    });
  });

  describe('composite keyExpr (array)', () => {
    it('accepts an object key containing all fields', () => {
      expect(isKeyShapeValid(['a', 'b'], { a: 1, b: 2 })).toBe(true);
    });

    it('accepts an object key with extra fields', () => {
      expect(isKeyShapeValid(['a', 'b'], { a: 1, b: 2, c: 3 })).toBe(true);
    });

    it('rejects an object key missing a field', () => {
      expect(isKeyShapeValid(['a', 'b'], { a: 1 })).toBe(false);
    });

    it('rejects a string key', () => {
      expect(isKeyShapeValid(['a', 'b'], 'abc')).toBe(false);
    });

    it('rejects a number key', () => {
      expect(isKeyShapeValid(['a', 'b'], 42)).toBe(false);
    });
  });
});
