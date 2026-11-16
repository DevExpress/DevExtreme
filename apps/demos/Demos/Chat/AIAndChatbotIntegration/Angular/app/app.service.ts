import { Injectable, inject, signal } from '@angular/core';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { DataSource, CustomStore } from 'devextreme-angular/common/data';
import { AiService, type AIMessage } from './ai/ai.service';

@Injectable({
  providedIn: 'root',
})

export class AppService {
  private readonly aiService = inject(AiService);

  readonly REGENERATION_TEXT = 'Regeneration...';

  private readonly ALERT_TIMEOUT = 1000 * 60;

  readonly user: DxChatTypes.User = {
    id: 'user',
  };

  private readonly assistant: DxChatTypes.User = {
    id: 'assistant',
    name: 'Virtual Assistant',
  };

  private store: any[] = [];

  private messages: AIMessage[] = [];

  private readonly customStore = new CustomStore({
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

  readonly dataSource = new DataSource({
    store: this.customStore,
    paginate: false,
  });

  private readonly typingUsersState = signal<DxChatTypes.User[]>([]);

  readonly typingUsers = this.typingUsersState.asReadonly();

  private readonly alertsState = signal<DxChatTypes.Alert[]>([]);

  readonly alerts = this.alertsState.asReadonly();

  getDictionary() {
    return {
      en: {
        'dxChat-emptyListMessage': 'Chat is Empty',
        'dxChat-emptyListPrompt': 'AI Assistant is ready to answer your questions.',
        'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
      },
    };
  }

  private getAIResponse(messages: AIMessage[]): Promise<string> {
    return this.aiService.getAIResponse(messages) as Promise<string>;
  }

  private async processMessageSending(message: DxChatTypes.Message) {
    this.messages.push({ role: 'user', content: message.text });
    this.typingUsersState.set([this.assistant]);

    try {
      const aiResponse = await this.getAIResponse(this.messages);

      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });

      this.typingUsersState.set([]);
      this.messages.push({ role: 'assistant', content: aiResponse });
      this.renderAssistantMessage(aiResponse);
    } catch (err: unknown) {
      this.typingUsersState.set([]);
      this.messages.pop();
      this.alertError(this.getErrorMessage(err));
    }
  }

  private getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'Unknown error';
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

  private renderAssistantMessage(text: string) {
    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: this.assistant,
      text,
    };

    this.dataSource.store().push([{ type: 'insert', data: message }]);
  }

  private alertError(message: string) {
    this.setAlerts([{
      message,
    }]);

    setTimeout(() => {
      this.setAlerts([]);
    }, this.ALERT_TIMEOUT);
  }

  private setAlerts(alerts: DxChatTypes.Alert[]) {
    this.alertsState.set(alerts);
  }

  async regenerate() {
    try {
      this.setAlerts([]);
      const aiResponse = await this.getAIResponse(this.messages.slice(0, -1));

      this.updateLastMessage(aiResponse);
      this.messages.at(-1).content = aiResponse;
    } catch (err: unknown) {
      this.updateLastMessage(this.messages.at(-1).content);
      this.alertError(this.getErrorMessage(err));
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

  clearMessages() {
    this.store = [];
    this.messages = [];
    this.setAlerts([]);
    this.typingUsersState.set([]);
    this.dataSource.reload();
  }

  async onMessageEntered({ message, event }: DxChatTypes.MessageEnteredEvent) {
    this.dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

    if (!this.alerts().length) {
      await this.processMessageSending(message, event);
    }
  }
}
