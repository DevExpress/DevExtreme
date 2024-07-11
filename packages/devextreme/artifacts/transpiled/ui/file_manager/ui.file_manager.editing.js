"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _deferred = require("../../core/utils/deferred");
var _iterator = require("../../core/utils/iterator");
var _string = require("../../core/utils/string");
var _type = require("../../core/utils/type");
var _message = _interopRequireDefault(require("../../localization/message"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _uiFile_manager = _interopRequireDefault(require("./ui.file_manager.dialog_manager"));
var _uiFile_manager2 = _interopRequireDefault(require("./ui.file_manager.file_uploader"));
var _uiFile_manager3 = require("./ui.file_manager.messages");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FileManagerEditingControl extends _ui.default {
  _initMarkup() {
    super._initMarkup();
    this._initActions();
    this._controller = this.option('controller');
    this._controller.on('EditActionStarting', this._onEditActionStarting.bind(this));
    this._controller.on('EditActionResultAcquired', this._onEditActionResultAcquired.bind(this));
    this._controller.on('EditActionItemError', this._onEditActionItemError.bind(this));
    this._controller.on('EditActionError', this._onEditActionError.bind(this));
    this._controller.on('CompleteEditActionItem', this._onCompleteEditActionItem.bind(this));
    this._controller.on('CompleteEditAction', this._onCompleteEditAction.bind(this));
    this._model = this.option('model');
    this._uploadOperationInfoMap = {};
    this._dialogManager = new _uiFile_manager.default(this.$element(), {
      chooseDirectoryDialog: {
        provider: this._controller._fileProvider,
        getDirectories: this._controller.getDirectories.bind(this._controller),
        getCurrentDirectory: this._controller.getCurrentDirectory.bind(this._controller)
      },
      rtlEnabled: this.option('rtlEnabled'),
      onDialogClosed: this._onDialogClosed.bind(this)
    });
    this._fileUploader = this._createFileUploader();
    const notificationControl = this.option('notificationControl');
    if (notificationControl) {
      this._initNotificationControl(notificationControl);
    }
    this._createMetadataMap();
  }
  _initNotificationControl(notificationControl) {
    this._notificationControl = notificationControl;
    this._notificationControl.option({
      onOperationCanceled: _ref => {
        let {
          info
        } = _ref;
        return this._onCancelUploadSession(info);
      },
      onOperationItemCanceled: _ref2 => {
        let {
          item,
          itemIndex
        } = _ref2;
        return this._onCancelFileUpload(item, itemIndex);
      }
    });
  }
  _getFileUploaderComponent() {
    return _uiFile_manager2.default;
  }
  _createFileUploader() {
    const $fileUploader = (0, _renderer.default)('<div>').appendTo(this.$element());
    return this._createComponent($fileUploader, this._getFileUploaderComponent(), {
      getController: this._getFileUploaderController.bind(this),
      dropZonePlaceholderContainer: this.option('uploadDropZonePlaceholderContainer'),
      onUploadSessionStarted: e => this._onUploadSessionStarted(e),
      onUploadProgress: e => this._onUploadProgress(e),
      onUploadFinished: e => this._onUploadFinished(e)
    });
  }
  setUploaderDropZone($element) {
    this._fileUploader.option('dropZone', $element);
  }
  setUploaderSplitterElement(element) {
    this._fileUploader.option('splitterElement', element);
  }
  _getFileUploaderController() {
    const uploadDirectory = this.uploadDirectoryInfo.fileItem;
    return {
      chunkSize: this._controller.getFileUploadChunkSize(),
      uploadFileChunk: (fileData, chunksInfo) => this._controller.uploadFileChunk(fileData, chunksInfo, uploadDirectory),
      abortFileUpload: (fileData, chunksInfo) => this._controller.abortFileUpload(fileData, chunksInfo, uploadDirectory)
    };
  }
  _createMetadataMap() {
    this._metadataMap = {
      create: {
        action: arg => this._tryCreate(arg),
        affectsAllItems: true,
        singleItemProcessingMessage: _message.default.format('dxFileManager-editingCreateSingleItemProcessingMessage'),
        singleItemSuccessMessage: _message.default.format('dxFileManager-editingCreateSingleItemSuccessMessage'),
        singleItemErrorMessage: _message.default.format('dxFileManager-editingCreateSingleItemErrorMessage'),
        commonErrorMessage: _message.default.format('dxFileManager-editingCreateCommonErrorMessage')
      },
      rename: {
        action: arg => this._tryRename(arg),
        singleItemProcessingMessage: _message.default.format('dxFileManager-editingRenameSingleItemProcessingMessage'),
        singleItemSuccessMessage: _message.default.format('dxFileManager-editingRenameSingleItemSuccessMessage'),
        singleItemErrorMessage: _message.default.format('dxFileManager-editingRenameSingleItemErrorMessage'),
        commonErrorMessage: _message.default.format('dxFileManager-editingRenameCommonErrorMessage')
      },
      delete: {
        action: arg => this._tryDelete(arg),
        singleItemProcessingMessage: _message.default.format('dxFileManager-editingDeleteSingleItemProcessingMessage'),
        multipleItemsProcessingMessage: _message.default.format('dxFileManager-editingDeleteMultipleItemsProcessingMessage'),
        singleItemSuccessMessage: _message.default.format('dxFileManager-editingDeleteSingleItemSuccessMessage'),
        multipleItemsSuccessMessage: _message.default.format('dxFileManager-editingDeleteMultipleItemsSuccessMessage'),
        singleItemErrorMessage: _message.default.format('dxFileManager-editingDeleteSingleItemErrorMessage'),
        multipleItemsErrorMessage: _message.default.format('dxFileManager-editingDeleteMultipleItemsErrorMessage'),
        commonErrorMessage: _message.default.format('dxFileManager-editingDeleteCommonErrorMessage')
      },
      move: {
        action: arg => this._tryMove(arg),
        singleItemProcessingMessage: _message.default.format('dxFileManager-editingMoveSingleItemProcessingMessage'),
        multipleItemsProcessingMessage: _message.default.format('dxFileManager-editingMoveMultipleItemsProcessingMessage'),
        singleItemSuccessMessage: _message.default.format('dxFileManager-editingMoveSingleItemSuccessMessage'),
        multipleItemsSuccessMessage: _message.default.format('dxFileManager-editingMoveMultipleItemsSuccessMessage'),
        singleItemErrorMessage: _message.default.format('dxFileManager-editingMoveSingleItemErrorMessage'),
        multipleItemsErrorMessage: _message.default.format('dxFileManager-editingMoveMultipleItemsErrorMessage'),
        commonErrorMessage: _message.default.format('dxFileManager-editingMoveCommonErrorMessage')
      },
      copy: {
        action: arg => this._tryCopy(arg),
        singleItemProcessingMessage: _message.default.format('dxFileManager-editingCopySingleItemProcessingMessage'),
        multipleItemsProcessingMessage: _message.default.format('dxFileManager-editingCopyMultipleItemsProcessingMessage'),
        singleItemSuccessMessage: _message.default.format('dxFileManager-editingCopySingleItemSuccessMessage'),
        multipleItemsSuccessMessage: _message.default.format('dxFileManager-editingCopyMultipleItemsSuccessMessage'),
        singleItemErrorMessage: _message.default.format('dxFileManager-editingCopySingleItemErrorMessage'),
        multipleItemsErrorMessage: _message.default.format('dxFileManager-editingCopyMultipleItemsErrorMessage'),
        commonErrorMessage: _message.default.format('dxFileManager-editingCopyCommonErrorMessage')
      },
      upload: {
        action: arg => this._tryUpload(arg),
        allowCancel: true,
        allowItemProgress: true,
        singleItemProcessingMessage: _message.default.format('dxFileManager-editingUploadSingleItemProcessingMessage'),
        multipleItemsProcessingMessage: _message.default.format('dxFileManager-editingUploadMultipleItemsProcessingMessage'),
        singleItemSuccessMessage: _message.default.format('dxFileManager-editingUploadSingleItemSuccessMessage'),
        multipleItemsSuccessMessage: _message.default.format('dxFileManager-editingUploadMultipleItemsSuccessMessage'),
        singleItemErrorMessage: _message.default.format('dxFileManager-editingUploadSingleItemErrorMessage'),
        multipleItemsErrorMessage: _message.default.format('dxFileManager-editingUploadMultipleItemsErrorMessage'),
        canceledMessage: _message.default.format('dxFileManager-editingUploadCanceledMessage')
      },
      download: {
        action: arg => this._download(arg),
        singleItemProcessingMessage: '',
        multipleItemsProcessingMessage: '',
        singleItemErrorMessage: _message.default.format('dxFileManager-editingDownloadSingleItemErrorMessage'),
        multipleItemsErrorMessage: _message.default.format('dxFileManager-editingDownloadMultipleItemsErrorMessage')
      },
      getItemContent: {
        action: arg => this._getItemContent(arg)
      },
      getItems: {
        singleItemProcessingMessage: '',
        singleItemErrorMessage: _message.default.format('dxFileManager-errorDirectoryOpenFailed'),
        commonErrorMessage: _message.default.format('dxFileManager-errorDirectoryOpenFailed')
      }
    };
  }
  getCommandActions() {
    const result = {};
    (0, _iterator.each)(this._metadataMap, name => {
      if (Object.prototype.hasOwnProperty.call(this._metadataMap, name)) {
        result[name] = arg => this._executeAction(name, arg);
      }
    });
    return result;
  }
  _executeAction(actionName, arg) {
    const actionMetadata = this._metadataMap[actionName];
    return actionMetadata ? actionMetadata.action(arg) : null;
  }
  _onCancelUploadSession(info) {
    this._fileUploader.cancelUpload(info.uploadSessionId);
  }
  _onCancelFileUpload(item, itemIndex) {
    this._fileUploader.cancelFileUpload(item.info.uploadSessionId, itemIndex);
  }
  _onUploadProgress(_ref3) {
    let {
      sessionId,
      fileIndex,
      commonValue,
      fileValue
    } = _ref3;
    const {
      operationInfo
    } = this._uploadOperationInfoMap[sessionId];
    this._notificationControl.updateOperationItemProgress(operationInfo, fileIndex, fileValue * 100, commonValue * 100);
  }
  _onUploadFinished(_ref4) {
    let {
      sessionId,
      commonValue
    } = _ref4;
    const {
      operationInfo
    } = this._uploadOperationInfoMap[sessionId];
    this._notificationControl.finishOperation(operationInfo, commonValue * 100);
    this._scheduleUploadSessionDisposal(sessionId, 'uploader');
  }
  _onUploadSessionStarted(_ref5) {
    let {
      sessionInfo
    } = _ref5;
    this._controller.processUploadSession(sessionInfo, this.uploadDirectoryInfo);
  }
  _onEditActionStarting(actionInfo) {
    const actionMetadata = this._metadataMap[actionInfo.name];
    const context = new FileManagerActionContext(actionMetadata, actionInfo.itemInfos, actionInfo.directory);
    const operationInfo = this._notificationControl.addOperation(context.processingMessage, actionMetadata.allowCancel, !actionMetadata.allowItemProgress);
    (0, _extend.extend)(actionInfo.customData, {
      context,
      operationInfo
    });
    switch (actionInfo.name) {
      case 'upload':
        {
          const sessionId = actionInfo.customData.sessionInfo.sessionId;
          operationInfo.uploadSessionId = sessionId;
          this._uploadOperationInfoMap[sessionId] = {
            operationInfo
          };
        }
        break;
      case 'rename':
        actionInfo.customData.context.itemNewName = actionInfo.customData.itemNewName;
        break;
      default:
        break;
    }
  }
  _onEditActionResultAcquired(actionInfo) {
    const {
      context,
      operationInfo
    } = actionInfo.customData;
    context.singleRequest = actionInfo.singleRequest;
    const details = context.itemInfos.map(itemInfo => this._getItemProgressDisplayInfo(itemInfo));
    this._notificationControl.addOperationDetails(operationInfo, details, context.actionMetadata.allowCancel);
  }
  _onEditActionError(actionInfo, errorInfo) {
    const {
      context,
      operationInfo
    } = actionInfo.customData;
    context.singleRequest = actionInfo.singleRequest;
    this._handleActionError(operationInfo, context, errorInfo);
    this._completeAction(operationInfo, context);
  }
  _onEditActionItemError(actionInfo, errorInfo) {
    const {
      context,
      operationInfo
    } = actionInfo.customData;
    this._handleActionError(operationInfo, context, errorInfo);
  }
  _onCompleteEditActionItem(actionInfo, info) {
    const {
      context,
      operationInfo
    } = actionInfo.customData;
    if (!info.result || !info.result.canceled) {
      context.completeOperationItem(info.index);
      this._notificationControl.completeOperationItem(operationInfo, info.index, context.commonProgress);
    }
  }
  _onCompleteEditAction(actionInfo) {
    const {
      context,
      operationInfo
    } = actionInfo.customData;
    this._completeAction(operationInfo, context);
    if (actionInfo.name === 'upload') {
      this._scheduleUploadSessionDisposal(actionInfo.customData.sessionInfo.sessionId, 'controller');
    }
  }
  _scheduleUploadSessionDisposal(sessionId, requester) {
    if ((0, _type.isDefined)(this._uploadOperationInfoMap[sessionId].requester) && this._uploadOperationInfoMap[sessionId].requester !== requester) {
      delete this._uploadOperationInfoMap[sessionId];
    } else {
      this._uploadOperationInfoMap[sessionId].requester = requester;
    }
  }
  _tryCreate(parentDirectories) {
    const parentDirectoryInfo = parentDirectories && parentDirectories[0] || this._getCurrentDirectory();
    const newDirName = _message.default.format('dxFileManager-newDirectoryName');
    return this._showDialog(this._dialogManager.getCreateItemDialog(), newDirName).then(_ref6 => {
      let {
        name
      } = _ref6;
      return this._controller.createDirectory(parentDirectoryInfo, name);
    });
  }
  _tryRename(itemInfos) {
    const itemInfo = itemInfos && itemInfos[0] || this._model.getMultipleSelectedItems()[0];
    if (!itemInfo) {
      return new _deferred.Deferred().reject().promise();
    }
    return this._showDialog(this._dialogManager.getRenameItemDialog(), itemInfo.fileItem.name).then(_ref7 => {
      let {
        name
      } = _ref7;
      return this._controller.renameItem(itemInfo, name);
    });
  }
  _tryDelete(itemInfos) {
    itemInfos = itemInfos || this._model.getMultipleSelectedItems();
    if (itemInfos.length === 0) {
      return new _deferred.Deferred().reject().promise();
    }
    const itemName = itemInfos[0].fileItem.name;
    const itemCount = itemInfos.length;
    return this._showDialog(this._dialogManager.getDeleteItemDialog(), {
      itemName,
      itemCount
    }).then(() => this._controller.deleteItems(itemInfos));
  }
  _tryMove(itemInfos) {
    itemInfos = itemInfos || this._model.getMultipleSelectedItems();
    if (itemInfos.length === 0) {
      return new _deferred.Deferred().reject().promise();
    }
    return this._showDialog(this._dialogManager.getMoveDialog(itemInfos)).then(_ref8 => {
      let {
        folder
      } = _ref8;
      return this._controller.moveItems(itemInfos, folder);
    });
  }
  _tryCopy(itemInfos) {
    itemInfos = itemInfos || this._model.getMultipleSelectedItems();
    if (itemInfos.length === 0) {
      return new _deferred.Deferred().reject().promise();
    }
    return this._showDialog(this._dialogManager.getCopyDialog(itemInfos)).then(_ref9 => {
      let {
        folder
      } = _ref9;
      return this._controller.copyItems(itemInfos, folder);
    });
  }
  _tryUpload(destinationFolder) {
    this._uploadDirectoryInfo = destinationFolder === null || destinationFolder === void 0 ? void 0 : destinationFolder[0];
    this._fileUploader.tryUpload();
  }
  _download(itemInfos) {
    itemInfos = itemInfos || this._model.getMultipleSelectedItems();
    if (itemInfos.length === 0) {
      return new _deferred.Deferred().reject().promise();
    }
    return this._controller.downloadItems(itemInfos);
  }
  _getItemContent(itemInfos) {
    itemInfos = itemInfos || this._model.getMultipleSelectedItems();
    return this._controller.getItemContent(itemInfos);
  }
  _completeAction(operationInfo, context) {
    this._notificationControl.completeOperation(operationInfo, context.completionMessage, !context.success, context.statusText);
    if (context.hasModifiedItems()) {
      this._raiseOnSuccess(context.onlyFiles);
    }
  }
  _handleActionError(operationInfo, context, errorInfo) {
    operationInfo.hasError = true;
    if (context.singleRequest) {
      this._handleSingleRequestActionError(operationInfo, context, errorInfo);
    } else {
      this._handleMultipleRequestActionError(operationInfo, context, errorInfo);
    }
  }
  _handleSingleRequestActionError(operationInfo, context, errorInfo) {
    const itemInfo = context.getItemForSingleRequestError();
    const itemName = context.getItemName(errorInfo.errorCode);
    const errorText = this._getErrorText(errorInfo, itemInfo, itemName);
    context.processSingleRequestError(errorText);
    const operationErrorInfo = this._getOperationErrorInfo(context);
    this._notificationControl.completeSingleOperationWithError(operationInfo, operationErrorInfo);
    if (context.multipleItems) {
      this._raiseOnSuccess(context.onlyFiles);
    }
  }
  _handleMultipleRequestActionError(operationInfo, context, errorInfo) {
    const itemInfo = context.getItemForMultipleRequestError(errorInfo.index);
    const itemName = context.getItemName(errorInfo.errorCode, errorInfo.index);
    const errorText = this._getErrorText(errorInfo, itemInfo, itemName);
    context.processMultipleRequestError(errorInfo.index, errorText);
    const operationErrorInfo = this._getOperationErrorInfo(context);
    this._notificationControl.addOperationDetailsError(operationInfo, operationErrorInfo);
  }
  _getOperationErrorInfo(context) {
    const detailError = context.errorState.currentDetailError;
    return {
      commonErrorText: context.errorState.commonErrorText,
      item: detailError.itemInfo ? this._getItemProgressDisplayInfo(detailError.itemInfo) : null,
      itemIndex: detailError.itemIndex,
      detailErrorText: detailError.errorText
    };
  }
  _getErrorText(errorInfo, itemInfo, itemName) {
    const errorText = errorInfo.errorText || _uiFile_manager3.FileManagerMessages.get(errorInfo.errorCode, itemName);
    const errorArgs = {
      fileSystemItem: itemInfo === null || itemInfo === void 0 ? void 0 : itemInfo.fileItem,
      errorCode: errorInfo.errorCode,
      errorText
    };
    this._raiseOnError(errorArgs);
    return errorArgs.errorText;
  }
  _getItemProgressDisplayInfo(itemInfo) {
    return {
      commonText: itemInfo.fileItem.name,
      imageUrl: this._getItemThumbnail(itemInfo)
    };
  }
  _showDialog(dialog, dialogArgument) {
    this._dialogDeferred = new _deferred.Deferred();
    dialog.show(dialogArgument);
    return this._dialogDeferred.promise();
  }
  _onDialogClosed(e) {
    const result = e.dialogResult;
    if (result) {
      this._dialogDeferred.resolve(result);
    } else {
      this._dialogDeferred.reject();
    }
  }
  updateDialogRtl(value) {
    this._dialogManager.updateDialogRtl(value);
  }
  _getItemThumbnail(item) {
    const itemThumbnailGetter = this.option('getItemThumbnail');
    if (!itemThumbnailGetter) {
      return null;
    }
    const info = itemThumbnailGetter(item);
    return info ? info.thumbnail : null;
  }
  _initActions() {
    this._actions = {
      onSuccess: this._createActionByOption('onSuccess'),
      onError: this._createActionByOption('onError')
    };
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      model: {
        getMultipleSelectedItems: null
      },
      notificationControl: null,
      getItemThumbnail: null,
      onSuccess: null,
      onError: null
    });
  }
  _optionChanged(args) {
    const name = args.name;
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
        this._fileUploader.option('dropZonePlaceholderContainer', args.value);
        break;
      case 'onSuccess':
      case 'onError':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }
  _raiseOnSuccess(updatedOnlyFiles) {
    this._actions.onSuccess({
      updatedOnlyFiles
    });
  }
  _raiseOnError(args) {
    this._actions.onError(args);
  }
  _getCurrentDirectory() {
    return this._controller.getCurrentDirectory();
  }
  get uploadDirectoryInfo() {
    return this._uploadDirectoryInfo || this._getCurrentDirectory();
  }
}
class FileManagerActionContext {
  constructor(actionMetadata, itemInfos, directoryInfo) {
    this._actionMetadata = actionMetadata;
    this._itemInfos = itemInfos;
    this._onlyFiles = !this._actionMetadata.affectsAllItems && this._itemInfos.every(info => !info.fileItem.isDirectory);
    this._items = this._itemInfos.map(itemInfo => itemInfo.fileItem);
    this._multipleItems = this._items.length > 1;
    this._location = directoryInfo.getDisplayName();
    this._singleRequest = true;
    this._completedItems = [];
    this._commonProgress = 0;
    this._errorState = {
      failedCount: 0
    };
    this._itemNewName = '';
  }
  completeOperationItem(itemIndex) {
    if (this._singleRequest) {
      this._completedItems = [...this._items];
    } else {
      const item = this._items[itemIndex];
      this._completedItems.push(item);
    }
    if (!this._actionMetadata.allowItemProgress) {
      this._commonProgress = this._completedItems.length / this._items.length * 100;
    }
  }
  processSingleRequestError(errorText) {
    this._errorState.failedCount = 1;
    this._errorState.commonErrorText = this._multipleItems ? this._actionMetadata.commonErrorMessage : this._actionMetadata.singleItemErrorMessage;
    const itemIndex = this._multipleItems ? -1 : 1;
    const itemInfo = this.getItemForSingleRequestError();
    this._setCurrentDetailError(itemIndex, itemInfo, errorText);
  }
  processMultipleRequestError(itemIndex, errorText) {
    this._errorState.failedCount++;
    this._errorState.commonErrorText = this._errorState.failedCount > 1 ? (0, _string.format)(this._actionMetadata.multipleItemsErrorMessage, this._errorState.failedCount) : this._actionMetadata.singleItemErrorMessage;
    const itemInfo = this.getItemForMultipleRequestError(itemIndex);
    this._setCurrentDetailError(itemIndex, itemInfo, errorText);
  }
  hasModifiedItems() {
    return this._hasCompletedItems() || this._singleRequest && !this.success && this._multipleItems;
  }
  getItemForSingleRequestError() {
    return this._multipleItems ? null : this._itemInfos[0];
  }
  getItemForMultipleRequestError(itemIndex) {
    return this._itemInfos[itemIndex];
  }
  getItemName(errorCode, itemIndex) {
    const itemInfo = this.singleRequest ? this.getItemForSingleRequestError() : this.getItemForMultipleRequestError(itemIndex);
    let result = itemInfo === null || itemInfo === void 0 ? void 0 : itemInfo.fileItem.name;
    if (this.itemNewName && this._isItemExistsErrorCode(errorCode)) {
      result = this.itemNewName;
    }
    return result;
  }
  _isItemExistsErrorCode(errorCode) {
    return errorCode === _uiFile_manager3.ErrorCode.DirectoryExists || errorCode === _uiFile_manager3.ErrorCode.FileExists;
  }
  _setCurrentDetailError(itemIndex, itemInfo, errorText) {
    this._errorState.currentDetailError = {
      itemIndex,
      itemInfo,
      errorText
    };
  }
  _hasCompletedItems() {
    return this._completedItems.length > 0;
  }
  get actionMetadata() {
    return this._actionMetadata;
  }
  get itemInfos() {
    return this._itemInfos;
  }
  get itemNewName() {
    return this._itemNewName;
  }
  set itemNewName(value) {
    this._itemNewName = value;
  }
  get errorState() {
    return this._errorState;
  }
  get singleRequest() {
    return this._singleRequest;
  }
  set singleRequest(value) {
    this._singleRequest = value;
  }
  get multipleItems() {
    return this._multipleItems;
  }
  get onlyFiles() {
    return this._onlyFiles;
  }
  get processingMessage() {
    return this._multipleItems ? (0, _string.format)(this._actionMetadata.multipleItemsProcessingMessage, this._items.length, this._location) : (0, _string.format)(this._actionMetadata.singleItemProcessingMessage, this._location);
  }
  get successMessage() {
    if (this._hasCompletedItems()) {
      return this._multipleItems ? (0, _string.format)(this._actionMetadata.multipleItemsSuccessMessage, this._completedItems.length, this._location) : (0, _string.format)(this._actionMetadata.singleItemSuccessMessage, this._location);
    } else {
      return this._multipleItems ? (0, _string.format)(this._actionMetadata.multipleItemsErrorMessage, this._items.length) : this._actionMetadata.singleItemErrorMessage;
    }
  }
  get completionMessage() {
    return this.success ? this.successMessage : this.errorState.commonErrorText;
  }
  get statusText() {
    return this.success && !this._hasCompletedItems() ? this._actionMetadata.canceledMessage : undefined;
  }
  get commonProgress() {
    return this._commonProgress;
  }
  get success() {
    return !this._errorState.failedCount;
  }
}
var _default = exports.default = FileManagerEditingControl;
module.exports = exports.default;
module.exports.default = exports.default;