import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { Message } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';
import Avatar from './chat_avatar';
import MessageBubble from './chat_message_bubble';

const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS = 'dx-chat-message-group-alignment-start';
const CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS = 'dx-chat-message-group-alignment-end';
const CHAT_MESSAGE_GROUP_INFORMATION_CLASS = 'dx-chat-message-group-information';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_AUTHOR_NAME_CLASS = 'dx-chat-message-author-name';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
const CHAT_MESSAGE_BUBBLE_FIRST_CLASS = 'dx-chat-message-bubble-first';
const CHAT_MESSAGE_BUBBLE_LAST_CLASS = 'dx-chat-message-bubble-last';

export type MessageGroupAlignment = 'start' | 'end';

export interface MessageGroupOptions extends WidgetOptions<MessageGroup> {
  items: Message[];
  alignment: MessageGroupAlignment;
}

class MessageGroup extends Widget<MessageGroupOptions> {
  _avatar?: Avatar;

  _getDefaultOptions(): MessageGroupOptions {
    return {
      ...super._getDefaultOptions(),
      items: [],
      alignment: 'start',
    };
  }

  _updateAlignmentClass(): void {
    const { alignment } = this.option();

    $(this.element())
      .removeClass(CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS)
      .removeClass(CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS);

    const alignmentClass = alignment === 'start'
      ? CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS
      : CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS;

    $(this.element())
      .addClass(alignmentClass);
  }

  _initMarkup(): void {
    const { alignment, items } = this.option();

    $(this.element())
      .addClass(CHAT_MESSAGE_GROUP_CLASS);

    this._updateAlignmentClass();

    super._initMarkup();

    if (items.length === 0) {
      return;
    }

    if (alignment === 'start') {
      this._renderAvatar();
    }

    this._renderMessageGroupInformation(items?.[0]);
    this._renderMessageBubbles(items);
  }

  _renderAvatar(): void {
    const $avatar = $('<div>').appendTo(this.element());

    const { items } = this.option();
    const authorName = items[0].author?.name;

    this._avatar = this._createComponent($avatar, Avatar, {
      name: authorName,
    });
  }

  _renderMessageBubble(message: Message, index: number, length: number): void {
    const $bubble = $('<div>');

    const isFirst = index === 0;
    const isLast = index === length - 1;

    if (isFirst) {
      $bubble.addClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS);
    }

    if (isLast) {
      $bubble.addClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS);
    }

    $bubble.appendTo(this.element());

    this._createComponent($bubble, MessageBubble, {
      text: message.text,
    });
  }

  _renderMessageBubbles(items: Message[]): void {
    items.forEach((message, index) => {
      this._renderMessageBubble(message, index, items.length);
    });
  }

  _renderName(name: string, $element: dxElementWrapper): void {
    $('<div>')
      .addClass(CHAT_MESSAGE_AUTHOR_NAME_CLASS)
      .text(name)
      .appendTo($element);
  }

  _getTimeValue(timestamp: string): string {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateTime = new Date(Number(timestamp));

    return dateTime.toLocaleTimeString(undefined, options);
  }

  _renderMessageGroupInformation(message: Message): void {
    const { timestamp, author } = message;

    const $information = $('<div>')
      .addClass(CHAT_MESSAGE_GROUP_INFORMATION_CLASS);

    $('<div>')
      .addClass(CHAT_MESSAGE_AUTHOR_NAME_CLASS)
      .text(author?.name ?? '')
      .appendTo($information);

    const $time = $('<div>')
      .addClass(CHAT_MESSAGE_TIME_CLASS)
      .appendTo($information);

    if (isDefined(timestamp)) {
      $time.text(this._getTimeValue(timestamp));
    }

    $information.appendTo(this.element());
  }

  _updateLastBubbleClasses(): void {
    const $bubbles = $(this.element()).find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);
    const $lastBubble = $bubbles.eq($bubbles.length - 1);

    $lastBubble.removeClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS);
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'items':
      case 'alignment':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }

  renderMessage(message: Message): void {
    const { items } = this.option();

    const newItems = [...items, message];

    this._setOptionWithoutOptionChange('items', newItems);

    this._updateLastBubbleClasses();
    this._renderMessageBubble(message, newItems.length - 1, newItems.length);
  }
}

export default MessageGroup;
