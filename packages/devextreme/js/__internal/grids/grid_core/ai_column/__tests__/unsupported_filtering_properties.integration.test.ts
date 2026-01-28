import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { GenerateGridColumnCommandResponse, RequestParams } from '@js/common/ai-integration';
import type { ColumnAIOptions } from '@js/common/grids';
import type DataGrid from '@js/ui/data_grid';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';

import {
  afterTest as baseAfterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

interface RequestResult {
  promise: Promise<GenerateGridColumnCommandResponse>;
  abort: () => void;
}

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

const getColumnIndexByName = (instance: DataGrid, columnName: string): number => {
  const columnsController = (instance as any).getController('columns');
  const columnByName = columnsController.getColumnByName(columnName);

  return columnByName.index;
};

const afterTest = baseAfterTest;

describe('Unsupported filtering properties', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('Filter UI options: headerFilter, allowFiltering, allowHeaderFiltering', () => {
    it('should not render filtering tools for AI columns on the first load', async () => {
      const { component, instance } = await createDataGrid({
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

      const aiColumnHeaderIndex = getColumnIndexByName(instance, 'aiColumn');
      const aiColumnHeaderFilter = component.getHeaderCellFilter(aiColumnHeaderIndex);
      const idColumnHeaderIndex = getColumnIndexByName(instance, 'id');
      const idColumnHeaderFilter = component.getHeaderCellFilter(idColumnHeaderIndex);

      expect(aiColumnHeaderFilter).toHaveLength(0);
      expect(idColumnHeaderFilter).toHaveLength(1);
    });

    it('should keep filtering tools hidden after enabling options dynamically', async () => {
      const { component, instance } = await createDataGrid({
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

      component.setDataGridColumnOptions('id', {
        allowFiltering: true,
        allowHeaderFiltering: true,
      });
      component.setDataGridColumnOptions('aiColumn', {
        allowFiltering: true,
        allowHeaderFiltering: true,
      });

      await flushAsync();

      const aiColumnHeaderIndex = getColumnIndexByName(instance, 'aiColumn');
      const aiColumnHeaderFilter = component.getHeaderCellFilter(aiColumnHeaderIndex);
      const idColumnHeaderIndex = getColumnIndexByName(instance, 'id');
      const idColumnHeaderFilter = component.getHeaderCellFilter(idColumnHeaderIndex);

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
      const { component, instance } = await createDataGrid({
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

      component.setDataGridColumnOptions('aiColumn', { allowSearch: true });
      component.setDataGridOptions({ 'searchPanel.visible': true, 'searchPanel.text': 'AI' });
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
      const { component, instance } = await createDataGrid({
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

      component.setDataGridColumnOptions('aiColumn', {
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
      const { component, instance } = await createDataGrid({
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

      component.setDataGridColumnOptions('aiColumn', { filterValue: 'AI Column Item 1' });
      component.setDataGridOptions({ 'filterRow.visible': true });
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

      const { component, instance } = await createDataGrid({
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
      component.setDataGridColumnOptions('aiColumn', { calculateFilterExpression });
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
      const { component, instance } = await createDataGrid({
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

      component.setDataGridColumnOptions('aiColumn', { filterValue: 'test' });
      component.setDataGridOptions({
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
