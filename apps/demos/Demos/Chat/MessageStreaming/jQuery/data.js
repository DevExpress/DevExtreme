const deployment = 'gpt-4o-mini';
const apiVersion = '2024-02-01';
const endpoint = 'https://public-api.devexpress.com/demo-openai';
const apiKey = 'DEMO';
const CHAT_DISABLED_CLASS = 'chat-disabled';
const ALERT_TIMEOUT = 1000 * 60;
const user = {
  id: 'user',
};
const assistant = {
  id: 'assistant',
  name: 'AI Assistant',
};
const suggestionCards = [
  {
    title: '💡 What is DevExtreme?',
    prompt: 'What is DevExtreme and how can it help me build modern web apps?',
  },
  {
    title: '🚀 Get Started with DevExtreme',
    prompt: 'How do I get started with DevExtreme in my project?',
  },
  {
    title: '📄 DevExtreme Licensing',
    prompt: 'What are the licensing options for DevExtreme?',
  },
];
