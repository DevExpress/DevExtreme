import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type { Properties as DataGridProperties } from '../../../../ui/data_grid';
import DataGrid from '../../../../ui/data_grid';

const SELECTORS = {
  gridContainer: '#gridContainer',
  detailCell: 'dx-master-detail-cell',
  detailContainer: 'dx-datagrid-master-detail-container',
};

const GRID_CONTAINER_ID = 'gridContainer';

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{ $container: dxElementWrapper; instance: DataGrid }> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new DataGrid($container.get(0) as HTMLDivElement, options);

  const contentReadyHandler = (): void => {
    resolve({ $container, instance });
    instance.off('contentReady', contentReadyHandler);
  };

  instance.on('contentReady', contentReadyHandler);
});

describe('GridCore master_detail', () => {
  afterEach(() => {
    const $container = $(SELECTORS.gridContainer);

    const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

    dataGrid.dispose();
    $container.remove();
  });

  describe('selectionChanged handler', () => {
    [true, false].forEach((repaintChangesOnly) => {
      it(`selectRowKeys are updated after refresh if selectedItem is not in dataSource anymore with repaintChangesOnly=${repaintChangesOnly}`, async () => {
        const dataSource = [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ];

        const { instance } = await createDataGrid({
          dataSource,
          columns: ['id', 'name'],
          keyExpr: 'id',
          selection: {
            mode: 'single',
          },
          repaintChangesOnly: true,
        });

        await instance.selectRows([2], false);
        expect(instance.getSelectedRowKeys()).toEqual([2]);

        dataSource.splice(1, 1); // Remove the item with id 2

        await instance.refresh(true);

        expect(instance.getSelectedRowKeys()).toEqual([]);
      });

      it(`selectionChanged handler is not called after refresh if selectedItem still present in dataSource with repaintChangesOnly=${repaintChangesOnly}`, async () => {
        const dataSource = [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ];

        const { instance } = await createDataGrid({
          dataSource,
          columns: ['id', 'name'],
          keyExpr: 'id',
          selection: {
            mode: 'single',
          },
          repaintChangesOnly,
        });

        let selectionChangedCount = 0;
        instance.on('selectionChanged', () => {
          selectionChangedCount += 1;
        });

        await instance.selectRows([1], false);
        expect(instance.getSelectedRowKeys()).toEqual([1]);
        expect(selectionChangedCount).toBe(1);

        dataSource.splice(1, 1); // Remove the item with id 2
        await instance.refresh(repaintChangesOnly);

        expect(instance.getSelectedRowKeys()).toEqual([1]);
        expect(selectionChangedCount).toBe(1);
      });
    });
  });
});
