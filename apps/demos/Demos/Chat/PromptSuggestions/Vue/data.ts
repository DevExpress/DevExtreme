import { CustomStore, DataSource } from 'devextreme-vue/common/data';
import { type DxChatTypes } from 'devextreme-vue/chat';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import { type AIMessage } from './service';

export const dictionary = {
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt': 'Your Shopping AI Assistant is ready to help. Ask a question or choose one of the suggested prompts to get started.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
};

export const CHAT_DISABLED_CLASS = 'chat-disabled';
export const ALERT_TIMEOUT = 1000 * 60;

export const user = {
  id: 'user',
};

export const assistant = {
  id: 'assistant',
  name: 'AI Assistant',
};

export const suggestionItems = [
  { text: '📦 Track my orders', prompt: 'Track my orders' },
  { text: '⭐ Check in-stock favorites', prompt: 'Check in-stock favorites' },
  { text: '🔄 Start a return', prompt: 'Start a return' },
];

export const SYSTEM_PROMPT = `
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

export const messages: AIMessage[] = [
  { role: 'system', content: SYSTEM_PROMPT },
];

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

export function convertToHtml(value: string) {
  const result = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMinifyWhitespace)
    .use(rehypeStringify)
    .processSync(value)
    .toString();

  return result;
}
