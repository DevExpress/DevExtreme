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
import type { GridExtraContextOption, JsonSchema } from '../types';

const STUB_SCHEMA: JsonSchema = { type: 'object' };
const EXTRA_CONTEXT: GridExtraContextOption = {
  grid: ['summary'],
  column: ['groupIndex'],
};

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
    // TODO: remove when d.ts is ready
  } as unknown as Properties);

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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

      expect(errors.log).toHaveBeenCalledWith('E1068');
    });
  });

  describe('when aiAssistant.aiIntegration is set', () => {
    it('should use aiAssistant.aiIntegration', async () => {
      const aiIntegration = createMockAIIntegration();
      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

      expect(assistantAI.executeGridAssistant)
        .toHaveBeenCalledTimes(1);
      expect(gridAI.executeGridAssistant)
        .not.toHaveBeenCalled();
      expect(errors.log).not.toHaveBeenCalledWith('E1068');
    });
  });

  describe('sendRequest', () => {
    it('should pass text to executeGridAssistant', async () => {
      let capturedParams: Record<string, unknown> = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as Record<string, unknown>;
      });

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name ascending', STUB_SCHEMA, EXTRA_CONTEXT);

      expect(capturedParams.text).toBe('Sort by name ascending');
      expect(capturedParams.context).toBeDefined();
    });

    it('should pass responseSchema to executeGridAssistant', async () => {
      let capturedParams: Record<string, unknown> = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as Record<string, unknown>;
      });

      const customSchema: JsonSchema = { type: 'object', properties: { action: { type: 'string' } } };

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', customSchema, EXTRA_CONTEXT);

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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);
      expect(abortSpy).not.toHaveBeenCalled();

      controller.sendRequest('Sort by id', STUB_SCHEMA, EXTRA_CONTEXT);
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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);
      capturedCallbacks.onError?.(new Error('Network error'));

      expect(controller.isRequestAwaitingCompletion()).toBe(false);

      controller.sendRequest('Sort by id', STUB_SCHEMA, EXTRA_CONTEXT);
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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);
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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT, {
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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT, {
        onComplete: jest.fn(),
        onError: jest.fn(),
        onAbort,
      });

      controller.sendRequest('Sort by id', STUB_SCHEMA, EXTRA_CONTEXT);

      expect(onAbort).toHaveBeenCalledTimes(1);
    });

    it('should not call onAbort when no callback is provided', async () => {
      const aiIntegration = createMockAIIntegration();

      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT, {
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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT, {
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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT, {
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

      controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);
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

        controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

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

        controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

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
            e: { additionalInfo: Record<string, unknown> },
          ): void => {
            e.additionalInfo = { customKey: 'customValue' };
          },
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

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

        controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

        expect(aiIntegration.executeGridAssistant)
          .not.toHaveBeenCalled();
      });

      it('should pass modified context to executeGridAssistant', async () => {
        let capturedParams: Record<string, unknown> = {};
        const aiIntegration = createMockAIIntegration((params) => {
          capturedParams = params as Record<string, unknown>;
        });

        const controller = await createController({
          aiAssistant: { enabled: true, aiIntegration },
          onAIAssistantRequestCreating: (
            e: { context: Record<string, unknown> },
          ): void => {
            e.context.customField = 'custom value';
          },
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

        const context = capturedParams.context as Record<string, unknown>;

        expect(context.customField).toBe('custom value');
      });

      it('should pass additionalInfo to executeGridAssistant', async () => {
        let capturedParams: Record<string, unknown> = {};
        const aiIntegration = createMockAIIntegration((params) => {
          capturedParams = params as Record<string, unknown>;
        });

        const controller = await createController({
          aiAssistant: { enabled: true, aiIntegration },
          onAIAssistantRequestCreating: (
            e: { additionalInfo: Record<string, unknown> },
          ): void => {
            e.additionalInfo = { customData: 'My custom data' };
          },
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

        const additional = capturedParams.additionalInfo as Record<string, unknown>;

        expect(additional.customData).toBe('My custom data');
      });

      it('should not be called when aiIntegration is missing', async () => {
        const onAIAssistantRequestCreating = jest.fn();

        const controller = await createController({
          onAIAssistantRequestCreating,
        });

        controller.sendRequest('Sort by name', STUB_SCHEMA, EXTRA_CONTEXT);

        expect(onAIAssistantRequestCreating).not.toHaveBeenCalled();
        expect(errors.log).toHaveBeenCalledWith('E1068');
      });
    });
  });

  describe('buildContext', () => {
    it('should return all columns including hidden ones', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
        columns: [
          {
            dataField: 'id', caption: 'ID', dataType: 'number', visible: true,
          },
          {
            dataField: 'name', caption: 'Name', dataType: 'string', visible: false,
          },
        ],
      });

      const context = controller.buildContext(EXTRA_CONTEXT);

      expect(context.columns).toHaveLength(2);
      expect(context.columns[0].dataField).toBe('id');
      expect(context.columns[0].visible).toBe(true);
      expect(context.columns[1].dataField).toBe('name');
      expect(context.columns[1].visible).toBe(false);
    });

    it('should include all listed properties for each column', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
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

      const context = controller.buildContext(EXTRA_CONTEXT);
      const column = context.columns[0];

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
      expect('groupIndex' in column).toBe(true);
      expect('filterValue' in column).toBe(true);
    });

    it('should only include the listed column properties', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
        columns: [
          {
            dataField: 'id',
            caption: 'ID',
            dataType: 'number',
            allowSorting: true,
          },
        ],
      });

      const context = controller.buildContext(EXTRA_CONTEXT);
      const columnKeys = Object.keys(context.columns[0]);
      const expectedKeys = [
        'dataField', 'caption', 'dataType', 'visible',
        'sortOrder', 'sortIndex', 'groupIndex', 'filterValue',
        'fixed', 'fixedPosition', 'width', 'visibleIndex',
      ];

      expect(columnKeys.sort()).toEqual(expectedKeys.sort());
    });

    it('should exclude command columns', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
        selection: { mode: 'multiple' },
        columns: [
          { dataField: 'id', caption: 'ID', dataType: 'number' },
          { dataField: 'name', caption: 'Name', dataType: 'string' },
        ],
      });

      const context = controller.buildContext(EXTRA_CONTEXT);

      const hasCommandColumn = context.columns.some(
        (col) => !col.dataField,
      );
      expect(hasCommandColumn).toBe(false);
    });

    it('should reflect current paging state', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
        dataSource: [
          { id: 1, name: 'A' },
          { id: 2, name: 'B' },
          { id: 3, name: 'C' },
        ],
        paging: { pageSize: 2, pageIndex: 0 },
      });

      const context = controller.buildContext(EXTRA_CONTEXT);

      expect(context.paging.pageIndex).toBe(0);
      expect(context.paging.pageSize).toBe(2);
      expect(context.paging.totalCount).toBe(3);
    });

    it('should return empty string for search text when not set', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
      });

      const context = controller.buildContext(EXTRA_CONTEXT);

      expect(context.search.searchText).toBe('');
    });

    it('should reflect current search text', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
        searchPanel: { visible: true, text: 'test search' },
      });

      const context = controller.buildContext(EXTRA_CONTEXT);

      expect(context.search.searchText).toBe('test search');
    });

    it('should return empty array for selection when no rows selected', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
        selection: { mode: 'multiple' },
      });

      const context = controller.buildContext(EXTRA_CONTEXT);

      expect(context.selection.selectedRowKeys).toEqual([]);
    });

    it('should reflect currently selected keys', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
        dataSource: [
          { id: 1, name: 'A' },
          { id: 2, name: 'B' },
        ],
        selection: { mode: 'multiple' },
        selectedRowKeys: [1, 2],
      });

      const context = controller.buildContext(EXTRA_CONTEXT);

      expect(context.selection.selectedRowKeys).toEqual([1, 2]);
    });

    it('should return undefined summary items when no summary configured', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
      });

      const context = controller.buildContext(EXTRA_CONTEXT);
      const { summary } = context;

      expect(summary).toBeDefined();
      expect(summary?.totalItems).toBeUndefined();
      expect(summary?.groupItems).toBeUndefined();
    });

    it('should reflect current summary configuration', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
        summary: {
          totalItems: [
            { column: 'id', summaryType: 'count' },
          ],
          groupItems: [
            { column: 'name', summaryType: 'count' },
          ],
        },
      });

      const context = controller.buildContext(EXTRA_CONTEXT);
      const { summary } = context;

      expect(summary?.totalItems).toEqual([
        expect.objectContaining({ column: 'id', summaryType: 'count' }),
      ]);
      expect(summary?.groupItems).toEqual([
        expect.objectContaining({ column: 'name', summaryType: 'count' }),
      ]);
    });

    it('should return null filterValue when not set', async () => {
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
      });

      const context = controller.buildContext(EXTRA_CONTEXT);

      expect(context.filtering.filterValue).toBeNull();
    });

    it('should reflect current filterValue', async () => {
      const filterExpression = ['name', '=', 'Name 1'];
      const controller = await createController({
        aiIntegration: createMockAIIntegration(),
        filterValue: filterExpression,
      });

      const context = controller.buildContext(EXTRA_CONTEXT);

      expect(context.filtering.filterValue).toEqual(filterExpression);
    });

    it('should update context after grid state changes', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'B' },
          { id: 2, name: 'A' },
        ],
        columns: [
          { dataField: 'id', caption: 'ID', dataType: 'number' },
          { dataField: 'name', caption: 'Name', dataType: 'string' },
        ],
        aiIntegration: createMockAIIntegration(),
      } as unknown as Properties);

      const controller = new AIAssistantIntegrationController(instance);
      controller.init();

      const contextBefore = controller.buildContext(EXTRA_CONTEXT);
      const nameSortBefore = contextBefore.columns
        .find((col) => col.dataField === 'name')?.sortOrder;
      expect(nameSortBefore).toBeUndefined();

      instance.columnOption('name', 'sortOrder', 'asc');
      jest.runAllTimers();

      const contextAfter = controller.buildContext(EXTRA_CONTEXT);
      const nameSortAfter = contextAfter.columns
        .find((col) => col.dataField === 'name')?.sortOrder;
      expect(nameSortAfter).toBe('asc');
    });

    describe('without extraContext', () => {
      it('should not include summary in context when extraContext is null', async () => {
        const controller = await createController({
          aiIntegration: createMockAIIntegration(),
          summary: {
            totalItems: [{ column: 'id', summaryType: 'count' }],
          },
        });

        const context = controller.buildContext(null);

        expect(context.summary).toBeUndefined();
      });

      it('should not include groupIndex in columns when extraContext is null', async () => {
        const controller = await createController({
          aiIntegration: createMockAIIntegration(),
          columns: [
            { dataField: 'id', caption: 'ID', dataType: 'number' },
          ],
        });

        const context = controller.buildContext(null);
        const columnKeys = Object.keys(context.columns[0]);

        expect(columnKeys).not.toContain('groupIndex');
      });

      it('should only include base column properties when extraContext is null', async () => {
        const controller = await createController({
          aiIntegration: createMockAIIntegration(),
          columns: [
            { dataField: 'id', caption: 'ID', dataType: 'number' },
          ],
        });

        const context = controller.buildContext(null);
        const columnKeys = Object.keys(context.columns[0]);
        const expectedKeys = [
          'dataField', 'caption', 'dataType', 'visible',
          'sortOrder', 'sortIndex', 'filterValue',
          'fixed', 'fixedPosition', 'width', 'visibleIndex',
        ];

        expect(columnKeys.sort()).toEqual(expectedKeys.sort());
      });
    });

    describe('with partial extraContext', () => {
      it('should include summary but not groupIndex when only grid extra is provided', async () => {
        const controller = await createController({
          aiIntegration: createMockAIIntegration(),
          summary: {
            totalItems: [{ column: 'id', summaryType: 'count' }],
          },
          columns: [
            { dataField: 'id', caption: 'ID', dataType: 'number' },
          ],
        });

        const context = controller.buildContext({ grid: ['summary'], column: [] });
        const { summary } = context;

        expect(summary).toBeDefined();
        expect(summary?.totalItems).toEqual([
          expect.objectContaining({ column: 'id', summaryType: 'count' }),
        ]);

        const columnKeys = Object.keys(context.columns[0]);
        expect(columnKeys).not.toContain('groupIndex');
      });

      it('should include groupIndex but not summary when only column extra is provided', async () => {
        const controller = await createController({
          aiIntegration: createMockAIIntegration(),
          summary: {
            totalItems: [{ column: 'id', summaryType: 'count' }],
          },
          columns: [
            { dataField: 'id', caption: 'ID', dataType: 'number' },
          ],
        });

        const context = controller.buildContext({ grid: [], column: ['groupIndex'] });

        expect(context.summary).toBeUndefined();

        const columnKeys = Object.keys(context.columns[0]);
        expect(columnKeys).toContain('groupIndex');
      });
    });
  });
});
