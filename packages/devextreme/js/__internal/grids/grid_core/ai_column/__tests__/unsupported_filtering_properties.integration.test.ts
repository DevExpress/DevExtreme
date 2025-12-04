import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { GenerateGridColumnCommandResponse, RequestParams } from '@js/common/ai-integration';
import type { ColumnAIOptions } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

interface RequestResult {
  promise: Promise<GenerateGridColumnCommandResponse>;
  abort: () => void;
}

const GRID_CONTAINER_ID = 'gridContainer';

const SELECTORS = {
  gridContainer: `#${GRID_CONTAINER_ID}`,
};

const dataSource = [
  { id: 1, name: 'Item 1', value: 1 },
  { id: 2, name: 'Item 2', value: 2 },
  { id: 3, name: 'Item 3', value: 3 },
];

const createAIIntegration = (
  delay: number,
): AIIntegration => new AIIntegration({
  sendRequest(prompt: RequestParams): RequestResult {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const promise = new Promise<string>((resolve) => {
      const result: Record<string, string> = {};

      Object
        .entries(prompt.data?.data ?? {})
        .forEach(([key, value]) => {
          result[key] = `AI Column ${(value as { name: string }).name}`;
        });

      timeoutId = setTimeout(() => {
        resolve(JSON.stringify(result));
      }, delay);
    });
    const abort = (): void => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };

    return { promise, abort };
  },
});

const getAIColumnOptions = (delay: number): ColumnAIOptions => ({
  prompt: 'Very ingenious AI prompt',
  emptyText: 'Empty data',
  noDataText: 'No data',
  editorOptions: {
    width: 800,
    height: 600,
  },
  aiIntegration: createAIIntegration(delay),
});

const flushAsync = async (): Promise<void> => {
  jest.runOnlyPendingTimers();
  await Promise.resolve();
};

const getColumnIndexByName = (instance: DataGrid, columnName: string): number => {
  const columnsController = (instance as any).getController('columns');
  const columnByName = columnsController.getColumnByName(columnName);

  return columnByName.index;
};

const getColumnHeaderCell = (instance: DataGrid, columnName: string): dxElementWrapper => {
  const $element = $(instance.element());
  const columnIndexByName = getColumnIndexByName(instance, columnName);

  return $element.find('.dx-header-row td').eq(columnIndexByName);
};

const getColumnHeaderFilter = (
  $columnHeaderCell: dxElementWrapper,
): dxElementWrapper => $columnHeaderCell.find('.dx-column-indicators .dx-header-filter');

const setGridColumnOptions = (
  instance: DataGrid,
  columnName: string,
  options: Record<string, unknown>,
): void => {
  Object.entries(options).forEach(([optionName, optionValue]) => {
    instance.columnOption(columnName, optionName, optionValue);
  });
};

const setGridOptions = (
  instance: DataGrid,
  options: Record<string, unknown>,
): void => {
  Object.entries(options).forEach(([optionName, optionValue]) => {
    instance.option(optionName, optionValue);
  });
};

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

  jest.runAllTimers();
  resolve({
    $container,
    component,
    instance,
  });
});

const beforeTest = (): void => {
  jest.useFakeTimers();
};

const afterTest = (): void => {
  const $container = $(SELECTORS.gridContainer);
  const dataGrid = (
    $container as dxElementWrapper & { dxDataGrid: (command: string) => DataGrid }
  ).dxDataGrid('instance');

  dataGrid.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
};

