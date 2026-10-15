import { describe, expect, it } from '@jest/globals';
import { equalByValue } from '@js/core/utils/common';

const createNestedValue = (leaf: unknown): Record<string, unknown> => ({ a: { b: { c: leaf } } });

const createSelfReferencingObject = (id: number): Record<string, unknown> => {
  const value: Record<string, unknown> = { id };

  value.self = value;

  return value;
};

describe('Common utils', () => {
  describe('equalByValue', () => {
    it('should treat values deeper than maxDepth as equal by default', () => {
      expect(equalByValue(createNestedValue(1), createNestedValue(2))).toBe(true);
    });

    it('should compare values at any depth when maxDepth is Infinity', () => {
      const options = { maxDepth: Infinity };

      expect(equalByValue(createNestedValue(1), createNestedValue(2), options)).toBe(false);
      expect(equalByValue(createNestedValue(1), createNestedValue(1), options)).toBe(true);
    });

    it('should compare self-referencing objects by content when maxDepth is Infinity', () => {
      const options = { maxDepth: Infinity };

      expect(equalByValue(
        createSelfReferencingObject(1),
        createSelfReferencingObject(1),
        options,
      )).toBe(true);
      expect(equalByValue(
        createSelfReferencingObject(1),
        createSelfReferencingObject(2),
        options,
      )).toBe(false);
    });

    it('should not depend on the property order when loose comparison reaches strict array items with maxDepth Infinity', () => {
      const options = { maxDepth: Infinity, strict: false };
      const numberItem = { id: 1 };
      const stringItem = { id: '1' };

      expect(equalByValue(
        { loose: numberItem, items: [numberItem] },
        { loose: stringItem, items: [stringItem] },
        options,
      )).toBe(false);
      expect(equalByValue(
        { items: [numberItem], loose: numberItem },
        { items: [stringItem], loose: stringItem },
        options,
      )).toBe(false);
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
  });
});
