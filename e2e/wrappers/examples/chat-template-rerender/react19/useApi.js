import { useCallback } from 'react';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import {
  assistant, REGENERATION_TEXT, getMessageId,
} from './data';

export function* aiResponseGen() {
  yield 'How can I help you?';
  yield 'In other words, what do you want?';
}
const store = [];
const aiResponse = aiResponseGen();
const customStore = new CustomStore({
  key: 'id',
  load: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([...store]);
      }, 0);
    }),
  insert: (message) =>
    new Promise((resolve) => {
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
const dataItemToMessage = (item) => ({
  role: item.author.id,
  content: item.text,
});
const getMessageHistory = () => [...dataSource.items()].map(dataItemToMessage);
export const useApi = () => {
  const insertMessage = useCallback((data) => {
    dataSource.store().push([{ type: 'insert', data }]);
  }, []);
  const updateLastMessageContent = useCallback((text) => {
    const lastMessage = dataSource.items().at(-1);
    dataSource.store().push([
      {
        type: 'update',
        key: lastMessage.id,
        data: { text },
      },
    ]);
  }, []);
  const fetchAIResponse = useCallback(
    async() => {
      const response = aiResponse.next().value;
      await new Promise((r) => setTimeout(r, 500));
      insertMessage({
        id: getMessageId(),
        timestamp: new Date(),
        author: assistant,
        text: response,
      });
    },
    [insertMessage],
  );
  const regenerateLastAIResponse = useCallback(async() => {
    const messageHistory = getMessageHistory();
    updateLastMessageContent(REGENERATION_TEXT);
    try {
      const response = aiResponse.next().value;
      await new Promise((r) => setTimeout(r, 500));
      updateLastMessageContent(response);
    } catch {
      updateLastMessageContent(messageHistory.at(-1).content);
    }
  }, [updateLastMessageContent]);
  return {
    insertMessage,
    fetchAIResponse,
    regenerateLastAIResponse,
  };
};
