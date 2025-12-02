import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import { CustomStore } from '@js/common/data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type { GridsEditRefreshMode, Properties as DataGridProperties } from '../../../../ui/data_grid';
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

describe('GridCore selection', () => {
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
          repaintChangesOnly,
        });

        await instance.selectRows([2], false);
        expect(instance.getSelectedRowKeys()).toEqual([2]);

        dataSource.splice(1, 1); // Remove the item with id 2

        await instance.refresh(repaintChangesOnly);

        expect(instance.getSelectedRowKeys()).toEqual([]);
      });

      it(`selectionChanged handler is not called after refresh if selectedItem still present in dataSource with repaintChangesOnly=${repaintChangesOnly}`, async () => {
        const dataSource = [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ];

        let selectionChangedCount = 0;

        const { instance } = await createDataGrid({
          dataSource,
          columns: ['id', 'name'],
          keyExpr: 'id',
          selection: {
            mode: 'single',
          },
          repaintChangesOnly,
          onSelectionChanged: () => {
            selectionChangedCount += 1;
          },
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

  describe('remote dataSource', () => {
    ([
      { refreshMode: 'full', expectedCallCount: 2 },
      { refreshMode: 'reshape', expectedCallCount: 1 },
      { refreshMode: 'repaint', expectedCallCount: 0 },
    ] as { refreshMode: GridsEditRefreshMode; expectedCallCount: number }[])
      .forEach(({ refreshMode, expectedCallCount }) => {
        it(`dataSource.load is not called to load selectedRow after data save with editing.refreshMode=${refreshMode}`, async () => {
          let data = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' },
            { id: 4, name: 'Item 4' },
          ];

          const store = new CustomStore({
            key: 'id',
            load: (e) => {
              const skip = e.skip ?? 0;
              const take = e.take ?? data.length;
              const pageData = data.slice(skip, skip + take);
              return Promise.resolve({
                data: pageData,
                totalCount: data.length,
              });
            },
            remove(key) {
              data = data.filter((item) => item.id !== key);
              return Promise.resolve();
            },
          });

          const { instance } = await createDataGrid({
            dataSource: store,
            editing: {
              mode: 'batch',
              refreshMode,
              allowDeleting: true,
            },
            remoteOperations: true,
            paging: {
              pageSize: 2,
            },
            columns: ['id', 'name'],
            keyExpr: 'id',
            selection: {
              mode: 'multiple',
              showCheckBoxesMode: 'always',
            },
          });

          await instance.selectRows([4], false);

          let callCount = 0;
          store.on('loading', () => {
            callCount += 1;
          });

          instance.option('editing.changes', [{
            type: 'remove',
            key: 1,
          }]);
          await instance.saveEditData();

          expect(callCount).toBe(expectedCallCount);
        });
      });
  });
});
