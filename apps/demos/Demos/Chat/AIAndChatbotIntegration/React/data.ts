import { ChatTypes } from 'devextreme-react/chat';

const date = new Date();
date.setHours(0, 0, 0, 0);

function getTimestamp(date, offsetMinutes = 0) {
  return date.getTime() + offsetMinutes * 60000;
}

export const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'gpt-4o-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
}

export const REGENERATION_TEXT = 'Regeneration...';

export const user: ChatTypes.User = {
  id: 'user',
};

export const assistant: ChatTypes.User = {
  id: 'assistant',
  name: 'Virtual Assistant',
};
