import { useCallback, useState } from 'react';
import type { ChatTypes } from 'devextreme-react/chat';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import { ALERT_TIMEOUT, assistant } from './data.ts';
import { getAIResponse, SYSTEM_PROMPT } from './service.ts';
import type { AIMessage } from './service.ts';

const store: ChatTypes.Message[] = [];
let history: AIMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];

const customStore = new CustomStore({
  key: 'id',
  load: (): Promise<ChatTypes.Message[]> => new Promise((resolve) => {
    setTimeout(() => {
      resolve([...store]);
    }, 0);
  }),
  insert: (message: ChatTypes.Message): Promise<ChatTypes.Message> => new Promise((resolve) => {
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

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Unknown error';
};

export const useApi = () => {
  const [alerts, setAlerts] = useState<ChatTypes.Alert[]>([]);

  const insertMessage = useCallback((data: ChatTypes.Message): void => {
    dataSource.store().push([{ type: 'insert', data }]);
  }, []);

  const alertError = useCallback((message: string): void => {
    setAlerts([{
      message,
    }]);

    setTimeout(() => {
      setAlerts([]);
    }, ALERT_TIMEOUT);
  }, []);

  const fetchAIResponse = useCallback(async (message: ChatTypes.Message): Promise<void> => {
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
    } catch (err: unknown) {
      history.length = historyLength;
      alertError(getErrorMessage(err));
    }
  }, [alertError, insertMessage]);

  const clearMessages = useCallback((): void => {
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
