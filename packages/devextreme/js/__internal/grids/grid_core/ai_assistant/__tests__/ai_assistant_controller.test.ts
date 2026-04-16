import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { Message } from '@js/ui/chat';

import type { InternalGrid } from '../../m_types';
import { AIAssistantController } from '../ai_assistant_controller';
import {
  AI_ASSISTANT_AUTHOR,
  AI_ASSISTANT_AUTHOR_ID,
  MessageStatus,
} from '../const';

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

describe('AIAssistantController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPendingAIMessage', () => {
    it('should create pending assistant message in store and return its id', async () => {
      const controller = createController();
      const timestamp = '2026-04-16T10:00:00.000Z';
      const expectedTimestamp = Date.parse(timestamp);

      const message: Message = {
        author: { id: 'user', name: 'User' },
        text: 'Generate values',
        timestamp,
      } as Message;

      const messageId = controller.createPendingAIMessage(message);

      const messages = await controller.getMessageStore().load();

      expect(messageId).toBe(`${AI_ASSISTANT_AUTHOR_ID}-${expectedTimestamp}`);
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
  });
});
