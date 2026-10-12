import {
  describe, expect, it, jest,
} from '@jest/globals';
import { each, map, reverseEach } from '@ts/core/utils/m_iterator';

describe('Iterator utils', () => {
  describe('each', () => {
    it('should pass the index and the item of an array to the callback', () => {
      const callback = jest.fn();

      each(['a', 'b'], callback);

      expect(callback.mock.calls).toEqual([[0, 'a'], [1, 'b']]);
    });

    it('should pass the key and the value of an object to the callback', () => {
      const callback = jest.fn();

      each({ a: 1, b: 2 }, callback);

      expect(callback.mock.calls).toEqual([['a', 1], ['b', 2]]);
    });

    it('should iterate the inherited enumerable keys of an object after its own keys', () => {
      const values = Object.create({ inherited: 2 }) as Record<string, number>;
      values.own = 1;
      const callback = jest.fn();

      each(values, callback);

      expect(callback.mock.calls).toEqual([['own', 1], ['inherited', 2]]);
    });

    it('should iterate an object with the length property as an array-like', () => {
      const callback = jest.fn();

      each({
        length: 2, 0: 'a', 1: 'b', other: 'c',
      }, callback);

      expect(callback.mock.calls).toEqual([[0, 'a'], [1, 'b']]);
    });

    it('should call the callback with the item as this', () => {
      const item = {};
      const contexts: unknown[] = [];
      const collect = function collect(this: unknown): void {
        contexts.push(this);
      };

      each([item, 5], collect);
      each({ key: item }, collect);

      expect(contexts).toHaveLength(3);
      expect(contexts[0]).toBe(item);
      expect(contexts[1]).toBe(5);
      expect(contexts[2]).toBe(item);
    });

    it('should return the iterated array or object itself', () => {
      const array = [1];
      const object = { a: 1 };

      expect(each(array, jest.fn())).toBe(array);
      expect(each(object, jest.fn())).toBe(object);
    });

    it('should return undefined and skip the callback for falsy values', () => {
      const callback = jest.fn();

      expect(each(undefined, callback)).toBeUndefined();
      expect(each(null, callback)).toBeUndefined();
      // @ts-expect-error a number is not a collection
      expect(each(0, callback)).toBeUndefined();
      expect(each('', callback)).toBeUndefined();
      // @ts-expect-error a boolean is not a collection
      expect(each(false, callback)).toBeUndefined();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should stop iterating an array when the callback returns false', () => {
      const callback = jest.fn((index: number) => index !== 1);

      each([1, 2, 3, 4], callback);

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should stop iterating an object when the callback returns false', () => {
      const callback = jest.fn((key: string) => key !== 'b');

      each({ a: 1, b: 2, c: 3 }, callback);

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should continue iterating when the callback returns a falsy value other than false', () => {
      [undefined, null, 0, '', NaN].forEach((result) => {
        const callback = jest.fn(() => result);

        each([1, 2, 3], callback);

        expect(callback).toHaveBeenCalledTimes(3);
      });
    });

    it('should return the iterated value after the iteration is stopped', () => {
      const array = [1, 2];

      expect(each(array, () => false)).toBe(array);
    });

    it('should read the length of an array on every step', () => {
      const array = [1, 2];
      const visited: number[] = [];

      each(array, (index: number, item: number) => {
        visited.push(item);

        if (index === 0) {
          array.push(3);
        }
      });

      expect(visited).toEqual([1, 2, 3]);
    });
  });

  describe('map', () => {
    it('should map an array and pass the item, the index and the array to the callback', () => {
      const array = ['a', 'b'];
      const callback = jest.fn((item: string) => item.toUpperCase());

      expect(map(array, callback)).toEqual(['A', 'B']);
      expect(callback.mock.calls).toEqual([['a', 0, array], ['b', 1, array]]);
    });

    it('should map an object and pass only the value and the key to the callback', () => {
      const callback = jest.fn((value: number, key: string) => `${key}${value}`);

      expect(map({ a: 1, b: 2 }, callback)).toEqual(['a1', 'b2']);
      expect(callback.mock.calls).toEqual([[1, 'a'], [2, 'b']]);
    });

    it('should map the inherited enumerable keys of an object', () => {
      const values = Object.create({ inherited: 2 }) as Record<string, number>;
      values.own = 1;

      expect(map(values, (value: number, key: string) => [key, value])).toEqual([
        ['own', 1],
        ['inherited', 2],
      ]);
    });

    it('should keep the undefined results', () => {
      expect(map([1, 2], () => undefined)).toEqual([undefined, undefined]);
      expect(map({ a: 1 }, () => undefined)).toEqual([undefined]);
    });

    it('should iterate the keys of an array-like object instead of its indexes', () => {
      const callback = jest.fn((value: unknown, key: string) => key);

      expect(map({ length: 2, 0: 'a', 1: 'b' }, callback)).toEqual(['0', '1', 'length']);
    });

    it('should return an empty array for null and undefined', () => {
      expect(map(null, jest.fn())).toEqual([]);
      expect(map(undefined, jest.fn())).toEqual([]);
    });
  });

  describe('reverseEach', () => {
    it('should iterate an array from the last item to the first one', () => {
      const callback = jest.fn();

      reverseEach(['a', 'b', 'c'], callback);

      expect(callback.mock.calls).toEqual([[2, 'c'], [1, 'b'], [0, 'a']]);
    });

    it('should iterate an array-like object', () => {
      const callback = jest.fn();

      reverseEach({ length: 2, 0: 'a', 1: 'b' }, callback);

      expect(callback.mock.calls).toEqual([[1, 'b'], [0, 'a']]);
    });

    it('should call the callback with the item as this', () => {
      const item = {};
      const contexts: unknown[] = [];

      reverseEach([item, 5], function collect(this: unknown): void {
        contexts.push(this);
      });

      expect(contexts[0]).toBe(5);
      expect(contexts[1]).toBe(item);
    });

    it('should stop iterating when the callback returns false', () => {
      const callback = jest.fn((index: number) => index !== 1);

      reverseEach([1, 2, 3], callback);

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should skip the callback for empty and not indexed values', () => {
      const callback = jest.fn();

      reverseEach([], callback);
      // @ts-expect-error an object without length is not an array-like
      reverseEach({ a: 1 }, callback);
      reverseEach({ length: 0 }, callback);
      reverseEach(null, callback);
      reverseEach(undefined, callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should return undefined', () => {
      expect(reverseEach([1], jest.fn())).toBeUndefined();
    });
  });
});
