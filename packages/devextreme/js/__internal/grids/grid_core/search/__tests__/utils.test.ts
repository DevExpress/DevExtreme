import { describe, expect, it } from '@jest/globals';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';

import {
  allowSearch,
  createLookupFilterExpressions,
  createSearchExpression,
  parseValue,
} from '../utils';

const createColumn = (options: Partial<Column>): Column => options as Column;

describe('allowSearch', () => {
  describe('when allowSearch is specified', () => {
    it('should take it even when allowFiltering differs', () => {
      expect(allowSearch(createColumn({ allowSearch: true, allowFiltering: false }))).toBe(true);
      expect(allowSearch(createColumn({ allowSearch: false, allowFiltering: true }))).toBe(false);
    });
  });

  describe('when allowSearch is not specified', () => {
    it('should fall back to allowFiltering', () => {
      expect(allowSearch(createColumn({ allowFiltering: true }))).toBe(true);
      expect(allowSearch(createColumn({ allowFiltering: false }))).toBe(false);
    });

    it('should be false when allowFiltering is not specified either', () => {
      expect(allowSearch(createColumn({}))).toBe(false);
    });
  });
});

describe('parseValue', () => {
  describe('when the column has no parseValue', () => {
    it('should return the text as is', () => {
      expect(parseValue(createColumn({}), '15')).toBe('15');
    });
  });

  describe('when the column has parseValue', () => {
    it('should call it with the column as the context', () => {
      const column = createColumn({
        dataField: 'age',
        parseValue(this: Column, text: string) {
          return `${this.dataField}:${text}`;
        },
      });

      expect(parseValue(column, '15')).toBe('age:15');
    });
  });

  describe('when the column has both parseValue and a lookup', () => {
    it('should call it with the lookup as the context', () => {
      const column = createColumn({
        dataField: 'stateId',
        lookup: { dataType: 'string' },
        parseValue(this: { dataType: string }, text: string) {
          return `${this.dataType}:${text}`;
        },
      });

      expect(parseValue(column, 'Berlin')).toBe('string:Berlin');
    });
  });
});

describe('createLookupFilterExpressions', () => {
  const ITEMS: RawItemData[] = [
    { id: 1, name: 'Berlin' },
    { id: 2, name: 'Munich' },
  ];

  const createLookupColumn = (valueExpr?: string): Column => createColumn({
    dataField: 'stateId',
    lookup: valueExpr ? { valueExpr } : {},
    createFilterExpression(value, operation, target) {
      return [this.dataField, operation, value, target] as unknown as DataFilter;
    },
  });

  describe('when the column has no createFilterExpression', () => {
    it('should produce no expressions', () => {
      expect(createLookupFilterExpressions(ITEMS, createColumn({ lookup: { valueExpr: 'id' } })))
        .toEqual([]);
    });
  });

  describe('when the lookup has a value expression', () => {
    it('should build a search expression per item from the value at that path', () => {
      expect(createLookupFilterExpressions(ITEMS, createLookupColumn('id'))).toEqual([
        ['stateId', null, 1, 'search'],
        ['stateId', null, 2, 'search'],
      ]);
    });
  });

  describe('when the lookup has no value expression', () => {
    it('should pass the whole item as the value', () => {
      expect(createLookupFilterExpressions(ITEMS, createLookupColumn())).toEqual([
        ['stateId', null, ITEMS[0], 'search'],
        ['stateId', null, ITEMS[1], 'search'],
      ]);
    });
  });

  describe('when there are no items', () => {
    it('should produce no expressions', () => {
      expect(createLookupFilterExpressions([], createLookupColumn('id'))).toEqual([]);
    });
  });
});

describe('createSearchExpression', () => {
  const createSearchColumn = (dataField: string): Column => createColumn({
    dataField,
    allowFiltering: true,
    calculateFilterExpression: () => '',
    createFilterExpression(this: Column, value, operation, target) {
      return [this.dataField, operation, value, target] as unknown as DataFilter;
    },
  });

  describe('when there is no search text', () => {
    it('should build no filter', () => {
      expect(createSearchExpression([createSearchColumn('name')], '', undefined)).toBeNull();
      expect(createSearchExpression([createSearchColumn('name')], undefined, undefined))
        .toBeNull();
    });
  });

  describe('when no column can be searched', () => {
    it('should build a filter that matches nothing', () => {
      const column = createColumn({ dataField: 'name', allowFiltering: false });

      expect(createSearchExpression([column], 'Al', undefined)).toEqual(['!']);
    });
  });

  describe('when a single column can be searched', () => {
    it('should build its search expression', () => {
      expect(createSearchExpression([createSearchColumn('name')], 'Al', undefined))
        .toEqual(['name', null, 'Al', 'search']);
    });
  });

  describe('when several columns can be searched', () => {
    it('should combine their expressions with or', () => {
      const columns = [createSearchColumn('name'), createSearchColumn('city')];

      expect(createSearchExpression(columns, 'Al', undefined)).toEqual([
        ['name', null, 'Al', 'search'],
        'or',
        ['city', null, 'Al', 'search'],
      ]);
    });
  });

  describe('when the column has a lookup', () => {
    it('should search the display values and filter by the matched ones', () => {
      const column = createColumn({
        dataField: 'stateId',
        allowFiltering: true,
        calculateFilterExpression: () => '',
        lookup: {
          valueExpr: 'id',
          displayExpr: 'name',
          dataType: 'string',
          items: [{ id: 1, name: 'Berlin' }, { id: 2, name: 'Munich' }],
        },
        createFilterExpression(this: Column, value, operation) {
          return [this.dataField, operation ?? 'contains', value] as unknown as DataFilter;
        },
      });

      expect(createSearchExpression([column], 'Ber', undefined))
        .toEqual(['stateId', 'contains', 1]);
    });
  });
});
