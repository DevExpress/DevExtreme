import type { NativeEventInfo } from '@js/common/core/events';
import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import $, { type dxElementWrapper } from '@js/core/renderer';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type { Properties as FileUploaderProperties } from '@js/ui/file_uploader';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import EditingPreview from '@ts/ui/chat/editing_preview';
import FileUploader from '@ts/ui/file_uploader';
import TextArea from '@ts/ui/m_text_area';

import type { EnterKeyEvent, InputEvent } from '../../../ui/text_area';

export const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
export const CHAT_MESSAGEBOX_INPUT_CONTAINER_CLASS = 'dx-chat-messagebox-input-container';
export const CHAT_MESSAGEBOX_FILE_UPLOADER_CLASS = 'dx-chat-messagebox-file-uploader';
export const CHAT_MESSAGEBOX_TEXTAREA_CLASS = 'dx-chat-messagebox-textarea';
export const CHAT_MESSAGEBOX_FILE_UPLOADING_BUTTON_CLASS = 'dx-chat-messagebox-file-uploading-button';
export const CHAT_MESSAGEBOX_BUTTON_CLASS = 'dx-chat-messagebox-button';

export const TYPING_END_DELAY = 2000;
const ESCAPE_KEY = 'escape';

export type MessageEnteredEvent =
  NativeEventInfo<MessageBox, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> &
  { text?: string };

export type TypingStartEvent = NativeEventInfo<MessageBox, UIEvent & { target: HTMLInputElement }>;

export interface FileInfo {
  isUploaded?: boolean;
  fileName?: string;
  downloadUrl?: string;
  fileSize?: number;
}

const isMobile = (): boolean => devices.current().deviceType !== 'desktop';

export interface Properties extends DOMComponentProperties<MessageBox> {
  activeStateEnabled?: boolean;

  focusStateEnabled?: boolean;

  hoverStateEnabled?: boolean;

  onMessageEntered?: (e: MessageEnteredEvent) => void;

  onTypingStart?: (e: TypingStartEvent) => void;

  onTypingEnd?: (e: NativeEventInfo<MessageBox>) => void;

  onMessageEditCanceled?: () => void;

  onMessageUpdating?: (e: { text: string }) => void;

  text?: string;

  fileUploaderOptions?: FileUploaderProperties;
}

class MessageBox extends DOMComponent<MessageBox, Properties> {
  _textArea!: TextArea;

  _fileUploader!: FileUploader;

  _fileUploadingButton!: Button;

  _filesToSend?: Map<File, FileInfo>;

  _button!: Button;

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
      fileUploaderOptions: {},
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
    this._renderUploadingButton($messageBox);
    this._renderButton($messageBox);
    this._renderFileUploader(this.$element());
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

  _renderFileUploader($parent: dxElementWrapper): void {
    const $fileUploader = $('<div>').addClass(CHAT_MESSAGEBOX_FILE_UPLOADER_CLASS);
    const { fileUploaderOptions } = this.option();
    $parent.prepend($fileUploader);
    this._filesToSend = new Map();

    this._fileUploader = this._createComponent($fileUploader, FileUploader, {
      ...fileUploaderOptions,
      dialogTrigger: this._fileUploadingButton?.element(),
      visible: false,
      onValueChanged: ({ component, value }) => {
        component.option('visible', value !== undefined && value.length > 0);
      },
      onUploadStarted: ({ file }) => {
        this._filesToSend?.set(file, {
          isUploaded: false,
          fileName: file.name,
          fileSize: file.size,
        });
        const shouldButtonBeDisabled = !this._isSendButtonActive();

        this._toggleButtonDisableState(shouldButtonBeDisabled);
      },
      onUploaded: ({ file }) => {
        const fileInfo = this._filesToSend?.get(file) ?? {};
        fileInfo.isUploaded = true;

        const shouldButtonBeDisabled = !this._isSendButtonActive();
        this._toggleButtonDisableState(shouldButtonBeDisabled);
      },
      // uploadMode: 'useButtons',
      uploadMode: 'instantly',
    });
  }

  _renderTextArea($parent: dxElementWrapper): void {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $textArea = $('<div>').addClass(CHAT_MESSAGEBOX_TEXTAREA_CLASS);

    $parent.append($textArea);

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
        const shouldButtonBeDisabled = !this._isSendButtonActive();

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
    });

    this._textArea.registerKeyHandler('enter', (event: KeyboardEvent) => {
      if (!event.shiftKey && this._isSendButtonActive() && !isMobile()) {
        event.preventDefault();
      }
    });

    this._textArea.registerKeyHandler(ESCAPE_KEY, () => {
      if (this.option('text')) {
        this._cancelMessageEdit();
      }
    });
  }

  _renderUploadingButton($parent: dxElementWrapper): void {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $button = $('<div>').addClass(CHAT_MESSAGEBOX_FILE_UPLOADING_BUTTON_CLASS);

    $parent.append($button);

    this._fileUploadingButton = this._createComponent<Button, ButtonProperties>($button, Button, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      icon: 'attach',
      type: 'default',
      stylingMode: 'text',
    });
  }

  _renderButton($parent: dxElementWrapper): void {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $button = $('<div>').addClass(CHAT_MESSAGEBOX_BUTTON_CLASS);

    $parent.append($button);

    this._button = this._createComponent<Button, ButtonProperties>($button, Button, {
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
    if (!this._isSendButtonActive()) {
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

    const messageEnteredArgs = { text, event: e.event };

    if (this._filesToSend?.size) {
      // @ts-expect-error
      messageEnteredArgs.attachments = this._getAttachments();
    }
    this._filesToSend?.clear();
    this._fileUploader?.clear();

    this._messageEnteredAction?.(messageEnteredArgs);
  }

  _getAttachments(): FileInfo[] | undefined {
    if (!this._filesToSend?.size) {
      return undefined;
    }
    return Array.from(this._filesToSend.values())
      .filter(({ isUploaded }) => Boolean(isUploaded))
      .map(({ fileName, fileSize, downloadUrl }) => ({ fileName, fileSize, downloadUrl }));
  }

  _toggleButtonDisableState(state: boolean): void {
    this._button.option('disabled', state);
  }

  _isSendButtonActive(): boolean {
    const { text } = this._textArea.option();
    let allFilesAreReady = false;

    if (this._filesToSend?.size) {
      allFilesAreReady = Array.from(this._filesToSend.values())
        .every((fileInfo) => fileInfo.isUploaded === true);
    }

    return !!text?.trim() || allFilesAreReady;
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled': {
        this._button.option(name, value);
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

    const shouldButtonBeDisabled = !this._isSendButtonActive();

    this._toggleButtonDisableState(shouldButtonBeDisabled);
  }
}

export default MessageBox;
