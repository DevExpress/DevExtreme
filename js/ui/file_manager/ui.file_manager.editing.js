import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { Deferred } from "../../core/utils/deferred";
import { each } from "../../core/utils/iterator";
import { format } from "../../core/utils/string";

import messageLocalization from "../../localization/message";

import Widget from "../widget/ui.widget";

import FileManagerNameEditorDialog from "./ui.file_manager.dialog.name_editor";
import FileManagerFolderChooserDialog from "./ui.file_manager.dialog.folder_chooser";
import FileManagerFileUploader from "./ui.file_manager.file_uploader";
import { FileManagerMessages } from "./ui.file_manager.messages";

class FileManagerEditingControl extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._initActions();

        this._controller = this.option("controller");
        this._controller.on("EditActionStarting", this._onEditActionStarting.bind(this));
        this._controller.on("EditActionResultAcquired", this._onEditActionResultAcquired.bind(this));
        this._controller.on("EditActionItemError", this._onEditActionItemError.bind(this));
        this._controller.on("EditActionError", this._onEditActionError.bind(this));
        this._controller.on("CompleteEditActionItem", this._onCompleteEditActionItem.bind(this));
        this._controller.on("CompleteEditAction", this._onCompleteEditAction.bind(this));

        this._model = this.option("model");
        this._uploadOperationInfoMap = {};

        this._renameItemDialog = this._createEnterNameDialog("Rename", "Save");
        this._createFolderDialog = this._createEnterNameDialog("New folder", "Create");

        const $chooseFolderDialog = $("<div>").appendTo(this.$element());
        this._chooseFolderDialog = this._createComponent($chooseFolderDialog, FileManagerFolderChooserDialog, {
            provider: this._controller._fileProvider,
            getDirectories: this._controller.getDirectories.bind(this._controller),
            getCurrentDirectory: this._controller.getCurrentDirectory.bind(this._controller),
            onClosed: this._onDialogClosed.bind(this)
        });

        this._confirmationDialog = this._createConfirmationDialog();

        this._fileUploader = this._createFileUploader();

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
        const $fileUploader = $("<div>").appendTo(this.$element());
        return this._createComponent($fileUploader, this._getFileUploaderComponent(), {
            getController: this._getFileUploaderController.bind(this),
            onUploadSessionStarted: e => this._onUploadSessionStarted(e),
            onUploadProgress: e => this._onUploadProgress(e)
        });
    }

    _getFileUploaderController() {
        const uploadDirectory = this._uploadDirectoryInfo && this._uploadDirectoryInfo.fileItem;
        return {
            chunkSize: this._controller.getFileUploadChunkSize(),
            uploadFileChunk: (fileData, chunksInfo) => this._controller.uploadFileChunk(fileData, chunksInfo, uploadDirectory),
            abortFileUpload: (fileData, chunksInfo) => this._controller.abortFileUpload(fileData, chunksInfo, uploadDirectory)
        };
    }

    _createEnterNameDialog(title, buttonText) {
        const $dialog = $("<div>").appendTo(this.$element());
        return this._createComponent($dialog, FileManagerNameEditorDialog, {
            title: title,
            buttonText: buttonText,
            onClosed: this._onDialogClosed.bind(this)
        });
    }

    _createConfirmationDialog() {
        return { // TODO implement this dialog
            show: () => {
                setTimeout(() => {
                    this._onDialogClosed({ dialogResult: {} });
                });
            }
        };
    }

    _createMetadataMap() {
        this._metadataMap = {

            create: {
                action: arg => this._tryCreate(arg),
                affectsAllItems: true,
                singleItemProcessingMessage: "Creating a folder inside {0}",
                singleItemSuccessMessage: "Created a folder inside {0}",
                singleItemErrorMessage: "Folder wasn't created",
                commonErrorMessage: "Folder wasn't created"
            },

            rename: {
                action: arg => this._tryRename(arg),
                singleItemProcessingMessage: "Renaming an item inside {0}",
                singleItemSuccessMessage: "Renamed an item inside {0}",
                singleItemErrorMessage: "Item wasn't renamed",
                commonErrorMessage: "Item wasn't renamed"
            },

            delete: {
                action: arg => this._tryDelete(arg),
                singleItemProcessingMessage: "Deleting an item from {0}",
                multipleItemsProcessingMessage: "Deleting {0} items from {1}",
                singleItemSuccessMessage: "Deleted an item from {0}",
                multipleItemsSuccessMessage: "Deleted {0} items from {1}",
                singleItemErrorMessage: "Item wasn't deleted",
                multipleItemsErrorMessage: "{0} items weren't deleted",
                commonErrorMessage: "Some items weren't deleted"
            },

            move: {
                action: arg => this._tryMove(arg),
                singleItemProcessingMessage: "Moving an item to {0}",
                multipleItemsProcessingMessage: "Moving {0} items to {1}",
                singleItemSuccessMessage: "Moved an item to {0}",
                multipleItemsSuccessMessage: "Moved {0} items to {1}",
                singleItemErrorMessage: "Item wasn't moved",
                multipleItemsErrorMessage: "{0} items weren't moved",
                commonErrorMessage: "Some items weren't moved"
            },

            copy: {
                action: arg => this._tryCopy(arg),
                singleItemProcessingMessage: "Coping an item to {0}",
                multipleItemsProcessingMessage: "Coping {0} items to {1}",
                singleItemSuccessMessage: "Copied an item to {0}",
                multipleItemsSuccessMessage: "Copied {0} items to {1}",
                singleItemErrorMessage: "Item wasn't copied",
                multipleItemsErrorMessage: "{0} items weren't copied",
                commonErrorMessage: "Some items weren't copied"
            },

            upload: {
                action: () => this._tryUpload(),
                allowCancel: true,
                allowItemProgress: true,
                singleItemProcessingMessage: "Uploading an item to {0}",
                multipleItemsProcessingMessage: "Uploading {0} items to {1}",
                singleItemSuccessMessage: "Uploaded an item to {0}",
                multipleItemsSuccessMessage: "Uploaded {0} items to {1}",
                singleItemErrorMessage: "Item wasn't uploaded",
                multipleItemsErrorMessage: "{0} items weren't uploaded",
                canceledMessage: "Canceled"
            },

            download: {
                action: arg => this._download(arg)
            },

            getItemContent: {
                action: arg => this._getItemContent(arg)
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
        const operationInfo = this._uploadOperationInfoMap[sessionId];
        this._notificationControl.updateOperationItemProgress(operationInfo, fileIndex, fileValue * 100, commonValue * 100);
    }

    _onUploadSessionStarted({ sessionInfo }) {
        this._controller.processUploadSession(sessionInfo, this._uploadDirectoryInfo);
    }

    _onEditActionStarting(actionInfo) {
        const actionMetadata = this._metadataMap[actionInfo.name];
        const context = new FileManagerActionContext(actionMetadata, actionInfo.itemInfos, actionInfo.directory);
        const operationInfo = this._notificationControl.addOperation(context.processingMessage, actionMetadata.allowCancel, !actionMetadata.allowItemProgress);
        extend(actionInfo.customData, { context, operationInfo });

        if(actionInfo.name === "upload") {
            const sessionId = actionInfo.customData.sessionInfo.sessionId;
            operationInfo.uploadSessionId = sessionId;
            this._uploadOperationInfoMap[sessionId] = operationInfo;
        }
    }

    _onEditActionResultAcquired(actionInfo) {
        const { context, operationInfo } = actionInfo.customData;
        context.singleRequest = actionInfo.singleRequest;
        if(!context.singleRequest) {
            const details = context.itemInfos.map(itemInfo => this._getItemProgressDisplayInfo(itemInfo));
            this._notificationControl.addOperationDetails(operationInfo, details, context.actionMetadata.allowCancel);
        }
    }

    _onEditActionError(actionInfo, error) {
        const { context, operationInfo } = actionInfo.customData;
        context.singleRequest = actionInfo.singleRequest;
        this._handleActionError(operationInfo, context, error);
        this._completeAction(operationInfo, context);
    }

    _onEditActionItemError(actionInfo, info) {
        const { context, operationInfo } = actionInfo.customData;
        this._handleActionError(operationInfo, context, info);
    }

    _onCompleteEditActionItem(actionInfo, info) {
        const { context, operationInfo } = actionInfo.customData;
        if(!info.result || !info.result.canceled) {
            context.completeOperationItem(info.index);
            if(!context.singleRequest) {
                this._notificationControl.completeOperationItem(operationInfo, info.index, context.commonProgress);
            }
        }
    }

    _onCompleteEditAction(actionInfo) {
        const { context, operationInfo } = actionInfo.customData;
        this._completeAction(operationInfo, context);

        if(actionInfo.name === "upload") {
            delete this._uploadOperationInfoMap[actionInfo.customData.sessionInfo.sessionId];
        }
    }

    _tryCreate(parentDirectories) {
        const parentDirectoryInfo = parentDirectories && parentDirectories[0] || this._getCurrentDirectory();
        const newDirName = messageLocalization.format("dxFileManager-newFolderName");
        return this._showDialog(this._createFolderDialog, newDirName)
            .then(({ name }) => this._controller.createDirectory(parentDirectoryInfo, name));
    }

    _tryRename(itemInfos) {
        const itemInfo = itemInfos && itemInfos[0] || this._model.getMultipleSelectedItems()[0];
        return this._showDialog(this._renameItemDialog, itemInfo.fileItem.name)
            .then(({ name }) => this._controller.renameItem(itemInfo, name));
    }

    _tryDelete(itemInfos) {
        itemInfos = itemInfos || this._model.getMultipleSelectedItems();
        return this._showDialog(this._confirmationDialog)
            .then(() => this._controller.deleteItems(itemInfos));
    }

    _tryMove(itemInfos) {
        itemInfos = itemInfos || this._model.getMultipleSelectedItems();
        return this._showDialog(this._chooseFolderDialog)
            .then(({ folder }) => this._controller.moveItems(itemInfos, folder));
    }

    _tryCopy(itemInfos) {
        itemInfos = itemInfos || this._model.getMultipleSelectedItems();
        return this._showDialog(this._chooseFolderDialog)
            .then(({ folder }) => this._controller.copyItems(itemInfos, folder));
    }

    _tryUpload(destinationFolder) {
        this._uploadDirectoryInfo = destinationFolder && destinationFolder[0] || this._getCurrentDirectory();
        this._fileUploader.tryUpload();
    }

    _download(itemInfos) {
        itemInfos = itemInfos || this._model.getMultipleSelectedItems();
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
        const errorText = this._getErrorText(errorInfo, itemInfo);

        context.processSingleRequestError(errorText);
        const operationErrorInfo = this._getOperationErrorInfo(context);
        this._notificationControl.completeSingleOperationWithError(operationInfo, operationErrorInfo);

        if(context.multipleItems) {
            this._raiseOnSuccess(context.onlyFiles);
        }
    }

    _handleMultipleRequestActionError(operationInfo, context, errorInfo) {
        const itemInfo = context.getItemForMultipleRequestError(errorInfo.index);
        const errorText = this._getErrorText(errorInfo, itemInfo);

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

    _getErrorText(errorInfo, itemInfo) {
        const itemName = itemInfo ? itemInfo.fileItem.name : null;
        return FileManagerMessages.get(errorInfo.errorId, itemName);
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

    _getItemThumbnail(item) {
        const itemThumbnailGetter = this.option("getItemThumbnail");
        if(!itemThumbnailGetter) {
            return null;
        }
        const info = itemThumbnailGetter(item);
        return info ? info.thumbnail : null;
    }

    _initActions() {
        this._actions = {
            onSuccess: this._createActionByOption("onSuccess"),
            onError: this._createActionByOption("onError"),
            onCreating: this._createActionByOption("onCreating"),
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
            onError: null,
            onCreating: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "model":
                this.repaint();
                break;
            case "notificationControl":
                this._initNotificationControl(args.value);
                break;
            case "getItemThumbnail":
                break;
            case "onSuccess":
            case "onError":
            case "onCreating":
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    _raiseOnSuccess(updatedOnlyFiles) {
        this._actions.onSuccess({ updatedOnlyFiles });
    }

    _raiseOnError(errorId, fileItem) {
        const fileItemName = fileItem ? fileItem.name : null;
        const message = FileManagerMessages.get(errorId, fileItemName);
        this._actions.onError({ message });
    }

    _getCurrentDirectory() {
        return this._controller.getCurrentDirectory();
    }

}

class FileManagerActionContext {

    constructor(actionMetadata, itemInfos, directoryInfo) {
        this._actionMetadata = actionMetadata;
        this._itemInfos = itemInfos;

        this._onlyFiles = !this._actionMetadata.affectsAllItems && this._itemInfos.every(info => !info.fileItem.isDirectory);
        this._items = this._itemInfos.map(itemInfo => itemInfo.fileItem);
        this._multipleItems = this._items.length > 1;
        this._location = directoryInfo.fileItem.name;

        this._singleRequest = true;

        this._completedItems = [];
        this._commonProgress = 0;

        this._errorState = { failedCount: 0 };
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

module.exports = FileManagerEditingControl;
