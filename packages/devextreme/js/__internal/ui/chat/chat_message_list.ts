/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';
import type { Message } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';
import MessageGroup from './chat_message_group';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const CHAT_MESSAGE_LIST_CONTENT_CLASS = 'dx-chat-message-list-content';

export interface MessageListOptions extends WidgetOptions<MessageList> {
  items?: Message[];
  currentUserId?: number | string;
}

class MessageList extends Widget<MessageListOptions> {
  _getDefaultOptions(): MessageListOptions {
    return {
      ...super._getDefaultOptions(),
      items: [],
      currentUserId: undefined,
    };
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGE_LIST_CLASS);

    super._initMarkup();

    this._renderMessageListContent();
  }

  _isCurrentUser(id): boolean {
    const { currentUserId } = this.option();

    return currentUserId === id;
  }

  _messageGroupAlignment(id): 'start' | 'end' {
    return this._isCurrentUser(id) ? 'end' : 'start';
  }

  _createMessageGroupComponent(items, userId): void {
    const $messageGroup = $('<div>').appendTo(this.element());

    this._createComponent($messageGroup, MessageGroup, {
      messages: items,
      alignment: this._messageGroupAlignment(userId),
    });
  }

  _renderMessageListContent(): void {
    const { items } = this.option();

    if (!items?.length) {
      return;
    }

    const $content = $('<div>').addClass(CHAT_MESSAGE_LIST_CONTENT_CLASS);

    let currentMessageGroupUserId = items[0]?.author?.id;
    let currentMessageGroupItems: Message[] = [];

    items.forEach((item, index) => {
      const id = item?.author?.id;

      if (id === currentMessageGroupUserId) {
        currentMessageGroupItems.push(item);
      } else {
        this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId);

        currentMessageGroupUserId = id;
        currentMessageGroupItems = [];
        currentMessageGroupItems.push(item);
      }

      if (items.length - 1 === index) {
        this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId);
      }
    });

    $content.appendTo(this.element());
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'items':
      case 'currentUserId':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageList;
