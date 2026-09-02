import { describe, expect, it } from '@jest/globals';
import type {
  FilterValueCondition,
  FilterValueOperand,
} from '@ts/grids/grid_core/data_controller/types';

import type { FilterSyncColumn } from '../types';
import {
  checkForErrors,
  getColumnIdentifier,
  getConditionFromFilterRow,
  getConditionFromHeaderFilter,
  getFilterRowOptionsFromCondition,
  getHeaderFilterFromCondition,
} from '../utils';

const condition = (
  operation: string,
  value: FilterValueOperand,
): FilterValueCondition => ['field', operation, value];

const EMPTY_FILTER_ROW_STATE = {
  filterValue: undefined,
  selectedFilterOperation: undefined,
  bufferedFilterValue: undefined,
  bufferedSelectedFilterOperation: undefined,
};

const EMPTY_HEADER_FILTER_STATE = {
  filterType: 'include',
  filterValues: undefined,
};

describe('getColumnIdentifier', () => {
  it('returns the name when both the name and the data field are specified', () => {
    expect(getColumnIdentifier({ name: 'columnName', dataField: 'columnDataField' }))
      .toBe('columnName');
  });

  it('returns the data field when there is no name', () => {
    expect(getColumnIdentifier({ dataField: 'columnDataField' })).toBe('columnDataField');
  });

  it('falls back to the data field when the name is an empty string', () => {
    expect(getColumnIdentifier({ name: '', dataField: 'columnDataField' }))
      .toBe('columnDataField');
  });

  it('returns undefined when there is neither a name nor a data field', () => {
    expect(getColumnIdentifier({})).toBeUndefined();
  });

  it('returns undefined when the name is an empty string and there is no data field', () => {
    expect(getColumnIdentifier({ name: '' })).toBeUndefined();
  });
});

describe('checkForErrors', () => {
  it('throws for a filterable column without a name and a data field', () => {
    expect(() => checkForErrors([{ allowFiltering: true, caption: 'Column caption' }]))
      .toThrow(/E1049/);
  });

  it('names the column caption in the error', () => {
    expect(() => checkForErrors([{ allowFiltering: true, caption: 'Column caption' }]))
      .toThrow(/Column caption/);
  });

  it('throws for a filterable column whose name is an empty string', () => {
    expect(() => checkForErrors([{ allowFiltering: true, name: '' }])).toThrow(/E1049/);
  });

  it('does not throw when the column is not filterable', () => {
    expect(() => checkForErrors([{ caption: 'Column caption' }])).not.toThrow();
  });

  it('does not throw when the filterable column has a name', () => {
    expect(() => checkForErrors([{ allowFiltering: true, name: 'columnName' }])).not.toThrow();
  });

  it('does not throw when the filterable column has a data field', () => {
    expect(() => checkForErrors([{ allowFiltering: true, dataField: 'columnDataField' }]))
      .not.toThrow();
  });

  it('checks every column, not only the first one', () => {
    expect(() => checkForErrors([
      { allowFiltering: true, dataField: 'columnDataField' },
      { allowFiltering: true, caption: 'Column caption' },
    ])).toThrow(/E1049/);
  });

  it('does not throw for an empty column list', () => {
    expect(() => checkForErrors([])).not.toThrow();
  });
});

