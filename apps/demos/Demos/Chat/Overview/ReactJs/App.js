import React, { useState } from 'react';
import Chat from 'devextreme-react/chat';
import { currentUser, supportAgent, initialMessages } from './data.js';

export default function App() {
  const [userChatTypingUsers, setUserChatTypingUsers] = useState([]);
  const [supportChatTypingUsers, setSupportChatTypingUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessages);
  function onMessageEntered({ message }) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }
  function typingStart({ user }) {
    if (user.id === currentUser.id) {
      setSupportChatTypingUsers([supportAgent]);
    } else {
      setUserChatTypingUsers([currentUser]);
    }
  }
  function typingEnd({ user }) {
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
