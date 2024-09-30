import $ from '@js/core/renderer';
import type { NativeEventInfo } from '@js/events';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type { Properties as DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

import type { EnterKeyEvent } from '../../../ui/text_area';
import type dxTextArea from '../../../ui/text_area';
import TextArea from '../m_text_area';

const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
const CHAT_MESSAGEBOX_TEXTAREA_CLASS = 'dx-chat-messagebox-textarea';
const CHAT_MESSAGEBOX_BUTTON_CLASS = 'dx-chat-messagebox-button';

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
    $(this.element()).addClass(CHAT_MESSAGEBOX_CLASS);

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
      .addClass(CHAT_MESSAGEBOX_TEXTAREA_CLASS)
      .appendTo(this.element());

    this._textArea = this._createComponent($textArea, TextArea, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      stylingMode: 'outlined',
      placeholder: 'Type a message',
      autoResizeEnabled: true,
      valueChangeEvent: 'input',
      maxHeight: '8em',
      onInput: (): void => {
        const shouldButtonBeDisabled = !this._isValuableTextEntered();

        this._toggleButtonDisableState(shouldButtonBeDisabled);
      },
      onEnterKey: (e: EnterKeyEvent): void => {
        if (!e.event?.shiftKey) {
          this._sendHandler(e);
        }
      },
    });

    this._textArea.registerKeyHandler('enter', (event: KeyboardEvent) => {
      if (!event.shiftKey && this._isValuableTextEntered()) {
        event.preventDefault();
      }
    });
  }

  _renderButton(): void {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $button = $('<div>')
      .addClass(CHAT_MESSAGEBOX_BUTTON_CLASS)
      .appendTo(this.element());

    this._button = this._createComponent($button, Button, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      icon: 'sendfilled',
      type: 'default',
      stylingMode: 'text',
      disabled: true,
      elementAttr: { 'aria-label': 'Send' },
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

  _sendHandler(e: ClickEvent | EnterKeyEvent): void {
    if (!this._isValuableTextEntered()) {
      return;
    }

    const { text } = this._textArea.option();

    this._textArea.reset();
    this._toggleButtonDisableState(true);

    this._messageSendAction?.({ text, event: e.event });
  }

  _toggleButtonDisableState(state: boolean): void {
    this._button.option('disabled', state);
  }

  _isValuableTextEntered(): boolean {
    const { text } = this._textArea.option();

    return !!text?.trim();
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

  updateTextAreaAria(emptyViewId: string | null): void {
    this._textArea.option({
      inputAttr: {
        'aria-labelledby': emptyViewId,
      },
    });
  }
}

export default MessageBox;
