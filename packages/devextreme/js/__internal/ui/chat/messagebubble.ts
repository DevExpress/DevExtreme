import messageLocalization from '@js/common/core/localization/message';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import { ICON_CLASS } from '@ts/core/utils/m_icon';
import { isDefined } from '@ts/core/utils/m_type';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

export const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
export const CHAT_MESSAGEBUBBLE_DELETED_CLASS = 'dx-chat-messagebubble-deleted';
export const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
export const CHAT_MESSAGEBUBBLE_ICON_PROHIBITION_CLASS = `${ICON_CLASS}-cursorprohibition`;

export const MESSAGE_DATA_KEY = 'dxMessageData';

export interface Properties extends WidgetOptions<MessageBubble> {
  text?: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  template?: ((text: string, container: Element) => void) | null;
}

class MessageBubble extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      text: '',
      isDeleted: false,
      isEdited: false,
      template: null,
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
      text = '',
      isDeleted = false,
      template,
    } = this.option();
    this.$element().removeClass(CHAT_MESSAGEBUBBLE_DELETED_CLASS);

    const $bubbleContainer = $(this.element()).find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);
    $bubbleContainer.empty();

    if (template) {
      template(text, getPublicElement($bubbleContainer));

      return;
    }

    if (isDeleted) {
      this.$element().addClass(CHAT_MESSAGEBUBBLE_DELETED_CLASS);

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

    $bubbleContainer.text(text);
  }

  _updateMessageData(property: string, value: string | boolean | undefined) {
    const messageData = this.$element().data(MESSAGE_DATA_KEY) || {};

    messageData[property] = value;
    this.$element().data(MESSAGE_DATA_KEY, messageData);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'text':
      case 'isDeleted':
        this._updateMessageData(name, value);
        this._updateContent();
        break;
      case 'template':
        this._updateContent();
        break;
      case 'isEdited':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
