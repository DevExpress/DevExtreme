import type { ChatTypes } from 'devextreme-react/chat';

export const REGENERATION_TEXT = 'Regeneration...';
export const CHAT_DISABLED_CLASS = 'chat-disabled';
export const ALERT_TIMEOUT = 1000 * 60;

export const user: ChatTypes.User = {
  id: 'user',
};

export const assistant: ChatTypes.User = {
  id: 'assistant',
  name: 'Virtual Assistant',
};
