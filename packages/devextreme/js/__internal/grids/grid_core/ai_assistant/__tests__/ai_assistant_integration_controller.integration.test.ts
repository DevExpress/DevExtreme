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

      controller.sendRequest('Sort by name');

      expect(errors.log).toHaveBeenCalledWith('E1068');
    });
  });

  describe('when aiAssistant.aiIntegration is set', () => {
    it('should use aiAssistant.aiIntegration', async () => {
      const aiIntegration = createMockAIIntegration();
      const controller = await createController({
        aiAssistant: { enabled: true, aiIntegration },
      });

      controller.sendRequest('Sort by name');

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

      controller.sendRequest('Sort by name');

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

      controller.sendRequest('Sort by name');

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

      controller.sendRequest('Sort by name ascending');

      expect(capturedParams.text).toBe('Sort by name ascending');
      expect(capturedParams.context).toBeDefined();
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

      controller.sendRequest('Sort by name');
      expect(abortSpy).not.toHaveBeenCalled();

      controller.sendRequest('Sort by id');
      expect(abortSpy).toHaveBeenCalledTimes(1);
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

      controller.sendRequest('Sort by name');
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

      controller.sendRequest('Sort by name');
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

        controller.sendRequest('Sort by name');

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

        controller.sendRequest('Sort by name');

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

        controller.sendRequest('Sort by name');

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

        controller.sendRequest('Sort by name');

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

        controller.sendRequest('Sort by name');

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

        controller.sendRequest('Sort by name');

        const additional = capturedParams.additionalInfo as Record<string, unknown>;

        expect(additional.customData).toBe('My custom data');
      });

      it('should not be called when aiIntegration is missing', async () => {
        const onAIAssistantRequestCreating = jest.fn();

        const controller = await createController({
          onAIAssistantRequestCreating,
        });

        controller.sendRequest('Sort by name');

        expect(onAIAssistantRequestCreating).not.toHaveBeenCalled();
        expect(errors.log).toHaveBeenCalledWith('E1068');
      });
    });
  });
});
