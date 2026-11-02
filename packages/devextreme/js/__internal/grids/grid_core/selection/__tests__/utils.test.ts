import { describe, expect, it } from '@jest/globals';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

import { getSelectColumnIndex, updateSelectCellValue } from '../utils';

const createItem = (values: unknown[]): ProcessedItem => ({ values } as ProcessedItem);

describe('getSelectColumnIndex', () => {
  it('should return the index of the select column', () => {
    const columns = [{ command: 'expand' }, { command: 'select' }, { dataField: 'name' }] as Column[];

    expect(getSelectColumnIndex(columns)).toBe(1);
  });

  it('should return -1 when there is no select column', () => {
    const columns = [{ dataField: 'name' }, { dataField: 'load' }] as Column[];

    expect(getSelectColumnIndex(columns)).toBe(-1);
  });
});

describe('updateSelectCellValue', () => {
  it('should copy only the select cell value into a new values array', () => {
    const currentValues = [false, 'Anna', 3];
    const currentItem = createItem(currentValues);
    const newItem = createItem([true, 'Anna', 4.5]);

    updateSelectCellValue(currentItem, newItem, 0);

    expect(currentItem.values).toEqual([true, 'Anna', 3]);
    expect(currentItem.values).not.toBe(currentValues);
    expect(currentValues).toEqual([false, 'Anna', 3]);
  });

  it('should keep the values when there is no select column', () => {
    const currentValues = ['Anna', 3];
    const currentItem = createItem(currentValues);

    updateSelectCellValue(currentItem, createItem(['Anna', 4.5]), -1);

    expect(currentItem.values).toBe(currentValues);
    expect(currentItem.values).toEqual(['Anna', 3]);
  });

  it('should keep the values array when the select cell value is unchanged', () => {
    const currentValues: unknown[] = [];
    const currentItem = createItem(currentValues);

    updateSelectCellValue(currentItem, createItem([]), 0);

    expect(currentItem.values).toBe(currentValues);
  });
});
