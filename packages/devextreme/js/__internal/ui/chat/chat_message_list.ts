/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const CHAT_MESSAGE_INNER_LIST_CLASS = 'dx-chat-message-inner-list';
const CHAT_MESSAGE_INNER_LIST_ITEM_CLASS = 'dx-chat-message-inner-list-item';
const CHAT_MESSAGE_WRAPPER_CLASS_CURRENT_CLASS = 'dx-chat-message-wrapper-current';
const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_LETTERS_CLASS = 'dx-chat-message-avatar-letters';
const CHAT_MESSAGE_TEXT_CLASS = 'dx-chat-message-text';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_WRAPPER_CLASS = 'dx-chat-message-wrapper';

let items = [];
let currentUserId = null;

export const setItems = (messages) => {
  items = messages;
};

export const setCurrentUserId = (userId) => {
  currentUserId = userId;
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

const renderMessageText = (item, element) => {
  const { text } = item;

  $('<p>')
    .addClass(CHAT_MESSAGE_TEXT_CLASS)
    .text(text)
    .appendTo(element);
};

const renderTime = (timestamp, element) => {
  const dateTime = new Date(Number(timestamp));
  const dateTimeString = `${dateTime.getHours()}:${dateTime.getMinutes()}`;

  $('<div>')
    .addClass(CHAT_MESSAGE_TIME_CLASS)
    .text(dateTimeString)
    .appendTo(element);
};

const renderListItem = (item, index, element) => {
  const $listItem = $('<li>').addClass(CHAT_MESSAGE_WRAPPER_CLASS);

  const $listItemInner = $('<div>').addClass(CHAT_MESSAGE_INNER_LIST_ITEM_CLASS);

  const isCurrentUserMessage = currentUserId === item.author.id;

  if (isCurrentUserMessage) {
    $listItem.addClass(CHAT_MESSAGE_WRAPPER_CLASS_CURRENT_CLASS);
  }

  if (isCurrentUserMessage) {
    renderMessageText(item, $listItemInner);
    renderAvatar(item, $listItemInner);
  } else {
    renderAvatar(item, $listItemInner);
    renderMessageText(item, $listItemInner);
  }

  $listItemInner.appendTo($listItem);

  renderTime(item.timestamp, $listItem);

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