describe('getConditionFromFilterRow', () => {
  it('returns null when the filter value is undefined', () => {
    expect(getConditionFromFilterRow({ dataField: 'field' })).toBeNull();
  });

  it('returns null when the filter value is null', () => {
    expect(getConditionFromFilterRow({ dataField: 'field', filterValue: null })).toBeNull();
  });

  it('builds a condition for a zero filter value', () => {
    expect(getConditionFromFilterRow({
      dataField: 'field',
      dataType: 'number',
      filterValue: 0,
    })).toEqual(['field', '=', 0]);
  });

  it('builds a condition for an empty string filter value', () => {
    expect(getConditionFromFilterRow({
      dataField: 'field',
      dataType: 'string',
      filterValue: '',
    })).toEqual(['field', 'contains', '']);
  });

  it('builds a condition for a false filter value', () => {
    expect(getConditionFromFilterRow({
      dataField: 'field',
      dataType: 'boolean',
      filterValue: false,
    })).toEqual(['field', '=', false]);
  });

  it('prefers the selected filter operation', () => {
    expect(getConditionFromFilterRow({
      dataField: 'field',
      filterValue: 1,
      selectedFilterOperation: '>',
      defaultFilterOperation: '<',
    })).toEqual(['field', '>', 1]);
  });

  it('falls back to the default filter operation', () => {
    expect(getConditionFromFilterRow({
      dataField: 'field',
      filterValue: 1,
      defaultFilterOperation: '<',
    })).toEqual(['field', '<', 1]);
  });

  it('falls back to the first allowed filter operation', () => {
    expect(getConditionFromFilterRow({
      dataField: 'field',
      dataType: 'number',
      filterValue: 1,
      filterOperations: ['>', '<'],
    })).toEqual(['field', '>', 1]);
  });

  it('falls back to the data type default operation for a number column', () => {
    expect(getConditionFromFilterRow({
      dataField: 'field',
      dataType: 'number',
      filterValue: 1,
    })).toEqual(['field', '=', 1]);
  });

  it('falls back to the data type default operation for a string column', () => {
    expect(getConditionFromFilterRow({
      dataField: 'field',
      dataType: 'string',
      filterValue: 'text',
    })).toEqual(['field', 'contains', 'text']);
  });

  it('uses the name as the condition field', () => {
    expect(getConditionFromFilterRow({
      name: 'columnName',
      dataField: 'columnDataField',
      dataType: 'number',
      filterValue: 1,
    })).toEqual(['columnName', '=', 1]);
  });
});

describe('getConditionFromHeaderFilter', () => {
  it('returns null when there are no filter values', () => {
    expect(getConditionFromHeaderFilter({ dataField: 'field' })).toBeNull();
  });

  it('builds an anyof condition for an empty filter value list', () => {
    expect(getConditionFromHeaderFilter({ dataField: 'field', filterValues: [] }))
      .toEqual(['field', 'anyof', []]);
  });

  it('builds an equals condition for a single value', () => {
    expect(getConditionFromHeaderFilter({ dataField: 'field', filterValues: [1] }))
      .toEqual(['field', '=', 1]);
  });

  it('builds a not equals condition for a single excluded value', () => {
    expect(getConditionFromHeaderFilter({
      dataField: 'field',
      filterValues: [1],
      filterType: 'exclude',
    })).toEqual(['field', '<>', 1]);
  });

  it('builds an anyof condition for several values', () => {
    expect(getConditionFromHeaderFilter({ dataField: 'field', filterValues: [1, 2] }))
      .toEqual(['field', 'anyof', [1, 2]]);
  });

  it('builds a noneof condition for several excluded values', () => {
    expect(getConditionFromHeaderFilter({
      dataField: 'field',
      filterValues: [1, 2],
      filterType: 'exclude',
    })).toEqual(['field', 'noneof', [1, 2]]);
  });

  it('builds an anyof condition when the single value is itself a list', () => {
    expect(getConditionFromHeaderFilter({ dataField: 'field', filterValues: [[2020, 1]] }))
      .toEqual(['field', 'anyof', [[2020, 1]]]);
  });

  it('builds an anyof condition for a single value on a column with a group interval', () => {
    expect(getConditionFromHeaderFilter({
      dataField: 'field',
      dataType: 'number',
      filterValues: [1],
      headerFilter: { groupInterval: 10 },
    })).toEqual(['field', 'anyof', [1]]);
  });

  it('builds an anyof condition for a single value on a column with its own data source', () => {
    expect(getConditionFromHeaderFilter({
      dataField: 'field',
      dataType: 'number',
      filterValues: [1],
      headerFilter: { dataSource: [10, 20] },
    })).toEqual(['field', 'anyof', [1]]);
  });

  it('builds an anyof condition for a single value on a date column', () => {
    expect(getConditionFromHeaderFilter({
      dataField: 'field',
      dataType: 'date',
      filterValues: ['2020/01/01'],
    })).toEqual(['field', 'anyof', ['2020/01/01']]);
  });

  it('builds an equals condition for the lone null value despite a group interval', () => {
    expect(getConditionFromHeaderFilter({
      dataField: 'field',
      dataType: 'number',
      filterValues: [null],
      headerFilter: { groupInterval: 10 },
    })).toEqual(['field', '=', null]);
  });

  it('builds an equals condition for the lone null value on a date column', () => {
    expect(getConditionFromHeaderFilter({
      dataField: 'field',
      dataType: 'date',
      filterValues: [null],
    })).toEqual(['field', '=', null]);
  });
});

