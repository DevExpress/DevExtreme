import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, name: 'Alex' },
  { id: 2, name: 'Dan' },
];

const setup = async (options: DataGridProperties) => {
  const { instance } = await createDataGrid({
    keyExpr: 'id',
    focusedRowEnabled: true,
    ...options,
  });

  await flushAsync();

  return {
    columnsController: instance.getController('columns'),
    dataSourceController: instance.getController('dataSource'),
  };
};

describe('Focus columns extender', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('getSortDataSourceParameters', () => {
    it('sorts by the data index when every operation is local', async () => {
      const { columnsController, dataSourceController } = await setup({ dataSource: DATA });

      const result = columnsController.getSortDataSourceParameters();

      expect(result).toHaveLength(1);
      expect(result[0].selector).toBe(dataSourceController.getDataIndexGetter());
      expect(result[0].desc).toBe(false);
    });

    it('sorts by the key columns when operations are remote', async () => {
      const { columnsController } = await setup({
        dataSource: DATA,
        remoteOperations: true,
      });

      const result = columnsController.getSortDataSourceParameters();

      expect(result).toEqual([{ selector: 'id', desc: false }]);
    });

    it('leaves the base sort parameters alone when there is no data source', async () => {
      const { columnsController, dataSourceController } = await setup({
        columns: [{ dataField: 'name', sortOrder: 'asc' }],
      });

      expect(dataSourceController.getAdapter()).toBeNull();
      expect(columnsController.getSortDataSourceParameters()).toEqual([
        { selector: 'name', desc: false },
      ]);
    });
  });
});
