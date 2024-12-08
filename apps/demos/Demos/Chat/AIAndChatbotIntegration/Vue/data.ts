import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export const dictionary = {
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt': 'AI Assistant is ready to answer your questions.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
}

export const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'gpt-4o-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
}

export const REGENERATION_TEXT = 'Regeneration...';
export const CHAT_DISABLED_CLASS = 'dx-chat-disabled';
export const ALERT_TIMEOUT = 1000 * 60;

export const user = {
  id: 'c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3',
  name: 'John Doe',
};

export const assistant = {
  id: 'assistant',
  name: 'Virtual Assistant',
};

export const store = [];
export const messages = [];

const customStore = new CustomStore({
  key: 'id',
  load: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...store]);
      }, 0);
    });
  },
  insert: (message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        store.push(message);
        resolve(message);
      });
    });
  },
});

export const dataSource = new DataSource({
  store: customStore,
  paginate: false,
})

export function convertToHtml(value: string) {
  const result = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(value)
      .toString();

  return result;
}
