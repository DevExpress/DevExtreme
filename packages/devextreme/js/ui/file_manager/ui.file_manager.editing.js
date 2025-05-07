import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { Deferred } from '../../core/utils/deferred';
import { each } from '../../core/utils/iterator';
import { format } from '../../core/utils/string';
import { isDefined } from '../../core/utils/type';

import messageLocalization from '../../common/core/localization/message';

import Widget from '../widget/ui.widget';

import FileManagerDialogManager from './ui.file_manager.dialog_manager';
import FileManagerFileUploader from './ui.file_manager.file_uploader';
import { ErrorCode, FileManagerMessages } from './ui.file_manager.messages';

class FileManagerEditingControl extends Widget {

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

        this._dialogManager = new FileManagerDialogManager(this.$element(), {
            chooseDirectoryDialog: {
                provider: this._controller._fileProvider,
                getDirectories: this._controller.getDirectories.bind(this._controller),
                getCurrentDirectory: this._controller.getCurrentDirectory.bind(this._controller),
            },
            rtlEnabled: this.option('rtlEnabled'),
            onDialogClosed: this._onDialogClosed.bind(this)
        });

        this._fileUploader = this._createFileUploader();
        const notificationControl = this.option('notificationControl');
        if(notificationControl) {
            this._initNotificationControl(notificationControl);
        }

