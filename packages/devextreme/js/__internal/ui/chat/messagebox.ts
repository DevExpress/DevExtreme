import $ from '@js/core/renderer';
import { throttle } from '@js/core/utils/throttle';
import type { NativeEventInfo } from '@js/events';
import messageLocalization from '@js/localization/message';
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

export const TYPING_START_DELAY = 1500;
export const TYPING_END_DELAY = 2000;

export type MessageSendEvent =
  NativeEventInfo<MessageBox, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> &
  { text?: string };

export type TypingStartEvent = NativeEventInfo<MessageBox, UIEvent & { target: HTMLInputElement }>;

export interface Properties extends DOMComponentProperties<MessageBox> {
  activeStateEnabled?: boolean;

  focusStateEnabled?: boolean;

  hoverStateEnabled?: boolean;

  onMessageSend?: (e: MessageSendEvent) => void;

  onTypingStart?: (e: TypingStartEvent) => void;

  onTypingEnd?: (e: NativeEventInfo<MessageBox>) => void;
}

class MessageBox extends DOMComponent<MessageBox, Properties> {
  _textArea!: dxTextArea;

  _button!: Button;

  _messageSendAction?: (e: Partial<MessageSendEvent>) => void;

  _typingStartAction?: (e: Partial<TypingStartEvent>) => void;

  _throttledTriggerTypingStartAction?: (e: Partial<TypingStartEvent>) => void;

  _typingEndAction?: () => void;

  _typingEndEventTimeout?: ReturnType<typeof setTimeout>;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      onMessageSend: undefined,
      onTypingStart: undefined,
      onTypingEnd: undefined,
    };
  }

  _init(): void {
    super._init();

    this._createMessageSendAction();
    this._createTypingStartAction();
    this._createTypingEndAction();

    this._wrapTriggerTypingStartEvent();
  }

  _wrapTriggerTypingStartEvent(): void {
    this._throttledTriggerTypingStartAction = throttle(
      this._triggerTypingStartAction,
      TYPING_START_DELAY,
    );
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

        this._onInputTriggerTypingEventsHandler(e);
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

  _onInputTriggerTypingEventsHandler(e: InputEvent): void {
    if (this._isValuableTextEntered()) {
      this._throttledTriggerTypingStartAction?.({ event: e.event });
    }
  }

  _createMessageSendAction(): void {
    this._messageSendAction = this._createActionByOption(
      'onMessageSend',
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
    clearTimeout(this._typingEndEventTimeout);

    this._typingEndEventTimeout = setTimeout(() => {
      this._typingEndAction?.();
    }, TYPING_END_DELAY);

    this._typingStartAction?.({ event: e.event });
  }

  _sendHandler(e: ClickEvent | EnterKeyEvent): void {
    if (!this._isValuableTextEntered()) {
      return;
    }

    clearTimeout(this._typingEndEventTimeout);

    this._typingEndAction?.();

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
    clearTimeout(this._typingEndEventTimeout);

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
