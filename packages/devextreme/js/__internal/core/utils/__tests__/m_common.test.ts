import { describe, expect, it } from '@jest/globals';
import { equalByValue } from '@js/core/utils/common';

const createNestedValue = (leaf: unknown): Record<string, unknown> => ({ a: { b: { c: leaf } } });

const createSelfReferencingObject = (): Record<string, unknown> => {
  const value: Record<string, unknown> = { id: 1 };

  value.self = value;

  return value;
};

describe('Common utils', () => {
  describe('equalByValue', () => {
    it('should treat values deeper than maxDepth as equal by default', () => {
      expect(equalByValue(createNestedValue(1), createNestedValue(2))).toBe(true);
    });

    it('should tell values deeper than maxDepth apart when assumeEqualBeyondMaxDepth is false', () => {
      const options = { assumeEqualBeyondMaxDepth: false };

      expect(equalByValue(createNestedValue(1), createNestedValue(2), options)).toBe(false);
    });

    it('should treat the same object at maxDepth as equal when assumeEqualBeyondMaxDepth is false', () => {
      const sharedObject = { d: 1 };
      const options = { assumeEqualBeyondMaxDepth: false };

      expect(equalByValue(
        createNestedValue(sharedObject),
        createNestedValue(sharedObject),
        options,
      )).toBe(true);
    });

    it('should compare distinct non-plain objects by their keys by default', () => {
      expect(equalByValue(new Map([[1, 'a']]), new Map([[2, 'b']]))).toBe(true);
    });

    it('should compare non-plain objects by reference when comparePlainObjectsOnly is true', () => {
      const map = new Map([[1, 'a']]);
      const options = { comparePlainObjectsOnly: true };

      expect(equalByValue(map, new Map([[1, 'a']]), options)).toBe(false);
      expect(equalByValue(map, map, options)).toBe(true);
    });

    it('should still compare plain objects by content when comparePlainObjectsOnly is true', () => {
      const options = { comparePlainObjectsOnly: true };

      expect(equalByValue({ id: 1, tags: [1, 2] }, { id: 1, tags: [1, 2] }, options)).toBe(true);
    });

    it('should stop at maxDepth for distinct self-referencing objects when assumeEqualBeyondMaxDepth is false', () => {
      const options = { assumeEqualBeyondMaxDepth: false };

      expect(equalByValue(
        createSelfReferencingObject(),
        createSelfReferencingObject(),
        options,
      )).toBe(false);
    });
  });
});
