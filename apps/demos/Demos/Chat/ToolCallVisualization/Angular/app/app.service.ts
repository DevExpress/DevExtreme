import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { DataSource, CustomStore } from 'devextreme-angular/common/data';
import { AiService, type AIMessage } from './ai/ai.service';

const ALERT_TIMEOUT = 1000 * 60;
const MAX_TOOL_ROUNDS = 3;
const TOOL_DELAY = 700;
const TOOL_ERROR_TEXT = 'Failed to execute the tool';
const SYSTEM_PROMPT = `
You are a helpful assistant.
Use the tools to answer questions about the weather, the current time in offices, and exchange rates.
Always call a tool instead of guessing.
Pass the country as a short name (such as UK or US), cities without the country, and currencies as ISO codes.
When a question needs several tools, call all of them at once.
If a tool fails, say so briefly.
Keep answers short.
`;
const assistantAvatarSvg = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="url(#paint0_linear_24596_2825)"/><mask id="mask0_24596_2825" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32"><circle cx="16" cy="16" r="16" fill="white"/></mask><g mask="url(#mask0_24596_2825)"><path d="M18 11.5C17.4477 11.5 17 11.9477 17 12.5C17 13.0523 17.4477 13.5 18 13.5C18.5523 13.5 19 13.0523 19 12.5C19 11.9477 18.5523 11.5 18 11.5ZM13 12.5C13 11.9477 13.4477 11.5 14 11.5C14.5523 11.5 15 11.9477 15 12.5C15 13.0523 14.5523 13.5 14 13.5C13.4477 13.5 13 13.0523 13 12.5ZM16.5 8.5C16.5 8.22386 16.2761 8 16 8C15.7239 8 15.5 8.22386 15.5 8.5V9H12.5C11.6716 9 11 9.67157 11 10.5V14.5C11 15.3284 11.6716 16 12.5 16H19.5C20.3284 16 21 15.3284 21 14.5V10.5C21 9.67157 20.3284 9 19.5 9H16.5V8.5ZM12.5 10H19.5C19.7761 10 20 10.2239 20 10.5V14.5C20 14.7761 19.7761 15 19.5 15H12.5C12.2239 15 12 14.7761 12 14.5V10.5C12 10.2239 12.2239 10 12.5 10ZM16.25 23.9984C18.8656 23.9649 20.4449 23.4031 21.3718 22.5574C22.247 21.7588 22.4607 20.7813 22.4947 20.0019H22.5V19.3124C22.5 18.3131 21.69 17.5031 20.6907 17.5031H17.5V17.5H14.5V17.5031H11.3093C10.31 17.5031 9.5 18.3131 9.5 19.3124V20.0019H9.50533C9.53931 20.7813 9.75297 21.7588 10.6282 22.5574C11.5551 23.4031 13.1344 23.9649 15.75 23.9984V24H16.25V23.9984ZM11.3093 18.5031H20.6907C21.1377 18.5031 21.5 18.8654 21.5 19.3124V19.75C21.5 20.4396 21.3688 21.2064 20.6978 21.8187C20.0103 22.446 18.6605 23 16 23C13.3395 23 11.9897 22.446 11.3022 21.8187C10.6312 21.2064 10.5 20.4396 10.5 19.75V19.3124C10.5 18.8654 10.8623 18.5031 11.3093 18.5031Z" fill="white"/></g><defs><linearGradient id="paint0_linear_24596_2825" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#0084F8"/><stop offset="1" stop-color="#0F6CBD"/></linearGradient></defs></svg>';

interface SuggestionCard {
  title: string;
  description: string;
  prompt: string;
}

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
];

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

