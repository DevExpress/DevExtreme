import { useCallback, useState } from 'react';
import type { ChatTypes } from 'devextreme-react/chat';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import {
  ALERT_TIMEOUT,
  assistant,
  REGENERATION_TEXT,
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

const getErrorMessage = (err: unknown): string => {
  if (typeof err === 'object' && err !== null) {
    const e = err as { error?: { message?: unknown }; message?: unknown };
    if (typeof e.error?.message === 'string') return e.error.message;
    if (typeof e.message === 'string') return e.message;
  }
  if (typeof err === 'string') return err;
  return 'Unknown error';
};

export const useApi = () => {
  const [alerts, setAlerts] = useState<ChatTypes.Alert[]>([]);

  const insertMessage = useCallback((data: ChatTypes.Message): void => {
    dataSource.store().push([{ type: 'insert', data }]);
  }, []);

  const updateLastMessageContent = useCallback((text: string): void => {
    const lastMessage = dataSource.items().at(-1);

    dataSource.store().push([{
      type: 'update',
      key: lastMessage.id,
      data: { text },
    }]);
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
    const messages = [...getMessageHistory(), dataItemToMessage(message)];

    try {
      const aiResponse = await getAIResponse(messages, 200);

      insertMessage({
        id: Date.now(),
        timestamp: new Date(),
        author: assistant,
        text: aiResponse,
      });
    } catch (err: unknown) {
      alertError(getErrorMessage(err));
    }
  }, [alertError, insertMessage]);

  const regenerateLastAIResponse = useCallback(async (): Promise<void> => {
    const messageHistory = getMessageHistory();
    updateLastMessageContent(REGENERATION_TEXT);

    try {
      const aiResponse = await getAIResponse(messageHistory.slice(0, -1));

      if (typeof aiResponse === 'string') {
        updateLastMessageContent(aiResponse);
      }
    } catch (err: unknown) {
      updateLastMessageContent(messageHistory.at(-1)?.content as string);
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
