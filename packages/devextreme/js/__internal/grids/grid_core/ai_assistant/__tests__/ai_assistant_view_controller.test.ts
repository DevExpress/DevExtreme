import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { AIAssistantViewController } from '../ai_assistant_view_controller';

interface MockAIAssistantView {
  toggle: jest.Mock<() => Promise<boolean>>;
  isShown: jest.Mock<() => boolean>;
  onVisibilityChanged?: (visible: boolean) => void;
}

interface MockHeaderPanel {
  registerToolbarItem: jest.Mock;
  applyToolbarItem: jest.Mock;
  removeToolbarItem: jest.Mock;
}

const createMockAIAssistantView = (): MockAIAssistantView => ({
  toggle: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  isShown: jest.fn<() => boolean>().mockReturnValue(false),
});

const createMockHeaderPanel = (): MockHeaderPanel => ({
  registerToolbarItem: jest.fn(),
  applyToolbarItem: jest.fn(),
  removeToolbarItem: jest.fn(),
});

const createAIAssistantViewController = (
  options: Record<string, unknown> = {},
): {
  controller: AIAssistantViewController;
  mockView: MockAIAssistantView;
  mockHeaderPanel: MockHeaderPanel;
} => {
  const mockView = createMockAIAssistantView();
  const mockHeaderPanel = createMockHeaderPanel();

  const mockComponent = {
    NAME: 'dxDataGrid',
    _views: {
      aiAssistantView: mockView,
      headerPanel: mockHeaderPanel,
    },
    _controllers: {},
    option(name?: string) {
      if (name !== undefined) {
        return options[name];
      }
      return options;
    },
  };

  const controller = new AIAssistantViewController(mockComponent);
  controller.init();

  return { controller, mockView, mockHeaderPanel };
};

describe('AIAssistantViewController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init', () => {
    it('should get aiAssistantView reference', () => {
      const { controller } = createAIAssistantViewController();

      expect(controller).toBeDefined();
    });
  });

  describe('toggle', () => {
    it('should delegate to aiAssistantView toggle', async () => {
      const { controller, mockView } = createAIAssistantViewController({
        'aiAssistant.enabled': true,
      });

      await controller.toggle();

      expect(mockView.toggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('onVisibilityChanged subscription', () => {
    it('should subscribe to aiAssistantView.onVisibilityChanged on init', () => {
      const { mockView } = createAIAssistantViewController();

      expect(mockView.onVisibilityChanged).toBeDefined();
      expect(typeof mockView.onVisibilityChanged).toBe('function');
    });
  });

  describe('optionChanged', () => {
    it('should set handled to true for aiAssistant options', () => {
      const { controller } = createAIAssistantViewController();

      const args = {
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.enabled' as const,
        value: true,
        previousValue: false,
        handled: false,
      };

      controller.optionChanged(args);

      expect(args.handled).toBe(true);
    });
  });
});
