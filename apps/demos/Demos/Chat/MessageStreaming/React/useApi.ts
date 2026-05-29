import { useCallback, useRef, useState } from 'react';
import type { ChatTypes } from 'devextreme-react/chat';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import {
  ALERT_TIMEOUT,
  assistant,
} from './data.ts';
import { getAIResponseStream } from './service.ts';
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

interface DelayedRendererOptions {
  delay?: number;
  onRender: (chunk: string) => void;
}

function createDelayedRenderer({ delay = 20, onRender }: DelayedRendererOptions) {
  let queue: string[] = [];
  let rendering = false;

  function processQueue() {
    if (!queue.length) {
      rendering = false;
      return;
    }

    rendering = true;
    const chunk = queue.shift();
    if (chunk !== undefined) {
      onRender(chunk);
    }

    setTimeout(processQueue, delay);
  }

  function pushChunk(chunk: string) {
    queue.push(chunk);

    if (!rendering) {
      processQueue();
    }
  }

  function stop() {
    queue = [];
    rendering = false;
  }

  return { pushChunk, stop };
}

export const useApi = () => {
  const [alerts, setAlerts] = useState<ChatTypes.Alert[]>([]);
  const [typingUsers, setTypingUsers] = useState<ChatTypes.User[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const insertMessage = useCallback((data: ChatTypes.Message): void => {
    dataSource.store().push([{ type: 'insert', data }]);
  }, []);

  const updateMessageText = useCallback((id: number, text: string): void => {
    dataSource.store().push([{
      type: 'update',
      key: id,
      data: { text },
    }]);
  }, []);

  const insertAssistantPlaceholder = useCallback((): number => {
    const id = Date.now();
    dataSource.store().push([{
      type: 'insert',
      data: {
        id,
        timestamp: new Date(),
        author: assistant,
        text: '',
      },
    }]);
    return id;
  }, []);

  const alertLimitReached = useCallback((): void => {
    setAlerts([{
      message: 'Request limit reached, try again in a minute.',
    }]);

    setTimeout(() => {
      setAlerts([]);
    }, ALERT_TIMEOUT);
  }, []);

  const stopStreaming = useCallback((): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const fetchAIResponse = useCallback(async (message: ChatTypes.Message): Promise<void> => {
    const messages = [...getMessageHistory(), dataItemToMessage(message)];
    abortControllerRef.current = new AbortController();

    setTimeout(() => setIsStreaming(true), 0);
    setTypingUsers([assistant]);

    let assistantId: number | undefined;
    let buffer = '';
    let typingCleared = false;

    const delayedRenderer = createDelayedRenderer({
      onRender: (chunk: string) => {
        if (!typingCleared) {
          setTypingUsers([]);
          typingCleared = true;
        }

        if (assistantId === undefined) {
          assistantId = insertAssistantPlaceholder();
        }

        buffer += chunk;
        updateMessageText(assistantId, buffer);
      },
    });

    const onAborted = () => {
      delayedRenderer.stop();
    };

    try {
      await getAIResponseStream(messages, {
        onAborted,
        onDelta: delayedRenderer.pushChunk,
        signal: abortControllerRef.current.signal,
      });

      setTypingUsers([]);
    } catch (e: unknown) {
      setTypingUsers([]);

      if ((e as Error)?.name !== 'AbortError' && assistantId !== undefined) {
        updateMessageText(assistantId, '');
        alertLimitReached();
      }
    } finally {
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, [alertLimitReached, insertAssistantPlaceholder, updateMessageText]);

  return {
    alerts,
    typingUsers,
    isStreaming,
    insertMessage,
    fetchAIResponse,
    stopStreaming,
  };
};
