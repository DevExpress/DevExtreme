import { describe, expect, it } from '@jest/globals';
import type { CustomOperation, Field } from '@js/ui/filter_builder';

import type {
  Condition, FilterBuilderValue, FilterExpression, ValueCondition,
} from '../utils';
import {
  filterHasField,
  getCurrentValueText,
  getField,
  getFilterExpression,
  getFilterOperations,
  getMatchedConditions,
  getNormalizedFields,
  syncFilters,
} from '../utils';

describe('Formatting', () => {
  it('empty string', () => {
    const field = {};
    const value = '';

    expect(getCurrentValueText(field, value, null)).toBe('');
  });

  it('string', () => {
    const field = {};
    const value = 'Text';

    expect(getCurrentValueText(field, value, null)).toBe('Text');
  });

  it('shortDate', () => {
    const field = { format: 'shortDate' };
    const value = new Date(2017, 8, 5);

    expect(getCurrentValueText(field, value, null)).toBe('9/5/2017');
  });

  it('invalid date string (T1319193)', () => {
    const field = { format: 'shortDate' };
    const dateString = 'Weekend';

    expect(getCurrentValueText(field, dateString, null)).toBe(dateString);
  });

  it('boolean', () => {
    const field: Field = { dataType: 'boolean' };
    let value = true;

    expect(getCurrentValueText(field, value, null)).toBe('true');

    value = false;
    expect(getCurrentValueText(field, value, null)).toBe('false');

    field.falseText = 'False Text';
    expect(getCurrentValueText(field, value, null)).toBe('False Text');
  });

  it('field.customizeText', () => {
    const field: Field = {
      customizeText(conditionInfo) {
        return `${conditionInfo.valueText}Test`;
      },
    };
    const value = 'MyValue';

    expect(getCurrentValueText(field, value, null)).toBe('MyValueTest');
  });

  it('customOperation.customizeText', () => {
    const field: Field = {
      customizeText(conditionInfo) {
        return `${conditionInfo.valueText}Test`;
      },
    };
    const value = 'MyValue';
    const customOperation: CustomOperation = {
      customizeText(conditionInfo) {
        return `${conditionInfo.valueText}CustomOperation`;
      },
    };

    expect(getCurrentValueText(field, value, customOperation)).toBe('MyValueTestCustomOperation');
  });

  it('customOperation.customizeText for array', async () => {
    const field: Field = { dataType: 'string' };

    const customOperation = { customizeText: (): string => '(Blanks)' };
    let text = await getCurrentValueText(field, '', customOperation);

    expect(text).toBe('');

    text = await getCurrentValueText(field, [null], customOperation);
    expect(text).toEqual(['(Blanks)']);

    const field2: Field = { dataType: 'number' };

    text = await getCurrentValueText(field2, null, customOperation);

    expect(text).toBe('');

    text = await getCurrentValueText(field, [null], customOperation);
    expect(text).toEqual(['(Blanks)']);
  });

  it('default format for date', () => {
    const field: Field = { dataType: 'date' };
    const value = new Date(2017, 8, 5, 12, 30, 0);

    expect(getCurrentValueText(field, value, null)).toBe('9/5/2017');
  });

  it('default format for datetime', () => {
    const field: Field = { dataType: 'datetime' };
    const value = new Date(2017, 8, 5, 12, 30, 0);

    expect(getCurrentValueText(field, value, null)).toBe('9/5/2017, 12:30 PM');
  });
});

