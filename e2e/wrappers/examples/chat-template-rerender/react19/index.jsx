import { useCallback, useState } from 'react';
import Chat from 'devextreme-react/chat';
import { loadMessages } from 'devextreme-react/common/core/localization';
import { user, assistant, CHAT_DISABLED_CLASS, getMessageId } from './data';
import Message from './message';
import { dataSource, useApi } from './useApi';

loadMessages({
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt': 'AI Assistant is ready to answer your questions.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
});
export default function App() {
  const {
    insertMessage, fetchAIResponse, regenerateLastAIResponse,
  } = useApi();
  const [typingUsers, setTypingUsers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processAIRequest = useCallback(
    async() => {
      setIsProcessing(true);
      setTypingUsers([assistant]);
      await fetchAIResponse();
      setTypingUsers([]);
      setIsProcessing(false);
    },
    [fetchAIResponse],
  );
  const onMessageEntered = useCallback(
    async({ message, event }) => {
      insertMessage({ id: getMessageId(), ...message });
      event.target.blur();
      await processAIRequest();
      event.target.focus();
    },
    [insertMessage, processAIRequest],
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
      typingUsers={typingUsers}
      messageRender={messageRender}
    />
  );
}
