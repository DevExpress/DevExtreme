import '@js/ui/speech_to_text';

import { normalizeKeyName } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent, NativeEventInfo } from '@js/events';
import type {
  ButtonStyle,
  ButtonType,
  ClickEvent,
  InitializedEvent,
} from '@js/ui/button';
import type Button from '@js/ui/button';
import type { Attachment, SendButtonProperties } from '@js/ui/chat';
import type {
  UploadedEvent,
  UploadStartedEvent,
  ValueChangedEvent,
} from '@js/ui/file_uploader';
import type dxSpeechToText from '@js/ui/speech_to_text';
import type {
  EndEvent,
  InitializedEvent as InitializedSTTEvent,
  Properties as SpeechToTextProperties,
  ResultEvent,
  StartClickEvent,
  StopClickEvent,
} from '@js/ui/speech_to_text';
import { current, isMaterial } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';
import Toolbar from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import FileUploader from '@ts/ui/file_uploader/file_uploader';
import type {
  CancelButtonClickEvent,
  FileValidationErrorEvent,
  Properties as FileUploaderProperties,
} from '@ts/ui/file_uploader/file_uploader.types';
import Informer from '@ts/ui/informer/informer';
import type { TextAreaProperties } from '@ts/ui/text_area';
import TextArea from '@ts/ui/text_area';

type EnterKeyEvent = NativeEventInfo<ChatTextArea, KeyboardEvent>;

export type SendEvent = ClickEvent | EnterKeyEvent;

type FileToSend = Attachment & {
  readyToSend: boolean;
};

export type Properties = TextAreaProperties & {
  fileUploaderOptions?: FileUploaderProperties;

  speechToTextEnabled?: boolean;

  speechToTextOptions?: SpeechToTextProperties;

  sendButtonOptions?: SendButtonProperties;

  onSend?: (e: SendEvent) => void;
};

interface ButtonState {
  disabled?: boolean;
  stylingMode: ButtonStyle;
  type: ButtonType;
}

const CHAT_TEXT_AREA_ATTACHMENTS = 'dx-chat-textarea-attachments';
export const CHAT_TEXT_AREA_ATTACH_BUTTON = 'dx-chat-textarea-attach-button';

export const CHAT_TEXTAREA_CLASS = 'dx-chat-textarea';
export const CHAT_TEXT_AREA_TOOLBAR = 'dx-chat-textarea-toolbar';

const MAX_ATTACHMENTS_COUNT = 10;
const INFORMER_DELAY = 10000;

const ERROR_MESSAGE_NAME = {
  fileLimit: 'dxChat-fileLimitReachedWarning',
};

export const STT_INITIAL_STATE: ButtonState = {
  stylingMode: 'text',
  type: 'normal',
};

export const STT_LISTENING_STATE: ButtonState = {
  stylingMode: 'contained',
  type: 'default',
};

export const SEND_BUTTON_INITIAL_STATE: ButtonState = {
  stylingMode: 'text',
  type: 'normal',
  disabled: true,
};

export const SEND_BUTTON_READY_TO_SEND_STATE: ButtonState = {
  stylingMode: 'contained',
  type: 'default',
  disabled: false,
};

export const SEND_BUTTON_CUSTOM_ACTIVE_STATE: ButtonState = {
  stylingMode: 'contained',
  type: 'default',
  disabled: false,
};

const SEND_BUTTON_DEFAULT_ICON = 'arrowright';

const isMobile = (): boolean => devices.current().deviceType !== 'desktop';

export const DEFAULT_ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.rtf', '.csv', '.md'];

class ChatTextArea extends TextArea<Properties> {
  _informerTimeoutId?: ReturnType<typeof setTimeout> | undefined;

  _informer?: Informer | null;

  _$toolbar?: dxElementWrapper | null;

  _toolbar?: Toolbar | null;

  _$fileUploader?: dxElementWrapper | null;

  _fileUploader?: FileUploader | null;

  _filesToSend?: Map<File, FileToSend>;

  _initialInputText?: string;

  _attachButton?: Button;

  _sendButton?: Button;

  _speechToTextButton?: dxSpeechToText;

  _isSpeechToTextListening?: boolean;

  _sendAction?: (e: Partial<SendEvent>) => void;

  _sendButtonClickAction?: (e: Partial<ClickEvent>) => void;

