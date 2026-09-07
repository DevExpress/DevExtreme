import { useCallback, useState } from 'react';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import { ALERT_TIMEOUT, assistant, REGENERATION_TEXT } from './data.js';
import { getAIResponse } from './service.js';

const store = [];
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
  role: item.author?.id,
  content: item.text,
});
const getMessageHistory = () => [...dataSource.items()].map(dataItemToMessage);
const getErrorMessage = (err) => {
  if (typeof err === 'object' && err !== null) {
    const e = err;
    if (typeof e.error?.message === 'string') return e.error.message;
    if (typeof e.message === 'string') return e.message;
  }
  if (typeof err === 'string') return err;
  return 'Unknown error';
};
export const useApi = () => {
  const [alerts, setAlerts] = useState([]);
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
  const alertError = useCallback((message) => {
    setAlerts([
      {
        message,
      },
    ]);
    setTimeout(() => {
      setAlerts([]);
    }, ALERT_TIMEOUT);
  }, []);
  const fetchAIResponse = useCallback(
    async (message) => {
      const messages = [...getMessageHistory(), dataItemToMessage(message)];
      try {
        const aiResponse = await getAIResponse(messages, 200);
        insertMessage({
          id: Date.now(),
          timestamp: new Date(),
          author: assistant,
          text: aiResponse,
        });
      } catch (err) {
        alertError(getErrorMessage(err));
      }
    },
    [alertError, insertMessage],
  );
  const regenerateLastAIResponse = useCallback(async () => {
    const messageHistory = getMessageHistory();
    updateLastMessageContent(REGENERATION_TEXT);
    try {
      const aiResponse = await getAIResponse(messageHistory.slice(0, -1));
      if (typeof aiResponse === 'string') {
        updateLastMessageContent(aiResponse);
      }
    } catch (err) {
      updateLastMessageContent(messageHistory.at(-1)?.content);
      alertError(getErrorMessage(err));
    }
  }, [alertError, updateLastMessageContent]);
  return {
    alerts,
    insertMessage,
    fetchAIResponse,
    regenerateLastAIResponse,
  };
};