describe('getHeaderFilterFromCondition', () => {
  const numberColumn: FilterSyncColumn = { dataField: 'field', dataType: 'number' };
  const columnWithGroupInterval: FilterSyncColumn = {
    dataField: 'field',
    dataType: 'number',
    headerFilter: { groupInterval: 10 },
  };

  it('returns the empty state for a missing condition', () => {
    expect(getHeaderFilterFromCondition(null, numberColumn))
      .toStrictEqual(EMPTY_HEADER_FILTER_STATE);
  });

  it('includes the value of an equals condition', () => {
    expect(getHeaderFilterFromCondition(condition('=', 1), numberColumn)).toStrictEqual({
      filterType: 'include',
      filterValues: [1],
    });
  });

  it('includes the values of an anyof condition', () => {
    expect(getHeaderFilterFromCondition(condition('anyof', [1, 2]), numberColumn)).toStrictEqual({
      filterType: 'include',
      filterValues: [1, 2],
    });
  });

  it('excludes the value of a not equals condition', () => {
    expect(getHeaderFilterFromCondition(condition('<>', 1), numberColumn)).toStrictEqual({
      filterType: 'exclude',
      filterValues: [1],
    });
  });

  it('excludes the values of a noneof condition', () => {
    expect(getHeaderFilterFromCondition(condition('noneof', [1, 2]), numberColumn)).toStrictEqual({
      filterType: 'exclude',
      filterValues: [1, 2],
    });
  });

  it('returns the empty state for an operation the header filter cannot show', () => {
    expect(getHeaderFilterFromCondition(condition('>', 1), numberColumn))
      .toStrictEqual(EMPTY_HEADER_FILTER_STATE);
  });

  it('returns the empty state for a single value on a column with a group interval', () => {
    expect(getHeaderFilterFromCondition(condition('=', 1), columnWithGroupInterval))
      .toStrictEqual(EMPTY_HEADER_FILTER_STATE);
  });

  it('keeps a value list on a column with a group interval', () => {
    expect(getHeaderFilterFromCondition(condition('anyof', [1, 2]), columnWithGroupInterval))
      .toStrictEqual({
        filterType: 'include',
        filterValues: [1, 2],
      });
  });

  it('keeps the lone null value on a column with a group interval', () => {
    expect(getHeaderFilterFromCondition(condition('=', null), {
      ...columnWithGroupInterval,
      filterValues: [null],
    })).toStrictEqual({
      filterType: 'include',
      filterValues: [null],
    });
  });
});

