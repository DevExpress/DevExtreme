import $ from '@js/core/renderer';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';

const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';

export interface MessageBubbleOptions extends WidgetOptions<MessageBubble> {
  text?: string;
}

class MessageBubble extends Widget<MessageBubbleOptions> {
  _getDefaultOptions(): MessageBubbleOptions {
    return {
      ...super._getDefaultOptions(),
      text: '',
    };
  }

  _initMarkup(): void {
    $(this.element())
      .addClass(CHAT_MESSAGE_BUBBLE_CLASS);

    super._initMarkup();

    this._updateText();
  }

  _updateText(): void {
    const { text = '' } = this.option();

    $(this.element()).text(text);
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'text':
        this._updateText();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
