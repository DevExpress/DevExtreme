import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { ArrayStore } from '@js/common/data';
import type { Message } from '@js/ui/chat';

import type { InternalGrid } from '../../m_types';
import { AIAssistantController } from '../ai_assistant_controller';
import {
  AI_ASSISTANT_AUTHOR,
  AI_ASSISTANT_AUTHOR_ID,
  MessageStatus,
} from '../const';
import type { CommandResponse, InternalRequestCallbacks } from '../types';

let sendRequestCallbacks: InternalRequestCallbacks = {};

const mockAIIntegration = {
  sendRequest: jest.fn(({ callbacks }: { callbacks: InternalRequestCallbacks }) => {
    sendRequestCallbacks = callbacks;
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

      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp,
      } as Message);

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          id: `${AI_ASSISTANT_AUTHOR_ID}-${expectedTimestamp}`,
          timestamp: expectedTimestamp,
          author: AI_ASSISTANT_AUTHOR,
          text: 'Generate values',
          status: MessageStatus.Pending,
        }),
      ]);
    });

    it('should fail message when AI integration is not configured', async () => {
      const controller = createController();

      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Error,
          text: 'AI integration is not configured',
        }),
      ]);
    });

    it('should complete message as success when all commands succeed', async () => {
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });

      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const commands = [{ command: 'sort', args: { column: 'Name' } }];
      const response: CommandResponse = {
        commands,
        explanation: '',
      };

      sendRequestCallbacks.onComplete?.(response);
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Success,
          commands,
        }),
      ]);
    });

    it('should fail message when onError callback is called', async () => {
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });

      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      sendRequestCallbacks.onError?.(new Error('Network error'));

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Error,
          text: 'Network error',
        }),
      ]);
    });

    it('should fail message when response has no commands', async () => {
      const controller = createController({
        'aiAssistant.aiIntegration': mockAIIntegration,
      });

      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp: '2026-04-16T10:00:00.000Z',
      } as Message);

      const response: CommandResponse = {
        commands: [],
        explanation: 'Cannot process this request',
      };

      sendRequestCallbacks.onComplete?.(response);
      await Promise.resolve();
      await Promise.resolve();

      const messages = await getStore(controller).load();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Error,
          text: 'Cannot process this request',
        }),
      ]);
    });
  });
});
