import { describe, expect, it } from '@jest/globals';
import { SelectionFilterCreator } from '@ts/core/utils/selection_filter';

const createFilter = (
  keys: unknown[],
  isSelectAll?: boolean,
): SelectionFilterCreator => new SelectionFilterCreator(keys, isSelectAll);

describe('Selection filter utils', () => {
  describe('getExpr', () => {
    it('should return undefined without a key expression', () => {
      const filter = createFilter([1, 2]);

      expect(filter.getExpr(undefined)).toBeUndefined();
      // @ts-expect-error null is not a key expression
      expect(filter.getExpr(null)).toBeUndefined();
      expect(filter.getExpr('')).toBeUndefined();
    });

    it('should return undefined without keys', () => {
      expect(createFilter([]).getExpr('id')).toBeUndefined();
    });

    it('should return a single condition for a single key', () => {
      expect(createFilter([1]).getExpr('id')).toEqual(['id', '=', 1]);
    });

    it('should join the conditions of several keys with or', () => {
      expect(createFilter([1, 2, 3]).getExpr('id')).toEqual([
        ['id', '=', 1], 'or', ['id', '=', 2], 'or', ['id', '=', 3],
      ]);
    });

    it('should invert the conditions and join them with and when all items are selected', () => {
      expect(createFilter([1], true).getExpr('id')).toEqual(['id', '<>', 1]);
      expect(createFilter([1, 2], true).getExpr('id')).toEqual([
        ['id', '<>', 1], 'and', ['id', '<>', 2],
      ]);
    });

    it('should use a function key expression as is', () => {
      const keyExpr = (item: unknown): unknown => item;

      expect(createFilter([5]).getExpr(keyExpr)).toEqual([keyExpr, '=', 5]);
    });

    it('should build a condition for each field of a composite key', () => {
      const filter = createFilter([{ a: 1, b: 2 }, { a: 3, b: 4 }]);

      expect(filter.getExpr(['a', 'b'])).toEqual([
        [['a', '=', 1], 'and', ['b', '=', 2]],
        'or',
        [['a', '=', 3], 'and', ['b', '=', 4]],
      ]);
    });

    it('should join the fields of a composite key with or when all items are selected', () => {
      expect(createFilter([{ a: 1, b: 2 }], true).getExpr(['a', 'b'])).toEqual([
        ['a', '<>', 1], 'or', ['b', '<>', 2],
      ]);
    });

    it('should stop at the first field of a composite key without a value', () => {
      expect(createFilter([{ a: 1 }]).getExpr(['a', 'b'])).toEqual([['a', '=', 1]]);
      expect(createFilter([{ b: 1 }]).getExpr(['a', 'b'])).toEqual([]);
    });

    it('should keep a gap in place of a plain key that is undefined', () => {
      expect(createFilter([undefined]).getExpr('id')).toBeUndefined();
      expect(createFilter([1, undefined]).getExpr('id')).toEqual([['id', '=', 1], 'or', undefined]);
    });
  });

  describe('getCombinedFilter', () => {
    const dataSourceFilter = ['field', '>', 1];

    it('should return the key expression filter by default', () => {
      expect(createFilter([1]).getCombinedFilter('id', dataSourceFilter)).toEqual(['id', '=', 1]);
    });

    it('should combine the filters when the combination is forced', () => {
      expect(createFilter([1]).getCombinedFilter('id', dataSourceFilter, true)).toEqual([
        ['id', '=', 1], dataSourceFilter,
      ]);
    });

    it('should combine the filters when all items are selected', () => {
      expect(createFilter([1], true).getCombinedFilter('id', dataSourceFilter)).toEqual([
        ['id', '<>', 1], dataSourceFilter,
      ]);
    });

    it('should return the data source filter when there is no key expression filter', () => {
      expect(createFilter([], true).getCombinedFilter('id', dataSourceFilter)).toBe(dataSourceFilter);
      expect(createFilter([1]).getCombinedFilter(undefined, dataSourceFilter, true))
        .toBe(dataSourceFilter);
    });

    it('should ignore an empty data source filter', () => {
      expect(createFilter([1], true).getCombinedFilter('id', null)).toEqual(['id', '<>', 1]);
      expect(createFilter([1]).getCombinedFilter('id', undefined, true)).toEqual(['id', '=', 1]);
    });

    it('should return undefined when there is nothing to combine', () => {
      expect(createFilter([]).getCombinedFilter('id', dataSourceFilter, true)).toBe(dataSourceFilter);
      expect(createFilter([]).getCombinedFilter('id', undefined, true)).toBeUndefined();
    });
  });

  describe('getLocalFilter', () => {
    const getId = (item: unknown): unknown => (item as { id: unknown }).id;

    it('should accept the selected items', () => {
      const filter = createFilter([1, 3]).getLocalFilter(getId);

      expect(filter({ id: 1 })).toBe(true);
      expect(filter({ id: 2 })).toBe(false);
      expect(filter({ id: 3 })).toBe(true);
    });

    it('should accept the items that are not excluded when all items are selected', () => {
      const filter = createFilter([1, 3], true).getLocalFilter(getId);

      expect(filter({ id: 1 })).toBe(false);
      expect(filter({ id: 2 })).toBe(true);
      expect(filter({ id: 3 })).toBe(false);
    });

    it('should compare object keys by value', () => {
      const filter = createFilter([{ a: 1 }]).getLocalFilter(getId);

      expect(filter({ id: { a: 1 } })).toBe(true);
      expect(filter({ id: { a: 2 } })).toBe(false);
    });

    it('should compare the keys one by one with the passed function when they are compared by reference', () => {
      const selected = { a: 1 };
      const equalKeys = (key1: unknown, key2: unknown): boolean => key1 === key2;
      const filter = createFilter([selected]).getLocalFilter(getId, equalKeys, true);

      expect(filter({ id: selected })).toBe(true);
      expect(filter({ id: { a: 1 } })).toBe(false);
    });

    it('should compare the keys by value by default even when they are compared by reference', () => {
      const filter = createFilter([{ a: 1 }]).getLocalFilter(getId, undefined, true);

      expect(filter({ id: { a: 1 } })).toBe(true);
      expect(filter({ id: { a: 2 } })).toBe(false);
    });

    it('should not use the passed function to compare the keys with a lookup', () => {
      let calls = 0;
      const equalKeys = (): boolean => {
        calls += 1;

        return false;
      };
      const filter = createFilter([1]).getLocalFilter(getId, equalKeys);

      expect(filter({ id: 1 })).toBe(true);
      expect(calls).toBe(0);
    });

    it('should normalize the keys of a composite key expression with the key getter', () => {
      const filter = createFilter([{ a: 1, b: 2 }]).getLocalFilter(
        (item: unknown) => ({ ...(item as object) }),
        undefined,
        false,
        ['a', 'b'],
      );

      expect(filter({ a: 1, b: 2 })).toBe(true);
      expect(filter({ a: 1, b: 3 })).toBe(false);
    });

    it('should normalize the selected keys of a composite key expression with the key getter', () => {
      const filter = createFilter([{ b: 2, a: 1 }]).getLocalFilter(
        (item: unknown) => ({ a: (item as { a: number }).a, b: (item as { b: number }).b }),
        undefined,
        false,
        ['a', 'b'],
      );

      expect(filter({ a: 1, b: 2 })).toBe(true);
    });

    it('should skip the selected items when all items are selected and the keys are compared one by one', () => {
      const selected = { a: 1 };
      const equalKeys = (key1: unknown, key2: unknown): boolean => key1 === key2;
      const filter = createFilter([selected], true).getLocalFilter(getId, equalKeys, true);

      expect(filter({ id: selected })).toBe(false);
      expect(filter({ id: { a: 1 } })).toBe(true);
    });

    it('should compare the keys one by one when their hash is not a string', () => {
      const filter = createFilter([{ a: undefined }]).getLocalFilter(getId);

      expect(filter({ id: { a: undefined } })).toBe(true);
      expect(filter({ id: { b: undefined } })).toBe(false);
    });

    it('should not select anything without keys', () => {
      expect(createFilter([]).getLocalFilter(getId)({ id: 1 })).toBe(false);
      expect(createFilter([], true).getLocalFilter(getId)({ id: 1 })).toBe(true);
    });

    it('should build the lookup of the selected keys only once', () => {
      const keys = [1, 2];
      const filter = createFilter(keys).getLocalFilter(getId);

      expect(filter({ id: 1 })).toBe(true);

      keys.push(3);

      expect(filter({ id: 3 })).toBe(false);
    });
  });
});
