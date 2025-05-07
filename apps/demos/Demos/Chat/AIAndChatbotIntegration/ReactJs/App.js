import React, { useCallback, useState } from 'react';
import Chat from 'devextreme-react/chat';
import { loadMessages } from 'devextreme/localization';
import { user, assistant, CHAT_DISABLED_CLASS } from './data.js';
import Message from './Message.js';
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
    alerts, insertMessage, fetchAIResponse, regenerateLastAIResponse,
  } = useApi();
  const [typingUsers, setTypingUsers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processAIRequest = useCallback(
    async(message) => {
      setIsProcessing(true);
      setTypingUsers([assistant]);
      await fetchAIResponse(message);
      setTypingUsers([]);
      setIsProcessing(false);
    },
    [fetchAIResponse],
  );
  const onMessageEntered = useCallback(
    async({ message, event }) => {
      insertMessage({ id: Date.now(), ...message });
      if (!alerts.length) {
        event.target.blur();
        await processAIRequest(message);
        event.target.focus();
      }
    },
    [insertMessage, alerts.length, processAIRequest],
  );
  const onRegenerateButtonClick = useCallback(async() => {
    setIsProcessing(true);
    await regenerateLastAIResponse();
    setIsProcessing(false);
  }, [regenerateLastAIResponse]);
  const messageRender = useCallback(
    ({ message }) => (
      <Message
        text={message.text}
        onRegenerateButtonClick={onRegenerateButtonClick}
      />
    ),
    [onRegenerateButtonClick],
  );
  return (
    <Chat
      className={isProcessing ? CHAT_DISABLED_CLASS : ''}
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
    />
  );
}
