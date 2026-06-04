/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import { ArrayStore } from '@js/common/data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import wrapInstanceWithMocks from '@ts/grids/grid_core/__tests__/__mock__/helpers/wrapInstance';

import { AIChat } from '../../ai_chat/ai_chat';
import type { AIChatOptions } from '../../ai_chat/types';
import { AIAssistantView } from '../ai_assistant_view';
import { createConfirmDialog } from '../utils';

jest.mock('../utils', (): any => {
  const original = jest.requireActual<any>('../utils');

  return {
    ...original,
    createConfirmDialog: jest.fn(),
  };
});

jest.mock('../../ai_chat/ai_chat', (): any => {
  const original = jest.requireActual<any>('../../ai_chat/ai_chat');

  return {
    ...original,
    AIChat: jest.fn((...args: any[]) => {
      const instance: AIChat = new original.AIChat(...args);
      return wrapInstanceWithMocks(instance);
    }),
  };
});

const createComponentMock = jest.fn((
  el: dxElementWrapper,
  Widget: any,
  options: any,
): any => new Widget(el, options));

const mockMessageStore = new ArrayStore({ key: 'id' });
const mockAIAssistantController = {
  getMessageStore: jest.fn().mockReturnValue(mockMessageStore),
  sendRequestToAI: jest.fn(),
  abortRequest: jest.fn(),
  isProcessing: jest.fn().mockReturnValue(false),
};

const createAIAssistantView = ({
  initialEnabled = true,
  render = true,
}: {
  initialEnabled?: boolean;
  render?: boolean;
} = {}): {
  $container: dxElementWrapper;
  aiAssistantView: AIAssistantView;
  optionMock: jest.Mock<(name: string) => boolean | undefined>;
  setEnabled: (value: boolean) => void;
} => {
  const $container = $('<div>').appendTo(document.body);
  let isEnabled = initialEnabled;
  const optionMock = jest.fn((name: string): boolean | undefined => {
    if (name === 'aiAssistant.enabled') {
      return isEnabled;
    }

    return undefined;
  });
  const $columnHeadersElement = $('<div>').appendTo($container);
  const $rowsViewElement = $('<div>').css('height', '400px').appendTo($container);

  const mockColumnHeadersView = {
    getHeight: jest.fn().mockReturnValue(50),
    element: jest.fn().mockReturnValue($columnHeadersElement),
  };
  const mockRowsView = {
    element: jest.fn().mockReturnValue($rowsViewElement),
  };

  const mockComponent = {
    NAME: 'dxDataGrid',
    element: (): any => $container.get(0),
    _createComponent: createComponentMock,
    _controllers: {
      aiAssistant: mockAIAssistantController,
    },
    _views: {
      columnHeadersView: mockColumnHeadersView,
      rowsView: mockRowsView,
    },
    option: optionMock,
  };

  const aiAssistantView = new AIAssistantView(mockComponent);
  aiAssistantView.init();
  if (render) {
    aiAssistantView.render($container);
  }

  return {
    $container,
    aiAssistantView,
    optionMock,
    setEnabled: (value: boolean): void => {
      isEnabled = value;
    },
  };
};

const beforeTest = (): void => {
  fx.off = true;
  jest.useFakeTimers();
  jest.clearAllMocks();
};

const afterTest = (): void => {
  mockMessageStore.off('push');
  document.body.innerHTML = '';
  fx.off = false;
  jest.useRealTimers();
};

