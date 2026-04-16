import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { DataSource, CustomStore } from 'devextreme-angular/common/data';
import { AiService, type AIMessage } from './ai/ai.service';

const ALERT_TIMEOUT = 1000 * 60;

const suggestionItems = [
  { text: '📦 Track my orders', prompt: 'Track my orders' },
  { text: '⭐ Check in-stock favorites', prompt: 'Check in-stock favorites' },
  { text: '🔄 Start a return', prompt: 'Start a return' },
];

const SYSTEM_PROMPT = `
You are a logistics support assistant for an online marketplace.
The user is logged into their account.
If asked about orders, generate realistic but consistent mock data.
Use plausible order IDs, dates within the last 30 days, and realistic shipment statuses (Processing, Shipped, In Transit, Out for Delivery, Delivered).
Never invent absurd details. Do NOT create links.
Keep responses structured and professional.
When appropriate, use bullet points.

The user has exactly 3 recent orders:
- #A48291 (In Transit)
- #A47903 (Delivered Feb 8)
- #A47188 (Processing)

Favorited items (example, do NOT use real brands):
VoltEdge 65W Fast Wall Charger (Black)
✅ Back in stock — Ships in 1-2 business days

Nimbus Pro Wireless Mouse (Graphite)
❌ Still out of stock — Restock expected Feb 26

PaperLite E-Reader (16 GB, Midnight)
✅ Back in stock — Estimated delivery Feb 20-21

LumaArc Minimal Desk Lamp (Matte Black)
⚠️ Limited stock — Only 3 left

WaveTune Over-Ear Wireless Headphones (Ocean Blue)
❌ Out of stock — No restock date available

AquaCarry Stainless Steel Bottle (600 ml, Sage)
✅ In stock — Available for same-day pick-up

Marketplace Return Policy (Mock)
1. Return Window
  a. Items can be returned within 30 days of delivery.
  b. Returns cannot be started before an item is delivered.

2. Condition Requirements
  a. Items must be unused and in original packaging.
  b. Opened electronics are eligible if returned within 14 days.
  c. Digital products are non-refundable.

3. Refund Method
  a. Refunds are issued to the original payment method.
  b. Processing time: 3-5 business days after inspection.

4. Shipping Fees
  a. Returns due to defective or incorrect items: free.
  b. Returns for change of mind: $4.99 return fee deducted.

5. Exchanges
  a. Exchanges are available for size or color variants only.
  b. If replacement is unavailable, refund is issued instead.
`;

@Injectable({
  providedIn: 'root',
})

export class AppService {
  aiService: AiService;

  user: DxChatTypes.User = { id: 'user' };

  assistant: DxChatTypes.User = {
    id: 'assistant',
    name: 'AI Assistant',
  };

  store: any[] = [];

  messages: AIMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  alerts: DxChatTypes.Alert[] = [];

  suggestionItems = suggestionItems;

  customStore: CustomStore;

  dataSource: DataSource;

  private typingUsersSubject: BehaviorSubject<DxChatTypes.User[]> = new BehaviorSubject([]);

  private alertsSubject: BehaviorSubject<DxChatTypes.Alert[]> = new BehaviorSubject([]);

  constructor(aiService: AiService) {
    this.aiService = aiService;
    this.initDataSource();
    this.typingUsersSubject.next([]);
    this.alertsSubject.next([]);
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
        'dxChat-emptyListPrompt': 'Your Shopping AI Assistant is ready to help. Ask a question or choose one of the suggested prompts to get started.',
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

  insertMessage(message: DxChatTypes.Message): void {
    this.dataSource.store().push([{ type: 'insert', data: message }]);
  }

  async processMessageSending(message: DxChatTypes.Message): Promise<void> {
    this.messages.push({ role: 'user', content: message.text });
    this.typingUsersSubject.next([this.assistant]);

    try {
      const aiResponse = await this.aiService.getAIResponse(this.messages) as string;

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

  renderAssistantMessage(text: string): void {
    this.insertMessage({
      id: Date.now(),
      timestamp: new Date(),
      author: this.assistant,
      text,
    });
  }

  alertLimitReached(): void {
    this.setAlerts([{ message: 'Request limit reached, try again in a minute.' }]);

    setTimeout(() => {
      this.setAlerts([]);
    }, ALERT_TIMEOUT);
  }

  setAlerts(alerts: DxChatTypes.Alert[]): void {
    this.alerts = alerts;
    this.alertsSubject.next(alerts);
  }

  async onMessageEntered({ message }: DxChatTypes.MessageEnteredEvent): Promise<void> {
    this.insertMessage({ id: Date.now(), ...message });

    if (!this.alerts.length) {
      await this.processMessageSending(message);
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
