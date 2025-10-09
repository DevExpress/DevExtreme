import type { NativeEventInfo } from '@js/common/core/events';
import $, { type dxElementWrapper } from '@js/core/renderer';
import type { InteractionEvent } from '@js/events';
import type { ClickEvent } from '@js/ui/button';
import type { Properties as FileUploaderProperties } from '@js/ui/file_uploader';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { Properties as ChatTextAreaProperties } from '@ts/ui/chat/message_box/chat_text_area';
import ChatTextArea from '@ts/ui/chat/message_box/chat_text_area';
import EditingPreview from '@ts/ui/chat/message_box/editing_preview';

import type { EnterKeyEvent, InputEvent } from '../../../../ui/text_area';

export const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
export const CHAT_MESSAGEBOX_TEXTAREA_CONTAINER_CLASS = 'dx-chat-messagebox-textarea-container';
export const CHAT_MESSAGEBOX_TEXTAREA_CLASS = 'dx-chat-messagebox-textarea';
/** Probably should be removed */
export const CHAT_MESSAGEBOX_BUTTON_CLASS = 'dx-chat-messagebox-button';

export const TYPING_END_DELAY = 2000;
const ESCAPE_KEY = 'escape';

export type MessageEnteredEvent =
  NativeEventInfo<MessageBox, InteractionEvent> &
  { text?: string };

export type TypingStartEvent = NativeEventInfo<MessageBox, UIEvent & { target: HTMLInputElement }>;

export interface Properties extends DOMComponentProperties<MessageBox> {
  activeStateEnabled?: boolean;

  focusStateEnabled?: boolean;

  hoverStateEnabled?: boolean;

  fileUploaderOptions?: FileUploaderProperties;

  text?: string;

  onMessageEntered?: (e: MessageEnteredEvent) => void;

  onTypingStart?: (e: TypingStartEvent) => void;

  onTypingEnd?: (e: NativeEventInfo<MessageBox>) => void;

  onMessageEditCanceled?: () => void;

  onMessageUpdating?: (e: { text: string }) => void;
}

class MessageBox extends DOMComponent<MessageBox, Properties> {
  _textArea!: ChatTextArea;

  _editingPreview!: EditingPreview | null;

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
      fileUploaderOptions: undefined,
      text: '',
      onMessageEntered: undefined,
      onMessageEditCanceled: undefined,
      onMessageUpdating: undefined,
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

    if (this.option('text')) {
      this._renderEditingPreview();
    }

    this._renderTextAreaContainer();
  }

  _renderTextAreaContainer(): void {
    const $inputContainer = $('<div>')
      .addClass(CHAT_MESSAGEBOX_TEXTAREA_CONTAINER_CLASS)
      .appendTo(this.element());

    this._renderTextArea($inputContainer);
  }

  _cancelMessageEdit(): void {
    const { onMessageEditCanceled } = this.option();

    this.option('text', '');
    this._textArea.focus();
    onMessageEditCanceled?.();
  }

  _renderEditingPreview(): void {
    const $editingPreview = $('<div>').prependTo(this.element());
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      text,
    } = this.option();

    this._editingPreview = this._createComponent($editingPreview, EditingPreview, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      text,
      onCancel: () => this._cancelMessageEdit(),
    });
  }

  _renderTextArea($parent: dxElementWrapper): void {
    const $textArea = $('<div>').addClass(CHAT_MESSAGEBOX_TEXTAREA_CLASS);
    const textAreaOptions = this._getTextAreaOptions();

    $parent.append($textArea);

    this._textArea = this._createComponent(
      $textArea,
      ChatTextArea,
      textAreaOptions,
    );

    this._textArea.registerKeyHandler(ESCAPE_KEY, () => {
      if (this.option('text')) {
        this._cancelMessageEdit();
      }
    });
  }

  _getTextAreaOptions(): ChatTextAreaProperties {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const options = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      onInput: (e: InputEvent): void => {
        this._triggerTypingStartAction(e);
        this._updateTypingEndTimeout();
      },
      onSend: (e: ClickEvent | EnterKeyEvent): void => {
        this._sendHandler(e);
      },
    };

    return options as ChatTextAreaProperties;
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
    this._clearTypingEndTimeout();
    this._typingEndAction?.();

    const { text = '' } = this._textArea.option();
    const { text: previewText } = this.option();

    if (previewText) {
      const { onMessageUpdating } = this.option();

      onMessageUpdating?.({ text });

      return;
    }

    this._messageEnteredAction?.({ text, event: e.event });
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._textArea.option(name, value);
        this._editingPreview?.option(name, value);
        break;

      case 'fileUploaderOptions':
        this._textArea.option(name, value);
        break;

      case 'onMessageEntered':
        this._createMessageEnteredAction();
        break;

      case 'onTypingStart':
        this._createTypingStartAction();
        break;

      case 'onTypingEnd':
        this._createTypingEndAction();
        break;

      case 'text':
        this._updateEditingPreview(value);
        this._textArea.option('value', value);
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

  _updateEditingPreview(text: string | undefined): void {
    if (this._editingPreview) {
      this._editingPreview.option('text', text);

      if (!text) {
        this._editingPreview = null;
      }
    } else {
      this._renderEditingPreview();
    }
  }
}

export default MessageBox;
