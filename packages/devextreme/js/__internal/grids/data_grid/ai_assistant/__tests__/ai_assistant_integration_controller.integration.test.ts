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
} from '@js/common/ai-integration';
import type { Properties } from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { GridContext, JsonSchema } from '@ts/grids/grid_core/ai_assistant/types';

import { DataGridAIAssistantIntegrationController } from '../ai_assistant_integration_controller';

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
): Promise<DataGridAIAssistantIntegrationController> => {
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

  const controller = new DataGridAIAssistantIntegrationController(instance);
  controller.init();

  return controller;
};

describe('DataGridAIAssistantIntegrationController', () => {
  beforeEach(() => {
    beforeTest();
    jest.spyOn(errors, 'log').mockImplementation(jest.fn());
  });

  afterEach(() => {
    afterTest();
  });

  describe('sendRequest', () => {
    it('should send request to aiIntegration', async () => {
      const aiIntegration = createMockAIIntegration();
      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Group by category', STUB_SCHEMA);

      expect(aiIntegration.executeGridAssistant)
        .toHaveBeenCalledTimes(1);
    });

    it('should log E1068 when aiIntegration is not set', async () => {
      const controller = await createController({});

      controller.sendRequest('Group by category', STUB_SCHEMA);

      expect(errors.log).toHaveBeenCalledWith('E1068');
    });
  });

  describe('context building', () => {
    it('should include summary in context', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        summary: {
          totalItems: [{ column: 'id', summaryType: 'count' }],
          groupItems: [{ column: 'name', summaryType: 'count' }],
        },
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const summary = context.summary as GridContext;

      expect(summary).toBeDefined();
      expect(summary.totalItems).toEqual([{ column: 'id', summaryType: 'count' }]);
      expect(summary.groupItems).toEqual([{ column: 'name', summaryType: 'count' }]);
    });

    it('should include summary with undefined totalItems when not set', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const summary = context.summary as GridContext;

      expect(summary).toBeDefined();
      expect(summary.totalItems).toBeUndefined();
      expect(summary.groupItems).toBeUndefined();
    });

    it('should include groupIndex in column context', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        columns: [
          {
            dataField: 'id', caption: 'ID', dataType: 'number',
          },
          {
            dataField: 'name', caption: 'Name', dataType: 'string', groupIndex: 0,
          },
        ],
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const columns = context.columns as GridContext[];

      const nameColumn = columns.find((col) => col.dataField === 'name');
      const columnSummary = nameColumn?.summary as GridContext;

      expect(columnSummary).toBeDefined();
      expect(columnSummary.groupIndex).toBe(0);
    });

    it('should include undefined groupIndex when column is not grouped', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        columns: [
          { dataField: 'id', caption: 'ID', dataType: 'number' },
        ],
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const columns = context.columns as GridContext[];

      const idColumn = columns.find((col) => col.dataField === 'id');
      const columnSummary = idColumn?.summary as GridContext;

      expect(columnSummary).toBeDefined();
      expect(columnSummary.groupIndex).toBeUndefined();
    });

    it('should include base context properties alongside summary', async () => {
      let capturedParams: GridContext = {};
      const aiIntegration = createMockAIIntegration((params) => {
        capturedParams = params as GridContext;
      });

      const controller = await createController({
        aiIntegration,
        paging: { pageSize: 10 },
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;

      expect(context.columns).toBeDefined();
      expect(context.paging).toBeDefined();
      expect(context.search).toBeDefined();
      expect(context.selection).toBeDefined();
      expect(context.filtering).toBeDefined();
      expect(context.summary).toBeDefined();
    });

    it('should include base column context properties alongside summary', async () => {
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
            sortOrder: 'asc',
            sortIndex: 0,
          },
        ],
      });

      controller.sendRequest('test', STUB_SCHEMA);

      const context = capturedParams.context as GridContext;
      const columns = context.columns as GridContext[];
      const column = columns[0];

      expect(column.dataField).toBe('id');
      expect(column.caption).toBe('ID');
      expect(column.dataType).toBe('number');
      expect(column.sortOrder).toBe('asc');
      expect(column.sortIndex).toBe(0);
      expect(column.summary).toBeDefined();
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

      controller.sendRequest('Group by category', STUB_SCHEMA);
      expect(controller.isRequestAwaitingCompletion()).toBe(true);

      controller.abortRequest();
      expect(abortSpy).toHaveBeenCalledTimes(1);
      expect(controller.isRequestAwaitingCompletion()).toBe(false);
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

      controller.sendRequest('Group by category', STUB_SCHEMA);
      expect(controller.isRequestAwaitingCompletion()).toBe(true);

      controller.dispose();
      expect(abortSpy).toHaveBeenCalledTimes(1);
      expect(controller.isRequestAwaitingCompletion()).toBe(false);
    });
  });
});
