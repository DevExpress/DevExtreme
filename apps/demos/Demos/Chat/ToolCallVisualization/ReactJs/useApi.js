import { useCallback, useState } from 'react';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import { ALERT_TIMEOUT, assistant } from './data.js';
import { getAIResponse, SYSTEM_PROMPT } from './service.js';

const store = [];
let history = [{ role: 'system', content: SYSTEM_PROMPT }];
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
const getErrorMessage = (err) => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Unknown error';
};
export const useApi = () => {
  const [alerts, setAlerts] = useState([]);
  const insertMessage = useCallback((data) => {
    dataSource.store().push([{ type: 'insert', data }]);
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
      const historyLength = history.length;
      history.push({ role: 'user', content: message.text ?? '' });
      try {
        const { text, toolCalls } = await getAIResponse(history);
        history.push({ role: 'assistant', content: text });
        insertMessage({
          id: Date.now(),
          timestamp: new Date(),
          author: assistant,
          text,
          ...(toolCalls.length ? { toolCalls } : {}),
        });
      } catch (err) {
        history.length = historyLength;
        alertError(getErrorMessage(err));
      }
    },
    [alertError, insertMessage],
  );
  const clearMessages = useCallback(() => {
    store.length = 0;
    history = [{ role: 'system', content: SYSTEM_PROMPT }];
    setAlerts([]);
    dataSource.reload();
  }, []);
  return {
    alerts,
    insertMessage,
    fetchAIResponse,
    clearMessages,
  };
};
