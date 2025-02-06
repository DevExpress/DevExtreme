import { Guid } from '@js/common';
import type { Format } from '@js/common/core/localization';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import resizeObserverSingleton from '@js/core/resize_observer';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
import { isElementInDom } from '@js/core/utils/dom';
import { getHeight } from '@js/core/utils/size';
import { isDate, isDefined } from '@js/core/utils/type';
import type { Message, User } from '@js/ui/chat';
import ScrollView from '@js/ui/scroll_view';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import { getScrollTopMax } from '@ts/ui/scroll_view/utils/get_scroll_top_max';

import type { DataChange } from '../collection/collection_widget.base';
import { isElementVisible } from '../splitter/utils/layout';
import MessageBubble, { CHAT_MESSAGEBUBBLE_CLASS } from './messagebubble';
import type { MessageGroupAlignment } from './messagegroup';
import MessageGroup, {
  CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS,
  CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS,
  CHAT_MESSAGEGROUP_CLASS,
  MESSAGE_DATA_KEY,
} from './messagegroup';
import TypingIndicator from './typingindicator';

const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const CHAT_MESSAGELIST_CONTENT_CLASS = 'dx-chat-messagelist-content';
const CHAT_MESSAGELIST_EMPTY_CLASS = 'dx-chat-messagelist-empty';
const CHAT_MESSAGELIST_EMPTY_LOADING_CLASS = 'dx-chat-messagelist-empty-loading';

const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS = 'dx-chat-messagelist-empty-image';
const CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS = 'dx-chat-messagelist-empty-message';
const CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS = 'dx-chat-messagelist-empty-prompt';
const CHAT_MESSAGELIST_DAY_HEADER_CLASS = 'dx-chat-messagelist-day-header';

const CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-last-messagegroup-alignment-start';
const CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS = 'dx-chat-last-messagegroup-alignment-end';

const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
export const MESSAGEGROUP_TIMEOUT = 5 * 1000 * 60;

export type MessageTemplate = ((data: Message, messageBubbleContainer: Element) => void) | null;
export interface Properties extends WidgetOptions<MessageList> {
  items: Message[];
  currentUserId: number | string | undefined;
  showDayHeaders: boolean;
  messageTemplate?: MessageTemplate;
  dayHeaderFormat?: Format;
  messageTimestampFormat?: Format;
  typingUsers: User[];
  isLoading?: boolean;
  showAvatar: boolean;
  showUserName: boolean;
  showMessageTimestamp: boolean;
}

class MessageList extends Widget<Properties> {
  private _lastMessageDate?: null | string | number | Date;

  private _containerClientHeight!: number;

  private _isBottomReached!: boolean;

  private _scrollView!: ScrollView;

  private _typingIndicator!: TypingIndicator;