const toolImplementations: Record<string, (args: any) => string> = {
  getWeather: ({ city }) => {
    const weather = weatherByCity[String(city).toLowerCase()];

    if (!weather) {
      throw new Error(TOOL_ERROR_TEXT);
    }

    return weather;
  },
  getCurrentTime: ({ locations }) => (locations ?? [])
    .map((location: string) => `${location}: ${timeByCity[String(location).toLowerCase()] ?? 'unknown time zone'}`)
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

@Injectable({
  providedIn: 'root',
})

export class AppService {
  aiService: AiService;

  user: DxChatTypes.User = {
    id: 'user',
  };

  assistant: DxChatTypes.User = {
    id: 'assistant',
    name: 'AI Assistant',
    avatarUrl: `data:image/svg+xml;utf8,${encodeURIComponent(assistantAvatarSvg)}`,
  };

  suggestionCards: SuggestionCard[] = [
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

  store: DxChatTypes.Message[] = [];

  messages: AIMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];

  alerts: DxChatTypes.Alert[] = [];

  customStore: CustomStore;

  dataSource: DataSource;

  isProcessing = false;

  typingUsersSubject: BehaviorSubject<DxChatTypes.User[]> = new BehaviorSubject([]);

  alertsSubject: BehaviorSubject<DxChatTypes.Alert[]> = new BehaviorSubject([]);

  constructor(aiService: AiService) {
    this.aiService = aiService;
    this.initDataSource();
  }

  get typingUsers$(): Observable<DxChatTypes.User[]> {
    return this.typingUsersSubject.asObservable();
  }

  get alerts$(): Observable<DxChatTypes.Alert[]> {
    return this.alertsSubject.asObservable();
  }

  getDictionary() {
    return {
      en: {
        'dxChat-emptyListMessage': 'Chat is Empty',
        'dxChat-emptyListPrompt': 'Click a tile below to call a function.',
        'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
      },
    };
  }

  initDataSource() {
    this.customStore = new CustomStore({
      key: 'id',
      load: () => new Promise((resolve) => {
        setTimeout(() => {
          resolve([...this.store]);
        }, 0);
      }),
      insert: (message) => new Promise((resolve) => {
        setTimeout(() => {
          this.store.push(message);
          resolve(message);
        });
      }),
    });

    this.dataSource = new DataSource({
      store: this.customStore,
      paginate: false,
    });
  }

  static wait(delay: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  async runTool(call: { id: string; function: { name: string; arguments: string } }): Promise<DxChatTypes.ToolCall> {
    const { name } = call.function;
    let args: Record<string, unknown> = {};

    try {
      args = JSON.parse(call.function.arguments || '{}');
    } catch {
      args = {};
    }

    await AppService.wait(TOOL_DELAY);

    try {
      const implementation = toolImplementations[name];

      if (!implementation) {
        throw new Error(TOOL_ERROR_TEXT);
      }

      return {
        name, arguments: args, status: 'success', result: implementation(args),
      };
    } catch (err: unknown) {
      return {
        name, arguments: args, status: 'error', result: this.getErrorMessage(err),
      };
    }
  }

  async getAIResponse(
    messageList: AIMessage[],
    toolCalls: DxChatTypes.ToolCall[] = [],
    round = 0,
  ): Promise<{ text: string; toolCalls: DxChatTypes.ToolCall[] }> {
    const answer = await this.aiService.requestModel(messageList, tools);
    const calls = (answer.tool_calls ?? []).filter(({ type }) => type === 'function') as any[];

    if (!calls.length) {
      return { text: answer.content ?? '', toolCalls };
    }

    if (round === MAX_TOOL_ROUNDS) {
      throw new Error('The model requested too many tool calls. Try rephrasing your request.');
    }

    messageList.push({
      role: 'assistant',
      content: answer.content,
      tool_calls: calls,
    });

    const results = await Promise.all(calls.map((call) => this.runTool(call)));

    results.forEach((result, index) => {
      messageList.push({
        role: 'tool',
        tool_call_id: calls[index].id,
        content: result.status === 'error' ? `Error: ${result.result}` : result.result as string,
      });
    });

    return this.getAIResponse(messageList, [...toolCalls, ...results], round + 1);
  }

  async processMessageSending(message: DxChatTypes.TextMessage) {
    this.isProcessing = true;

    const historyLength = this.messages.length;

    this.messages.push({ role: 'user', content: message.text ?? '' });
    this.typingUsersSubject.next([this.assistant]);

    try {
      const { text, toolCalls } = await this.getAIResponse(this.messages);

      this.typingUsersSubject.next([]);
      this.messages.push({ role: 'assistant', content: text });
      this.renderAssistantMessage(text, toolCalls);
    } catch (err: unknown) {
      this.typingUsersSubject.next([]);
      this.messages.length = historyLength;
      this.alertError(this.getErrorMessage(err));
    } finally {
      this.isProcessing = false;
    }
  }

  getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'Unknown error';
  }

  renderAssistantMessage(text: string, toolCalls: DxChatTypes.ToolCall[]) {
    const message: DxChatTypes.TextMessage = {
      id: Date.now(),
      timestamp: new Date(),
      author: this.assistant,
      text,
    };

    if (toolCalls.length) {
      message.toolCalls = toolCalls;
    }

    this.dataSource.store().push([{ type: 'insert', data: message }]);
  }

  alertError(message: string) {
    this.setAlerts([{
      message,
    }]);

    setTimeout(() => {
      this.setAlerts([]);
    }, ALERT_TIMEOUT);
  }

  setAlerts(alerts: DxChatTypes.Alert[]) {
    this.alerts = alerts;
    this.alertsSubject.next(alerts);
  }

  async sendSuggestion(prompt: string) {
    if (this.isProcessing) {
      return;
    }

    const message: DxChatTypes.TextMessage = {
      id: Date.now(),
      timestamp: new Date(),
      author: this.user,
      text: prompt,
    };

    this.dataSource.store().push([{ type: 'insert', data: message }]);

    if (!this.alerts.length) {
      await this.processMessageSending(message);
    }
  }

  async onMessageEntered({ message }: DxChatTypes.MessageEnteredEvent) {
    if (this.isProcessing) {
      return;
    }

    this.dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

    if (!this.alerts.length) {
      await this.processMessageSending(message as DxChatTypes.TextMessage);
    }
  }

  clearMessages() {
    this.store.length = 0;
    this.messages.length = 1;
    this.setAlerts([]);
    this.typingUsersSubject.next([]);
    this.dataSource.reload();
  }
}
