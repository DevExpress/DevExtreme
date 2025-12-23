export const REGENERATION_TEXT = 'Regeneration...';
export const CHAT_DISABLED_CLASS = 'chat-disabled';
export const user = {
  id: 'user',
};
export const assistant = {
  id: 'assistant',
  name: 'Virtual Assistant',
};

let messageId = 0;
export const getMessageId = () => messageId++;