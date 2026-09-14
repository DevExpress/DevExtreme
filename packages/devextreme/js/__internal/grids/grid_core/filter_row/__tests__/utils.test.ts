import { describe, expect, it } from '@jest/globals';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/data_controller/types';

import { createFilterRowExpressions } from '../utils';

const createColumn = (options: Partial<Column>): Column => ({
  index: 0,
  allowFiltering: true,
  calculateFilterExpression: () => undefined,
  createFilterExpression(this: Column, value, operation, target) {
    return [this.dataField, operation, value, target] as unknown as DataFilter;
  },
  ...options,
} as Column);

describe('createFilterRowExpressions', () => {
  describe('when a column has a filter value', () => {
    it('should build an expression with the selected operation', () => {
      const column = createColumn({
        dataField: 'name',
        filterValue: 'Alex',
        selectedFilterOperation: 'contains',
      });

      expect(createFilterRowExpressions([column], null))
        .toEqual([['name', 'contains', 'Alex', 'filterRow']]);
    });

    it('should fall back to the default operation', () => {
      const column = createColumn({
        dataField: 'name',
        filterValue: 'Alex',
        defaultFilterOperation: 'startswith',
      });

      expect(createFilterRowExpressions([column], null))
        .toEqual([['name', 'startswith', 'Alex', 'filterRow']]);
    });

    it('should fall back to the default operation when the selected one is empty', () => {
      const column = createColumn({
        dataField: 'name',
        filterValue: 'Alex',
        selectedFilterOperation: '' as Column['selectedFilterOperation'],
        defaultFilterOperation: 'startswith',
      });

      expect(createFilterRowExpressions([column], null))
        .toEqual([['name', 'startswith', 'Alex', 'filterRow']]);
    });

    it('should pass no operation when the column has neither', () => {
      const column = createColumn({ dataField: 'name', filterValue: 'Alex' });

      expect(createFilterRowExpressions([column], null))
        .toEqual([['name', undefined, 'Alex', 'filterRow']]);
    });

    it('should keep falsy values that are still defined', () => {
      const column = createColumn({ dataField: 'age', filterValue: 0 });

      expect(createFilterRowExpressions([column], null))
        .toEqual([['age', undefined, 0, 'filterRow']]);
    });
  });

  describe('when a column has no filter value', () => {
    it.each([undefined, null])('should skip it for %p', (filterValue) => {
      const column = createColumn({ dataField: 'name', filterValue });

      expect(createFilterRowExpressions([column], null)).toEqual([]);
    });
  });

  describe('when a column cannot be filtered', () => {
    it.each([
      { caseName: 'filtering is not allowed', options: { allowFiltering: false } },
      { caseName: 'there is no filter expression calculation', options: { calculateFilterExpression: undefined } },
      { caseName: 'there is no filter expression factory', options: { createFilterExpression: undefined } },
    ])('should skip it when $caseName', ({ options }) => {
      const column = createColumn({ dataField: 'name', filterValue: 'Alex', ...options });

      expect(createFilterRowExpressions([column], null)).toEqual([]);
    });
  });

  describe('when a column is excluded', () => {
    it('should skip it and keep the others', () => {
      const columns = [
        createColumn({ index: 0, dataField: 'name', filterValue: 'Alex' }),
        createColumn({ index: 1, dataField: 'age', filterValue: 15 }),
      ];

      expect(createFilterRowExpressions(columns, columns[0]))
        .toEqual([['age', undefined, 15, 'filterRow']]);
    });
  });

  describe('when no column is excluded', () => {
    it('should keep a column that has no index', () => {
      const column = createColumn({ index: undefined, dataField: 'name', filterValue: 'Alex' });

      expect(createFilterRowExpressions([column], null))
        .toEqual([['name', undefined, 'Alex', 'filterRow']]);
    });
  });
});
