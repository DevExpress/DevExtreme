import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

declare class ExposedDataController extends DataController {
  public _items: ProcessedItem[];

  public adjustInsertRowIndex: (visibleRowIndex: number) => number;
}

const row = (rowType: ProcessedItem['rowType']): ProcessedItem => ({
  rowType,
  key: rowType,
  data: {},
  values: [],
});

const withVisibleRows = async (
  rows: ProcessedItem[],
): Promise<(visibleRowIndex: number) => number> => {
  const { instance } = await createDataGrid({
    dataSource: [],
    columns: ['name', 'age'],
  });
  const dataController = instance.getController('data') as unknown as ExposedDataController;

  dataController._items = rows;

  return (visibleRowIndex: number): number => dataController.adjustInsertRowIndex(visibleRowIndex);
};

describe('Grouping data controller data row index', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should count the group rows along with the data rows', async () => {
    const dataRowIndex = await withVisibleRows([
      row('data'), row('group'), row('detail'), row('data'),
    ]);

    expect(dataRowIndex(3)).toBe(2);
    expect(dataRowIndex(4)).toBe(3);
  });

  it('should not count the group footer rows', async () => {
    const dataRowIndex = await withVisibleRows([row('data'), row('groupFooter'), row('data')]);

    expect(dataRowIndex(3)).toBe(2);
  });

  it('should not count the adaptive detail rows', async () => {
    const dataRowIndex = await withVisibleRows([row('data'), row('detailAdaptive'), row('data')]);

    expect(dataRowIndex(3)).toBe(2);
  });

  it('should count only the data rows when there are no group rows', async () => {
    const dataRowIndex = await withVisibleRows([row('data'), row('detail'), row('data')]);

    expect(dataRowIndex(3)).toBe(2);
  });

  it('should return zero for the first visible index', async () => {
    const dataRowIndex = await withVisibleRows([row('group'), row('data')]);

    expect(dataRowIndex(0)).toBe(0);
  });

  it('should count the rows that are there when the index is out of range', async () => {
    const dataRowIndex = await withVisibleRows([row('group'), row('data')]);

    expect(dataRowIndex(10)).toBe(2);
  });
});
