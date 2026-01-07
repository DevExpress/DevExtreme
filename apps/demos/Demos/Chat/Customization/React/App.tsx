import React, { useState, useCallback } from 'react';
import Chat from 'devextreme-react/chat';
import type { ChatTypes } from 'devextreme-react/chat';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';
import type { Format } from 'devextreme-react/common/core/localization';

import {
  currentUser,
  messages as initialMessages,
  dayHeaderFormats as headerFormats,
  messageTimestampFormats as messageTimestamps,
  messageTimestampLabel,
  dayHeaderLabel,
} from './data.ts';

type CheckBoxValue = CheckBoxTypes.Properties['value'];

export default function App() {
  const [messages, setMessages] = useState<ChatTypes.Message[]>(initialMessages);
  const [showAvatar, setShowAvatar] = useState<CheckBoxValue>(true);
  const [showUsername, setShowUsername] = useState<CheckBoxValue>(true);
  const [showDayHeaders, setDayHeaders] = useState<CheckBoxValue>(true);
  const [dayHeaderFormat, setDayHeaderFormat] = useState<Format>(headerFormats[0]);
  const [showMessageTimestamp, setMessageTimestamp] = useState<CheckBoxValue>(true);
  const [messageTimestampFormat, setMessageTimestampFormat] = useState<Format>(messageTimestamps[0]);
  const [isDisabled, setDisabled] = useState<CheckBoxTypes.Properties['value']>(false);

  const onMessageEntered = useCallback(({ message }: ChatTypes.MessageEnteredEvent): void => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  return (
    <>
      <div className="chat-container">
        <Chat
          height={710}
          items={messages}
          user={currentUser}
          disabled={!!isDisabled}
          showAvatar={!!showAvatar}
          showUserName={!!showUsername}
          showDayHeaders={!!showDayHeaders}
          showMessageTimestamp={!!showMessageTimestamp}
          dayHeaderFormat={dayHeaderFormat}
          messageTimestampFormat={messageTimestampFormat}
          onMessageEntered={onMessageEntered}
        />
      </div>

      <div className="options">
        <div className="caption">Options</div>

        <div className="option">
          <CheckBox
            text="Avatar"
            value={showAvatar}
            onValueChange={setShowAvatar}
          />
        </div>

        <div className="option">
          <CheckBox
            text="User Name"
            value={showUsername}
            onValueChange={setShowUsername}
          />
        </div>

        <div className="option-separator"></div>

        <div className="option">
          <CheckBox
            text="Day Headers"
            value={showDayHeaders}
            onValueChange={setDayHeaders}
          />
        </div>

        <div className="option">
          <span>Day Header Format:</span>
          <SelectBox
            items={headerFormats}
            value={dayHeaderFormat}
            inputAttr={dayHeaderLabel}
            onValueChange={setDayHeaderFormat}
          />
        </div>

        <div className="option-separator"></div>

        <div className="option">
          <CheckBox
            text="Message Timestamp"
            value={showMessageTimestamp}
            onValueChange={setMessageTimestamp}
          />
        </div>

        <div className="option">
          <span>Message Timestamp Format:</span>
          <SelectBox
            items={messageTimestamps}
            value={messageTimestampFormat}
            inputAttr= {messageTimestampLabel}
            onValueChange={setMessageTimestampFormat}
          />
        </div>

        <div className="option-separator"></div>

        <div className="option">
          <CheckBox
            text="Disable Chat"
            value={isDisabled}
            onValueChange={setDisabled}
          />
        </div>
      </div>
    </>
  );
}
