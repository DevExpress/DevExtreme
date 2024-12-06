import type { Format } from '@js/common/core/localization';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateSerialization from '@js/core/utils/date_serialization';
import { isDate } from '@js/core/utils/type';
import type { Message } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import Avatar from './avatar';
import type { Properties as MessageBubbleProperties } from './messagebubble';
import MessageBubble from './messagebubble';
import type { MessageTemplate } from './messagelist';

export const MESSAGE_DATA_KEY = 'dxMessageData';

export const CHAT_MESSAGEGROUP_CLASS = 'dx-chat-messagegroup';
export const CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-messagegroup-alignment-start';
export const CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS = 'dx-chat-messagegroup-alignment-end';
const CHAT_MESSAGEGROUP_INFORMATION_CLASS = 'dx-chat-messagegroup-information';
const CHAT_MESSAGEGROUP_TIME_CLASS = 'dx-chat-messagegroup-time';
const CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS = 'dx-chat-messagegroup-author-name';
const CHAT_MESSAGEGROUP_CONTENT_CLASS = 'dx-chat-messagegroup-content';

export type MessageGroupAlignment = 'start' | 'end';

export interface Properties extends WidgetOptions<MessageGroup> {
  items: Message[];
  alignment: MessageGroupAlignment;
  showAvatar: boolean;
  showUserName: boolean;
  showMessageTimestamp: boolean;
  messageTemplate?: MessageTemplate;
  messageTimestampFormat?: Format;
}

class MessageGroup extends Widget<Properties> {
  private _lastBubble?: MessageBubble | null;

  _avatar?: Avatar;

  _$messageBubbleContainer!: dxElementWrapper;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      items: [],
      alignment: 'start',
      showAvatar: true,
      showUserName: true,
      showMessageTimestamp: true,
      messageTemplate: null,
      messageTimestampFormat: 'shorttime',
    };
  }

  _updateAlignmentClass(): void {
    const { alignment } = this.option();

    $(this.element())
      .removeClass(CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS)
      .removeClass(CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS);

    const alignmentClass = alignment === 'start'
      ? CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS
      : CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS;

    $(this.element())
      .addClass(alignmentClass);
  }

  _initMarkup(): void {
    const { alignment, items, showAvatar } = this.option();

    $(this.element())
      .addClass(CHAT_MESSAGEGROUP_CLASS);

    this._updateAlignmentClass();

    super._initMarkup();

    if (items.length === 0) {
      return;
    }

    if (showAvatar && alignment === 'start') {
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
    const authorAvatarAlt = author?.avatarAlt;

    this._avatar = this._createComponent($avatar, Avatar, {
      name: authorName,
      url: authorAvatarUrl,
      alt: authorAvatarAlt,
    });
  }

  _renderMessageBubble(message: Message): void {
    const $bubble = $('<div>')
      .data(MESSAGE_DATA_KEY, message);

    this._createComponent($bubble, MessageBubble, this._getMessageBubbleOptions(message));

    this._$messageBubbleContainer.append($bubble);
  }

  _getMessageBubbleOptions(message: Message): MessageBubbleProperties {
    const options: MessageBubbleProperties = {
      text: message.text,
    };

    const { messageTemplate } = this.option();

    if (messageTemplate) {
      options.template = (text, container): void => {
        messageTemplate({ ...message, text }, container);
      };
    }

    return options;
  }

  _renderMessageBubbles(items: Message[]): void {
    this._$messageBubbleContainer = $('<div>').addClass(CHAT_MESSAGEGROUP_CONTENT_CLASS);

    items.forEach((message) => {
      this._renderMessageBubble(message);
    });

    this._$messageBubbleContainer.appendTo(this.element());
  }

  _renderMessageGroupInformation(message: Message): void {
    const { alignment, showUserName, showMessageTimestamp } = this.option();
    const { timestamp, author } = message;

    const $information = $('<div>')
      .addClass(CHAT_MESSAGEGROUP_INFORMATION_CLASS);

    if (showUserName) {
      const authorName = author?.name ?? messageLocalization.format('dxChat-defaultUserName');
      const authorNameText = alignment === 'start' ? authorName : '';

      $('<div>')
        .addClass(CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS)
        .text(authorNameText)
        .appendTo($information);
    }

    if (showMessageTimestamp) {
      const $time = $('<div>')
        .addClass(CHAT_MESSAGEGROUP_TIME_CLASS)
        .appendTo($information);

      const shouldAddTimeValue = this._shouldAddTimeValue(timestamp);

      if (shouldAddTimeValue) {
        const timeValue = this._getTimeValue(timestamp);
        $time.text(timeValue);
      }
    }

    $information.appendTo(this.element());
  }

  _shouldAddTimeValue(timestamp: Date | string | number | undefined): boolean {
    const deserializedDate = dateSerialization.deserializeDate(timestamp);

    return isDate(deserializedDate) && !isNaN(deserializedDate.getTime());
  }

  _getTimeValue(timestamp: Date | string | number | undefined): string {
    const deserializedDate = dateSerialization.deserializeDate(timestamp);

    const { messageTimestampFormat } = this.option();
    const formattedTime = dateLocalization.format(deserializedDate, messageTimestampFormat);

    return formattedTime as string;
  }

  _clean(): void {
    this._lastBubble = null;

    super._clean();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'items':
      case 'alignment':
      case 'showAvatar':
      case 'showUserName':
      case 'showMessageTimestamp':
      case 'messageTemplate':
      case 'messageTimestampFormat':
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
