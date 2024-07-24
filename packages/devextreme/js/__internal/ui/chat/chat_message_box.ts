import $ from '@js/core/renderer';
import Button from '@js/ui/button';

import type dxTextArea from '../../../ui/text_area';
import TextArea from '../m_text_area';
import Widget from '../widget';

const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class MessageBox extends Widget<any> {
  _textArea?: dxTextArea;

  _button?: Button;

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGE_BOX_CLASS);

    super._initMarkup();

    this._renderTextArea();
    this._renderButton();
  }

  _renderTextArea(): void {
    this._textArea = this._createComponent($('<div>'), TextArea, {});

    $(this._textArea.element())
      .addClass(CHAT_MESSAGE_BOX_TEXTAREA_CLASS)
      .appendTo(this.element());
  }

  _renderButton(): void {
    this._button = this._createComponent($('<div>'), Button, {
      icon: 'send',
      stylingMode: 'text',
    });

    $(this._button.element())
      .addClass(CHAT_MESSAGE_BOX_BUTTON_CLASS)
      .appendTo(this.element());
  }
}

export default MessageBox;
