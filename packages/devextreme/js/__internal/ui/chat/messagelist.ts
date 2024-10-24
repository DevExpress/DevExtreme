import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import resizeObserverSingleton from '@js/core/resize_observer';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
import { isElementInDom } from '@js/core/utils/dom';
import { isDate, isDefined } from '@js/core/utils/type';
import type { Format } from '@js/localization';
import dateLocalization from '@js/localization/date';
import messageLocalization from '@js/localization/message';
import { getScrollTopMax } from '@js/renovation/ui/scroll_view/utils/get_scroll_top_max';
import type { Message } from '@js/ui/chat';
import ScrollView from '@js/ui/scroll_view';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import { isElementVisible } from '../splitter/utils/layout';
import type { MessageGroupAlignment } from './messagegroup';
import MessageGroup from './messagegroup';

const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const CHAT_MESSAGELIST_EMPTY_CLASS = 'dx-chat-messagelist-empty';

const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS = 'dx-chat-messagelist-empty-image';
const CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS = 'dx-chat-messagelist-empty-message';
const CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS = 'dx-chat-messagelist-empty-prompt';
const CHAT_MESSAGELIST_DAY_HEADER_CLASS = 'dx-chat-messagelist-day-header';

const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
export const MESSAGEGROUP_TIMEOUT = 5 * 1000 * 60;

export interface Properties extends WidgetOptions<MessageList> {
  items: Message[];
  currentUserId: number | string | undefined;
  showDayHeaders: boolean;
  dayHeaderFormat: null | Format;
  messageTimestampFormat: null | Format;
  isLoading?: boolean;
}

class MessageList extends Widget<Properties> {
  private _messageGroups?: MessageGroup[];

  private _lastMessageDate?: null | string | number | Date;

  private _containerClientHeight!: number;

