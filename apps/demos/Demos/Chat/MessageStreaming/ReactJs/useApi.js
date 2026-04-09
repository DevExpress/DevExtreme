import { useCallback, useRef, useState } from 'react';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import { ALERT_TIMEOUT, assistant } from './data.js';
import { getAIResponseStream } from './service.js';

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
function createDelayedRenderer({ delay = 20, onRender }) {
  let queue = [];
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
  function pushChunk(chunk) {
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
  const [alerts, setAlerts] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);
  const insertMessage = useCallback((data) => {
    dataSource.store().push([{ type: 'insert', data }]);
  }, []);
  const updateMessageText = useCallback((id, text) => {
    dataSource.store().push([
      {
        type: 'update',
        key: id,
        data: { text },
      },
    ]);
  }, []);
  const insertAssistantPlaceholder = useCallback(() => {
    const id = Date.now();
    dataSource.store().push([
      {
        type: 'insert',
        data: {
          id,
          timestamp: new Date(),
          author: assistant,
          text: '',
        },
      },
    ]);
    return id;
  }, []);
  const alertLimitReached = useCallback(() => {
    setAlerts([
      {
        message: 'Request limit reached, try again in a minute.',
      },
    ]);
    setTimeout(() => {
      setAlerts([]);
    }, ALERT_TIMEOUT);
  }, []);
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);
  const fetchAIResponse = useCallback(
    async (message) => {
      const messages = [...getMessageHistory(), dataItemToMessage(message)];
      abortControllerRef.current = new AbortController();
      setTimeout(() => setIsStreaming(true), 0);
      setTypingUsers([assistant]);
      let assistantId;
      let buffer = '';
      let typingCleared = false;
      const delayedRenderer = createDelayedRenderer({
        onRender: (chunk) => {
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
      } catch (e) {
        setTypingUsers([]);
        if (e?.name !== 'AbortError' && assistantId !== undefined) {
          updateMessageText(assistantId, '');
          alertLimitReached();
        }
      } finally {
        abortControllerRef.current = null;
        setIsStreaming(false);
      }
    },
    [alertLimitReached, insertAssistantPlaceholder, updateMessageText],
  );
  return {
    alerts,
    typingUsers,
    isStreaming,
    insertMessage,
    fetchAIResponse,
    stopStreaming,
  };
};
