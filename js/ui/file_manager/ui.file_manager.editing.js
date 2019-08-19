import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { Deferred } from "../../core/utils/deferred";
import { noop } from "../../core/utils/common";
import { each } from "../../core/utils/iterator";
import { format } from "../../core/utils/string";
import { ensureDefined } from "../../core/utils/common";

import messageLocalization from "../../localization/message";

import Widget from "../widget/ui.widget";

import whenSome from "./ui.file_manager.common";
import { getName } from "./ui.file_manager.utils";
import FileManagerNameEditorDialog from "./ui.file_manager.dialog.name_editor";
import FileManagerFolderChooserDialog from "./ui.file_manager.dialog.folder_chooser";
import FileManagerFileUploader from "./ui.file_manager.file_uploader";
import { FileManagerMessages } from "./ui.file_manager.messages";

class FileManagerEditingControl extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._initActions();

        this._controller = this.option("controller");
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

        this._createEditActions();
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
            onUploadProgress: e => this._onUploadProgress(e),
            onFilesUploaded: result => {},
            onErrorOccurred: () => {}
        });
    }

    _getFileUploaderController() {
        return {
            chunkSize: this._controller.getFileUploadChunkSize(),
            initiateUpload: state => {
                state.destinationFolder = this._uploadDirectoryInfo.fileItem;
                return this._controller.initiateFileUpload(state);
            },
            uploadChunk: (state, chunk) => this._controller.uploadFileChunk(state, chunk),
            finalizeUpload: state => this._controller.finalizeFileUpload(state),
            abortUpload: state => this._controller.abortFileUpload(state)
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

    _createEditActions() {
        this._editActions = {

            create: {
                useCurrentFolder: true,
                affectsAllItems: true,
                dialog: this._createFolderDialog,
                getDialogArgument: () => messageLocalization.format("dxFileManager-newFolderName"),
                action: ([item], { name }) => this._controller.createDirectory(item, name),
                completeAction: ([item]) => this._controller.completeCreateDirectory(item),
                getLocation: ([item]) => getName(item.parentPath),
                getSingleItemProcessingMessage: ([item], location) => format("Creating a folder inside {0}", location),
                getSingleItemSuccessMessage: ([item], location) => format("Created a folder inside {0}", location),
                getSingleItemErrorMessage: () => "Folder wasn't created",
                getCommonErrorMessage: () => "Folder wasn't created"
            },

            rename: {
                dialog: this._renameItemDialog,
                getDialogArgument: ([{ name }]) => name,
                action: ([item], { name }) => this._controller.renameItem(item, name),
                completeAction: ([item]) => this._controller.completeRenameItem(item),
                getLocation: ([item]) => getName(item.parentPath),
                getSingleItemProcessingMessage: ([item], location) => format("Renaming an item inside {0}", location),
                getSingleItemSuccessMessage: ([item], location) => format("Renamed an item inside {0}", location),
                getSingleItemErrorMessage: () => "Item wasn't renamed",
                getCommonErrorMessage: () => "Item wasn't renamed"
            },

            delete: {
                dialog: this._confirmationDialog,
                getDialogArgument: ([{ name }]) => name,
                action: (items, arg) => this._controller.deleteItems(items),
                completeAction: (items, arg) => this._controller.completeDeleteItems(items),
                getLocation: ([item]) => getName(item.parentPath),
                getSingleItemProcessingMessage: (items, location) => format("Deleting an item from {0}", location),
                getMultipleItemsProcessingMessage: (items, location) => format("Deleting {0} items from {1}", items.length, location),
                getSingleItemSuccessMessage: (items, location) => format("Deleted an item from {0}", location),
                getMultipleItemsSuccessMessage: (items, location) => format("Deleted {0} items from {1}", items.length, location),
                getSingleItemErrorMessage: () => "Item wasn't deleted",
                getMultipleItemsErrorMessage: (count) => format("{0} items weren't deleted", count),
                getCommonErrorMessage: () => "Some items weren't deleted"
            },

            move: {
                dialog: this._chooseFolderDialog,
                action: (items, arg) => this._controller.moveItems(items, arg.folder),
                completeAction: (items, arg) => this._controller.completeMoveItems(items, arg.folder),
                getLocation: (items, arg) => arg.folder.name,
                getSingleItemProcessingMessage: (items, location) => format("Moving an item to {0}", location),
                getMultipleItemsProcessingMessage: (items, location) => format("Moving {0} items to {1}", items.length, location),
                getSingleItemSuccessMessage: (items, location) => format("Moved an item to {0}", location),
                getMultipleItemsSuccessMessage: (items, location) => format("Moved {0} items to {1}", items.length, location),
                getSingleItemErrorMessage: () => "Item wasn't moved",
                getMultipleItemsErrorMessage: (count) => format("{0} items weren't moved", count),
                getCommonErrorMessage: () => "Some items weren't moved"
            },

            copy: {
                dialog: this._chooseFolderDialog,
                action: (items, arg) => this._controller.copyItems(items, arg.folder),
                completeAction: (items, arg) => this._controller.completeCopyItems(items, arg.folder),
                getLocation: (items, arg) => arg.folder.name,
                getSingleItemProcessingMessage: (items, location) => format("Coping an item to {0}", location),
                getMultipleItemsProcessingMessage: (items, location) => format("Coping {0} items to {1}", items.length, location),
                getSingleItemSuccessMessage: (items, location) => format("Copied an item to {0}", location),
                getMultipleItemsSuccessMessage: (items, location) => format("Copied {0} items to {1}", items.length, location),
                getSingleItemErrorMessage: () => "Item wasn't copied",
                getMultipleItemsErrorMessage: (count) => format("{0} items weren't copied", count),
                getCommonErrorMessage: () => "Some items weren't copied"
            },

            upload: {
                allowCancel: true,
                allowItemProgress: true,
                action: () => this._tryUpload(),
                completeAction: (items, arg) => this._controller.completeFilesUpload(items),
                getLocation: () => this._uploadDirectoryInfo.fileItem.name,
                getSingleItemProcessingMessage: (items, location) => format("Uploading an item to {0}", location),
                getMultipleItemsProcessingMessage: (items, location) => format("Uploading {0} items to {1}", items.length, location),
                getSingleItemSuccessMessage: (items, location) => format("Uploaded an item to {0}", location),
                getMultipleItemsSuccessMessage: (items, location) => format("Uploaded {0} items to {1}", items.length, location),
                getSingleItemErrorMessage: () => "Item wasn't uploaded",
                getMultipleItemsErrorMessage: (count) => format("{0} items weren't uploaded", count),
                getCanceledMessage: () => "Canceled"
            },

            download: {
                action: () => { } // TODO implement this action
            }
        };
    }

    getCommandActions() {
        const result = {};

        each(this._editActions, (name, action) => {
            if(Object.prototype.hasOwnProperty.call(this._editActions, name)) {
                result[name] = arg => this._executeAction(name, arg);
            }
        });

        return result;
    }

    _executeAction(actionName, arg) {
        const action = this._editActions[actionName];
        if(!action) {
            return;
        }

        return action.dialog ? this._tryEditAction(action, arg) : action.action(arg);
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
        const action = this._editActions.upload;
        const itemInfos = this._controller.getItemInfosForUploaderFiles(sessionInfo.files, this._uploadDirectoryInfo);

        const context = new FileManagerActionContext(action, itemInfos, true);
        const operationInfo = this._startActionProcessing(context);
        this._addOperationDetailsInProgressPanel(operationInfo, context);

        operationInfo.uploadSessionId = sessionInfo.sessionId;
        this._uploadOperationInfoMap[sessionInfo.sessionId] = operationInfo;

        this._processDeferreds(sessionInfo.deferreds, operationInfo, context)
            .done(() => {
                delete this._uploadOperationInfoMap[sessionInfo.sessionId];
            });
    }

    _tryEditAction(action, arg) {
        let itemInfos = arg;
        if(!itemInfos) {
            itemInfos = action.useCurrentFolder ? [ this._getCurrentDirectory() ] : this._model.getMultipleSelectedItems();
        }

        const context = new FileManagerActionContext(action, itemInfos);
        let operationInfo = null;

        return this._showDialog(action.dialog, context.getDialogArgument())
            .then(dialogResult => {
                operationInfo = this._startActionProcessing(context, dialogResult);
                return this._processAction(operationInfo, context);
            })
            .then(result => this._processDeferreds(result, operationInfo, context),
                info => {
                    if(info) {
                        this._handleActionError(operationInfo, context, info, true);
                        this._completeAction(operationInfo, context);
                    }
                });
    }

    _processDeferreds(deferreds, operationInfo, context) {
        return whenSome(
            deferreds,
            info => this._completeActionItem(operationInfo, context, info),
            info => this._handleActionError(operationInfo, context, info)
        ).then(() => this._completeAction(operationInfo, context));
    }

    _addOperationDetailsInProgressPanel(operationInfo, context) {
        const details = context.itemInfos.map(itemInfo => this._getItemProgressDisplayInfo(itemInfo));
        this._notificationControl.addOperationDetails(operationInfo, details, context.actionInfo.allowCancel);
    }

    _startActionProcessing(context, actionArgument) {
        context.applyActionArgument(actionArgument);

        const actionInfo = context.actionInfo;
        return this._notificationControl.addOperation(context.processingMessage, actionInfo.allowCancel, !actionInfo.allowItemProgress);
    }

    _processAction(operationInfo, context) {
        const actionResult = context.executeAction();

        if(!context.singleRequest) {
            this._addOperationDetailsInProgressPanel(operationInfo, context);
        }

        return actionResult;
    }

    _completeAction(operationInfo, context) {
        this._notificationControl.completeOperation(operationInfo, context.completionMessage, !context.success, context.statusText);

        const completed = context.tryCompleteAction();
        if(completed) {
            this._raiseOnSuccess(context.onlyFiles);
        }
    }

    _completeActionItem(operationInfo, context, info) {
        if(!info.result || !info.result.canceled) {
            context.completeOperationItem(info.index);
            if(!context.singleRequest) {
                this._notificationControl.completeOperationItem(operationInfo, info.index, context.commonProgress);
            }
        }
    }

    _handleActionError(operationInfo, context, errorInfo, singleRequest) {
        singleRequest = ensureDefined(singleRequest, context.singleRequest);

        operationInfo.hasError = true;

        if(singleRequest) {
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

    _tryUpload(destinationFolder) {
        this._uploadDirectoryInfo = destinationFolder && destinationFolder[0] || this._getCurrentDirectory();
        this._fileUploader.tryUpload();
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

    constructor(actionInfo, itemInfos, multipleRequest) {
        this._actionInfo = actionInfo;
        this._itemInfos = itemInfos;

        this._onlyFiles = !this._actionInfo.affectsAllItems && this._itemInfos.every(info => !info.fileItem.isDirectory);
        this._items = this._itemInfos.map(itemInfo => itemInfo.fileItem);
        this._multipleItems = this._items.length > 1;
        this._location = "";

        this._processingMessageGetter = this._multipleItems ? this._actionInfo.getMultipleItemsProcessingMessage : this._actionInfo.getSingleItemProcessingMessage;
        this._successMessageGetter = this._multipleItems ? this._actionInfo.getMultipleItemsSuccessMessage : this._actionInfo.getSingleItemSuccessMessage;
        this._singleRequest = !multipleRequest;

        this._completedItems = [];
        this._commonProgress = 0;
        this._operationInfo = null;
        this._actionArgument = null;

        this._errorState = { failedCount: 0 };
    }

    getDialogArgument() {
        const dialogArgumentGetter = this._actionInfo.getDialogArgument || noop;
        return dialogArgumentGetter(this._items);
    }

    applyActionArgument(actionArgument) {
        this._actionArgument = actionArgument;
        this._location = this._actionInfo.getLocation(this._items, this._actionArgument) || "Files"; // TODO move Files to options
    }

    executeAction() {
        const actionResult = this._actionInfo.action(this._itemInfos, this._actionArgument);
        this._singleRequest = this._items.length === 1 || !Array.isArray(actionResult);
        return Array.isArray(actionResult) ? actionResult : [ actionResult ];
    }

    completeOperationItem(itemIndex) {
        if(this._singleRequest) {
            this._completedItems = [...this._items];
        } else {
            const item = this._items[itemIndex];
            this._completedItems.push(item);
        }
        if(!this._actionInfo.allowItemProgress) {
            this._commonProgress = this._completedItems.length / this._items.length * 100;
        }
    }

    processSingleRequestError(errorText) {
        this._errorState.failedCount = 1;
        this._errorState.commonErrorText = this._multipleItems ? this._actionInfo.getCommonErrorMessage() : this._actionInfo.getSingleItemErrorMessage(1);

        const itemIndex = this._multipleItems ? -1 : 1;
        const itemInfo = this.getItemForSingleRequestError();
        this._setCurrentDetailError(itemIndex, itemInfo, errorText);
    }

    processMultipleRequestError(itemIndex, errorText) {
        this._errorState.failedCount++;

        const errorMessageGetter = this._errorState.failedCount > 1 ? this._actionInfo.getMultipleItemsErrorMessage : this._actionInfo.getSingleItemErrorMessage;
        this._errorState.commonErrorText = errorMessageGetter(this._errorState.failedCount);

        const itemInfo = this.getItemForMultipleRequestError(itemIndex);
        this._setCurrentDetailError(itemIndex, itemInfo, errorText);
    }

    getItemForOperationError(itemIndex) {
        if(this._singleRequest) {
            return this.getItemForSingleRequestError();
        } else {
            return this.getItemForMultipleRequestError(itemIndex);
        }
    }

    tryCompleteAction() {
        if(this._hasCompletedItems() || (this._singleRequest && !this.success && this._multipleItems)) {
            this._actionInfo.completeAction(this._itemInfos, this._actionArgument);
            return true;
        }
        return false;
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

    get actionInfo() {
        return this._actionInfo;
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

    get multipleItems() {
        return this._multipleItems;
    }

    get onlyFiles() {
        return this._onlyFiles;
    }

    get processingMessage() {
        return this._processingMessageGetter(this._items, this._location);
    }

    get successMessage() {
        if(this._hasCompletedItems()) {
            return this._successMessageGetter(this._completedItems, this._location);
        } else {
            const errorMessageGetter = this._multipleItems ? this._actionInfo.getMultipleItemsErrorMessage : this._actionInfo.getSingleItemErrorMessage;
            return errorMessageGetter(this._items.length);
        }
    }

    get completionMessage() {
        return this.success ? this.successMessage : this.errorState.commonErrorText;
    }

    get statusText() {
        return this.success && !this._hasCompletedItems() ? this._actionInfo.getCanceledMessage() : undefined;
    }

    get commonProgress() {
        return this._commonProgress;
    }

    get success() {
        return !this._errorState.failedCount;
    }

}

module.exports = FileManagerEditingControl;
