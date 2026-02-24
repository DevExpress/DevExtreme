import React, { useState } from 'react';

import Chat from 'devextreme-react/chat';
import type { ChatTypes } from 'devextreme-react/chat';
import { currentUser, supportAgent, initialMessages } from './data.ts';

export default function App() {
  const [userChatTypingUsers, setUserChatTypingUsers] = useState<ChatTypes.User[]>([]);
  const [supportChatTypingUsers, setSupportChatTypingUsers] = useState<ChatTypes.User[]>([]);
  const [messages, setMessages] = useState<ChatTypes.Message[]>(initialMessages);

  function onMessageEntered({ message }: ChatTypes.MessageEnteredEvent): void {
    setMessages((prevMessages: ChatTypes.Message[]): ChatTypes.Message[] => [...prevMessages, message]);
  }

  function typingStart({ user }: ChatTypes.TypingStartEvent): void {
    if (user?.id === currentUser.id) {
      setSupportChatTypingUsers([currentUser]);
    } else {
      setUserChatTypingUsers([supportAgent]);
    }
  }

  function typingEnd({ user }: ChatTypes.TypingEndEvent): void {
    if (user.id === currentUser.id) {
      setSupportChatTypingUsers([]);
    } else {
      setUserChatTypingUsers([]);
    }
  }

  return (
    <>
      <Chat
        user={currentUser}
        items={messages}
        onMessageEntered={onMessageEntered}
        onTypingStart={typingStart}
        onTypingEnd={typingEnd}
        typingUsers={userChatTypingUsers}
        speechToTextEnabled={true}
      />
      <Chat
        user={supportAgent}
        items={messages}
        onMessageEntered={onMessageEntered}
        onTypingStart={typingStart}
        onTypingEnd={typingEnd}
        typingUsers={supportChatTypingUsers}
        speechToTextEnabled={true}
      />
    </>
  );
}
