import { useCallback, useState } from 'react';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import { ALERT_TIMEOUT, assistant, SYSTEM_PROMPT } from './data.js';
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
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...getMessageHistory(),
        dataItemToMessage(message),
      ];
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
  return {
    alerts,
    insertMessage,
    fetchAIResponse,
  };
};
