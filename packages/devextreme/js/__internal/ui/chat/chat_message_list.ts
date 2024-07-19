/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';
import type { Message } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';
import { renderMessageGroup } from './chat_message_group';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const CHAT_MESSAGE_LIST_CONTENT_CLASS = 'dx-chat-message-list-content';

export interface MessageListOptions extends WidgetOptions<MessageList> {
  items?: Message[];
  currentUserId?: string;
}

class MessageList extends Widget<MessageListOptions> {
  _getDefaultOptions(): MessageListOptions {
    return {
      ...super._getDefaultOptions(),
      ...{
        items: [],
        currentUserId: '',
      },
    };
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGE_LIST_CLASS);

    super._initMarkup();

    this._renderMessageListContent();
  }

  _isCurrentUser(id) {
    const { currentUserId } = this.option();

    return currentUserId === id;
  }

  _messageGroupAlignment(id) {
    return this._isCurrentUser(id) ? 'end' : 'start';
  }

  _renderMessageListContent() {
    const $content = $('<ul>').addClass(CHAT_MESSAGE_LIST_CONTENT_CLASS);

    const { items } = this.option();

    let currentMessageGroupUserId = (items?.[0] as any).author.id;
    let currentMessageGroupItems: any = [];

    items?.forEach((item, index) => {
      const { id } = (item as any).author;

      if (id === currentMessageGroupUserId) {
        currentMessageGroupItems.push(item);
      } else {
        renderMessageGroup(
          currentMessageGroupItems,
          this._messageGroupAlignment(currentMessageGroupUserId),
          $content,
        );

        currentMessageGroupUserId = id;
        currentMessageGroupItems = [];
        currentMessageGroupItems.push(item);
      }

      if (items.length - 1 === index) {
        renderMessageGroup(
          currentMessageGroupItems,
          this._messageGroupAlignment(currentMessageGroupUserId),
          $content,
        );
      }
    });

    $content.appendTo(this.element());
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'items':
        this.option(name, (value as Message[]));
        break;
      case 'currentUserId':
        this.option(name, (value as any));
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageList;
