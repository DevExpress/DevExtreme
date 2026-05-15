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
  ABORTED_ITEM_EMOJI,
  CLASSES, CLEAR_CHAT_ICON, DEFAULT_POPUP_OPTIONS,
  ERROR_ITEM_EMOJI, REGENERATE_ICON, SUCCESS_ITEM_EMOJI,
} from './const';
import type { AIChatOptions, CommandResult } from './types';

const mockWidgetInstance = {
  option: jest.fn(),
};

jest.mock('../m_utils', () => ({
  __esModule: true,
  default: {
    getWidgetInstance: jest.fn(() => mockWidgetInstance),
  },
}));

const mockPopupInstance = {
  toggle: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  hide: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  option: jest.fn<(name: string) => unknown>().mockReturnValue(false),
};

const mockChatElement = $('<div>');

const mockDataSource = {
  store: jest.fn(),
  reload: jest.fn(),
};

const mockChatInstance = {
  option: jest.fn(),
  $element: jest.fn(() => mockChatElement),
  getDataSource: jest.fn(() => mockDataSource),
};

const mockClearChatButtonInstance = {
  option: jest.fn(),
};

const createComponentMock = jest.fn((
  _el: any,
  Widget: any,
  options?: any,
): any => {
  if (Widget === Popup) {
    const toolbarItems = options?.toolbarItems;

    if (toolbarItems) {
      toolbarItems.forEach((item: any) => {
        item.options?.onInitialized?.({ component: mockClearChatButtonInstance });
      });
    }

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

const createMockComponent = (message: any): any => ({
  option: jest.fn().mockReturnValue([message]),
});

const renderMessageTemplate = (chatConfig: any, message: any, container: HTMLElement): void => {
  chatConfig.messageTemplate({
    message,
    component: createMockComponent(message),
  }, container);
};

const beforeTest = (): void => {
  jest.clearAllMocks();
  mockChatElement.removeClass(CLASSES.disabled);
  mockChatElement.empty();
  mockWidgetInstance.option.mockClear();
  mockClearChatButtonInstance.option.mockClear();
  mockChatInstance.getDataSource.mockReturnValue(mockDataSource);
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
    it('should include toolbarItems with clear chat button', () => {
      createAIChat();

      const popupConfig = getPopupConfig();

      expect(popupConfig.toolbarItems).toEqual([
        expect.objectContaining({
          widget: 'dxButton',
          toolbar: 'top',
          location: 'after',
          options: expect.objectContaining({
            icon: CLEAR_CHAT_ICON,
            onClick: expect.any(Function),
          }),
        }),
      ]);
    });

    it('should call clear when clear chat button is clicked', () => {
      const mockStore = { clear: jest.fn() };
      mockDataSource.store.mockReturnValue(mockStore);

      createAIChat();
      triggerContentTemplate();

      const popupConfig = getPopupConfig();
      const clearButton = popupConfig.toolbarItems[0];
      clearButton.options.onClick();

      expect(mockStore.clear).toHaveBeenCalledTimes(1);
      expect(mockDataSource.reload).toHaveBeenCalledTimes(1);
    });
  });

  describe('messageTemplate', () => {
    describe('pending state', () => {
      it('should render pending classes, processing status text and sparkle icon', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          headerText: 'Request in progress',
          text: 'pending',
          status: 'pending',
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

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Build summary',
          status: 'pending',
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

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Processing',
          status: 'pending',
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

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          headerText: 'Sorting and Page Size',
          text: 'success',
          status: 'success',
          commands: [{ status: 'success', message: 'OK' }],
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
        const commands: CommandResult[] = [
          { status: 'success', message: 'Sorted Name in ascending order.' },
          { status: 'success', message: 'Page size set to 15.' },
        ];

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Sorting, Grouping, and Page Size',
          status: 'success',
          commands,
        }, container);

        expect(container.querySelector(`.${CLASSES.actionList}`)).not.toBeNull();
        expect(container.querySelectorAll(`.${CLASSES.actionListItem}`)).toHaveLength(2);
        expect(container.querySelectorAll(`.${CLASSES.actionListItemSuccess}`)).toHaveLength(2);
        expect(container.querySelector(`.${CLASSES.messageProgressBar}`)).toBeNull();
      });

      it('should render emoji icons for success and error command items', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');
        const commands: CommandResult[] = [
          { status: 'success', message: 'Sorted Name.' },
          { status: 'failure', message: 'Failed to group.' },
          { status: 'aborted', message: 'Aborted filter.' },
        ];

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Actions',
          status: 'success',
          commands,
        }, container);

        const icons = container.querySelectorAll(`.${CLASSES.actionListItemIcon}`);

        expect(icons).toHaveLength(3);
        expect(icons[0].textContent).toBe(SUCCESS_ITEM_EMOJI);
        expect(icons[1].textContent).toBe(ERROR_ITEM_EMOJI);
        expect(icons[2].textContent).toBe(ABORTED_ITEM_EMOJI);
      });

      it('should not render regenerate button when all commands succeed', () => {
        const onRegenerate = jest.fn();
        createAIChat({ onRegenerate });
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Done',
          status: 'success',
          commands: [{ status: 'success', message: 'OK' }],
        }, container);

        expect(container.querySelector(`.${CLASSES.messageRegenerateButton}`)).toBeNull();
      });

      it('should not render command list when commands array is empty', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Done',
          status: 'success',
          commands: [],
        }, container);

        expect(container.querySelector(`.${CLASSES.actionList}`)).toBeNull();
      });
    });

    describe('error state', () => {
      it('should render error class, localized header, error text and error icon', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          headerText: 'Failed to process request',
          text: 'failure',
          errorText: 'Invalid prompt. Please try again.',
          status: 'failure',
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

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          status: 'failure',
        }, container);

        expect(container.querySelector(`.${CLASSES.messageErrorText}`)?.textContent).toBe('');
      });

      it('should not render command list or progress bar', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Error occurred',
          status: 'failure',
        }, container);

        expect(container.querySelector(`.${CLASSES.actionList}`)).toBeNull();
        expect(container.querySelector(`.${CLASSES.messageProgressBar}`)).toBeNull();
      });

      it('should render regenerate button when onRegenerate is provided', () => {
        const onRegenerate = jest.fn();
        createAIChat({ onRegenerate });
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Error occurred',
          status: 'failure',
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

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Error occurred',
          status: 'failure',
        }, container);

        expect(container.querySelector(`.${CLASSES.messageRegenerateButton}`)).toBeNull();
      });

      it('should call onRegenerate callback when regenerate button is clicked', () => {
        const onRegenerate = jest.fn();
        createAIChat({ onRegenerate });
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Error occurred',
          status: 'failure',
        }, container);

        const regenerateButton = container.querySelector(`.${CLASSES.messageRegenerateButton}`) as HTMLElement;
        regenerateButton.click();

        expect(onRegenerate).toHaveBeenCalledTimes(1);
      });
    });

    describe('aborted state', () => {
      it('should render command list with aborted class for aborted command items', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');
        const commands: CommandResult[] = [
          { status: 'success', message: 'Sorted Name.' },
          { status: 'aborted', message: 'Filter was aborted.' },
        ];

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Sorting and Filtering',
          status: 'success',
          commands,
        }, container);

        expect(container.querySelector(`.${CLASSES.actionList}`)).not.toBeNull();
        expect(container.querySelectorAll(`.${CLASSES.actionListItem}`)).toHaveLength(2);
        expect(container.querySelectorAll(`.${CLASSES.actionListItemSuccess}`)).toHaveLength(1);
        expect(container.querySelectorAll(`.${CLASSES.actionListItemAborted}`)).toHaveLength(1);
      });

      it('should render aborted emoji for aborted command items', () => {
        createAIChat();
        triggerContentTemplate();

        const chatConfig = getChatConfig();
        const container = document.createElement('div');
        const commands: CommandResult[] = [
          { status: 'aborted', message: 'Filter was aborted.' },
        ];

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Filtering',
          status: 'success',
          commands,
        }, container);

        const icons = container.querySelectorAll(`.${CLASSES.actionListItemIcon}`);

        expect(icons).toHaveLength(1);
        expect(icons[0].textContent).toBe(ABORTED_ITEM_EMOJI);
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

        renderMessageTemplate(chatConfig, {
          author: { id: 'user', name: 'User' },
          text: 'User message',
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

    it('should render header from fresh item data even when template message has stale text', () => {
      createAIChat();
      triggerContentTemplate();

      const chatConfig = getChatConfig();
      const container = document.createElement('div');

      const freshMessage = {
        id: 'msg-1',
        author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
        headerText: 'Completed successfully',
        text: 'success',
        status: 'success',
        commands: [{ status: 'success', message: 'Done' }],
      };

      const mockComponent = {
        option: jest.fn().mockReturnValue([freshMessage]),
      };

      chatConfig.messageTemplate({
        message: {
          id: 'msg-1',
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'pending',
          status: 'pending',
        },
        component: mockComponent,
      }, container);

      expect(container.querySelector(`.${CLASSES.messageHeader}`)?.textContent).toBe('Completed successfully');
      expect(container.querySelector(`.${CLASSES.message}`)?.classList.contains(CLASSES.messageSuccess)).toBe(true);
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

  describe('disabled state', () => {
    describe('setDisabled', () => {
      it('should add disabled class to chat element', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();

        aiChat.setDisabled(true);

        expect(mockChatElement.hasClass(CLASSES.disabled)).toBe(true);
      });

      it('should remove disabled class from chat element when set to false', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();

        aiChat.setDisabled(true);
        aiChat.setDisabled(false);

        expect(mockChatElement.hasClass(CLASSES.disabled)).toBe(false);
      });

      it('should disable text area widget', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();
        mockChatElement.append($('<div>').addClass('dx-textarea'));

        aiChat.setDisabled(true);

        expect(mockWidgetInstance.option).toHaveBeenCalledWith('disabled', true);
      });

      it('should enable text area widget when set to false', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();
        mockChatElement.append($('<div>').addClass('dx-textarea'));

        aiChat.setDisabled(true);
        aiChat.setDisabled(false);

        expect(mockWidgetInstance.option).toHaveBeenCalledWith('disabled', false);
      });

      it('should disable speech-to-text widget', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();
        mockChatElement.append($('<div>').addClass('dx-speech-to-text'));

        aiChat.setDisabled(true);

        expect(mockWidgetInstance.option).toHaveBeenCalledWith('disabled', true);
      });

      it('should enable speech-to-text widget when set to false', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();
        mockChatElement.append($('<div>').addClass('dx-speech-to-text'));

        aiChat.setDisabled(true);
        aiChat.setDisabled(false);

        expect(mockWidgetInstance.option).toHaveBeenCalledWith('disabled', false);
      });

      it('should disable clear button via popup toolbarItems option', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();

        aiChat.setDisabled(true);

        expect(mockClearChatButtonInstance.option).toHaveBeenCalledWith('disabled', true);
      });

      it('should enable clear button via popup toolbarItems option', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();

        aiChat.setDisabled(true);
        aiChat.setDisabled(false);

        expect(mockClearChatButtonInstance.option).toHaveBeenCalledWith('disabled', false);
      });

      it('should disable chat suggestions via chatInstance option', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();

        aiChat.setDisabled(true);

        expect(mockChatInstance.option).toHaveBeenCalledWith({ suggestions: { disabled: true } });
      });

      it('should enable chat suggestions via chatInstance option when set to false', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();

        aiChat.setDisabled(true);
        aiChat.setDisabled(false);

        expect(mockChatInstance.option).toHaveBeenCalledWith({ suggestions: { disabled: false } });
      });

      it('should not update when setting same disabled value', () => {
        const { aiChat } = createAIChat();
        triggerContentTemplate();

        aiChat.setDisabled(true);
        mockClearChatButtonInstance.option.mockClear();
        mockWidgetInstance.option.mockClear();

        aiChat.setDisabled(true);

        expect(mockClearChatButtonInstance.option).not.toHaveBeenCalled();
        expect(mockWidgetInstance.option).not.toHaveBeenCalled();
      });

      it('should not throw when chatInstance is not created', () => {
        const { aiChat } = createAIChat();

        expect(() => {
          aiChat.setDisabled(true);
        }).not.toThrow();
      });
    });

    describe('regenerate button in disabled state', () => {
      it('should not call onRegenerate when chat is disabled', () => {
        const onRegenerate = jest.fn();
        const { aiChat } = createAIChat({ onRegenerate });
        triggerContentTemplate();

        aiChat.setDisabled(true);

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Error occurred',
          status: 'failure',
        }, container);

        const regenerateButton = container.querySelector(`.${CLASSES.messageRegenerateButton}`) as HTMLElement;
        regenerateButton.click();

        expect(onRegenerate).not.toHaveBeenCalled();
      });

      it('should render regenerate button when chat is disabled', () => {
        const onRegenerate = jest.fn();
        const { aiChat } = createAIChat({ onRegenerate });
        triggerContentTemplate();

        aiChat.setDisabled(true);

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Error occurred',
          status: 'failure',
        }, container);

        expect(container.querySelector(`.${CLASSES.messageRegenerateButton}`)).not.toBeNull();
      });

      it('should call onRegenerate when chat is re-enabled', () => {
        const onRegenerate = jest.fn();
        const { aiChat } = createAIChat({ onRegenerate });
        triggerContentTemplate();

        aiChat.setDisabled(true);
        aiChat.setDisabled(false);

        const chatConfig = getChatConfig();
        const container = document.createElement('div');

        renderMessageTemplate(chatConfig, {
          author: { id: AI_ASSISTANT_AUTHOR_ID, name: 'AI Assistant' },
          text: 'Error occurred',
          status: 'failure',
        }, container);

        const regenerateButton = container.querySelector(`.${CLASSES.messageRegenerateButton}`) as HTMLElement;
        regenerateButton.click();

        expect(onRegenerate).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('clear', () => {
    it('should clear store and reload dataSource', () => {
      const mockStore = { clear: jest.fn() };
      mockDataSource.store.mockReturnValue(mockStore);

      const { aiChat } = createAIChat();
      triggerContentTemplate();

      aiChat.clear();

      expect(mockChatInstance.getDataSource).toHaveBeenCalledTimes(1);
      expect(mockDataSource.store).toHaveBeenCalledTimes(1);
      expect(mockStore.clear).toHaveBeenCalledTimes(1);
      expect(mockDataSource.reload).toHaveBeenCalledTimes(1);
    });

    it('should not throw when dataSource is undefined', () => {
      mockChatInstance.getDataSource.mockReturnValue(undefined as any);

      const { aiChat } = createAIChat();
      triggerContentTemplate();

      expect(() => {
        aiChat.clear();
      }).not.toThrow();
    });

    it('should not throw when chatInstance is not initialized', () => {
      const { aiChat } = createAIChat();

      expect(() => {
        aiChat.clear();
      }).not.toThrow();
    });
  });

  describe('getUserId', () => {
    it('should return user id from chat instance', () => {
      mockChatInstance.option.mockImplementation((...args: unknown[]) => {
        if (args[0] === 'user.id') return 'user-123';
        return undefined;
      });

      const { aiChat } = createAIChat();
      triggerContentTemplate();

      expect(aiChat.getUserId()).toBe('user-123');
    });

    it('should return empty string when chatInstance is not initialized', () => {
      const { aiChat } = createAIChat();

      expect(aiChat.getUserId()).toBe('');
    });

    it('should return empty string when user.id is not set', () => {
      mockChatInstance.option.mockReturnValue(undefined);

      const { aiChat } = createAIChat();
      triggerContentTemplate();

      expect(aiChat.getUserId()).toBe('');
    });
  });
});
