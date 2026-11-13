import { CustomStore, DataSource } from 'devextreme-vue/common/data';
import { type DxChatTypes } from 'devextreme-vue/chat';

export interface ToolImplementationArgs {
  city?: string;
  locations?: string[];
  fromCurrency?: string;
  toCurrency?: string;
}

export const dictionary = {
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt': 'Click a tile below to call a function.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
};

export const ALERT_TIMEOUT = 1000 * 60;
export const MAX_TOOL_ROUNDS = 3;
export const TOOL_DELAY = 700;
export const TOOL_ERROR_TEXT = 'Failed to execute the tool';

export const user: DxChatTypes.User = {
  id: 'user',
};

export const assistant: DxChatTypes.User = {
  id: 'assistant',
  name: 'AI Assistant',
  avatarUrl: '../../../../images/Chat/ai-assistant-avatar.svg',
};

export const suggestionCards = [
  {
    title: 'Single Tool',
    description: 'Find out the current time in Barcelona and Los Angeles offices.',
    prompt: 'Check the current time in Barcelona, Spain and Los Angeles, US.',
  },
  {
    title: 'Multiple Tools',
    description: 'Check the current weather and time in Barcelona. Look up USD-to-EUR exchange rate.',
    prompt: 'Check the current weather conditions in Barcelona, Spain, the current time in Barcelona, Spain, and the exchange rate from USD to EUR.',
  },
  {
    title: 'Error State',
    description: 'Check the weather in London and Atlantis. The request for Atlantis fails.',
    prompt: 'Check the current weather conditions in London, UK and in Atlantis, Atlantis.',
  },
];

export const SYSTEM_PROMPT = `
You are a helpful assistant.
Use the tools to answer questions about the weather, the current time in offices, and exchange rates.
Always call a tool instead of guessing.
Pass the country as a short name (such as UK or US), cities without the country, and currencies as ISO codes.
When a question needs several tools, call all of them at once.
If a tool fails, say so briefly.
Keep answers short.
`;

export const tools = [
  {
    type: 'function',
    function: {
      name: 'getWeather',
      description: 'Get the current weather for a city',
      parameters: {
        type: 'object',
        properties: {
          country: { type: 'string', description: 'The short country name, such as UK or US' },
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
          locations: { type: 'array', items: { type: 'string' }, description: 'City names without the country, such as Barcelona' },
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
] as const;

const weatherByCity: Record<string, string> = {
  'london': '15°C (59°F)',
  'barcelona': '21°C (70°F)',
  'los angeles': '24°C (75°F)',
  'new york': '12°C (54°F)',
};

const timeByCity: Record<string, string> = {
  'london': '09:18 (UTC+00:00) Greenwich Mean Time',
  'barcelona': '10:18 (UTC+01:00) Central European Time',
  'los angeles': '01:18 (UTC−08:00) Pacific Time (US & Canada)',
  'new york': '04:18 (UTC−05:00) Eastern Time (US & Canada)',
};

const dollarRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
};

export const toolImplementations: Record<string, (args: ToolImplementationArgs) => string> = {
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

const store: DxChatTypes.Message[] = [];

const customStore = new CustomStore<DxChatTypes.Message>({
  key: 'id',
  load: () => new Promise((resolve) => {
    setTimeout(() => {
      resolve([...store]);
    }, 0);
  }),
  insert: (message: DxChatTypes.Message) => new Promise((resolve) => {
    setTimeout(() => {
      store.push(message);
      resolve(message);
    });
  }),
});

export const dataSource = new DataSource({
  store: customStore,
  paginate: false,
});

export function clearStore() {
  store.length = 0;
  dataSource.reload();
}
