import type { ChatTypes } from 'devextreme-react/chat';

export const ALERT_TIMEOUT = 1000 * 60;
export const MAX_TOOL_ROUNDS = 3;
export const TOOL_DELAY = 700;
export const TOOL_ERROR_TEXT = 'Failed to execute the tool';

export const user: ChatTypes.User = {
  id: 'user',
};

export const assistant: ChatTypes.User = {
  id: 'assistant',
  name: 'AI Assistant',
  avatarUrl: '../../../../images/Chat/ai-assistant-avatar.svg',
};

export const suggestionCards = [
  {
    title: 'Single Tool',
    description: 'Find out the current time in the Barcelona and Los Angeles offices.',
    prompt: 'Check the current time in Barcelona, Spain and Los Angeles, US.',
  },
  {
    title: 'Multiple Tools',
    description: 'Check the current weather and time in Barcelona and the USD-to-EUR exchange rate.',
    prompt: 'Check the current weather conditions in Barcelona, Spain, the current time in Barcelona, Spain, and the exchange rate from USD to EUR.',
  },
  {
    title: 'Error State',
    description: 'Check the weather in London and in Atlantis. The request for Atlantis fails.',
    prompt: 'Check the current weather conditions in London, UK and in Atlantis, Atlantis.',
  },
];
