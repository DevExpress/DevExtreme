import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { AIAssistantViewController } from '../ai_assistant_view_controller';

interface MockVisibilityChangedCallback {
  add: jest.Mock;
  remove: jest.Mock;
  fire: jest.Mock;
}

interface MockAIAssistantView {
  toggle: jest.Mock<() => Promise<boolean>>;
  hide: jest.Mock<() => Promise<boolean>>;
  isShown: jest.Mock<() => boolean>;
  visibilityChanged: MockVisibilityChangedCallback;
}

interface MockHeaderPanel {
  registerToolbarItem: jest.Mock;
  applyToolbarItem: jest.Mock;
  removeToolbarItem: jest.Mock;
  getToolbarButtonClass: jest.Mock<(specificClass?: string) => string>;
}

const createMockAIAssistantView = (): MockAIAssistantView => ({
  toggle: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  hide: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  isShown: jest.fn<() => boolean>().mockReturnValue(false),
  visibilityChanged: {
    add: jest.fn(),
    remove: jest.fn(),
    fire: jest.fn(),
  },
});

const createMockHeaderPanel = (): MockHeaderPanel => ({
  registerToolbarItem: jest.fn(),
  applyToolbarItem: jest.fn(),
  removeToolbarItem: jest.fn(),
  getToolbarButtonClass: jest.fn(
    (specificClass?: string) => `dx-datagrid-toolbar-button${specificClass ? ` ${specificClass}` : ''}`,
  ),
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

  describe('visibilityChanged subscription', () => {
    it('should subscribe to aiAssistantView.visibilityChanged on init', () => {
      const { mockView } = createAIAssistantViewController();

      expect(mockView.visibilityChanged.add).toHaveBeenCalledTimes(1);
      expect(mockView.visibilityChanged.add).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should call remove before add to prevent duplicate subscriptions', () => {
      const { mockView } = createAIAssistantViewController();

      const removeOrder = mockView.visibilityChanged.remove.mock.invocationCallOrder[0];
      const addOrder = mockView.visibilityChanged.add.mock.invocationCallOrder[0];

      expect(mockView.visibilityChanged.remove).toHaveBeenCalledTimes(1);
      expect(mockView.visibilityChanged.remove).toHaveBeenCalledWith(expect.any(Function));
      expect(removeOrder).toBeLessThan(addOrder);
    });
  });

  describe('optionChanged', () => {
    it('should set handled to true for aiAssistant.enabled option', () => {
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

    it('should set handled to true for aiAssistant.title option', () => {
      const { controller } = createAIAssistantViewController();

      const args = {
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.title' as const,
        value: 'New Title',
        previousValue: 'Old Title',
        handled: false,
      };

      controller.optionChanged(args);

      expect(args.handled).toBe(true);
    });

    it('should not set handled for other aiAssistant sub-options', () => {
      const { controller } = createAIAssistantViewController();

      const args = {
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.popup' as const,
        value: {},
        previousValue: undefined,
        handled: false,
      };

      controller.optionChanged(args);

      expect(args.handled).toBe(false);
    });

    it('should sync toolbar item when aiAssistant.enabled changes to false', () => {
      const options: Record<string, unknown> = { 'aiAssistant.enabled': true };
      const { controller, mockHeaderPanel } = createAIAssistantViewController(options);

      options['aiAssistant.enabled'] = false;

      controller.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.enabled' as const,
        value: false,
        previousValue: true,
        handled: false,
      });

      expect(mockHeaderPanel.removeToolbarItem).toHaveBeenCalledTimes(1);
    });

    it('should sync toolbar item when aiAssistant.enabled changes to true', () => {
      const options: Record<string, unknown> = { 'aiAssistant.enabled': false };
      const { controller, mockHeaderPanel } = createAIAssistantViewController(options);

      options['aiAssistant.enabled'] = true;

      controller.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.enabled' as const,
        value: true,
        previousValue: false,
        handled: false,
      });

      expect(mockHeaderPanel.applyToolbarItem).toHaveBeenCalledTimes(1);
    });
  });
});
