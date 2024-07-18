/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';

import { renderMessageBubble } from './chat_message_bubble';

const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS = 'dx-chat-message-group-alignment-start';
const CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS = 'dx-chat-message-group-alignment-end';
const CHAT_MESSAGE_GROUP_INFORMATION_CLASS = 'dx-chat-message-group-information';
const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_LETTERS_CLASS = 'dx-chat-message-avatar-letters';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_NAME_CLASS = 'dx-chat-message-name';

const renderAvatar = (name, element) => {
  const $avatar = $('<div>').addClass(CHAT_MESSAGE_AVATAR_CLASS);

  const initials = `${name.charAt(0).toUpperCase()}`;

  $('<div>')
    .addClass(CHAT_MESSAGE_AVATAR_LETTERS_CLASS)
    .text(initials)
    .appendTo($avatar);

  $avatar.appendTo(element);
};

const renderMessageBubbles = (messages, element) => {
  messages.forEach((message) => {
    renderMessageBubble(message, element);
  });
};

const renderName = (name, element) => {
  $('<div>')
    .addClass(CHAT_MESSAGE_NAME_CLASS)
    .text(name)
    .appendTo(element);
};

const renderTime = (timestamp, element) => {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  const dateTime = new Date(Number(timestamp));
  const dateTimeString = dateTime.toLocaleTimeString(undefined, options);

  $('<div>')
    .addClass(CHAT_MESSAGE_TIME_CLASS)
    .text(dateTimeString)
    .appendTo(element);
};

const renderMessageGroupInformation = (messages, element) => {
  const { timestamp, author } = messages[0];
  const $messageGroupInformation = $('<div>').addClass(CHAT_MESSAGE_GROUP_INFORMATION_CLASS);

  renderName(author.name, $messageGroupInformation);
  renderTime(timestamp, $messageGroupInformation);

  $messageGroupInformation.appendTo(element);
};

export const renderMessageGroup = (messages, messageGroupAlignment, element) => {
  const alignmentClass = messageGroupAlignment === 'start'
    ? CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS : CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS;

  const $messageGroup = $('<li>')
    .addClass(CHAT_MESSAGE_GROUP_CLASS)
    .addClass(alignmentClass);

  if (messageGroupAlignment === 'start') {
    renderAvatar(messages[0].author.name, $messageGroup);
  }

  renderMessageGroupInformation(messages, $messageGroup);
  renderMessageBubbles(messages, $messageGroup);

  $messageGroup.appendTo(element);
};