  private _$content!: dxElementWrapper;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      items: [],
      currentUserId: '',
      showDayHeaders: true,
      dayHeaderFormat: 'shortdate',
      messageTimestampFormat: 'shorttime',
      typingUsers: [],
      isLoading: false,
      showAvatar: true,
      showUserName: true,
      showMessageTimestamp: true,
      messageTemplate: null,
    };
  }

  _init(): void {
    super._init();

    this._lastMessageDate = null;
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGELIST_CLASS);

    super._initMarkup();

    this._renderScrollView();
    this._renderMessageListContent();
    this._toggleEmptyView();
    this._renderMessageGroups();
    this._renderTypingIndicator();

    this._updateAria();
    this._scrollDownContent();
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
      this._scrollDownContent();
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

    $emptyView.appendTo(this._$content);
  }

  _renderTypingIndicator(): void {
    const { typingUsers } = this.option();

    const $typingIndicator = $('<div>').appendTo(this._$scrollViewContent());

    this._typingIndicator = this._createComponent($typingIndicator, TypingIndicator, {
      typingUsers,
    });
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
    const {
      showAvatar,
      showUserName,
      showMessageTimestamp,
      messageTemplate,
      messageTimestampFormat,
    } = this.option();

    const $messageGroup = $('<div>').appendTo(this._$content);

    this._createComponent($messageGroup, MessageGroup, {
      items,
      alignment: this._messageGroupAlignment(userId),
      showAvatar,
      showUserName,
      showMessageTimestamp,
      messageTemplate,
      messageTimestampFormat,
    });
  }

  _renderScrollView(): void {
    const $scrollable = $('<div>')
      .appendTo(this.$element());

    this._scrollView = this._createComponent($scrollable, ScrollView, {
      useKeyboard: false,
      bounceEnabled: false,
      reachBottomText: '',
      indicateLoading: false,
      onReachBottom: noop,
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
    const { dayHeaderFormat } = this.option();
    this._lastMessageDate = deserializedDate;

    let headerDate = dateLocalization.format(deserializedDate, dayHeaderFormat);

    if (dateUtils.sameDate(deserializedDate, today)) {
      headerDate = `${messageLocalization.format('Today')} ${headerDate}`;
    }

    if (dateUtils.sameDate(deserializedDate, yesterday)) {
      headerDate = `${messageLocalization.format('Yesterday')} ${headerDate}`;
    }

    $('<div>')
      .addClass(CHAT_MESSAGELIST_DAY_HEADER_CLASS)
      .text(headerDate as string)
      .appendTo(this._$content);
  }

  _updateLoadingState(isLoading: boolean): void {
    if (!this._scrollView) {
      return;
    }

    this.$element().toggleClass(CHAT_MESSAGELIST_EMPTY_LOADING_CLASS, this._isEmpty() && isLoading);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._scrollView.release(!isLoading);
  }

  _renderMessageListContent(): void {
    this._$content = $('<div>')
      .addClass(CHAT_MESSAGELIST_CONTENT_CLASS)
      .appendTo(this._$scrollViewContent());
  }

  _toggleEmptyView(): void {
    this._getEmptyView().remove();

    const { isLoading } = this.option();

    this.$element()
      .toggleClass(CHAT_MESSAGELIST_EMPTY_CLASS, this._isEmpty() && !isLoading)
      .toggleClass(CHAT_MESSAGELIST_EMPTY_LOADING_CLASS, this._isEmpty() && isLoading);

    if (this._isEmpty() && !isLoading) {
      this._renderEmptyViewContent();
      this._updateLoadingState(false);
    }
  }

  _renderMessageGroups(): void {
    const { isLoading, items } = this.option();

    if (this._isEmpty() && !isLoading) {
      return;
    }

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

    this._setLastMessageGroupClasses();
    // @ts-expect-error
    this._updateLoadingState(isLoading);
  }

  _setLastMessageGroupClasses(): void {
    this._$content
      .find(`.${CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS}`)
      .removeClass(CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS);
    this._$content
      .find(`.${CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS}`)
      .removeClass(CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS);

    const $lastAlignmentStartGroup = this._$content.find(`.${CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS}`).last();
    const $lastAlignmentEndGroup = this._$content.find(`.${CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS}`).last();

    $lastAlignmentStartGroup.addClass(CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS);
    $lastAlignmentEndGroup.addClass(CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS);
  }

  _getLastMessageGroup(): MessageGroup | undefined {
    const $lastMessageGroup = this._$content.find(`.${CHAT_MESSAGEGROUP_CLASS}`).last();

    if ($lastMessageGroup.length) {
      return MessageGroup.getInstance($lastMessageGroup) as MessageGroup;
    }

    return undefined;
  }

  _renderMessage(message: Message): void {
    const { timestamp } = message;
    const shouldCreateDayHeader = this._shouldAddDayHeader(timestamp);

    if (shouldCreateDayHeader) {
      this._createDayHeader(timestamp);
      this._renderMessageIntoGroup(message);
      return;
    }

    const lastMessageGroup = this._getLastMessageGroup();

    if (!lastMessageGroup) {
      this._renderMessageIntoGroup(message);
      return;
    }

    const lastMessageGroupMessage = this._getLastMessageGroupItem(lastMessageGroup);
    const isTimeoutExceeded = this._isTimeoutExceeded(lastMessageGroupMessage, message);

    if (this._isSameAuthor(message, lastMessageGroupMessage) && !isTimeoutExceeded) {
      this._renderMessageIntoGroup(message, lastMessageGroup);
      return;
    }

    this._renderMessageIntoGroup(message);
  }

  _getLastMessageGroupItem(lastMessageGroup: MessageGroup): Message {
    const { items } = lastMessageGroup.option();

    return items[items.length - 1];
  }

  _isSameAuthor(lastMessageGroupMessage: Message, message: Message): boolean {
    return lastMessageGroupMessage.author?.id === message.author?.id;
  }

  _renderMessageIntoGroup(message: Message, messageGroup?: MessageGroup): void {
    const { author } = message;

    this._setIsReachedBottom();

    if (messageGroup) {
      messageGroup.renderMessage(message);
    } else {
      this._createMessageGroupComponent([message], author?.id);
      this._setLastMessageGroupClasses();
    }

    this._processScrollDownContent(this._isCurrentUser(author?.id));
  }

  _getMessageData(message: Element): Message {
    // @ts-expect-error
    return $(message).data(MESSAGE_DATA_KEY);
  }

  _findMessageElementByKey(key: string | number): dxElementWrapper {
    const $bubbles = this.$element().find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

    let result = $();

    $bubbles.each((_, item) => {
      const messageData = this._getMessageData(item);

      if (messageData.id === key) {
        result = $(item);
        return false;
      }

      return true;
    });

    return result;
  }

  _updateMessageByKey(key: string | number | undefined, data: Message): void {
    if (key) {
      const $targetMessage = this._findMessageElementByKey(key);

      const bubble = MessageBubble.getInstance($targetMessage);
      bubble.option('text', data.text);
    }
  }

  _removeMessageByKey(key: string | number | undefined): void {
    if (!key) {
      return;
    }

    const $targetMessage = this._findMessageElementByKey(key);

    if (!$targetMessage.length) {
      return;
    }

    const $currentMessageGroup = $targetMessage.closest(`.${CHAT_MESSAGEGROUP_CLASS}`);

    const group: MessageGroup = MessageGroup.getInstance($currentMessageGroup);

    const { items } = group.option();
    const newItems = items.filter((item) => item.id !== key);

    if (newItems.length === 0) {
      const { showDayHeaders } = this.option();

      if (showDayHeaders) {
        const $prev = group.$element().prev();
        const $next = group.$element().next();

        const shouldRemoveDayHeader = $prev.length
          && $prev.hasClass(CHAT_MESSAGELIST_DAY_HEADER_CLASS)
          && (($next.length && $next.hasClass(CHAT_MESSAGELIST_DAY_HEADER_CLASS)) || !$next.length);

        if (shouldRemoveDayHeader) {
          $prev.remove();
        }
      }
      group.$element().remove();
    } else {
      group.option('items', newItems);
    }

    this._setLastMessageGroupClasses();
  }

  _scrollDownContent(): void {
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
      this._toggleEmptyView();

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
      relevant: 'additions text',
    };

    this.setAria(aria);
  }

  _setIsReachedBottom(): void {
    // @ts-expect-error
    this._isBottomReached = !this._isContentOverflowing() || this._scrollView.isBottomReached();
  }

  _isContentOverflowing(): boolean {
    // @ts-expect-error
    return getHeight(this._scrollView.content()) > getHeight(this._scrollView.container());
  }

  _processScrollDownContent(shouldForceProcessing = false): void {
    if (this._isBottomReached || shouldForceProcessing) {
      this._scrollDownContent();
    }

    this._isBottomReached = false;
  }

  _$scrollViewContent(): dxElementWrapper {
    return $(this._scrollView.content());
  }

  _getEmptyView(): dxElementWrapper {
    return this._$content.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);
  }

  _clean(): void {
    this._lastMessageDate = null;

    super._clean();
  }

  _modifyByChanges(changes: DataChange<Message>[]): void {
    changes.forEach((change) => {
      switch (change.type) {
        case 'update':
          this._updateMessageByKey(change.key, change.data ?? {});
          break;
        case 'insert': {
          const { items } = this.option();
          this.option('items', [...items, change.data ?? {}]);
          break;
        }
        case 'remove':
          this._removeMessageByKey(change.key);
          break;
        default:
          break;
      }
    });
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'currentUserId':
      case 'showDayHeaders':
      case 'showAvatar':
      case 'showUserName':
      case 'showMessageTimestamp':
      case 'messageTemplate':
      case 'dayHeaderFormat':
      case 'messageTimestampFormat':
        this._invalidate();
        break;
      case 'items':
        this._processItemsUpdating(value ?? [], previousValue ?? []);
        break;
      case 'typingUsers':
        this._setIsReachedBottom();
        this._typingIndicator.option(name, value);
        this._processScrollDownContent();
        break;
      case 'isLoading':
        this._updateLoadingState(!!value);
        break;
      default:
        super._optionChanged(args);
    }
  }

  getEmptyViewId(): string | null {
    if (this._isEmpty()) {
      const $emptyView = this._getEmptyView();
      const emptyViewId = $emptyView.attr('id') ?? null;

      return emptyViewId;
    }

    return null;
  }
}

export default MessageList;
