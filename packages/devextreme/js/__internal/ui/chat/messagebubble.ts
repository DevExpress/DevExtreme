import messageLocalization from '@js/common/core/localization/message';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import { ICON_CLASS } from '@ts/core/utils/m_icon';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

export const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
export const CHAT_MESSAGEBUBBLE_DELETED_CLASS = 'dx-chat-messagebubble-deleted';
export const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
export const CHAT_MESSAGEBUBBLE_ICON_PROHIBITION_CLASS = `${ICON_CLASS}-cursorprohibition`;

export interface Properties extends WidgetOptions<MessageBubble> {
  text?: string;
  isDeleted?: boolean;
  template?: ((text: string, container: Element) => void) | null;
}

class MessageBubble extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      text: '',
      isDeleted: false,
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

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'text':
      case 'isDeleted':
      case 'template':
        this._updateContent();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
