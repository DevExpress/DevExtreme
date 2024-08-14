import type { Properties } from '@js/core/dom_component';
import DOMComponent from '@js/core/dom_component';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';

export interface ChatHeaderProperties extends Properties {
  title: string;
}

class ChatHeader extends DOMComponent<ChatHeaderProperties> {
  private _$text?: dxElementWrapper;

  _getDefaultOptions(): ChatHeaderProperties {
    return {
      // @ts-expect-error
      ...super._getDefaultOptions(),
      title: '',
    } as ChatHeaderProperties;
  }

  _init(): void {
    // @ts-expect-error
    super._init();

    $(this.element()).addClass(CHAT_HEADER_CLASS);
  }

  _initMarkup(): void {
    // @ts-expect-error
    super._initMarkup();

    this._renderText();
  }

  _renderText(): void {
    const { title } = this.option();

    this._$text = $('<div>')
      .addClass(CHAT_HEADER_TEXT_CLASS)
      .text(title)
      .appendTo(this.element());
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'title':
        // @ts-expect-error
        this._$text?.text(value);
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }
}

export default ChatHeader;
