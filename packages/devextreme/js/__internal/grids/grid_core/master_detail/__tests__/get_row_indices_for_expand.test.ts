import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { MasterDetailDataControllerExtension } from '@ts/grids/grid_core/master_detail/m_master_detail';
import {
  afterTest as afterTreeListTest,
  beforeTest as beforeTreeListTest,
  createTreeList,
} from '@ts/grids/tree_list/__tests__/__mock__/helpers/utils';

type ExposedDataController = DataController & MasterDetailDataControllerExtension;

const DATA = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('DataController getRowIndicesForExpand', () => {
  describe('DataGrid', () => {
    beforeEach(beforeTest);
    afterEach(afterTest);

    it('should reach master_detail through the adaptivity chain', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA });
      await flushAsync();
      const dataController = instance.getController('data') as unknown as ExposedDataController;

      expect(dataController.getRowIndicesForExpand(1)).toEqual([0, 1]);
      expect(dataController.getRowIndicesForExpand(3)).toEqual([2, 3]);
    });
  });

  describe('TreeList', () => {
    beforeEach(beforeTreeListTest);
    afterEach(afterTreeListTest);

    it('should reach master_detail through the adaptivity chain', async () => {
      const { instance } = await createTreeList({ dataSource: DATA });
      await flushAsync();
      const dataController = instance.getController('data') as unknown as ExposedDataController;

      expect(dataController.getRowIndicesForExpand(1)).toEqual([0, 1]);
      expect(dataController.getRowIndicesForExpand(3)).toEqual([2, 3]);
    });
  });
});
