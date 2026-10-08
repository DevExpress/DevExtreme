import { describe, expect, it } from '@jest/globals';
import $ from '@js/core/renderer';
import { equals } from '@ts/core/utils/m_comparator';

describe('Comparator utils', () => {
  describe('equals', () => {
    it('should compare primitives strictly', () => {
      expect(equals(1, 1)).toBe(true);
      expect(equals('a', 'a')).toBe(true);
      expect(equals(true, true)).toBe(true);
      expect(equals(1, 2)).toBe(false);
      expect(equals('a', 'A')).toBe(false);
      expect(equals('A', 'a')).toBe(false);
      expect(equals(1, '1')).toBe(false);
      expect(equals(false, 0)).toBe(false);
    });

    it('should treat null and undefined as different values', () => {
      expect(equals(null, null)).toBe(true);
      expect(equals(undefined, undefined)).toBe(true);
      expect(equals(null, undefined)).toBe(false);
      expect(equals(undefined, null)).toBe(false);
    });

    it('should treat NaN as equal to NaN only', () => {
      expect(equals(NaN, NaN)).toBe(true);
      expect(equals(NaN, 1)).toBe(false);
      expect(equals(1, NaN)).toBe(false);
      expect(equals(NaN, undefined)).toBe(false);
    });

    it('should distinguish 0 from -0', () => {
      expect(equals(0, 0)).toBe(true);
      expect(equals(-0, -0)).toBe(true);
      expect(equals(0, -0)).toBe(false);
      expect(equals(-0, 0)).toBe(false);
    });

    it('should compare dates by their timestamps', () => {
      expect(equals(new Date(5), new Date(5))).toBe(true);
      expect(equals(new Date(5), new Date(6))).toBe(false);
    });

    it('should never treat objects as equal, even the same instance', () => {
      const object = {};

      expect(equals(object, object)).toBe(false);
      expect(equals({}, {})).toBe(false);
      expect(equals([1], [1])).toBe(false);
    });

    it('should compare DOM elements by identity', () => {
      const first = document.createElement('div');
      const second = document.createElement('div');

      expect(equals(first, first)).toBe(true);
      expect(equals(first, second)).toBe(false);
    });

    it('should compare renderers with their is() method', () => {
      const first = document.createElement('div');
      const second = document.createElement('div');

      expect(equals($(first), $(first))).toBe(true);
      expect(equals($(first), $(second))).toBe(false);
    });
  });
});
