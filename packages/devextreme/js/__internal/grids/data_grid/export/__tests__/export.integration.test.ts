import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { Deferred } from '@js/core/utils/deferred';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../../grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, value: 'a' },
  { id: 2, value: 'b' },
];

const SELECTED_ROWS_DATA = [DATA[0]];

const setup = async (options: DataGridProperties) => {
  const { instance } = await createDataGrid({
    dataSource: DATA,
    keyExpr: 'id',
    selectedRowKeys: [1],
    ...options,
  });

  await flushAsync();

  const exportController = instance.getController('export');
  const selectionController = instance.getController('selection');

  const filteredItems = Deferred().resolve(SELECTED_ROWS_DATA);

  return {
    exportController,
    filteredItems,
    loadSelectedItemsWithFilter: jest
      .spyOn(selectionController, 'loadSelectedItemsWithFilter')
      .mockReturnValue(filteredItems),
    getSelectedRowsData: jest
      .spyOn(selectionController, 'getSelectedRowsData')
      .mockReturnValue(SELECTED_ROWS_DATA),
    getAllItems: jest.spyOn(exportController, '_getAllItems'),
  };
};

describe('ExportController', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('_getSelectedItems', () => {
    it('loads the selected items with a filter when loadItemsOnExportingSelectedItems is enabled', async () => {
      const {
        exportController,
        loadSelectedItemsWithFilter,
        getSelectedRowsData,
        getAllItems,
        filteredItems,
      } = await setup({ loadItemsOnExportingSelectedItems: true } as DataGridProperties);

      exportController._getSelectedItems();

      expect(loadSelectedItemsWithFilter).toHaveBeenCalledTimes(1);
      expect(getSelectedRowsData).not.toHaveBeenCalled();
      expect(getAllItems).toHaveBeenCalledWith(filteredItems, true);
    });

    it('loads the selected items with a filter when filtering is a remote operation', async () => {
      const {
        exportController,
        loadSelectedItemsWithFilter,
        getSelectedRowsData,
        getAllItems,
        filteredItems,
      } = await setup({ remoteOperations: { filtering: true } });

      exportController._getSelectedItems();

      expect(loadSelectedItemsWithFilter).toHaveBeenCalledTimes(1);
      expect(getSelectedRowsData).not.toHaveBeenCalled();
      expect(getAllItems).toHaveBeenCalledWith(filteredItems, true);
    });

    it('uses the already selected rows when every operation is local', async () => {
      const {
        exportController,
        loadSelectedItemsWithFilter,
        getSelectedRowsData,
        getAllItems,
      } = await setup({});

      exportController._getSelectedItems();

      expect(getSelectedRowsData).toHaveBeenCalledTimes(1);
      expect(loadSelectedItemsWithFilter).not.toHaveBeenCalled();
      expect(getAllItems).toHaveBeenCalledWith(SELECTED_ROWS_DATA);
    });

    it('uses the already selected rows when loadItemsOnExportingSelectedItems is disabled explicitly, even with remote filtering', async () => {
      const {
        exportController,
        loadSelectedItemsWithFilter,
        getSelectedRowsData,
        getAllItems,
      } = await setup({
        loadItemsOnExportingSelectedItems: false,
        remoteOperations: { filtering: true },
      } as DataGridProperties);

      exportController._getSelectedItems();

      expect(getSelectedRowsData).toHaveBeenCalledTimes(1);
      expect(loadSelectedItemsWithFilter).not.toHaveBeenCalled();
      expect(getAllItems).toHaveBeenCalledWith(SELECTED_ROWS_DATA);
    });
  });
});
