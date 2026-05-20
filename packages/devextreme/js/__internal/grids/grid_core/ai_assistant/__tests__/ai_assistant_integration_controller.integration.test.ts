import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  ExecuteGridAssistantCommandParams,
  ExecuteGridAssistantCommandResult,
  RequestCallbacks,
  RequestParams,
} from '@js/common/ai-integration';
import type { Properties } from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';
import { AIAssistantIntegrationController } from '../ai_assistant_integration_controller';
import type { GridContext, JsonSchema } from '../types';

const STUB_SCHEMA: JsonSchema = { type: 'object' };

interface SendRequestResult {
  promise: Promise<string>;
  abort: () => void;
}

const createMockAIIntegration = (
  onExecute?: (
    params: ExecuteGridAssistantCommandParams,
    callbacks: RequestCallbacks<ExecuteGridAssistantCommandResult>,
  ) => void,
): AIIntegration => {
  const abortFn = jest.fn();

  const integration = new AIIntegration({
    sendRequest(): SendRequestResult {
      return {
        promise: Promise.resolve('{}'),
        abort: abortFn,
      };
    },
  });

  const originalExecute = integration.executeGridAssistant
    .bind(integration);

  integration.executeGridAssistant = jest.fn((
    params: ExecuteGridAssistantCommandParams,
    callbacks: RequestCallbacks<ExecuteGridAssistantCommandResult>,
  ): (() => void) => {
    if (onExecute) {
      onExecute(params, callbacks);
      return abortFn;
    }
    return originalExecute(params, callbacks);
  }) as typeof integration.executeGridAssistant;

  return integration;
};

const createController = async (
  options: Record<string, unknown> = {},
): Promise<AIAssistantIntegrationController> => {
  const { instance } = await createDataGrid({
    dataSource: [
      { id: 1, name: 'Name 1' },
      { id: 2, name: 'Name 2' },
    ],
    columns: [
      { dataField: 'id', caption: 'ID', dataType: 'number' },
      { dataField: 'name', caption: 'Name', dataType: 'string' },
    ],
    ...options,
  } as Properties);

  const controller = new AIAssistantIntegrationController(instance);
  controller.init();

  return controller;
};

