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
import { AI_ASSISTANT_AUTHOR_ID } from '@ts/grids/grid_core/ai_assistant/const';
import ProgressBar from '@ts/ui/m_progress_bar';
import Popup from '@ts/ui/popup/m_popup';

import { AIChat } from './ai_chat';
import { CLASSES, CLEAR_CHAT_ICON, DEFAULT_POPUP_OPTIONS } from './const';
import type { AIChatOptions } from './types';

const mockPopupInstance = {
  toggle: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  hide: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  option: jest.fn<(name: string) => unknown>().mockReturnValue(false),
};

const mockChatInstance = {
  option: jest.fn(),
};

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

const getPopupConfig = (): any => {
  const call = createComponentMock.mock.calls.find(
    ([, Widget]) => Widget === Popup,
  );

  expect(call).toBeDefined();

  return (call as any)[2];
};

const triggerContentTemplate = (): void => {
  const popupConfig = getPopupConfig();

  popupConfig.contentTemplate($('<div>'));
};

const getChatConfig = (): any => {
  const call = createComponentMock.mock.calls.find(
    ([, Widget]) => Widget === Chat,
  );

  expect(call).toBeDefined();

  return (call as any)[2];
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

  describe('toggle', () => {
    it('should call popup toggle method', async () => {
      const { aiChat } = createAIChat();

      const result = await aiChat.toggle();

      expect(mockPopupInstance.toggle).toHaveBeenCalledTimes(1);
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

  describe('isShown', () => {
    it('should return true when popup is visible', () => {
      const { aiChat } = createAIChat();
      mockPopupInstance.option.mockReturnValue(true);

      expect(aiChat.isShown()).toBe(true);
      expect(mockPopupInstance.option).toHaveBeenCalledWith('visible');
    });

    it('should return false when popup is not visible', () => {
      const { aiChat } = createAIChat();
      mockPopupInstance.option.mockReturnValue(false);

      expect(aiChat.isShown()).toBe(false);
    });
  });

  describe('clearChatButton', () => {
    it('should include toolbarItems with clear chat button when onChatCleared is provided', () => {
      const onChatCleared = jest.fn();
      createAIChat({ onChatCleared });

      const popupConfig = getPopupConfig();

      expect(popupConfig.toolbarItems).toEqual([
        expect.objectContaining({
          widget: 'dxButton',
          toolbar: 'top',
          location: 'after',
          options: expect.objectContaining({
            icon: CLEAR_CHAT_ICON,
            onClick: onChatCleared,
          }),
        }),
      ]);
    });

    it('should not include toolbarItems when onChatCleared is not provided', () => {
      createAIChat();

      const popupConfig = getPopupConfig();

      expect(popupConfig.toolbarItems).toBeUndefined();
    });
  });

  describe('messageTemplate', () => {
    it('should render assistant pending message with custom markup and progress bar', () => {
      createAIChat();
      triggerContentTemplate();

      const chatConfig = getChatConfig();
      const container = document.createElement('div');

      chatConfig.messageTemplate({
        message: {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Build summary',
          status: 'pending',
        },
      }, container);

      expect(container.querySelector(`.${CLASSES.message}`)).not.toBeNull();
      expect(container.querySelector(`.${CLASSES.message}`)?.classList.contains(CLASSES.messagePending)).toBe(true);
      expect(container.querySelector(`.${CLASSES.messageIcon}`)).not.toBeNull();
      expect(container.querySelector(`.${CLASSES.messageHeader}`)?.textContent).toBe('Build summary');
      expect(container.querySelector(`.${CLASSES.messageGroupOperations}`)?.textContent).toBe('Processing...');
      expect(container.querySelector(`.${CLASSES.messageProgressBar}`)).not.toBeNull();
      expect(createComponentMock).toHaveBeenCalledWith(
        expect.any(Object),
        ProgressBar,
        {
          value: false,
          visible: true,
          showStatus: false,
          width: '100%',
        },
      );
    });

    it('should render plain text for non-assistant message', () => {
      createAIChat();
      triggerContentTemplate();

      const chatConfig = getChatConfig();
      const container = document.createElement('div');

      chatConfig.messageTemplate({
        message: {
          author: { id: 'user', name: 'User' },
          text: 'User message',
        },
      }, container);

      expect(container.textContent).toBe('User message');
      expect(container.querySelector(`.${CLASSES.message}`)).toBeNull();
      const hasProgressBarCreation = createComponentMock
        .mock
        .calls
        .some(([, Widget]) => Widget === ProgressBar);

      expect(hasProgressBarCreation).toBe(false);
    });
  });

  describe('updateOptions', () => {
    it('should call popupInstance.option with new popupOptions when updatePopup is true', () => {
      const { aiChat, $container } = createAIChat();
      const newPopupOptions = { title: 'Updated' };

      aiChat.updateOptions({
        container: $container,
        createComponent: createComponentMock as any,
        popupOptions: newPopupOptions,
      }, true, false);

      expect(mockPopupInstance.option).toHaveBeenCalledWith(newPopupOptions);
    });

    it('should not call popupInstance.option when updatePopup is false', () => {
      const { aiChat, $container } = createAIChat();

      aiChat.updateOptions({
        container: $container,
        createComponent: createComponentMock as any,
        popupOptions: { title: 'Updated' },
      }, false, false);

      expect(mockPopupInstance.option).not.toHaveBeenCalledWith({ title: 'Updated' });
    });

    it('should call chatInstance.option with new chatOptions when updateChat is true', () => {
      const { aiChat, $container } = createAIChat();
      triggerContentTemplate();

      const newChatOptions = { showAvatar: true };

      aiChat.updateOptions({
        container: $container,
        createComponent: createComponentMock as any,
        chatOptions: newChatOptions,
      }, false, true);

      expect(mockChatInstance.option).toHaveBeenCalledWith(newChatOptions);
    });

    it('should not call chatInstance.option when updateChat is false', () => {
      const { aiChat, $container } = createAIChat();
      triggerContentTemplate();

      aiChat.updateOptions({
        container: $container,
        createComponent: createComponentMock as any,
        chatOptions: { showAvatar: true },
      }, false, false);

      expect(mockChatInstance.option).not.toHaveBeenCalled();
    });

    it('should not throw when chatInstance is not created and updateChat is true', () => {
      const { aiChat, $container } = createAIChat();

      expect(() => {
        aiChat.updateOptions({
          container: $container,
          createComponent: createComponentMock as any,
          chatOptions: { showAvatar: true },
        }, false, true);
      }).not.toThrow();
    });
  });
});