describe('Unsupported filtering properties', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('Filter UI options: headerFilter, allowFiltering, allowHeaderFiltering', () => {
    it('should not render filtering tools for AI columns on the first load', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        headerFilter: { visible: true },
        columns: [
          {
            dataField: 'id',
            caption: 'ID',
            allowFiltering: true,
            allowHeaderFiltering: true,
          },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
            allowFiltering: true,
            allowHeaderFiltering: true,
          },
        ],
      });

      await flushAsync();

      const aiColumnHeaderCell = getColumnHeaderCell(instance, 'aiColumn');
      const aiColumnHeaderFilter = getColumnHeaderFilter(aiColumnHeaderCell);
      const idColumnHeaderCell = getColumnHeaderCell(instance, 'id');
      const idColumnHeaderFilter = getColumnHeaderFilter(idColumnHeaderCell);

      expect(aiColumnHeaderFilter).toHaveLength(0);
      expect(idColumnHeaderFilter).toHaveLength(1);
    });

    it('should keep filtering tools hidden after enabling options dynamically', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        headerFilter: { visible: true },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
          },
        ],
      });

      setGridColumnOptions(instance, 'id', {
        allowFiltering: true,
        allowHeaderFiltering: true,
      });
      setGridColumnOptions(instance, 'aiColumn', {
        allowFiltering: true,
        allowHeaderFiltering: true,
      });

      await flushAsync();

      const aiColumnHeaderCell = getColumnHeaderCell(instance, 'aiColumn');
      const aiColumnHeaderFilter = getColumnHeaderFilter(aiColumnHeaderCell);
      const idColumnHeaderCell = getColumnHeaderCell(instance, 'id');
      const idColumnHeaderFilter = getColumnHeaderFilter(idColumnHeaderCell);

      expect(aiColumnHeaderFilter).toHaveLength(0);
      expect(idColumnHeaderFilter).toHaveLength(1);
    });
  });

  describe('Filter UI options: searchPanel, allowSearch', () => {
    it('should not search on AI Column values while loading with predefined search text', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'id',
        dataSource,
        searchPanel: { visible: true, text: 'AI' },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
            allowSearch: true,
          },
        ],
      });

      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(0);
    });

    it('should not search on AI Column values while searching by text', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'id',
        dataSource,
        searchPanel: { visible: true },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
            allowSearch: true,
          },
        ],
      });

      await flushAsync();

      const aiColumnIndex = getColumnIndexByName(instance, 'aiColumn');
      const visibleRows = instance.getVisibleRows();

      expect(visibleRows).toHaveLength(dataSource.length);
      visibleRows.forEach((row) => {
        expect(row.values.at(aiColumnIndex)).toContain('AI');
      });

      instance.searchByText('AI');
      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(0);
    });

    it('should not search on AI Column values while changing options dynamically', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'id',
        dataSource,
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
          },
        ],
      });

      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);

      setGridColumnOptions(instance, 'aiColumn', { allowSearch: true });
      setGridOptions(instance, { 'searchPanel.visible': true, 'searchPanel.text': 'AI' });
      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(0);
    });
  });

  describe('Filter criteria options: filterOperations, filterValues, filterType, selectedFilterOperation', () => {
    it('should ignore filter criteria options on the first load', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        headerFilter: { visible: true },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
            filterOperations: ['contains'],
            selectedFilterOperation: 'contains',
            filterType: 'exclude',
            filterValues: ['AI Column Item 1'],
          },
        ],
      });

      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);
    });

    it('should ignore filter criteria options after dynamic changes', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        headerFilter: { visible: true },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
          },
        ],
      });

      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);

      setGridColumnOptions(instance, 'aiColumn', {
        filterOperations: ['contains'],
        selectedFilterOperation: 'contains',
        filterType: 'exclude',
        filterValues: ['AI Column Item 1'],
      });
      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);
    });
  });

  describe('Filter expression options: filterValue, calculateFilterExpression, filterSync', () => {
    it('should ignore filterValue on the first load', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        filterRow: { visible: true },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
            filterValue: 'AI Column Item 1',
          },
        ],
      });

      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);
    });

    it('should ignore filterValue after dynamic changes', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
          },
        ],
      });

      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);

      setGridColumnOptions(instance, 'aiColumn', { filterValue: 'AI Column Item 1' });
      setGridOptions(instance, { 'filterRow.visible': true });
      await flushAsync();

      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);
    });

    it('should ignore calculateFilterExpression on the first load', async () => {
      const calculateFilterExpression = jest.fn(() => ['aiColumn', '=', 1]);

      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
            calculateFilterExpression,
          },
        ],
      });

      await flushAsync();

      expect(calculateFilterExpression).not.toHaveBeenCalled();
      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);
    });

    it('should ignore calculateFilterExpression after dynamic changes', async () => {
      const calculateFilterExpression = jest.fn(() => ['aiColumn', '=', 1]);

      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
          },
        ],
      });

      await flushAsync();
      setGridColumnOptions(instance, 'aiColumn', { calculateFilterExpression });
      await flushAsync();

      expect(calculateFilterExpression).not.toHaveBeenCalled();
      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);
    });

    it('should not include AI Column in filterValue when filterSyncEnabled on the first load', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        filterSyncEnabled: true,
        filterRow: { visible: true },
        filterPanel: { visible: true },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
            filterValue: 'test',
          },
        ],
      });

      await flushAsync();

      expect(instance.option('filterValue')).toBeNull();
      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);
    });

    it('should not include AI Column in filterValue when filterSyncEnabled after dynamic changes', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'aiColumn',
            ai: getAIColumnOptions(100),
          },
        ],
      });

      await flushAsync();

      setGridColumnOptions(instance, 'aiColumn', { filterValue: 'test' });
      setGridOptions(instance, {
        filterSyncEnabled: true,
        'filterRow.visible': true,
        'filterPanel.visible': true,
      });
      await flushAsync();

      expect(instance.option('filterValue')).toBeNull();
      expect(instance.getVisibleRows()).toHaveLength(dataSource.length);
    });
  });
});
