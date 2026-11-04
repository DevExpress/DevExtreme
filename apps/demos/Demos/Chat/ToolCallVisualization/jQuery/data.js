const deployment = 'demo-mini';
const apiVersion = '2024-02-01';
const endpoint = 'https://public-api.devexpress.com/demo-openai';
const apiKey = 'DEMO';
const CHAT_DISABLED_CLASS = 'chat-disabled';
const ALERT_TIMEOUT = 1000 * 60;
const MAX_TOOL_ROUNDS = 3;
const TOOL_DELAY = 700;
const TOOL_ERROR_TEXT = 'Failed to execute the tool';
const user = {
  id: 'user',
};
const assistant = {
  id: 'assistant',
  name: 'AI Assistant',
};
const suggestionCards = [
  {
    title: 'Single Tool',
    description: 'Find out the current time in the Barcelona and Los Angeles offices.',
    prompt: 'Check the current time in Barcelona, Spain and Los Angeles, US.',
  },
  {
    title: 'Multiple Tools',
    description: 'Get the current weather and time in Barcelona and the USD to EUR rate.',
    prompt: 'Check the current weather conditions in Barcelona, Spain, the current time in Barcelona, Spain and the exchange rate from USD to EUR.',
  },
  {
    title: 'Error State',
    description: 'Check the weather in London and in Atlantis: one of the tools fails.',
    prompt: 'Check the current weather conditions in London, UK and in Atlantis, Atlantis.',
  },
];
const SYSTEM_PROMPT = `
You are a helpful assistant.
Use the tools to answer questions about the weather, the current time in offices and exchange rates.
Always call a tool instead of guessing.
Pass the country as a short name (for example UK or US), cities without the country, and currencies as ISO codes.
When several tools are needed, call all of them at once.
If a tool fails, say so briefly.
Keep the answers short.
`;
const tools = [
  {
    type: 'function',
    function: {
      name: 'getWeather',
      description: 'Get the current weather for a city',
      parameters: {
        type: 'object',
        properties: {
          country: { type: 'string', description: 'The short country name, for example UK or US' },
          city: { type: 'string', description: 'The city name' },
        },
        required: ['country', 'city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getCurrentTime',
      description: 'Get the current local time in the offices of one or several cities',
      parameters: {
        type: 'object',
        properties: {
          locations: { type: 'array', items: { type: 'string' }, description: 'City names without the country, for example Barcelona' },
        },
        required: ['locations'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getExchangeRate',
      description: 'Get the exchange rate between two currencies',
      parameters: {
        type: 'object',
        properties: {
          fromCurrency: { type: 'string', description: 'The ISO code of the source currency' },
          toCurrency: { type: 'string', description: 'The ISO code of the target currency' },
        },
        required: ['fromCurrency', 'toCurrency'],
      },
    },
  },
];
const weatherByCity = {
  'london': '15°C (59°F)',
  'barcelona': '21°C (70°F)',
  'los angeles': '24°C (75°F)',
  'new york': '12°C (54°F)',
};
const timeByCity = {
  'london': '09:18 (UTC+00:00) Greenwich Mean Time',
  'barcelona': '10:18 (UTC+01:00) Central European Time',
  'los angeles': '01:18 (UTC−08:00) Pacific Time (US & Canada)',
  'new york': '04:18 (UTC−05:00) Eastern Time (US & Canada)',
};
const dollarRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
};
const toolImplementations = {
  getWeather: ({ city }) => {
    const weather = weatherByCity[String(city).toLowerCase()];

    if (!weather) {
      throw new Error(TOOL_ERROR_TEXT);
    }

    return weather;
  },
  getCurrentTime: ({ locations }) => (locations ?? [])
    .map((location) => `${location}: ${timeByCity[String(location).toLowerCase()] ?? 'unknown time zone'}`)
    .join('\n'),
  getExchangeRate: ({ fromCurrency, toCurrency }) => {
    const from = dollarRates[String(fromCurrency).toUpperCase()];
    const to = dollarRates[String(toCurrency).toUpperCase()];

    if (!from || !to) {
      throw new Error(TOOL_ERROR_TEXT);
    }

    const rate = Math.round((to / from) * 10000) / 10000;

    return `1 ${String(fromCurrency).toUpperCase()} = ${rate} ${String(toCurrency).toUpperCase()}`;
  },
};
