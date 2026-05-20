import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  ExecuteGridAssistantCommandParams,
  ExecuteGridAssistantCommandResult,
  RequestCallbacks,
  Response as SendRequestResult,
} from '@js/common/ai-integration';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Message } from '@js/ui/chat';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';

import {
  afterTest,
  beforeTest,
  createDataGrid,
  type DataGridInstance,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';
import { CLASSES } from '../../ai_chat/const';
import { MessageStatus } from '../const';
import { GridCommands } from '../grid_commands';
import type { CommandResult } from '../types';

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

const createMockAIIntegration = (): {
  aiIntegration: AIIntegration;
  getLastCallbacks: () => RequestCallbacks<ExecuteGridAssistantCommandResult>;
} => {
  let lastCallbacks: RequestCallbacks<ExecuteGridAssistantCommandResult> = {};

  const aiIntegration = new AIIntegration({
    sendRequest(): SendRequestResult {
      return {
        promise: Promise.resolve('{}'),
        abort: jest.fn(),
      };
    },
  });

  aiIntegration.executeGridAssistant = jest.fn((
    params: ExecuteGridAssistantCommandParams,
    callbacks: RequestCallbacks<ExecuteGridAssistantCommandResult>,
  ): (() => void) => {
    lastCallbacks = callbacks;
    return jest.fn();
  });

  return {
    aiIntegration,
    getLastCallbacks: () => lastCallbacks,
  };
};

const findMessageElements = (): dxElementWrapper => $(`.${CLASSES.aiChat}`).find(`.${CLASSES.message}`);

const getMessageStatusClass = ($message: dxElementWrapper): string => {
  if ($message.hasClass(CLASSES.messagePending)) return MessageStatus.Pending;
  if ($message.hasClass(CLASSES.messageSuccess)) return MessageStatus.Success;
  if ($message.hasClass(CLASSES.messageError)) return MessageStatus.Failure;
  return '';
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

  describe('message rendering', () => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let validateSpy;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let executeCommandsSpy;

    beforeEach(() => {
      validateSpy = jest.spyOn(GridCommands.prototype, 'validate')
        .mockReturnValue(true);
      executeCommandsSpy = jest.spyOn(GridCommands.prototype, 'executeCommands')
        .mockResolvedValue([
          { status: 'success', message: 'Sorted by Name ascending' },
        ] as CommandResult[]);
    });

    afterEach(() => {
      validateSpy.mockRestore();
      executeCommandsSpy.mockRestore();
    });

    const createDataGridWithAIAssistant = async (): Promise<{
      instance: DataGridInstance;
      getLastCallbacks: () => RequestCallbacks<ExecuteGridAssistantCommandResult>;
    }> => {
      const { aiIntegration, getLastCallbacks } = createMockAIIntegration();

      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1' },
          { id: 2, name: 'Name 2' },
        ],
        columns: [
          { dataField: 'id', caption: 'ID', dataType: 'number' },
          { dataField: 'name', caption: 'Name', dataType: 'string' },
        ],
        aiAssistant: { enabled: true, aiIntegration, title: 'AI Assistant' },
      });

      // Open the AI assistant popup so Chat renders into the DOM
      const viewController = instance.getController('aiAssistantViewController');

      await viewController.toggle();
      jest.runAllTimers();

      return { instance, getLastCallbacks };
    };

    const sendAIRequest = (
      instance: DataGridInstance,
      text: string,
    ): void => {
      const controller = instance.getController('aiAssistant');

      controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text,
        timestamp: new Date().toISOString(),
      } as Message).catch(() => {});
      jest.runAllTimers();
    };

    it('should render pending message after sendRequestToAI', async () => {
      const { instance } = await createDataGridWithAIAssistant();

      sendAIRequest(instance, 'Sort by Name');

      const $messages = findMessageElements();

      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Pending);
    });

    it('should render success message with command list after AI completes', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAIAssistant();

      sendAIRequest(instance, 'Sort by Name');

      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sort', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      const $messages = findMessageElements();

      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Success);

      const $commandItems = $messages.eq(0).find(`.${CLASSES.actionListItem}`);

      expect($commandItems.length).toBe(1);
      expect($commandItems.find(`.${CLASSES.actionListItemText}`).text())
        .toBe('Sorted by Name ascending');
    });

    it('should render failure message with error text after AI errors', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAIAssistant();

      sendAIRequest(instance, 'Sort by Name');

      getLastCallbacks().onError?.(new Error('Network error'));
      await flushAsync();

      const $messages = findMessageElements();

      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Failure);
      expect($messages.eq(0).find(`.${CLASSES.messageErrorText}`).text())
        .toBe('Network error');
    });

    it('should render multiple messages with correct statuses after sequential requests', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAIAssistant();

      // First request
      sendAIRequest(instance, 'Sort by Name');

      const firstCallbacks = getLastCallbacks();

      firstCallbacks.onComplete?.({
        actions: [{ name: 'sort', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      // Second request
      sendAIRequest(instance, 'Filter by Status');

      const $messages = findMessageElements();

      expect($messages.length).toBe(2);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Success);
      expect($messages.eq(0).find(`.${CLASSES.actionListItem}`).length).toBe(1);
      expect(getMessageStatusClass($messages.eq(1))).toBe(MessageStatus.Pending);
    });

    it('should only re-render the updated message', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAIAssistant();

      // First request — complete it
      sendAIRequest(instance, 'Sort by Name');

      const firstCallbacks = getLastCallbacks();

      firstCallbacks.onComplete?.({
        actions: [{ name: 'sort', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      // Second request — pending
      sendAIRequest(instance, 'Filter by Status');

      const $messagesBefore = findMessageElements();

      expect($messagesBefore.length).toBe(2);

      const firstMessageNode = $messagesBefore.get(0);

      // Complete second request — only message 2 should re-render
      const secondCallbacks = getLastCallbacks();

      secondCallbacks.onComplete?.({
        actions: [{ name: 'filter', args: { column: 'Status' } }],
      });
      await flushAsync();
      await flushAsync();

      const $messagesAfter = findMessageElements();

      expect($messagesAfter.length).toBe(2);
      expect($messagesAfter.get(0)).toBe(firstMessageNode);
      expect(getMessageStatusClass($messagesAfter.eq(1)))
        .toBe(MessageStatus.Success);
    });

    it('should clear all messages when clear chat button is clicked', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAIAssistant();

      sendAIRequest(instance, 'Sort by Name');

      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sort', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      expect(findMessageElements().length).toBe(1);

      const clearButtonEl = document.querySelector(`.${CLASSES.clearChatButton} .dx-button`) as HTMLElement;

      clearButtonEl.click();
      await flushAsync();
      await flushAsync();

      expect(findMessageElements().length).toBe(0);
    });

    it('should render abort message after closing and reopening AI chat', async () => {
      const { instance } = await createDataGridWithAIAssistant();

      sendAIRequest(instance, 'Sort by Name');

      expect(findMessageElements().length).toBe(1);
      expect(getMessageStatusClass(findMessageElements().eq(0))).toBe(MessageStatus.Pending);

      const viewController = instance.getController('aiAssistantViewController');

      // Close the AI assistant popup — triggers confirm dialog because request is processing.
      // toggle() rejects with undefined when onHiding cancels the hide.
      await viewController.toggle().catch(() => {});
      jest.runAllTimers();
      await flushAsync();

      // Confirm abort by clicking "Yes" in the confirmation dialog
      const confirmDialogSelector = '.dx-datagrid-ai-assistant-confirm-dialog';
      const yesButton = document.querySelectorAll(`${confirmDialogSelector} .dx-button`)[1] as HTMLElement;

      yesButton.click();
      jest.runAllTimers();
      await flushAsync();

      // Reopen the AI assistant popup
      await viewController.toggle();
      jest.runAllTimers();
      await flushAsync();

      const $messages = findMessageElements();

      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Failure);
      expect($messages.eq(0).find(`.${CLASSES.messageErrorText}`).text())
        .toBe('Request stopped.');
    });

    it('should reset message to pending state when regenerate button is clicked', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAIAssistant();

      sendAIRequest(instance, 'Sort by Name');

      getLastCallbacks().onError?.(new Error('Network error'));
      await flushAsync();

      const $messagesBefore = findMessageElements();

      expect($messagesBefore.length).toBe(1);
      expect(getMessageStatusClass($messagesBefore.eq(0))).toBe(MessageStatus.Failure);

      const regenerateButton = $messagesBefore.eq(0)
        .find(`.${CLASSES.messageRegenerateButton}`).get(0) as HTMLElement;

      expect(regenerateButton).toBeTruthy();

      regenerateButton.click();
      jest.runAllTimers();
      await flushAsync();

      const $messagesAfter = findMessageElements();

      expect($messagesAfter.length).toBe(1);
      expect(getMessageStatusClass($messagesAfter.eq(0))).toBe(MessageStatus.Pending);
    });

    it('should complete regenerated message as success after regenerate and AI response', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAIAssistant();

      sendAIRequest(instance, 'Sort by Name');

      getLastCallbacks().onError?.(new Error('Network error'));
      await flushAsync();

      const regenerateButton = findMessageElements().eq(0)
        .find(`.${CLASSES.messageRegenerateButton}`).get(0) as HTMLElement;

      regenerateButton.click();
      jest.runAllTimers();
      await flushAsync();

      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sort', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      const $messages = findMessageElements();

      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Success);
    });
  });

  describe('manual store push', () => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let validateSpy;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let executeCommandsSpy;

    beforeEach(() => {
      validateSpy = jest.spyOn(GridCommands.prototype, 'validate')
        .mockReturnValue(true);
      executeCommandsSpy = jest.spyOn(GridCommands.prototype, 'executeCommands')
        .mockResolvedValue([
          { status: 'success', message: 'Done' },
        ] as CommandResult[]);
    });

    afterEach(() => {
      validateSpy.mockRestore();
      executeCommandsSpy.mockRestore();
    });

    it('should not throw error when user message is manually pushed to the message store', async () => {
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let chatStore;
      const { aiIntegration } = createMockAIIntegration();

      await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1' },
        ],
        columns: [
          { dataField: 'id', caption: 'ID', dataType: 'number' },
          { dataField: 'name', caption: 'Name', dataType: 'string' },
        ],
        aiAssistant: {
          enabled: true,
          aiIntegration,
          chat: {
            user: { id: 'user' },
            onInitialized: (e) => {
              chatStore = e.component?.getDataSource().store();
            },
          },
          popup: {
            visible: true,
          },
        },
      });

      try {
        chatStore.push([{
          type: 'insert',
          data: {
            id: 'manual-msg-1',
            author: { id: 'user', name: 'User' },
            text: 'Sort by name',
            timestamp: new Date().toISOString(),
          },
        }]);

        await flushAsync();
        await flushAsync();
      } catch (error) {
        expect(error).toBeUndefined(); // Force fail if error is thrown
      }

      expect(true).toBe(true);
    });
  });
});
