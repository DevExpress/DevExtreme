/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';

const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';

const renderTextArea = ($messageBox) => {
  const $textArea = $('<textarea>').addClass(CHAT_MESSAGE_BOX_TEXTAREA_CLASS);

  $textArea.appendTo($messageBox);
};

const renderButton = ($messageBox) => {
  const $button = $('<button>').addClass(CHAT_MESSAGE_BOX_BUTTON_CLASS).text('send');

  $button.appendTo($messageBox);
};

export const renderMessageBox = (element) => {
  const $messageBox = $('<div>').addClass(CHAT_MESSAGE_BOX_CLASS);

  renderTextArea($messageBox);
  renderButton($messageBox);

  $messageBox.appendTo(element);
};