describe('AIAssistantView', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('isVisible', () => {
    it('should return aiAssistant.enabled option value', () => {
      const { aiAssistantView, optionMock, setEnabled } = createAIAssistantView({ render: false });

      expect(aiAssistantView.isVisible()).toBe(true);

      setEnabled(false);

      expect(aiAssistantView.isVisible()).toBe(false);
      expect(optionMock).toHaveBeenNthCalledWith(1, 'aiAssistant.enabled');
      expect(optionMock).toHaveBeenNthCalledWith(2, 'aiAssistant.enabled');
    });
  });

  describe('initialization', () => {
    it('should create AIChat instance on first render', () => {
      createAIAssistantView();

      expect(AIChat).toHaveBeenCalledTimes(1);
    });

    it('should pass container, createComponent, popupOptions, chatOptions, and onRegenerate to AIChat', () => {
      const { aiAssistantView } = createAIAssistantView();

      expect(AIChat).toHaveBeenCalledWith(
        expect.objectContaining({
          container: aiAssistantView.element(),
          createComponent: expect.any(Function),
          popupOptions: expect.any(Object),
          chatOptions: expect.any(Object),
          onRegenerate: expect.any(Function),
        }),
      );
    });

    it('should configure chatOptions with controller message data source and reloadOnChange', () => {
      createAIAssistantView();

      const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;

      expect(mockAIAssistantController.getMessageStore).toHaveBeenCalledTimes(1);
      expect(aiChatConfig.chatOptions).toEqual(expect.objectContaining({
        dataSource: expect.objectContaining({
          store: mockMessageStore,
          pushAggregationTimeout: 0,
        }),
        reloadOnChange: true,
        onMessageEntered: expect.any(Function),
      }));
    });

    it('should not create a new AIChat instance on subsequent renders', () => {
      const { $container, aiAssistantView } = createAIAssistantView();

      aiAssistantView.render($container);

      expect(AIChat).toHaveBeenCalledTimes(1);
    });

    it('should not create AIChat instance when aiAssistant is disabled', () => {
      const { aiAssistantView } = createAIAssistantView({ initialEnabled: false });

      expect(AIChat).not.toHaveBeenCalled();
      expect(aiAssistantView.element().hasClass('dx-hidden')).toBe(true);
    });

    it('should create AIChat instance when aiAssistant becomes enabled', () => {
      const { $container, aiAssistantView, setEnabled } = createAIAssistantView({
        initialEnabled: false,
      });

      setEnabled(true);
      aiAssistantView.render($container);

      expect(AIChat).toHaveBeenCalledTimes(1);
      expect(aiAssistantView.element().hasClass('dx-hidden')).toBe(false);
    });
  });

  describe('toggle', () => {
    it('should delegate to AIChat toggle method', async () => {
      const { aiAssistantView } = createAIAssistantView();

      await aiAssistantView.toggle();

      const aiChatInstance = (AIChat as jest.Mock)
        .mock.results[0].value as { toggle: jest.Mock };

      expect(aiChatInstance.toggle).toHaveBeenCalledTimes(1);
    });

    it('should return resolved false promise when aiChatInstance is not created', () => {
      const { aiAssistantView } = createAIAssistantView({ render: false });

      return expect(aiAssistantView.toggle()).resolves.toBe(false);
    });
  });

  describe('hide', () => {
    it('should delegate to AIChat hide method', async () => {
      const { aiAssistantView } = createAIAssistantView();

      await aiAssistantView.hide();

      const aiChatInstance = (AIChat as jest.Mock)
        .mock.results[0].value as { hide: jest.Mock };

      expect(aiChatInstance.hide).toHaveBeenCalledTimes(1);
    });

    it('should return resolved false promise when aiChatInstance is not created', () => {
      const { aiAssistantView } = createAIAssistantView({ render: false });

      return expect(aiAssistantView.hide()).resolves.toBe(false);
    });
  });

  describe('dispose', () => {
    it('should unsubscribe from store push event', () => {
      const onSpy = jest.spyOn(mockMessageStore, 'on');
      const { aiAssistantView } = createAIAssistantView();
      const offSpy = jest.spyOn(mockMessageStore, 'off');

      aiAssistantView.dispose();

      const onPushCall = (onSpy.mock.calls as any[][]).find((call) => call[0] === 'push');
      const offPushCall = (offSpy.mock.calls as any[][]).find((call) => call[0] === 'push');

      expect(onPushCall).toBeDefined();
      expect(offPushCall).toBeDefined();
      expect((offPushCall as any[])[1]).toBe((onPushCall as any[])[1]);

      offSpy.mockRestore();
      onSpy.mockRestore();
    });
  });

  describe('isShown', () => {
    it('should delegate to AIChat isShown method', () => {
      const { aiAssistantView } = createAIAssistantView();

      const aiChatInstance = (AIChat as jest.Mock)
        .mock.results[0].value as { isShown: jest.Mock };

      aiChatInstance.isShown.mockReturnValue(true);
      expect(aiAssistantView.isShown()).toBe(true);

      aiChatInstance.isShown.mockReturnValue(false);
      expect(aiAssistantView.isShown()).toBe(false);
    });

    it('should return false when aiChatInstance is not created', () => {
      const { aiAssistantView } = createAIAssistantView({ render: false });

      expect(aiAssistantView.isShown()).toBe(false);
    });
  });

  describe('visibilityChanged', () => {
    it('should fire visibilityChanged callback with true when popup onShowing is triggered', () => {
      const { aiAssistantView } = createAIAssistantView();
      const callback = jest.fn();

      aiAssistantView.visibilityChanged?.add(callback);

      const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
      aiChatConfig.popupOptions?.onShowing?.({} as any);

      expect(callback).toHaveBeenCalledWith(true);
    });

    it('should fire visibilityChanged callback with false when popup onHidden is triggered', () => {
      const { aiAssistantView } = createAIAssistantView();
      const callback = jest.fn();

      aiAssistantView.visibilityChanged?.add(callback);

      const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
      aiChatConfig.popupOptions?.onHidden?.({} as any);

      expect(callback).toHaveBeenCalledWith(false);
    });
  });

  describe('onHiding', () => {
    it('should not cancel hiding when controller is not processing', () => {
      mockAIAssistantController.isProcessing.mockReturnValue(false);
      createAIAssistantView();

      const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
      const event = { cancel: false, component: { hide: jest.fn() } };

      aiChatConfig.popupOptions?.onHiding?.(event as any);

      expect(event.cancel).toBe(false);
      expect(createConfirmDialog).not.toHaveBeenCalled();
    });

    it('should cancel hiding and show confirm dialog when controller is processing', () => {
      mockAIAssistantController.isProcessing.mockReturnValue(true);

      const mockDialog = {
        show: jest.fn().mockReturnValue({
          done: jest.fn(),
        }),
      };
      (createConfirmDialog as jest.Mock).mockReturnValue(mockDialog);
      createAIAssistantView();

      const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
      const event = { cancel: false, component: { hide: jest.fn() } };

      aiChatConfig.popupOptions?.onHiding?.(event as any);

      expect(event.cancel).toBe(true);
      expect(createConfirmDialog).toHaveBeenCalledTimes(1);
      expect(createConfirmDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          popupOptions: expect.objectContaining({
            elementAttr: expect.objectContaining({
              class: expect.stringContaining('ai-assistant-confirm-dialog'),
            }),
          }),
        }),
      );
      expect(mockDialog.show).toHaveBeenCalledTimes(1);
    });

    it('should abort request and hide popup when confirm result is true', () => {
      mockAIAssistantController.isProcessing.mockReturnValue(true);

      let doneCallback: (result: boolean) => void = () => {};
      const mockDialog = {
        show: jest.fn().mockReturnValue({
          done: jest.fn((cb: (result: boolean) => void) => {
            doneCallback = cb;
          }),
        }),
      };
      (createConfirmDialog as jest.Mock).mockReturnValue(mockDialog);
      createAIAssistantView();

      const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
      const hideMock = jest.fn();
      const event = { cancel: false, component: { hide: hideMock } };

      aiChatConfig.popupOptions?.onHiding?.(event as any);
      doneCallback(true);

      expect(mockAIAssistantController.abortRequest).toHaveBeenCalledTimes(1);
      expect(hideMock).toHaveBeenCalledTimes(1);
    });

    it('should not abort request when confirm result is false', () => {
      mockAIAssistantController.isProcessing.mockReturnValue(true);

      let doneCallback: (result: boolean) => void = () => {};
      const mockDialog = {
        show: jest.fn().mockReturnValue({
          done: jest.fn((cb: (result: boolean) => void) => {
            doneCallback = cb;
          }),
        }),
      };
      (createConfirmDialog as jest.Mock).mockReturnValue(mockDialog);
      createAIAssistantView();

      const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
      const hideMock = jest.fn();
      const event = { cancel: false, component: { hide: hideMock } };

      aiChatConfig.popupOptions?.onHiding?.(event as any);
      doneCallback(false);

      expect(mockAIAssistantController.abortRequest).not.toHaveBeenCalled();
      expect(hideMock).not.toHaveBeenCalled();
    });

    it('should not show confirm dialog again when hide is called after confirm', () => {
      mockAIAssistantController.isProcessing.mockReturnValue(true);

      let doneCallback: (result: boolean) => void = () => {};
      const mockDialog = {
        show: jest.fn().mockReturnValue({
          done: jest.fn((cb: (result: boolean) => void) => {
            doneCallback = cb;
          }),
        }),
      };
      (createConfirmDialog as jest.Mock).mockReturnValue(mockDialog);
      createAIAssistantView();

      const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
      const hideMock = jest.fn();
      const event = { cancel: false, component: { hide: hideMock } };

      aiChatConfig.popupOptions?.onHiding?.(event as any);

      // Simulate: user confirms closing, hide() is called,
      // which triggers onHiding again while still processing
      hideMock.mockImplementation(() => {
        const repeatHidingEvent = { cancel: false, component: { hide: hideMock } };

        aiChatConfig.popupOptions?.onHiding?.(repeatHidingEvent as any);

        expect(repeatHidingEvent.cancel).toBe(false);
      });

      doneCallback(true);

      expect(createConfirmDialog).toHaveBeenCalledTimes(1);
      expect(mockAIAssistantController.abortRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('chat event handlers', () => {
    describe('onRegenerate', () => {
      it('should send request to AI with the AI message', () => {
        mockAIAssistantController.sendRequestToAI.mockReturnValue(Promise.resolve());
        createAIAssistantView();

        const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
        const aiMessage = {
          id: 'assistant-123',
          author: { id: 'assistant' },
          text: 'failure',
          prompt: 'Generate summary',
          status: 'failure',
          headerText: 'Failed to process request',
          errorText: 'Network error',
        };

        aiChatConfig.onRegenerate?.(aiMessage as any);

        expect(mockAIAssistantController.sendRequestToAI).toHaveBeenCalledTimes(1);
        expect(mockAIAssistantController.sendRequestToAI).toHaveBeenCalledWith(aiMessage);
      });

      it('should call setDisabled(true) before sending request', () => {
        mockAIAssistantController.sendRequestToAI.mockReturnValue(Promise.resolve());
        createAIAssistantView();

        const aiChatInstance = (AIChat as jest.Mock)
          .mock.results[0].value as { setDisabled: jest.Mock };

        const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
        const aiMessage = {
          id: 'assistant-123',
          author: { id: 'assistant' },
          text: 'failure',
          prompt: 'Generate summary',
          status: 'failure',
          headerText: 'Failed to process request',
        };

        aiChatConfig.onRegenerate?.(aiMessage as any);

        expect(aiChatInstance.setDisabled).toHaveBeenCalledWith(true);
      });

      it('should call setDisabled(false) after request completes successfully', async () => {
        mockAIAssistantController.sendRequestToAI.mockReturnValue(Promise.resolve());
        createAIAssistantView();

        const aiChatInstance = (AIChat as jest.Mock)
          .mock.results[0].value as { setDisabled: jest.Mock };

        const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
        const aiMessage = {
          id: 'assistant-123',
          author: { id: 'assistant' },
          text: 'failure',
          prompt: 'Generate summary',
          status: 'failure',
          headerText: 'Failed to process request',
        };

        aiChatConfig.onRegenerate?.(aiMessage as any);
        await Promise.resolve();

        expect(aiChatInstance.setDisabled).toHaveBeenLastCalledWith(false);
      });

      it('should call setDisabled(false) after request fails', async () => {
        mockAIAssistantController.sendRequestToAI.mockImplementation(
          () => Promise.reject(new Error('Network error')),
        );
        createAIAssistantView();

        const aiChatInstance = (AIChat as jest.Mock)
          .mock.results[0].value as { setDisabled: jest.Mock };

        const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
        const aiMessage = {
          id: 'assistant-123',
          author: { id: 'assistant' },
          text: 'failure',
          prompt: 'Generate summary',
          status: 'failure',
          headerText: 'Failed to process request',
        };

        aiChatConfig.onRegenerate?.(aiMessage as any);
        await Promise.resolve();

        expect(aiChatInstance.setDisabled).toHaveBeenLastCalledWith(false);
      });
    });

    describe('onMessageEntered', () => {
      it('should send request to AI with the entered message', () => {
        mockAIAssistantController.sendRequestToAI.mockReturnValue(Promise.resolve());
        createAIAssistantView();

        const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
        const message = {
          author: { id: 'user', name: 'User' },
          text: 'Generate summary',
        };

        aiChatConfig.chatOptions?.onMessageEntered?.({ message } as any);

        expect(mockAIAssistantController.sendRequestToAI).toHaveBeenCalledTimes(1);
        expect(mockAIAssistantController.sendRequestToAI).toHaveBeenCalledWith(message);
      });

      it('should call setDisabled(true) before sending request', () => {
        mockAIAssistantController.sendRequestToAI.mockReturnValue(Promise.resolve());
        createAIAssistantView();

        const aiChatInstance = (AIChat as jest.Mock)
          .mock.results[0].value as { setDisabled: jest.Mock };

        const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
        const message = {
          author: { id: 'user', name: 'User' },
          text: 'Generate summary',
        };

        aiChatConfig.chatOptions?.onMessageEntered?.({ message } as any);

        expect(aiChatInstance.setDisabled).toHaveBeenCalledWith(true);
      });

      it('should call setDisabled(false) after request completes successfully', async () => {
        mockAIAssistantController.sendRequestToAI.mockReturnValue(Promise.resolve());
        createAIAssistantView();

        const aiChatInstance = (AIChat as jest.Mock)
          .mock.results[0].value as { setDisabled: jest.Mock };

        const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
        const message = {
          author: { id: 'user', name: 'User' },
          text: 'Generate summary',
        };

        aiChatConfig.chatOptions?.onMessageEntered?.({ message } as any);
        await Promise.resolve();

        expect(aiChatInstance.setDisabled).toHaveBeenLastCalledWith(false);
      });

      it('should call setDisabled(false) after request fails', async () => {
        mockAIAssistantController.sendRequestToAI.mockImplementation(
          () => Promise.reject(new Error('Network error')),
        );
        createAIAssistantView();

        const aiChatInstance = (AIChat as jest.Mock)
          .mock.results[0].value as { setDisabled: jest.Mock };

        const aiChatConfig = (AIChat as jest.Mock).mock.calls[0][0] as AIChatOptions;
        const message = {
          author: { id: 'user', name: 'User' },
          text: 'Generate summary',
        };

        aiChatConfig.chatOptions?.onMessageEntered?.({ message } as any);
        await Promise.resolve();

        expect(aiChatInstance.setDisabled).toHaveBeenLastCalledWith(false);
      });
    });

    describe('handleMessageStorePush', () => {
      const USER_ID = 'user';

      const getPushHandler = (): (changes: any[]) => void => {
        const onSpy = jest.spyOn(mockMessageStore, 'on');
        createAIAssistantView();

        const aiChatInstance = (AIChat as jest.Mock)
          .mock.results[0].value as { getUserId: jest.Mock };
        aiChatInstance.getUserId.mockReturnValue(USER_ID);

        const pushCall = (onSpy.mock.calls as any[][]).find((call) => call[0] === 'push');
        onSpy.mockRestore();

        if (!pushCall?.[1]) {
          throw new Error('Push handler not found');
        }

        return pushCall[1] as (changes: any[]) => void;
      };

      it('should subscribe to store push event during init', () => {
        const onSpy = jest.spyOn(mockMessageStore, 'on');
        createAIAssistantView({ render: false });

        expect(onSpy).toHaveBeenCalledWith('push', expect.any(Function));
        onSpy.mockRestore();
      });

      it('should unsubscribe from previous push handler before subscribing', () => {
        const offSpy = jest.spyOn(mockMessageStore, 'off');
        const onSpy = jest.spyOn(mockMessageStore, 'on');
        createAIAssistantView();

        const onPushCall = (onSpy.mock.calls as any[][]).find((call) => call[0] === 'push') as any[];
        const offPushCall = (offSpy.mock.calls as any[][]).find((call) => call[0] === 'push') as any[];

        expect(offPushCall).toBeDefined();
        expect(onPushCall).toBeDefined();
        expect(offPushCall[1]).toBe(onPushCall[1]);

        offSpy.mockRestore();
        onSpy.mockRestore();
      });

      it('should call sendRequestToAI when user message is inserted via store push', () => {
        mockAIAssistantController.sendRequestToAI.mockReturnValue(Promise.resolve());
        const pushHandler = getPushHandler();

        const userMessage = {
          id: 'user-msg-1',
          author: { id: USER_ID, name: 'User' },
          text: 'Sort by name',
        };

        pushHandler([{ type: 'insert', data: userMessage }]);

        expect(mockAIAssistantController.sendRequestToAI).toHaveBeenCalledTimes(1);
        expect(mockAIAssistantController.sendRequestToAI).toHaveBeenCalledWith(userMessage);
      });

      it('should not call sendRequestToAI when AI message is inserted via store push', () => {
        const pushHandler = getPushHandler();

        const aiMessage = {
          id: 'assistant-msg-1',
          author: { id: 'assistant' },
          text: 'Done',
          prompt: 'Sort by name',
          status: 'success',
          headerText: 'Sort',
        };

        pushHandler([{ type: 'insert', data: aiMessage }]);

        expect(mockAIAssistantController.sendRequestToAI).not.toHaveBeenCalled();
      });

      it('should not call sendRequestToAI when message from another user is inserted via store push', () => {
        const pushHandler = getPushHandler();

        const otherUserMessage = {
          id: 'other-msg-1',
          author: { id: 'other-user', name: 'Other' },
          text: 'Hello',
        };

        pushHandler([{ type: 'insert', data: otherUserMessage }]);

        expect(mockAIAssistantController.sendRequestToAI).not.toHaveBeenCalled();
      });

      it('should not call sendRequestToAI when message is updated via store push', () => {
        const pushHandler = getPushHandler();

        pushHandler([{
          type: 'update',
          key: 'msg-1',
          data: { text: 'updated' },
        }]);

        expect(mockAIAssistantController.sendRequestToAI).not.toHaveBeenCalled();
      });

      it('should not call sendRequestToAI when message is removed via store push', () => {
        const pushHandler = getPushHandler();

        pushHandler([{ type: 'delete', key: 'msg-1' }]);

        expect(mockAIAssistantController.sendRequestToAI).not.toHaveBeenCalled();
      });
    });
  });

  describe('optionChanged', () => {
    it('should set handled to true for aiAssistant options', () => {
      const { aiAssistantView } = createAIAssistantView();

      const args = {
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.title' as const,
        value: 'New Title',
        previousValue: 'Old Title',
        handled: false,
      };

      aiAssistantView.optionChanged(args);

      expect(args.handled).toBe(true);
    });

    it('should call _invalidate when aiAssistant.enabled changes to true', () => {
      const { aiAssistantView } = createAIAssistantView();
      const invalidateSpy = jest.spyOn(aiAssistantView, '_invalidate' as any);

      aiAssistantView.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.enabled' as const,
        value: true,
        previousValue: false,
        handled: false,
      });

      expect(invalidateSpy).toHaveBeenCalledTimes(1);
    });

    it('should call hide when aiAssistant.enabled changes to false', () => {
      const { aiAssistantView, setEnabled } = createAIAssistantView();
      const hideSpy = jest.spyOn(aiAssistantView, 'hide');

      setEnabled(false);

      aiAssistantView.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.enabled' as const,
        value: false,
        previousValue: true,
        handled: false,
      });

      expect(hideSpy).toHaveBeenCalledTimes(1);
    });

    it('should call updateOptions on aiChatInstance for title change', () => {
      const { aiAssistantView } = createAIAssistantView();

      const aiChatInstance = (AIChat as jest.Mock)
        .mock.results[0].value as { updateOptions: jest.Mock };

      aiAssistantView.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.title' as const,
        value: 'New Title',
        previousValue: 'Old Title',
        handled: false,
      });

      expect(aiChatInstance.updateOptions).toHaveBeenCalledTimes(1);
      expect(aiChatInstance.updateOptions).toHaveBeenCalledWith(
        expect.any(Object),
        true,
        false,
      );
    });

    it('should call updateOptions on aiChatInstance for chat options change', () => {
      const { aiAssistantView } = createAIAssistantView();

      const aiChatInstance = (AIChat as jest.Mock)
        .mock.results[0].value as { updateOptions: jest.Mock };

      aiAssistantView.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.chat' as const,
        value: { speechToTextEnabled: false },
        previousValue: {},
        handled: false,
      });

      expect(aiChatInstance.updateOptions).toHaveBeenCalledTimes(1);
      expect(aiChatInstance.updateOptions).toHaveBeenCalledWith(
        expect.any(Object),
        false,
        true,
      );
    });

    it('should call updateOptions with both flags when object value contains title and chat', () => {
      const { aiAssistantView } = createAIAssistantView();

      const aiChatInstance = (AIChat as jest.Mock)
        .mock.results[0].value as { updateOptions: jest.Mock };

      aiAssistantView.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant' as const,
        value: { title: 'New title', chat: { speechToTextEnabled: false } },
        previousValue: { title: 'Old title' },
        handled: false,
      });

      expect(aiChatInstance.updateOptions).toHaveBeenCalledTimes(1);
      expect(aiChatInstance.updateOptions).toHaveBeenCalledWith(
        expect.any(Object),
        true,
        true,
      );
    });

    it('should not throw when aiChatInstance is not created for non-enabled sub-options', () => {
      const { aiAssistantView } = createAIAssistantView({ render: false });

      expect(() => {
        aiAssistantView.optionChanged({
          name: 'aiAssistant' as const,
          fullName: 'aiAssistant.title' as const,
          value: 'New Title',
          previousValue: 'Old Title',
          handled: false,
        });
      }).not.toThrow();
    });
  });
});
