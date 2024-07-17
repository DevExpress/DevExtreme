/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const CHAT_MESSAGE_INNER_LIST_CLASS = 'dx-chat-message-inner-list';
const CHAT_MESSAGE_INNER_LIST_ITEM_CLASS = 'dx-chat-message-inner-list-item';
const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_LETTERS_CLASS = 'dx-chat-message-avatar-letters';

let items = [];

export const setItems = (messages) => {
  items = messages;
};

const renderMessageBody = (element) => $('<div>')
  .addClass(CHAT_MESSAGE_LIST_CLASS)
  .appendTo(element);

const renderAvatar = (item, element) => {
  const { author } = item;

  const $avatar = $('<div>').addClass(CHAT_MESSAGE_AVATAR_CLASS);

  const initials = `${author.firstName.charAt(0).toUpperCase()}${author.lastName.charAt(0).toUpperCase()}`;

  $('<div>')
    .addClass(CHAT_MESSAGE_AVATAR_LETTERS_CLASS)
    .text(initials)
    .appendTo($avatar);

  $avatar.appendTo(element);
};

const renderListItem = (item, index, element) => {
  const $listItem = $('<li>').addClass(CHAT_MESSAGE_INNER_LIST_ITEM_CLASS);

  renderAvatar(item, $listItem);

  $listItem.appendTo(element);
};

const renderMessageInnerList = (element) => {
  const $list = $('<ul>').addClass(CHAT_MESSAGE_INNER_LIST_CLASS);

  items.forEach((item, index) => {
    renderListItem(item, index, $list);
  });

  $list.appendTo(element);
};

export const renderMessageList = (element) => {
  const body = renderMessageBody(element);

  renderMessageInnerList(body);
};
