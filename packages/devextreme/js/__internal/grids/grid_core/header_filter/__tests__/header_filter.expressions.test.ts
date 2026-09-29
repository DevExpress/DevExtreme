import { describe, expect, it } from '@jest/globals';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';

import { allowHeaderFiltering, createHeaderFilterExpressions } from '../utils';

const toPlainFilter = (value: unknown): unknown => (Array.isArray(value)
  ? Array.from(value, toPlainFilter)
  : value);

const createColumn = (options: Partial<Column>): Column => ({
  index: 0,
  dataField: 'name',
  allowHeaderFiltering: true,
  calculateFilterExpression: () => undefined,
  createFilterExpression(this: Column, value, operation, target) {
    return [this.dataField, operation, value, target] as unknown as DataFilter;
  },
  ...options,
} as Column);

describe('allowHeaderFiltering', () => {
  const allowFor = (
    allowHeaderFilteringOption: boolean | undefined,
    allowFiltering: boolean,
  ): boolean | undefined => allowHeaderFiltering(createColumn({
    allowHeaderFiltering: allowHeaderFilteringOption,
    allowFiltering,
  }));

  describe('when allowHeaderFiltering is specified', () => {
    it('should take it even when allowFiltering differs', () => {
      expect(allowFor(true, false)).toBe(true);
      expect(allowFor(false, true)).toBe(false);
    });
  });

  describe('when allowHeaderFiltering is not specified', () => {
    it('should fall back to allowFiltering', () => {
      expect(allowFor(undefined, true)).toBe(true);
      expect(allowFor(undefined, false)).toBe(false);
    });
  });
});

describe('createHeaderFilterExpressions', () => {
  describe('when a column has filter values', () => {
    it('should build an equality expression for a single value', () => {
      const column = createColumn({ filterValues: ['Alex'] });

      expect(toPlainFilter(createHeaderFilterExpressions([column], null)))
        .toEqual([['name', '=', 'Alex', 'headerFilter']]);
    });

    it('should combine several values with or', () => {
      const column = createColumn({ filterValues: ['Alex', 'Dan'] });

      expect(toPlainFilter(createHeaderFilterExpressions([column], null))).toEqual([[
        ['name', '=', 'Alex', 'headerFilter'],
        'or',
        ['name', '=', 'Dan', 'headerFilter'],
      ]]);
    });

    it('should take an array value as a ready expression', () => {
      const column = createColumn({ filterValues: [['name', '>', 'Alex']] });

      expect(toPlainFilter(createHeaderFilterExpressions([column], null)))
        .toEqual([['name', '>', 'Alex']]);
    });

    it('should mark every expression with the column index', () => {
      const column = createColumn({ index: 3, filterValues: ['Alex'] });
      const [expression] = createHeaderFilterExpressions([column], null);

      expect((expression as unknown as { columnIndex: number }).columnIndex).toBe(3);
    });
  });

  describe('when the filter type is exclude', () => {
    it('should invert the column expression', () => {
      const column = createColumn({ filterType: 'exclude', filterValues: ['Alex'] });

      expect(toPlainFilter(createHeaderFilterExpressions([column], null)))
        .toEqual([['!', ['name', '=', 'Alex', 'headerFilter']]]);
    });
  });

  describe('when the column deserializes values', () => {
    it('should deserialize the filter value', () => {
      const column = createColumn({
        dataType: 'string',
        filterValues: ['alex'],
        deserializeValue: (value) => `${value as string}!`,
      });

      expect(toPlainFilter(createHeaderFilterExpressions([column], null)))
        .toEqual([['name', '=', 'alex!', 'headerFilter']]);
    });

    it.each(['date', 'datetime', 'number'])('should keep the raw value for %s columns', (dataType) => {
      const column = createColumn({
        dataType: dataType as Column['dataType'],
        filterValues: ['alex'],
        deserializeValue: (value) => `${value as string}!`,
      });

      expect(toPlainFilter(createHeaderFilterExpressions([column], null)))
        .toEqual([['name', '=', 'alex', 'headerFilter']]);
    });
  });

  describe('when a column cannot be filtered', () => {
    it.each([
      { caseName: 'header filtering is not allowed', options: { allowHeaderFiltering: false } },
      { caseName: 'there is no filter expression calculation', options: { calculateFilterExpression: undefined } },
      { caseName: 'there are no filter values', options: { filterValues: undefined } },
      { caseName: 'the filter values are empty', options: { filterValues: [] } },
    ])('should skip it when $caseName', ({ options }) => {
      const column = createColumn({ filterValues: ['Alex'], ...options });

      expect(createHeaderFilterExpressions([column], null)).toEqual([]);
    });
  });

  describe('when a column is excluded', () => {
    it('should skip it and keep the others', () => {
      const columns = [
        createColumn({ index: 0, dataField: 'name', filterValues: ['Alex'] }),
        createColumn({ index: 1, dataField: 'age', filterValues: [15] }),
      ];

      expect(toPlainFilter(createHeaderFilterExpressions(columns, columns[0])))
        .toEqual([['age', '=', 15, 'headerFilter']]);
    });
  });
});
