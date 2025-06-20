import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  deepCopy,
} from './utils';

describe('deepCopy', () => {
  it('should create a deep copy of an object', () => {
    const original = { a: 1, b: { c: 2 } };
    const copy = deepCopy(original);

    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy.b).not.toBe(original.b);
  });

  it('should create a deep copy of an array', () => {
    const original = [1, 2, [3, 4]];
    const copy = deepCopy(original);

    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy[2]).not.toBe(original[2]);
  });

  it('should handle Date objects', () => {
    const original = new Date('2023-01-01');
    const copy = deepCopy(original);

    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy.getTime()).toBe(original.getTime());
  });

  it('should handle RegExp objects', () => {
    const original = /test/gi;
    const copy = deepCopy(original);

    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy.source).toBe(original.source);
    expect(copy.flags).toBe(original.flags);
  });

  it('should handle nested objects and arrays', () => {
    const original = {
      a: [1, 2, { b: 3 }],
      c: { d: [4, 5], e: { f: 6 } },
    };
    const copy = deepCopy(original);

    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy.a).not.toBe(original.a);
    expect(copy.a[2]).not.toBe(original.a[2]);
    expect(copy.c).not.toBe(original.c);
    expect(copy.c.d).not.toBe(original.c.d);
    expect(copy.c.e).not.toBe(original.c.e);
  });

  it('should handle circular references', () => {
    interface ComplexCircularObj {
      a: number;
      self?: ComplexCircularObj;
      b?: {
        c: ComplexCircularObj;
      };
    }

    const original: ComplexCircularObj = { a: 1 };
    original.self = original;
    original.b = { c: original };

    const copy = deepCopy(original);

    expect(copy).not.toBe(original);
    expect(copy.a).toBe(1);
    expect(copy.self).toBe(copy);
    expect(copy.b?.c).toBe(copy);
  });
});
