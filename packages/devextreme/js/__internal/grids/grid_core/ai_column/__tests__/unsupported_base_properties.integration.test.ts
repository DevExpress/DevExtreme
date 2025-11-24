import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { GenerateGridColumnCommandResponse } from '@js/common/ai-integration';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
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

const EMPTY_CELL_TEXT = '\u00A0';

interface RequestResult {
  promise: Promise<GenerateGridColumnCommandResponse>;
  abort: () => void;
}

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

      const aiTestHeader = component.getHeaderByText('AI');
      expect(aiTestHeader).toHaveLength(1);
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
      (aiTestHeader.get(0) as HTMLElement).click();
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
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
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
      (aiTestHeader.get(0) as HTMLElement).click();
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
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
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
      expect(aiTestHeader.attr('aria-roledescription')).toBeUndefined();
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
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
      expect(aiTestHeader.attr('aria-roledescription')).toBeUndefined();
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
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
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
      expect(aiTestHeader.attr('aria-colindex')).toEqual('2');
      expect(aiTestHeader.attr('aria-sort')).toBeUndefined();
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

  describe('Formatting properties', () => {
    it('Should not apply format to AI column (first load)', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                const { id, name } = value as { id: number; name: string };
                if (id === 1) {
                  result[key] = '';
                } else {
                  result[key] = `Response ${name}`;
                }
              });
              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
        },
      });
      const { component } = await createDataGrid({
        dataSource,
        showBorders: true,
        keyExpr: 'id',
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
            ai: {
              prompt: 'Provide name for item with value {value}',
              aiIntegration,
            },
            format: {
              type: 'currency',
              precision: 0,
              currency: 'EUR',
            },
            trueText: 'Yes',
            falseText: 'No',
            buttons: ['edit', 'delete'],
            setCellValue: (rowData, value) => {
              rowData.name = value;
            },
          },
        ],
      });

      await Promise.resolve();

      expect(component.getDataCell(0, 1).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 1).getText()).toBe('Response Item 2');
    });
  });

  describe('Binding properties', () => {
    const aiIntegration = new AIIntegration({
      sendRequest(prompt): RequestResult {
        return {
          promise: new Promise<string>((resolve) => {
            const result = {};
            Object.entries(prompt.data?.data).forEach(([key, value]) => {
              const { name } = value as { name: string };
              result[key] = `Response ${name}`;
            });
            resolve(JSON.stringify(result));
          }),
          abort: (): void => {},
        };
      },
    });
    it('Should not bind AI column to dataField (first load)', async () => {
      const { component } = await createDataGrid({
        dataSource,
        showBorders: true,
        keyExpr: 'id',
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
            dataField: 'name',
            ai: {
              prompt: 'Provide name for item with value {value}',
              aiIntegration,
            },
          },
        ],
      });
      await Promise.resolve();
      expect(component.getDataCell(0, 1).getText()).toBe('Response Item 1');
      expect(component.getDataCell(1, 1).getText()).toBe('Response Item 2');
    });

    it('Should not bind AI column to dataField (dynamic update)', async () => {
      const { instance, component } = await createDataGrid({
        dataSource,
        showBorders: true,
        keyExpr: 'id',
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
            ai: {
              prompt: 'Provide name for item with value {value}',
              aiIntegration,
            },
          },
        ],
      });
      await Promise.resolve();
      instance.columnOption('AItest', 'dataField', 'name');
      await Promise.resolve();
      expect(component.getDataCell(0, 1).getText()).toBe('Response Item 1');
      expect(component.getDataCell(1, 1).getText()).toBe('Response Item 2');
    });

    it('Should not take into account calculateCellValue (first load)', async () => {
      const { component } = await createDataGrid({
        dataSource,
        showBorders: true,
        keyExpr: 'id',
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
            dataField: 'name',
            calculateCellValue: (data) => data.name,
            ai: {
              prompt: 'Provide name for item with value {value}',
              aiIntegration,
            },
          },
        ],
      });
      await Promise.resolve();
      expect(component.getDataCell(0, 1).getText()).toBe('Response Item 1');
      expect(component.getDataCell(1, 1).getText()).toBe('Response Item 2');
    });

    it('Should not take into account calculateCellValue (dynamic update)', async () => {
      const { instance, component } = await createDataGrid({
        dataSource,
        showBorders: true,
        keyExpr: 'id',
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
            ai: {
              prompt: 'Provide name for item with value {value}',
              aiIntegration,
            },
          },
        ],
      });
      await Promise.resolve();
      instance.columnOption('AItest', 'dataField', 'name');
      instance.columnOption('AItest', 'calculateCellValue', (data) => data.name);
      await Promise.resolve();
      expect(component.getDataCell(0, 1).getText()).toBe('Response Item 1');
      expect(component.getDataCell(1, 1).getText()).toBe('Response Item 2');
    });

    it('Should not bind AI column to lookup (first load)', async () => {
      const { component } = await createDataGrid({
        dataSource,
        showBorders: true,
        keyExpr: 'id',
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
            lookup: {
              dataSource: [
                { id: 1, name: 'Lookup 1' },
                { id: 2, name: 'Lookup 2' },
              ],
              valueExpr: 'id',
              displayExpr: 'name',
            },
            ai: {
              prompt: 'Provide name for item with value {value}',
              aiIntegration,
            },
          },
        ],
      });
      await Promise.resolve();
      expect(component.getDataCell(0, 1).getText()).toBe('Response Item 1');
      expect(component.getDataCell(1, 1).getText()).toBe('Response Item 2');
    });

    it('Should not bind AI column to lookup (dynamic update)', async () => {
      const { instance, component } = await createDataGrid({
        dataSource,
        showBorders: true,
        keyExpr: 'id',
        columns: [
          'id',
          {
            caption: 'AI',
            type: 'ai',
            name: 'AItest',
            ai: {
              prompt: 'Provide name for item with value {value}',
              aiIntegration,
            },
          },
        ],
      });
      await Promise.resolve();
      instance.columnOption('AItest', 'lookup', {
        dataSource: [
          { id: 1, name: 'Lookup 1' },
          { id: 2, name: 'Lookup 2' },
        ],
        valueExpr: 'id',
        displayExpr: 'name',
      });
      await Promise.resolve();
      expect(component.getDataCell(0, 1).getText()).toBe('Response Item 1');
      expect(component.getDataCell(1, 1).getText()).toBe('Response Item 2');
    });
  });
});
