import type { DefaultOptionsRule } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, isTouchEvent, normalizeKeyName } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { extend } from '@js/core/utils/extend';
import { getOffset, getOuterWidth, getWidth } from '@js/core/utils/size';
import { isDefined, isFunction, isNumeric } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import ProgressBar from '@js/ui/progress_bar';
import { current, isFluent, isMaterial } from '@js/ui/themes';
import { ICON_CLASS } from '@ts/core/utils/m_icon';
import type { OptionChanged } from '@ts/core/widget/types';
import Editor from '@ts/ui/editor/editor';
import { CustomChunksFileUploadStrategy } from '@ts/ui/file_uploader/file_upload_strategy.chunks.custom';
import { DefaultChunksFileUploadStrategy } from '@ts/ui/file_uploader/file_upload_strategy.chunks.default';
import { CustomWholeFileUploadStrategy } from '@ts/ui/file_uploader/file_upload_strategy.whole.custom';
import { DefaultWholeFileUploadStrategy } from '@ts/ui/file_uploader/file_upload_strategy.whole.default';
import type {
  CancelButtonClickEvent,
  DragLikeEvent,
  FileDialogEventTarget,
  FileUploaderItem,
  FileUploaderProperties,
  LoadedFileData,
  MouseLikeEvent,
} from '@ts/ui/file_uploader/file_uploader.types';
import {
  getFileIconName,
  getFileSize,
} from '@ts/ui/file_uploader/file_uploader.utils';

const window = getWindow();

export const FILEUPLOADER_CLASS = 'dx-fileuploader';
const FILEUPLOADER_EMPTY_CLASS = 'dx-fileuploader-empty';
const FILEUPLOADER_SHOW_FILE_LIST_CLASS = 'dx-fileuploader-show-file-list';
const FILEUPLOADER_DRAGOVER_CLASS = 'dx-fileuploader-dragover';

const FILEUPLOADER_WRAPPER_CLASS = 'dx-fileuploader-wrapper';
const FILEUPLOADER_CONTAINER_CLASS = 'dx-fileuploader-container';
const FILEUPLOADER_CONTENT_CLASS = 'dx-fileuploader-content';
const FILEUPLOADER_INPUT_WRAPPER_CLASS = 'dx-fileuploader-input-wrapper';
const FILEUPLOADER_INPUT_CONTAINER_CLASS = 'dx-fileuploader-input-container';
const FILEUPLOADER_INPUT_LABEL_CLASS = 'dx-fileuploader-input-label';
const FILEUPLOADER_INPUT_CLASS = 'dx-fileuploader-input';
const FILEUPLOADER_FILES_CONTAINER_CLASS = 'dx-fileuploader-files-container';
const FILEUPLOADER_FILE_CONTAINER_CLASS = 'dx-fileuploader-file-container';
const FILEUPLOADER_FILE_INFO_CLASS = 'dx-fileuploader-file-info';
const FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS = 'dx-fileuploader-file-status-message';

const FILEUPLOADER_FILE_CLASS = 'dx-fileuploader-file';
const FILEUPLOADER_FILE_NAME_CLASS = 'dx-fileuploader-file-name';
const FILEUPLOADER_FILE_SIZE_CLASS = 'dx-fileuploader-file-size';
const FILEUPLOADER_FILE_ICON_CLASS = 'dx-fileuploader-file-icon';

const FILEUPLOADER_BUTTON_CLASS = 'dx-fileuploader-button';
const FILEUPLOADER_BUTTON_CONTAINER_CLASS = 'dx-fileuploader-button-container';
export const FILEUPLOADER_CANCEL_BUTTON_CLASS = 'dx-fileuploader-cancel-button';
export const FILEUPLOADER_CANCEL_BUTTON_POSITION_END_CLASS = 'dx-fileuploader-cancel-button-position-end';
const FILEUPLOADER_UPLOAD_BUTTON_CLASS = 'dx-fileuploader-upload-button';

const FILEUPLOADER_INVALID_CLASS = 'dx-fileuploader-invalid';

const FILEUPLOADER_AFTER_LOAD_DELAY = 400;
const DRAG_EVENT_DELTA = 1;

const DIALOG_TRIGGER_EVENT_NAMESPACE = 'dxFileUploaderDialogTrigger';

const keyUpEventName = 'keyup';
const nativeClickEvent = 'click';

const ENTER_KEY = 'enter';
const SPACE_KEY = 'space';

let renderFileUploaderInput = (): dxElementWrapper => $('<input>').attr('type', 'file');
// @ts-expect-error: window.FormData may not be typed in all environments
const isFormDataSupported = (): boolean => !!window.FormData;

class FileUploader extends Editor<FileUploaderProperties> {
  // Temporary solution. Move to component level
  public NAME!: string;

  _activeDropZone?: Element | null;

  _selectButton!: Button;

  _doPreventInputChange?: boolean;

  _files!: FileUploaderItem[] | null;

  _$fileInput!: dxElementWrapper;

  _$filesContainer!: dxElementWrapper | null;

  _$inputWrapper!: dxElementWrapper;

  _$inputContainer?: dxElementWrapper;

  _$inputLabel!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _uploadStrategy!: CustomChunksFileUploadStrategy
    | DefaultChunksFileUploadStrategy
    | CustomWholeFileUploadStrategy
    | DefaultWholeFileUploadStrategy;

  _preventRecreatingFiles?: boolean;

  _uploadButton?: Button;

  _totalLoadedFilesSize!: number;

  _totalFilesSize!: number;

  _isCustomClickEvent?: boolean;

  _progressAction?: (event?: Record<string, unknown>) => void;

  _uploadStartedAction?: (event?: Record<string, unknown>) => void;

  _dropZoneLeaveAction?: (event?: Record<string, unknown>) => void;

  _dropZoneEnterAction?: (event?: Record<string, unknown>) => void;

  _uploadErrorAction?: (event?: Record<string, unknown>) => void;

  _uploadAbortedAction?: (event?: Record<string, unknown>) => void;

  _filesUploadedAction?: (event?: Record<string, unknown>) => void;

  _fileValidationErrorAction?: (event?: Record<string, unknown>) => void;

  _uploadedAction?: (event?: Record<string, unknown>) => void;

  _beforeSendAction?: (event?: Record<string, unknown>) => void;

  _cancelButtonClickAction?: (event?: Partial<CancelButtonClickEvent>) => void;

  _fileLimitReachedAction?: () => void;

  static __internals: {
    changeFileInputRenderer: (renderer: () => dxElementWrapper) => void;
    resetFileInputTag: () => void;
  };

