import type { Format } from '@js/common/core/localization';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateSerialization from '@js/core/utils/date_serialization';
import { isDate, isDefined } from '@js/core/utils/type';
import type { ImageMessage, Message, TextMessage } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import Avatar from './avatar';
import type { Properties as MessageBubbleProperties } from './messagebubble';
import MessageBubble, {
  CHAT_MESSAGEBUBBLE_CLASS,
  MESSAGE_DATA_KEY,
} from './messagebubble';
import type { MessageTemplate } from './messagelist';

export const CHAT_MESSAGEGROUP_CLASS = 'dx-chat-messagegroup';
export const CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-messagegroup-alignment-start';
export const CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS = 'dx-chat-messagegroup-alignment-end';
const CHAT_MESSAGEGROUP_INFORMATION_CLASS = 'dx-chat-messagegroup-information';
const CHAT_MESSAGEGROUP_TIME_CLASS = 'dx-chat-messagegroup-time';
const CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS = 'dx-chat-messagegroup-author-name';
const CHAT_MESSAGEGROUP_CONTENT_CLASS = 'dx-chat-messagegroup-content';
const CHAT_MESSAGE_EDITED_CLASS = 'dx-chat-message-edited';
const CHAT_MESSAGE_EDITED_HIDING_CLASS = 'dx-chat-message-edited-hiding';
const CHAT_MESSAGE_EDITED_ICON_CLASS = 'dx-chat-message-edited-icon';
const CHAT_MESSAGE_EDITED_TEXT_CLASS = 'dx-chat-message-edited-text';

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
    $(this.element())
      .removeClass(CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS)
      .removeClass(CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS);

    const alignmentClass = this._isAlignmentStart()
      ? CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS
      : CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS;

    $(this.element())
      .addClass(alignmentClass);
  }

  _initMarkup(): void {
    const { items, showAvatar } = this.option();

    $(this.element())
      .addClass(CHAT_MESSAGEGROUP_CLASS);

    this._updateAlignmentClass();

    super._initMarkup();

    if (items.length === 0) {
      return;
    }

    if (showAvatar && this._isAlignmentStart()) {
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
      .data(MESSAGE_DATA_KEY, message)
      .appendTo(this._$messageBubbleContainer);

    this._createComponent($bubble, MessageBubble, this._getMessageBubbleOptions(message));
  }

  _getMessageBubbleOptions(message: Message): MessageBubbleProperties {
    const options: MessageBubbleProperties = {
      isDeleted: message.isDeleted,
      type: message.type,
    };

    const { messageTemplate } = this.option();

    if (message.type === 'image') {
      options.alt = (message as ImageMessage).alt;
      options.src = (message as ImageMessage).src;
    } else {
      options.text = (message as TextMessage).text;
    }

    if (messageTemplate) {
      options.template = (messageData, container): void => {
        messageTemplate({ ...message, ...messageData }, container);
      };
    }

    return options;
  }

  _renderMessageBubbles(items: Message[]): void {
    this._$messageBubbleContainer = $('<div>')
      .addClass(CHAT_MESSAGEGROUP_CONTENT_CLASS)
      .appendTo(this.element());

    items.forEach((message, index) => {
      const shouldCreateEditedElement = index !== 0 && message.type !== 'image' && (message as TextMessage).isEdited === true && !message.isDeleted;

      if (shouldCreateEditedElement) {
        const $edited = this._createEditedElement();

        $edited.appendTo(this._$messageBubbleContainer);
      }

      this._renderMessageBubble(message);
    });
  }

  _renderMessageGroupInformation(message: Message, shouldRenderEditedMessage?: boolean): void {
    const { showUserName, showMessageTimestamp } = this.option();
    const { timestamp, author } = message;
    const isEdited = isDefined(shouldRenderEditedMessage)
      ? shouldRenderEditedMessage
      : message.type !== 'image' && (message as TextMessage).isEdited;
    const isAlignmentStart = this._isAlignmentStart();

    this.$element().find(`.${CHAT_MESSAGEGROUP_INFORMATION_CLASS}`).remove();

    const $information = $('<div>')
      .addClass(CHAT_MESSAGEGROUP_INFORMATION_CLASS);

    if (showUserName) {
      const authorName = author?.name ?? messageLocalization.format('dxChat-defaultUserName');
      const authorNameText = isAlignmentStart ? authorName : '';

      $('<div>')
        .addClass(CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS)
        .text(authorNameText)
        .appendTo($information);
    }

    if (isEdited && !isAlignmentStart) {
      $information.append(this._createEditedElement());
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

    if (isEdited && isAlignmentStart) {
      $information.append(this._createEditedElement());
    }

    $information.appendTo(this.element());
  }

  _createEditedElement(): dxElementWrapper {
    const $edited = $('<div>')
      .addClass(CHAT_MESSAGE_EDITED_CLASS);

    $('<div>')
      .addClass(CHAT_MESSAGE_EDITED_ICON_CLASS)
      .appendTo($edited);

    const editedMessageText = messageLocalization.format('dxChat-editedMessageText');

    $('<div>')
      .addClass(CHAT_MESSAGE_EDITED_TEXT_CLASS)
      .text(editedMessageText)
      .appendTo($edited);

    return $edited;
  }

  _updateMessageEditedText($message: dxElementWrapper, isEdited = false): void {
    const $firstMessage = this._$messageBubbleContainer.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`).first();
    const removeWithAnimation = ($editedElement: dxElementWrapper): void => {
      $editedElement.get(0).addEventListener('animationend', () => {
        $editedElement.remove();
      }, { once: true });

      $editedElement.addClass(CHAT_MESSAGE_EDITED_HIDING_CLASS);
    };

    if ($message.is($firstMessage)) {
      const items = this.option('items');
      const $information = this.$element().find(`.${CHAT_MESSAGEGROUP_INFORMATION_CLASS}`);
      const $edited = $information.find(`.${CHAT_MESSAGE_EDITED_CLASS}`);

      if ($edited.length && isEdited) {
        return;
      }

      if ($edited.length && !isEdited) {
        removeWithAnimation($edited);

        return;
      }

      if (isEdited) {
        this._renderMessageGroupInformation(items[0], true);
      }

      return;
    }

    const $prevElement = $message.prev();

    if ($prevElement.hasClass(CHAT_MESSAGE_EDITED_CLASS)) {
      if (!isEdited) {
        removeWithAnimation($prevElement);
      }

      return;
    }

    if (isEdited) {
      const $edited = this._createEditedElement();
      $edited.insertBefore($message);
    }
  }

  _isAlignmentStart(): boolean {
    const { alignment } = this.option();

    return alignment === 'start';
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