        this._createMetadataMap();
    }

    _initNotificationControl(notificationControl) {
        this._notificationControl = notificationControl;
        this._notificationControl.option({
            onOperationCanceled: ({ info }) => this._onCancelUploadSession(info),
            onOperationItemCanceled: ({ item, itemIndex }) => this._onCancelFileUpload(item, itemIndex)
        });
    }

    _getFileUploaderComponent() {
        return FileManagerFileUploader;
    }

    _createFileUploader() {
        const $fileUploader = $('<div>').appendTo(this.$element());
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
                singleItemProcessingMessage: messageLocalization.format('dxFileManager-editingCreateSingleItemProcessingMessage'),
                singleItemSuccessMessage: messageLocalization.format('dxFileManager-editingCreateSingleItemSuccessMessage'),
                singleItemErrorMessage: messageLocalization.format('dxFileManager-editingCreateSingleItemErrorMessage'),
                commonErrorMessage: messageLocalization.format('dxFileManager-editingCreateCommonErrorMessage')
            },

            rename: {
                action: arg => this._tryRename(arg),
                singleItemProcessingMessage: messageLocalization.format('dxFileManager-editingRenameSingleItemProcessingMessage'),
                singleItemSuccessMessage: messageLocalization.format('dxFileManager-editingRenameSingleItemSuccessMessage'),
                singleItemErrorMessage: messageLocalization.format('dxFileManager-editingRenameSingleItemErrorMessage'),
                commonErrorMessage: messageLocalization.format('dxFileManager-editingRenameCommonErrorMessage')
            },

            delete: {
                action: arg => this._tryDelete(arg),
                singleItemProcessingMessage: messageLocalization.format('dxFileManager-editingDeleteSingleItemProcessingMessage'),
                multipleItemsProcessingMessage: messageLocalization.format('dxFileManager-editingDeleteMultipleItemsProcessingMessage'),
                singleItemSuccessMessage: messageLocalization.format('dxFileManager-editingDeleteSingleItemSuccessMessage'),
                multipleItemsSuccessMessage: messageLocalization.format('dxFileManager-editingDeleteMultipleItemsSuccessMessage'),
                singleItemErrorMessage: messageLocalization.format('dxFileManager-editingDeleteSingleItemErrorMessage'),
                multipleItemsErrorMessage: messageLocalization.format('dxFileManager-editingDeleteMultipleItemsErrorMessage'),
                commonErrorMessage: messageLocalization.format('dxFileManager-editingDeleteCommonErrorMessage')
            },

            move: {
                action: arg => this._tryMove(arg),
                singleItemProcessingMessage: messageLocalization.format('dxFileManager-editingMoveSingleItemProcessingMessage'),
                multipleItemsProcessingMessage: messageLocalization.format('dxFileManager-editingMoveMultipleItemsProcessingMessage'),
                singleItemSuccessMessage: messageLocalization.format('dxFileManager-editingMoveSingleItemSuccessMessage'),
                multipleItemsSuccessMessage: messageLocalization.format('dxFileManager-editingMoveMultipleItemsSuccessMessage'),
                singleItemErrorMessage: messageLocalization.format('dxFileManager-editingMoveSingleItemErrorMessage'),
                multipleItemsErrorMessage: messageLocalization.format('dxFileManager-editingMoveMultipleItemsErrorMessage'),
                commonErrorMessage: messageLocalization.format('dxFileManager-editingMoveCommonErrorMessage')
            },

            copy: {
                action: arg => this._tryCopy(arg),
                singleItemProcessingMessage: messageLocalization.format('dxFileManager-editingCopySingleItemProcessingMessage'),
                multipleItemsProcessingMessage: messageLocalization.format('dxFileManager-editingCopyMultipleItemsProcessingMessage'),
                singleItemSuccessMessage: messageLocalization.format('dxFileManager-editingCopySingleItemSuccessMessage'),
                multipleItemsSuccessMessage: messageLocalization.format('dxFileManager-editingCopyMultipleItemsSuccessMessage'),
                singleItemErrorMessage: messageLocalization.format('dxFileManager-editingCopySingleItemErrorMessage'),
                multipleItemsErrorMessage: messageLocalization.format('dxFileManager-editingCopyMultipleItemsErrorMessage'),
                commonErrorMessage: messageLocalization.format('dxFileManager-editingCopyCommonErrorMessage')
            },

            upload: {
                action: arg => this._tryUpload(arg),
                allowCancel: true,
                allowItemProgress: true,
                singleItemProcessingMessage: messageLocalization.format('dxFileManager-editingUploadSingleItemProcessingMessage'),
                multipleItemsProcessingMessage: messageLocalization.format('dxFileManager-editingUploadMultipleItemsProcessingMessage'),
                singleItemSuccessMessage: messageLocalization.format('dxFileManager-editingUploadSingleItemSuccessMessage'),
                multipleItemsSuccessMessage: messageLocalization.format('dxFileManager-editingUploadMultipleItemsSuccessMessage'),
                singleItemErrorMessage: messageLocalization.format('dxFileManager-editingUploadSingleItemErrorMessage'),
                multipleItemsErrorMessage: messageLocalization.format('dxFileManager-editingUploadMultipleItemsErrorMessage'),
                canceledMessage: messageLocalization.format('dxFileManager-editingUploadCanceledMessage')
            },

            download: {
                action: arg => this._download(arg),
                singleItemProcessingMessage: '',
                multipleItemsProcessingMessage: '',
                singleItemErrorMessage: messageLocalization.format('dxFileManager-editingDownloadSingleItemErrorMessage'),
                multipleItemsErrorMessage: messageLocalization.format('dxFileManager-editingDownloadMultipleItemsErrorMessage'),
            },

            getItemContent: {
                action: arg => this._getItemContent(arg)
            },

            getItems: {
                singleItemProcessingMessage: '',
                singleItemErrorMessage: messageLocalization.format('dxFileManager-errorDirectoryOpenFailed'),
                commonErrorMessage: messageLocalization.format('dxFileManager-errorDirectoryOpenFailed')
            }

        };
    }

    getCommandActions() {
        const result = {};

        each(this._metadataMap, name => {
            if(Object.prototype.hasOwnProperty.call(this._metadataMap, name)) {
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

    _onUploadProgress({ sessionId, fileIndex, commonValue, fileValue }) {
        const { operationInfo } = this._uploadOperationInfoMap[sessionId];
        this._notificationControl.updateOperationItemProgress(operationInfo, fileIndex, fileValue * 100, commonValue * 100);
    }

    _onUploadFinished({ sessionId, commonValue }) {
        const { operationInfo } = this._uploadOperationInfoMap[sessionId];
        this._notificationControl.finishOperation(operationInfo, commonValue * 100);
        this._scheduleUploadSessionDisposal(sessionId, 'uploader');
    }

    _onUploadSessionStarted({ sessionInfo }) {
        this._controller.processUploadSession(sessionInfo, this.uploadDirectoryInfo);
    }

    _onEditActionStarting(actionInfo) {
        const actionMetadata = this._metadataMap[actionInfo.name];
        const context = new FileManagerActionContext(actionMetadata, actionInfo.itemInfos, actionInfo.directory);
        const operationInfo = this._notificationControl.addOperation(context.processingMessage, actionMetadata.allowCancel, !actionMetadata.allowItemProgress);
        extend(actionInfo.customData, { context, operationInfo });

        switch(actionInfo.name) {
            case 'upload':
                {
                    const sessionId = actionInfo.customData.sessionInfo.sessionId;
                    operationInfo.uploadSessionId = sessionId;
                    this._uploadOperationInfoMap[sessionId] = { operationInfo };
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
        const { context, operationInfo } = actionInfo.customData;
        context.singleRequest = actionInfo.singleRequest;
        const details = context.itemInfos.map(itemInfo => this._getItemProgressDisplayInfo(itemInfo));
        this._notificationControl.addOperationDetails(operationInfo, details, context.actionMetadata.allowCancel);
    }

    _onEditActionError(actionInfo, errorInfo) {
        const { context, operationInfo } = actionInfo.customData;
        context.singleRequest = actionInfo.singleRequest;
        this._handleActionError(operationInfo, context, errorInfo);
        this._completeAction(operationInfo, context);
    }

    _onEditActionItemError(actionInfo, errorInfo) {
        const { context, operationInfo } = actionInfo.customData;
        this._handleActionError(operationInfo, context, errorInfo);
    }

    _onCompleteEditActionItem(actionInfo, info) {
        const { context, operationInfo } = actionInfo.customData;
        if(!info.result || !info.result.canceled) {
            context.completeOperationItem(info.index);
            this._notificationControl.completeOperationItem(operationInfo, info.index, context.commonProgress);
        }
    }

    _onCompleteEditAction(actionInfo) {
        const { context, operationInfo } = actionInfo.customData;
        this._completeAction(operationInfo, context);

        if(actionInfo.name === 'upload') {
            this._scheduleUploadSessionDisposal(actionInfo.customData.sessionInfo.sessionId, 'controller');
        }
    }

    _scheduleUploadSessionDisposal(sessionId, requester) {
        if(isDefined(this._uploadOperationInfoMap[sessionId].requester) && this._uploadOperationInfoMap[sessionId].requester !== requester) {
            delete this._uploadOperationInfoMap[sessionId];
        } else {
            this._uploadOperationInfoMap[sessionId].requester = requester;
        }
    }

    _tryCreate(parentDirectories) {
        const parentDirectoryInfo = parentDirectories && parentDirectories[0] || this._getCurrentDirectory();
        const newDirName = messageLocalization.format('dxFileManager-newDirectoryName');
        return this._showDialog(this._dialogManager.getCreateItemDialog(), newDirName)
            .then(({ name }) => this._controller.createDirectory(parentDirectoryInfo, name));
    }

    _tryRename(itemInfos) {
        const itemInfo = itemInfos && itemInfos[0] || this._model.getMultipleSelectedItems()[0];
        if(!itemInfo) {
            return new Deferred().reject().promise();
        }
        return this._showDialog(this._dialogManager.getRenameItemDialog(), itemInfo.fileItem.name)
            .then(({ name }) => this._controller.renameItem(itemInfo, name));
    }

    _tryDelete(itemInfos) {
        itemInfos = itemInfos || this._model.getMultipleSelectedItems();
        if(itemInfos.length === 0) {
            return new Deferred().reject().promise();
        }
        const itemName = itemInfos[0].fileItem.name;
        const itemCount = itemInfos.length;
        return this._showDialog(this._dialogManager.getDeleteItemDialog(), { itemName, itemCount })
            .then(() => this._controller.deleteItems(itemInfos));
    }

    _tryMove(itemInfos) {
        itemInfos = itemInfos || this._model.getMultipleSelectedItems();
        if(itemInfos.length === 0) {
            return new Deferred().reject().promise();
        }
        return this._showDialog(this._dialogManager.getMoveDialog(itemInfos))
            .then(({ folder }) => this._controller.moveItems(itemInfos, folder));
    }

    _tryCopy(itemInfos) {
        itemInfos = itemInfos || this._model.getMultipleSelectedItems();
        if(itemInfos.length === 0) {
            return new Deferred().reject().promise();
        }
        return this._showDialog(this._dialogManager.getCopyDialog(itemInfos))
            .then(({ folder }) => this._controller.copyItems(itemInfos, folder));
    }

    _tryUpload(destinationFolder) {
        this._uploadDirectoryInfo = destinationFolder?.[0];
        this._fileUploader.tryUpload();
    }

    _download(itemInfos) {
        itemInfos = itemInfos || this._model.getMultipleSelectedItems();
        if(itemInfos.length === 0) {
            return new Deferred().reject().promise();
        }
        return this._controller.downloadItems(itemInfos);
    }

    _getItemContent(itemInfos) {
        itemInfos = itemInfos || this._model.getMultipleSelectedItems();
        return this._controller.getItemContent(itemInfos);
    }

    _completeAction(operationInfo, context) {
        this._notificationControl.completeOperation(operationInfo, context.completionMessage, !context.success, context.statusText);

        if(context.hasModifiedItems()) {
            this._raiseOnSuccess(context.onlyFiles);
        }
    }

    _handleActionError(operationInfo, context, errorInfo) {
        operationInfo.hasError = true;

        if(context.singleRequest) {
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

        if(context.multipleItems) {
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
        const errorText = errorInfo.errorText || FileManagerMessages.get(errorInfo.errorCode, itemName);

        const errorArgs = {
            fileSystemItem: itemInfo?.fileItem,
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
        this._dialogDeferred = new Deferred();
        dialog.show(dialogArgument);
        return this._dialogDeferred.promise();
    }

    _onDialogClosed(e) {
        const result = e.dialogResult;
        if(result) {
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
        if(!itemThumbnailGetter) {
            return null;
        }
        const info = itemThumbnailGetter(item);
        return info ? info.thumbnail : null;
    }

    _initActions() {
        this._actions = {
            onSuccess: this._createActionByOption('onSuccess'),
            onError: this._createActionByOption('onError'),
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
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

        switch(name) {
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
        this._actions.onSuccess({ updatedOnlyFiles });
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

        this._errorState = { failedCount: 0 };
        this._itemNewName = '';
    }

    completeOperationItem(itemIndex) {
        if(this._singleRequest) {
            this._completedItems = [...this._items];
        } else {
            const item = this._items[itemIndex];
            this._completedItems.push(item);
        }
        if(!this._actionMetadata.allowItemProgress) {
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

        this._errorState.commonErrorText = this._errorState.failedCount > 1
            ? format(this._actionMetadata.multipleItemsErrorMessage, this._errorState.failedCount)
            : this._actionMetadata.singleItemErrorMessage;

        const itemInfo = this.getItemForMultipleRequestError(itemIndex);
        this._setCurrentDetailError(itemIndex, itemInfo, errorText);
    }

    hasModifiedItems() {
        return this._hasCompletedItems() || (this._singleRequest && !this.success && this._multipleItems);
    }

    getItemForSingleRequestError() {
        return this._multipleItems ? null : this._itemInfos[0];
    }

    getItemForMultipleRequestError(itemIndex) {
        return this._itemInfos[itemIndex];
    }

    getItemName(errorCode, itemIndex) {
        const itemInfo = this.singleRequest
            ? this.getItemForSingleRequestError()
            : this.getItemForMultipleRequestError(itemIndex);
        let result = itemInfo?.fileItem.name;
        if(this.itemNewName && this._isItemExistsErrorCode(errorCode)) {
            result = this.itemNewName;
        }
        return result;
    }

    _isItemExistsErrorCode(errorCode) {
        return errorCode === ErrorCode.DirectoryExists || errorCode === ErrorCode.FileExists;
    }

    _setCurrentDetailError(itemIndex, itemInfo, errorText) {
        this._errorState.currentDetailError = { itemIndex, itemInfo, errorText };
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
        return this._multipleItems
            ? format(this._actionMetadata.multipleItemsProcessingMessage, this._items.length, this._location)
            : format(this._actionMetadata.singleItemProcessingMessage, this._location);
    }

    get successMessage() {
        if(this._hasCompletedItems()) {
            return this._multipleItems
                ? format(this._actionMetadata.multipleItemsSuccessMessage, this._completedItems.length, this._location)
                : format(this._actionMetadata.singleItemSuccessMessage, this._location);
        } else {
            return this._multipleItems
                ? format(this._actionMetadata.multipleItemsErrorMessage, this._items.length)
                : this._actionMetadata.singleItemErrorMessage;
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

export default FileManagerEditingControl;
