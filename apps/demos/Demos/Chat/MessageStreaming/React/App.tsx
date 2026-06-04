import React, { useCallback, useMemo } from 'react';
import Chat from 'devextreme-react/chat';
import type { ChatTypes } from 'devextreme-react/chat';
import { loadMessages } from 'devextreme-react/common/core/localization';
import {
  user,
} from './data.ts';
import Message from './Message.tsx';
import EmptyView from './EmptyView.tsx';
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
    alerts,
    typingUsers,
    isStreaming,
    insertMessage,
    fetchAIResponse,
    stopStreaming,
  } = useApi();

  const onMessageEntered = useCallback(async ({ message }: ChatTypes.MessageEnteredEvent): Promise<void> => {
    insertMessage({ id: Date.now(), ...message });

    if (!alerts.length) {
      await fetchAIResponse(message);
    }
  }, [insertMessage, alerts.length, fetchAIResponse]);

  const sendSuggestion = useCallback((prompt: string): void => {
    const message: ChatTypes.Message = {
      id: Date.now(),
      timestamp: new Date(),
      author: user,
      text: prompt,
    };

    insertMessage(message);

    if (!alerts.length) {
      fetchAIResponse(message);
    }
  }, [insertMessage, alerts.length, fetchAIResponse]);

  const messageRender = useCallback(({ message }: { message: ChatTypes.Message }) => <Message text={message.text} />, []);

  const emptyViewRender = useCallback(({ texts }: ChatTypes.EmptyViewTemplateData) => (
    <EmptyView texts={texts} onSuggestionClick={sendSuggestion} />
  ), [sendSuggestion]);

  const sendButtonOptions = useMemo<ChatTypes.SendButtonProperties>(() => (isStreaming ? {
    action: 'custom',
    icon: 'stopfilled',
    onClick: stopStreaming,
  } : {
    action: 'send',
    icon: 'arrowright',
    onClick: () => {},
  }), [isStreaming, stopStreaming]);

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
