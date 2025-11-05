import { normalizeKeyName } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight } from '@js/core/utils/size';
import type { DxEvent, NativeEventInfo } from '@js/events';
import type {
  ClickEvent,
  InitializedEvent,
} from '@js/ui/button';
import type Button from '@js/ui/button';
import type { Attachment } from '@js/ui/chat';
import type { UploadedEvent, UploadStartedEvent, ValueChangedEvent } from '@js/ui/file_uploader';
import { current, isMaterial } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';
import Toolbar from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import FileUploader from '@ts/ui/file_uploader/file_uploader';
import type { CancelButtonClickEvent, FileValidationErrorEvent, Properties as FileUploaderProperties } from '@ts/ui/file_uploader/file_uploader.types';
import Informer from '@ts/ui/informer/informer';
import type { TextAreaProperties } from '@ts/ui/m_text_area';
import TextArea from '@ts/ui/m_text_area';

const CHAT_TEXT_AREA_ATTACHMENTS = 'dx-chat-textarea-attachments';
export const CHAT_TEXT_AREA_ATTACH_BUTTON = 'dx-chat-textarea-attach-button';

export const CHAT_TEXTAREA_CLASS = 'dx-chat-textarea';
export const CHAT_TEXT_AREA_TOOLBAR = 'dx-chat-textarea-toolbar';

const MAX_ATTACHMENTS_COUNT = 10;
const INFORMER_DELAY = 10000;

const ERRORS = {
  // @ts-expect-error format params should be extended
  fileLimit: messageLocalization.format('dxChat-fileLimitReachedWarning', MAX_ATTACHMENTS_COUNT),
};

const isMobile = (): boolean => devices.current().deviceType !== 'desktop';

type EnterKeyEvent = NativeEventInfo<ChatTextArea, KeyboardEvent>;

export type SendEvent = ClickEvent | EnterKeyEvent;

type FileToSend = Attachment & {
  readyToSend: boolean;
};

export type Properties = TextAreaProperties & {
  fileUploaderOptions?: FileUploaderProperties;

  onSend?: (e: SendEvent) => void;
};

class ChatTextArea extends TextArea<Properties> {
  // eslint-disable-next-line no-restricted-globals
  _informerTimeoutId?: ReturnType<typeof setTimeout> | undefined;

  _informer?: Informer | null;

  _$toolbar?: dxElementWrapper | null;

  _toolbar?: Toolbar | null;

  _$fileUploader?: dxElementWrapper | null;

  _fileUploader?: FileUploader | null;

  _filesToSend?: Map<File, FileToSend>;

  _attachButton?: Button;

  _sendButton?: Button;

  _sendAction?: (e: Partial<SendEvent>) => void;

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
      stylingMode: 'outlined',
      placeholder: messageLocalization.format('dxChat-textareaPlaceholder'),
      autoResizeEnabled: true,
      valueChangeEvent: 'input',
      maxHeight: '16em',
      fileUploaderOptions: undefined,
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
    super._init();

    this._createSendAction();
  }

  _createSendAction(): void {
    this._sendAction = this._createActionByOption(
      'onSend',
      { excludeValidators: ['disabled'] },
    );
  }

  _initMarkup(): void {
    this.$element().addClass(CHAT_TEXTAREA_CLASS);
    super._initMarkup();
    this._renderToolbar();
    this._initFileUploader();
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
      this._cleanInformer();
      this._updateInputHeight();
    }, INFORMER_DELAY);
  }

  _renderToolbar(): void {
    const toolbarItems = this._getToolbarItems();

    const toolbarOptions = {
      items: toolbarItems,
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
    const { fileUploaderOptions } = this.option();

    const items = [
      this._getSendButtonConfig(),
    ];

    if (fileUploaderOptions) {
      items.push(this._getAttachButtonConfig());
    }

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
        onClick: (): void => {
          this._cleanInformer();
          this._updateInputHeight();
        },
        onInitialized: (e: InitializedEvent): void => {
          this._attachButton = e.component;
        },
      },
    } as ToolbarItem;

    return configuration;
  }

  _getSendButtonConfig(): ToolbarItem {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const configuration = {
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
          'aria-label': messageLocalization.format('dxChat-sendButtonAriaLabel'),
        },
        onClick: (e: ClickEvent): void => {
          this._processSendButtonActivation(e);
        },
        onInitialized: (e: InitializedEvent): void => {
          this._sendButton = e.component;
        },
      },
    } as ToolbarItem;

    return configuration;
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

    const multiple = fileUploaderOptions.multiple ?? true;
    const visible = this._shouldHideFileUploader(fileUploaderOptions.value);

    return {
      ...fileUploaderOptions,
      multiple,
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
    this._toggleButtonDisableState();
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

    this._toggleButtonDisableState();

    fileUploaderOptions.onUploaded?.(e);
  }

  _fileUploaderOnCancelButtonClick = (e: CancelButtonClickEvent): void => {
    const { file } = e;

    if (file) {
      this._filesToSend?.delete(file);
    }

    this._toggleButtonDisableState();
  };

  _fileUploaderFileLimitReached(): void {
    this._showInformer(ERRORS.fileLimit);
    this._updateInputHeight();
  }

  _fileUploaderFileValidationError(e: FileValidationErrorEvent): void {
    const { file } = e;

    this._addFileToMap(file);
  }

  _toggleButtonDisableState(state?: boolean): void {
    const shouldDisable = state ?? !this._isMessageCanBeSent();
    this._sendButton?.option('disabled', shouldDisable);
  }

  _renderButtonContainers(): void {}

  _getHeightDifference($input: dxElementWrapper): number {
    const baseDifference = super._getHeightDifference($input);

    const gap = parseFloat(this.$element().css('gap') ?? '0');

    const informerHeight = this._informer ? getOuterHeight(this._informer.$element()) : 0;
    const fileUploaderHeight = getOuterHeight(this._$fileUploader);
    const toolbarHeight = getOuterHeight(this._$toolbar);

    const visibleSections = [
      toolbarHeight,
      informerHeight,
      fileUploaderHeight,
    ].filter(Boolean).length;

    const totalExtraHeight = toolbarHeight
      + informerHeight
      + fileUploaderHeight
      + visibleSections * gap;

    const difference: number = baseDifference + totalExtraHeight;

    return difference;
  }

  _keyPressHandler(e: InputEvent): void {
    super._keyPressHandler(e);

    this._toggleButtonDisableState();
  }

  _processSendButtonActivation(e: Partial<SendEvent>): void {
    this._sendAction?.(e);
    this.reset();
    this.resetFileUploader();
    this._toggleButtonDisableState(true);
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
        break;

      case 'text': {
        this._toggleButtonDisableState();
        break;
      }

      case 'onSend':
        this._createSendAction();
        break;

      case 'fileUploaderOptions':
        this._handleFileUploaderOptionsChange(args);
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
