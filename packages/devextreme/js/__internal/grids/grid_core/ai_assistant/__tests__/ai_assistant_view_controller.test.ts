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
  fire: jest.Mock;
}

interface MockAIAssistantView {
  toggle: jest.Mock<() => Promise<boolean>>;
  hide: jest.Mock<() => Promise<boolean>>;
  _invalidate: jest.Mock;
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
  _invalidate: jest.fn(),
  visibilityChanged: {
    add: jest.fn(),
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

    it('should hide aiAssistantView when aiAssistant.enabled changes to false', () => {
      const options: Record<string, unknown> = { 'aiAssistant.enabled': true };
      const { controller, mockView } = createAIAssistantViewController(options);

      options['aiAssistant.enabled'] = false;

      controller.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.enabled' as const,
        value: false,
        previousValue: true,
        handled: false,
      });

      expect(mockView.hide).toHaveBeenCalledTimes(1);
    });

    it('should invalidate aiAssistantView when enabling', () => {
      const options: Record<string, unknown> = { 'aiAssistant.enabled': false };
      const { controller, mockView } = createAIAssistantViewController(options);

      options['aiAssistant.enabled'] = true;

      controller.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.enabled' as const,
        value: true,
        previousValue: false,
        handled: false,
      });

      expect(mockView._invalidate).toHaveBeenCalledTimes(1);
    });

    it('should not invalidate aiAssistantView when disabling', () => {
      const options: Record<string, unknown> = { 'aiAssistant.enabled': true };
      const { controller, mockView } = createAIAssistantViewController(options);

      options['aiAssistant.enabled'] = false;

      controller.optionChanged({
        name: 'aiAssistant' as const,
        fullName: 'aiAssistant.enabled' as const,
        value: false,
        previousValue: true,
        handled: false,
      });

      expect(mockView._invalidate).not.toHaveBeenCalled();
    });
  });
});
