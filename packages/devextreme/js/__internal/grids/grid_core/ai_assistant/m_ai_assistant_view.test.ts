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

import { AIChat } from '../ai_chat/ai_chat';
import { AIAssistantView } from './m_ai_assistant_view';

jest.mock('../ai_chat/ai_chat', (): any => {
  const original = jest.requireActual<any>('../ai_chat/ai_chat');

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
  initialVisible = true,
  render = true,
}: {
  initialVisible?: boolean;
  render?: boolean;
} = {}): {
  $container: dxElementWrapper;
  aiAssistantView: AIAssistantView;
  optionMock: jest.Mock<(name: string) => boolean | undefined>;
  setVisible: (value: boolean) => void;
} => {
  const $container = $('<div>').appendTo(document.body);
  let isVisible = initialVisible;
  const optionMock = jest.fn((name: string): boolean | undefined => {
    if (name === 'aiAssistant.visible') {
      return isVisible;
    }

    return undefined;
  });
  const mockComponent = {
    element: (): any => $container.get(0),
    _createComponent: createComponentMock,
    _controllers: {},
    option: optionMock,
  };

  const aiAssistantView = new AIAssistantView(mockComponent);
  if (render) {
    aiAssistantView.render($container);
  }

  return {
    $container,
    aiAssistantView,
    optionMock,
    setVisible: (value: boolean) => {
      isVisible = value;
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
    it('should return aiAssistant.visible option value', () => {
      const { aiAssistantView, optionMock, setVisible } = createAIAssistantView({ render: false });

      expect(aiAssistantView.isVisible()).toBe(true);

      setVisible(false);

      expect(aiAssistantView.isVisible()).toBe(false);
      expect(optionMock).toHaveBeenNthCalledWith(1, 'aiAssistant.visible');
      expect(optionMock).toHaveBeenNthCalledWith(2, 'aiAssistant.visible');
    });
  });

  describe('initialization', () => {
    it('should create AIChat instance on first render', () => {
      createAIAssistantView();

      expect(AIChat).toHaveBeenCalledTimes(1);
    });

    it('should pass container and createComponent to AIChat', () => {
      const { aiAssistantView } = createAIAssistantView();

      expect(AIChat).toHaveBeenCalledWith(
        expect.objectContaining({
          container: aiAssistantView.element(),
          createComponent: expect.any(Function),
        }),
      );
    });

    it('should not create a new AIChat instance on subsequent renders', () => {
      const { $container, aiAssistantView } = createAIAssistantView();

      aiAssistantView.render($container);

      expect(AIChat).toHaveBeenCalledTimes(1);
    });

    it('should not create AIChat instance when view is hidden', () => {
      const { aiAssistantView } = createAIAssistantView({ initialVisible: false });

      expect(AIChat).not.toHaveBeenCalled();
      expect(aiAssistantView.element().hasClass('dx-hidden')).toBe(true);
    });

    it('should create AIChat instance when view becomes visible', () => {
      const { $container, aiAssistantView, setVisible } = createAIAssistantView({ initialVisible: false });

      setVisible(true);
      aiAssistantView.render($container);

      expect(AIChat).toHaveBeenCalledTimes(1);
      expect(aiAssistantView.element().hasClass('dx-hidden')).toBe(false);
    });
  });

  describe('show', () => {
    it('should delegate to AIChat show method', async () => {
      const { aiAssistantView } = createAIAssistantView();

      await aiAssistantView.show();

      const aiChatInstance = (AIChat as jest.Mock)
        .mock.results[0].value as { show: jest.Mock; hide: jest.Mock };

      expect(aiChatInstance.show).toHaveBeenCalledTimes(1);
    });
  });

  describe('hide', () => {
    it('should delegate to AIChat hide method', async () => {
      const { aiAssistantView } = createAIAssistantView();

      await aiAssistantView.hide();

      const aiChatInstance = (AIChat as jest.Mock)
        .mock.results[0].value as { show: jest.Mock; hide: jest.Mock };

      expect(aiChatInstance.hide).toHaveBeenCalledTimes(1);
    });
  });

  describe('show when not initialized', () => {
    it('should return resolved false promise when aiChatInstance is not created', () => {
      const { aiAssistantView } = createAIAssistantView({ render: false });

      return expect(aiAssistantView.show()).resolves.toBe(false);
    });
  });

  describe('hide when not initialized', () => {
    it('should return resolved false promise when aiChatInstance is not created', () => {
      const { aiAssistantView } = createAIAssistantView({ render: false });

      return expect(aiAssistantView.hide()).resolves.toBe(false);
    });
  });
});
