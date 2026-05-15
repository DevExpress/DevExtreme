import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { ExecuteGridAssistantCommandResult } from '@js/common/ai-integration';
import type { ArrayStore } from '@js/common/data';
import type { Message } from '@js/ui/chat';
import { coreCommands } from '@ts/grids/grid_core/ai_assistant/commands';
import {
  AI_ASSISTANT_AUTHOR,
  AI_ASSISTANT_AUTHOR_ID,
  MessageStatus,
} from '@ts/grids/grid_core/ai_assistant/const';
import { GridCommands } from '@ts/grids/grid_core/ai_assistant/grid_commands';
import type {
  AIAssistantRequestCallbacks,
  AIMessage,
  CommandResult,
} from '@ts/grids/grid_core/ai_assistant/types';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

import { DataGridAIAssistantController } from '../ai_assistant_controller';
import { DataGridAIAssistantIntegrationController } from '../ai_assistant_integration_controller';
import { dataGridCommands } from '../commands/index';

jest.mock('@ts/grids/grid_core/ai_assistant/grid_commands');
jest.mock('../ai_assistant_integration_controller');

const MockedGridCommands = GridCommands as jest.MockedClass<typeof GridCommands>;
const MockedDataGridAIAssistantIntegrationController = DataGridAIAssistantIntegrationController as
  jest.MockedClass<typeof DataGridAIAssistantIntegrationController>;

let sendRequestCallbacks: AIAssistantRequestCallbacks<ExecuteGridAssistantCommandResult> = {};

const createController = (
  options: Record<string, unknown> = {},
): DataGridAIAssistantController => {
  const mockComponent = {
    _optionCache: {},
    _controllers: {},
    option: jest.fn((name?: string) => {
      if (name === undefined) {
        return options;
      }

      return options[name];
    }),
    _createActionByOption: jest.fn(() => jest.fn()),
  };

  const controller = new DataGridAIAssistantController(
    mockComponent as unknown as InternalGrid,
  );
  controller.init();

  return controller;
};

const getStore = (
  controller: DataGridAIAssistantController,
): ArrayStore<Message, string> => {
  const dataSource = controller.getMessageDataSource() as {
    store: ArrayStore<Message, string>;
  };
  return dataSource.store;
};