  getAttachments(): Attachment[] | undefined {
    if (!this._filesToSend?.size) {
      return undefined;
    }

    return Array
      .from(this._filesToSend.values())
      .map(({ name, size }) => ({ name, size }));
  }

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      autoResizeEnabled: true,
      maxHeight: '53.86em',
      placeholder: messageLocalization.format('dxChat-textareaPlaceholder'),
      speechToTextEnabled: false,
      speechToTextOptions: undefined,
      stylingMode: 'outlined',
      valueChangeEvent: 'input',
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<Properties>[] {
    const rules = [
      ...super._defaultOptionsRules(),
      {
        device: (): boolean => isMaterial(current()),
        options: {
          stylingMode: 'outlined' as const,
        },
      },
    ];

    return rules;
  }

  _supportedKeys(): SupportedKeys {
    return {
      ...super._supportedKeys(),
      enter: (e: DxEvent<KeyboardEvent>): void => {
        if (this._shouldSendMessageOnEnter(e)) {
          e.preventDefault();
        }
      },
    };
  }

  _enterKeyHandlerUp(e: DxEvent<KeyboardEvent>): void {
    super._enterKeyHandlerUp(e);

    if (normalizeKeyName(e) !== 'enter') {
      return;
    }

    if (this._shouldSendMessageOnEnter(e)) {
      this._processSendButtonActivation({ event: e });
    }
  }

  _init(): void {
    this._initialInputText = '';

    super._init();

    this._createSendAction();
    this._createSendButtonClickAction();
  }

  _createSendAction(): void {
    this._sendAction = this._createActionByOption(
      'onSend',
      { excludeValidators: ['disabled'] },
    );
  }

  _createSendButtonClickAction(): void {
    const { sendButtonOptions } = this.option();

    this._sendButtonClickAction = this._createAction(
      sendButtonOptions?.onClick,
      { excludeValidators: ['disabled'] },
    );
  }

  _initMarkup(): void {
    this.$element().addClass(CHAT_TEXTAREA_CLASS);
    super._initMarkup();
    this._renderToolbar();
    this._initFileUploader();
    this._updateButtonsState();
  }

  _showInformer(text: string): void {
    if (this._informer) {
      this._informer.option({ text });
    } else {
      this._renderInformer(text);
    }

    this._updateInformerTimeout();
  }

  _renderInformer(text: string): void {
    const $informer = $('<div>').prependTo(this.$element());

    this._informer = this._createComponent(
      $informer,
      Informer,
      {
        text,
        contentAlignment: 'start',
        icon: 'errorcircle',
      },
    );
  }

  _updateInformerTimeout(): void {
    clearTimeout(this._informerTimeoutId);

    // eslint-disable-next-line no-restricted-globals
    this._informerTimeoutId = setTimeout(() => {
      this._processInformerCleaning();
    }, INFORMER_DELAY);
  }

  _renderToolbar(): void {
    const toolbarItems = this._getToolbarItems();

    const toolbarOptions = {
      items: toolbarItems,
      allowKeyboardNavigation: false,
    };

    this._$toolbar = $('<div>')
      .addClass(CHAT_TEXT_AREA_TOOLBAR)
      .appendTo(this.$element());

    this._toolbar = this._createComponent(
      this._$toolbar,
      Toolbar,
      toolbarOptions,
    );
  }

  _getToolbarItems(): ToolbarItem[] {
    const { fileUploaderOptions, speechToTextEnabled } = this.option();

    const items: ToolbarItem[] = [];

    if (fileUploaderOptions) {
      items.push(this._getAttachButtonConfig());
    }

    if (speechToTextEnabled) {
      items.push(this._getSpeechToTextButtonConfig());
    }

    items.push(this._getSendButtonConfig());

    return items;
  }

  _getAttachButtonConfig(): ToolbarItem {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const configuration = {
      widget: 'dxButton',
      location: 'before',
      options: {
        activeStateEnabled,
        focusStateEnabled,
        hoverStateEnabled,
        elementAttr: { class: CHAT_TEXT_AREA_ATTACH_BUTTON },
        icon: 'attach',
        onInitialized: (e: InitializedEvent): void => {
          this._attachButton = e.component;
        },
        onClick: (): void => this._processInformerCleaning(),
      },
    } as ToolbarItem;

    return configuration;
  }

