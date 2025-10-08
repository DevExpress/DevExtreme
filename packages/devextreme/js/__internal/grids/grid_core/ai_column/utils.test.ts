import {
  describe, expect, it,
} from '@jest/globals';

import type { Item } from '../data_controller/m_data_controller';
import { getData, reduceDataCachedKeys } from './utils';

describe('reduceDataCachedKeys', () => {
  it('should remove keys from data that are present in cachedKeys', () => {
    const data = {
      a: '1',
      b: '2',
      c: '3',
    };
    const cachedData = {
      b: '2',
      c: '3',
    };
    const result = reduceDataCachedKeys(data, cachedData);
    expect(result).toEqual({
      a: '1',
    });
  });

  it('should return the original data if no keys are cached', () => {
    const data = {
      a: '1',
      b: '2',
      c: '3',
    };
    const cachedKeys = {};
    const result = reduceDataCachedKeys(data, cachedKeys);
    expect(result).toEqual(data);
  });

  it('should handle number keys', () => {
    const data = {
      1: 'one',
      2: 'two',
      3: 'three',
    };
    const cachedKeys = {
      2: 'two',
      3: 'three',
    };
    const result = reduceDataCachedKeys(data, cachedKeys);
    expect(result).toEqual({
      1: 'one',
    });
  });
});

describe('getData', () => {
  it('should extract data rows and map keys correctly', () => {
    const items = [
      {
        data: [
          { id: 1, value: 'one' },
          { id: 2, value: 'two' },
          { id: 3, value: 'three' },
        ],
        key: 'id',
        rowType: 'data',
      },
      {
        data: [
          { id: 4, value: 'four' },
          { id: 5, value: 'five' },
          { id: 6, value: 'six' },
        ],
        key: 'id',
        rowType: 'data',
      },
    ] as unknown as Item[];
    const result = getData(items);
    expect(result).toEqual({
      1: { id: 1, value: 'one' },
      2: { id: 2, value: 'two' },
      3: { id: 3, value: 'three' },
      4: { id: 4, value: 'four' },
      5: { id: 5, value: 'five' },
      6: { id: 6, value: 'six' },
    });
  });
  it('should ignore non-data rows', () => {
    const items = [
      {
        data: [
          { id: 1, value: 'one' },
          { id: 2, value: 'two' },
          { id: 3, value: 'three' },
        ],
        key: 'id',
        rowType: 'data',
      },
      {
        data: [
          { id: 4, value: 'four' },
          { id: 5, value: 'five' },
          { id: 6, value: 'six' },
        ],
        key: 'id',
        rowType: 'group',
      },
    ] as unknown as Item[];
    const result = getData(items);
    expect(result).toEqual({
      1: { id: 1, value: 'one' },
      2: { id: 2, value: 'two' },
      3: { id: 3, value: 'three' },
    });
  });
});
