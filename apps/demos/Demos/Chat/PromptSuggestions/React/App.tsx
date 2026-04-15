import React, { useCallback, useState, useRef } from 'react';
import Chat from 'devextreme-react/chat';
import type { ChatTypes } from 'devextreme-react/chat';
import { Switch, type SwitchTypes } from 'devextreme-react/switch';
import { loadMessages } from 'devextreme-react/common/core/localization';
import {
  user,
  assistant,
  CHAT_DISABLED_CLASS,
  suggestionItems,
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
    alerts,
    insertMessage,
    fetchAIResponse,
  } = useApi();

  const [typingUsers, setTypingUsers] = useState<ChatTypes.User[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [inputFieldText, setInputFieldText] = useState<string>('');
  const [suggestionList, setSuggestionList] = useState(suggestionItems);
  const sendImmediately = useRef<boolean>(false);
  const hideAfterUse = useRef<boolean>(false);

  const processAIRequest = useCallback(async (message: ChatTypes.Message): Promise<void> => {
    setIsProcessing(true);
    setTypingUsers([assistant]);

    await fetchAIResponse(message);

    setTypingUsers([]);
    setIsProcessing(false);
  }, [fetchAIResponse]);

  const onSuggestionClick = useCallback((e: { itemData?: { text: string; prompt: string } }) => {
    const { prompt = '', text = '' } = e.itemData ?? {};

    if (hideAfterUse.current) {
      setSuggestionList((items) => items.filter((item) => item.text !== text));
    }

    if (sendImmediately.current) {
      const message = { id: Date.now(), timestamp: new Date(), author: user, text: prompt };

      insertMessage(message);

      if (!alerts.length) {
        processAIRequest(message);
      }
    } else {
      setInputFieldText(prompt);
    }
  }, [alerts.length, insertMessage, processAIRequest]);

  const suggestions = { items: suggestionList, onItemClick: onSuggestionClick };

  const onMessageEntered = useCallback(async ({ message, event }: ChatTypes.MessageEnteredEvent): Promise<void> => {
    insertMessage({ id: Date.now(), ...message });

    if (!alerts.length) {
      (event?.target as HTMLElement).blur();

      await processAIRequest(message);

      (event?.target as HTMLElement).focus();
    }
  }, [insertMessage, alerts.length, processAIRequest]);

  const onInputFieldTextChanged = useCallback((e: ChatTypes.InputFieldTextChangedEvent) => {
    setInputFieldText(e?.value ?? '');
  }, []);

  const messageRender = useCallback(({ message }: { message: ChatTypes.Message }) => <Message text={message.text} />, []);

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
      <div className='options-container'>
        <div className='caption'>Suggestion Options</div>
        <div className='options'>
          <div className='option'>
            <Switch
              defaultValue={false}
              onValueChanged={(e: SwitchTypes.ValueChangedEvent) => { sendImmediately.current = e.value; }}
            />
            <span>Send Immediately</span>
          </div>
          <div className='option'>
            <Switch
              defaultValue={false}
              onValueChanged={(e: SwitchTypes.ValueChangedEvent) => { hideAfterUse.current = e.value; }}
            />
            <span>Hide After Use</span>
          </div>
        </div>
      </div>
    </>
  );
}
