/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { hasWindow } from '@js/core/utils/window';
import type { Message } from '@js/ui/chat';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';
import type { MessageGroupAlignment } from './chat_message_group';
import MessageGroup from './chat_message_group';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';

export interface MessageListOptions extends WidgetOptions<MessageList> {
  items?: Message[];
  currentUserId?: number | string;
}

class MessageList extends Widget<MessageListOptions> {
  _messageGroups?: MessageGroup[];

  private _$content!: dxElementWrapper;

  private _scrollable!: Scrollable<unknown>;

  _getDefaultOptions(): MessageListOptions {
    return {
      ...super._getDefaultOptions(),
      items: [],
      currentUserId: undefined,
    };
  }

  _init(): void {
    super._init();

    this._messageGroups = [];
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGE_LIST_CLASS);

    super._initMarkup();

    this._renderMessageListContent();
    this._renderScrollable();

    this._scrollContentToLastMessageGroup();
  }

  _isCurrentUser(id): boolean {
    const { currentUserId } = this.option();

    return currentUserId === id;
  }

  _messageGroupAlignment(id): MessageGroupAlignment {
    return this._isCurrentUser(id) ? 'end' : 'start';
  }

  _createMessageGroupComponent(items, userId): void {
    const $messageGroup = $('<div>').appendTo(this._$content);

    const messageGroup = this._createComponent($messageGroup, MessageGroup, {
      items,
      alignment: this._messageGroupAlignment(userId),
    });

    this._messageGroups?.push(messageGroup);
  }

  _renderScrollable(): void {
    this._scrollable = this._createComponent(this._$content, Scrollable, {
      useNative: true,
    });
  }

  _renderMessageListContent(): void {
    const { items } = this.option();

    this._$content = $('<div>')
      .appendTo(this.$element());

    if (!items?.length) {
      return;
    }

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
  }

  _renderMessage(message: Message, newItems: Message[]): void {
    const sender = message.author;

    this._setOptionWithoutOptionChange('items', newItems);

    const lastMessageGroup = this._messageGroups?.[this._messageGroups.length - 1];

    if (lastMessageGroup) {
      const lastMessageGroupUserId = lastMessageGroup.option('items')[0].author?.id;

      if (sender?.id === lastMessageGroupUserId) {
        lastMessageGroup._renderMessage(message);

        this._scrollContentToLastMessageGroup();

        return;
      }
    }

    this._createMessageGroupComponent([message], sender?.id);
    this._scrollContentToLastMessageGroup();
  }

  _scrollContentToLastMessageGroup(): void {
    if (!(this._messageGroups?.length && hasWindow())) {
      return;
    }

    const lastMessageGroup = this._messageGroups[this._messageGroups.length - 1];
    const element = lastMessageGroup.$element()[0];

    this._scrollable.scrollToElement(element);
  }

  _clean(): void {
    this._messageGroups = [];

    super._clean();
  }

  _isMessageAddedToEnd(value: Message[], previousValue: Message[]): boolean {
    const valueLength = value.length;
    const previousValueLength = previousValue.length;

    if (valueLength === 0) {
      return false;
    }

    if (previousValueLength === 0) {
      return valueLength === 1;
    }

    const lastValueItem = value[valueLength - 1];
    const lastPreviousValueItem = previousValue[previousValueLength - 1];

    const isLastItemNotTheSame = lastValueItem !== lastPreviousValueItem;
    const isLengthIncreasedByOne = valueLength - previousValueLength === 1;

    return isLastItemNotTheSame && isLengthIncreasedByOne;
  }

  _processItemsUpdating(value: Message[], previousValue: Message[]): void {
    const shouldItemsBeUpdatedCompletely = !this._isMessageAddedToEnd(value, previousValue);

    if (shouldItemsBeUpdatedCompletely) {
      this._invalidate();
    } else {
      const newMessage = value[value.length - 1];

      this._renderMessage(newMessage, value);
    }
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'currentUserId':
        this._invalidate();
        break;
      case 'items':
        // @ts-expect-error
        this._processItemsUpdating(value, previousValue);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageList;
