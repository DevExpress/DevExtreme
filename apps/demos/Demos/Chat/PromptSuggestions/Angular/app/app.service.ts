import { Injectable, inject, signal } from '@angular/core';
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
If asked about orders, generate realistic and consistent mock data.
Use plausible order IDs, dates within the last 30 days, and the following order status values: Processing, Shipped, In Transit, Out for Delivery, Delivered.
Never add details outside of given parameters. Do NOT create links.
Keep responses structured and professional.
When appropriate, use bullet points.

The user has exactly 3 recent orders:
- #A48291 (In Transit)
- #A47903 (Delivered Feb 8)
- #A47188 (Processing)

Favorite items (example, do NOT use real brand names):
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

AquaCarry Stainless Steel Bottle (20 oz, Sage)
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
  private readonly aiService = inject(AiService);

  readonly user: DxChatTypes.User = { id: 'user' };

  private readonly assistant: DxChatTypes.User = {
    id: 'assistant',
    name: 'AI Assistant',
  };

  private store: any[] = [];

  private messages: AIMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  readonly suggestionItems = suggestionItems;

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
        'dxChat-emptyListPrompt': 'Your Shopping AI Assistant is ready to help. Ask a question or choose one of the suggested prompts to get started.',
        'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
      },
    };
  }

  insertMessage(message: DxChatTypes.Message): void {
    this.dataSource.store().push([{ type: 'insert', data: message }]);
  }

  async processMessageSending(message: DxChatTypes.Message): Promise<void> {
    this.messages.push({ role: 'user', content: message.text });
    this.typingUsersState.set([this.assistant]);

    try {
      const aiResponse = await this.aiService.getAIResponse(this.messages) as string;

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

  private renderAssistantMessage(text: string): void {
    this.insertMessage({
      id: Date.now(),
      timestamp: new Date(),
      author: this.assistant,
      text,
    });
  }

  private alertError(message: string): void {
    this.setAlerts([{ message }]);

    setTimeout(() => {
      this.setAlerts([]);
    }, ALERT_TIMEOUT);
  }

  private setAlerts(alerts: DxChatTypes.Alert[]): void {
    this.alertsState.set(alerts);
  }

  clearMessages(): void {
    this.store = [];
    this.messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    this.setAlerts([]);
    this.typingUsersState.set([]);
    this.dataSource.reload();
  }

  async onMessageEntered({ message }: DxChatTypes.MessageEnteredEvent): Promise<void> {
    this.insertMessage({ id: Date.now(), ...message });

    if (!this.alerts().length) {
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
