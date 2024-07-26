import $ from '@js/core/renderer';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';

import type dxTextArea from '../../../ui/text_area';
import TextArea from '../m_text_area';
import Widget from '../widget';

const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';

export interface MessageBoxProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSendButtonClick?: any;
}

class MessageBox extends Widget<MessageBoxProperties> {
  _textArea?: dxTextArea;

  _button?: Button;

  _getDefaultOptions(): MessageBoxProperties {
    return {
      ...super._getDefaultOptions(),
      onSendButtonClick: undefined,
    };
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGE_BOX_CLASS);

    super._initMarkup();

    this._renderTextArea();
    this._renderButton();
  }

  _renderTextArea(): void {
    const $textArea = $('<div>')
      .addClass(CHAT_MESSAGE_BOX_TEXTAREA_CLASS)
      .appendTo(this.element());

    this._textArea = this._createComponent($textArea, TextArea, {});
  }

  _buttonClickHandler(): void {
    const { onSendButtonClick } = this.option();
    // @ts-expect-error
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { text } = this._textArea?.option();

    if (!onSendButtonClick || !text) {
      return;
    }

    onSendButtonClick(text);

    this._textArea?.option({ value: '' });
  }

  _renderButton(): void {
    const $button = $('<div>')
      .addClass(CHAT_MESSAGE_BOX_BUTTON_CLASS)
      .appendTo(this.element());

    const configuration: ButtonProperties = {
      icon: 'send',
      stylingMode: 'text',
      onClick: (): void => {
        this._buttonClickHandler();
      },
    };

    this._button = this._createComponent($button, Button, configuration);
  }
}

export default MessageBox;
