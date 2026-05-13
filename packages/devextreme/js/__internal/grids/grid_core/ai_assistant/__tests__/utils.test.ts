import {
  describe, expect, it,
} from '@jest/globals';
import type { Message } from '@js/ui/chat';

import { AI_ASSISTANT_AUTHOR_ID } from '../const';
import {
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
