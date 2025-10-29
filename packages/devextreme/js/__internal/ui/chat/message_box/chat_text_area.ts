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
import type { CancelButtonClickEvent, Properties as FileUploaderProperties } from '@ts/ui/file_uploader/file_uploader.types';
import type { TextAreaProperties } from '@ts/ui/m_text_area';
import TextArea from '@ts/ui/m_text_area';

export const TEXT_AREA_TOOLBAR = 'dx-textarea-toolbar';
const TEXT_AREA_ATTACHMENTS = 'dx-textarea-attachments';
const TEXT_AREA_ATTACH_BUTTON = 'dx-textarea-attach-button';

const isMobile = (): boolean => devices.current().deviceType !== 'desktop';

type EnterKeyEvent = NativeEventInfo<ChatTextArea, KeyboardEvent>;

export type SendEvent = ClickEvent | EnterKeyEvent;

type FileToUpload = Attachment & {
  readyToSend: boolean;
};

export type Properties = TextAreaProperties & {
  fileUploaderOptions?: FileUploaderProperties;

  onSend?: (e: SendEvent) => void;
};

class ChatTextArea extends TextArea<Properties> {
  _$toolbar?: dxElementWrapper | null;

  _toolbar?: Toolbar | null;

  _fileUploader?: FileUploader;

  _filesToSend?: Map<File, FileToUpload>;

  _sendButton?: Button;

  _sendAction?: (e: SendEvent) => void;

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
      maxHeight: '8em',
      valueChangeEvent: 'input',
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
      this._processSendButtonActivation({
        component: this,
        element: this.element(),
        event: e,
      });
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
    super._initMarkup();
    this._renderToolbar();
    this._renderFileUploader();
  }

  _renderToolbar(): void {
    this._toolbar?.dispose();
    this._$toolbar?.remove();

    const toolbarItems = this._getToolbarItems();

    const toolbarOptions = {
      items: toolbarItems,
    };

    this._$toolbar = $('<div>')
      .addClass(TEXT_AREA_TOOLBAR)
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
      items.push(this._getFileUploaderButtonConfig());
    }

    return items;
  }

  _getFileUploaderButtonConfig(): ToolbarItem {
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
        elementAttr: { class: TEXT_AREA_ATTACH_BUTTON },
        icon: 'attach',
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

  _renderFileUploader(): void {
    let $fileUploader = this._fileUploader?.$element();
    this._fileUploader?.dispose();
    $fileUploader?.remove();

    const { fileUploaderOptions } = this.option();

    if (!fileUploaderOptions) {
      return;
    }

    $fileUploader = $('<div>')
      .addClass(TEXT_AREA_ATTACHMENTS)
      .insertBefore(this._$textEditorContainer);

    this._fileUploader = this._createComponent(
      $fileUploader,
      FileUploader,
      this._getFileUploaderOptions(),
    );

    this._filesToSend = new Map<File, FileToUpload>();
  }

  _shouldHideFileUploader(value: File[] = []): boolean {
    return value.length !== 0;
  }

  _getFileUploaderOptions(): FileUploaderProperties {
    const { fileUploaderOptions = {} } = this.option();
    const multiple = fileUploaderOptions.multiple ?? true;
    const visible = this._shouldHideFileUploader(fileUploaderOptions.value);
    const onValueChanged = (e: ValueChangedEvent): void => {
      const { value, component } = e;

      component.option('visible', this._shouldHideFileUploader(value));

      fileUploaderOptions.onValueChanged?.(e);
    };
    const onUploadStarted = (e: UploadStartedEvent): void => {
      const { file } = e;

      this._filesToSend?.set(file, {
        readyToSend: false,
        name: file.name,
        size: file.size,
      });
      const shouldButtonBeDisabled = !this._isMessageCanBeSent();
      this._toggleButtonDisableState(shouldButtonBeDisabled);

      fileUploaderOptions.onUploadStarted?.(e);
    };
    const onUploaded = (e: UploadedEvent): void => {
      const { file } = e;
      const fileInfo = this._filesToSend?.get(file);

      if (fileInfo) {
        fileInfo.readyToSend = true;
      }

      const shouldButtonBeDisabled = !this._isMessageCanBeSent();
      this._toggleButtonDisableState(shouldButtonBeDisabled);

      fileUploaderOptions.onUploaded?.(e);
    };
    const onCancelButtonClick = (e: CancelButtonClickEvent): void => {
      const { file } = e;

      if (file) {
        this._filesToSend?.delete(file);
      }

      const shouldButtonBeDisabled = !this._isMessageCanBeSent();
      this._toggleButtonDisableState(shouldButtonBeDisabled);
    };

    return {
      ...fileUploaderOptions,
      uploadMode: 'instantly',
      dialogTrigger: $(`.${TEXT_AREA_ATTACH_BUTTON}`).get(0),
      _hideCancelButtonOnUpload: false,
      _showFileIcon: true,
      _cancelButtonPosition: 'end',
      multiple,
      visible,
      onValueChanged,
      onUploadStarted,
      onUploaded,
      onCancelButtonClick,
    };
  }

  _toggleButtonDisableState(state: boolean): void {
    this._sendButton?.option('disabled', state);
  }

  _renderButtonContainers(): void {}

  _getHeightDifference($input: dxElementWrapper): number {
    const superResult = super._getHeightDifference($input);
    const toolbarHeight = getOuterHeight(this._$toolbar);
    const sum: number = superResult + toolbarHeight;

    return sum;
  }

  _keyPressHandler(e: InputEvent): void {
    super._keyPressHandler(e);

    const shouldButtonBeDisabled = !this._isMessageCanBeSent();
    this._toggleButtonDisableState(shouldButtonBeDisabled);
  }

  _processSendButtonActivation(e: SendEvent): void {
    this._sendAction?.(e);
    this.reset();
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
        const shouldButtonBeDisabled = !this._isMessageCanBeSent();
        this._toggleButtonDisableState(shouldButtonBeDisabled);
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
      this._renderToolbar();
      this._renderFileUploader();

      return;
    }

    const options = Widget.getOptionsFromContainer(args);
    this._fileUploader?.option(options);
  }

  _isValuableTextEntered(): boolean {
    const { text } = this.option();

    return Boolean(text?.trim());
  }

  _areFilesReadyToSend(): boolean {
    if (!this._filesToSend?.size) {
      return false;
    }

    return Array.from(this._filesToSend.values())
      .every((file) => file.readyToSend);
  }

  _isMessageCanBeSent(): boolean {
    const hasText = this._isValuableTextEntered();
    const hasReadyFiles = this._areFilesReadyToSend();
    const hasUnreadyFiles = this._filesToSend && Array.from(this._filesToSend.values())
      .some((file) => !file.readyToSend);

    return !hasUnreadyFiles && (hasText || hasReadyFiles);
  }

  _dispose(): void {
    this._toolbar?.dispose();
    this._$toolbar?.remove();
    this._fileUploader?.dispose();
    this._toolbar = null;
    this._$toolbar = null;
    super._dispose();
  }
}

export default ChatTextArea;
