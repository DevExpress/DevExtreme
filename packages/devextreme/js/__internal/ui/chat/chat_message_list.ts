/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';

import { renderMessageGroup } from './chat_message_group';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const CHAT_MESSAGE_LIST_CONTENT_CLASS = 'dx-chat-message-list-content';

const data = {
  items: [
    {
      author: {
        id: null,
      },
    },
  ],
  currentUserId: null,
};

export const setItems = (messages) => {
  data.items = messages;
};

export const setCurrentUserId = (userId) => {
  data.currentUserId = userId;
};

const isCurrentUser = (id) => data.currentUserId === id;
const messageGroupAlignment = (id) => (isCurrentUser(id) ? 'end' : 'start');

const renderMessageListContent = (element) => {
  const $content = $('<ul>').addClass(CHAT_MESSAGE_LIST_CONTENT_CLASS);

  let currentMessageGroupUserId = data.items[0].author.id;
  let currentMessageGroupItems: any = [];

  data.items.forEach((item, index) => {
    const { id } = item.author;

    if (id === currentMessageGroupUserId) {
      currentMessageGroupItems.push(item);
    } else {
      renderMessageGroup(
        currentMessageGroupItems,
        messageGroupAlignment(currentMessageGroupUserId),
        $content,
      );

      currentMessageGroupUserId = id;
      currentMessageGroupItems = [];
      currentMessageGroupItems.push(item);
    }

    if (data.items.length - 1 === index) {
      renderMessageGroup(
        currentMessageGroupItems,
        messageGroupAlignment(currentMessageGroupUserId),
        $content,
      );
    }
  });

  $content.appendTo(element);
};

const renderMessageList = (element) => $('<div>')
  .addClass(CHAT_MESSAGE_LIST_CLASS)
  .appendTo(element);

export const renderMessageListInit = (element) => {
  const $list = renderMessageList(element);

  renderMessageListContent($list);
};
