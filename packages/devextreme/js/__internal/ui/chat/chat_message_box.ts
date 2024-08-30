import $ from '@js/core/renderer';
import type { NativeEventInfo } from '@js/events';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type { Properties as DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

import type dxTextArea from '../../../ui/text_area';
import TextArea from '../m_text_area';

const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';

export type MessageSendEvent =
  NativeEventInfo<MessageBox, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> &
  { text?: string };

export interface Properties extends DOMComponentProperties<MessageBox> {
  onMessageSend?: (e: MessageSendEvent) => void;

  activeStateEnabled?: boolean;

  focusStateEnabled?: boolean;

  hoverStateEnabled?: boolean;
}

class MessageBox extends DOMComponent<MessageBox, Properties> {
  _textArea!: dxTextArea;

  _button!: Button;

  _messageSendAction?: (e: Partial<MessageSendEvent>) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      onMessageSend: undefined,
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
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
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $textArea = $('<div>')
      .addClass(CHAT_MESSAGE_BOX_TEXTAREA_CLASS)
      .appendTo(this.element());

    const configuration = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      placeholder: 'Type a message',
      autoResizeEnabled: true,
      // TODO: Add rules for different themes
      minHeight: '40px',
      // TODO: Add rules for different themes
      // TODO: Need get ML height and set into max-height 30% of it
      // maxHeight: '100%',
      maxHeight: '300px',
    };

    this._textArea = this._createComponent($textArea, TextArea, configuration);
  }

  _renderButton(): void {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $button = $('<div>')
      .addClass(CHAT_MESSAGE_BOX_BUTTON_CLASS)
      .appendTo(this.element());

    this._button = this._createComponent($button, Button, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      icon: 'send',
      type: 'default',
      stylingMode: 'text',
      onClick: (e): void => {
        this._sendHandler(e);
      },
    });
  }

  _createMessageSendAction(): void {
    this._messageSendAction = this._createActionByOption(
      'onMessageSend',
      { excludeValidators: ['disabled', 'readOnly'] },
    );
  }

  _sendHandler(e: ClickEvent): void {
    const { text } = this._textArea.option();

    if (!text?.trim()) {
      return;
    }

    this._messageSendAction?.({ text, event: e.event });
    this._textArea?.reset();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled': {
        this._button.option(name, value);
        this._textArea.option(name, value);

        break;
      }
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBox;
