const deployment = 'demo-mini';
const apiVersion = '2024-02-01';
const endpoint = 'https://public-api.devexpress.com/demo-openai';
const apiKey = 'DEMO';
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
    description: 'What is DevExtreme and how can it help me build modern web apps?',
    prompt: 'What is DevExtreme, and which components and frameworks does it support?',
  },
  {
    title: '🚀 Get Started with DevExtreme',
    description: 'How do I get started with DevExtreme in my project?',
    prompt: 'How can I get started with DevExtreme? Include instructions for library installation, linking required CSS/assets, applying an application theme, and coding a simple working app.',
  },
  {
    title: '📄 DevExtreme Licensing',
    description: 'What are the licensing options for DevExtreme?',
    prompt: 'Which DevExtreme license do I need for a commercial project? What licensing options are available?',
  },
];
