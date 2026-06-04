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

import type { InternalGrid } from '../../m_types';
import { AIAssistantController } from '../ai_assistant_controller';
import { AIAssistantIntegrationController } from '../ai_assistant_integration_controller';
import {
  AI_ASSISTANT_AUTHOR,
  AI_ASSISTANT_AUTHOR_ID,
  MessageStatus,
} from '../const';
import { GridCommands } from '../grid_commands';
import type { AIAssistantRequestCallbacks, AIMessage, CommandResult } from '../types';

jest.mock('../grid_commands');
jest.mock('../ai_assistant_integration_controller');

const MockedGridCommands = GridCommands as jest.MockedClass<typeof GridCommands>;
const MockedAIAssistantIntegrationController = AIAssistantIntegrationController as
  jest.MockedClass<typeof AIAssistantIntegrationController>;

let sendRequestCallbacks: AIAssistantRequestCallbacks<ExecuteGridAssistantCommandResult> = {};

const createController = (
  options: Record<string, unknown> = {},
): AIAssistantController => {
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

  const controller = new AIAssistantController(mockComponent as unknown as InternalGrid);
  controller.init();

  return controller;
};

const getStore = (
  controller: AIAssistantController,
): ArrayStore<Message, string> => controller.getMessageStore();

describe('AIAssistantController', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (MockedGridCommands.mockImplementation as jest.Mock).call(
      MockedGridCommands,
      () => ({
        parse: jest.fn((actions) => actions),
        executeCommands: jest.fn<() => Promise<CommandResult[]>>().mockResolvedValue([{ status: 'success', message: 'sort' }]),
        abort: jest.fn(),
        buildResponseSchema: jest.fn().mockReturnValue({ type: 'object' }),
        isExecuting: jest.fn().mockReturnValue(false),
      }),
    );

    (MockedAIAssistantIntegrationController.mockImplementation as jest.Mock).call(
      MockedAIAssistantIntegrationController,
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

  describe('getMessageStore', () => {
    it('should return message store', () => {
      const controller = createController();
      const store = controller.getMessageStore();

      expect(store).toBeDefined();
    });
  });

  describe('isProcessing', () => {
    it('should return false initially', () => {
      const controller = createController();

      expect(controller.isProcessing()).toBe(false);
    });

    it('should return true while request is processing', () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort by name',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      expect(controller.isProcessing()).toBe(true);
    });

    it('should return false after request completes successfully', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort by name',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      sendRequestCallbacks.onComplete?.({ actions });
      await promise;

      expect(controller.isProcessing()).toBe(false);
    });

    it('should return false after request fails', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort by name',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      sendRequestCallbacks.onError?.(new Error('Network error'));
      await expect(promise).rejects.toThrow('Network error');

      expect(controller.isProcessing()).toBe(false);
    });

    it('should return false after request is aborted', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort by name',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      controller.abortRequest();
      await expect(promise).rejects.toThrow();

      expect(controller.isProcessing()).toBe(false);
    });
  });

  describe('sendRequestToAI', () => {
    it('should create pending message in store', async () => {
      const controller = createController();
      const timestamp = '2026-04-16T10:00:00.000Z';
      const expectedTimestamp = Date.parse(timestamp);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp,
      } as Message);

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          id: expect.stringContaining(AI_ASSISTANT_AUTHOR_ID),
          timestamp: expectedTimestamp,
          author: AI_ASSISTANT_AUTHOR,
          headerText: 'Request in progress',
          text: MessageStatus.Pending,
          status: MessageStatus.Pending,
        }),
      ]);
    });

    it('should keep message as pending when AI integration is not configured', async () => {
      // Make sendRequest not call any callbacks (simulating no AI integration)
      const integrationInstance = MockedAIAssistantIntegrationController
        .mock.results[0]?.value as { sendRequest: jest.Mock } | undefined;
      if (integrationInstance) {
        integrationInstance.sendRequest = jest.fn();
      }

      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Pending,
        }),
      ]);
    });

    it('should complete message as success when command succeed', async () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      const response: ExecuteGridAssistantCommandResult = {
        actions,
      };

      sendRequestCallbacks.onComplete?.(response);
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Success,
          commands: [{ status: 'success', message: 'sort' }],
        }),
      ]);
    });

    it('should complete message as failure when commands contain aborted items', async () => {
      (MockedGridCommands.mockImplementation as jest.Mock).call(
        MockedGridCommands,
        () => ({
          parse: jest.fn((actions) => actions),
          executeCommands: jest.fn<() => Promise<CommandResult[]>>().mockResolvedValue([
            { status: 'success', message: 'sort' },
            { status: 'aborted', message: 'filter aborted' },
          ]),
          abort: jest.fn(),
          buildResponseSchema: jest.fn().mockReturnValue({ type: 'object' }),
          isExecuting: jest.fn().mockReturnValue(false),
        }),
      );

      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort and filter',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [
        { name: 'sort', args: { column: 'Name' } },
        { name: 'filter', args: { column: 'Age' } },
      ];
      sendRequestCallbacks.onComplete?.({ actions });
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          commands: [
            { status: 'success', message: 'sort' },
            { status: 'aborted', message: 'filter aborted' },
          ],
        }),
      ]);
    });

    it('should fail message when onError callback is called', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      sendRequestCallbacks.onError?.(new Error('Network error'));

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          text: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);

      await expect(promise).rejects.toThrow('Network error');
    });

    it('should fail message when response has no actions', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      const response = {} as ExecuteGridAssistantCommandResult;

      sendRequestCallbacks.onComplete?.(response);
      await Promise.resolve();
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          text: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);

      await expect(promise).rejects.toThrow('Invalid response from the AI service. Please try again.');
    });

    it('should fail message when response has empty actions array', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      sendRequestCallbacks.onComplete?.({ actions: [] });
      await Promise.resolve();
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);

      await expect(promise).rejects.toThrow('Invalid response from the AI service. Please try again.');
    });

    it('should fail message when parse returns null', async () => {
      (MockedGridCommands.mockImplementation as jest.Mock).call(
        MockedGridCommands,
        () => ({
          parse: jest.fn().mockReturnValue(null),
          executeCommands: jest.fn<() => Promise<CommandResult[]>>().mockResolvedValue([]),
          abort: jest.fn(),
          buildResponseSchema: jest.fn().mockReturnValue({ type: 'object' }),
          isExecuting: jest.fn().mockReturnValue(false),
        }),
      );

      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      sendRequestCallbacks.onComplete?.({ actions });
      await Promise.resolve();
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);

      await expect(promise).rejects.toThrow('Invalid response from the AI service. Please try again.');
    });

    it('should fail message when commands are already executing', async () => {
      (MockedGridCommands.mockImplementation as jest.Mock).call(
        MockedGridCommands,
        () => ({
          parse: jest.fn((actions) => actions),
          executeCommands: jest.fn<() => Promise<CommandResult[]>>().mockResolvedValue([]),
          abort: jest.fn(),
          buildResponseSchema: jest.fn().mockReturnValue({ type: 'object' }),
          isExecuting: jest.fn().mockReturnValue(true),
        }),
      );

      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      sendRequestCallbacks.onComplete?.({ actions });
      await Promise.resolve();
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Execution already in progress. Please wait.',
        }),
      ]);

      await expect(promise).rejects.toThrow('Execution already in progress. Please wait.');
    });

    it('should fail message when buildResponseSchema returns falsy', async () => {
      (MockedGridCommands.mockImplementation as jest.Mock).call(
        MockedGridCommands,
        () => ({
          parse: jest.fn((actions) => actions),
          executeCommands: jest.fn<() => Promise<CommandResult[]>>().mockResolvedValue([]),
          abort: jest.fn(),
          buildResponseSchema: jest.fn().mockReturnValue(undefined),
          isExecuting: jest.fn().mockReturnValue(false),
        }),
      );

      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'An unexpected error occurred. Please try again.',
        }),
      ]);

      await expect(promise).rejects.toThrow('An unexpected error occurred. Please try again.');
    });

    it('should resolve promise when command succeeds', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      sendRequestCallbacks.onComplete?.({ actions });

      await expect(promise).resolves.toBeUndefined();
    });

    it('should reject promise when onError is called', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      sendRequestCallbacks.onError?.(new Error('Network error'));

      await expect(promise).rejects.toThrow('Network error');
    });

    it('should reject promise when response has no actions', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      sendRequestCallbacks.onComplete?.({} as ExecuteGridAssistantCommandResult);

      await expect(promise).rejects.toThrow('Invalid response from the AI service. Please try again.');
    });

    it('should reject second request while first request is still processing', async () => {
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

      const messages = await getStore(controller).load();

      expect(messages).toHaveLength(1);

      const integrationInstance = MockedAIAssistantIntegrationController.mock.results[0].value as {
        sendRequest: jest.Mock;
      };
      expect(integrationInstance.sendRequest).toHaveBeenCalledTimes(1);

      await expect(secondPromise).rejects.toThrow('Request already in progress. Please wait.');
    });

    it('should accept new request after previous request completes successfully', async () => {
      const controller = createController();

      const firstPromise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'First request',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      sendRequestCallbacks.onComplete?.({ actions });
      await firstPromise;

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Second request',
        timestamp: '2026-04-16T10:00:01.000Z',
      } as Message);

      const messages = await getStore(controller).load();

      expect(messages).toHaveLength(2);

      const integrationInstance = MockedAIAssistantIntegrationController.mock.results[0].value as {
        sendRequest: jest.Mock;
      };
      expect(integrationInstance.sendRequest).toHaveBeenCalledTimes(2);
    });

    it('should accept new request after previous request fails with error', async () => {
      const controller = createController();

      const firstPromise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'First request',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      firstPromise.catch(() => {});

      sendRequestCallbacks.onError?.(new Error('Network error'));
      await expect(firstPromise).rejects.toThrow('Network error');

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Second request',
        timestamp: '2026-04-16T10:00:01.000Z',
      } as Message);

      const messages = await getStore(controller).load();

      expect(messages).toHaveLength(2);

      const integrationInstance = MockedAIAssistantIntegrationController.mock.results[0].value as {
        sendRequest: jest.Mock;
      };
      expect(integrationInstance.sendRequest).toHaveBeenCalledTimes(2);
    });

    it('should accept new request after previous request is aborted', async () => {
      const controller = createController();

      const firstPromise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'First request',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      firstPromise.catch(() => {});

      controller.abortRequest();
      await expect(firstPromise).rejects.toThrow();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Second request',
        timestamp: '2026-04-16T10:00:01.000Z',
      } as Message);

      const messages = await getStore(controller).load();

      expect(messages).toHaveLength(2);

      const integrationInstance = MockedAIAssistantIntegrationController.mock.results[0].value as {
        sendRequest: jest.Mock;
      };
      expect(integrationInstance.sendRequest).toHaveBeenCalledTimes(2);
    });

    it('should use customizeResponseTitle when provided', async () => {
      const customizeResponseTitle = jest.fn().mockReturnValue('Custom Title');

      const controller = createController({
        'aiAssistant.customizeResponseTitle': customizeResponseTitle,
      });

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort by name',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      sendRequestCallbacks.onComplete?.({ actions });
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(customizeResponseTitle).toHaveBeenCalledWith(
        MessageStatus.Success,
        ['sort'],
      );
      expect(messages).toEqual([
        expect.objectContaining({
          headerText: 'Custom Title',
        }),
      ]);
    });

    it('should format headerText with "and" for multiple unique command names', async () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort and filter',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [
        { name: 'sorting', args: { column: 'Name' } },
        { name: 'filtering', args: { column: 'Age' } },
      ];
      sendRequestCallbacks.onComplete?.({ actions });
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          headerText: 'Sorting and Filtering',
        }),
      ]);
    });

    it('should captionize single command name for headerText', async () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort by name',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [{ name: 'sorting', args: { column: 'Name' } }];
      sendRequestCallbacks.onComplete?.({ actions });
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          headerText: 'Sorting',
        }),
      ]);
    });

    it('should deduplicate command names in headerText', async () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort multiple columns',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const actions = [
        { name: 'sorting', args: { column: 'Name' } },
        { name: 'sorting', args: { column: 'Age' } },
      ];
      sendRequestCallbacks.onComplete?.({ actions });
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          headerText: 'Sorting',
        }),
      ]);
    });

    it('should store prompt from user message', async () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Sort by Name column',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          prompt: 'Sort by Name column',
        }),
      ]);
    });
  });

  describe('abortRequest', () => {
    it('should fail message with abort error when request is aborted', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      controller.abortRequest();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          text: MessageStatus.Failure,
          errorText: 'Request stopped.',
        }),
      ]);

      await expect(promise).rejects.toThrow('Request stopped.');
    });

    it('should call gridCommands.abort when request is aborted', async () => {
      const controller = createController();

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);
      promise.catch(() => {});

      const gridCommandsInstance = MockedGridCommands.mock.results[0].value as { abort: jest.Mock };

      controller.abortRequest();

      await expect(promise).rejects.toThrow();

      expect(gridCommandsInstance.abort).toHaveBeenCalledTimes(1);
    });
  });

  describe('dispose', () => {
    it('should call aiAssistantIntegrationController.dispose', () => {
      const controller = createController();

      const integrationInstance = MockedAIAssistantIntegrationController
        .mock.results[0].value as { dispose: jest.Mock };

      controller.dispose();

      expect(integrationInstance.dispose).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendRequestToAI with AIMessage (regenerate)', () => {
    it('should reset message status to pending when AIMessage is passed', async () => {
      const controller = createController();

      const aiMessage: AIMessage = {
        id: 'assistant-123',
        author: AI_ASSISTANT_AUTHOR,
        text: MessageStatus.Failure,
        prompt: 'Generate values',
        status: MessageStatus.Failure,
        headerText: 'Failed to process request',
        errorText: 'Network error',
      };

      const store = getStore(controller);
      await store.insert(aiMessage);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI(aiMessage);

      const messages = await store.load();

      expect(messages).toHaveLength(1);
      expect(messages).toEqual([
        expect.objectContaining({
          id: 'assistant-123',
          status: MessageStatus.Pending,
          headerText: 'Request in progress',
          text: MessageStatus.Pending,
        }),
      ]);
    });

    it('should not create new message when AIMessage is passed', async () => {
      const controller = createController();

      const aiMessage: AIMessage = {
        id: 'assistant-123',
        author: AI_ASSISTANT_AUTHOR,
        text: MessageStatus.Failure,
        prompt: 'Generate values',
        status: MessageStatus.Failure,
        headerText: 'Failed to process request',
        errorText: 'Network error',
      };

      const store = getStore(controller);
      await store.insert(aiMessage);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI(aiMessage);

      const messages = await store.load();

      expect(messages).toHaveLength(1);
    });

    it('should send request with original prompt from AIMessage', () => {
      const controller = createController();

      const aiMessage: AIMessage = {
        id: 'assistant-123',
        author: AI_ASSISTANT_AUTHOR,
        text: MessageStatus.Failure,
        prompt: 'Sort by Name column',
        status: MessageStatus.Failure,
        headerText: 'Failed to process request',
        errorText: 'Network error',
      };

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI(aiMessage);

      const integrationInstance = MockedAIAssistantIntegrationController.mock.results[0].value as {
        sendRequest: jest.Mock;
      };

      expect(integrationInstance.sendRequest).toHaveBeenCalledWith(
        'Sort by Name column',
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('should clear errorText and commands when regenerating', async () => {
      const controller = createController();

      const aiMessage: AIMessage = {
        id: 'assistant-123',
        author: AI_ASSISTANT_AUTHOR,
        text: MessageStatus.Failure,
        prompt: 'Generate values',
        status: MessageStatus.Failure,
        headerText: 'Failed to process request',
        errorText: 'Network error',
        commands: [{ status: 'failure', message: 'sort failed' }],
      };

      const store = getStore(controller);
      await store.insert(aiMessage);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI(aiMessage);

      const messages = await store.load();

      expect(messages).toEqual([
        expect.objectContaining({
          errorText: undefined,
          commands: undefined,
        }),
      ]);
    });

    it('should complete regenerated message as success when command succeed', async () => {
      const controller = createController();

      const aiMessage: AIMessage = {
        id: 'assistant-123',
        author: AI_ASSISTANT_AUTHOR,
        text: MessageStatus.Failure,
        prompt: 'Generate values',
        status: MessageStatus.Failure,
        headerText: 'Failed to process request',
        errorText: 'Network error',
      };

      const store = getStore(controller);
      await store.insert(aiMessage);

      const promise = controller.sendRequestToAI(aiMessage);

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      sendRequestCallbacks.onComplete?.({ actions });

      await promise;

      const messages = await store.load();

      expect(messages).toEqual([
        expect.objectContaining({
          id: 'assistant-123',
          status: MessageStatus.Success,
          commands: [{ status: 'success', message: 'sort' }],
        }),
      ]);
    });

    it('should reject regeneration while another request is processing', async () => {
      const controller = createController();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'First request',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const aiMessage: AIMessage = {
        id: 'assistant-old',
        author: AI_ASSISTANT_AUTHOR,
        text: MessageStatus.Failure,
        prompt: 'Old request',
        status: MessageStatus.Failure,
        headerText: 'Failed to process request',
        errorText: 'Network error',
      };

      const regeneratePromise = controller.sendRequestToAI(aiMessage);
      regeneratePromise.catch(() => {});

      await expect(regeneratePromise).rejects.toThrow('Request already in progress. Please wait.');
    });
  });
});
