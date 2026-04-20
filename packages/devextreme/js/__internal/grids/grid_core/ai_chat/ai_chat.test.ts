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
import {
  CLASSES, CLEAR_CHAT_ICON, DEFAULT_POPUP_OPTIONS,
  ERROR_ITEM_EMOJI, REGENERATE_ICON, SUCCESS_ITEM_EMOJI,
} from './const';
import type { AIChatOptions, CommandResults } from './types';

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

    it('should configure chat with showUserName set to false', () => {
      createAIChat();
      triggerContentTemplate();

      const chatConfig = getChatConfig();

      expect(chatConfig.showUserName).toBe(false);
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
    describe('pending state', () => {
      it('should render pending classes, processing status text and sparkle icon', () => {
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

        expect(container.querySelector(`.${CLASSES.message}`)?.classList.contains(CLASSES.messagePending)).toBe(true);
        expect(container.querySelector(`.${CLASSES.messageIcon}`)?.classList.contains('dx-icon-sparkle')).toBe(true);
        expect(container.querySelector(`.${CLASSES.messageHeaderRow}`)).not.toBeNull();
        expect(container.querySelector(`.${CLASSES.messageHeader}`)?.textContent).toBe('Request in progress');
        expect(container.querySelector(`.${CLASSES.messageStatus}`)?.textContent).toBe('Processing...');
      });

      it('should render progress bar', () => {
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

      it('should not render regenerate button', () => {
        const onRegenerate = jest.fn();
        createAIChat({ onRegenerate });
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Processing',
            status: 'pending',
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.messageRegenerateButton}`)).toBeNull();
      });
    });

    describe('success state', () => {
      it('should render success class, header with message text and checkmark icon', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Sorting and Page Size',
            status: 'success',
            commands: [{ status: 'success', message: 'OK' }],
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.message}`)?.classList.contains(CLASSES.messageSuccess)).toBe(true);
        expect(container.querySelector(`.${CLASSES.messageIcon}`)?.classList.contains('dx-icon-checkmarkcirclefilled')).toBe(true);
        expect(container.querySelector(`.${CLASSES.messageHeaderRow}`)).not.toBeNull();
        expect(container.querySelector(`.${CLASSES.messageHeader}`)?.textContent).toBe('Sorting and Page Size');
      });

      it('should render command list with correct items', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');
        const commands: CommandResults = [
          { status: 'success', message: 'Sorted Name in ascending order.' },
          { status: 'success', message: 'Page size set to 15.' },
        ];

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Sorting, Grouping, and Page Size',
            status: 'success',
            commands,
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.messageList}`)).not.toBeNull();
        expect(container.querySelectorAll(`.${CLASSES.messageListItem}`)).toHaveLength(2);
        expect(container.querySelectorAll(`.${CLASSES.messageListItemSuccess}`)).toHaveLength(2);
        expect(container.querySelector(`.${CLASSES.messageProgressBar}`)).toBeNull();
      });

      it('should render emoji icons for success and error command items', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');
        const commands: CommandResults = [
          { status: 'success', message: 'Sorted Name.' },
          { status: 'error', message: 'Failed to group.' },
        ];

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Actions',
            status: 'success',
            commands,
          },
        }, container);

        const icons = container.querySelectorAll(`.${CLASSES.messageListItemIcon}`);

        expect(icons).toHaveLength(2);
        expect(icons[0].textContent).toBe(SUCCESS_ITEM_EMOJI);
        expect(icons[1].textContent).toBe(ERROR_ITEM_EMOJI);
      });

      it('should render error icon when commands contain errors', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Mixed',
            status: 'success',
            commands: [
              { status: 'success', message: 'OK' },
              { status: 'error', message: 'Failed' },
            ],
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.messageIcon}`)?.classList.contains('dx-icon-errorcircle')).toBe(true);
      });

      it('should not render regenerate button when all commands succeed', () => {
        const onRegenerate = jest.fn();
        createAIChat({ onRegenerate });
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Done',
            status: 'success',
            commands: [{ status: 'success', message: 'OK' }],
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.messageRegenerateButton}`)).toBeNull();
      });

      it('should render regenerate button when commands contain errors', () => {
        const onRegenerate = jest.fn();
        createAIChat({ onRegenerate });
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Mixed results',
            status: 'success',
            commands: [
              { status: 'success', message: 'OK' },
              { status: 'error', message: 'Failed' },
            ],
          },
        }, container);

        const regenerateButton = container.querySelector(`.${CLASSES.messageRegenerateButton}`);

        expect(regenerateButton).not.toBeNull();
        expect(regenerateButton?.classList.contains(`dx-icon-${REGENERATE_ICON}`)).toBe(true);
      });

      it('should not render command list when commands array is empty', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Done',
            status: 'success',
            commands: [],
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.messageList}`)).toBeNull();
      });
    });

    describe('error state', () => {
      it('should render error class, localized header, error text and error icon', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Invalid prompt. Please try again.',
            status: 'error',
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.message}`)?.classList.contains(CLASSES.messageError)).toBe(true);
        expect(container.querySelector(`.${CLASSES.messageIcon}`)?.classList.contains('dx-icon-errorcircle')).toBe(true);
        expect(container.querySelector(`.${CLASSES.messageHeader}`)?.textContent).toBe('Failed to process request');
        expect(container.querySelector(`.${CLASSES.messageErrorText}`)?.textContent).toBe('Invalid prompt. Please try again.');
      });

      it('should render empty error text when message text is undefined', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            status: 'error',
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.messageErrorText}`)?.textContent).toBe('');
      });

      it('should not render command list or progress bar', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Error occurred',
            status: 'error',
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.messageList}`)).toBeNull();
        expect(container.querySelector(`.${CLASSES.messageProgressBar}`)).toBeNull();
      });

      it('should render regenerate button when onRegenerate is provided', () => {
        const onRegenerate = jest.fn();
        createAIChat({ onRegenerate });
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Error occurred',
            status: 'error',
          },
        }, container);

        const regenerateButton = container.querySelector(`.${CLASSES.messageRegenerateButton}`);

        expect(regenerateButton).not.toBeNull();
        expect(regenerateButton?.classList.contains(`dx-icon-${REGENERATE_ICON}`)).toBe(true);
      });

      it('should not render regenerate button when onRegenerate is not provided', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Error occurred',
            status: 'error',
          },
        }, container);

        expect(container.querySelector(`.${CLASSES.messageRegenerateButton}`)).toBeNull();
      });

      it('should call onRegenerate callback when regenerate button is clicked', () => {
        const onRegenerate = jest.fn();
        createAIChat({ onRegenerate });
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: {
            author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
            text: 'Error occurred',
            status: 'error',
          },
        }, container);

        const regenerateButton = container.querySelector(`.${CLASSES.messageRegenerateButton}`) as HTMLElement;
        regenerateButton.click();

        expect(onRegenerate).toHaveBeenCalledTimes(1);
      });
    });

    describe('general', () => {
      it('should not render anything when message is undefined', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        chatConfig.messageTemplate({
          message: undefined,
        }, container);

        expect(container.innerHTML).toBe('');
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
