import React, { useCallback, useState } from 'react';
import { Button } from 'devextreme-react/button';
import { REGENERATION_TEXT } from './data';

const Message = ({ text, onRegenerateButtonClick }) => {
  const [icon, setIcon] = useState('copy');
  const onCopyButtonClick = useCallback(() => {
    navigator.clipboard?.writeText(text);
    setIcon('check');
    setTimeout(() => {
      setIcon('copy');
    }, 2500);
  }, [text]);
  if (text === REGENERATION_TEXT) {
    return <span>{REGENERATION_TEXT}</span>;
  }
  return (
    <React.Fragment>
      <div className="chat-messagebubble-text">{text}</div>
      <div className="bubble-button-container">
        <Button
          icon={icon}
          stylingMode="text"
          hint="Copy"
          onClick={onCopyButtonClick}
        />
        <Button
          icon="refresh"
          stylingMode="text"
          hint="Regenerate"
          onClick={onRegenerateButtonClick}
        />
      </div>
    </React.Fragment>
  );
};
export default Message;
