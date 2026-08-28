import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import DataSource from '@js/data/data_source';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, value: 'a' },
  { id: 2, value: 'b' },
];

const getIsSharedDataSource = (instance: DataGridInstance): boolean | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataController = instance.getController('data') as any;

  return dataController.isSharedDataSource as boolean | undefined;
};

describe('DataController data source', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('isSharedDataSource', () => {
    it('should be true when a DataSource instance is passed', async () => {
      const sharedDataSource = new DataSource({ store: DATA, key: 'id' });

      const { instance } = await createDataGrid({ dataSource: sharedDataSource });

      expect(getIsSharedDataSource(instance)).toBe(true);
    });

    it('should be false when a plain array is passed', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });

      expect(getIsSharedDataSource(instance)).toBe(false);
    });

    it('should reset to false after switching from a shared DataSource to a plain array', async () => {
      const sharedDataSource = new DataSource({ store: DATA, key: 'id' });

      const { instance } = await createDataGrid({ dataSource: sharedDataSource });
      expect(getIsSharedDataSource(instance)).toBe(true);

      instance.option('dataSource', DATA);
      await flushAsync();

      expect(getIsSharedDataSource(instance)).toBe(false);
    });
  });
});
