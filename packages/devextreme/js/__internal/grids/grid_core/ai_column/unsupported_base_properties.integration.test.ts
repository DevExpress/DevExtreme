import { beforeEach } from 'node:test';

import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

const SELECTORS = {
  gridContainer: '#gridContainer',
  headerCell: '[aria-colindex]',
};

const GRID_CONTAINER_ID = 'gridContainer';

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{ $container: dxElementWrapper; instance: DataGridModel }> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new DataGrid($container.get(0) as HTMLDivElement, {
    ...options,
  });

  const contentReadyHandler = (): void => {
    resolve({ $container, instance: new DataGridModel($container.get(0) as HTMLElement) });
    instance.off('contentReady', contentReadyHandler);
  };

  instance.on('contentReady', contentReadyHandler);
});

const getGrid = (): DataGrid => {
  const $container = $(SELECTORS.gridContainer);
  return ($container as any).dxDataGrid('instance') as DataGrid;
};

const dataSource = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

describe('Unsupported properties', () => {
  beforeEach(async () => {

  });
  afterEach(() => {
    const dataGrid = getGrid();

    dataGrid.dispose();
    $(SELECTORS.gridContainer).remove();
  });

  describe('Sorting properties', () => {
    it('should have no sorting state in the header after a click (first load)', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        showBorders: true,
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',

            allowSorting: true,
          },
        ],
      });
      // const $headers = $(instance.element()).find(SELECTORS.headerCell);
      const $headers = instance.getHeaders();
      const aiTestHeader = $(Array.from($headers).find((el) => $(el).text().includes('AI')));
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
      (aiTestHeader.get(0) as HTMLElement).click();
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
    });
    it('should have no sorting state in the header after a click (dynamic update)', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        showBorders: true,
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
          },
        ],
      });
      instance.apiColumnOption('AItest', 'allowSorting', true);
      const $headers = instance.getHeaders();
      const aiTestHeader = $(Array.from($headers).find((el) => $(el).text().includes('AI')));
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
      (aiTestHeader.get(0) as HTMLElement).click();
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
    });
    it('should have no sorting state in the header with sortOrder and sortIndex options (first load)', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        showBorders: true,
        columns: [
          {
            dataField: 'id',
            sortOrder: 'asc',
            sortIndex: 1,
          },
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',

            sortOrder: 'asc',
            sortIndex: 2,
          },
        ],
      });
      const $headers = instance.getHeaders();
      const aiTestHeader = $(Array.from($headers).find((el) => $(el).text().includes('AI')));
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
      expect(aiTestHeader.attr('aria-roledescription')).toBeUndefined();
    });
    it('should have no sorting state in the header with sortOrder and sortIndex options (dynamic update)', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        showBorders: true,
        columns: [
          {
            dataField: 'id',
            sortOrder: 'asc',
            sortIndex: 1,
          },
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
          },
        ],
      });
      instance.apiColumnOption('AItest', 'sortOrder', 'asc');
      instance.apiColumnOption('AItest', 'sortIndex', 2);
      const $headers = instance.getHeaders();
      const aiTestHeader = $(Array.from($headers).find((el) => $(el).text().includes('AI')));
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
      expect(aiTestHeader.attr('aria-roledescription')).toBeUndefined();
    });
    it('should have no sorting state in the header with calculateSortValue (first load)', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        showBorders: true,
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',

            sortOrder: 'asc',
            calculateGroupValue: 'name',
          },
        ],
      });
      const $headers = instance.getHeaders();
      const aiTestHeader = $(Array.from($headers).find((el) => $(el).text().includes('AI')));
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
    });
    it('should have no sorting state in the header with calculateSortValue (dynamic update)', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        showBorders: true,
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
          },
        ],
      });
      instance.apiColumnOption('AItest', 'sortOrder', 'asc');
      instance.apiColumnOption('AItest', 'calculateSortValue', 'name');
      const $headers = instance.getHeaders();
      const aiTestHeader = $(Array.from($headers).find((el) => $(el).text().includes('AI')));
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
    });
  });

  describe('Grouping properties', () => {
    it('Should have no group rows after put group properties in props (first load)', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        showBorders: true,
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
            autoExpandGroup: true,
            groupIndex: 0,
            allowGrouping: true,
            calculateGroupValue: 'name',
            groupCellTemplate: 'GroupCellTemplate',
            showWhenGrouped: true,
          },
        ],
      });

      const groupRow = instance.getGroupColumns();
      expect(groupRow.length).toBe(0);
    });

    it('Should have no group rows after put group properties in props (dynamic update)', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        showBorders: true,
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
          },
        ],
      });
      instance.apiColumnOption('AItest', 'autoExpandGroup', true);
      instance.apiColumnOption('AItest', 'groupIndex', 0);
      instance.apiColumnOption('AItest', 'allowGrouping', true);
      instance.apiColumnOption('AItest', 'calculateGroupValue', 'name');
      instance.apiColumnOption('AItest', 'groupCellTemplate', 'GroupCellTemplate');
      instance.apiColumnOption('AItest', 'showWhenGrouped', true);

      const groupRow = instance.getGroupColumns();
      expect(groupRow.length).toBe(0);
    });

    describe.each([
      { autoExpandGroup: true },
      { autoExpandGroup: false },
    ])('Group properties combinations autoExpandGroup, groupIndex, allowGrouping', ({ autoExpandGroup }) => {
      it(`Should have no group rows after put group properties: groupIndex=0, allowGrouping=true, autoExpandGroup=${autoExpandGroup} (first load)`, async () => {
        const { instance } = await createDataGrid({
          dataSource,
          showBorders: true,
          columns: [
            'id',
            {
              caption: 'AI',
              type: 'ai',
              name: 'AItest',
              autoExpandGroup,
              groupIndex: 0,
              allowGrouping: true,
            },
          ],
        });

        const groupRow = instance.getGroupColumns();
        expect(groupRow.length).toBe(0);
      });

      it(`Should have no group rows after put group properties: groupIndex=0, allowGrouping=true, autoExpandGroup=${autoExpandGroup} (dynamic update)`, async () => {
        const { instance } = await createDataGrid({
          dataSource,
          showBorders: true,
          columns: [
            'id',
            {
              caption: 'AI',
              type: 'ai',
              name: 'AItest',
            },
          ],
        });

        instance.apiColumnOption('AItest', 'autoExpandGroup', autoExpandGroup);
        instance.apiColumnOption('AItest', 'groupIndex', 0);
        instance.apiColumnOption('AItest', 'allowGrouping', true);

        const groupRow = instance.getGroupColumns();
        expect(groupRow.length).toBe(0);
      });
    });

    describe.each([
      { calculateGroupValue: 'name', groupCellTemplate: undefined, showWhenGrouped: false },
      { calculateGroupValue: undefined, groupCellTemplate: 'template', showWhenGrouped: false },
      { calculateGroupValue: 'name', groupCellTemplate: 'template', showWhenGrouped: false },
      { calculateGroupValue: undefined, groupCellTemplate: undefined, showWhenGrouped: false },
      { calculateGroupValue: 'name', groupCellTemplate: undefined, showWhenGrouped: true },
      { calculateGroupValue: undefined, groupCellTemplate: 'template', showWhenGrouped: true },
      { calculateGroupValue: 'name', groupCellTemplate: 'template', showWhenGrouped: true },
      { calculateGroupValue: undefined, groupCellTemplate: undefined, showWhenGrouped: true },
    ])(
      'Group properties combinations calculateGroupValue, groupCellTemplate, showWhenGrouped)',
      ({ calculateGroupValue, groupCellTemplate, showWhenGrouped }) => {
        it(`Should have no group rows after put group properties calculateGroupValue=${calculateGroupValue}, groupCellTemplate=${groupCellTemplate}, showWhenGrouped=${showWhenGrouped} (first load)`, async () => {
          const { instance } = await createDataGrid({
            dataSource,
            showBorders: true,
            columns: [
              'id',
              {
                caption: 'AI',
                type: 'ai',
                name: 'AItest',
                calculateGroupValue,
                groupCellTemplate,
                showWhenGrouped,
              },
            ],
          });

          const groupRow = instance.getGroupColumns();
          expect(groupRow.length).toBe(0);
        });

        it(`Should have no group rows after put group properties calculateGroupValue=${calculateGroupValue}, groupCellTemplate=${groupCellTemplate}, showWhenGrouped=${showWhenGrouped} (dynamic update)`, async () => {
          const { instance } = await createDataGrid({
            dataSource,
            showBorders: true,
            columns: [
              'id',
              {
                caption: 'AI',
                type: 'ai',
                name: 'AItest',
              },
            ],
          });

          instance.apiColumnOption('AItest', 'calculateGroupValue', calculateGroupValue);
          instance.apiColumnOption('AItest', 'groupCellTemplate', groupCellTemplate);
          instance.apiColumnOption('AItest', 'showWhenGrouped', showWhenGrouped);

          const groupRow = instance.getGroupColumns();
          expect(groupRow.length).toBe(0);
        });
      },
    );
  });
});
