import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { AIAssistantViewController } from './m_ai_assistant_view_controller';

interface MockAIAssistantView {
  show: jest.Mock<() => Promise<boolean>>;
  hide: jest.Mock<() => Promise<boolean>>;
}

const createMockAIAssistantView = (): MockAIAssistantView => ({
  show: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  hide: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
});

const createAIAssistantViewController = (): {
  controller: AIAssistantViewController;
  mockView: ReturnType<typeof createMockAIAssistantView>;
} => {
  const mockView = createMockAIAssistantView();
  const mockComponent = {
    _views: {
      aiAssistantView: mockView,
    },
    _controllers: {},
  };

  const controller = new AIAssistantViewController(mockComponent);
  controller.init();

  return { controller, mockView };
};

const beforeTest = (): void => {
  jest.clearAllMocks();
};

describe('AIAssistantViewController', () => {
  beforeEach(beforeTest);
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init', () => {
    it('should get aiAssistantView reference', () => {
      const { controller } = createAIAssistantViewController();

      expect(controller).toBeDefined();
    });
  });

  describe('show', () => {
    it('should delegate to aiAssistantView show method', async () => {
      const { controller, mockView } = createAIAssistantViewController();

      const result = await controller.show();

      expect(mockView.show).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });

  describe('hide', () => {
    it('should delegate to aiAssistantView hide method', async () => {
      const { controller, mockView } = createAIAssistantViewController();

      const result = await controller.hide();

      expect(mockView.hide).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });
});
