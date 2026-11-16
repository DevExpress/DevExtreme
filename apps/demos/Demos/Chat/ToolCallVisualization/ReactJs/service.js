import { AzureOpenAI } from 'openai';
import { MAX_TOOL_ROUNDS, TOOL_DELAY, TOOL_ERROR_TEXT } from './data.js';

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};
export const SYSTEM_PROMPT = `
You are a helpful assistant.
Use the tools to answer questions about the weather, the current time in offices, and exchange rates.
Always call a tool instead of guessing.
Pass the country as a short name (such as UK or US), cities without the country, and currencies as ISO codes.
When a question needs several tools, call all of them at once.
If a tool fails, say so briefly.
Keep answers short.
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
          locations: {
            type: 'array',
            items: { type: 'string' },
            description: 'City names without the country, such as Barcelona',
          },
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
const weatherByCity = new Map([
  ['london', '15°C (59°F)'],
  ['barcelona', '21°C (70°F)'],
  ['los angeles', '24°C (75°F)'],
  ['new york', '12°C (54°F)'],
]);
const timeByCity = new Map([
  ['london', '09:18 (UTC+00:00) Greenwich Mean Time'],
  ['barcelona', '10:18 (UTC+01:00) Central European Time'],
  ['los angeles', '01:18 (UTC−08:00) Pacific Time (US & Canada)'],
  ['new york', '04:18 (UTC−05:00) Eastern Time (US & Canada)'],
]);
const dollarRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
};
const toolImplementations = {
  getWeather: ({ city }) => {
    const weather = weatherByCity.get(String(city).toLowerCase());
    if (!weather) {
      throw new Error(TOOL_ERROR_TEXT);
    }
    return weather;
  },
  getCurrentTime: ({ locations }) =>
    (locations ?? [])
      .map(
        (location) =>
          `${location}: ${timeByCity.get(String(location).toLowerCase()) ?? 'unknown time zone'}`,
      )
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
const chatService = new AzureOpenAI(AzureOpenAIConfig);
const wait = (delay) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
async function requestModel(messages) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    tools,
    tool_choice: 'auto',
    max_completion_tokens: 1000,
    temperature: 0.7,
  };
  const response = await chatService.chat.completions.create(params, { maxRetries: 0 });
  return response.choices[0].message;
}
async function runTool(call) {
  const { name } = call.function;
  let args;
  try {
    args = JSON.parse(call.function.arguments || '{}');
  } catch {
    return {
      name,
      arguments: {},
      status: 'error',
      result: 'Invalid tool arguments',
    };
  }
  await wait(TOOL_DELAY);
  try {
    const implementation = toolImplementations[name];
    if (!implementation) {
      throw new Error(TOOL_ERROR_TEXT);
    }
    return {
      name,
      arguments: args,
      status: 'success',
      result: implementation(args),
    };
  } catch (err) {
    return {
      name,
      arguments: args,
      status: 'error',
      result: err.message,
    };
  }
}
export async function getAIResponse(messages, toolCalls = [], round = 0) {
  const answer = await requestModel(messages);
  const calls = (answer.tool_calls ?? []).filter((call) => call.type === 'function');
  if (!calls.length) {
    return { text: answer.content ?? '', toolCalls };
  }
  if (round === MAX_TOOL_ROUNDS) {
    throw new Error('The model requested too many tool calls. Try rephrasing your request.');
  }
  messages.push({
    role: 'assistant',
    content: answer.content,
    tool_calls: calls,
  });
  const results = await Promise.all(calls.map(runTool));
  results.forEach((result, index) => {
    messages.push({
      role: 'tool',
      tool_call_id: calls[index].id,
      content: result.status === 'error' ? `Error: ${result.result}` : String(result.result),
    });
  });
  return getAIResponse(messages, [...toolCalls, ...results], round + 1);
}
