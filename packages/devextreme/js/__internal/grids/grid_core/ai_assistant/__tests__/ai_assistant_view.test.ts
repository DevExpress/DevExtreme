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
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import wrapInstanceWithMocks from '@ts/grids/grid_core/__tests__/__mock__/helpers/wrapInstance';

import { AIChat } from '../../ai_chat/ai_chat';
import type { AIChatOptions } from '../../ai_chat/types';
import { AIAssistantView } from '../ai_assistant_view';

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
    element: (): any => $container.get(0),
    _createComponent: createComponentMock,
    _controllers: {},
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

    it('should pass container, createComponent, popupOptions, chatOptions, and onChatCleared to AIChat', () => {
      const { aiAssistantView } = createAIAssistantView();

      expect(AIChat).toHaveBeenCalledWith(
        expect.objectContaining({
          container: aiAssistantView.element(),
          createComponent: expect.any(Function),
          popupOptions: expect.any(Object),
          chatOptions: expect.any(Object),
          onChatCleared: expect.any(Function),
        }),
      );
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
