import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

const SELECTORS = {
  gridContainer: '#gridContainer',
};

const GRID_CONTAINER_ID = 'gridContainer';

const dataSource = [
  { id: 1, name: 'Item 1', value: 1 },
  { id: 2, name: 'Item 2', value: 2 },
  { id: 3, name: 'Item 3', value: 3 },
];

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGrid;
}> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new DataGrid($container.get(0) as HTMLDivElement, options);
  const component = new DataGridModel($container.get(0) as HTMLElement);

  jest.runOnlyPendingTimers();
  resolve({
    $container,
    component,
    instance,
  });
});

const beforeTest = (): void => {
  jest.useFakeTimers();
  jest.spyOn(errors, 'log').mockImplementation(jest.fn());
};

const afterTest = (): void => {
  const $container = $(SELECTORS.gridContainer);
  const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

  dataGrid.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
};

describe('Unsupported properties', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('Sorting properties', () => {
    it('should have no sorting state in the header after a click (first load)', async () => {
      const { component } = await createDataGrid({
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

      const aiHeaders = component.getHeaderByText('AI');
      expect(aiHeaders).toHaveLength(1);
      expect(aiHeaders?.attr('aria-colindex')).toEqual('2');
      expect(aiHeaders?.attr('aria-sort')).toBeUndefined();
      (aiHeaders?.get(0) as HTMLElement).click();
      expect(aiHeaders?.attr('aria-sort')).toBeUndefined();
    });
    it('should have no sorting state in the header after a click (dynamic update)', async () => {
      const { instance, component } = await createDataGrid({
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
      instance.columnOption('AItest', 'allowSorting', true);
      const aiTestHeader = component.getHeaderByText('AI');
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader?.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader?.attr('aria-sort')).toBeUndefined();
      (aiTestHeader?.get(0) as HTMLElement).click();
      expect(aiTestHeader?.attr('aria-sort')).toBeUndefined();
    });
    it('should have no sorting state in the header with sortOrder and sortIndex options (first load)', async () => {
      const { component } = await createDataGrid({
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
      const aiTestHeader = component.getHeaderByText('AI');
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader?.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader?.attr('aria-sort')).toBeUndefined();
      expect(aiTestHeader?.attr('aria-roledescription')).toBeUndefined();
    });
    it('should have no sorting state in the header with sortOrder and sortIndex options (dynamic update)', async () => {
      const { instance, component } = await createDataGrid({
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
      instance.columnOption('AItest', 'sortOrder', 'asc');
      instance.columnOption('AItest', 'sortIndex', 2);
      const aiTestHeader = component.getHeaderByText('AI');
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader?.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader?.attr('aria-sort')).toBeUndefined();
      expect(aiTestHeader?.attr('aria-roledescription')).toBeUndefined();
    });
    it('should have no sorting state in the header with calculateSortValue (first load)', async () => {
      const { component } = await createDataGrid({
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

      const aiTestHeader = component.getHeaderByText('AI');
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader?.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader?.attr('aria-sort')).toBeUndefined();
    });
    it('should have no sorting state in the header with calculateSortValue (dynamic update)', async () => {
      const { instance, component } = await createDataGrid({
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
      instance.columnOption('AItest', 'sortOrder', 'asc');
      instance.columnOption('AItest', 'calculateSortValue', 'name');
      const aiTestHeader = component.getHeaderByText('AI');
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader?.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader?.attr('aria-sort')).toBeUndefined();
    });
  });

  describe('Grouping properties', () => {
    it('Should have no group rows after put group properties in props (first load)', async () => {
      const { component } = await createDataGrid({
        keyExpr: 'id',
        dataSource,
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

      const groupRow = component.getGroupRows();
      expect(groupRow.length).toBe(0);
    });

    it('Should have no group rows after put group properties in props (dynamic update)', async () => {
      const { instance, component } = await createDataGrid({
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
      instance.columnOption('AItest', 'autoExpandGroup', true);
      instance.columnOption('AItest', 'groupIndex', 0);
      instance.columnOption('AItest', 'allowGrouping', true);
      instance.columnOption('AItest', 'calculateGroupValue', 'name');
      instance.columnOption('AItest', 'groupCellTemplate', 'GroupCellTemplate');
      instance.columnOption('AItest', 'showWhenGrouped', true);

      const groupRow = component.getGroupRows();
      expect(groupRow.length).toBe(0);
    });

    describe.each([
      { autoExpandGroup: true },
      { autoExpandGroup: false },
    ])('Group properties combinations autoExpandGroup, groupIndex, allowGrouping', ({ autoExpandGroup }) => {
      it(`Should have no group rows after put group properties: groupIndex=0, allowGrouping=true, autoExpandGroup=${autoExpandGroup} (first load)`, async () => {
        const { component } = await createDataGrid({
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

        const groupRow = component.getGroupRows();
        expect(groupRow.length).toBe(0);
      });

      it(`Should have no group rows after put group properties: groupIndex=0, allowGrouping=true, autoExpandGroup=${autoExpandGroup} (dynamic update)`, async () => {
        const { instance, component } = await createDataGrid({
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

        instance.columnOption('AItest', 'autoExpandGroup', autoExpandGroup);
        instance.columnOption('AItest', 'groupIndex', 0);
        instance.columnOption('AItest', 'allowGrouping', true);

        const groupRow = component.getGroupRows();
        expect(groupRow.length).toBe(0);
      });
    });

    const templateFn = (element, options) => {
      element.text(`${options?.value ?? 'group'}`);
    };

    describe.each([
      {
        calculateGroupValue: 'name',
        groupCellTemplate: undefined,
        showWhenGrouped: false,
      },
      {
        calculateGroupValue: undefined,
        groupCellTemplate: templateFn,
        showWhenGrouped: false,
      },
      {
        calculateGroupValue: 'name',
        groupCellTemplate: templateFn,
        showWhenGrouped: false,
      },
      {
        calculateGroupValue: undefined,
        groupCellTemplate: undefined,
        showWhenGrouped: false,
      },
      {
        calculateGroupValue: 'name',
        groupCellTemplate: undefined,
        showWhenGrouped: true,
      },
      {
        calculateGroupValue: undefined,
        groupCellTemplate: templateFn,
        showWhenGrouped: true,
      },
      {
        calculateGroupValue: 'name',
        groupCellTemplate: templateFn,
        showWhenGrouped: true,
      },
      {
        calculateGroupValue: undefined,
        groupCellTemplate: undefined,
        showWhenGrouped: true,
      },
    ])(
      'Group properties combinations calculateGroupValue, groupCellTemplate, showWhenGrouped)',
      ({ calculateGroupValue, groupCellTemplate, showWhenGrouped }) => {
        it(`Should have no group rows after put group properties calculateGroupValue=${calculateGroupValue}, groupCellTemplate=${groupCellTemplate ? 'function' : 'undefined'}, showWhenGrouped=${showWhenGrouped} (first load)`, async () => {
          const { component } = await createDataGrid({
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

          const groupRow = component.getGroupRows();
          expect(groupRow.length).toBe(0);
        });

        it(`Should have no group rows after put group properties calculateGroupValue=${calculateGroupValue}, groupCellTemplate=${groupCellTemplate}, showWhenGrouped=${showWhenGrouped} (dynamic update)`, async () => {
          const { instance, component } = await createDataGrid({
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

          instance.columnOption('AItest', 'calculateGroupValue', calculateGroupValue);
          instance.columnOption('AItest', 'groupCellTemplate', groupCellTemplate);
          instance.columnOption('AItest', 'showWhenGrouped', showWhenGrouped);

          const groupRow = component.getGroupRows();
          expect(groupRow.length).toBe(0);
        });
      },
    );
  });
});
