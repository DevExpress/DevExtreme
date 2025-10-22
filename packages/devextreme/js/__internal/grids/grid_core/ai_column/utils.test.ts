import {
  describe, expect, it,
} from '@jest/globals';
import type { Column } from '@js/ui/data_grid';

import type { Item } from '../data_controller/m_data_controller';
import { getDataFromRowItems, isAIColumnAutoMode, reduceDataCachedKeys } from './utils';

describe('reduceDataCachedKeys', () => {
  it('should remove keys from data that are present in cachedKeys', () => {
    const data = [
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
      { key: 'c', value: '3' },
    ];
    const cachedData = {
      b: 'test b',
      c: 'test c',
    };
    const result = reduceDataCachedKeys(data, cachedData, 'key');
    expect(result).toEqual(
      { a: { key: 'a', value: '1' } },
    );
  });

  it('should return the original data if no keys are cached', () => {
    const data = [
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
      { key: 'c', value: '3' },
    ];
    const cachedKeys = {};
    const result = reduceDataCachedKeys(data, cachedKeys, 'key');
    expect(result).toEqual({
      a: { key: 'a', value: '1' },
      b: { key: 'b', value: '2' },
      c: { key: 'c', value: '3' },
    });
  });

  it('should return empty object if all keys are cached', () => {
    const data = [
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
      { key: 'c', value: '3' },
    ];
    const cachedData = {
      a: 'test a',
      b: 'test b',
      c: 'test c',
    };
    const result = reduceDataCachedKeys(data, cachedData, 'key');
    expect(result).toEqual({ });
  });

  it('should handle number keys', () => {
    const data = [
      { key: 1, value: '1' },
      { key: 2, value: '2' },
      { key: 3, value: '3' },
    ];
    const cachedKeys = {
      2: 'two',
      3: 'three',
    };
    const result = reduceDataCachedKeys(data, cachedKeys, 'key');
    expect(result).toEqual({
      1: { key: 1, value: '1' },
    });
  });
});

describe('getDataFromRowItems', () => {
  it('should extract data rows correctly', () => {
    const items = [
      {
        data: { id: 1, value: 'one' },
        key: 'id',
        rowType: 'data',
      },
      {
        data: { id: 2, value: 'two' },
        key: 'id',
        rowType: 'data',
      },
      {
        data: { id: 3, value: 'three' },
        key: 'id',
        rowType: 'data',
      },
    ] as unknown as Item[];
    const result = getDataFromRowItems(items);
    expect(result).toEqual([
      { id: 1, value: 'one' },
      { id: 2, value: 'two' },
      { id: 3, value: 'three' },
    ]);
  });
  it('should ignore non-data rows', () => {
    const items = [
      {
        data: { id: 1, value: 'one' },
        key: 'id',
        rowType: 'data',
      },
      {
        data: { id: 4, value: 'four' },
        key: 'id',
        rowType: 'group',
      },
    ] as unknown as Item[];
    const result = getDataFromRowItems(items);
    expect(result).toEqual([
      { id: 1, value: 'one' },
    ]);
  });
});

describe('isAIColumnAutoMode', () => {
  it('should return true for AI columns in auto mode', () => {
    const column = {
      type: 'ai',
      ai: {
        mode: 'auto',
      },
    } as Column;
    const result = isAIColumnAutoMode(column);
    expect(result).toBe(true);
  });

  it('should return false for AI columns in manual mode', () => {
    const column = {
      type: 'ai',
      ai: {
        mode: 'manual',
      },
    } as Column;
    const result = isAIColumnAutoMode(column);
    expect(result).toBe(false);
  });

  it('should return false for non-AI columns', () => {
    const column = {
      type: 'buttons',
    } as Column;
    const result = isAIColumnAutoMode(column);
    expect(result).toBe(false);
  });

  it('should return true by default', () => {
    const column = {
      type: 'ai',
    } as Column;
    const result = isAIColumnAutoMode(column);
    expect(result).toBe(true);
  });
});
