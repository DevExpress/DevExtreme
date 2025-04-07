import React, { useState } from 'react';

import Chat, { type ChatTypes } from 'devextreme-react/chat';
import { currentUser, supportAgent, initialMessages } from './data.ts';

export default function App() {
  const [userChatTypingUsers, setUserChatTypingUsers] = useState<ChatTypes.User[]>([]);
  const [supportChatTypingUsers, setSupportChatTypingUsers] = useState<ChatTypes.User[]>([]);
  const [messages, setMessages] = useState<ChatTypes.Message[]>(initialMessages);

  function onMessageEntered({ message }: ChatTypes.MessageEnteredEvent) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  function typingStart({ user }: ChatTypes.TypingStartEvent) {
    if (user.id === currentUser.id) {
      setSupportChatTypingUsers([currentUser]);
    } else {
      setUserChatTypingUsers([supportAgent]);
    }
  }

  function typingEnd({ user }: ChatTypes.TypingEndEvent) {
    if (user.id === currentUser.id) {
      setSupportChatTypingUsers([]);
    } else {
      setUserChatTypingUsers([]);
    }
  }

  return (
    <React.Fragment>
      <Chat
        user={currentUser}
        items={messages}
        onMessageEntered={onMessageEntered}
        onTypingStart={typingStart}
        onTypingEnd={typingEnd}
        typingUsers={userChatTypingUsers}
      />
      <Chat
        user={supportAgent}
        items={messages}
        onMessageEntered={onMessageEntered}
        onTypingStart={typingStart}
        onTypingEnd={typingEnd}
        typingUsers={supportChatTypingUsers}
      />
    </React.Fragment>
  );
}
