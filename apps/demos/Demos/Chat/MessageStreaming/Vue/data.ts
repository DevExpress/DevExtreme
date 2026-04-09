import { CustomStore, DataSource } from 'devextreme-vue/common/data';
import { type DxChatTypes } from 'devextreme-vue/chat';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';

export const dictionary = {
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt': 'AI Assistant is ready to answer your questions.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
};

export const ALERT_TIMEOUT = 1000 * 60;

export const user: DxChatTypes.User = {
  id: 'user',
};

export const assistant: DxChatTypes.User = {
  id: 'assistant',
  name: 'AI Assistant',
};

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

export function convertToHtml(value: string): string {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMinifyWhitespace)
    .use(rehypeStringify)
    .processSync(value)
    .toString();
}
