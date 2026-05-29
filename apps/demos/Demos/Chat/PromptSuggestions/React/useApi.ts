import { useCallback, useState } from 'react';
import type { ChatTypes } from 'devextreme-react/chat';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import {
  ALERT_TIMEOUT,
  assistant,
  SYSTEM_PROMPT,
} from './data.ts';
import { getAIResponse } from './service.ts';
import type { AIMessage } from './service.ts';

const store: ChatTypes.Message[] = [];

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

const dataItemToMessage = (item: ChatTypes.Message): AIMessage => ({
  role: item.author?.id as AIMessage['role'],
  content: item.text,
});

const getMessageHistory = (): AIMessage[] => [...dataSource.items()].map(dataItemToMessage);

export const useApi = () => {
  const [alerts, setAlerts] = useState<ChatTypes.Alert[]>([]);

  const insertMessage = useCallback((data: ChatTypes.Message): void => {
    dataSource.store().push([{ type: 'insert', data }]);
  }, []);

  const alertLimitReached = useCallback((): void => {
    setAlerts([{
      message: 'Request limit reached, try again in a minute.',
    }]);

    setTimeout(() => {
      setAlerts([]);
    }, ALERT_TIMEOUT);
  }, []);

  const fetchAIResponse = useCallback(async (message: ChatTypes.Message): Promise<void> => {
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
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
    } catch {
      alertLimitReached();
    }
  }, [alertLimitReached, insertMessage]);

  return {
    alerts,
    insertMessage,
    fetchAIResponse,
  };
};