describe('DataGridAIAssistantController', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (MockedGridCommands.mockImplementation as jest.Mock).call(
      MockedGridCommands,
      () => ({
        validate: jest.fn().mockReturnValue(true),
        executeCommands: jest.fn<() => Promise<CommandResult[]>>()
          .mockResolvedValue([{ status: 'success', message: 'sort' }]),
        abort: jest.fn(),
        buildResponseSchema: jest.fn().mockReturnValue({ type: 'object' }),
        isExecuting: jest.fn().mockReturnValue(false),
      }),
    );

    (MockedDataGridAIAssistantIntegrationController
      .mockImplementation as jest.Mock).call(
      MockedDataGridAIAssistantIntegrationController,
      () => ({
        init: jest.fn(),
        dispose: jest.fn(),
        sendRequest: jest.fn((
          _text: string,
          _responseSchema: unknown,
          callbacks?: AIAssistantRequestCallbacks<ExecuteGridAssistantCommandResult>,
        ) => {
          sendRequestCallbacks = callbacks ?? {};
        }),
        abortRequest: jest.fn(() => {
          sendRequestCallbacks.onAbort?.();
        }),
        isRequestAwaitingCompletion: jest.fn().mockReturnValue(false),
      }),
    );
  });

  describe('getGridCommandList', () => {
    it('should include all core commands', () => {
      createController();

      const constructorCall = MockedGridCommands.mock.calls[0];
      const commandList = constructorCall[1];
      const commandNames = commandList.map((c) => c.name);

      for (const coreCommand of coreCommands) {
        expect(commandNames).toContain(coreCommand.name);
      }
    });

    it('should include all data grid specific commands', () => {
      createController();

      const constructorCall = MockedGridCommands.mock.calls[0];
      const commandList = constructorCall[1];
      const commandNames = commandList.map((c) => c.name);

      expect(commandNames).toContain('grouping');
      expect(commandNames).toContain('clearGrouping');
      expect(commandNames).toContain('summary');
      expect(commandNames).toContain('clearSummary');
    });

    it('should extend core commands with data grid commands', () => {
      createController();

      const constructorCall = MockedGridCommands.mock.calls[0];
      const commandList = constructorCall[1];

      expect(commandList).toHaveLength(
        coreCommands.length + dataGridCommands.length,
      );
    });

    it('should place core commands before data grid commands', () => {
      createController();

      const constructorCall = MockedGridCommands.mock.calls[0];
      const commandList = constructorCall[1];
      const commandNames = commandList.map((c) => c.name);

      const firstDataGridCommandIndex = commandNames.indexOf('grouping');
      const lastCoreCommandIndex = commandNames.indexOf(
        coreCommands[coreCommands.length - 1].name,
      );

      expect(firstDataGridCommandIndex).toBeGreaterThan(lastCoreCommandIndex);
    });
  });

  describe('getAiAssistantIntegrationController', () => {
    it('should create DataGridAIAssistantIntegrationController', () => {
      createController();

      expect(MockedDataGridAIAssistantIntegrationController).toHaveBeenCalledTimes(1);
    });
  });

  describe('inherited behavior', () => {
    it('should return dataSource with store', () => {
      const controller = createController();
      const dataSource = controller.getMessageDataSource() as {
        store: ArrayStore<Message, string>;
      };

      expect(dataSource.store).toBeDefined();
    });

    it('should create pending message in store', async () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Group by category',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          id: expect.stringContaining(AI_ASSISTANT_AUTHOR_ID),
          author: AI_ASSISTANT_AUTHOR,
          status: MessageStatus.Pending,
        }),
      ]);
    });

    it('should complete message as success when command succeed', async () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Group by category',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [{ name: 'grouping', args: { dataField: 'Category', groupIndex: 0 } }];
      sendRequestCallbacks.onComplete?.({ actions });
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Success,
          commands: [{ status: 'success', message: 'sort' }],
        }),
      ]);
    });

    it('should fail message when onError callback is called', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Group by category',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      sendRequestCallbacks.onError?.(new Error('Network error'));

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Network error',
        }),
      ]);

      await expect(promise).rejects.toThrow('Network error');
    });

    it('should abort request and fail message', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Group by category',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      controller.abortRequest();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
        }),
      ]);

      await expect(promise).rejects.toThrow();
    });

    it('should call integration controller dispose on dispose', () => {
      const controller = createController();

      const integrationInstance = MockedDataGridAIAssistantIntegrationController
        .mock.results[0].value as { dispose: jest.Mock };

      controller.dispose();

      expect(integrationInstance.dispose).toHaveBeenCalledTimes(1);
    });

    it('should reject second request while first is processing', async () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'First request',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const secondPromise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Second request',
        timestamp: '2026-04-16T10:00:01.000Z',
      } as Message);
      secondPromise.catch(() => {});

      await expect(secondPromise).rejects.toBeUndefined();
    });

    it('should support regenerating failed AIMessage', async () => {
      const controller = createController();

      const aiMessage: AIMessage = {
        id: 'assistant-123',
        author: AI_ASSISTANT_AUTHOR,
        text: MessageStatus.Failure,
        prompt: 'Group by category',
        status: MessageStatus.Failure,
        headerText: 'Failed to process request',
        errorText: 'Network error',
      };

      const store = getStore(controller);
      await store.insert(aiMessage);

      const promise = controller.sendRequestToAI(aiMessage);

      const actions = [{ name: 'grouping', args: { dataField: 'Category', groupIndex: 0 } }];
      sendRequestCallbacks.onComplete?.({ actions });

      await promise;

      const messages = await store.load();

      expect(messages).toEqual([
        expect.objectContaining({
          id: 'assistant-123',
          status: MessageStatus.Success,
        }),
      ]);
    });
  });
});
