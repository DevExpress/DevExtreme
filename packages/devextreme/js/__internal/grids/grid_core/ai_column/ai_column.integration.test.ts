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

  const contentReadyHandler = (): void => {
    resolve({ $container, instance });
    instance.off('contentReady', contentReadyHandler);
  };

  instance.on('contentReady', contentReadyHandler);
});

describe('GridCore AI Column', () => {
  beforeEach(() => {
    jest.spyOn(errors, 'log').mockImplementation(jest.fn());
  });
  afterEach(() => {
    const $container = $(SELECTORS.gridContainer);
    const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

    dataGrid.dispose();
    $container.remove();
    jest.clearAllMocks();
  });

  describe('when the name is not set', () => {
    it('should throw E1066', async () => {
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
  });
});
