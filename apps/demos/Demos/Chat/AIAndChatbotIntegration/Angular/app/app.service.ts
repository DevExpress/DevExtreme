import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AzureOpenAI } from 'openai';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import {
  User,
  Alert,
  MessageEnteredEvent,
} from 'devextreme/ui/chat';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

@Injectable({
  providedIn: 'root',
})

export class AppService {
  chatService: AzureOpenAI;

  AzureOpenAIConfig = {
    dangerouslyAllowBrowser: true,
    deployment: 'gpt-4o-mini',
    apiVersion: '2024-02-01',
    endpoint: 'https://public-api.devexpress.com/demo-openai',
    apiKey: 'DEMO',
  };

  REGENERATION_TEXT = 'Regeneration...';

  ALERT_TIMEOUT = 1000 * 60;

  user: User = {
    id: 'user',
  };

  assistant: User = {
    id: 'assistant',
    name: 'Virtual Assistant',
  };

  store: any[] = [];

  messages: any[] = [];

  alerts: Alert[] = [];

  customStore: CustomStore;

  dataSource: DataSource;

  typingUsersSubject: BehaviorSubject<User[]> = new BehaviorSubject([]);

  alertsSubject: BehaviorSubject<Alert[]> = new BehaviorSubject([]);

  constructor() {
    this.chatService = new AzureOpenAI(this.AzureOpenAIConfig);
    this.initDataSource();
    this.typingUsersSubject.next([]);
    this.alertsSubject.next([]);
  }

  get typingUsers$(): Observable<User[]> {
    return this.typingUsersSubject.asObservable();
  }

  get alerts$(): Observable<Alert[]> {
    return this.alertsSubject.asObservable();
  }

  getDictionary() {
    return {
      en: {
        'dxChat-emptyListMessage': 'Chat is Empty',
        'dxChat-emptyListPrompt': 'AI Assistant is ready to answer your questions.',
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

  async getAIResponse(messages) {
    const params = {
      messages,
      model: this.AzureOpenAIConfig.deployment,
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await this.chatService.chat.completions.create(params);
    const data = { choices: response.choices };

    return data.choices[0].message?.content;
  }

  async processMessageSending(message, event) {
    this.messages.push({ role: 'user', content: message.text });
    this.typingUsersSubject.next([this.assistant]);

    try {
      const aiResponse = await this.getAIResponse(this.messages);

      setTimeout(() => {
        this.typingUsersSubject.next([]);
        this.messages.push({ role: 'assistant', content: aiResponse });
        this.renderAssistantMessage(aiResponse);
      }, 200);
    } catch {
      this.typingUsersSubject.next([]);
      this.messages.pop();
      this.alertLimitReached();
    }
  }

  updateLastMessage(text = this.REGENERATION_TEXT) {
    const items = this.dataSource.items();
    const lastMessage = items.at(-1);

    this.dataSource.store().push([{
      type: 'update',
      key: lastMessage.id,
      data: { text },
    }]);
  }

  renderAssistantMessage(text: string) {
    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: this.assistant,
      text,
    };

    this.dataSource.store().push([{ type: 'insert', data: message }]);
  }

  alertLimitReached() {
    this.setAlerts([{
      message: 'Request limit reached, try again in a minute.',
    }]);

    setTimeout(() => {
      this.setAlerts([]);
    }, this.ALERT_TIMEOUT);
  }

  setAlerts(alerts: Alert[]) {
    this.alerts = alerts;
    this.alertsSubject.next(alerts);
  }

  async regenerate() {
    try {
      const aiResponse = await this.getAIResponse(this.messages.slice(0, -1));

      this.updateLastMessage(aiResponse);
      this.messages.at(-1).content = aiResponse;
    } catch {
      this.updateLastMessage(this.messages.at(-1).content);
      this.alertLimitReached();
    }
  }

  convertToHtml(value: string) {
    const result = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMinifyWhitespace)
      .use(rehypeStringify)
      .processSync(value)
      .toString();

    return result;
  }

  async onMessageEntered({ message, event }: MessageEnteredEvent) {
    this.dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

    if (!this.alerts.length) {
      await this.processMessageSending(message, event);
    }
  }
}
