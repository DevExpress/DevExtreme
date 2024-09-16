import $ from '@js/core/renderer';
import { hasWindow } from '@js/core/utils/window';
import messageLocalization from '@js/localization/message';
import type { Message } from '@js/ui/chat';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import type { MessageGroupAlignment } from './chat_messagegroup';
import MessageGroup from './chat_messagegroup';

const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';

const CHAT_MESSAGELIST_EMPTY_CLASS = 'dx-chat-messagelist-empty';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS = 'dx-chat-messagelist-empty-image';
const CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS = 'dx-chat-messagelist-empty-message';
const CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS = 'dx-chat-messagelist-empty-prompt';

export interface Properties extends WidgetOptions<MessageList> {
  items: Message[];
  currentUserId: number | string | undefined;
}

class MessageList extends Widget<Properties> {
  _messageGroups?: MessageGroup[];

  private _scrollable!: Scrollable<unknown>;

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
    $(this.element()).addClass(CHAT_MESSAGELIST_CLASS);

    super._initMarkup();

    this._renderScrollable();

    this._renderMessageListContent();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._scrollable.update();

    this._scrollContentToLastMessageGroup();
  }

  _renderEmptyViewContent(): void {
    const $emptyView = $('<div>')
      .addClass(CHAT_MESSAGELIST_EMPTY_VIEW_CLASS);

    $('<div>')
      .appendTo($emptyView)
      .addClass(CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS);

    const messageText = messageLocalization.format('dxChat-emptyListMessage');

    $('<div>')
      .appendTo($emptyView)
      .addClass(CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS)
      .text(messageText);

    const promptText = messageLocalization.format('dxChat-emptyListPrompt');

    $('<div>')
      .appendTo($emptyView)
      .addClass(CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS)
      .text(promptText);

    $emptyView.appendTo(this._scrollable.content());
  }

  _removeEmptyView(): void {
    $(this._scrollable.content()).empty();
  }

  _toggleEmptyStateClass(state: boolean): void {
    this.$element().toggleClass(CHAT_MESSAGELIST_EMPTY_CLASS, state);
  }

  _isEmpty(): boolean {
    const { items } = this.option();

    return items.length === 0;
  }

  _isCurrentUser(id: string | number | undefined): boolean {
    const { currentUserId } = this.option();

    return currentUserId === id;
  }

  _messageGroupAlignment(id: string | number | undefined): MessageGroupAlignment {
    return this._isCurrentUser(id) ? 'end' : 'start';
  }

  _createMessageGroupComponent(items: Message[], userId: string | number | undefined): void {
    const $messageGroup = $('<div>').appendTo(this._scrollable.content());

    const messageGroup = this._createComponent($messageGroup, MessageGroup, {
      items,
      alignment: this._messageGroupAlignment(userId),
    });

    this._messageGroups?.push(messageGroup);
  }

  _renderScrollable(): void {
    const $scrollable = $('<div>')
      .appendTo(this.$element());

    this._scrollable = this._createComponent($scrollable, Scrollable, {
      useNative: true,
    });
  }

  _renderMessageListContent(): void {
    if (this._isEmpty()) {
      this._toggleEmptyStateClass(true);
      this._renderEmptyViewContent();

      return;
    }

    const { items } = this.option();

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

  _renderMessage(message: Message): void {
    const sender = message.author;

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
      this._toggleEmptyStateClass(false);

      if (!previousValue.length) {
        this._removeEmptyView();
      }

      const newMessage = value[value.length - 1];

      this._renderMessage(newMessage ?? {});
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
