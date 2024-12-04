import React, { useState } from 'react';
import Chat, { ChatTypes } from 'devextreme-react/chat';
import { AzureOpenAI } from 'openai';
import { MessageEnteredEvent } from 'devextreme/ui/chat';
import CustomStore from 'devextreme/data/custom_store';
import { loadMessages } from 'devextreme/localization';
import { 
  user,
  assistant,
  AzureOpenAIConfig,
  REGENERATION_TEXT
} from './data.ts';
import Message from './Message.tsx';

const store = [];
const messages = [];
let lastMessageId;

loadMessages({
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt': 'AI Assistant is ready to answer your questions.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
});

const chatService = new AzureOpenAI(AzureOpenAIConfig);

async function getAIResponse(messages) {
  const params = {
    messages,
    max_tokens: 1000,
    temperature: 0.7,
  };

  const responseAzure = await chatService.chat.completions.create(params);
  const data = { choices: responseAzure.choices };

  return data.choices[0].message?.content;
}

function updateLastMessage(text = REGENERATION_TEXT) {
  customStore.push([{
    type: 'update',
    key: lastMessageId,
    data: { text },
  }]);
}

function renderMessage(text) {
  const message = {
    id: Date.now(),
    timestamp: new Date(),
    author: assistant,
    text,
  };

  customStore.push([{ type: 'insert', data: message }]);
}

const customStore = new CustomStore({
  key: 'id',
  load: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...store]);
      }, 0);
    });
  },
  insert: (message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        store.push(message);
        resolve(message);
      });
    });
  },
});

export default function App() {
  const [alerts, setAlerts] = useState<ChatTypes.Alert[]>([]);
  const [typingUsers, setTypingUsers] = useState<ChatTypes.User[]>([]);

  function alertLimitReached() {
    setAlerts([{
      message: 'Request limit reached, try again in a minute.'
    }]);
  
    setTimeout(() => {
      setAlerts([]);
    }, 10000);
  }

  async function processMessageSending() {
    setTypingUsers([assistant]);
  
    try {
      const aiResponse = await getAIResponse(messages);
  
      setTimeout(() => {
        setTypingUsers([]);
        messages.push({ role: 'assistant', content: aiResponse });
        renderMessage(aiResponse);
      }, 200);
    } catch {
      setTypingUsers([]);
      alertLimitReached();
    }
  }

  async function regenerate() {
    try {
      const aiResponse = await getAIResponse(messages.slice(0, -1));

      updateLastMessage(aiResponse);
      messages.at(-1).content = aiResponse;
    } catch {
      updateLastMessage(messages.at(-1).content);
      alertLimitReached();
    }
  }

  function onMessageEntered({ message }: MessageEnteredEvent) {
    customStore.push([{ type: 'insert', data: { id: Date.now(), ...message } }]);
    messages.push({ role: 'user', content: message.text });
    
    processMessageSending();
  }

  function onRegenerateButtonClick() {
    updateLastMessage();
    regenerate();
  }

  function onOptionChanged({ name, value = [] }) {
    if (name === 'items' && value.length) {
      lastMessageId = value.at(-1)?.id;
    }
  }

  return (
    <Chat
      dataSource={customStore}
      reloadOnChange={false}
      showAvatar={false}
      showDayHeaders={false}
      user={user}
      height={710}
      onMessageEntered={onMessageEntered}
      onOptionChanged={onOptionChanged}
      alerts={alerts}
      typingUsers={typingUsers}
      messageRender={(data) => Message(data, onRegenerateButtonClick)}
    />
  );
}
