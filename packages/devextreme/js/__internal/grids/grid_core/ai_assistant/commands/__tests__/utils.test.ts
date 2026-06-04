import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { z } from 'zod';

import {
  // eslint-disable-next-line spellcheck/spell-checker
  isKeyShapeValid, normalizeKey, optionalNullish, resolveFilterValue,
} from '../utils';

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

/* eslint-disable spellcheck/spell-checker */
describe('optionalNullish', () => {
  it('parses a valid value through unchanged', () => {
    const schema = optionalNullish(z.string());

    expect(schema.parse('hello')).toBe('hello');
  });

  it('parses undefined to undefined', () => {
    const schema = optionalNullish(z.string());

    expect(schema.parse(undefined)).toBeUndefined();
  });

  it('parses null to undefined', () => {
    const schema = optionalNullish(z.string());

    expect(schema.parse(null)).toBeUndefined();
  });

  it('preserves falsy non-nullish values (0, false, "")', () => {
    expect(optionalNullish(z.number()).parse(0)).toBe(0);
    expect(optionalNullish(z.boolean()).parse(false)).toBe(false);
    expect(optionalNullish(z.string()).parse('')).toBe('');
  });

  it('rejects a value of the wrong type', () => {
    const schema = optionalNullish(z.string());

    expect(schema.safeParse(123).success).toBe(false);
  });

  it('transforms null on an object field to undefined', () => {
    const schema = z.object({
      required: z.string(),
      optional: optionalNullish(z.string()),
    }).strict();

    expect(schema.parse({ required: 'r', optional: null })).toEqual({
      required: 'r',
      optional: undefined,
    });
  });

  it('accepts an omitted object field', () => {
    const schema = z.object({
      required: z.string(),
      optional: optionalNullish(z.string()),
    }).strict();

    expect(schema.parse({ required: 'r' })).toEqual({
      required: 'r',
      optional: undefined,
    });
  });
});
/* eslint-enable spellcheck/spell-checker */

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

describe('resolveFilterValue', () => {
  it('converts a valid ISO date string to Date for "date" dataType', () => {
    const result = resolveFilterValue('date', '2024-05-10T00:00:00');
    expect(result).toEqual(new Date('2024-05-10T00:00:00'));
  });

  it('converts a valid ISO date string to Date for "datetime" dataType', () => {
    const result = resolveFilterValue('datetime', '2024-05-10T14:30:00');
    expect(result).toEqual(new Date('2024-05-10T14:30:00'));
  });

  it('returns the original string for an invalid date with "date" dataType', () => {
    expect(resolveFilterValue('date', 'not-a-date')).toBe('not-a-date');
  });

  it('returns the original string when dataType is "string"', () => {
    expect(resolveFilterValue('string', '2024-05-10T00:00:00')).toBe('2024-05-10T00:00:00');
  });

  it('returns the original string when dataType is undefined', () => {
    expect(resolveFilterValue(undefined, '2024-05-10T00:00:00')).toBe('2024-05-10T00:00:00');
  });

  it('returns number values as-is regardless of dataType', () => {
    expect(resolveFilterValue('date', 42)).toBe(42);
  });

  it('returns null as-is regardless of dataType', () => {
    expect(resolveFilterValue('date', null)).toBeNull();
  });

  it('returns boolean values as-is regardless of dataType', () => {
    expect(resolveFilterValue('date', true)).toBe(true);
  });
});
