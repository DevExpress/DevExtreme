/* eslint-disable @typescript-eslint/explicit-module-boundary-types,max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { format } from '@js/core/utils/string';
import { isDefined } from '@js/core/utils/type';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import type { FileItemsController } from '@ts/ui/file_manager/file_items_controller';
import type { ItemThumbnailInfo } from '@ts/ui/file_manager/ui.file_manager';
import FileManagerDialogManager from '@ts/ui/file_manager/ui.file_manager.dialog_manager';
import FileManagerFileUploader from '@ts/ui/file_manager/ui.file_manager.file_uploader';
import { ErrorCode, FileManagerMessages } from '@ts/ui/file_manager/ui.file_manager.messages';
import type FileManagerNotificationControl from '@ts/ui/file_manager/ui.file_manager.notification';

interface FileManagerActionMetadata {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action?: (arg?: any) => any;
  affectsAllItems?: boolean;
  allowCancel?: boolean;
  allowItemProgress?: boolean;
  singleItemProcessingMessage?: string;
  multipleItemsProcessingMessage?: string;
  singleItemSuccessMessage?: string;
  multipleItemsSuccessMessage?: string;
  singleItemErrorMessage?: string;
  multipleItemsErrorMessage?: string;
  commonErrorMessage?: string;
  canceledMessage?: string;
}

type FileManagerMetadataMap = Record<string, FileManagerActionMetadata>;

class FileManagerActionContext {
  _actionMetadata: FileManagerActionMetadata;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _itemInfos: any;

  _onlyFiles: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _items: any;

  _multipleItems: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _location: any;

  _singleRequest: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _completedItems: any[];

  _commonProgress: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _errorState: any;

  _itemNewName: string;

  constructor(actionMetadata: FileManagerActionMetadata, itemInfos, directoryInfo) {
    this._actionMetadata = actionMetadata;
    this._itemInfos = itemInfos;

    this._onlyFiles = !this._actionMetadata.affectsAllItems
      && this._itemInfos.every((info): boolean => !info.fileItem.isDirectory);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this._items = this._itemInfos.map((itemInfo) => itemInfo.fileItem);
    this._multipleItems = this._items.length > 1;
    this._location = directoryInfo.getDisplayName();

    this._singleRequest = true;

    this._completedItems = [];
    this._commonProgress = 0;

    this._errorState = { failedCount: 0 };
    this._itemNewName = '';
  }

  completeOperationItem(itemIndex): void {
    if (this._singleRequest) {
      this._completedItems = [...this._items];
    } else {
      const item = this._items[itemIndex];
      this._completedItems.push(item);
    }
    if (!this._actionMetadata.allowItemProgress) {
      this._commonProgress = (this._completedItems.length / this._items.length) * 100;
    }
  }

  processSingleRequestError(errorText): void {
    this._errorState.failedCount = 1;
    this._errorState.commonErrorText = this._multipleItems
      ? this._actionMetadata.commonErrorMessage
      : this._actionMetadata.singleItemErrorMessage;

    const itemIndex = this._multipleItems ? -1 : 1;
    const itemInfo = this.getItemForSingleRequestError();
    this._setCurrentDetailError(itemIndex, itemInfo, errorText);
  }

  processMultipleRequestError(itemIndex, errorText): void {
    this._errorState.failedCount += 1;

    this._errorState.commonErrorText = this._errorState.failedCount > 1
      ? format(
        this._actionMetadata.multipleItemsErrorMessage,
        this._errorState.failedCount,
      )
      : this._actionMetadata.singleItemErrorMessage;

    const itemInfo = this.getItemForMultipleRequestError(itemIndex);
    this._setCurrentDetailError(itemIndex, itemInfo, errorText);
  }

  hasModifiedItems(): boolean {
    return (
      this._hasCompletedItems()
      || (this._singleRequest && !this.success && this._multipleItems)
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItemForSingleRequestError() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._multipleItems ? null : this._itemInfos[0];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItemForMultipleRequestError(itemIndex) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._itemInfos[itemIndex];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItemName(errorCode, itemIndex) {
    const itemInfo = this.singleRequest
      ? this.getItemForSingleRequestError()
      : this.getItemForMultipleRequestError(itemIndex);
    let result = itemInfo?.fileItem.name;
    if (this.itemNewName && this._isItemExistsErrorCode(errorCode)) {
      result = this.itemNewName;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  _isItemExistsErrorCode(errorCode): boolean {
    return (
      errorCode === ErrorCode.DirectoryExists
      || errorCode === ErrorCode.FileExists
    );
  }

  _setCurrentDetailError(itemIndex, itemInfo, errorText): void {
    this._errorState.currentDetailError = { itemIndex, itemInfo, errorText };
  }

  _hasCompletedItems(): boolean {
    return this._completedItems.length > 0;
  }

  get actionMetadata(): FileManagerActionMetadata {
    return this._actionMetadata;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get itemInfos() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._itemInfos;
  }

  get itemNewName(): string {
    return this._itemNewName;
  }

  set itemNewName(value: string) {
    this._itemNewName = value;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get errorState() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._errorState;
  }

  get singleRequest(): boolean {
    return this._singleRequest;
  }

  set singleRequest(value: boolean) {
    this._singleRequest = value;
  }

  get multipleItems(): boolean {
    return this._multipleItems;
  }

  get onlyFiles(): boolean {
    return this._onlyFiles;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get processingMessage() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._multipleItems
      ? format(
        this._actionMetadata.multipleItemsProcessingMessage,
        this._items.length,
        this._location,
      )
      : format(
        this._actionMetadata.singleItemProcessingMessage,
        this._location,
      );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get successMessage() {
    if (this._hasCompletedItems()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._multipleItems
        ? format(
          this._actionMetadata.multipleItemsSuccessMessage,
          this._completedItems.length,
          this._location,
        )
        : format(this._actionMetadata.singleItemSuccessMessage, this._location);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._multipleItems
      ? format(
        this._actionMetadata.multipleItemsErrorMessage,
        this._items.length,
      )
      : this._actionMetadata.singleItemErrorMessage;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get completionMessage() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.success ? this.successMessage : this.errorState.commonErrorText;
  }

  get statusText(): string | undefined {
    return this.success && !this._hasCompletedItems()
      ? this._actionMetadata.canceledMessage
      : undefined;
  }

  get commonProgress(): number {
    return this._commonProgress;
  }

  get success(): boolean {
    return !this._errorState.failedCount;
  }
}

interface FileManagerEditingControlActions {
  onSuccess: (e) => void;
  onError: (e) => void;
}

interface FileManagerEditingControlOptions extends WidgetProperties {
  controller?: FileItemsController;
  model: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMultipleSelectedItems?: () => any;
  };
  getItemThumbnail?: (item) => ItemThumbnailInfo;
  notificationControl?: FileManagerNotificationControl;
  uploadDropZonePlaceholderContainer?: dxElementWrapper;
  rtlEnabled?: boolean;
  onSuccess?: (e) => void;
  onError?: (e) => void;
}

class FileManagerEditingControl extends Widget<FileManagerEditingControlOptions> {
  _controller?: FileItemsController;

  _model?: FileManagerEditingControlOptions['model'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _uploadOperationInfoMap!: Record<string, any>;

  _dialogManager?: FileManagerDialogManager;

  _fileUploader?: FileManagerFileUploader;

  _metadataMap?: FileManagerMetadataMap;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dialogDeferred?: DeferredObj<any>;

  _actions!: FileManagerEditingControlActions;

  _notificationControl?: FileManagerNotificationControl;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _uploadDirectoryInfo?: any;

  _initMarkup(): void {
    super._initMarkup();

    this._initActions();

    const { controller } = this.option();

    this._controller = controller;
    this._controller?.on(
      'EditActionStarting',
      this._onEditActionStarting.bind(this),
    );
    this._controller?.on(
      'EditActionResultAcquired',
      this._onEditActionResultAcquired.bind(this),
    );
    this._controller?.on(
      'EditActionItemError',
      this._onEditActionItemError.bind(this),
    );
    this._controller?.on('EditActionError', this._onEditActionError.bind(this));
    this._controller?.on(
      'CompleteEditActionItem',
      this._onCompleteEditActionItem.bind(this),
    );
    this._controller?.on(
      'CompleteEditAction',
      this._onCompleteEditAction.bind(this),
    );

    const { model } = this.option();
    this._model = model;
    this._uploadOperationInfoMap = {};

    const { rtlEnabled } = this.option();

    this._dialogManager = new FileManagerDialogManager(this.$element(), {
      chooseDirectoryDialog: {
        provider: this._controller?._fileProvider,
        getDirectories: this._controller?.getDirectories.bind(this._controller),
        getCurrentDirectory: this._controller?.getCurrentDirectory.bind(
          this._controller,
        ),
      },
      rtlEnabled,
      onDialogClosed: this._onDialogClosed.bind(this),
    });

    this._fileUploader = this._createFileUploader();
    const { notificationControl } = this.option();
    if (notificationControl) {
      this._initNotificationControl(notificationControl);
    }

    this._createMetadataMap();
  }

  _initNotificationControl(notificationControl: FileManagerNotificationControl): void {
    this._notificationControl = notificationControl;
    this._notificationControl.option({
      onOperationCanceled: ({ info }) => this._onCancelUploadSession(info),
      onOperationItemCanceled: ({ item, itemIndex }) => this._onCancelFileUpload(item, itemIndex),
    });
  }

  _getFileUploaderComponent(): typeof FileManagerFileUploader {
    return FileManagerFileUploader;
  }

  _createFileUploader(): FileManagerFileUploader {
    const $fileUploader = $('<div>').appendTo(this.$element());
    const { uploadDropZonePlaceholderContainer } = this.option();
    return this._createComponent(
      $fileUploader,
      this._getFileUploaderComponent(),
      {
        getController: this._getFileUploaderController.bind(this),
        dropZonePlaceholderContainer: uploadDropZonePlaceholderContainer,
        onUploadSessionStarted: (e) => this._onUploadSessionStarted(e),
        onUploadProgress: (e) => this._onUploadProgress(e),
        onUploadFinished: (e) => this._onUploadFinished(e),
      },
    );
  }

  setUploaderDropZone($element): void {
    this._fileUploader?.option('dropZone', $element);
  }

  setUploaderSplitterElement(element): void {
    this._fileUploader?.option('splitterElement', element);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFileUploaderController() {
    const uploadDirectory = this.uploadDirectoryInfo.fileItem;
    return {
      chunkSize: this._controller?.getFileUploadChunkSize(),
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      uploadFileChunk: (
        fileData,
        chunksInfo,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      ) => this._controller?.uploadFileChunk(fileData, chunksInfo, uploadDirectory),
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      abortFileUpload: (
        fileData,
        chunksInfo,
      ) => this._controller?.abortFileUpload(fileData, chunksInfo, uploadDirectory),
    };
  }

  _createMetadataMap(): void {
    this._metadataMap = {
      create: {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        action: (arg) => this._tryCreate(arg),
        affectsAllItems: true,
        singleItemProcessingMessage: messageLocalization.format(
          'dxFileManager-editingCreateSingleItemProcessingMessage',
        ),
        singleItemSuccessMessage: messageLocalization.format(
          'dxFileManager-editingCreateSingleItemSuccessMessage',
        ),
        singleItemErrorMessage: messageLocalization.format(
          'dxFileManager-editingCreateSingleItemErrorMessage',
        ),
        commonErrorMessage: messageLocalization.format(
          'dxFileManager-editingCreateCommonErrorMessage',
        ),
      },

      rename: {
        // eslint-disable-next-line @stylistic/max-len
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unsafe-return
        action: (arg) => this._tryRename(arg),
        singleItemProcessingMessage: messageLocalization.format(
          'dxFileManager-editingRenameSingleItemProcessingMessage',
        ),
        singleItemSuccessMessage: messageLocalization.format(
          'dxFileManager-editingRenameSingleItemSuccessMessage',
        ),
        singleItemErrorMessage: messageLocalization.format(
          'dxFileManager-editingRenameSingleItemErrorMessage',
        ),
        commonErrorMessage: messageLocalization.format(
          'dxFileManager-editingRenameCommonErrorMessage',
        ),
      },

      delete: {
        // eslint-disable-next-line @stylistic/max-len
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unsafe-return
        action: (arg) => this._tryDelete(arg),
        singleItemProcessingMessage: messageLocalization.format(
          'dxFileManager-editingDeleteSingleItemProcessingMessage',
        ),
        multipleItemsProcessingMessage: messageLocalization.format(
          'dxFileManager-editingDeleteMultipleItemsProcessingMessage',
        ),
        singleItemSuccessMessage: messageLocalization.format(
          'dxFileManager-editingDeleteSingleItemSuccessMessage',
        ),
        multipleItemsSuccessMessage: messageLocalization.format(
          'dxFileManager-editingDeleteMultipleItemsSuccessMessage',
        ),
        singleItemErrorMessage: messageLocalization.format(
          'dxFileManager-editingDeleteSingleItemErrorMessage',
        ),
        multipleItemsErrorMessage: messageLocalization.format(
          'dxFileManager-editingDeleteMultipleItemsErrorMessage',
        ),
        commonErrorMessage: messageLocalization.format(
          'dxFileManager-editingDeleteCommonErrorMessage',
        ),
      },

      move: {
        // eslint-disable-next-line @stylistic/max-len
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unsafe-return
        action: (arg) => this._tryMove(arg),
        singleItemProcessingMessage: messageLocalization.format(
          'dxFileManager-editingMoveSingleItemProcessingMessage',
        ),
        multipleItemsProcessingMessage: messageLocalization.format(
          'dxFileManager-editingMoveMultipleItemsProcessingMessage',
        ),
        singleItemSuccessMessage: messageLocalization.format(
          'dxFileManager-editingMoveSingleItemSuccessMessage',
        ),
        multipleItemsSuccessMessage: messageLocalization.format(
          'dxFileManager-editingMoveMultipleItemsSuccessMessage',
        ),
        singleItemErrorMessage: messageLocalization.format(
          'dxFileManager-editingMoveSingleItemErrorMessage',
        ),
        multipleItemsErrorMessage: messageLocalization.format(
          'dxFileManager-editingMoveMultipleItemsErrorMessage',
        ),
        commonErrorMessage: messageLocalization.format(
          'dxFileManager-editingMoveCommonErrorMessage',
        ),
      },

      copy: {
        // eslint-disable-next-line @stylistic/max-len
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unsafe-return
        action: (arg) => this._tryCopy(arg),
        singleItemProcessingMessage: messageLocalization.format(
          'dxFileManager-editingCopySingleItemProcessingMessage',
        ),
        multipleItemsProcessingMessage: messageLocalization.format(
          'dxFileManager-editingCopyMultipleItemsProcessingMessage',
        ),
        singleItemSuccessMessage: messageLocalization.format(
          'dxFileManager-editingCopySingleItemSuccessMessage',
        ),
        multipleItemsSuccessMessage: messageLocalization.format(
          'dxFileManager-editingCopyMultipleItemsSuccessMessage',
        ),
        singleItemErrorMessage: messageLocalization.format(
          'dxFileManager-editingCopySingleItemErrorMessage',
        ),
        multipleItemsErrorMessage: messageLocalization.format(
          'dxFileManager-editingCopyMultipleItemsErrorMessage',
        ),
        commonErrorMessage: messageLocalization.format(
          'dxFileManager-editingCopyCommonErrorMessage',
        ),
      },

      upload: {
        action: (arg): void => this._tryUpload(arg),
        allowCancel: true,
        allowItemProgress: true,
        singleItemProcessingMessage: messageLocalization.format(
          'dxFileManager-editingUploadSingleItemProcessingMessage',
        ),
        multipleItemsProcessingMessage: messageLocalization.format(
          'dxFileManager-editingUploadMultipleItemsProcessingMessage',
        ),
        singleItemSuccessMessage: messageLocalization.format(
          'dxFileManager-editingUploadSingleItemSuccessMessage',
        ),
        multipleItemsSuccessMessage: messageLocalization.format(
          'dxFileManager-editingUploadMultipleItemsSuccessMessage',
        ),
        singleItemErrorMessage: messageLocalization.format(
          'dxFileManager-editingUploadSingleItemErrorMessage',
        ),
        multipleItemsErrorMessage: messageLocalization.format(
          'dxFileManager-editingUploadMultipleItemsErrorMessage',
        ),
        canceledMessage: messageLocalization.format(
          'dxFileManager-editingUploadCanceledMessage',
        ),
      },

      download: {
        // eslint-disable-next-line @stylistic/max-len
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unsafe-return
        action: (arg) => this._download(arg),
        singleItemProcessingMessage: '',
        multipleItemsProcessingMessage: '',
        singleItemErrorMessage: messageLocalization.format(
          'dxFileManager-editingDownloadSingleItemErrorMessage',
        ),
        multipleItemsErrorMessage: messageLocalization.format(
          'dxFileManager-editingDownloadMultipleItemsErrorMessage',
        ),
      },

      getItemContent: {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        action: (arg) => this._getItemContent(arg),
      },

      getItems: {
        singleItemProcessingMessage: '',
        singleItemErrorMessage: messageLocalization.format(
          'dxFileManager-errorDirectoryOpenFailed',
        ),
        commonErrorMessage: messageLocalization.format(
          'dxFileManager-errorDirectoryOpenFailed',
        ),
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getCommandActions() {
    const result = {};

    each(this._metadataMap, (name): void => {
      if (Object.prototype.hasOwnProperty.call(this._metadataMap, name)) {
        // eslint-disable-next-line @stylistic/max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/explicit-function-return-type
        result[name] = (arg) => this._executeAction(name, arg);
      }
    });

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _executeAction(actionName: string, arg) {
    const actionMetadata = this._metadataMap?.[actionName];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return actionMetadata ? actionMetadata?.action?.(arg) : null;
  }

  _onCancelUploadSession(info): void {
    this._fileUploader?.cancelUpload(info.uploadSessionId);
  }

  _onCancelFileUpload(item, itemIndex): void {
    this._fileUploader?.cancelFileUpload(item.info.uploadSessionId, itemIndex);
  }

  _onUploadProgress({
    sessionId, fileIndex, commonValue, fileValue,
  }): void {
    const { operationInfo } = this._uploadOperationInfoMap[sessionId];
    this._notificationControl?.updateOperationItemProgress(
      operationInfo,
      fileIndex,
      fileValue * 100,
      commonValue * 100,
    );
  }

  _onUploadFinished({ sessionId, commonValue }): void {
    const { operationInfo } = this._uploadOperationInfoMap[sessionId];
    this._notificationControl?.finishOperation(operationInfo, commonValue * 100);
    this._scheduleUploadSessionDisposal(sessionId, 'uploader');
  }

  _onUploadSessionStarted({ sessionInfo }): void {
    this._controller?.processUploadSession(
      sessionInfo,
      this.uploadDirectoryInfo,
    );
  }

  _onEditActionStarting(actionInfo): void {
    const actionMetadata = this._metadataMap?.[actionInfo.name] ?? {};
    const context = new FileManagerActionContext(
      actionMetadata,
      actionInfo.itemInfos,
      actionInfo.directory,
    );
    const operationInfo = this._notificationControl?.addOperation(
      context.processingMessage,
      actionMetadata?.allowCancel,
      !actionMetadata?.allowItemProgress,
    );
    extend(actionInfo.customData, { context, operationInfo });

    switch (actionInfo.name) {
      case 'upload': {
        const { sessionId } = actionInfo.customData.sessionInfo;
        operationInfo.uploadSessionId = sessionId;
        this._uploadOperationInfoMap[sessionId] = { operationInfo };
        break;
      }
      case 'rename':
        actionInfo.customData.context.itemNewName = actionInfo.customData.itemNewName;
        break;
      default:
        break;
    }
  }

  _onEditActionResultAcquired(actionInfo): void {
    const { context, operationInfo } = actionInfo.customData;
    context.singleRequest = actionInfo.singleRequest;
    const details = context.itemInfos.map((itemInfo) => this._getItemProgressDisplayInfo(itemInfo));
    this._notificationControl?.addOperationDetails(
      operationInfo,
      details,
      context.actionMetadata.allowCancel,
    );
  }

  _onEditActionError(actionInfo, errorInfo): void {
    const { context, operationInfo } = actionInfo.customData;
    context.singleRequest = actionInfo.singleRequest;
    this._handleActionError(operationInfo, context, errorInfo);
    this._completeAction(operationInfo, context);
  }

  _onEditActionItemError(actionInfo, errorInfo): void {
    const { context, operationInfo } = actionInfo.customData;
    this._handleActionError(operationInfo, context, errorInfo);
  }

  _onCompleteEditActionItem(actionInfo, info): void {
    const { context, operationInfo } = actionInfo.customData;
    if (!info.result?.canceled) {
      context.completeOperationItem(info.index);
      this._notificationControl?.completeOperationItem(
        operationInfo,
        info.index,
        context.commonProgress,
      );
    }
  }

  _onCompleteEditAction(actionInfo): void {
    const { context, operationInfo } = actionInfo.customData;
    this._completeAction(operationInfo, context);

    if (actionInfo.name === 'upload') {
      this._scheduleUploadSessionDisposal(
        actionInfo.customData.sessionInfo.sessionId,
        'controller',
      );
    }
  }

  _scheduleUploadSessionDisposal(sessionId, requester): void {
    if (
      isDefined(this._uploadOperationInfoMap[sessionId].requester)
      && this._uploadOperationInfoMap[sessionId].requester !== requester
    ) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._uploadOperationInfoMap[sessionId];
    } else {
      this._uploadOperationInfoMap[sessionId].requester = requester;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _tryCreate(parentDirectories) {
    const parentDirectoryInfo = parentDirectories?.[0]
      || this._getCurrentDirectory();
    const newDirName = messageLocalization.format(
      'dxFileManager-newDirectoryName',
    );
    return this._showDialog(
      this._dialogManager?.getCreateItemDialog(),
      newDirName,
    )?.then(({ name }) => this._controller?.createDirectory(parentDirectoryInfo, name));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _tryRename(itemInfos) {
    const itemInfo = itemInfos?.[0] || this._model?.getMultipleSelectedItems?.()[0];
    if (!itemInfo) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().reject().promise();
    }
    return this._showDialog(
      this._dialogManager?.getRenameItemDialog(),
      itemInfo.fileItem.name,
    )?.then(({ name }) => this._controller?.renameItem(itemInfo, name));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _tryDelete(itemInfos) {
    // eslint-disable-next-line no-param-reassign
    itemInfos = itemInfos || this._model?.getMultipleSelectedItems?.();
    if (itemInfos.length === 0) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().reject().promise();
    }
    const itemName = itemInfos[0].fileItem.name;
    const itemCount = itemInfos.length;
    return this._showDialog(this._dialogManager?.getDeleteItemDialog(), {
      itemName,
      itemCount,
    })?.then(() => this._controller?.deleteItems(itemInfos));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _tryMove(itemInfos) {
    // eslint-disable-next-line no-param-reassign
    itemInfos = itemInfos || this._model?.getMultipleSelectedItems?.();
    if (itemInfos.length === 0) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().reject().promise();
    }
    return this._showDialog(this._dialogManager?.getMoveDialog(itemInfos))?.then(
      ({ folder }) => this._controller?.moveItems(itemInfos, folder),
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _tryCopy(itemInfos) {
    // eslint-disable-next-line no-param-reassign
    itemInfos = itemInfos || this._model?.getMultipleSelectedItems?.();
    if (itemInfos.length === 0) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().reject().promise();
    }
    return this._showDialog(this._dialogManager?.getCopyDialog(itemInfos))?.then(
      ({ folder }) => this._controller?.copyItems(itemInfos, folder),
    );
  }

  _tryUpload(destinationFolder): void {
    this._uploadDirectoryInfo = destinationFolder?.[0];
    this._fileUploader?.tryUpload();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _download(itemInfos) {
    // eslint-disable-next-line no-param-reassign
    itemInfos = itemInfos || this._model?.getMultipleSelectedItems?.();
    if (itemInfos.length === 0) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().reject().promise();
    }
    return this._controller?.downloadItems(itemInfos);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemContent(itemInfos) {
    // eslint-disable-next-line no-param-reassign
    itemInfos = itemInfos || this._model?.getMultipleSelectedItems?.();
    return this._controller?.getItemContent(itemInfos);
  }

  _completeAction(operationInfo, context): void {
    this._notificationControl?.completeOperation(
      operationInfo,
      context.completionMessage,
      !context.success,
      context.statusText,
    );

    if (context.hasModifiedItems()) {
      this._raiseOnSuccess(context.onlyFiles);
    }
  }

  _handleActionError(operationInfo, context, errorInfo): void {
    operationInfo.hasError = true;

    if (context.singleRequest) {
      this._handleSingleRequestActionError(operationInfo, context, errorInfo);
    } else {
      this._handleMultipleRequestActionError(operationInfo, context, errorInfo);
    }
  }

  _handleSingleRequestActionError(operationInfo, context, errorInfo): void {
    const itemInfo = context.getItemForSingleRequestError();
    const itemName = context.getItemName(errorInfo.errorCode);
    const errorText = this._getErrorText(errorInfo, itemInfo, itemName);

    context.processSingleRequestError(errorText);
    const operationErrorInfo = this._getOperationErrorInfo(context);
    this._notificationControl?.completeSingleOperationWithError(
      operationInfo,
      operationErrorInfo,
    );

    if (context.multipleItems) {
      this._raiseOnSuccess(context.onlyFiles);
    }
  }

  _handleMultipleRequestActionError(operationInfo, context, errorInfo): void {
    const itemInfo = context.getItemForMultipleRequestError(errorInfo.index);
    const itemName = context.getItemName(errorInfo.errorCode, errorInfo.index);
    const errorText = this._getErrorText(errorInfo, itemInfo, itemName);

    context.processMultipleRequestError(errorInfo.index, errorText);
    const operationErrorInfo = this._getOperationErrorInfo(context);
    this._notificationControl?.addOperationDetailsError(
      operationInfo,
      operationErrorInfo,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getOperationErrorInfo(context) {
    const detailError = context.errorState.currentDetailError;
    return {
      commonErrorText: context.errorState.commonErrorText,
      item: detailError.itemInfo
        ? this._getItemProgressDisplayInfo(detailError.itemInfo)
        : null,
      itemIndex: detailError.itemIndex,
      detailErrorText: detailError.errorText,
    };
  }

  _getErrorText(errorInfo, itemInfo, itemName): string {
    const errorText = errorInfo.errorText
      || FileManagerMessages.get(errorInfo.errorCode, itemName);

    const errorArgs = {
      fileSystemItem: itemInfo?.fileItem,
      errorCode: errorInfo.errorCode,
      errorText,
    };
    this._raiseOnError(errorArgs);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return errorArgs.errorText;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemProgressDisplayInfo(itemInfo) {
    return {
      commonText: itemInfo.fileItem.name,
      imageUrl: this._getItemThumbnail(itemInfo),
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _showDialog(dialog, dialogArgument?) {
    // @ts-expect-error ts-error
    this._dialogDeferred = new Deferred();
    dialog.show(dialogArgument);

    return this._dialogDeferred?.promise();
  }

  _onDialogClosed(e): void {
    const result = e.dialogResult;
    if (result) {
      this._dialogDeferred?.resolve(result);
    } else {
      this._dialogDeferred?.reject();
    }
  }

  updateDialogRtl(value): void {
    this._dialogManager?.updateDialogRtl(value);
  }

  _getItemThumbnail(item): string | null | undefined {
    const { getItemThumbnail } = this.option();
    if (!getItemThumbnail) {
      return null;
    }
    const info = getItemThumbnail(item);
    return info ? info.thumbnail : null;
  }

  _initActions(): void {
    this._actions = {
      onSuccess: this._createActionByOption('onSuccess'),
      onError: this._createActionByOption('onError'),
    };
  }

  _getDefaultOptions(): FileManagerEditingControlOptions {
    return {
      ...super._getDefaultOptions(),
      model: {
        getMultipleSelectedItems: undefined,
      },
      notificationControl: undefined,
      getItemThumbnail: undefined,
      onSuccess: undefined,
      onError: undefined,
    };
  }

  _optionChanged(args: OptionChanged<FileManagerEditingControlOptions>): void {
    const { name } = args;

    switch (name) {
      case 'model':
        this.repaint();
        break;
      case 'notificationControl':
        this._initNotificationControl(args.value);
        break;
      case 'getItemThumbnail':
        break;
      case 'uploadDropZonePlaceholderContainer':
        this._fileUploader?.option('dropZonePlaceholderContainer', args.value);
        break;
      case 'onSuccess':
      case 'onError':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }

  _raiseOnSuccess(updatedOnlyFiles): void {
    this._actions.onSuccess?.({ updatedOnlyFiles });
  }

  _raiseOnError(args): void {
    this._actions.onError?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getCurrentDirectory() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._controller?.getCurrentDirectory();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get uploadDirectoryInfo() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._uploadDirectoryInfo || this._getCurrentDirectory();
  }
}

export default FileManagerEditingControl;
