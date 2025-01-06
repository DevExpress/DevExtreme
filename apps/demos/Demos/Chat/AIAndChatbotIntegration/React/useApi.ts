import { useCallback, useState } from 'react';
import { AzureOpenAI, OpenAI } from 'openai';
import { ChatTypes } from 'devextreme-react/chat';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import {
  ALERT_TIMEOUT, assistant,
  AzureOpenAIConfig, REGENERATION_TEXT,
} from './data.ts';

type Message = (OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionAssistantMessageParam) & {
  content: string;
};

const chatService = new AzureOpenAI(AzureOpenAIConfig);

const wait = (delay: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

export async function getAIResponse(messages: Message[], delay?: number): Promise<string> {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_tokens: 1000,
    temperature: 0.7,
  };

  const response = await chatService.chat.completions.create(params);
  const data = { choices: response.choices };

  if (delay) {
    await wait(delay);
  }

  return data.choices[0].message?.content;
}

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

const dataItemToMessage = (item: ChatTypes.Message): Message => ({
  role: item.author.id as Message['role'],
  content: item.text,
});

const getMessageHistory = (): Message[] => [...dataSource.items()].map(dataItemToMessage);

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

  const alertLimitReached = useCallback((): void => {
    setAlerts([{
      message: 'Request limit reached, try again in a minute.',
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
    } catch {
      alertLimitReached();
    }
  }, [alertLimitReached, insertMessage]);

  const regenerateLastAIResponse = useCallback(async (): Promise<void> => {
    const messageHistory = getMessageHistory();
    updateLastMessageContent(REGENERATION_TEXT);

    try {
      const aiResponse = await getAIResponse(messageHistory.slice(0, -1));

      updateLastMessageContent(aiResponse);
    } catch {
      updateLastMessageContent(messageHistory.at(-1).content);
      alertLimitReached();
    }
  }, [alertLimitReached, updateLastMessageContent]);

  return {
    alerts,
    insertMessage,
    fetchAIResponse,
    regenerateLastAIResponse,
  };
};
