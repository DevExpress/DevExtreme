import {
  describe, expect, it,
} from '@jest/globals';
import type { Message } from '@js/ui/chat';

import { AI_ASSISTANT_AUTHOR_ID, MessageStatus } from '../const';
import {
  getMessageStatus,
  hasAbortedCommands,
  hasCommandErrors,
  isAIMessage,
  isChatOptions,
  isEnabledOption,
  isPopupOptions,
  isTitleOption,
} from '../utils';

describe('isAIMessage', () => {
  it('should return true for message with assistant author id', () => {
    const message = {
      author: { id: AI_ASSISTANT_AUTHOR_ID },
      text: 'response',
    } as Message;

    expect(isAIMessage(message)).toBe(true);
  });

  it('should return false for message with user author id', () => {
    const message = {
      author: { id: 'user', name: 'User' },
      text: 'request',
    } as Message;

    expect(isAIMessage(message)).toBe(false);
  });

  it('should return false for message without author', () => {
    const message = {
      text: 'request',
    } as Message;

    expect(isAIMessage(message)).toBe(false);
  });
});

describe('isEnabledOption', () => {
  it('should return true for enabled option names', () => {
    expect(isEnabledOption('aiAssistant.enabled', true)).toBe(true);
    expect(isEnabledOption('aiAssistant', {
      enabled: false,
      title: 'AI Assistant',
    })).toBe(true);
  });

  it('should return false for non-enabled option names', () => {
    expect(isEnabledOption('aiAssistant.title', 'Title')).toBe(false);
    expect(isEnabledOption('aiAssistant.popup', {})).toBe(false);
    expect(isEnabledOption('aiAssistant', { title: 'Title' })).toBe(false);
    expect(isEnabledOption('aiAssistant', 'string')).toBe(false);
  });
});

describe('isTitleOption', () => {
  it('should return true for title option names', () => {
    expect(isTitleOption('aiAssistant.title', 'New Title')).toBe(true);
    expect(isTitleOption('aiAssistant', {
      title: 'New Title',
      chat: { speechToTextEnabled: false },
    })).toBe(true);
  });

  it('should return false for non-title option names', () => {
    expect(isTitleOption('aiAssistant.enabled', true)).toBe(false);
    expect(isTitleOption('aiAssistant.chat', {})).toBe(false);
    expect(isTitleOption('aiAssistant', { enabled: true })).toBe(false);
    expect(isTitleOption('aiAssistant', 'string')).toBe(false);
  });
});

describe('isPopupOptions', () => {
  it('should return true for popup option names', () => {
    expect(isPopupOptions('aiAssistant.popup', {})).toBe(true);
    expect(isPopupOptions('aiAssistant.popup.width', 400)).toBe(true);
    expect(isPopupOptions('aiAssistant', { popup: { width: 400 } })).toBe(true);
    expect(isPopupOptions('aiAssistant', {
      popup: { width: 400 },
      title: 'AI Assistant',
    })).toBe(true);
  });

  it('should return false for non-popup option names', () => {
    expect(isPopupOptions('aiAssistant.chat', {})).toBe(false);
    expect(isPopupOptions('aiAssistant.enabled', true)).toBe(false);
    expect(isPopupOptions('aiAssistant', { chat: {} })).toBe(false);
    expect(isPopupOptions('aiAssistant', {
      chat: { showAvatar: false },
      title: 'AI Assistant',
    })).toBe(false);
  });
});

describe('isChatOptions', () => {
  it('should return true for chat option names', () => {
    expect(isChatOptions('aiAssistant.chat', {})).toBe(true);
    expect(isChatOptions('aiAssistant.chat.showAvatar', false)).toBe(true);
    expect(isChatOptions('aiAssistant', { chat: { showAvatar: false } })).toBe(true);
    expect(isChatOptions('aiAssistant', {
      chat: { speechToTextEnabled: false },
      title: 'AI Assistant',
    })).toBe(true);
  });

  it('should return false for non-chat option names', () => {
    expect(isChatOptions('aiAssistant.popup', {})).toBe(false);
    expect(isChatOptions('aiAssistant.enabled', true)).toBe(false);
    expect(isChatOptions('aiAssistant', { popup: {} })).toBe(false);
    expect(isChatOptions('aiAssistant', {
      popup: { width: 400 },
      title: 'AI Assistant',
    })).toBe(false);
  });
});

describe('hasCommandErrors', () => {
  it('should return true when commands contain failure status', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
      { status: 'failure' as const, message: 'Failed' },
    ];

    expect(hasCommandErrors(commands)).toBe(true);
  });

  it('should return false when all commands are successful', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
    ];

    expect(hasCommandErrors(commands)).toBe(false);
  });

  it('should return false when commands is undefined', () => {
    expect(hasCommandErrors(undefined)).toBe(false);
  });

  it('should return false when commands contain only aborted status', () => {
    const commands = [
      { status: 'aborted' as const, message: 'Aborted' },
    ];

    expect(hasCommandErrors(commands)).toBe(false);
  });
});

describe('hasAbortedCommands', () => {
  it('should return true when commands contain aborted status', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
      { status: 'aborted' as const, message: 'Aborted' },
    ];

    expect(hasAbortedCommands(commands)).toBe(true);
  });

  it('should return false when no commands are aborted', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
      { status: 'failure' as const, message: 'Failed' },
    ];

    expect(hasAbortedCommands(commands)).toBe(false);
  });

  it('should return false when commands is undefined', () => {
    expect(hasAbortedCommands(undefined)).toBe(false);
  });
});

describe('getMessageStatus', () => {
  it('should return Success when all commands are successful', () => {
    const commands = [
      { status: 'success' as const, message: 'Sorted' },
      { status: 'success' as const, message: 'Filtered' },
    ];

    expect(getMessageStatus(commands)).toBe(MessageStatus.Success);
  });

  it('should return Failure when commands contain errors', () => {
    const commands = [
      { status: 'success' as const, message: 'Sorted' },
      { status: 'failure' as const, message: 'Failed to filter' },
    ];

    expect(getMessageStatus(commands)).toBe(MessageStatus.Failure);
  });

  it('should return Failure when commands contain aborted items', () => {
    const commands = [
      { status: 'success' as const, message: 'Sorted' },
      { status: 'aborted' as const, message: 'Filter was aborted' },
    ];

    expect(getMessageStatus(commands)).toBe(MessageStatus.Failure);
  });

  it('should return Failure when commands contain both errors and aborted items', () => {
    const commands = [
      { status: 'failure' as const, message: 'Failed' },
      { status: 'aborted' as const, message: 'Aborted' },
    ];

    expect(getMessageStatus(commands)).toBe(MessageStatus.Failure);
  });

  it('should return Success when commands array is empty', () => {
    expect(getMessageStatus([])).toBe(MessageStatus.Success);
  });
});
