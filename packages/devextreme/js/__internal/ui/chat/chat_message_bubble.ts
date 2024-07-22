/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
      ...{
        text: '',
      },
    };
  }

  _initMarkup(): void {
    const { text } = this.option();

    // $('<p>')
    $(this.element())
      .addClass(CHAT_MESSAGE_BUBBLE_CLASS)
      .text((text as any));

    super._initMarkup();
  }

  _updateText(value: any): void {
    $(`.${CHAT_MESSAGE_BUBBLE_CLASS}`).text(value);
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'text':
        this._updateText(value);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
