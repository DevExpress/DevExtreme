/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';
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
const CHAT_MESSAGE_NAME_CLASS = 'dx-chat-message-name';
const CHAT_MESSAGE_BUBBLE_FIRST_CLASS = 'dx-chat-message-bubble-first';
const CHAT_MESSAGE_BUBBLE_LAST_CLASS = 'dx-chat-message-bubble-last';

export interface MessageGroupOptions extends WidgetOptions<MessageGroup> {
  messages?: Message[];
  alignment?: 'start' | 'end';
}

class MessageGroup extends Widget<MessageGroupOptions> {
  _avatar?: Avatar;

  _getDefaultOptions(): MessageGroupOptions {
    return {
      ...super._getDefaultOptions(),
      ...{
        messages: [],
        alignment: 'start',
      },
    };
  }

  _getAlignmentClass(): string {
    const { alignment } = this.option();

    const alignmentClass = alignment === 'start'
      ? CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS
      : CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS;

    return alignmentClass;
  }

  _initMarkup(): void {
    const { alignment, messages } = this.option();

    const alignmentClass = this._getAlignmentClass();

    $(this.element())
      .addClass(CHAT_MESSAGE_GROUP_CLASS)
      .addClass(alignmentClass);

    super._initMarkup();

    if (alignment === 'start') {
      const authorName = (messages as any)?.[0].author.name;
      const initials = `${authorName.charAt(0).toUpperCase()}`;

      this._avatar = this._createComponent($('<div>'), Avatar, {
        text: initials,
      });

      $(this._avatar.element()).appendTo(this.element());
    }

    this._renderMessageGroupInformation(messages?.[0]);
    this._renderMessageBubbles(messages);
  }

  _renderMessageBubbles(messages): void {
    messages.forEach((message, index) => {
      const messageBubble: MessageBubble = this._createComponent($('<div>'), MessageBubble, {
        text: message.text,
      });

      const $element = $(messageBubble.element());

      const isFirst = index === 0;
      const isLast = index === messages.length - 1;

      if (isFirst) {
        $element.addClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS);
      }

      if (isLast) {
        $element.addClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS);
      }

      $element.appendTo(this.element());
    });
  }

  _renderName(name, $element): void {
    $('<div>')
      .addClass(CHAT_MESSAGE_NAME_CLASS)
      .text(name)
      .appendTo($element);
  }

  _renderTime(timestamp, $element): void {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateTime = new Date(Number(timestamp));
    const dateTimeString = dateTime.toLocaleTimeString(undefined, options);

    $('<div>')
      .addClass(CHAT_MESSAGE_TIME_CLASS)
      .text(dateTimeString)
      .appendTo($element);
  }

  _renderMessageGroupInformation(message): void {
    const { timestamp, author } = message;
    const $messageGroupInformation = $('<div>').addClass(CHAT_MESSAGE_GROUP_INFORMATION_CLASS);

    this._renderName(author.name, $messageGroupInformation);
    this._renderTime(timestamp, $messageGroupInformation);

    $messageGroupInformation.appendTo(this.element());
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'messages':
      case 'alignment':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageGroup;
