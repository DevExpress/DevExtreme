import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  areEqual,
  deepCopy,
} from './utils';

describe('areEqual', () => {
  it('should compare primitive values', () => {
    expect(areEqual(null, null)).toBe(true);
    expect(areEqual(undefined, undefined)).toBe(true);
    expect(areEqual(42, 42)).toBe(true);
    expect(areEqual('test', 'test')).toBe(true);
    expect(areEqual(true, true)).toBe(true);
    expect(areEqual(false, false)).toBe(true);

    expect(areEqual(null, undefined)).toBe(false);
    expect(areEqual(42, '42')).toBe(false);
    expect(areEqual(true, 1)).toBe(false);
    expect(areEqual(0, false)).toBe(false);
    expect(areEqual('', false)).toBe(false);
  });

  it('should compare objects with same properties', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    const obj3 = { a: 1, b: 3 };
    const obj4 = { a: 1 };

    expect(areEqual(obj1, obj2)).toBe(true);
    expect(areEqual(obj1, obj3)).toBe(false);
    expect(areEqual(obj1, obj4)).toBe(false);
    expect(areEqual(obj4, { a: 1, c: undefined })).toBe(false);
  });

  it('should compare arrays with same elements', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    const arr3 = [1, 2, 4];
    const arr4 = [1, 2];

    expect(areEqual(arr1, arr2)).toBe(true);
    expect(areEqual(arr1, arr3)).toBe(false);
    expect(areEqual(arr1, arr4)).toBe(false);
    expect(areEqual([], [])).toBe(true);
    expect(areEqual([1], [1])).toBe(true);
  });

  it('should compare Date objects', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const date3 = new Date('2023-01-02');

    expect(areEqual(date1, date2)).toBe(true);
    expect(areEqual(date1, date3)).toBe(false);
    expect(areEqual(date1, new Date(date1.getTime()))).toBe(true);
  });

  it('should compare RegExp objects', () => {
    const regex1 = /test/gi;
    const regex2 = /test/gi;
    const regex3 = /test/g;
    const regex4 = /test2/gi;

    expect(areEqual(regex1, regex2)).toBe(true);
    expect(areEqual(regex1, regex3)).toBe(false);
    expect(areEqual(regex1, regex4)).toBe(false);
    expect(areEqual(new RegExp('test', 'gi'), new RegExp('test', 'gi'))).toBe(true);
  });

  it('should handle circular references', () => {
    interface CircularObj {
      a: number;
      self?: CircularObj;
    }

    const obj1: CircularObj = { a: 1 };
    obj1.self = obj1;

    const obj2: CircularObj = { a: 1 };
    obj2.self = obj2;

    const obj3: CircularObj = { a: 2 };
    obj3.self = obj3;

    expect(areEqual(obj1, obj2)).toBe(true);
    expect(areEqual(obj1, obj3)).toBe(false);

    interface NestedCircularObj {
      a: number;
      b?: {
        c: NestedCircularObj;
      };
    }

    const circular1: NestedCircularObj = { a: 1 };
    const circular2: NestedCircularObj = { a: 1 };
    circular1.b = { c: circular1 };
    circular2.b = { c: circular2 };

    expect(areEqual(circular1, circular2)).toBe(true);
  });
});

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
