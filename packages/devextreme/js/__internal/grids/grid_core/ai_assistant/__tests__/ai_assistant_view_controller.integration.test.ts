import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
  type DataGridInstance,
} from '../../__tests__/__mock__/helpers/utils';

const AI_ASSISTANT_BUTTON_SELECTOR = '.dx-datagrid-ai-assistant-button';
const HIDDEN_CLASS = 'dx-hidden';

const getAiAssistantButton = (
  instance: DataGridInstance,
): Element | null => instance
  .element()
  .querySelector(AI_ASSISTANT_BUTTON_SELECTOR);

const isAiAssistantButtonVisible = (instance: DataGridInstance): boolean => {
  const button = getAiAssistantButton(instance);

  if (!button) {
    return false;
  }

  return !button.closest(`.${HIDDEN_CLASS}`);
};

describe('AIAssistantViewController', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('init', () => {
    it('should register toolbar button when aiAssistant.enabled is true', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        aiAssistant: { enabled: true, title: 'AI Assistant' },
      });

      const button = getAiAssistantButton(instance);

      expect(button).not.toBeNull();
    });

    it('should not register toolbar button when aiAssistant.enabled is false', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        aiAssistant: { enabled: false },
      });

      const button = getAiAssistantButton(instance);

      expect(button).toBeNull();
    });

    it('should not register toolbar button when aiAssistant is not set', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });

      const button = getAiAssistantButton(instance);

      expect(button).toBeNull();
    });
  });

  describe('optionChanged', () => {
    it('should add toolbar button when aiAssistant.enabled changes to true', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        aiAssistant: { enabled: false, title: 'AI Assistant' },
      });

      instance.option('aiAssistant.enabled', true);
      jest.runAllTimers();
      await Promise.resolve();
      jest.runAllTimers();

      const button = getAiAssistantButton(instance);

      expect(button).not.toBeNull();
    });

    it('should hide ai assistant button when aiAssistant.enabled changes to false', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        aiAssistant: { enabled: true, title: 'AI Assistant' },
      });

      expect(isAiAssistantButtonVisible(instance)).toBe(true);

      instance.option('aiAssistant.enabled', false);
      jest.runAllTimers();
      await Promise.resolve();
      jest.runAllTimers();

      expect(isAiAssistantButtonVisible(instance)).toBe(false);
    });
  });

  describe('toolbar button', () => {
    it('should have aria-haspopup dialog attribute', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        aiAssistant: { enabled: true, title: 'AI Assistant' },
      });

      const button = getAiAssistantButton(instance);

      expect(button?.getAttribute('aria-haspopup')).toBe('dialog');
    });

    it('should have correct hint text from aiAssistant.title', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        aiAssistant: { enabled: true, title: 'My Custom Title' },
      });

      const button = getAiAssistantButton(instance);

      expect(button?.getAttribute('title')).toBe('My Custom Title');
    });
  });
});
