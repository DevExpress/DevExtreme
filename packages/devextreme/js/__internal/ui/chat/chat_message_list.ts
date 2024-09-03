import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { hasWindow } from '@js/core/utils/window';
import type { Message } from '@js/ui/chat';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import type { MessageGroupAlignment } from './chat_message_group';
import MessageGroup from './chat_message_group';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';

export interface Properties extends WidgetOptions<MessageList> {
  items: Message[];
  currentUserId: number | string | undefined;
}

class MessageList extends Widget<Properties> {
  _messageGroups?: MessageGroup[];

  private _$content!: dxElementWrapper;

  private _scrollable?: Scrollable<unknown>;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      items: [],
      currentUserId: '',
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

  _isCurrentUser(id: string | number | undefined): boolean {
    const { currentUserId } = this.option();

    return currentUserId === id;
  }

  _messageGroupAlignment(id: string | number | undefined): MessageGroupAlignment {
    return this._isCurrentUser(id) ? 'end' : 'start';
  }

  _createMessageGroupComponent(items: Message[], userId: string | number | undefined): void {
    const $messageGroupContainer = this._scrollable ? this._scrollable.content() : this._$content;
    const $messageGroup = $('<div>').appendTo($messageGroupContainer);

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
      const newMessageGroupItem = item ?? {};

      const id = newMessageGroupItem.author?.id;

      if (id === currentMessageGroupUserId) {
        currentMessageGroupItems.push(newMessageGroupItem);
      } else {
        this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId);

        currentMessageGroupUserId = id;
        currentMessageGroupItems = [];
        currentMessageGroupItems.push(newMessageGroupItem);
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
        lastMessageGroup.renderMessage(message);

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

    this._scrollable?.scrollToElement(element);
  }

  _clean(): void {
    this._messageGroups = [];
    this._scrollable = undefined;

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

      this._renderMessage(newMessage ?? {}, value);
    }
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'currentUserId':
        this._invalidate();
        break;
      case 'items':
        this._processItemsUpdating(value ?? [], previousValue ?? []);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageList;