describe('getFilterOperations', () => {
  it('returns the default operations of the data type', () => {
    expect(getFilterOperations({ dataType: 'boolean' })).toEqual(['=', '<>', 'isblank', 'isnotblank']);
  });

  it('returns a copy of the default operations', () => {
    getFilterOperations({ dataType: 'boolean' }).push('custom');

    expect(getFilterOperations({ dataType: 'boolean' })).toEqual(['=', '<>', 'isblank', 'isnotblank']);
  });

  it('returns a copy of the field operations', () => {
    const filterOperations = ['=', '<>'];

    const result = getFilterOperations({ filterOperations });
    result.push('custom');

    expect(result).not.toBe(filterOperations);
    expect(filterOperations).toEqual(['=', '<>']);
  });

  it('falls back to the default operations for an empty list', () => {
    expect(getFilterOperations({ dataType: 'object', filterOperations: [] })).toEqual(['isblank', 'isnotblank']);
  });

  it('returns an empty list for an unknown data type', () => {
    expect(getFilterOperations({ dataType: 'unknown' })).toEqual([]);
    expect(getFilterOperations({ dataType: 'unknown', filterOperations: [] })).toEqual([]);
    expect(getFilterOperations({ dataType: 'unknown', filterOperations: null })).toEqual([]);
  });

  it('keeps null operations', () => {
    const filterOperations = ['=', null, '<>'] as string[];

    expect(getFilterOperations({ filterOperations })).toEqual(['=', null, '<>']);
  });

  it('skips undefined operations', () => {
    const filterOperations = ['=', undefined, '<>'] as string[];

    expect(getFilterOperations({ filterOperations })).toEqual(['=', '<>']);
  });
});

describe('filters without a value', () => {
  it('filterHasField should return false for undefined', () => {
    expect(filterHasField(undefined, 'a')).toBe(false);
  });

  it('getMatchedConditions should return an empty list for undefined', () => {
    expect(getMatchedConditions(undefined, 'a')).toEqual([]);
  });

  it('syncFilters should return the added filter for undefined', () => {
    const condition = ['a', '=', 1];

    expect(syncFilters(undefined, condition)).toBe(condition);
  });
});

describe('getNormalizedFields', () => {
  it('should skip fields without a dataField', () => {
    const fields = getNormalizedFields([{}, { dataField: '' }, { dataField: 'a' }]);

    expect(fields.map(({ dataField }) => dataField)).toEqual(['a']);
  });

  it('should keep getField working next to a field with an empty dataField', () => {
    const fields = getNormalizedFields([{ dataField: '' }, { dataField: 'a' }]);

    expect(getField('A', fields).dataField).toBe('a');
  });
});

describe('getFilterExpression with a single custom expression', () => {
  const createExpression = (
    calculated: FilterExpression,
    filterValue: FilterBuilderValue,
  ): unknown => {
    const fields = getNormalizedFields([{ dataField: 'a' }]);
    const customOperations = [{ name: 'custom', calculateFilterExpression: () => calculated }];

    return getFilterExpression(filterValue, fields, customOperations, 'filterBuilder');
  };
  const condition: Condition = ['a', 'custom', 1];

  it('should return a function that has no parameters', () => {
    const expression = (): boolean => true;

    expect(createExpression(expression, [condition, 'and'])).toBe(expression);
  });

  it('should return a function that has parameters', () => {
    const expression = (item: unknown): unknown => item;

    expect(createExpression(expression, [condition, 'and'])).toBe(expression);
  });

  it('should unwrap an array expression of a one-condition group', () => {
    expect(createExpression(['a', '=', 1], [condition, 'and'])).toEqual(['a', '=', 1]);
  });

  it('should return null for an empty expression', () => {
    expect(createExpression('', [condition, 'and'])).toBeNull();
    expect(createExpression([], [condition, 'and'])).toBeNull();
  });

  it('should join the expressions of two conditions', () => {
    expect(createExpression(['a', '=', 1], [condition, 'and', condition]))
      .toEqual([['a', '=', 1], 'and', ['a', '=', 1]]);
  });
});

describe('getFilterExpression with a shorthand condition', () => {
  const fields = getNormalizedFields([{ dataField: 'a', dataType: 'number' }]);

  it('should extend the shorthand [field, value] to [field, "=", value] in place', () => {
    const condition: ValueCondition = ['a', 5];

    getFilterExpression(condition, fields, [], 'filterBuilder');

    expect(condition).toEqual(['a', '=', 5]);
  });

  it('should keep a condition of a custom operation without a value as it is', () => {
    const condition: ValueCondition = ['a', 'custom'];
    const customOperations = [{ name: 'custom', hasValue: false, calculateFilterExpression: () => 'x' }];

    expect(getFilterExpression(condition, fields, customOperations, 'filterBuilder')).toBe('x');
    expect(condition).toEqual(['a', 'custom']);
  });

  it('should keep a full condition as it is', () => {
    const condition: ValueCondition = ['a', '>', 5];

    getFilterExpression(condition, fields, [], 'filterBuilder');

    expect(condition).toEqual(['a', '>', 5]);
  });
});
