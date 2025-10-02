import type { NativeEventInfo } from '@js/common/core/events';
import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import $, { type dxElementWrapper } from '@js/core/renderer';
import type { InteractionEvent } from '@js/events';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
import type Button from '@js/ui/button';
import type { Properties as ToolbarProperties } from '@js/ui/toolbar';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import EditingPreview from '@ts/ui/chat/editing_preview';
import type { Properties as TextAreaOnSteroidsProperties } from '@ts/ui/text_area/text_area_with_toolbar';
import TextAreaOnSteroids from '@ts/ui/text_area/text_area_with_toolbar';

import type { EnterKeyEvent, InputEvent } from '../../../ui/text_area';

export const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
export const CHAT_MESSAGEBOX_INPUT_CONTAINER_CLASS = 'dx-chat-messagebox-input-container';
export const CHAT_MESSAGEBOX_TEXTAREA_CLASS = 'dx-chat-messagebox-textarea';
export const CHAT_MESSAGEBOX_BUTTON_CLASS = 'dx-chat-messagebox-button';

export const TYPING_END_DELAY = 2000;
const ESCAPE_KEY = 'escape';

export type MessageEnteredEvent =
  NativeEventInfo<MessageBox, InteractionEvent> &
  { text?: string };

export type TypingStartEvent = NativeEventInfo<MessageBox, UIEvent & { target: HTMLInputElement }>;

const isMobile = (): boolean => devices.current().deviceType !== 'desktop';

export interface Properties extends DOMComponentProperties<MessageBox> {
  activeStateEnabled?: boolean;

  focusStateEnabled?: boolean;

  hoverStateEnabled?: boolean;

  text?: string;

  toolbarItems?: ToolbarProperties['items'];

  onMessageEntered?: (e: MessageEnteredEvent) => void;

  onTypingStart?: (e: TypingStartEvent) => void;

  onTypingEnd?: (e: NativeEventInfo<MessageBox>) => void;

  onMessageEditCanceled?: () => void;

  onMessageUpdating?: (e: { text: string }) => void;
}

class MessageBox extends DOMComponent<MessageBox, Properties> {
  _textArea!: TextAreaOnSteroids;

  _sendButton?: Button;

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
      onMessageEntered: undefined,
      onTypingStart: undefined,
      onTypingEnd: undefined,
      onMessageEditCanceled: undefined,
      onMessageUpdating: undefined,
      text: '',
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

    this._renderInputContainer();
  }

  _renderInputContainer(): void {
    const $messageBox = $('<div>')
      .addClass(CHAT_MESSAGEBOX_INPUT_CONTAINER_CLASS)
      .appendTo(this.element());

    this._renderTextArea($messageBox);
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
      TextAreaOnSteroids,
      textAreaOptions,
    );

    this._textArea.registerKeyHandler('enter', (event: KeyboardEvent) => {
      if (!event.shiftKey && this._isValuableTextEntered() && !isMobile()) {
        event.preventDefault();
      }
    });

    this._textArea.registerKeyHandler(ESCAPE_KEY, () => {
      if (this.option('text')) {
        this._cancelMessageEdit();
      }
    });
  }

  _getTextAreaOptions(): TextAreaOnSteroidsProperties {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const toolbarItems = this._getToolbarItems();

    const options = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      toolbarOptions: {
        items: toolbarItems,
      },
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
        if (isMobile()) {
          return;
        }

        if (!e.event?.shiftKey) {
          this._sendHandler(e);
        }
      },
    };

    return options as TextAreaOnSteroidsProperties;
  }

  _getToolbarItems(): ToolbarProperties['items'] {
    const { toolbarItems } = this.option();

    const items = [
      ...this._getDefaultBeforeToolbarItems() ?? [],
      ...toolbarItems ?? [],
      ...this._getDefaultAfterToolbarItems() ?? [],
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return items;
  }

  _getDefaultBeforeToolbarItems(): ToolbarProperties['items'] {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const items = [
      {
        widget: 'dxButton',
        location: 'before',
        options: {
          activeStateEnabled,
          focusStateEnabled,
          hoverStateEnabled,
          icon: 'attach',
          onClick: (): void => {
            // eslint-disable-next-line no-alert
            alert('attach');
          },
        },
      },
    ];

    return items;
  }

  _getDefaultAfterToolbarItems(): ToolbarProperties['items'] {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      /** Filter items if unavailable */
      // speechToTextEnabled,
      // attachmentsEnabled,
    } = this.option();

    const items = [
      {
        widget: 'dxSpeechToText',
        location: 'after',
        options: {
          activeStateEnabled,
          focusStateEnabled,
          hoverStateEnabled,
          stylingMode: 'text',
        },
      },
      {
        widget: 'dxButton',
        location: 'after',
        options: {
          activeStateEnabled,
          focusStateEnabled,
          hoverStateEnabled,
          icon: 'arrowright',
          type: 'default',
          stylingMode: 'contained',
          disabled: true,
          elementAttr: {
            class: CHAT_MESSAGEBOX_BUTTON_CLASS,
            'aria-label': messageLocalization.format('dxChat-sendButtonAriaLabel'),
          },
          onClick: (e): void => {
            this._sendHandler(e);
          },
          onInitialized: (e): void => {
            this._sendButton = e.component;
          },
        } as ButtonProperties,
      },
    ];

    return items;
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

    const { text = '' } = this._textArea.option();

    const { text: previewText } = this.option();

    if (previewText) {
      const { onMessageUpdating } = this.option();

      onMessageUpdating?.({ text });

      return;
    }

    this._textArea.reset();
    this._toggleButtonDisableState(true);

    this._messageEnteredAction?.({ text, event: e.event });
  }

  _toggleButtonDisableState(state: boolean): void {
    this._sendButton?.option('disabled', state);
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
        this._sendButton?.option(name, value);
        this._textArea.option(name, value);
        this._editingPreview?.option(name, value);
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
      case 'text':
        this._updateEditingPreview(value);
        this._updateInputContainer(value);

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

  _updateInputContainer(value: string | undefined): void {
    this._textArea.option('value', value);

    const shouldButtonBeDisabled = !this._isValuableTextEntered();

    this._toggleButtonDisableState(shouldButtonBeDisabled);
  }
}

export default MessageBox;
