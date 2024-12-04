import React, { useState, useCallback } from 'react';
import Chat from 'devextreme-react/chat';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import {
  currentUser,
  messages as initialMessages,
  dayHeaderFormat as headerFormat,
  messageTimestampFormat as messageTimestamp,
  messageTimestampLabel,
  dayHeaderLabel,
} from './data.js';

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [showAvatar, setShowAvatar] = useState(true);
  const [showUsername, setShowUsername] = useState(true);
  const [showDayHeaders, setDayHeaders] = useState(true);
  const [dayHeaderFormat, setDayHeaderFormat] = useState(headerFormat[0]);
  const [showMessageTime, setMessageTime] = useState(true);
  const [messageTimestampFormat, setMessageTimeFormat] = useState(messageTimestamp[0]);
  const [isDisabled, setDisabled] = useState(false);
  function onMessageEntered({ message }) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }
  const dayHeaderFormatChanged = useCallback(
    (e) => {
      setDayHeaderFormat(e.value);
    },
    [setDayHeaderFormat],
  );
  const messageTimestampFormatChanged = useCallback(
    (e) => {
      setMessageTimeFormat(e.value);
    },
    [setMessageTimeFormat],
  );
  const showAvatarChanged = useCallback(
    (e) => {
      setShowAvatar(e.value);
    },
    [setShowAvatar],
  );
  const showUsernameChanged = useCallback(
    (e) => {
      setShowUsername(e.value);
    },
    [setShowUsername],
  );
  const showDayHeaderChanged = useCallback(
    (e) => {
      setDayHeaders(e.value);
    },
    [setDayHeaders],
  );
  const showMessageTimeChanged = useCallback(
    (e) => {
      setMessageTime(e.value);
    },
    [setMessageTime],
  );
  const isDisabledChanged = useCallback(
    (e) => {
      setDisabled(e.value);
    },
    [setDisabled],
  );
  return (
    <React.Fragment>
      <div className="chat-container">
        <Chat
          height={710}
          items={messages}
          user={currentUser}
          disabled={isDisabled}
          showAvatar={showAvatar}
          showUserName={showUsername}
          showDayHeaders={showDayHeaders}
          showMessageTimestamp={showMessageTime}
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
            onValueChanged={showAvatarChanged}
          />
        </div>

        <div className="option">
          <CheckBox
            text="User Name"
            value={showUsername}
            onValueChanged={showUsernameChanged}
          />
        </div>

        <div className="option-separator"></div>

        <div className="option">
          <CheckBox
            text="Day Header"
            value={showDayHeaders}
            onValueChanged={showDayHeaderChanged}
          />
        </div>

        <div className="option">
          <span>Day Header Format:</span>
          <SelectBox
            items={headerFormat}
            value={dayHeaderFormat}
            inputAttr={dayHeaderLabel}
            onValueChanged={dayHeaderFormatChanged}
          />
        </div>

        <div className="option-separator"></div>

        <div className="option">
          <CheckBox
            text="Message Timestamp"
            value={showMessageTime}
            onValueChanged={showMessageTimeChanged}
          />
        </div>

        <div className="option">
          <span>Message Timestamp Format:</span>
          <SelectBox
            items={messageTimestamp}
            value={messageTimestampFormat}
            inputAttr={messageTimestampLabel}
            onValueChanged={messageTimestampFormatChanged}
          />
        </div>

        <div className="option-separator"></div>

        <div className="option">
          <CheckBox
            text="Disable Chat"
            value={isDisabled}
            onValueChanged={isDisabledChanged}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