  _supportedKeys(): Record<string, (e: Event) => void> {
    const click = (e: Event): void => {
      e.preventDefault();
      const $selectButton = this._selectButton.$element();

      eventsEngine.triggerHandler($selectButton, { type: 'dxclick' });
    };

    return {
      ...super._supportedKeys(),
      ...{
        space: click,
        enter: click,
      },
    };
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      value: true,
    });
  }

  _getDefaultOptions(): FileUploaderProperties {
    // @ts-expect-error default values = null are not compatible with public types
    return {
      ...super._getDefaultOptions(),
      ...{
        chunkSize: 0,
        value: [],
        selectButtonText: messageLocalization.format('dxFileUploader-selectFile'),
        uploadButtonText: messageLocalization.format('dxFileUploader-upload'),
        labelText: messageLocalization.format('dxFileUploader-dropFile'),
        name: 'files[]',
        multiple: false,
        accept: '',
        uploadUrl: '/',
        allowCanceling: true,
        showFileList: true,
        progress: 0,
        dialogTrigger: undefined,
        dropZone: undefined,
        readyToUploadMessage: messageLocalization.format('dxFileUploader-readyToUpload'),
        uploadedMessage: messageLocalization.format('dxFileUploader-uploaded'),
        uploadFailedMessage: messageLocalization.format('dxFileUploader-uploadFailedMessage'),
        uploadAbortedMessage: messageLocalization.format('dxFileUploader-uploadAbortedMessage'),
        uploadMode: 'instantly',
        uploadMethod: 'POST',
        uploadHeaders: {},
        uploadCustomData: {},
        onBeforeSend: null,
        onUploadStarted: null,
        onUploaded: null,
        onFilesUploaded: null,
        onFileValidationError: null,
        onProgress: null,
        onUploadError: null,
        onUploadAborted: null,
        onDropZoneEnter: null,
        onDropZoneLeave: null,
        onCancelButtonClick: null,
        onFileLimitReached: undefined,
        allowedFileExtensions: [],
        maxFileSize: 0,
        minFileSize: 0,
        inputAttr: {},
        invalidFileExtensionMessage: messageLocalization.format('dxFileUploader-invalidFileExtension'),
        invalidMaxFileSizeMessage: messageLocalization.format('dxFileUploader-invalidMaxFileSize'),
        invalidMinFileSizeMessage: messageLocalization.format('dxFileUploader-invalidMinFileSize'),
        extendSelection: true,
        validationMessageMode: 'always',
        uploadFile: null,
        uploadChunk: null,
        abortUpload: null,
        validationMessageOffset: { h: 0, v: 0 },
        hoverStateEnabled: true,
        useNativeInputClick: false,
        useDragOver: true,
        nativeDropSupported: true,
        _uploadButtonType: 'normal',
        _buttonStylingMode: 'contained',
        _hideCancelButtonOnUpload: true,
        _showFileIcon: false,
        _cancelButtonPosition: 'start',
        _maxFileCount: undefined,
      },
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<FileUploaderProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
        options: {
          focusStateEnabled: true,
        },
      },
      {
        device: [
          {
            platform: 'android',
          },
        ],
        options: {
          validationMessageOffset: { v: 0 },
        },
      },
      {
        device: (): boolean => devices.real().deviceType !== 'desktop',
        options: {
          useDragOver: false,
          nativeDropSupported: false,
          labelText: '',
        },
      },
      {
        device: (): boolean => !isFormDataSupported(),
        options: {
          uploadMode: 'useForm',
        },
      },
      {
        device: (): boolean => isMaterial(current()),
        options: {
          _uploadButtonType: 'default',
        },
      },
      {
        device: (): boolean => isFluent(current()),
        options: {
          _buttonStylingMode: 'text',
        },
      },
    ]);
  }

  _initOptions(options: FileUploaderProperties): void {
    const isLabelTextDefined = 'labelText' in options;

    super._initOptions(options);

    if (!isLabelTextDefined && !this._shouldDragOverBeRendered()) {
      this.option({ labelText: '' });
    }
  }

  _init(): void {
    super._init();

    this._initFileInput();
    this._initLabel();
    this._setUploadStrategy();

    this._createFileLimitReachedAction();
    this._createFiles();

    this._createBeforeSendAction();
    this._createUploadStartedAction();
    this._createUploadedAction();
    this._createFilesUploadedAction();
    this._createFileValidationErrorAction();
    this._createProgressAction();
    this._createUploadErrorAction();
    this._createUploadAbortedAction();
    this._createDropZoneEnterAction();
    this._createDropZoneLeaveAction();
    this._createCancelButtonClickAction();
  }

  _setUploadStrategy(): void {
    const { chunkSize = 0 } = this.option();
    if (chunkSize > 0) {
      const { uploadChunk } = this.option();
      this._uploadStrategy = uploadChunk && isFunction(uploadChunk)
        ? new CustomChunksFileUploadStrategy(this)
        : new DefaultChunksFileUploadStrategy(this);
    } else {
      const { uploadFile } = this.option();
      this._uploadStrategy = uploadFile && isFunction(uploadFile)
        ? new CustomWholeFileUploadStrategy(this)
        : new DefaultWholeFileUploadStrategy(this);
    }
  }

  _initFileInput(): void {
    this._isCustomClickEvent = false;
    const { multiple, accept, hint } = this.option();

    if (!this._$fileInput) {
      this._$fileInput = renderFileUploaderInput();

      eventsEngine.on(this._$fileInput, 'change', () => { this._inputChangeHandler(); });
      eventsEngine.on(this._$fileInput, 'click', (e: Event): boolean | undefined => {
        e.stopPropagation();

        this._resetInputValue();

        const { useNativeInputClick } = this.option();

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return useNativeInputClick || this._isCustomClickEvent;
      });
    }

    const inputProps: {
      multiple?: boolean;
      accept?: string;
      tabIndex?: number;
      title?: string;
    } = {
      multiple,
      accept,
      tabIndex: -1,
    };

    if (isDefined(hint)) {
      inputProps.title = hint;
    }

    // @ts-expect-error dxElementWrapper should be extdened
    this._$fileInput.prop(inputProps);
  }

  _inputChangeHandler(): void {
    if (this._doPreventInputChange) {
      return;
    }

    const fileName = this._$fileInput.val().replace(/^.*\\/, '');
    // @ts-expect-error dxElementWrapper should be extdened
    const files = this._$fileInput.prop('files');

    const { uploadMode } = this.option();

    if (files && !files.length && uploadMode !== 'useForm') {
      return;
    }

    if (this._isFileLimitReached(files as unknown as File[])) {
      this._fileLimitReachedAction?.();
      return;
    }

    // @ts-expect-error dxElementWrapper should be extdened
    const value = files ? this._getFiles(files) : [{ name: fileName }];

    this._changeValue(value as File[]);

    if (uploadMode === 'instantly') {
      this._uploadFiles();
    }
  }

  _isFileLimitReached(files: File[] = []): boolean {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _maxFileCount, value } = this.option();

    if (_maxFileCount === undefined) {
      return false;
    }

    const totalCount = files.length + (value?.length ?? 0);
    const isFileLimitReached = totalCount > _maxFileCount;

    return isFileLimitReached;
  }

  _shouldFileListBeExtended(): boolean {
    const { uploadMode, extendSelection, multiple } = this.option();

    return Boolean(uploadMode !== 'useForm' && extendSelection && multiple);
  }

  _changeValue(value: File[]): void {
    const { value: currentValue } = this.option();

    const files = this._shouldFileListBeExtended() ? currentValue?.slice() : [];

    this.option({ value: files?.concat(value) });
  }

  _getFiles(fileList: FileList): File[] {
    return [...fileList];
  }

  _getFile(fileData: File | number): FileUploaderItem | undefined {
    const { value } = this.option();

    const targetFileValue = isNumeric(fileData) ? value?.[fileData] : fileData;

    return this._files?.filter((file) => file.value === targetFileValue)[0];
  }

  _initLabel(): void {
    if (!this._$inputLabel) {
      this._$inputLabel = $('<div>');
    }

    this._updateInputLabelText();
  }

  _updateInputLabelText(): void {
    const { labelText } = this.option();
    const correctedValue = this._isInteractionDisabled() ? '' : labelText;

    this._$inputLabel.text(correctedValue ?? '');
  }

  _focusTarget(): dxElementWrapper {
    return this.$element().find(`.${FILEUPLOADER_BUTTON_CLASS}`);
  }

  _getSubmitElement(): dxElementWrapper {
    return this._$fileInput;
  }

  _initMarkup(): void {
    super._initMarkup();
    this.$element().addClass(FILEUPLOADER_CLASS);

    this._renderWrapper();
    this._renderInputWrapper();
    this._renderSelectButton();
    this._renderInputContainer();
    this._renderUploadButton();

    this._preventRecreatingFiles = true;
    this._activeDropZone = null;
  }

  _render(): void {
    const { dropZone } = this.option();
    this._preventRecreatingFiles = false;
    this._attachDragEventHandlers(this._$inputWrapper);
    this._attachDragEventHandlers(dropZone);

    this._renderFiles();

    super._render();
  }

  _createFileProgressBar(file: FileUploaderItem): void {
    file.progressBar = this._createProgressBar(file.value.size);
    if (file.$file) {
      file.progressBar.$element().appendTo(file.$file);
    }
    this._initStatusMessage(file);
    this._ensureCancelButtonInitialized(file);
  }

  _setStatusMessage(file: FileUploaderItem, message = ''): void {
    // eslint-disable-next-line no-restricted-globals
    setTimeout(() => {
      const { showFileList } = this.option();
      if (showFileList) {
        if (file.$statusMessage) {
          file.$statusMessage.text(message);
          file.$statusMessage.css('display', '');
          file.progressBar?.$element().remove();
        }
      }
    }, FILEUPLOADER_AFTER_LOAD_DELAY);
  }

  _getUploadAbortedStatusMessage(): string | undefined {
    const { uploadMode, uploadAbortedMessage, readyToUploadMessage } = this.option();
    return uploadMode === 'instantly'
      ? uploadAbortedMessage
      : readyToUploadMessage;
  }

  _createFiles(): void {
    const { value: files } = this.option();

    if (this._isFileLimitReached()) {
      this._fileLimitReachedAction?.();
    }

    if (this._files && (files?.length === 0 || !this._shouldFileListBeExtended())) {
      this._preventFilesUploading(this._files);
      this._files = null;
    }

    if (!this._files) {
      this._files = [];
    }

    files?.slice(this._files.length).forEach((value) => {
      const file = this._createFile(value);
      this._validateFile(file);
      this._files?.push(file);
    });
  }

  _preventFilesUploading(files: FileUploaderItem[] | null): void {
    files?.forEach((file) => this._uploadStrategy.abortUpload(file));
  }

  _validateFile(file: FileUploaderItem): void {
    file.isValidFileExtension = this._validateFileExtension(file);
    file.isValidMinSize = this._validateMinFileSize(file);
    file.isValidMaxSize = this._validateMaxFileSize(file);
  }

  _validateFileExtension(file: FileUploaderItem): boolean {
    const { allowedFileExtensions } = this.option();

    if (!allowedFileExtensions?.length) {
      return true;
    }

    return this._isFileExtensionAllowed(file.value, allowedFileExtensions);
  }

  _validateMaxFileSize(file: FileUploaderItem): boolean {
    const fileSize = file.value.size;
    const { maxFileSize = 0 } = this.option();

    return maxFileSize > 0 ? fileSize <= maxFileSize : true;
  }

  _validateMinFileSize(file: FileUploaderItem): boolean {
    const fileSize = file.value.size;
    const { minFileSize = 0 } = this.option();

    return minFileSize > 0 ? fileSize >= minFileSize : true;
  }

  _isFileExtensionAllowed(file: File, allowedExtensions: string[]): boolean {
    for (let i = 0, n = allowedExtensions.length; i < n; i += 1) {
      let allowedExtension = allowedExtensions[i];

      if (allowedExtension.startsWith('.')) {
        allowedExtension = allowedExtension.replace('.', '\\.');

        if (new RegExp(`${allowedExtension}$`, 'i').exec(file.name)) {
          return true;
        }
      } else {
        allowedExtension = allowedExtension.replace(new RegExp('\\*', 'g'), '');

        if (new RegExp(allowedExtension, 'i').exec(file.type)) {
          return true;
        }
      }
    }
    return false;
  }

  _createBeforeSendAction(): void {
    this._beforeSendAction = this._createActionByOption('onBeforeSend', { excludeValidators: ['readOnly'] });
  }

  _createUploadStartedAction(): void {
    this._uploadStartedAction = this._createActionByOption('onUploadStarted', { excludeValidators: ['readOnly'] });
  }

  _createUploadedAction(): void {
    this._uploadedAction = this._createActionByOption('onUploaded', { excludeValidators: ['readOnly'] });
  }

  _createFilesUploadedAction(): void {
    this._filesUploadedAction = this._createActionByOption('onFilesUploaded', { excludeValidators: ['readOnly'] });
  }

  _createFileValidationErrorAction(): void {
    this._fileValidationErrorAction = this._createActionByOption('onFileValidationError', { excludeValidators: ['readOnly'] });
  }

  _createProgressAction(): void {
    this._progressAction = this._createActionByOption('onProgress', { excludeValidators: ['readOnly'] });
  }

  _createUploadAbortedAction(): void {
    this._uploadAbortedAction = this._createActionByOption('onUploadAborted', { excludeValidators: ['readOnly'] });
  }

  _createUploadErrorAction(): void {
    this._uploadErrorAction = this._createActionByOption('onUploadError', { excludeValidators: ['readOnly'] });
  }

  _createDropZoneEnterAction(): void {
    this._dropZoneEnterAction = this._createActionByOption('onDropZoneEnter');
  }

  _createDropZoneLeaveAction(): void {
    this._dropZoneLeaveAction = this._createActionByOption('onDropZoneLeave');
  }

  _createCancelButtonClickAction(): void {
    this._cancelButtonClickAction = this._createActionByOption('onCancelButtonClick', { excludeValidators: ['readOnly'] });
  }

  _createFileLimitReachedAction(): void {
    this._fileLimitReachedAction = this._createActionByOption('onFileLimitReached', { excludeValidators: ['readOnly'] });
  }

  _createFile(value: File): FileUploaderItem {
    return {
      value,
      loadedSize: 0,
      onProgress: Callbacks(),
      onAbort: Callbacks(),
      onLoad: Callbacks(),
      onError: Callbacks(),
      onLoadStart: Callbacks(),
      isValidFileExtension: true,
      isValidMaxSize: true,
      isValidMinSize: true,
      isValid(): boolean {
        return Boolean(this.isValidFileExtension)
        && Boolean(this.isValidMaxSize)
        && Boolean(this.isValidMinSize);
      },
      isInitialized: false,
    };
  }

  _resetFileState(file: FileUploaderItem): void {
    file.isAborted = false;
    file.uploadStarted = false;
    file.isStartLoad = false;
    file.loadedSize = 0;
    file.chunksData = undefined;
    file.request = undefined;
  }

  _renderFiles(): void {
    const { value, showFileList } = this.option();

    if (!this._$filesContainer) {
      this._$filesContainer = $('<div>')
        .addClass(FILEUPLOADER_FILES_CONTAINER_CLASS)
        .appendTo(this._$content);
    } else if (!this._shouldFileListBeExtended() || value?.length === 0) {
      this._$filesContainer.empty();
    }

    if (showFileList) {
      this._files?.forEach((file) => {
        if (!file.$file) {
          this._renderFile(file);
        }
      });
    }

    this.$element().toggleClass(FILEUPLOADER_SHOW_FILE_LIST_CLASS, showFileList);
    this._toggleFileContainerAria(Boolean(showFileList && this._files?.length));
    this._toggleFileUploaderEmptyClassName();
    this._updateFileNameMaxWidth();

    this._validationMessage?.repaint();
  }

  _toggleFileContainerAria(applyAria: boolean): void {
    const aria = {
      role: applyAria ? 'list' : null,
      'aria-label': applyAria
        ? messageLocalization.format('dxFileUploader-fileListLabel')
        : null,
    };

    // @ts-expect-error attr type should be extended
    this._$filesContainer?.attr(aria);
  }

  _renderFile(file: FileUploaderItem): void {
    const { value } = file;

    if (!this._$filesContainer) {
      return;
    }

    const $fileContainer = $('<div>')
      .addClass(FILEUPLOADER_FILE_CONTAINER_CLASS)
      .appendTo(this._$filesContainer)
      .attr('role', 'listitem');

    this._renderFileIcon(value.name, $fileContainer);

    file.$file = $('<div>')
      .addClass(FILEUPLOADER_FILE_CLASS)
      .appendTo($fileContainer);

    const $fileInfo = $('<div>')
      .addClass(FILEUPLOADER_FILE_INFO_CLASS)
      .appendTo(file.$file);

    file.$statusMessage = $('<div>')
      .addClass(FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS)
      .appendTo(file.$file);

    $('<div>')
      .addClass(FILEUPLOADER_FILE_NAME_CLASS)
      .text(value.name)
      .attr('title', value.name)
      .appendTo($fileInfo);

    if (isDefined(value.size)) {
      $('<div>')
        .addClass(FILEUPLOADER_FILE_SIZE_CLASS)
        .text(getFileSize(value.size))
        .appendTo($fileInfo);
    }

    this._renderFileButtons(file, $fileContainer);

    if (file.isValid()) {
      const { readyToUploadMessage } = this.option();
      file.$statusMessage.text(readyToUploadMessage ?? '');
    } else {
      if (!file.isValidFileExtension) {
        file.$statusMessage.append(this._createValidationElement('invalidFileExtensionMessage'));
      }
      if (!file.isValidMaxSize) {
        file.$statusMessage.append(this._createValidationElement('invalidMaxFileSizeMessage'));
      }
      if (!file.isValidMinSize) {
        file.$statusMessage.append(this._createValidationElement('invalidMinFileSizeMessage'));
      }

      this._fileValidationErrorAction?.({ file: file.value });
      $fileContainer.addClass(FILEUPLOADER_INVALID_CLASS);
    }
  }

  _createValidationElement(key: keyof FileUploaderProperties): dxElementWrapper {
    return $('<span>').text(this.option()[key]);
  }

  _updateFileNameMaxWidth(): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { allowCanceling, uploadMode, _showFileIcon } = this.option();

    const cancelButtonsCount = allowCanceling && uploadMode !== 'useForm' ? 1 : 0;
    const uploadButtonsCount = uploadMode === 'useButtons' ? 1 : 0;
    const filesContainerWidth = getWidth(
      this._$filesContainer?.find(`.${FILEUPLOADER_FILE_CONTAINER_CLASS}`).first(),
    ) || getWidth(this._$filesContainer);
    const $buttonContainer = this._$filesContainer?.find(`.${FILEUPLOADER_BUTTON_CONTAINER_CLASS}`).eq(0);
    const buttonsWidth = getWidth($buttonContainer) * (cancelButtonsCount + uploadButtonsCount);
    const $fileSize = this._$filesContainer?.find(`.${FILEUPLOADER_FILE_SIZE_CLASS}`).eq(0);
    const $icon = this._$filesContainer?.find(`.${FILEUPLOADER_FILE_ICON_CLASS}`).eq(0);
    const iconWidth = _showFileIcon ? getOuterWidth($icon) : 0;

    const prevFileSize = $fileSize?.text();
    $fileSize?.text('1000 Mb');
    const fileSizeWidth = getWidth($fileSize);
    $fileSize?.text(prevFileSize ?? '');

    const maxWidth = filesContainerWidth - buttonsWidth - fileSizeWidth - iconWidth;
    this._$filesContainer?.find(`.${FILEUPLOADER_FILE_NAME_CLASS}`).css('maxWidth', maxWidth);
  }

  _renderFileButtons(file: FileUploaderItem, $container: dxElementWrapper): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _cancelButtonPosition } = this.option();

    const $uploadButton = this._getUploadButton(file);

    if ($uploadButton) {
      $container.prepend($uploadButton);
    }

    const $cancelButton = this._getCancelButton(file);

    if ($cancelButton) {
      if (_cancelButtonPosition === 'end') {
        $container.append($cancelButton);

        return;
      }
      $container.prepend($cancelButton);
    }
  }

  _renderFileIcon(fileName: string, $container: dxElementWrapper): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _showFileIcon } = this.option();

    if (!_showFileIcon) {
      return;
    }

    $('<div>')
      .addClass(`${FILEUPLOADER_FILE_ICON_CLASS} ${ICON_CLASS} ${ICON_CLASS}-${getFileIconName(fileName)}`)
      .appendTo($container);
  }

  _getCancelButton(file: FileUploaderItem): dxElementWrapper | null {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { uploadMode, _cancelButtonPosition } = this.option();
    if (uploadMode === 'useForm') {
      return null;
    }

    const {
      allowCanceling,
      readOnly,
      hoverStateEnabled,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _buttonStylingMode,
    } = this.option();

    file.cancelButton = this._createComponent(
      $('<div>').addClass(`${FILEUPLOADER_BUTTON_CLASS} ${FILEUPLOADER_CANCEL_BUTTON_CLASS}`),
      Button,
      {
        onClick: (): void => {
          this._removeFile(file);
          this._cancelButtonClickAction?.({ file: file.value });
        },
        icon: 'close',
        visible: allowCanceling,
        disabled: readOnly,
        integrationOptions: {},
        hoverStateEnabled,
        stylingMode: _buttonStylingMode,
        elementAttr: {
          // @ts-expect-error format params should be extended
          'aria-label': messageLocalization.format('dxFileUploader-removeFileButtonLabel', file?.value?.name ?? ''),
        },
      },
    );

    if (_cancelButtonPosition === 'end') {
      file.cancelButton.$element().addClass(FILEUPLOADER_CANCEL_BUTTON_POSITION_END_CLASS);
    }

    return $('<div>')
      .addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS)
      .append(file.cancelButton.$element());
  }

  _getUploadButton(file: FileUploaderItem): dxElementWrapper | null {
    const { uploadMode } = this.option();
    if (!file.isValid() || uploadMode !== 'useButtons') {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { hoverStateEnabled, _buttonStylingMode } = this.option();

    file.uploadButton = this._createComponent(
      $('<div>').addClass(`${FILEUPLOADER_BUTTON_CLASS} ${FILEUPLOADER_UPLOAD_BUTTON_CLASS}`),
      Button,
      {
        onClick: () => this._uploadFile(file),
        icon: 'upload',
        hoverStateEnabled,
        stylingMode: _buttonStylingMode,
        elementAttr: {
          // @ts-expect-error format params should be extended
          'aria-label': messageLocalization.format('dxFileUploader-uploadFileButtonLabel', file?.value?.name ?? ''),
        },
      },
    );

    file.onLoadStart.add(() => {
      file.uploadButton?.option({
        visible: false,
        disabled: true,
      });
    });

    file.onAbort.add(() => {
      file.uploadButton?.option({
        visible: true,
        disabled: false,
      });
    });

    return $('<div>')
      .addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS)
      .append(file.uploadButton.$element());
  }

  _removeFile(file: FileUploaderItem): void {
    file.$file?.parent().remove();

    this._files?.splice(this._files.indexOf(file), 1);
    const { value } = this.option();
    const valueCopy = value?.slice();
    valueCopy?.splice(valueCopy.indexOf(file.value), 1);

    this._preventRecreatingFiles = true;
    this.option({ value: valueCopy });
    this._preventRecreatingFiles = false;

    if (this._files?.length === 0) {
      this._toggleFileContainerAria(false);
    }

    this._toggleFileUploaderEmptyClassName();
    this._resetInputValue(true);
  }

  removeFile(fileData: File | number): void {
    const { uploadMode } = this.option();
    if (uploadMode === 'useForm' || !isDefined(fileData)) {
      return;
    }
    const file = this._getFile(fileData);
    if (file) {
      if (file.uploadStarted) {
        this._preventFilesUploading([file]);
      }
      this._removeFile(file);
    }
  }

  _toggleFileUploaderEmptyClassName(): void {
    this.$element()
      .toggleClass(
        FILEUPLOADER_EMPTY_CLASS,
        !this._files?.length || this._hasInvalidFile(this._files),
      );
  }

  _hasInvalidFile(files: FileUploaderItem[]): boolean {
    return files.some((file) => !file.isValid());
  }

  _renderSelectButton(): void {
    const $button = $('<div>')
      .addClass(FILEUPLOADER_BUTTON_CLASS)
      .appendTo(this._$inputWrapper);

    const { selectButtonText, readOnly, hoverStateEnabled } = this.option();
    this._selectButton = this._createComponent<Button, ButtonProperties>($button, Button, {
      text: selectButtonText,
      focusStateEnabled: false,
      // @ts-expect-error extend dxButtonOptions type
      integrationOptions: {},
      disabled: readOnly,
      hoverStateEnabled,
    });

    // NOTE: click triggering on input 'file' works correctly only in
    // native click handler when device is used
    if (devices.real().deviceType === 'desktop') {
      this._selectButton.option({ onClick: () => this._selectFileDialogClickHandler() });
    } else {
      this._attachSelectFileDialogHandlers(this._selectButton.$element());
    }

    const { dialogTrigger } = this.option();

    this._attachSelectFileDialogHandlers(dialogTrigger);
  }

  _selectFileDialogClickHandler(): void {
    const { useNativeInputClick } = this.option();

    if (useNativeInputClick || this._isInteractionDisabled()) {
      return;
    }

    this._isCustomClickEvent = true;
    // @ts-expect-error update events_engine interface to support trigger method
    eventsEngine.trigger(this._$fileInput, 'click');
    this._isCustomClickEvent = false;
  }

  _attachSelectFileDialogHandlers(target: FileDialogEventTarget): void {
    if (!isDefined(target)) {
      return;
    }

    this._detachSelectFileDialogHandlers(target);

    const $target = $(target);

    eventsEngine.on($target, addNamespace(nativeClickEvent, DIALOG_TRIGGER_EVENT_NAMESPACE), () => {
      this._selectFileDialogClickHandler();
    });
    eventsEngine.on(
      $target,
      addNamespace(keyUpEventName, DIALOG_TRIGGER_EVENT_NAMESPACE),
      (e: KeyboardEvent) => {
        const normalizedKeyName = normalizeKeyName(e);

        if (normalizedKeyName === ENTER_KEY || normalizedKeyName === SPACE_KEY) {
          this._selectFileDialogClickHandler();
        }
      },
    );
  }

  _detachSelectFileDialogHandlers(target: FileDialogEventTarget): void {
    if (!isDefined(target)) {
      return;
    }

    const $target = $(target);

    eventsEngine.off($target, `.${DIALOG_TRIGGER_EVENT_NAMESPACE}`);
  }

  _renderUploadButton(): void {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      uploadButtonText, _uploadButtonType, hoverStateEnabled, uploadMode,
    } = this.option();

    if (uploadMode !== 'useButtons') {
      return;
    }

    const $uploadButton = $('<div>')
      .addClass(FILEUPLOADER_BUTTON_CLASS)
      .addClass(FILEUPLOADER_UPLOAD_BUTTON_CLASS)

      .appendTo(this._$content);

    this._uploadButton = this._createComponent<Button, ButtonProperties>($uploadButton, Button, {
      text: uploadButtonText,
      onClick: this._uploadButtonClickHandler.bind(this),
      type: _uploadButtonType,
      // @ts-expect-error extend dxButtonOptions type
      integrationOptions: {},
      hoverStateEnabled,
    });
  }

  _uploadButtonClickHandler(): void {
    this._uploadFiles();
  }

  _shouldDragOverBeRendered(): boolean | undefined {
    const { readOnly, uploadMode, nativeDropSupported } = this.option();
    return !readOnly && (uploadMode !== 'useForm' || nativeDropSupported);
  }

  _isInteractionDisabled(): boolean {
    const { readOnly, disabled } = this.option();
    return Boolean(readOnly) || Boolean(disabled);
  }

  _renderInputContainer(): void {
    this._$inputContainer = $('<div>')
      .addClass(FILEUPLOADER_INPUT_CONTAINER_CLASS)
      .appendTo(this._$inputWrapper);

    this._renderInput();

    this._$fileInput
      .addClass(FILEUPLOADER_INPUT_CLASS);

    const labelId = `dx-fileuploader-input-label-${new Guid()}`;

    this._$inputLabel
      .attr('id', labelId)
      .addClass(FILEUPLOADER_INPUT_LABEL_CLASS)
      .appendTo(this._$inputContainer);

    this.setAria('labelledby', labelId, this._$fileInput);
  }

  _renderInput(): void {
    const { useNativeInputClick, inputAttr } = this.option();
    if (useNativeInputClick) {
      this._selectButton.option({ template: this._selectButtonInputTemplate.bind(this) });
    } else {
      // @ts-expect-error dxElementWrapper should be extdened
      this._$fileInput.appendTo(this._$inputContainer);
      this._selectButton.option({ template: 'content' });
    }
    this._applyInputAttributes(inputAttr);
  }

  _selectButtonInputTemplate(data: { text: string }, content: HTMLElement): dxElementWrapper {
    const $content = $(content);
    const $text = $('<span>')
      .addClass('dx-button-text')
      .text(data.text);

    $content
      .append($text)
      .append(this._$fileInput);

    return $content;
  }

  _renderInputWrapper(): void {
    if (!this._$content) {
      return;
    }

    this._$inputWrapper = $('<div>')
      .addClass(FILEUPLOADER_INPUT_WRAPPER_CLASS)
      .appendTo(this._$content);
  }

  _detachDragEventHandlers(target?: Element | dxElementWrapper | string): void {
    if (!target) {
      return;
    }

    eventsEngine.off($(target), addNamespace('', this.NAME));
  }

  _attachDragEventHandlers(target?: Element | dxElementWrapper | string): void {
    const isCustomTarget = target !== this._$inputWrapper;
    if (!isDefined(target) || !this._shouldDragOverBeRendered()) {
      return;
    }

    this._detachDragEventHandlers(target);

    eventsEngine.on($(target), addNamespace('dragenter', this.NAME), this._dragEnterHandler.bind(this, isCustomTarget));
    eventsEngine.on($(target), addNamespace('dragover', this.NAME), this._dragOverHandler.bind(this, isCustomTarget));
    eventsEngine.on($(target), addNamespace('dragleave', this.NAME), this._dragLeaveHandler.bind(this, isCustomTarget));
    eventsEngine.on($(target), addNamespace('drop', this.NAME), this._dropHandler.bind(this, isCustomTarget));
  }

  _applyInputAttributes(customAttributes: Record<string, string>): void {
    // @ts-expect-error dxElementWrapper should be extdened
    this._$fileInput.attr(customAttributes);
  }

  _useInputForDrop(): boolean {
    const { uploadMode, nativeDropSupported } = this.option();

    return Boolean(nativeDropSupported) && uploadMode === 'useForm';
  }

  _getDropZoneElement(isCustomTarget: boolean, e: DxEvent): Element | undefined {
    if (!e.currentTarget) {
      return undefined;
    }

    const { dropZone } = this.option();

    const targetList = isCustomTarget ? $(dropZone).toArray() : [this._$inputWrapper];
    const targetListElements = targetList.map((element) => $(element).get(0));
    const currentTargetIndex = targetListElements.indexOf(e.currentTarget);

    return targetListElements[currentTargetIndex];
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type, consistent-return
  _dragEnterHandler(isCustomTarget: boolean, e: DragLikeEvent): void | false {
    const { disabled } = this.option();
    if (disabled) {
      return false;
    }

    if (!this._useInputForDrop()) {
      e.preventDefault();
    }

    const dropZoneElement = this._getDropZoneElement(isCustomTarget, e);
    if (isDefined(dropZoneElement) && this._shouldRaiseDragOver(e, dropZoneElement)) {
      this._activeDropZone = dropZoneElement;
      this._tryToggleDropZoneActive(true, isCustomTarget, e);
    }
  }

  _shouldRaiseDragOver(
    e: DragLikeEvent,
    dropZoneElement?: Element,
  ): boolean | string | undefined {
    return this._activeDropZone === null
      && this.isMouseOverElement(e, dropZoneElement as HTMLElement, false)
      && e.originalEvent.dataTransfer.types.find((item) => item === 'Files');
  }

  _dragOverHandler(isCustomTarget: boolean, e: DragLikeEvent): void {
    if (!this._useInputForDrop()) {
      e.preventDefault();
    }
    e.originalEvent.dataTransfer.dropEffect = 'copy';

    if (!isCustomTarget) { // only default dropzone has pseudoelements
      const dropZoneElement = this._getDropZoneElement(false, e);
      if (this._shouldRaiseDragOver(e, dropZoneElement)) {
        this._dragEnterHandler(false, e);
      }
      if (this._shouldRaiseDragLeave(e, false)) {
        this._dragLeaveHandler(false, e);
      }
    }
  }

  _dragLeaveHandler(isCustomTarget: boolean, e: DragLikeEvent): void {
    if (!this._useInputForDrop()) {
      e.preventDefault();
    }

    if (this._shouldRaiseDragLeave(e, isCustomTarget)) {
      this._tryToggleDropZoneActive(false, isCustomTarget, e);
      this._activeDropZone = null;
    }
  }

  _shouldRaiseDragLeave(e: MouseLikeEvent, isCustomTarget: boolean): boolean {
    return this._activeDropZone !== null
    && !this.isMouseOverElement(
      e,
      this._activeDropZone as HTMLElement,
      !isCustomTarget,
      -DRAG_EVENT_DELTA,
    );
  }

  _tryToggleDropZoneActive(active: boolean, isCustom: boolean, event: Event): void {
    const classAction = active ? 'addClass' : 'removeClass';
    const mouseAction = active ? '_dropZoneEnterAction' : '_dropZoneLeaveAction';

    this[mouseAction]?.({
      event,
      dropZoneElement: this._activeDropZone,
    });
    if (!isCustom) {
      this.$element()[classAction](FILEUPLOADER_DRAGOVER_CLASS);
    }
  }

  _dropHandler(isCustomTarget: boolean, e: DragLikeEvent): void {
    this._activeDropZone = null;

    if (!isCustomTarget) {
      this.$element().removeClass(FILEUPLOADER_DRAGOVER_CLASS);
    }

    if (this._useInputForDrop() || (isCustomTarget && this._isInteractionDisabled())) {
      return;
    }

    e.preventDefault();

    const fileList = e.originalEvent.dataTransfer.files;
    const files = this._getFiles(fileList);

    const { multiple, uploadMode } = this.option();

    if ((!multiple && files.length > 1) || files.length === 0) {
      return;
    }

    if (this._isFileLimitReached(files as unknown as File[])) {
      this._fileLimitReachedAction?.();
      return;
    }

    this._changeValue(files);

    if (uploadMode === 'instantly') {
      this._uploadFiles();
    }
  }

  _areAllFilesLoaded(): boolean | undefined {
    return this._files?.every(
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      (file) => !file.isValid() || file._isError || file._isLoaded || file.isAborted,
    );
  }

  _handleAllFilesUploaded(): void {
    this._recalculateProgress();
    if (this._areAllFilesLoaded()) {
      this._filesUploadedAction?.();
    }
  }

  _renderWrapper(): void {
    const $wrapper = $('<div>')
      .addClass(FILEUPLOADER_WRAPPER_CLASS)
      .appendTo(this.$element());

    const $container = $('<div>')
      .addClass(FILEUPLOADER_CONTAINER_CLASS)
      .appendTo($wrapper);

    this._$content = $('<div>')
      .addClass(FILEUPLOADER_CONTENT_CLASS)
      .appendTo($container);
  }

  _clean(): void {
    this._$fileInput.detach();

    this._$filesContainer = null;

    const { dialogTrigger, dropZone } = this.option();

    this._detachSelectFileDialogHandlers(dialogTrigger);
    this._detachDragEventHandlers(dropZone);

    if (this._files) {
      this._files.forEach((file) => {
        file.$file = null;

        file.$statusMessage = null;
      });
    }

    super._clean();
  }

  abortUpload(fileData?: File | number): void {
    const { uploadMode } = this.option();
    if (uploadMode === 'useForm') {
      return;
    }
    if (isDefined(fileData)) {
      const file = this._getFile(fileData);
      if (file) {
        this._preventFilesUploading([file]);
      }
    } else {
      this._preventFilesUploading(this._files);
    }
  }

  upload(fileData?: File | number): void {
    const { uploadMode } = this.option();
    if (uploadMode === 'useForm') {
      return;
    }
    if (isDefined(fileData)) {
      const file = this._getFile(fileData);
      if (file && isFormDataSupported()) {
        this._uploadFile(file);
      }
    } else {
      this._uploadFiles();
    }
  }

  _uploadFiles(): void {
    if (isFormDataSupported()) {
      this._files?.forEach((file) => this._uploadFile(file));
    }
  }

  _uploadFile(file: FileUploaderItem): void {
    this._uploadStrategy.upload(file);
  }

  _updateProgressBar(file: FileUploaderItem, loadedFileData: LoadedFileData): void {
    file.progressBar?.option({
      value: loadedFileData.loaded,
      showStatus: true,
    });

    this._progressAction?.({
      file: file.value,
      segmentSize: loadedFileData.currentSegmentSize,
      bytesLoaded: loadedFileData.loaded,
      bytesTotal: loadedFileData.total,
      event: loadedFileData.event,
      request: file.request,
    });
  }

  _updateTotalProgress(totalFilesSize: number, totalLoadedFilesSize: number): void {
    let progress = 0;
    if (isDefined(totalFilesSize)) {
      if (this._files
        && this._files.length > 0
        && this._areAllFilesLoaded()
        && totalFilesSize === 0
        && totalLoadedFilesSize === 0) {
        progress = this._getProgressValue(1);
      } else if (totalFilesSize) {
        progress = this._getProgressValue(totalLoadedFilesSize / totalFilesSize);
      }
    }
    this.option({ progress });
    this._setLoadedSize(totalLoadedFilesSize);
  }

  _getProgressValue(ratio: number): number {
    return Math.floor(ratio * 100);
  }

  _initStatusMessage(file: FileUploaderItem): void {
    file.$statusMessage?.css('display', 'none');
  }

  _ensureCancelButtonInitialized(file: FileUploaderItem): void {
    if (file.isInitialized) {
      return;
    }

    file.cancelButton?.option({
      onClick: (): void => {
        this._preventFilesUploading([file]);
        this._removeFile(file);
        this._cancelButtonClickAction?.({ file: file.value });
      },
    });

    const hideCancelButton = (): void => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _hideCancelButtonOnUpload } = this.option();

      if (!_hideCancelButtonOnUpload) {
        return;
      }
      // eslint-disable-next-line no-restricted-globals
      setTimeout(() => {
        file.cancelButton?.option({
          visible: false,
        });
      }, FILEUPLOADER_AFTER_LOAD_DELAY);
    };

    file.onLoad.add(hideCancelButton);
    file.onError.add(hideCancelButton);
  }

  _createProgressBar(fileSize: number): ProgressBar {
    return this._createComponent($('<div>'), ProgressBar, {
      value: undefined,
      min: 0,
      max: fileSize,
      statusFormat: (ratio: number): string => `${this._getProgressValue(ratio)}%`,
      showStatus: false,
      statusPosition: 'right',
    });
  }

  _getTotalFilesSize(): number {
    if (!this._totalFilesSize) {
      this._totalFilesSize = 0;
      this._files?.forEach((file) => {
        this._totalFilesSize += file.value.size;
      });
    }

    return this._totalFilesSize;
  }

  _getTotalLoadedFilesSize(): number {
    if (!this._totalLoadedFilesSize) {
      this._totalLoadedFilesSize = 0;
      this._files?.forEach((file) => {
        this._totalLoadedFilesSize += file.loadedSize;
      });
    }

    return this._totalLoadedFilesSize;
  }

  _setLoadedSize(value: number): void {
    this._totalLoadedFilesSize = value;
  }

  _recalculateProgress(): void {
    this._totalFilesSize = 0;
    this._totalLoadedFilesSize = 0;
    this._updateTotalProgress(this._getTotalFilesSize(), this._getTotalLoadedFilesSize());
  }

  isMouseOverElement(
    mouseEvent: MouseLikeEvent,
    element?: HTMLElement,
    correctPseudoElements?: boolean,
    dragEventDelta: number = DRAG_EVENT_DELTA,
  ): boolean {
    if (!element) return false;

    const beforeHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':before').height) : 0;
    const afterHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':after').height) : 0;
    const x = getOffset(element).left;
    const y = getOffset(element).top + beforeHeight;
    const w = element.offsetWidth;
    const h = element.offsetHeight - beforeHeight - afterHeight;
    const eventX = this._getEventX(mouseEvent);
    const eventY = this._getEventY(mouseEvent);

    return (eventX + dragEventDelta) >= x
    && (eventX - dragEventDelta) < (x + w)
    && (eventY + dragEventDelta) >= y
    && (eventY - dragEventDelta) < (y + h);
  }

  _getEventX(e: MouseLikeEvent): number {
    return isTouchEvent(e)
      ? this._getTouchEventX(e as TouchEvent)
      : (e as MouseEvent).clientX + this._getDocumentScrollLeft();
  }

  _getEventY(e: MouseLikeEvent): number {
    return isTouchEvent(e)
      ? this._getTouchEventY(e as TouchEvent)
      : (e as MouseEvent).clientY + this._getDocumentScrollTop();
  }

  _getTouchEventX(e: TouchEvent): number {
    let touchPoint: TouchList | null = null;
    if (e.changedTouches.length > 0) {
      touchPoint = e.changedTouches;
    } else if (e.targetTouches.length > 0) {
      touchPoint = e.targetTouches;
    }
    return touchPoint ? touchPoint[0].pageX : 0;
  }

  _getTouchEventY(e: TouchEvent): number {
    let touchPoint: TouchList | null = null;
    if (e.changedTouches.length > 0) {
      touchPoint = e.changedTouches;
    } else if (e.targetTouches.length > 0) {
      touchPoint = e.targetTouches;
    }
    return touchPoint ? touchPoint[0].pageY : 0;
  }

  _getDocumentScrollTop(): number {
    const document = domAdapter.getDocument();
    return document.documentElement.scrollTop || document.body.scrollTop;
  }

  _getDocumentScrollLeft(): number {
    const document = domAdapter.getDocument();
    return document.documentElement.scrollLeft || document.body.scrollLeft;
  }

  _updateReadOnlyState(): void {
    const { readOnly } = this.option();

    this._selectButton.option({ disabled: readOnly });
    this._files?.forEach((file) => file.cancelButton?.option({ disabled: readOnly }));
    this._updateInputLabelText();
    this._attachDragEventHandlers(this._$inputWrapper);
  }

  _updateHoverState(): void {
    const { hoverStateEnabled: value } = this.option();

    this._selectButton?.option({ hoverStateEnabled: value });
    this._uploadButton?.option({ hoverStateEnabled: value });
    this._files?.forEach((file) => {
      file.uploadButton?.option({ hoverStateEnabled: value });
      file.cancelButton?.option({ hoverStateEnabled: value });
    });
  }

  _optionChanged(args: OptionChanged<FileUploaderProperties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'height':
      case 'width':
        this._updateFileNameMaxWidth();
        super._optionChanged(args);
        break;
      case 'value':
        if (!value?.length) {
          this._$fileInput.val('');
        }

        if (!this._preventRecreatingFiles) {
          this._createFiles();
          this._renderFiles();
        }

        this._recalculateProgress();

        super._optionChanged(args);
        break;
      case 'name':
        this._initFileInput();
        super._optionChanged(args);
        break;
      case 'accept':
        this._initFileInput();
        break;
      case 'multiple':
        this._initFileInput();
        if (!args.value) {
          this.clear();
        }
        break;
      case 'readOnly':
        this._updateReadOnlyState();
        super._optionChanged(args);
        break;
      case 'disabled':
        this._updateInputLabelText();
        super._optionChanged(args);
        break;
      case 'selectButtonText':
        this._selectButton.option({ text: value });
        break;
      case 'uploadButtonText':
        if (this._uploadButton) {
          this._uploadButton.option({ text: value });
        }
        break;
      case '_uploadButtonType':
        if (this._uploadButton) {
          this._uploadButton.option({ type: value });
        }
        break;
      case '_buttonStylingMode':
        this._files?.forEach((file) => {
          file.uploadButton?.option({ stylingMode: value });
          file.cancelButton?.option({ stylingMode: value });
        });
        break;
      case 'dialogTrigger':
        this._detachSelectFileDialogHandlers(previousValue);
        this._attachSelectFileDialogHandlers(value);
        break;
      case 'dropZone':
        this._detachDragEventHandlers(previousValue);
        this._attachDragEventHandlers(value);
        break;
      case 'maxFileSize':
      case 'minFileSize':
      case 'allowedFileExtensions':
      case 'invalidFileExtensionMessage':
      case 'invalidMaxFileSizeMessage':
      case 'invalidMinFileSizeMessage':
      case 'readyToUploadMessage':
      case 'uploadedMessage':
      case 'uploadFailedMessage':
      case 'uploadAbortedMessage':
      case '_hideCancelButtonOnUpload':
      case '_cancelButtonPosition':
      case '_showFileIcon':
        this._invalidate();
        break;
      case '_maxFileCount':
        break;
      case 'labelText':
        this._updateInputLabelText();
        break;
      case 'showFileList':
        if (!this._preventRecreatingFiles) {
          this._renderFiles();
        }
        break;
      case 'uploadFile':
      case 'uploadChunk':
      case 'chunkSize':
        this._setUploadStrategy();
        break;
      case 'abortUpload':
      case 'uploadUrl':
      case 'progress':
      case 'uploadMethod':
      case 'uploadHeaders':
      case 'uploadCustomData':
      case 'extendSelection':
        break;
      case 'hoverStateEnabled':
        this._updateHoverState();
        super._optionChanged(args);
        break;
      case 'allowCanceling':
      case 'uploadMode':
        this.clear();
        this._invalidate();
        break;
      case 'onBeforeSend':
        this._createBeforeSendAction();
        break;
      case 'onUploadStarted':
        this._createUploadStartedAction();
        break;
      case 'onUploaded':
        this._createUploadedAction();
        break;
      case 'onFilesUploaded':
        this._createFilesUploadedAction();
        break;
      case 'onFileValidationError':
        this._createFileValidationErrorAction();
        break;
      case 'onProgress':
        this._createProgressAction();
        break;
      case 'onUploadError':
        this._createUploadErrorAction();
        break;
      case 'onUploadAborted':
        this._createUploadAbortedAction();
        break;
      case 'onDropZoneEnter':
        this._createDropZoneEnterAction();
        break;
      case 'onDropZoneLeave':
        this._createDropZoneLeaveAction();
        break;
      case 'onCancelButtonClick':
        this._createCancelButtonClickAction();
        break;
      case 'onFileLimitReached':
        this._createFileLimitReachedAction();
        break;
      case 'useNativeInputClick':
        this._renderInput();
        break;
      case 'useDragOver':
        this._attachDragEventHandlers(this._$inputWrapper);
        break;
      case 'nativeDropSupported':
        this._invalidate();
        break;
      case 'inputAttr':
        this._applyInputAttributes(this.option()[name]);
        break;
      case 'hint':
        this._initFileInput();
        super._optionChanged(args);
        break;
      case 'visible':
        super._optionChanged(args);
        this._updateFileNameMaxWidth();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _resetInputValue(force?: boolean): void {
    const { uploadMode } = this.option();
    if (uploadMode === 'useForm' && !force) {
      return;
    }
    this._doPreventInputChange = true;
    this._$fileInput.val('');
    this._doPreventInputChange = false;
  }

  clear(): void {
    this.option({ value: [] });
  }
}

/// #DEBUG
FileUploader.__internals = {
  changeFileInputRenderer(renderer: () => dxElementWrapper): void {
    renderFileUploaderInput = renderer;
  },
  resetFileInputTag(): void {
    renderFileUploaderInput = (): dxElementWrapper => $('<input>').attr('type', 'file');
  },
};
/// #ENDDEBUG

registerComponent('dxFileUploader', FileUploader);

export default FileUploader;