  private _scrollView!: ScrollView;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      items: [],
      currentUserId: '',
      showDayHeaders: true,
      dayHeaderFormat: null,
      messageTimestampFormat: null,
      isLoading: false,
    };
  }

  _init(): void {
    super._init();

    this._messageGroups = [];
    this._lastMessageDate = null;
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGELIST_CLASS);

    super._initMarkup();

    this._renderScrollView();
    this._renderMessageListContent();
    this._updateAria();
  }

  _renderContentImpl(): void {
    super._renderContentImpl();

    this._attachResizeObserverSubscription();
  }

  _attachResizeObserverSubscription(): void {
    const element = this.$element().get(0);

    resizeObserverSingleton.unobserve(element);
    resizeObserverSingleton.observe(element, (entry) => this._resizeHandler(entry));
  }

  _resizeHandler({ contentRect, target }: ResizeObserverEntry): void {
    if (!isElementInDom($(target)) || !isElementVisible(target as HTMLElement)) {
      return;
    }

    const isInitialRendering = !isDefined(this._containerClientHeight);
    const newHeight = contentRect.height;

    if (isInitialRendering) {
      this._scrollContentToLastMessage();
    } else {
      const heightChange = this._containerClientHeight - newHeight;
      const isHeightDecreasing = heightChange > 0;

      let scrollTop = this._scrollView.scrollTop();

      if (isHeightDecreasing) {
        scrollTop += heightChange;

        this._scrollView.scrollTo({ top: scrollTop });
      }
    }

    this._containerClientHeight = newHeight;
  }

  _renderEmptyViewContent(): void {
    const $emptyView = $('<div>')
      .addClass(CHAT_MESSAGELIST_EMPTY_VIEW_CLASS)
      .attr('id', `dx-${new Guid()}`);

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
    this.$element().removeClass(CHAT_MESSAGELIST_EMPTY_CLASS);
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
    const { messageTimestampFormat } = this.option();

    const messageGroup = this._createComponent($messageGroup, MessageGroup, {
      items,
      alignment: this._messageGroupAlignment(userId),
      messageTimestampFormat,
    });

    this._messageGroups?.push(messageGroup);
  }

  _renderScrollView(): void {
    const $scrollable = $('<div>')
      .appendTo(this.$element());

    this._scrollView = this._createComponent($scrollable, ScrollView, {
      useKeyboard: false,
      bounceEnabled: false,
      onReachBottom: noop,
      reachBottomText: '',
      indicateLoading: false,
    });
  }

  _shouldAddDayHeader(timestamp: undefined | string | number | Date): boolean {
    const { showDayHeaders } = this.option();

    if (!showDayHeaders) {
      return false;
    }

    const deserializedDate = dateSerialization.deserializeDate(timestamp);

    if (!isDate(deserializedDate) || isNaN(deserializedDate.getTime())) {
      return false;
    }

    return !dateUtils.sameDate(this._lastMessageDate, deserializedDate);
  }

  _createDayHeader(timestamp: string | number | Date | undefined): void {
    const deserializedDate = dateSerialization.deserializeDate(timestamp);
    const today = new Date();
    const yesterday = new Date(new Date().setDate(today.getDate() - 1));
    this._lastMessageDate = deserializedDate;

    let headerDate = deserializedDate.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/[/-]/g, '.');

    const { dayHeaderFormat } = this.option();

    if (dayHeaderFormat) {
      headerDate = dateLocalization.format(deserializedDate, dayHeaderFormat);
    }

    if (dateUtils.sameDate(deserializedDate, today)) {
      headerDate = `${messageLocalization.format('Today')} ${headerDate}`;
    }

    if (dateUtils.sameDate(deserializedDate, yesterday)) {
      headerDate = `${messageLocalization.format('Yesterday')} ${headerDate}`;
    }

    $('<div>')
      .addClass(CHAT_MESSAGELIST_DAY_HEADER_CLASS)
      .text(headerDate)
      .appendTo(this._$content());
  }

  _updateLoadingState(isLoading: boolean): void {
    if (!this._scrollView) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._scrollView.release(!isLoading);
  }

  _renderMessageListContent(): void {
    const { isLoading } = this.option();

    this.$element().toggleClass(CHAT_MESSAGELIST_EMPTY_CLASS, this._isEmpty() && !isLoading);

    if (this._isEmpty() && !isLoading) {
      this._renderEmptyViewContent();
      this._updateLoadingState(false);

      return;
    }

    const { items } = this.option();

    let currentMessageGroupUserId = items[0]?.author?.id;
    let currentMessageGroupItems: Message[] = [];

    items.forEach((item, index) => {
      const newMessageGroupItem = item ?? {};
      const id = newMessageGroupItem.author?.id;
      const shouldCreateDayHeader = this._shouldAddDayHeader(newMessageGroupItem.timestamp);
      const isTimeoutExceeded = this._isTimeoutExceeded(
        currentMessageGroupItems[currentMessageGroupItems.length - 1] ?? {},
        item,
      );

      const shouldCreateMessageGroup = (shouldCreateDayHeader && currentMessageGroupItems.length)
        || isTimeoutExceeded
        || id !== currentMessageGroupUserId;

      if (shouldCreateMessageGroup) {
        this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId);

        currentMessageGroupUserId = id;
        currentMessageGroupItems = [];
        currentMessageGroupItems.push(newMessageGroupItem);
      } else {
        currentMessageGroupItems.push(newMessageGroupItem);
      }

      if (shouldCreateDayHeader) {
        this._createDayHeader(item?.timestamp);
      }

      if (items.length - 1 === index) {
        this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId);
      }
    });

    // @ts-expect-error
    this._updateLoadingState(isLoading);
    this._scrollContentToLastMessage();
  }

  _renderMessage(message: Message): void {
    const { author, timestamp } = message;

    const lastMessageGroup = this._messageGroups?.[this._messageGroups.length - 1];
    const shouldCreateDayHeader = this._shouldAddDayHeader(timestamp);

    if (lastMessageGroup) {
      const { items } = lastMessageGroup.option();
      const lastMessageGroupItem = items[items.length - 1];
      const lastMessageGroupUserId = lastMessageGroupItem.author?.id;
      const isTimeoutExceeded = this._isTimeoutExceeded(lastMessageGroupItem, message);

      if (author?.id === lastMessageGroupUserId && !isTimeoutExceeded && !shouldCreateDayHeader) {
        lastMessageGroup.renderMessage(message);
        this._scrollContentToLastMessage();

        return;
      }
    }

    if (shouldCreateDayHeader) {
      this._createDayHeader(timestamp);
    }

    this._createMessageGroupComponent([message], author?.id);

    this._scrollContentToLastMessage();
  }

  _$content(): dxElementWrapper {
    return $(this._scrollView.content());
  }

  _scrollContentToLastMessage(): void {
    this._scrollView.scrollTo({
      top: getScrollTopMax(this._scrollableContainer()),
    });
  }

  _scrollableContainer(): Element {
    return $(this._scrollView.element()).find(`.${SCROLLABLE_CONTAINER_CLASS}`).get(0);
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

  _isTimeoutExceeded(lastMessage: Message, newMessage: Message): boolean {
    const lastMessageTimestamp = lastMessage?.timestamp;
    const newMessageTimestamp = newMessage?.timestamp;

    if (!lastMessageTimestamp || !newMessageTimestamp) {
      return false;
    }

    const lastMessageTimestampInMs = dateSerialization.deserializeDate(lastMessageTimestamp);
    const newMessageTimestampInMs = dateSerialization.deserializeDate(newMessageTimestamp);

    const result = newMessageTimestampInMs - lastMessageTimestampInMs > MESSAGEGROUP_TIMEOUT;

    return result;
  }

  _updateAria(): void {
    const aria = {
      role: 'log',
      atomic: 'false',
      label: messageLocalization.format('dxChat-messageListAriaLabel'),
      live: 'polite',
      relevant: 'additions',
    };

    this.setAria(aria);
  }

  _clean(): void {
    this._messageGroups = [];
    this._lastMessageDate = null;

    super._clean();
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
      case 'showDayHeaders':
      case 'dayHeaderFormat':
      case 'messageTimestampFormat':
        this._invalidate();
        break;
      case 'isLoading':
        break;
      default:
        super._optionChanged(args);
    }
  }

  getEmptyViewId(): string | null {
    if (this._isEmpty()) {
      const $emptyView = this._$content().find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);
      const emptyViewId = $emptyView.attr('id') ?? null;

      return emptyViewId;
    }

    return null;
  }
}

export default MessageList;
