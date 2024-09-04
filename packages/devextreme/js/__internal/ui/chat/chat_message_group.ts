import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateSerialization from '@js/core/utils/date_serialization';
import { isDefined } from '@js/core/utils/type';
import type { Message } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import Avatar from './chat_avatar';
import MessageBubble from './chat_message_bubble';

const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS = 'dx-chat-message-group-alignment-start';
const CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS = 'dx-chat-message-group-alignment-end';
const CHAT_MESSAGE_GROUP_INFORMATION_CLASS = 'dx-chat-message-group-information';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_AUTHOR_NAME_CLASS = 'dx-chat-message-author-name';
const CHAT_MESSAGE_BUBBLE_CONTAINER_CLASS = 'dx-chat-message-bubble-container';

export type MessageGroupAlignment = 'start' | 'end';

export interface Properties extends WidgetOptions<MessageGroup> {
  items: Message[];
  alignment: MessageGroupAlignment;
}

class MessageGroup extends Widget<Properties> {
  _avatar?: Avatar;

  _$messageBubbleContainer!: dxElementWrapper;

  _getDefaultOptions(): Properties {
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
    const { author } = items[0];
    const authorName = author?.name;
    const authorAvatarUrl = author?.avatarUrl;

    this._avatar = this._createComponent($avatar, Avatar, {
      name: authorName,
      url: authorAvatarUrl,
    });
  }

  _renderMessageBubble(message: Message): void {
    const $bubble = $('<div>');

    this._createComponent($bubble, MessageBubble, {
      text: message.text,
    });

    this._$messageBubbleContainer.append($bubble);
  }

  _renderMessageBubbles(items: Message[]): void {
    this._$messageBubbleContainer = $('<div>').addClass(CHAT_MESSAGE_BUBBLE_CONTAINER_CLASS);

    items.forEach((message) => {
      this._renderMessageBubble(message);
    });

    this._$messageBubbleContainer.appendTo(this.element());
  }

  _renderName(name: string, $element: dxElementWrapper): void {
    $('<div>')
      .addClass(CHAT_MESSAGE_AUTHOR_NAME_CLASS)
      .text(name)
      .appendTo($element);
  }

  _getTimeValue(timestamp: Date | string | number): string {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const date = dateSerialization.deserializeDate(timestamp);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return date.toLocaleTimeString(undefined, options);
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

  _optionChanged(args: OptionChanged<Properties>): void {
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

    this._renderMessageBubble(message);
  }
}

export default MessageGroup;
