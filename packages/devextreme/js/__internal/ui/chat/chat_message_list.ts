/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const CHAT_MESSAGE_INNER_LIST_CLASS = 'dx-chat-message-inner-list';

let items = [];

export const setItems = (messages) => {
  items = messages;
};

const renderMessageBody = (element) => $('<div>')
  .addClass(CHAT_MESSAGE_LIST_CLASS)
  .appendTo(element);

const renderMessageInnerList = (element) => $('<div>')
  .addClass(CHAT_MESSAGE_INNER_LIST_CLASS)
  .appendTo(element);

export const renderMessageList = (element) => {
  const body = renderMessageBody(element);

  renderMessageInnerList(body);
};
