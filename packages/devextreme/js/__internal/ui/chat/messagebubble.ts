import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

export const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';

export interface Properties extends WidgetOptions<MessageBubble> {
  text?: string;
  template?: ((text: string, container: Element) => void) | null;
}

class MessageBubble extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      text: '',
      template: null,
    };
  }

  _initMarkup(): void {
    $(this.element())
      .addClass(CHAT_MESSAGEBUBBLE_CLASS);

    super._initMarkup();

    this._updateContent();
  }

  _updateContent(): void {
    const {
      text = '',
      template,
    } = this.option();
    const $bubbleContainer = $(this.element());

    $bubbleContainer.empty();

    if (template) {
      template(text, getPublicElement($bubbleContainer));

      return;
    }

    $bubbleContainer.text(text);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'text':
      case 'template':
        this._updateContent();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
