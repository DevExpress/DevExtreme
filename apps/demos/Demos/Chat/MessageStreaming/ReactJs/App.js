import React, { useCallback, useMemo } from 'react';
import Chat from 'devextreme-react/chat';
import { loadMessages } from 'devextreme-react/common/core/localization';
import { user } from './data.js';
import Message from './Message.js';
import EmptyView from './EmptyView.js';
import { dataSource, useApi } from './useApi.js';

loadMessages({
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt': 'AI Assistant is ready to answer your questions.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
});
export default function App() {
  const {
    alerts, typingUsers, isStreaming, insertMessage, fetchAIResponse, stopStreaming,
  } =
    useApi();
  const onMessageEntered = useCallback(
    async ({ message }) => {
      insertMessage({ id: Date.now(), ...message });
      if (!alerts.length) {
        await fetchAIResponse(message);
      }
    },
    [insertMessage, alerts.length, fetchAIResponse],
  );
  const sendSuggestion = useCallback(
    (prompt) => {
      const message = {
        id: Date.now(),
        timestamp: new Date(),
        author: user,
        text: prompt,
      };
      insertMessage(message);
      if (!alerts.length) {
        fetchAIResponse(message);
      }
    },
    [insertMessage, alerts.length, fetchAIResponse],
  );
  const messageRender = useCallback(({ message }) => <Message text={message.text} />, []);
  const emptyViewRender = useCallback(
    ({ texts }) => (
      <EmptyView
        texts={texts}
        onSuggestionClick={sendSuggestion}
      />
    ),
    [sendSuggestion],
  );
  const sendButtonOptions = useMemo(
    () =>
      isStreaming
        ? {
          action: 'custom',
          icon: 'stopfilled',
          onClick: stopStreaming,
        }
        : {
          action: 'send',
          icon: 'arrowright',
          onClick: () => {},
        },
    [isStreaming, stopStreaming],
  );
  return (
    <Chat
      dataSource={dataSource}
      reloadOnChange={false}
      showAvatar={false}
      showDayHeaders={false}
      user={user}
      height={710}
      onMessageEntered={onMessageEntered}
      alerts={alerts}
      typingUsers={typingUsers}
      messageRender={messageRender}
      emptyViewRender={emptyViewRender}
      sendButtonOptions={sendButtonOptions}
      speechToTextEnabled={true}
    />
  );
}
