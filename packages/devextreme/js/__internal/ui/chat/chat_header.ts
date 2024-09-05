import type { Properties as DOMComponentProperties } from '@js/core/dom_component';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';

export interface Properties extends DOMComponentProperties {
  title: string;
}

class ChatHeader extends DOMComponent<ChatHeader, Properties> {
  private _$text!: dxElementWrapper;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      title: '',
    } as Properties;
  }

  _init(): void {
    super._init();

    $(this.element()).addClass(CHAT_HEADER_CLASS);
  }

  _initMarkup(): void {
    super._initMarkup();

    this._renderTextElement();
    this._updateText();
  }

  _renderTextElement(): void {
    this._$text = $('<div>')
      .addClass(CHAT_HEADER_TEXT_CLASS)
      .appendTo(this.element());
  }

  _updateText(): void {
    const { title } = this.option();

    this._$text.text(title);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'title':
        this._updateText();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default ChatHeader;
