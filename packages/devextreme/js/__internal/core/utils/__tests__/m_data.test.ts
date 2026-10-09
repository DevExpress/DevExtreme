import { describe, expect, it } from '@jest/globals';
import { Guid } from '@ts/core/guid';
import { toComparable } from '@ts/core/utils/m_data';

describe('Data utils', () => {
  describe('toComparable', () => {
    it('should convert a Date to its time value', () => {
      const date = new Date(2026, 9, 7, 12, 30);

      expect(toComparable(date)).toBe(date.getTime());
    });

    it('should convert a Guid to its string value', () => {
      const guid = new Guid('6fd3d2c5-904d-4e6f-a302-3e277ef36630');
      const copy = new Guid(guid.toString());

      expect(toComparable(guid)).toBe('6fd3d2c5-904d-4e6f-a302-3e277ef36630');
      expect(copy).not.toBe(guid);
      expect(toComparable(copy)).toBe(toComparable(guid));
    });

    it('should return any other object as is, including one with its own valueOf', () => {
      const withValueOf = { valueOf: () => 42 };
      const plain = { id: 1 };

      expect(toComparable(withValueOf)).toBe(withValueOf);
      expect(toComparable(plain)).toBe(plain);
    });

    it('should keep primitives other than strings as is', () => {
      expect(toComparable(42)).toBe(42);
      expect(toComparable(true)).toBe(true);
      expect(toComparable(null)).toBe(null);
      expect(toComparable(undefined)).toBe(undefined);
    });

    it('should lower-case a string unless the comparison is case sensitive', () => {
      expect(toComparable('AbC')).toBe('abc');
      expect(toComparable('AbC', true)).toBe('AbC');
    });
  });
});
