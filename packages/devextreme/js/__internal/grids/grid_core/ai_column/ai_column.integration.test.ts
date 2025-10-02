import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { RequestParams } from '@js/common/ai-integration';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';

const SELECTORS = {
  gridContainer: '#gridContainer',
};

const GRID_CONTAINER_ID = 'gridContainer';

interface RequestResult {
  promise: Promise<string>;
  abort: () => void;
}

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{ $container: dxElementWrapper; instance: DataGrid }> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new DataGrid($container.get(0) as HTMLDivElement, options);

  jest.runOnlyPendingTimers();
  resolve({ $container, instance });
});

describe('GridCore AI Column', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(errors, 'log').mockImplementation(jest.fn());
  });
  afterEach(() => {
    const $container = $(SELECTORS.gridContainer);
    const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

    dataGrid.dispose();
    $container.remove();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('when the name is not set', () => {
    it('should throw E1066', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(): RequestResult {
          return {
            promise: new Promise<string>((resolve) => {
              resolve('1');
            }),
            abort: (): void => { },
          };
        },
      });
      await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            ai: {
              aiIntegration,
            },
          },
        ],
      });

      expect(errors.log).toHaveBeenCalledWith('E1066');
    });
  });

  describe('when the name specified is not unique', () => {
    it('should throw E1059', async () => {
      await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          {
            dataField: 'value',
            caption: 'Value',
            name: 'myColumn',
          },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
          },
        ],
      });

      expect(errors.log).toHaveBeenCalledWith('E1059', '"myColumn"');
    });
  });

  describe('columnOption', () => {
    it('should return a column by name', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
          },
        ],
      });

      const aiColumn = instance.columnOption('myColumn');

      expect(aiColumn.type).toBe('ai');
      expect(aiColumn.caption).toBe('AI Column');
      expect(aiColumn.index).toBe(3);
    });

    describe('when the name is reset', () => {
      it('should throw E1066', async () => {
        const { instance } = await createDataGrid({
          dataSource: [
            { id: 1, name: 'Name 1', value: 10 },
          ],
          columns: [
            { dataField: 'id', caption: 'ID' },
            { dataField: 'name', caption: 'Name' },
            { dataField: 'value', caption: 'Value' },
            {
              type: 'ai',
              caption: 'AI Column',
              name: 'myColumn',
            },
          ],
        });

        instance.columnOption('myColumn', 'name', '');

        expect(errors.log).toHaveBeenCalledWith('E1066');
      });
    });

    describe('when the name specified is not unique', () => {
      it('should throw E1059', async () => {
        const { instance } = await createDataGrid({
          dataSource: [
            { id: 1, name: 'Name 1', value: 10 },
          ],
          columns: [
            { dataField: 'id', caption: 'ID' },
            { dataField: 'name', caption: 'Name' },
            {
              dataField: 'value',
              caption: 'Value',
              name: 'myColumn1',
            },
            {
              type: 'ai',
              caption: 'AI Column',
              name: 'myColumn2',
            },
          ],
        });

        instance.columnOption('myColumn2', 'name', 'myColumn1');

        expect(errors.log).toHaveBeenCalledWith('E1059', '"myColumn1"');
      });
    });
  });

  describe('AiIntegration', () => {
    const rootSendRequestSpy = jest.fn();
    const columnSendRequestSpy = jest.fn();

    beforeEach(() => {
      rootSendRequestSpy.mockClear();
      columnSendRequestSpy.mockClear();
    });

    const aiIntegrationResult = (): RequestResult => ({
      promise: new Promise<string>((resolve) => {
        resolve('1');
      }),
      abort: (): void => { },
    });

    const rootAiIntegration = new AIIntegration({
      sendRequest(): RequestResult {
        rootSendRequestSpy();
        return aiIntegrationResult();
      },
    });
    const columnAiIntegration = new AIIntegration({
      sendRequest(): RequestResult {
        columnSendRequestSpy();
        return aiIntegrationResult();
      },
    });

    it('should be taken from grid level if it set up (first load)', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        keyExpr: 'id',
        aiIntegration: rootAiIntegration,
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      expect(rootSendRequestSpy).toHaveBeenCalled();
      expect(columnSendRequestSpy).not.toHaveBeenCalled();
    });
    it('should be taken from grid level if it set up (dynamic update)', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
          },
        ],
      });
      instance.option('aiIntegration', rootAiIntegration);
      instance.sendAIColumnRequest('myColumn');
      expect(rootSendRequestSpy).toHaveBeenCalled();
      expect(columnSendRequestSpy).not.toHaveBeenCalled();
    });
    it('should be taken from column level if it set up (first load)', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        keyExpr: 'id',
        aiIntegration: rootAiIntegration,
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              aiIntegration: columnAiIntegration,
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestSpy).toHaveBeenCalled();
      expect(rootSendRequestSpy).not.toHaveBeenCalled();
    });

    it('should be taken from column level if it set up (dynamic update)', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
          },
        ],
      });
      instance.columnOption('myColumn', 'ai', { aiIntegration: columnAiIntegration });
      instance.option('aiIntegration', rootAiIntegration);
      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestSpy).toHaveBeenCalled();
      expect(rootSendRequestSpy).not.toHaveBeenCalled();
    });
  });

  describe('Prompt', () => {
    const columnSendRequestSpy = jest.fn();
    const prompt = 'Test prompt';

    beforeEach(() => {
      columnSendRequestSpy.mockClear();
    });

    const aiIntegrationResult = (): RequestResult => ({
      promise: new Promise<string>((resolve) => {
        resolve('1');
      }),
      abort: (): void => { },
    });

    const columnAiIntegration = new AIIntegration({
      sendRequest(params: RequestParams): RequestResult {
        columnSendRequestSpy(params.prompt.user?.includes(prompt));
        return aiIntegrationResult();
      },
    });

    it('should be passed to aiIntegration.sendRequest (first load)', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              aiIntegration: columnAiIntegration,
              prompt,
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestSpy).toHaveBeenCalledWith(true);
    });

    it('should be passed to aiIntegration.sendRequest (dynamic update)', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              aiIntegration: columnAiIntegration,
            },
          },
        ],
      });
      instance.columnOption('myColumn', 'ai.prompt', prompt);
      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestSpy).toHaveBeenCalledWith(true);
    });

    describe('when aiIntegration is not set', () => {
      it('should throw E1067', async () => {
        await createDataGrid({
          dataSource: [
            { id: 1, name: 'Name 1', value: 10 },
          ],
          columns: [
            { dataField: 'id', caption: 'ID' },
            { dataField: 'name', caption: 'Name' },
            { dataField: 'value', caption: 'Value' },
            {
              type: 'ai',
              caption: 'AI Column',
              name: 'myColumn',
            },
          ],
        });
        expect(errors.log).toHaveBeenCalledWith('E1067', 'myColumn');
      });
    });
  });

  describe('AI Mode', () => {
    const columnSendRequestSpy = jest.fn();

    beforeEach(() => {
      columnSendRequestSpy.mockClear();
    });

    const aiIntegrationResult = (): RequestResult => ({
      promise: new Promise<string>((resolve) => {
        resolve('1');
      }),
      abort: (): void => { },
    });

    const columnAiIntegration = new AIIntegration({
      sendRequest(): RequestResult {
        columnSendRequestSpy();
        return aiIntegrationResult();
      },
    });

    it('should be auto by default', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              aiIntegration: columnAiIntegration,
            },
          },
        ],
      });
      const aiMode = instance.columnOption('myColumn', 'ai.mode');
      expect(aiMode).toBe('auto');
    });
    it('should call aiIntegration.sendRequest with every visible rows change', async () => {
      const dataSource = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Name ${i + 1}`,
        value: (i + 1) * 10,
      }));
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        paging: {
          pageSize: 5,
        },
        pager: {
          visible: true,
        },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              aiIntegration: columnAiIntegration,
            },
          },
        ],
      });

      expect(columnSendRequestSpy).toBeCalledTimes(1);

      instance.option('paging.pageIndex', 2);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(2);

      instance.option('paging.pageIndex', 3);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(3);

      instance.option('filterValue', ['id', '>', 50]);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(4);

      instance.option('filterValue', undefined);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(5);

      instance.columnOption('name', 'groupIndex', 0);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(6);

      instance.clearGrouping();
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(7);
    });

    it('should NOT call aiIntegration.sendRequest with manual mode', async () => {
      const dataSource = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Name ${i + 1}`,
        value: (i + 1) * 10,
      }));
      const { instance } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        paging: {
          pageSize: 5,
        },
        pager: {
          visible: true,
        },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              aiIntegration: columnAiIntegration,
              mode: 'manual',
            },
          },
        ],
      });

      expect(columnSendRequestSpy).toBeCalledTimes(0);

      instance.option('paging.pageIndex', 2);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(0);

      instance.option('paging.pageIndex', 3);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(0);

      instance.option('filterValue', ['id', '>', 50]);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(0);

      instance.option('filterValue', undefined);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(0);

      instance.columnOption('name', 'groupIndex', 0);
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(0);

      instance.clearGrouping();
      jest.runOnlyPendingTimers();
      expect(columnSendRequestSpy).toBeCalledTimes(0);
    });
  });
});
