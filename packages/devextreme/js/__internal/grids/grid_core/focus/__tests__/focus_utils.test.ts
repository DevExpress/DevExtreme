import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { DataFilterExpression, DataFilterPredicate } from '@ts/grids/grid_core/filter/types';

import { generateOperationFilterByKey } from '../focus_utils';
import type { OperationFilterOptions } from '../types';

const KEY_FILTER: DataFilterExpression = ['id', '<', 2];

const OPTIONS: OperationFilterOptions = {
  isRemoteFiltering: false,
  isRemoteSorting: false,
  dateSerializationFormat: undefined,
  getSelector: () => undefined,
};

const getPredicate = (filter: DataFilterExpression): DataFilterPredicate => (
  filter[0] as DataFilterPredicate
);

describe('generateOperationFilterByKey', () => {
  it('returns the key filter when nothing is sorted', () => {
    expect(generateOperationFilterByKey(KEY_FILTER, { id: 2 }, null, OPTIONS)).toBe(KEY_FILTER);
  });

  it('skips a sort parameter without a selector', () => {
    const filter = generateOperationFilterByKey(KEY_FILTER, { id: 2 }, [{ desc: false }], OPTIONS);

    expect(filter).toEqual(KEY_FILTER);
  });

  it('puts smaller and null values before the row in an ascending sort by the key alone', () => {
    const filter = generateOperationFilterByKey(
      ['name', '<', 'Dan'],
      { team: 'internal', name: 'Dan', age: 25 },
      [{ selector: 'name', desc: false }],
      OPTIONS,
    );

    expect(JSON.stringify(filter)).toBe(
      '[[["name","<","Dan"],"or",["name","=",null]],"or",[["name","=","Dan"],"and",["name","<","Dan"]]]',
    );
  });

  it('puts greater values before the row in a descending sort', () => {
    const filter = generateOperationFilterByKey(
      KEY_FILTER,
      { id: 2, name: 'Dan' },
      [{ selector: 'name', desc: true }],
      OPTIONS,
    );

    expect(filter).toEqual([['name', '>', 'Dan'], 'or', [['name', '=', 'Dan'], 'and', KEY_FILTER]]);
  });

  it('nests the conditions in sort order, the first sort outermost', () => {
    const filter = generateOperationFilterByKey(
      KEY_FILTER,
      { id: 2, a: 1, b: 5 },
      [{ selector: 'a', desc: false }, { selector: 'b', desc: true }],
      OPTIONS,
    );

    expect(filter).toEqual([
      [['a', '<', 1], 'or', ['a', '=', null]],
      'or',
      [['a', '=', 1], 'and', [['b', '>', 5], 'or', [['b', '=', 5], 'and', KEY_FILTER]]],
    ]);
  });

  // T755462
  it.each([
    { value: true, desc: false, before: ['flag', '<>', true] },
    { value: false, desc: false, before: ['flag', '=', null] },
    { value: null, desc: false, before: undefined },
    { value: true, desc: true, before: undefined },
    { value: false, desc: true, before: ['flag', '=', true] },
    { value: null, desc: true, before: ['flag', '<>', null] },
  ])('builds the rows before a $value value with desc: $desc', ({ value, desc, before }) => {
    const filter = generateOperationFilterByKey(
      KEY_FILTER,
      { id: 2, flag: value },
      [{ selector: 'flag', desc }],
      OPTIONS,
    );

    const sameValue = [['flag', '=', value], 'and', KEY_FILTER];
    expect(filter).toEqual(before ? [before, 'or', sameValue] : sameValue);
  });

  it.each([
    { desc: false, before: ['a', 'b'] },
    { desc: true, before: ['d', 'e'] },
  ])('uses the column compare function with local sorting, desc: $desc', ({ desc, before }) => {
    const compare = (x: unknown, y: unknown): number => String(x).localeCompare(String(y));
    const filter = generateOperationFilterByKey(
      KEY_FILTER,
      { id: 2, name: 'c' },
      [{ selector: 'name', desc, compare }],
      OPTIONS,
    );

    expect(filter).toEqual([expect.any(Function), 'or', [['name', '=', 'c'], 'and', KEY_FILTER]]);
    const predicate = getPredicate(filter);
    const matched = ['a', 'b', 'c', 'd', 'e'].filter((name) => predicate({ name }));
    expect(matched).toEqual(before);
  });

  it('ignores the column compare function with remote sorting', () => {
    const filter = generateOperationFilterByKey(
      KEY_FILTER,
      { id: 2, name: 'c' },
      [{ selector: 'name', desc: true, compare: (): number => 0 }],
      { ...OPTIONS, isRemoteSorting: true },
    );

    expect(filter).toEqual([['name', '>', 'c'], 'or', [['name', '=', 'c'], 'and', KEY_FILTER]]);
  });

  describe('sort value', () => {
    it('is read with a function selector, which the filter keeps', () => {
      const fullName = (row: RawItemData): unknown => `${row.first} ${row.last}`;
      const filter = generateOperationFilterByKey(
        KEY_FILTER,
        { id: 2, first: 'Ann', last: 'Lee' },
        [{ selector: fullName, desc: true }],
        OPTIONS,
      );

      expect(filter).toEqual([[fullName, '>', 'Ann Lee'], 'or', [[fullName, '=', 'Ann Lee'], 'and', KEY_FILTER]]);
    });

    it('is read with the column getter for a field name', () => {
      const getSelector = jest.fn((name: string) => (
        name === 'name' ? (row: RawItemData): unknown => String(row.name).toUpperCase() : undefined
      ));
      const filter = generateOperationFilterByKey(
        KEY_FILTER,
        { id: 2, name: 'Dan' },
        [{ selector: 'name', desc: true }],
        { ...OPTIONS, getSelector },
      );

      expect(getSelector).toHaveBeenCalledWith('name');
      expect(filter).toEqual([['name', '>', 'DAN'], 'or', [['name', '=', 'DAN'], 'and', KEY_FILTER]]);
    });

    it('is compared with the column getter in the compare function', () => {
      const filter = generateOperationFilterByKey(
        KEY_FILTER,
        { id: 2, name: 'abc' },
        [{ selector: 'name', desc: false, compare: (x, y): number => Number(x) - Number(y) }],
        { ...OPTIONS, getSelector: () => (row: RawItemData): unknown => String(row.name).length },
      );

      const predicate = getPredicate(filter);
      expect(['a', 'ab', 'abc', 'abcd'].filter((name) => predicate({ name }))).toEqual(['a', 'ab']);
    });

    it('is a serialized date with remote filtering', () => {
      const filter = generateOperationFilterByKey(
        KEY_FILTER,
        { id: 2, date: new Date(2024, 0, 15) },
        [{ selector: 'date', desc: true }],
        { ...OPTIONS, isRemoteFiltering: true, dateSerializationFormat: 'yyyy-MM-dd' },
      );

      expect(filter).toEqual([['date', '>', '2024-01-15'], 'or', [['date', '=', '2024-01-15'], 'and', KEY_FILTER]]);
    });

    it('is the date itself with local filtering', () => {
      const date = new Date(2024, 0, 15);
      const filter = generateOperationFilterByKey(
        KEY_FILTER,
        { id: 2, date },
        [{ selector: 'date', desc: true }],
        { ...OPTIONS, dateSerializationFormat: 'yyyy-MM-dd' },
      );

      expect(filter).toEqual([['date', '>', date], 'or', [['date', '=', date], 'and', KEY_FILTER]]);
    });
  });
});
