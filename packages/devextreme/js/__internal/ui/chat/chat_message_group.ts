/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';
import type { Message } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';
import MessageBubble from './chat_message_bubble';

const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS = 'dx-chat-message-group-alignment-start';
const CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS = 'dx-chat-message-group-alignment-end';
const CHAT_MESSAGE_GROUP_INFORMATION_CLASS = 'dx-chat-message-group-information';
const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_LETTERS_CLASS = 'dx-chat-message-avatar-letters';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_NAME_CLASS = 'dx-chat-message-name';

export interface MessageGroupOptions extends WidgetOptions<MessageGroup> {
  messages?: Message[];
  alignment?: 'start' | 'end';
}

class MessageGroup extends Widget<MessageGroupOptions> {
  _messageBubble?: MessageBubble;

  _getDefaultOptions(): MessageGroupOptions {
    return {
      ...super._getDefaultOptions(),
      ...{
        messages: [],
        alignment: 'start',
      },
    };
  }

  _initMarkup(): void {
    const { alignment, messages } = this.option();

    const alignmentClass = alignment === 'start'
      ? CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS
      : CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS;

    $(this.element())
      .addClass(CHAT_MESSAGE_GROUP_CLASS)
      .addClass(alignmentClass);

    super._initMarkup();

    if (alignment === 'start') {
      const authorName = (messages as any)?.[0].author.name;

      this._renderAvatar(authorName);
    }

    this._renderMessageGroupInformation(messages?.[0]);
    this._renderMessageBubbles(messages);
  }

  _renderMessageBubbles(messages): void {
    messages.forEach((message) => {
      this._messageBubble = this._createComponent($('<div>'), MessageBubble, {
        text: message.text,
      });

      $(this._messageBubble.element()).appendTo(this.element());
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

  _renderAvatar(authorName: string): void {
    const $avatar = $('<div>').addClass(CHAT_MESSAGE_AVATAR_CLASS);

    const initials = `${authorName.charAt(0).toUpperCase()}`;

    $('<div>')
      .addClass(CHAT_MESSAGE_AVATAR_LETTERS_CLASS)
      .text(initials)
      .appendTo($avatar);

    $avatar.appendTo(this.element());
  }
}

export default MessageGroup;
