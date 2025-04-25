import messageLocalization from '@js/common/core/localization/message';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { Message } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import { ICON_CLASS } from '@ts/core/utils/m_icon';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

export const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
export const CHAT_MESSAGEBUBBLE_DELETED_CLASS = 'dx-chat-messagebubble-deleted';
export const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
export const CHAT_MESSAGEBUBBLE_ICON_PROHIBITION_CLASS = `${ICON_CLASS}-cursorprohibition`;
const CHAT_MESSAGEBUBBLE_IMAGE_CLASS = 'dx-chat-messagebubble-image';

export const MESSAGE_DATA_KEY = 'dxMessageData';

export interface Properties extends WidgetOptions<MessageBubble> {
  message: Message;
  isDeleted: boolean;
  isEdited: boolean;
  template?: ((message: Message, container: Element) => void) | null;
}

class MessageBubble extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      isDeleted: false,
      isEdited: false,
      template: null,
      message: {},
    };
  }

  _initMarkup(): void {
    const $element = $(this.element());

    $element.addClass(CHAT_MESSAGEBUBBLE_CLASS);

    $('<div>')
      .addClass(CHAT_MESSAGEBUBBLE_CONTENT_CLASS)
      .appendTo($element);

    super._initMarkup();

    this._updateContent();
  }

  _updateContent(): void {
    const {
      template,
      message,
    } = this.option();
    this.$element().removeClass(CHAT_MESSAGEBUBBLE_DELETED_CLASS);

    const $bubbleContainer = $(this.element()).find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);
    $bubbleContainer.empty();

    if (template) {
      template(message, getPublicElement($bubbleContainer));

      return;
    }

    if (message.type === 'text' && message.isDeleted) {
      const icon = $('<div>')
        .addClass(ICON_CLASS)
        .addClass(CHAT_MESSAGEBUBBLE_ICON_PROHIBITION_CLASS);

      const deletedMessage = $('<div>')
        .text(messageLocalization.format('dxChat-deletedMessageText'));

      $bubbleContainer
        .append(icon)
        .append(deletedMessage);

      return;
    }

    switch (message.type) {
      case 'image':
        $('<img>')
          .attr('src', message.src)
          .attr('alt', message.alt ?? '')
          .addClass(CHAT_MESSAGEBUBBLE_IMAGE_CLASS)
          .appendTo($bubbleContainer);
        break;
      case 'text':
      default:
        $bubbleContainer.text(message.text ?? '');
    }
  }

  _updateMessageData(property: string, value: string | boolean | undefined): void {
    const messageData = this.$element().data(MESSAGE_DATA_KEY) || {};

    messageData[property] = value;
    this.$element().data(MESSAGE_DATA_KEY, messageData);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'message':
      case 'template':
        this._updateContent();
        break;
      case 'isEdited':
        this._updateMessageData(name, value);
        break;
      case 'isDeleted':
        this._updateMessageData(name, value);
        this._updateContent();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
