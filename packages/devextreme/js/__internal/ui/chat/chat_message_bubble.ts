/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';

const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';

export const renderMessageBubble = (message, element) => {
  const { text } = message;

  $('<p>')
    .addClass(CHAT_MESSAGE_BUBBLE_CLASS)
    .text(text)
    .appendTo(element);
};
