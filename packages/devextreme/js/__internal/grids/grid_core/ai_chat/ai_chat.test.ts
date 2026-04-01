/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import Chat from '@js/ui/chat';
import Popup from '@js/ui/popup';

import { AIChat } from './ai_chat';
import { CLASSES, DEFAULT_POPUP_OPTIONS } from './const';
import type { AIChatOptions } from './types';

const mockPopupInstance = {
  show: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  hide: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
};

const mockChatInstance = {};

const createComponentMock = jest.fn((
  _el: any,
  Widget: any,
): any => {
  if (Widget === Popup) {
    return mockPopupInstance;
  }
  if (Widget === Chat) {
    return mockChatInstance;
  }
  return {};
});

const createAIChat = (optionsOverride: Partial<AIChatOptions> = {}): {
  $container: ReturnType<typeof $>;
  aiChat: AIChat;
} => {
  const $container = $('<div>').appendTo(document.body);

  const options: AIChatOptions = {
    container: $container,
    createComponent: createComponentMock as any,
    ...optionsOverride,
  };

  const aiChat = new AIChat(options);

  return { $container, aiChat };
};

const beforeTest = (): void => {
  jest.clearAllMocks();
};

const afterTest = (): void => {
  document.body.innerHTML = '';
};

describe('AIChat', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('initialization', () => {
    it('should add ai chat class to container', () => {
      const { $container } = createAIChat();

      expect($container.hasClass(CLASSES.aiChat)).toBe(true);
    });

    it('should create popup instance via createComponent', () => {
      createAIChat();

      expect(createComponentMock).toHaveBeenCalledTimes(1);
      expect(createComponentMock).toHaveBeenCalledWith(
        expect.any(Object),
        Popup,
        expect.objectContaining({
          ...DEFAULT_POPUP_OPTIONS,
          wrapperAttr: { class: `${CLASSES.aiChat} ${CLASSES.aiDialog}` },
          contentTemplate: expect.any(Function),
        }),
      );
    });
  });

  describe('show', () => {
    it('should call popup show method', async () => {
      const { aiChat } = createAIChat();

      const result = await aiChat.show();

      expect(mockPopupInstance.show).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });

  describe('hide', () => {
    it('should call popup hide method', async () => {
      const { aiChat } = createAIChat();

      const result = await aiChat.hide();

      expect(mockPopupInstance.hide).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });
});
