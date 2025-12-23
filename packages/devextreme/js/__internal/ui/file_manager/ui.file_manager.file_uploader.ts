/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { getInnerHeight, setHeight, setWidth } from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';
import FileUploader from '@js/ui/file_uploader';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import { whenSome } from '@ts/ui/file_manager/ui.file_manager.common';

const FILE_MANAGER_FILE_UPLOADER_CLASS = 'dx-filemanager-fileuploader';
const FILE_MANAGER_FILE_UPLOADER_DROPZONE_PLACEHOLDER_CLASS = 'dx-filemanager-fileuploader-dropzone-placeholder';

interface FileManagerFileUploaderActions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadSessionStarted?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadProgress?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadFinished?: (e: any) => void;
}

interface FileManagerFileUploaderOptions extends WidgetProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getController?: () => any;
  dropZone?: dxElementWrapper;
  dropZonePlaceholderContainer?: dxElementWrapper;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadSessionStarted?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadProgress?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadFinished?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  splitterElement?: any;
}

class FileManagerFileUploader extends Widget<FileManagerFileUploaderOptions> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _uploaderInfos!: any;

  _$dropZonePlaceholder?: dxElementWrapper;

  _actions!: FileManagerFileUploaderActions;

  _initMarkup(): void {
    this._initActions();

    this.$element().addClass(FILE_MANAGER_FILE_UPLOADER_CLASS);

    this._uploaderInfos = [];

    this._createInternalFileUploader();
    this._createDropZonePlaceholder();
    this._setDropZonePlaceholderVisible(false);

    super._initMarkup();
  }

  _createInternalFileUploader(): void {
    const { chunkSize } = this._getController();

    const $fileUploader = $('<div>').appendTo(this.$element());

    const fileUploader = this._createComponent($fileUploader, FileUploader, {
      name: 'file',
      multiple: true,
      showFileList: false,
      activeStateEnabled: false,
      focusStateEnabled: false,
      hoverStateEnabled: false,
      labelText: '',
      readyToUploadMessage: '',
      accept: '*',
      chunkSize,
      dropZone: this.option('dropZone'),
      onValueChanged: (e) => this._onFileUploaderValueChanged(e),
      onProgress: (e) => this._onFileUploaderProgress(e),
      onUploaded: (e) => this._onFileUploaderUploaded(e),
      onFilesUploaded: (e) => this._onFileUploaderAllFilesUploaded(e),
      onUploadAborted: (e) => this._onFileUploaderUploadAborted(e),
      onUploadError: (e) => this._onFileUploaderUploadError(e),
      onDropZoneEnter: () => this._setDropZonePlaceholderVisible(true),
      onDropZoneLeave: () => this._setDropZonePlaceholderVisible(false),
    });

    fileUploader.option({
      uploadChunk: (
        file,
        chunksData,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      ) => this._fileUploaderUploadChunk(fileUploader, file, chunksData),
      abortUpload: (
        file,
        chunksData,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      ) => this._fileUploaderAbortUpload(fileUploader, file, chunksData),
    });

    // @ts-expect-error ts-error
    fileUploader._shouldRaiseDragLeaveBase = fileUploader._shouldRaiseDragLeave;
    // @ts-expect-error ts-error
    // eslint-disable-next-line @stylistic/max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/explicit-function-return-type
    fileUploader._shouldRaiseDragLeave = (e) => this._shouldRaiseDragLeave(e, fileUploader);

    const uploaderInfo = {
      fileUploader,
    };

    this._uploaderInfos.push(uploaderInfo);
  }

  tryUpload(): void {
    const info = this._findAndUpdateAvailableUploaderInfo();
    if (info) {
      info.fileUploader._selectFileDialogClickHandler();
    }
  }

  cancelUpload(sessionId): void {
    this._cancelUpload(sessionId);
  }

  cancelFileUpload(sessionId, fileIndex): void {
    this._cancelUpload(sessionId, fileIndex);
  }

  _cancelUpload(sessionId, fileIndex?): void {
    const { fileUploader } = this._findUploaderInfoBySessionId(sessionId);
    fileUploader.abortUpload(fileIndex);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _fileUploaderUploadChunk(fileUploader, file, chunksInfo) {
    const { session, fileIndex } = this._findSessionByFile(fileUploader, file);
    const { controller } = session;
    chunksInfo.fileIndex = fileIndex;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return controller.uploadFileChunk(file, chunksInfo);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _fileUploaderAbortUpload(fileUploader, file, chunksInfo) {
    const { session, fileIndex } = this._findSessionByFile(fileUploader, file);
    const { controller } = session;
    chunksInfo.fileIndex = fileIndex;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return controller.abortFileUpload(file, chunksInfo);
  }

  _onFileUploaderValueChanged({ component, value }): void {
    if (value.length === 0) {
      return;
    }

    const files = value.slice();
    const uploaderInfo = this._findUploaderInfo(component);
    this._uploadFiles(uploaderInfo, files);

    // eslint-disable-next-line no-restricted-globals
    setTimeout((): void => {
      if (!this._findAndUpdateAvailableUploaderInfo()) {
        this._createInternalFileUploader();
      }
    });
  }

  _onFileUploaderProgress({
    component, file, bytesLoaded, bytesTotal,
  }): void {
    const { session, fileIndex } = this._findSessionByFile(component, file);

    const fileValue = bytesTotal !== 0 ? bytesLoaded / bytesTotal : 1;
    const commonValue = component.option('progress') / 100;

    const args = {
      sessionId: session.id,
      fileIndex,
      commonValue,
      fileValue,
    };
    this._raiseUploadProgress(args);
  }

  _onFileUploaderAllFilesUploaded({ component }): void {
    const { session } = this._findSessionByFile(
      component,
      component._files[0].value,
    );
    this._raiseUploadFinished({
      sessionId: session.id,
      commonValue: component.option('progress') / 100,
    });
  }

  _onFileUploaderUploaded({ component, file }): void {
    const deferred = this._getDeferredForFile(component, file);
    deferred.resolve();
  }

  _onFileUploaderUploadAborted({ component, file }): void {
    const deferred = this._getDeferredForFile(component, file);
    deferred.resolve({ canceled: true });
  }

  _onFileUploaderUploadError({ component, file, error }): void {
    const deferred = this._getDeferredForFile(component, file);
    deferred.reject(error);
  }

  _createDropZonePlaceholder(): void {
    const { dropZonePlaceholderContainer } = this.option();
    this._$dropZonePlaceholder = $('<div>')
      .addClass(FILE_MANAGER_FILE_UPLOADER_DROPZONE_PLACEHOLDER_CLASS)
      .appendTo($(dropZonePlaceholderContainer));
  }

  _adjustDropZonePlaceholder(): void {
    const { dropZone } = this.option();
    const $dropZoneTarget = dropZone;
    if (!hasWindow() || $dropZoneTarget?.length === 0) {
      return;
    }
    const placeholderBorderTopWidth = parseFloat(
      this._$dropZonePlaceholder?.css('borderTopWidth') ?? '',
    );
    const placeholderBorderLeftWidth = parseFloat(
      this._$dropZonePlaceholder?.css('borderLeftWidth') ?? '',
    );

    const { dropZonePlaceholderContainer } = this.option();
    const $placeholderContainer = dropZonePlaceholderContainer;
    const containerBorderBottomWidth = parseFloat(
      $placeholderContainer?.css('borderBottomWidth') ?? '',
    );
    const containerBorderLeftWidth = parseFloat(
      $placeholderContainer?.css('borderLeftWidth') ?? '',
    );
    const containerHeight = getInnerHeight($placeholderContainer);
    const containerOffset = $placeholderContainer?.offset();
    const dropZoneOffset = $dropZoneTarget?.offset();

    this._$dropZonePlaceholder?.css({
      top:
      // @ts-expect-error
      // eslint-disable-next-line no-unsafe-optional-chaining
        dropZoneOffset?.top
        // @ts-expect-error
        // eslint-disable-next-line no-unsafe-optional-chaining
        - containerOffset?.top
        - containerHeight
        - containerBorderBottomWidth,
      left:
      // @ts-expect-error
      // eslint-disable-next-line no-unsafe-optional-chaining
        dropZoneOffset?.left - containerOffset?.left - containerBorderLeftWidth,
    });
    setHeight(
      this._$dropZonePlaceholder,
      // @ts-expect-error
      // eslint-disable-next-line no-unsafe-optional-chaining
      $dropZoneTarget?.get(0).offsetHeight - placeholderBorderTopWidth * 2,
    );
    setWidth(
      this._$dropZonePlaceholder,
      // @ts-expect-error
      // eslint-disable-next-line no-unsafe-optional-chaining
      $dropZoneTarget?.get(0).offsetWidth - placeholderBorderLeftWidth * 2,
    );
  }

  _setDropZonePlaceholderVisible(visible): void {
    if (visible) {
      this._adjustDropZonePlaceholder();
      this._$dropZonePlaceholder?.css('display', '');
    } else {
      this._$dropZonePlaceholder?.css('display', 'none');
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _shouldRaiseDragLeave(e, uploaderInstance) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      uploaderInstance.isMouseOverElement(e, this.option('splitterElement'))
      || uploaderInstance._shouldRaiseDragLeaveBase(e, true)
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _uploadFiles(uploaderInfo, files) {
    this._setDropZonePlaceholderVisible(false);
    const sessionId = new Guid().toString();
    const controller = this._getController();
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const deferreds = files.map(() => new Deferred());
    uploaderInfo.session = {
      id: sessionId,
      controller,
      files,
      deferreds,
    };

    const sessionInfo = { sessionId, deferreds, files };
    this._raiseUploadSessionStarted(sessionInfo);

    // eslint-disable-next-line no-restricted-globals
    return whenSome(deferreds).always(() => setTimeout((): void => {
      uploaderInfo.fileUploader.clear();
      uploaderInfo.session = null;
    }));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDeferredForFile(fileUploader, file) {
    const { session, fileIndex } = this._findSessionByFile(fileUploader, file);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return session.deferreds[fileIndex];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _findSessionByFile(fileUploader, file) {
    const uploaderInfo = this._findUploaderInfo(fileUploader);
    const { session } = uploaderInfo;
    const fileIndex = session.files.indexOf(file);
    return { session, fileIndex };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _findUploaderInfoBySessionId(sessionId) {
    for (let i = 0; i < this._uploaderInfos?.length; i += 1) {
      const uploaderInfo = this._uploaderInfos[i];
      const { session } = uploaderInfo;

      if (session && session.id === sessionId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return uploaderInfo;
      }
    }

    return null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _findAndUpdateAvailableUploaderInfo() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let info: any = null;
    for (let i = 0; i < this._uploaderInfos?.length; i += 1) {
      const currentInfo = this._uploaderInfos[i];
      currentInfo.fileUploader.option('dropZone', '');
      if (!info && !currentInfo.session) {
        info = currentInfo;
      }
    }
    const { dropZone } = this.option();
    info?.fileUploader.option('dropZone', dropZone);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return info;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _findUploaderInfo(fileUploader) {
    for (let i = 0; i < this._uploaderInfos?.length; i += 1) {
      const info = this._uploaderInfos[i];
      if (info.fileUploader === fileUploader) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return info;
      }
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getController() {
    const { getController: controllerGetter } = this.option();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return controllerGetter?.();
  }

  _raiseUploadSessionStarted(sessionInfo): void {
    this._actions.onUploadSessionStarted?.({ sessionInfo });
  }

  _raiseUploadProgress(args): void {
    this._actions.onUploadProgress?.(args);
  }

  _raiseUploadFinished(args): void {
    this._actions.onUploadFinished?.(args);
  }

  _initActions(): void {
    this._actions = {
      onUploadSessionStarted: this._createActionByOption(
        'onUploadSessionStarted',
      ),
      onUploadProgress: this._createActionByOption('onUploadProgress'),
      onUploadFinished: this._createActionByOption('onUploadFinished'),
    };
  }

  _getDefaultOptions(): FileManagerFileUploaderOptions {
    return {
      ...super._getDefaultOptions(),
      getController: undefined,
      onUploadSessionStarted: undefined,
      onUploadProgress: undefined,
      onUploadFinished: undefined,
      splitterElement: undefined,
    };
  }

  _optionChanged(args: OptionChanged<FileManagerFileUploaderOptions>): void {
    const { name, value } = args;

    switch (name) {
      case 'getController':
        this.repaint();
        break;
      case 'onUploadSessionStarted':
      case 'onUploadProgress':
      case 'onUploadFinished':
        this._actions[name] = this._createActionByOption(name);
        break;
      case 'dropZone':
        this._findAndUpdateAvailableUploaderInfo();
        this._adjustDropZonePlaceholder();
        break;
      case 'dropZonePlaceholderContainer':
        this._$dropZonePlaceholder?.detach();
        // @ts-expect-error ts-error
        this._$dropZonePlaceholder?.appendTo(value);
        break;
      case 'splitterElement':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default FileManagerFileUploader;
