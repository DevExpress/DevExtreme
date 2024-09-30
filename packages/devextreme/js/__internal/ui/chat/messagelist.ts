import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import resizeObserverSingleton from '@js/core/resize_observer';
import { contains } from '@js/core/utils/dom';
import { hasWindow } from '@js/core/utils/window';
import messageLocalization from '@js/localization/message';
import {
  isReachedBottom,
} from '@js/renovation/ui/scroll_view/utils/get_boundary_props';
import { getScrollTopMax } from '@js/renovation/ui/scroll_view/utils/get_scroll_top_max';
import type { Message } from '@js/ui/chat';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import { isElementVisible } from '../splitter/utils/layout';
import type { MessageGroupAlignment } from './messagegroup';
import MessageGroup from './messagegroup';

const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';

const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS = 'dx-chat-messagelist-empty-image';
const CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS = 'dx-chat-messagelist-empty-message';
const CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS = 'dx-chat-messagelist-empty-prompt';

export interface Properties extends WidgetOptions<MessageList> {
  items: Message[];
  currentUserId: number | string | undefined;
}

class MessageList extends Widget<Properties> {
  private _messageGroups?: MessageGroup[];

  private _containerClientHeight = 0;

  private _suppressResizeHandling?: boolean;

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

    this._attachResizeObserverSubscription();

    this._suppressResizeHandling = true;
  }

  _attachResizeObserverSubscription(): void {
    if (hasWindow()) {
      const element = this._getScrollContainer();

      resizeObserverSingleton.unobserve(element);
      resizeObserverSingleton.observe(element, (entry) => this._resizeHandler(entry));
    }
  }

  _isAttached(element: Element): boolean {
    return !!contains(domAdapter.getBody(), element);
  }

  _resizeHandler({ contentRect, target }: ResizeObserverEntry): void {
    const newHeight = contentRect.height;

    if (this._suppressResizeHandling
      && this._isAttached(target)
      && isElementVisible(target as HTMLElement)
    ) {
      this._scrollContentToLastMessage();

      this._suppressResizeHandling = false;
    } else {
      const heightChange = this._containerClientHeight - newHeight;

      let { scrollTop } = target;

      if (heightChange >= 1 || !isReachedBottom(target as HTMLDivElement, target.scrollTop, 0, 1)) {
        scrollTop += heightChange;
      }

      this._scrollable.scrollTo({ top: scrollTop });
    }

    this._containerClientHeight = newHeight;
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

    $emptyView.appendTo(this._$content());
  }

  _removeEmptyView(): void {
    this._$content().empty();
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
    const $messageGroup = $('<div>').appendTo(this._$content());

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
      useKeyboard: false,
      bounceEnabled: false,
    });
  }

  _renderMessageListContent(): void {
    if (this._isEmpty()) {
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
        this._scrollContentToLastMessage();

        return;
      }
    }

    this._createMessageGroupComponent([message], sender?.id);

    this._scrollContentToLastMessage();
  }

  _$content(): dxElementWrapper {
    return $(this._scrollable.content());
  }

  _scrollContentToLastMessage(): void {
    const scrollOffsetTopMax = getScrollTopMax(this._getScrollContainer());

    this._scrollable.scrollTo({ top: scrollOffsetTopMax });
  }

  _getScrollContainer(): HTMLElement {
    // @ts-expect-error
    return $(this._scrollable.container()).get(0);
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
