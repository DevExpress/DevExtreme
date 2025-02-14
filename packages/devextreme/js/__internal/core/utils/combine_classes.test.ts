import { describe, expect, it } from '@jest/globals';

import { combineClasses } from './combine_classes';

describe('combineClasses', () => {
  describe('when array is passed', () => {
    it('should combine all passed class names', () => {
      expect(combineClasses([
        'my-class-a',
        'my-class-b',
        'my-class-c',
      ])).toBe('my-class-a my-class-b my-class-c');
    });

    it('should skip undefined or empty values', () => {
      expect(combineClasses([
        'my-class-a',
        undefined,
        'my-class-b',
        '',
        undefined,
        'my-class-c',
      ])).toBe('my-class-a my-class-b my-class-c');
    });
  });

  describe('when object is passed', () => {
    it('should combine all keys with truthy values', () => {
      expect(combineClasses({
        'my-class-a': true,
        'my-class-b': true,
        'my-class-c': true,
      })).toBe('my-class-a my-class-b my-class-c');
    });

    it('should skip all keys with falsy values', () => {
      expect(combineClasses({
        'my-class-a': true,
        'my-class-b': false,
        'my-class-c': true,
        'my-class-d': false,
      })).toBe('my-class-a my-class-c');
    });
  });

  describe('when both array and object passed', () => {
    it('should combine them', () => {
      expect(combineClasses([
        'my-class-a',
        undefined,
        'my-class-b',
        '',
        undefined,
        'my-class-c',
      ], {
        'my-class-d': true,
        'my-class-e': false,
        'my-class-f': true,
        'my-class-g': false,
      })).toBe('my-class-a my-class-b my-class-c my-class-d my-class-f');
    });
  });
});
