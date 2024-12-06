import { ChatTypes } from 'devextreme-react/chat';

const date = new Date();
date.setHours(0, 0, 0, 0);

export const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'gpt-4o-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
}

export const REGENERATION_TEXT = 'Regeneration...';
export const CHAT_DISABLED_CLASS = 'dx-chat-disabled';
export const ALERT_TIMEOUT = 1000 * 60;

export const user: ChatTypes.User = {
  id: 'user',
};

export const assistant: ChatTypes.User = {
  id: 'assistant',
  name: 'Virtual Assistant',
};
