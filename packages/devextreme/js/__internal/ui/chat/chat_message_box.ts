import $ from '@js/core/renderer';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _sendButtonClickAction?: any;

  _getDefaultOptions(): MessageBoxProperties {
    return {
      ...super._getDefaultOptions(),
      onSendButtonClick: undefined,
    };
  }

  _init(): void {
    super._init();

    this._initSendButtonClickAction();
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

  _renderButton(): void {
    const $button = $('<div>')
      .addClass(CHAT_MESSAGE_BOX_BUTTON_CLASS)
      .appendTo(this.element());

    const configuration: ButtonProperties = {
      icon: 'send',
      stylingMode: 'text',
      onClick: (e): void => {
        this._buttonClickHandler(e);
      },
    };

    this._button = this._createComponent($button, Button, configuration);
  }

  _initSendButtonClickAction(): void {
    this._sendButtonClickAction = this._createActionByOption('onSendButtonClick');
  }

  _buttonClickHandler(e: ClickEvent): void {
    const { onSendButtonClick } = this.option();
    // @ts-expect-error
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { text } = this._textArea?.option();

    if (!onSendButtonClick || !text) {
      return;
    }

    this._sendButtonClickAction({ text, event: e.event });
    this._textArea?.option({ value: '' });
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'onSendButtonClick':
        this._initSendButtonClickAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBox;
