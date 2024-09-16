import $ from '@js/core/renderer';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

const CHAT_BUBBLE_CLASS = 'dx-chat-bubble';

export interface Properties extends WidgetOptions<MessageBubble> {
  text?: string;
}

class MessageBubble extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      text: '',
    };
  }

  _initMarkup(): void {
    $(this.element())
      .addClass(CHAT_BUBBLE_CLASS);

    super._initMarkup();

    this._updateText();
  }

  _updateText(): void {
    const { text = '' } = this.option();

    $(this.element()).text(text);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
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
