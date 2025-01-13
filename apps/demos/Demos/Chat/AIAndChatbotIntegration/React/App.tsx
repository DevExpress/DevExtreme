import React, { useCallback, useState } from 'react';
import Chat, { ChatTypes } from 'devextreme-react/chat';
import { MessageEnteredEvent } from 'devextreme/ui/chat';
import { loadMessages } from 'devextreme/localization';
import {
  user,
  assistant,
  CHAT_DISABLED_CLASS,
} from './data.ts';
import Message from './Message.tsx';
import { dataSource, useApi } from './useApi.ts';

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

  const [typingUsers, setTypingUsers] = useState<ChatTypes.User[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processAIRequest = useCallback(async (message: ChatTypes.Message): Promise<void> => {
    setIsProcessing(true);
    setTypingUsers([assistant]);

    await fetchAIResponse(message);

    setTypingUsers([]);
    setIsProcessing(false);
  }, [fetchAIResponse]);

  const onMessageEntered = useCallback(async ({ message, event }: MessageEnteredEvent): Promise<void> => {
    insertMessage({ id: Date.now(), ...message });

    if (!alerts.length) {
      (event.target as HTMLElement).blur();

      await processAIRequest(message);

      (event.target as HTMLElement).focus();
    }
  }, [insertMessage, alerts.length, processAIRequest]);

  const onRegenerateButtonClick = useCallback(async (): Promise<void> => {
    setIsProcessing(true);

    await regenerateLastAIResponse();

    setIsProcessing(false);
  }, [regenerateLastAIResponse]);

  const messageRender = useCallback(({ message }: { message: ChatTypes.Message }) => <Message text={message.text} onRegenerateButtonClick={onRegenerateButtonClick} />, [onRegenerateButtonClick]);

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