describe('getFilterRowOptionsFromCondition', () => {
  it('clears the filter row for a missing condition', () => {
    expect(getFilterRowOptionsFromCondition(null, { dataField: 'field' }))
      .toStrictEqual(EMPTY_FILTER_ROW_STATE);
  });

  it('applies a built-in operation', () => {
    expect(getFilterRowOptionsFromCondition(condition('=', 1), { dataField: 'field' }))
      .toStrictEqual({
        filterValue: 1,
        selectedFilterOperation: '=',
        bufferedFilterValue: undefined,
        bufferedSelectedFilterOperation: undefined,
      });
  });

  it('applies the between operation with its value range', () => {
    expect(getFilterRowOptionsFromCondition(condition('between', [1, 2]), { dataField: 'field' }))
      .toStrictEqual({
        filterValue: [1, 2],
        selectedFilterOperation: 'between',
        bufferedFilterValue: undefined,
        bufferedSelectedFilterOperation: undefined,
      });
  });

  it('clears the filter row for an operation it cannot show', () => {
    expect(getFilterRowOptionsFromCondition(condition('anyof', [1]), { dataField: 'field' }))
      .toStrictEqual(EMPTY_FILTER_ROW_STATE);
  });

  it('clears the filter row when the operation is not allowed for the column', () => {
    expect(getFilterRowOptionsFromCondition(condition('=', 1), {
      dataField: 'field',
      filterOperations: ['contains'],
    })).toStrictEqual(EMPTY_FILTER_ROW_STATE);
  });

  it('falls back to the default filter operations when there are no filter operations', () => {
    expect(getFilterRowOptionsFromCondition(condition('=', 1), {
      dataField: 'field',
      defaultFilterOperations: ['contains'],
    })).toStrictEqual(EMPTY_FILTER_ROW_STATE);
  });

  it('applies a disallowed operation when it is the default operation of the column', () => {
    expect(getFilterRowOptionsFromCondition(condition('=', 1), {
      dataField: 'field',
      filterOperations: ['contains'],
      defaultFilterOperation: '=',
    })).toStrictEqual({
      filterValue: 1,
      selectedFilterOperation: undefined,
      bufferedFilterValue: undefined,
      bufferedSelectedFilterOperation: undefined,
    });
  });

  it('leaves the operation unset when it is the implicit default operation', () => {
    expect(getFilterRowOptionsFromCondition(condition('=', 1), {
      dataField: 'field',
      defaultFilterOperation: '=',
    })).toStrictEqual({
      filterValue: 1,
      selectedFilterOperation: undefined,
      bufferedFilterValue: undefined,
      bufferedSelectedFilterOperation: undefined,
    });
  });

  it('keeps the operation when the column already selected the default operation', () => {
    expect(getFilterRowOptionsFromCondition(condition('=', 1), {
      dataField: 'field',
      defaultFilterOperation: '=',
      selectedFilterOperation: '=',
    })).toStrictEqual({
      filterValue: 1,
      selectedFilterOperation: '=',
      bufferedFilterValue: undefined,
      bufferedSelectedFilterOperation: undefined,
    });
  });

  it('clears the filter row for a null value', () => {
    expect(getFilterRowOptionsFromCondition(condition('=', null), { dataField: 'field' }))
      .toStrictEqual(EMPTY_FILTER_ROW_STATE);
  });

  it('clears the filter row for an empty string value', () => {
    expect(getFilterRowOptionsFromCondition(condition('contains', ''), { dataField: 'field' }))
      .toStrictEqual(EMPTY_FILTER_ROW_STATE);
  });

  it('applies a zero value', () => {
    expect(getFilterRowOptionsFromCondition(condition('=', 0), { dataField: 'field' }))
      .toStrictEqual({
        filterValue: 0,
        selectedFilterOperation: '=',
        bufferedFilterValue: undefined,
        bufferedSelectedFilterOperation: undefined,
      });
  });

  it('applies a false value', () => {
    expect(getFilterRowOptionsFromCondition(condition('=', false), { dataField: 'field' }))
      .toStrictEqual({
        filterValue: false,
        selectedFilterOperation: '=',
        bufferedFilterValue: undefined,
        bufferedSelectedFilterOperation: undefined,
      });
  });
});
