import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { DataSource, CustomStore } from 'devextreme-angular/common/data';
import { AiService, type AIMessage } from './ai/ai.service';

export const suggestionCards = [
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

interface DelayedRendererOptions {
  delay?: number;
  onRender: (chunk: string) => void;
}

function createDelayedRenderer({ delay = 20, onRender }: DelayedRendererOptions) {
  let queue: string[] = [];
  let rendering = false;

  function processQueue() {
    if (!queue.length) {
      rendering = false;
      return;
    }

    rendering = true;
    const chunk = queue.shift();
    if (chunk !== undefined) {
      onRender(chunk);
    }

    setTimeout(processQueue, delay);
  }

  function pushChunk(chunk: string) {
    queue.push(chunk);

    if (!rendering) {
      processQueue();
    }
  }

  function stop() {
    queue = [];
    rendering = false;
  }

  return { pushChunk, stop };
}

@Injectable()
export class AppService {
  readonly ALERT_TIMEOUT = 1000 * 60;

  readonly user: DxChatTypes.User = { id: 'user' };

  readonly assistant: DxChatTypes.User = { id: 'assistant', name: 'AI Assistant' };

  private store: DxChatTypes.Message[] = [];

  private messages: AIMessage[] = [];

  private abortController: AbortController | null = null;

  private typingUsersSubject = new BehaviorSubject<DxChatTypes.User[]>([]);

  private alertsSubject = new BehaviorSubject<DxChatTypes.Alert[]>([]);

  private isStreamingSubject = new BehaviorSubject<boolean>(false);

  readonly dataSource: DataSource;

  get alerts(): DxChatTypes.Alert[] {
    return this.alertsSubject.getValue();
  }

  get typingUsers$(): Observable<DxChatTypes.User[]> {
    return this.typingUsersSubject.asObservable();
  }

  get alerts$(): Observable<DxChatTypes.Alert[]> {
    return this.alertsSubject.asObservable();
  }

  get isStreaming$(): Observable<boolean> {
    return this.isStreamingSubject.asObservable();
  }

  constructor(private readonly aiService: AiService) {
    const customStore = new CustomStore({
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
      store: customStore,
      paginate: false,
    });
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

  private insertMessage(data: DxChatTypes.Message): void {
    this.dataSource.store().push([{ type: 'insert', data }]);
  }

  private updateMessageText(id: number, text: string): void {
    this.dataSource.store().push([{
      type: 'update',
      key: id,
      data: { text },
    }]);
  }

  private insertAssistantPlaceholder(): number {
    const id = Date.now();
    this.dataSource.store().push([{
      type: 'insert',
      data: {
        id,
        timestamp: new Date(),
        author: this.assistant,
        text: '',
      },
    }]);
    return id;
  }

  private alertLimitReached(): void {
    this.alertsSubject.next([{ message: 'Request limit reached, try again in a minute.' }]);

    setTimeout(() => {
      this.alertsSubject.next([]);
    }, this.ALERT_TIMEOUT);
  }

  stopStreaming(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  async fetchAIResponse(message: DxChatTypes.Message): Promise<void> {
    const dataItemToMessage = (item: DxChatTypes.Message): AIMessage => ({
      role: item.author?.id as AIMessage['role'],
      content: item.text,
    });

    this.messages = [...this.dataSource.items().map(dataItemToMessage), dataItemToMessage(message)];
    this.abortController = new AbortController();

    setTimeout(() => this.isStreamingSubject.next(true), 0);
    this.typingUsersSubject.next([this.assistant]);

    let assistantId: number | undefined;
    let buffer = '';
    let typingCleared = false;

    const delayedRenderer = createDelayedRenderer({
      onRender: (chunk: string) => {
        if (!typingCleared) {
          this.typingUsersSubject.next([]);
          typingCleared = true;
        }

        if (assistantId === undefined) {
          assistantId = this.insertAssistantPlaceholder();
        }

        buffer += chunk;
        this.updateMessageText(assistantId, buffer);
      },
    });

    const onAborted = () => {
      delayedRenderer.stop();
    };

    try {
      await this.aiService.getAIResponseStream(this.messages, {
        onAborted,
        onDelta: delayedRenderer.pushChunk,
        signal: this.abortController.signal,
      });

      this.typingUsersSubject.next([]);
    } catch (e: unknown) {
      this.typingUsersSubject.next([]);

      if ((e as Error)?.name !== 'AbortError' && assistantId !== undefined) {
        this.updateMessageText(assistantId, '');
        this.alertLimitReached();
      }
    } finally {
      this.abortController = null;
      this.isStreamingSubject.next(false);
    }
  }

  onMessageEntered({ message }: DxChatTypes.MessageEnteredEvent): void {
    this.insertMessage({ id: Date.now(), ...message });

    if (!this.alerts.length) {
      this.fetchAIResponse(message);
    }
  }

  sendSuggestion(prompt: string): void {
    const message: DxChatTypes.Message = {
      id: Date.now(),
      timestamp: new Date(),
      author: this.user,
      text: prompt,
    };

    this.insertMessage(message);

    if (!this.alerts.length) {
      this.fetchAIResponse(message);
    }
  }

  convertToHtml(value: string): string {
    return unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMinifyWhitespace)
      .use(rehypeStringify)
      .processSync(value)
      .toString();
  }
}
