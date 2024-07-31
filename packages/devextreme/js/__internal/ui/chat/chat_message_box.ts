import $ from '@js/core/renderer';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type { MessageSendEvent } from '@js/ui/chat';

import type dxTextArea from '../../../ui/text_area';
import TextArea from '../m_text_area';
import Widget from '../widget';

const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';

export interface MessageBoxProperties {
  onMessageSend?: (e: MessageSendEvent) => void;
}

class MessageBox extends Widget<MessageBoxProperties> {
  _textArea?: dxTextArea;

  _button?: Button;

  _messageSendAction?: (e: Partial<MessageSendEvent>) => void;

  _getDefaultOptions(): MessageBoxProperties {
    return {
      ...super._getDefaultOptions(),
      onMessageSend: undefined,
    };
  }

  _init(): void {
    super._init();

    this._createMessageSendAction();
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

    this._button = this._createComponent($button, Button, {
      icon: 'send',
      stylingMode: 'text',
      onClick: (e): void => {
        this._buttonClickHandler(e);
      },
    });
  }

  _createMessageSendAction(): void {
    this._messageSendAction = this._createActionByOption(
      'onMessageSend',
      { excludeValidators: ['disabled', 'readOnly'] },
    );
  }

  _buttonClickHandler(e: ClickEvent): void {
    const text = this._textArea?.option('text');

    if (!text) {
      return;
    }

    this._messageSendAction?.({ text, event: e.event });
    this._textArea?.reset();
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBox;
