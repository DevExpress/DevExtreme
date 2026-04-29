import React, { useCallback, useState, useRef } from 'react';
import Chat from 'devextreme-react/chat';
import { Switch } from 'devextreme-react/switch';
import { loadMessages } from 'devextreme-react/common/core/localization';
import {
  user, assistant, CHAT_DISABLED_CLASS, suggestionItems,
} from './data.js';
import Message from './Message.js';
import { dataSource, useApi } from './useApi.js';

loadMessages({
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt':
      'Your Shopping AI Assistant is ready to help. Ask a question or choose one of the suggested prompts to get started.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
});
export default function App() {
  const { alerts, insertMessage, fetchAIResponse } = useApi();
  const [typingUsers, setTypingUsers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputFieldText, setInputFieldText] = useState('');
  const [suggestionList, setSuggestionList] = useState(suggestionItems);
  const sendImmediately = useRef(false);
  const hideAfterUse = useRef(false);
  const processAIRequest = useCallback(
    async (message) => {
      setIsProcessing(true);
      setTypingUsers([assistant]);
      await fetchAIResponse(message);
      setTypingUsers([]);
      setIsProcessing(false);
    },
    [fetchAIResponse],
  );
  const onSuggestionClick = useCallback(
    (e) => {
      const { prompt = '', text = '' } = e.itemData ?? {};
      if (hideAfterUse.current) {
        setSuggestionList((items) => items.filter((item) => item.text !== text));
      }
      if (sendImmediately.current) {
        const message = {
          id: Date.now(), timestamp: new Date(), author: user, text: prompt,
        };
        insertMessage(message);
        if (!alerts.length) {
          processAIRequest(message);
        }
      } else {
        setInputFieldText(prompt);
      }
    },
    [alerts.length, insertMessage, processAIRequest],
  );
  const suggestions = { items: suggestionList, onItemClick: onSuggestionClick };
  const onMessageEntered = useCallback(
    async ({ message, event }) => {
      if (isProcessing) return;
      insertMessage({ id: Date.now(), ...message });
      if (!alerts.length) {
        (event?.target).blur();
        await processAIRequest(message);
        (event?.target).focus();
      }
    },
    [isProcessing, insertMessage, alerts.length, processAIRequest],
  );
  const onInputFieldTextChanged = useCallback((e) => {
    setInputFieldText(e?.value ?? '');
  }, []);
  const messageRender = useCallback(({ message }) => <Message text={message.text} />, []);
  return (
    <>
      <Chat
        className={isProcessing ? CHAT_DISABLED_CLASS : ''}
        dataSource={dataSource}
        reloadOnChange={false}
        showAvatar={false}
        showDayHeaders={false}
        user={user}
        height={520}
        alerts={alerts}
        typingUsers={typingUsers}
        speechToTextEnabled={true}
        inputFieldText={inputFieldText}
        suggestions={suggestions}
        messageRender={messageRender}
        onMessageEntered={onMessageEntered}
        onInputFieldTextChanged={onInputFieldTextChanged}
      />
      <div className="options">
        <div className="caption">Suggestion Options</div>
        <div className="suggestions-options">
          <div className="option">
            <Switch
              defaultValue={false}
              onValueChanged={(e) => {
                sendImmediately.current = e.value;
              }}
            />
            <span>Send Immediately</span>
          </div>
          <div className="option">
            <Switch
              defaultValue={false}
              onValueChanged={(e) => {
                hideAfterUse.current = e.value;
              }}
            />
            <span>Hide After Use</span>
          </div>
        </div>
      </div>
    </>
  );
}