describe('AIAssistantIntegrationController', () => {
  beforeEach(() => {
    beforeTest();
    jest.spyOn(errors, 'log').mockImplementation(jest.fn());
  });

  afterEach(() => {
    afterTest();
  });

  describe('when aiIntegration is not set', () => {
    it('should log E1068', async () => {
      const controller = await createController({});

      controller.sendRequest('Sort by name', STUB_SCHEMA);

      expect(errors.log).toHaveBeenCalledWith('E1068');
    });
  });

  describe('when aiAssistant.aiIntegration is set', () => {
    it('should use aiAssistant.aiIntegration', async () => {
      const aiIntegration = createMockAIIntegration();
      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA);

      expect(aiIntegration.executeGridAssistant)
        .toHaveBeenCalledTimes(1);
      expect(errors.log).not.toHaveBeenCalledWith('E1068');
    });
  });

  describe('when only grid-level aiIntegration is set', () => {
    it('should fallback to grid aiIntegration', async () => {
      const aiIntegration = createMockAIIntegration();
      const controller = await createController({
        aiIntegration,
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA);

      expect(aiIntegration.executeGridAssistant)
        .toHaveBeenCalledTimes(1);
      expect(errors.log).not.toHaveBeenCalledWith('E1068');
    });
  });

  describe('when both aiIntegrations are set', () => {
    it('should prefer aiAssistant.aiIntegration', async () => {
      const assistantAI = createMockAIIntegration();
      const gridAI = createMockAIIntegration();
      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration: assistantAI },
        aiIntegration: gridAI,
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA);

      expect(assistantAI.executeGridAssistant)
        .toHaveBeenCalledTimes(1);
      expect(gridAI.executeGridAssistant)
        .not.toHaveBeenCalled();
      expect(errors.log).not.toHaveBeenCalledWith('E1068');
    });
  });

  describe('sendRequest', () => {
    it('should pass text to executeGridAssistant', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name ascending', STUB_SCHEMA);

      expect(capturedParams.text).toBe('Sort by name ascending');
      expect(capturedParams.context).toBeDefined();
    });

    it('should pass responseSchema to executeGridAssistant', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const customSchema: JsonSchema = { type: 'object', properties: { action: { type: 'string' } } };

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', customSchema);

      expect(capturedParams.responseSchema).toEqual(customSchema);
    });

    it('should abort previous request when sending new one', async () => {
      const abortSpy = jest.fn();
      const aiIntegration = createMockAIIntegration();

      aiIntegration.executeGridAssistant = jest.fn(
        (): (() => void) => abortSpy,
      ) as typeof aiIntegration.executeGridAssistant;

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA);
      expect(abortSpy).not.toHaveBeenCalled();

      controller.sendRequest('Sort by id', STUB_SCHEMA);
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should allow sending a new request after previous one errored', async () => {
      let capturedCallbacks: RequestCallbacks<ExecuteGridAssistantCommandResult> = {};
      const aiIntegration = createMockAIIntegration((_params, callbacks) => {
        capturedCallbacks = callbacks;
      });

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA);
      capturedCallbacks.onError?.(new Error('Network error'));

      expect(controller.isRequestAwaitingCompletion()).toBe(false);

      controller.sendRequest('Sort by id', STUB_SCHEMA);
      expect(controller.isRequestAwaitingCompletion()).toBe(true);
      expect(aiIntegration.executeGridAssistant).toHaveBeenCalledTimes(2);
    });
  });

  describe('abortRequest', () => {
    it('should abort in-progress request', async () => {
      const abortSpy = jest.fn();
      const aiIntegration = createMockAIIntegration();

      aiIntegration.executeGridAssistant = jest.fn(
        (): (() => void) => abortSpy,
      ) as typeof aiIntegration.executeGridAssistant;

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA);
      expect(controller.isRequestAwaitingCompletion()).toBe(true);

      controller.abortRequest();
      expect(abortSpy).toHaveBeenCalledTimes(1);
      expect(controller.isRequestAwaitingCompletion()).toBe(false);
    });
  });

  describe('onAbort callback', () => {
    it('should call onAbort callback when request is aborted', async () => {
      const onAbort = jest.fn();
      const aiIntegration = createMockAIIntegration();

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA, {
        onComplete: jest.fn(),
        onError: jest.fn(),
        onAbort,
      });

      controller.abortRequest();

      expect(onAbort).toHaveBeenCalledTimes(1);
    });

    it('should call onAbort callback when new request aborts previous one', async () => {
      const onAbort = jest.fn();
      const aiIntegration = createMockAIIntegration();

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA, {
        onComplete: jest.fn(),
        onError: jest.fn(),
        onAbort,
      });

      controller.sendRequest('Sort by id', STUB_SCHEMA);

      expect(onAbort).toHaveBeenCalledTimes(1);
    });

    it('should not call onAbort when no callback is provided', async () => {
      const aiIntegration = createMockAIIntegration();

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA);

      expect(() => {
        controller.abortRequest();
      }).not.toThrow();
    });

    it('should not call onAbort when request completes via onComplete', async () => {
      let capturedCallbacks: RequestCallbacks<ExecuteGridAssistantCommandResult> = {};
      const onAbort = jest.fn();
      const aiIntegration = createMockAIIntegration((_params, callbacks) => {
        capturedCallbacks = callbacks;
      });

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA, {
        onComplete: jest.fn(),
        onError: jest.fn(),
        onAbort,
      });

      capturedCallbacks.onComplete?.({
        actions: [{ name: 'sort', args: { column: 'Name' } }],
      } as ExecuteGridAssistantCommandResult);

      expect(onAbort).not.toHaveBeenCalled();
    });

    it('should not call onAbort when request completes via onError', async () => {
      let capturedCallbacks: RequestCallbacks<ExecuteGridAssistantCommandResult> = {};
      const onAbort = jest.fn();
      const aiIntegration = createMockAIIntegration((_params, callbacks) => {
        capturedCallbacks = callbacks;
      });

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA, {
        onComplete: jest.fn(),
        onError: jest.fn(),
        onAbort,
      });

      capturedCallbacks.onError?.(new Error('Network error'));

      expect(onAbort).not.toHaveBeenCalled();
    });
  });

  describe('onComplete after abort', () => {
    it('should ignore onComplete callback triggered after abort', async () => {
      let capturedCallbacks: RequestCallbacks<ExecuteGridAssistantCommandResult> = {};
      const onComplete = jest.fn();
      const aiIntegration = createMockAIIntegration((_params, callbacks) => {
        capturedCallbacks = callbacks;
      });

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA, {
        onComplete,
        onError: jest.fn(),
      });

      controller.abortRequest();
      expect(controller.isRequestAwaitingCompletion()).toBe(false);

      capturedCallbacks.onComplete?.({
        actions: [{ name: 'sort', args: { column: 'Name' } }],
      } as ExecuteGridAssistantCommandResult);

      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('dispose', () => {
    it('should abort request on dispose', async () => {
      const abortSpy = jest.fn();
      const aiIntegration = createMockAIIntegration();

      aiIntegration.executeGridAssistant = jest.fn(
        (): (() => void) => abortSpy,
      ) as typeof aiIntegration.executeGridAssistant;

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA);
      expect(controller.isRequestAwaitingCompletion()).toBe(true);
      expect(abortSpy).not.toHaveBeenCalled();
      controller.dispose();

      expect(abortSpy).toHaveBeenCalledTimes(1);
      expect(controller.isRequestAwaitingCompletion()).toBe(false);
    });
  });

  describe('API Handlers', () => {
    describe('onAIAssistantRequestCreating', () => {
      it('should be called before sending a request', async () => {
        const callOrder: string[] = [];
        const onAIAssistantRequestCreating = jest.fn(() => {
          callOrder.push('onAIAssistantRequestCreating');
        });
        const aiIntegration = createMockAIIntegration(() => {
          callOrder.push('executeGridAssistant');
        });

        const controller = await createController({
          aiAssistant: { enabled: true, aiIntegration },
          onAIAssistantRequestCreating,
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA);

        expect(callOrder).toEqual([
          'onAIAssistantRequestCreating',
          'executeGridAssistant',
        ]);
      });

      it('should provide context, responseSchema, cancel and additionalInfo', async () => {
        const onAIAssistantRequestCreating = jest.fn();
        const aiIntegration = createMockAIIntegration();

        const controller = await createController({
          aiAssistant: { enabled: true, aiIntegration },
          onAIAssistantRequestCreating,
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA);

        expect(onAIAssistantRequestCreating).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expect.any(Object),
            responseSchema: expect.any(Object),
            cancel: false,
            additionalInfo: expect.any(Object),
          }),
        );
      });

      it('should pass all arguments through to provider sendRequest', async () => {
        let capturedProviderParams: RequestParams = {} as RequestParams;
        const aiIntegration = new AIIntegration({
          sendRequest(params): SendRequestResult {
            capturedProviderParams = params;
            return {
              promise: Promise.resolve('{}'),
              abort(): void {},
            };
          },
        });

        const controller = await createController({
          aiAssistant: { enabled: true, aiIntegration },
          onAIAssistantRequestCreating: (
            e: { additionalInfo: GridContext },
          ): void => {
            e.additionalInfo = { customKey: 'customValue' };
          },
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA);

        expect(capturedProviderParams.prompt).toEqual(
          expect.objectContaining({
            system: expect.any(String),
            user: expect.any(String),
          }),
        );
        expect(capturedProviderParams.data).toEqual(
          expect.objectContaining({
            text: 'Sort by name',
            context: expect.any(Object),
            responseSchema: expect.any(Object),
            additionalInfo: expect.objectContaining({
              customKey: 'customValue',
            }),
          }),
        );
      });

      it('should cancel the request when cancel is set to true', async () => {
        const aiIntegration = createMockAIIntegration();

        const controller = await createController({
          aiAssistant: { enabled: true, aiIntegration },
          onAIAssistantRequestCreating: (e: { cancel: boolean }): void => {
            e.cancel = true;
          },
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA);

        expect(aiIntegration.executeGridAssistant)
          .not.toHaveBeenCalled();
      });

      it('should call onAbort when cancel is set to true', async () => {
        const onAbort = jest.fn();
        const aiIntegration = createMockAIIntegration();

        const controller = await createController({
          aiAssistant: { enabled: true, aiIntegration },
          onAIAssistantRequestCreating: (e: { cancel: boolean }): void => {
            e.cancel = true;
          },
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA, {
          onComplete: jest.fn(),
          onError: jest.fn(),
          onAbort,
        });

        expect(onAbort).toHaveBeenCalledTimes(1);
      });

      it('should pass modified context to executeGridAssistant', async () => {
        let capturedParams: GridContext = {};
        const aiIntegration = createMockAIIntegration((params) => {
          capturedParams = params as GridContext;
        });

        const controller = await createController({
          aiAssistant: { enabled: true, aiIntegration },
          onAIAssistantRequestCreating: (
            e: { context: GridContext },
          ): void => {
            e.context.customField = 'custom value';
          },
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA);

        const context = capturedParams.context as GridContext;

        expect(context.customField).toBe('custom value');
      });

      it('should pass additionalInfo to executeGridAssistant', async () => {
        let capturedParams: GridContext = {};
        const aiIntegration = createMockAIIntegration((params) => {
          capturedParams = params as GridContext;
        });

        const controller = await createController({
          aiAssistant: { enabled: true, aiIntegration },
          onAIAssistantRequestCreating: (
            e: { additionalInfo: GridContext },
          ): void => {
            e.additionalInfo = { customData: 'My custom data' };
          },
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA);

        const additional = capturedParams.additionalInfo as GridContext;

        expect(additional.customData).toBe('My custom data');
      });

      it('should not be called when aiIntegration is missing', async () => {
        const onAIAssistantRequestCreating = jest.fn();

        const controller = await createController({
          onAIAssistantRequestCreating,
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA);

        expect(onAIAssistantRequestCreating).not.toHaveBeenCalled();
        expect(errors.log).toHaveBeenCalledWith('E1068');
      });
    });
  });

  describe('context building', () => {
    it('should return all columns including hidden ones', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        columns: [
          {
            dataField: 'id', caption: 'ID', dataType: 'number', visible: true,
          },
          {
            dataField: 'name', caption: 'Name', dataType: 'string', visible: false,
          },
        ],
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const columns = context.columns as GridContext[];

      expect(columns).toHaveLength(2);
      expect(columns[0].dataField).toBe('id');
      expect(columns[0].visible).toBe(true);
      expect(columns[1].dataField).toBe('name');
      expect(columns[1].visible).toBe(false);
    });

    it('should include all listed properties for each column', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        columns: [
          {
            dataField: 'id',
            caption: 'ID',
            dataType: 'number',
            visible: true,
            sortOrder: 'asc',
            sortIndex: 0,
            fixed: true,
            fixedPosition: 'left',
            width: 100,
          },
        ],
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const column = (context.columns as GridContext[])[0];

      expect(column).toEqual(expect.objectContaining({
        dataField: 'id',
        caption: 'ID',
        dataType: 'number',
        visible: true,
        sortOrder: 'asc',
        sortIndex: 0,
        fixed: true,
        fixedPosition: 'left',
        width: 100,
      }));
      expect('visibleIndex' in column).toBe(true);
    });

    it('should only include the listed column properties', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        columns: [
          {
            dataField: 'id',
            caption: 'ID',
            dataType: 'number',
            allowSorting: true,
          },
        ],
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const columnKeys = Object.keys((context.columns as GridContext[])[0]);
      const expectedKeys = [
        'dataField', 'caption', 'dataType', 'visible',
        'sortOrder', 'sortIndex',
        'fixed', 'fixedPosition', 'width', 'visibleIndex',
      ];

      expect(columnKeys.sort()).toEqual(expectedKeys.sort());
    });

    it('should exclude command columns', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        selection: { mode: 'multiple' },
        columns: [
          { dataField: 'id', caption: 'ID', dataType: 'number' },
          { dataField: 'name', caption: 'Name', dataType: 'string' },
        ],
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const columns = context.columns as GridContext[];

      const hasCommandColumn = columns.some(
        (col) => !col.dataField,
      );
      expect(hasCommandColumn).toBe(false);
    });

    it('should reflect current paging state', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        dataSource: [
          { id: 1, name: 'A' },
          { id: 2, name: 'B' },
          { id: 3, name: 'C' },
        ],
        paging: { pageSize: 2, pageIndex: 0 },
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const paging = context.paging as GridContext;

      expect(paging.pageIndex).toBe(0);
      expect(paging.pageSize).toBe(2);
      expect(paging.totalCount).toBe(3);
    });

    it('should return empty string for search text when not set', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const search = context.search as GridContext;

      expect(search.searchText).toBe('');
    });

    it('should reflect current search text', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        searchPanel: { visible: true, text: 'test search' },
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const search = context.search as GridContext;

      expect(search.searchText).toBe('test search');
    });

    it('should return empty array for selection when no rows selected', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        selection: { mode: 'multiple' },
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const selection = context.selection as GridContext;

      expect(selection.selectedRowKeys).toEqual([]);
    });

    it('should reflect currently selected keys', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        dataSource: [
          { id: 1, name: 'A' },
          { id: 2, name: 'B' },
        ],
        selection: { mode: 'multiple' },
        selectedRowKeys: [1, 2],
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const selection = context.selection as GridContext;

      expect(selection.selectedRowKeys).toEqual([1, 2]);
    });

    it('should return null filterValue when not set', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const filtering = context.filtering as GridContext;

      expect(filtering.filterValue).toBeNull();
    });

    it('should reflect current filterValue', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const filterExpression = ['name', '=', 'Name 1'];
      const controller = await createController({
        aiIntegration,
        filterValue: filterExpression,
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const filtering = context.filtering as GridContext;

      expect(filtering.filterValue).toEqual(filterExpression);
    });

    it('should update context after grid state changes', async () => {
      const capturedParamsList: GridContext[] = [];
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParamsList.push(params as GridContext);
      });

      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'B' },
          { id: 2, name: 'A' },
        ],
        columns: [
          { dataField: 'id', caption: 'ID', dataType: 'number' },
          { dataField: 'name', caption: 'Name', dataType: 'string' },
        ],
        aiIntegration,
      } as Properties);

      const controller = new AIAssistantIntegrationController(instance);
      controller.init();

      controller.sendRequest('test before', STUB_SCHEMA);

      const contextBefore = capturedParamsList[0].context as GridContext;
      const columnsBefore = contextBefore.columns as GridContext[];
      const nameSortBefore = columnsBefore
        .find((col) => col.dataField === 'name')?.sortOrder;
      expect(nameSortBefore).toBeUndefined();

      instance.columnOption('name', 'sortOrder', 'asc');
      jest.runAllTimers();

      controller.sendRequest('test after', STUB_SCHEMA);

      const contextAfter = capturedParamsList[1].context as GridContext;
      const columnsAfter = contextAfter.columns as GridContext[];
      const nameSortAfter = columnsAfter
        .find((col) => col.dataField === 'name')?.sortOrder;
      expect(nameSortAfter).toBe('asc');
    });
  });
});