  _getSpeechToTextButtonOptions(): SpeechToTextProperties {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      speechToTextOptions,
    } = this.option();

    const options = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      ...speechToTextOptions,
      ...STT_INITIAL_STATE,
      startIcon: 'micoutline',
      stopIcon: 'micfilled',
      onEnd: (e: EndEvent): void => {
        this._initialInputText = '';
        this._isSpeechToTextListening = false;
        this._updateButtonsState();

        speechToTextOptions?.onEnd?.(e);
      },
      onInitialized: (e: InitializedSTTEvent): void => {
        this._speechToTextButton = e.component;

        speechToTextOptions?.onInitialized?.(e);
      },
      onResult: (e: ResultEvent): void => this._resultHandler(e),
      onStartClick: (e: StartClickEvent): void => {
        const { text } = this.option();

        this._initialInputText = text;
        this._isSpeechToTextListening = true;
        this._updateButtonsState();

        speechToTextOptions?.onStartClick?.(e);
      },
      onStopClick: (e: StopClickEvent): void => {
        this._isSpeechToTextListening = false;
        this._updateButtonsState();

        speechToTextOptions?.onStopClick?.(e);
      },
    };

    return options;
  }

  _getSpeechToTextButtonConfig(): ToolbarItem {
    // @ts-expect-error dxSpeechToText should be added to ToolbarItemComponent
    const configuration = {
      widget: 'dxSpeechToText',
      location: 'after',
      options: this._getSpeechToTextButtonOptions(),
    } as ToolbarItem;

    return configuration;
  }

  _getSendButtonConfig(): ToolbarItem {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      sendButtonOptions,
    } = this.option();

    const configuration = {
      widget: 'dxButton',
      location: 'after',
      options: {
        activeStateEnabled,
        focusStateEnabled,
        hoverStateEnabled,
        icon: sendButtonOptions?.icon ?? SEND_BUTTON_DEFAULT_ICON,
        ...SEND_BUTTON_INITIAL_STATE,
        elementAttr: {
          'aria-label': messageLocalization.format('dxChat-sendButtonAriaLabel'),
        },
        onClick: (e: ClickEvent): void => {
          this._processSendButtonActivation(e);
          this._sendButtonClickAction?.(e);
        },
        onInitialized: (e: InitializedEvent): void => {
          this._sendButton = e.component;
        },
      },
    } as ToolbarItem;

    return configuration;
  }

  _resultHandler(e: ResultEvent): void {
    const { speechToTextOptions } = this.option();

    // @ts-expect-error SpeechRecognition API is not supported in TS
    const speechRecognitionResult = Object.values(e.event.results)
    // @ts-expect-error SpeechRecognition API is not supported in TS
      .map((resultItem) => (resultItem[0].transcript as string).trim())
      .join(' ');

    const result = `${this._initialInputText} ${speechRecognitionResult}`.trim();

    this.option({ value: result });

    speechToTextOptions?.onResult?.(e);
  }

  _initFileUploader(): void {
    const { fileUploaderOptions } = this.option();

    if (!fileUploaderOptions) {
      return;
    }

    this._renderFileUploader();
    this._filesToSend = new Map<File, FileToSend>();
  }

  _renderFileUploader(): void {
    if (!this._$textEditorContainer) {
      return;
    }

    this._$fileUploader = $('<div>')
      .addClass(CHAT_TEXT_AREA_ATTACHMENTS)
      .insertBefore(this._$textEditorContainer);

    this._fileUploader = this._createComponent(
      this._$fileUploader,
      FileUploader,
      this._getFileUploaderOptions(),
    );
  }

  _shouldHideFileUploader(value: File[] = []): boolean {
    return value.length !== 0;
  }

  _getFileUploaderOptions(): FileUploaderProperties {
    const { fileUploaderOptions = {} } = this.option();

    const visible = this._shouldHideFileUploader(fileUploaderOptions.value);

    const defaultFileUploaderOptions = {
      multiple: true,
      allowedFileExtensions: DEFAULT_ALLOWED_FILE_EXTENSIONS,
    };

    return {
      ...defaultFileUploaderOptions,
      ...fileUploaderOptions,
      visible,
      uploadMode: 'instantly',
      dialogTrigger: this.$element().find(`.${CHAT_TEXT_AREA_ATTACH_BUTTON}`).get(0),
      _hideCancelButtonOnUpload: false,
      _showFileIcon: true,
      _cancelButtonPosition: 'end',
      _maxFileCount: MAX_ATTACHMENTS_COUNT,
      onValueChanged: (e) => this._fileUploaderOnValueChanged(e),
      onUploadStarted: (e) => this._fileUploaderOnUploadStarted(e),
      onUploaded: (e) => this._fileUploaderOnUploaded(e),
      onCancelButtonClick: (e) => this._fileUploaderOnCancelButtonClick(e),
      onFileLimitReached: () => this._fileUploaderFileLimitReached(),
      onFileValidationError: (e) => this._fileUploaderFileValidationError(e),
    };
  }

  _fileUploaderOnValueChanged(e: ValueChangedEvent): void {
    const { value, component } = e;
    const { fileUploaderOptions = {} } = this.option();

    component.option('visible', this._shouldHideFileUploader(value));
    this._updateInputHeight();
    fileUploaderOptions.onValueChanged?.(e);
  }

  _addFileToMap(file: File): void {
    this._filesToSend?.set(file, {
      readyToSend: false,
      name: file.name,
      size: file.size,
    });
    this._updateButtonsState();
  }

  _fileUploaderOnUploadStarted(e: UploadStartedEvent): void {
    const { file } = e;

    this._addFileToMap(file);

    const { fileUploaderOptions = {} } = this.option();
    fileUploaderOptions.onUploadStarted?.(e);
  }

  _fileUploaderOnUploaded(e: UploadedEvent): void {
    const { file } = e;
    const { fileUploaderOptions = {} } = this.option();
    const fileInfo = this._filesToSend?.get(file);

    if (this._filesToSend && fileInfo) {
      this._filesToSend.set(file, {
        ...fileInfo,
        readyToSend: true,
      });
    }

    this._updateButtonsState();

    fileUploaderOptions.onUploaded?.(e);
  }

  _fileUploaderOnCancelButtonClick = (e: CancelButtonClickEvent): void => {
    const { file } = e;

    if (file) {
      this._filesToSend?.delete(file);
    }

    this._updateButtonsState();
  };

  _fileUploaderFileLimitReached(): void {
    this._showInformer(messageLocalization.format(
      ERROR_MESSAGE_NAME.fileLimit,
      // @ts-expect-error format params should be extended
      MAX_ATTACHMENTS_COUNT,
    ));
    this._updateInputHeight();
  }

  _fileUploaderFileValidationError(e: FileValidationErrorEvent): void {
    const { file } = e;

    this._addFileToMap(file);
  }

  _updateButtonsState(): void {
    const { speechToTextEnabled } = this.option();

    if (this._isSpeechToTextListening === true && speechToTextEnabled) {
      this._speechToTextButton?.option(STT_LISTENING_STATE);
      this._sendButton?.option(SEND_BUTTON_INITIAL_STATE);

      return;
    }

    if (this._isMessageCanBeSent()) {
      this._speechToTextButton?.option(STT_INITIAL_STATE);
      this._sendButton?.option(SEND_BUTTON_READY_TO_SEND_STATE);

      return;
    }

    if (this._isCustomBehavior()) {
      this._speechToTextButton?.option(STT_INITIAL_STATE);
      this._sendButton?.option(SEND_BUTTON_CUSTOM_ACTIVE_STATE);
      return;
    }

    this._speechToTextButton?.option(STT_INITIAL_STATE);
    this._sendButton?.option(SEND_BUTTON_INITIAL_STATE);
  }

  _renderButtonContainers(): void {}

  _getAdjustedMaxHeight(maxHeight: number): number {
    return maxHeight;
  }

  _getMaxHeight(): number | undefined {
    const cssValue = this._input().css('maxHeight');

    if (!cssValue || cssValue === 'none') {
      return undefined;
    }

    const maxHeight = parseFloat(cssValue);

    return maxHeight;
  }

  _keyPressHandler(e: { originalEvent: InputEvent & KeyboardEvent }): void {
    super._keyPressHandler(e);

    this._updateButtonsState();
  }

  _isCustomBehavior(): boolean {
    const { sendButtonOptions } = this.option();

    return sendButtonOptions?.action === 'custom';
  }

  _processSendButtonActivation(e: Partial<SendEvent>): void {
    if (this._isCustomBehavior()) {
      this._updateButtonsState();
      return;
    }

    this._sendAction?.(e);
    this.clear();
    this.resetFileUploader();
    this._updateButtonsState();
  }

  _shouldSendMessageOnEnter(e: DxEvent<KeyboardEvent>): boolean {
    return !e?.shiftKey && this._isMessageCanBeSent() && !isMobile();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._sendButton?.option(name, value);
        this._speechToTextButton?.option(name, value);
        break;

      case 'text':
        this._processInformerCleaning();
        this._updateButtonsState();
        break;

      case 'onSend':
        this._createSendAction();
        break;

      case 'fileUploaderOptions':
        this._handleFileUploaderOptionsChange(args);
        break;

      case 'speechToTextEnabled':
        this._toolbar?.option({ items: this._getToolbarItems() });
        this._speechToTextButton = undefined;
        this._isSpeechToTextListening = false;
        this._updateButtonsState();
        break;

      case 'speechToTextOptions':
        this._speechToTextButton?.option(this._getSpeechToTextButtonOptions());
        break;

      case 'sendButtonOptions':
        this._handleSendButtonOptionsChange();
        break;

      default:
        super._optionChanged(args);
    }
  }

  _handleFileUploaderOptionsChange(args: OptionChanged<Properties>): void {
    const { fullName, value, previousValue } = args;

    if (fullName === 'fileUploaderOptions' && (!value || !previousValue)) {
      this._cleanToolbar();
      this._renderToolbar();
      this._cleanFileUploader();
      this._initFileUploader();

      return;
    }

    const options = Widget.getOptionsFromContainer(args);
    this._fileUploader?.option(options);
  }

  _handleSendButtonOptionsChange(): void {
    const { sendButtonOptions } = this.option();

    this._createSendButtonClickAction();

    this._sendButton?.option({
      onClick: (e: ClickEvent): void => {
        this._processSendButtonActivation(e);
        this._sendButtonClickAction?.(e);
      },
      icon: sendButtonOptions?.icon ?? SEND_BUTTON_DEFAULT_ICON,
    });

    this._updateButtonsState();
  }

  _isValuableTextEntered(): boolean {
    const { text } = this.option();

    return Boolean(text?.trim());
  }

  _getFilesArray(): FileToSend[] {
    return this._filesToSend ? Array.from(this._filesToSend.values()) : [];
  }

  _areFilesReadyToSend(): boolean {
    if (!this._filesToSend?.size) {
      return false;
    }

    return this._getFilesArray().every((file) => file.readyToSend);
  }

  _isMessageCanBeSent(): boolean {
    const hasText = this._isValuableTextEntered();
    const hasReadyFiles = this._areFilesReadyToSend();
    const hasUnreadyFiles = this._filesToSend && this._getFilesArray()
      .some((file) => !file.readyToSend);

    return !hasUnreadyFiles && (hasText || hasReadyFiles);
  }

  _cleanFileUploader(): void {
    this._fileUploader?.dispose();
    this._$fileUploader?.remove();
    this._fileUploader = null;
    this._$fileUploader = null;
  }

  _processInformerCleaning(): void {
    this._cleanInformer();
    this._updateInputHeight();
  }

  _cleanInformer(): void {
    this._clearInformerTimeout();
    this._removeInformer();
  }

  _removeInformer(): void {
    this._informer?.dispose();
    this._informer?.$element().remove();
    this._informer = null;
  }

  _clearInformerTimeout(): void {
    clearTimeout(this._informerTimeoutId);

    this._informerTimeoutId = undefined;
  }

  _cleanToolbar(): void {
    this._toolbar?.dispose();
    this._$toolbar?.remove();
    this._toolbar = null;
    this._$toolbar = null;
  }

  _dispose(): void {
    this._speechToTextButton = undefined;
    this._cleanFileUploader();
    this._cleanToolbar();
    this._cleanInformer();
    super._dispose();
  }

  resetFileUploader(): void {
    this._fileUploader?.reset();
    this._filesToSend?.clear();
  }

  toggleAttachButtonVisibleState(state: boolean): void {
    this._attachButton?.option('visible', state);
  }
}

export default ChatTextArea;
