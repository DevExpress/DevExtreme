import type { NativeEventInfo } from '@js/common/core/events';
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type { Properties as DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

import type { EnterKeyEvent, InputEvent } from '../../../ui/text_area';
import type dxTextArea from '../../../ui/text_area';
import TextArea from '../m_text_area';

const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
const CHAT_MESSAGEBOX_TEXTAREA_CLASS = 'dx-chat-messagebox-textarea';
const CHAT_MESSAGEBOX_BUTTON_CLASS = 'dx-chat-messagebox-button';

export const TYPING_END_DELAY = 2000;

export type MessageEnteredEvent =
  NativeEventInfo<MessageBox, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> &
  { text?: string };

export type TypingStartEvent = NativeEventInfo<MessageBox, UIEvent & { target: HTMLInputElement }>;

export interface Properties extends DOMComponentProperties<MessageBox> {
  activeStateEnabled?: boolean;

  focusStateEnabled?: boolean;

  hoverStateEnabled?: boolean;

  onMessageEntered?: (e: MessageEnteredEvent) => void;

  onTypingStart?: (e: TypingStartEvent) => void;

  onTypingEnd?: (e: NativeEventInfo<MessageBox>) => void;
}

class MessageBox extends DOMComponent<MessageBox, Properties> {
  _textArea!: dxTextArea;

  _button!: Button;

  _messageEnteredAction?: (e: Partial<MessageEnteredEvent>) => void;

  _typingStartAction?: (e: Partial<TypingStartEvent>) => void;

  _typingEndAction?: () => void;

  // eslint-disable-next-line no-restricted-globals
  _typingEndTimeoutId?: ReturnType<typeof setTimeout> | undefined;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      onMessageEntered: undefined,
      onTypingStart: undefined,
      onTypingEnd: undefined,
    };
  }

  _init(): void {
    super._init();

    this._createMessageEnteredAction();
    this._createTypingStartAction();
    this._createTypingEndAction();
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
      placeholder: messageLocalization.format('dxChat-textareaPlaceholder'),
      autoResizeEnabled: true,
      valueChangeEvent: 'input',
      maxHeight: '8em',
      onInput: (e: InputEvent): void => {
        const shouldButtonBeDisabled = !this._isValuableTextEntered();

        this._toggleButtonDisableState(shouldButtonBeDisabled);

        this._triggerTypingStartAction(e);
        this._updateTypingEndTimeout();
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
      elementAttr: { 'aria-label': messageLocalization.format('dxChat-sendButtonAriaLabel') },
      onClick: (e): void => {
        this._sendHandler(e);
      },
    });
  }

  _createMessageEnteredAction(): void {
    this._messageEnteredAction = this._createActionByOption(
      'onMessageEntered',
      { excludeValidators: ['disabled'] },
    );
  }

  _createTypingStartAction(): void {
    this._typingStartAction = this._createActionByOption(
      'onTypingStart',
      { excludeValidators: ['disabled'] },
    );
  }

  _createTypingEndAction(): void {
    this._typingEndAction = this._createActionByOption(
      'onTypingEnd',
      { excludeValidators: ['disabled'] },
    );
  }

  _triggerTypingStartAction(e: InputEvent): void {
    if (!this._typingEndTimeoutId) {
      this._typingStartAction?.({ event: e.event });
    }
  }

  _updateTypingEndTimeout(): void {
    clearTimeout(this._typingEndTimeoutId);

    // eslint-disable-next-line no-restricted-globals
    this._typingEndTimeoutId = setTimeout(() => {
      this._typingEndAction?.();

      this._clearTypingEndTimeout();
    }, TYPING_END_DELAY);
  }

  _clearTypingEndTimeout(): void {
    clearTimeout(this._typingEndTimeoutId);

    this._typingEndTimeoutId = undefined;
  }

  _sendHandler(e: ClickEvent | EnterKeyEvent): void {
    if (!this._isValuableTextEntered()) {
      return;
    }

    this._clearTypingEndTimeout();
    this._typingEndAction?.();

    const { text } = this._textArea.option();

    this._textArea.reset();
    this._toggleButtonDisableState(true);

    this._messageEnteredAction?.({ text, event: e.event });
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
      case 'onMessageEntered':
        this._createMessageEnteredAction();

        break;
      case 'onTypingStart':
        this._createTypingStartAction();

        break;
      case 'onTypingEnd':
        this._createTypingEndAction();

        break;
      default:
        super._optionChanged(args);
    }
  }

  _clean(): void {
    this._clearTypingEndTimeout();

    super._clean();
  }

  updateInputAria(emptyViewId: string | null): void {
    this._textArea.option({
      inputAttr: {
        'aria-labelledby': emptyViewId,
      },
    });
  }
}

export default MessageBox;
