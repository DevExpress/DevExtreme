import { describe, expect, it } from '@jest/globals';
import { extend, extendFromObject } from '@ts/core/utils/m_extend';

describe('Extend utils', () => {
  describe('extend', () => {
    it('should copy the properties of a source to the target and return the target', () => {
      const target = { a: 1 };

      const result = extend(target, { b: 2 });

      expect(result).toBe(target);
      expect(target).toEqual({ a: 1, b: 2 });
    });

    it('should apply the sources in the passed order', () => {
      expect(extend({ a: 1 }, { a: 2, b: 2 }, { b: 3 })).toEqual({ a: 2, b: 3 });
    });

    it('should skip undefined values and copy the other falsy ones', () => {
      const result = extend({
        a: 1, b: 1, c: 1, d: 1, e: 1,
      }, {
        a: undefined, b: null, c: 0, d: '', e: false,
      });

      expect(result).toEqual({
        a: 1, b: null, c: 0, d: '', e: false,
      });
    });

    it('should copy the inherited enumerable properties of a source', () => {
      const source = Object.create({ inherited: 1 }) as Record<string, number>;
      source.own = 2;

      expect(extend({}, source)).toEqual({ own: 2, inherited: 1 });
    });

    it('should skip null and undefined sources', () => {
      expect(extend({ a: 1 }, null, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it('should copy nested objects and arrays by reference', () => {
      const source = { nested: { a: 1 }, list: [1] };

      const result = extend({}, source);

      expect(result.nested).toBe(source.nested);
      expect(result.list).toBe(source.list);
    });

    it('should create a new object when the target is missing or falsy', () => {
      expect(extend()).toEqual({});
      expect(extend(undefined, { a: 1 })).toEqual({ a: 1 });
      expect(extend(null, { a: 1 })).toEqual({ a: 1 });
      // @ts-expect-error a number is not a target
      expect(extend(0, { a: 1 })).toEqual({ a: 1 });
      // @ts-expect-error a string is not a target
      expect(extend('', { a: 1 })).toEqual({ a: 1 });
    });

    it('should treat false as a missing target and merge the other arguments as sources', () => {
      const first = { a: 1 };

      const result = extend(false, first, { b: 2 });

      expect(result).toEqual({ a: 1, b: 2 });
      expect(result).not.toBe(first);
      expect(first).toEqual({ a: 1 });
    });

    it('should skip the __proto__ and constructor keys', () => {
      const source = JSON.parse('{"__proto__": {"polluted": true}, "constructor": 1, "a": 1}') as object;

      const result = extend({}, source);

      expect(result).toEqual({ a: 1 });
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });

    it('should skip a property whose value is the target itself', () => {
      const target: Record<string, unknown> = { a: 1 };

      extend(target, { self: target, b: 2 });

      expect(target).toEqual({ a: 1, b: 2 });
    });

    describe('deep', () => {
      it('should merge plain objects recursively', () => {
        const result = extend(true, { nested: { a: 1, b: 1 } }, { nested: { b: 2, c: 3 } });

        expect(result).toEqual({ nested: { a: 1, b: 2, c: 3 } });
      });

      it('should clone the nested plain objects and arrays of a source', () => {
        const source = { nested: { a: 1 }, list: [1, 2] };

        const result = extend(true, {}, source);

        expect(result).toEqual(source);
        expect(result.nested).not.toBe(source.nested);
        expect(result.list).not.toBe(source.list);
      });

      it('should keep and extend the nested plain object and array of the target', () => {
        const nested = { a: 1 };
        const list = [1, 2, 3];
        const target = { nested, list };

        extend(true, target, { nested: { b: 2 }, list: [9] });

        expect(target.nested).toBe(nested);
        expect(nested).toEqual({ a: 1, b: 2 });
        expect(target.list).toBe(list);
        expect(list).toEqual([9, 2, 3]);
      });

      it('should replace a target value of another kind with a new array or object', () => {
        const result = extend(true, { list: { a: 1 }, nested: [1], number: 5 }, {
          list: [1], nested: { b: 2 }, number: { c: 3 },
        });

        expect(result).toEqual({ list: [1], nested: { b: 2 }, number: { c: 3 } });
        expect(Array.isArray(result.list)).toBe(true);
        expect(Array.isArray(result.nested)).toBe(false);
      });

      it('should copy the values that are not plain objects or arrays by reference', () => {
        class Custom {
          public value = 1;
        }
        const date = new Date(1);
        const custom = new Custom();
        const callback = (): void => {};

        const result = extend(true, {}, {
          date, custom, callback, text: 'text',
        });

        expect(result.date).toBe(date);
        expect(result.custom).toBe(custom);
        expect(result.callback).toBe(callback);
        expect(result.text).toBe('text');
      });

      it('should skip undefined values and copy null', () => {
        const result = extend(true, { a: { b: 1 }, c: 1 }, { a: undefined, c: null });

        expect(result).toEqual({ a: { b: 1 }, c: null });
      });

      it('should create a new object when the target is missing', () => {
        expect(extend(true)).toEqual({});

        const source = { nested: { a: 1 } };
        const result = extend(true, undefined, source);

        expect(result).toEqual(source);
        expect(result.nested).not.toBe(source.nested);
      });

      it('should skip the __proto__ key of nested objects', () => {
        const source = JSON.parse('{"nested": {"__proto__": {"polluted": true}, "a": 1}}') as object;

        const result = extend(true, {}, source);

        expect(result).toEqual({ nested: { a: 1 } });
        expect(({} as Record<string, unknown>).polluted).toBeUndefined();
      });
    });

    describe('the type of the result', () => {
      it('should keep the properties of a source that can be skipped optional', () => {
        const skipped = undefined as { value: string } | undefined;

        const merged = extend({}, skipped);
        const isOptional: Record<string, never> extends Pick<typeof merged, 'value'>
          ? true
          : false = true;

        expect(isOptional).toBe(true);
        expect(merged).toEqual({});
      });

      it('should keep the properties of a source that is always present required', () => {
        const merged = extend({}, { value: 'a' });
        const isRequired: Record<string, never> extends Pick<typeof merged, 'value'>
          ? false
          : true = true;

        expect(isRequired).toBe(true);
        expect(merged).toEqual({ value: 'a' });
      });
    });
  });

  describe('extendFromObject', () => {
    it('should copy the own properties of a source and return the target', () => {
      const target = { a: 1 };

      const result = extendFromObject(target, { b: 2 });

      expect(result).toBe(target);
      expect(target).toEqual({ a: 1, b: 2 });
    });

    it('should not copy the inherited properties of a source', () => {
      const source = Object.create({ inherited: 1 }) as Record<string, number>;
      source.own = 2;

      expect(extendFromObject({}, source)).toEqual({ own: 2 });
    });

    it('should keep the existing properties of the target unless they are overridden', () => {
      expect(extendFromObject({ a: 1 }, { a: 2, b: 2 })).toEqual({ a: 1, b: 2 });
      expect(extendFromObject({ a: 1 }, { a: 2, b: 2 }, false)).toEqual({ a: 1, b: 2 });
      expect(extendFromObject({ a: 1 }, { a: 2, b: 2 }, true)).toEqual({ a: 2, b: 2 });
    });

    it('should consider the inherited properties of the target as existing', () => {
      const target = Object.create({ inherited: 1 }) as Record<string, number>;

      extendFromObject(target, { inherited: 2 });
      expect(Object.keys(target)).toEqual([]);

      extendFromObject(target, { inherited: 2 }, true);
      expect(Object.keys(target)).toEqual(['inherited']);
      expect(target.inherited).toBe(2);
    });

    it('should copy undefined values', () => {
      expect(extendFromObject({}, { a: undefined })).toEqual({ a: undefined });
      expect(Object.keys(extendFromObject({}, { a: undefined }))).toEqual(['a']);
    });

    it('should create a new object when the target is missing', () => {
      expect(extendFromObject(null, { a: 1 })).toEqual({ a: 1 });
      expect(extendFromObject(undefined, { a: 1 })).toEqual({ a: 1 });
    });

    it('should return the target when the source is missing', () => {
      const target = { a: 1 };

      expect(extendFromObject(target, null)).toBe(target);
      expect(extendFromObject(target, undefined)).toBe(target);
    });
  });
});
