import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { ExecuteGridAssistantCommandResult, RequestCallbacks } from '@js/common/ai-integration';
import type { ArrayStore } from '@js/common/data';
import type { Message } from '@js/ui/chat';

import type { InternalGrid } from '../../m_types';
import { AIAssistantController } from '../ai_assistant_controller';
import {
  AI_ASSISTANT_AUTHOR,
  AI_ASSISTANT_AUTHOR_ID,
  MessageStatus,
} from '../const';

let sendRequestCallbacks: RequestCallbacks<ExecuteGridAssistantCommandResult> = {};

const mockAIIntegration = {
  executeGridAssistant: jest.fn((
    _params: unknown,
    callbacks: RequestCallbacks<ExecuteGridAssistantCommandResult>,
  ) => {
    sendRequestCallbacks = callbacks;
    return jest.fn();
  }),
};

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

const getStore = (controller: AIAssistantController): ArrayStore<Message, string> => {
  const dataSource = controller.getMessageDataSource() as { store: ArrayStore<Message, string> };
  return dataSource.store;
};

describe('AIAssistantController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMessageDataSource', () => {
    it('should return dataSource with store and reshapeOnPush', () => {
      const controller = createController();
      const dataSource = controller.getMessageDataSource() as {
        store: ArrayStore<Message, string>;
        reshapeOnPush: boolean;
      };

      expect(dataSource.store).toBeDefined();
      expect(dataSource.reshapeOnPush).toBe(true);
    });
  });

  describe('sendRequestToAI', () => {
    it('should create pending message in store', async () => {
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });
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
          text: 'Generate values',
          status: MessageStatus.Pending,
        }),
      ]);
    });

    it('should keep message as pending when AI integration is not configured', async () => {
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
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });

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

    it('should fail message when onError callback is called', async () => {
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      sendRequestCallbacks.onError?.(new Error('Network error'));

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          text: 'Network error',
        }),
      ]);

      await expect(promise).rejects.toThrow('Network error');
    });

    it('should fail message when response has no actions', async () => {
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const response = {} as ExecuteGridAssistantCommandResult;

      sendRequestCallbacks.onComplete?.(response);
      await Promise.resolve();
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          text: 'Default error message',
        }),
      ]);

      await expect(promise).rejects.toThrow('Default error message');
    });

    it('should resolve promise when command succeeds', async () => {
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });

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
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      sendRequestCallbacks.onError?.(new Error('Network error'));

      await expect(promise).rejects.toThrow('Network error');
    });

    it('should reject promise when response has no actions', async () => {
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });

      const promise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      sendRequestCallbacks.onComplete?.({} as ExecuteGridAssistantCommandResult);

      await expect(promise).rejects.toThrow('Default error message');
    });
  });
});
