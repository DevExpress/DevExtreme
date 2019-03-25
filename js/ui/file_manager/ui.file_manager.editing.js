import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { Deferred, when } from "../../core/utils/deferred";

import Widget from "../widget/ui.widget";

import whenSome from "./ui.file_manager.common";
import FileManagerNameEditorDialog from "./ui.file_manager.dialog.name_editor";
import FileManagerFolderChooserDialog from "./ui.file_manager.dialog.folder_chooser";
import FileManagerFileUploader from "./ui.file_manager.file_uploader";

class FileManagerEditingControl extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._model = this.option("model");
        this._provider = this._model.provider;

        this._renameItemDialog = this._createEnterNameDialog("Rename", "Save");
        this._createFolderDialog = this._createEnterNameDialog("Folder", "Create");
        this._chooseFolderDialog = this._createComponent($("<div>"), FileManagerFolderChooserDialog, {
            provider: this._provider,
            getItems: this._model.getFolders,
            onClosed: this._onDialogClosed.bind(this)
        });
        this._confirmationDialog = this._createConfirmationDialog();

        this._fileUploader = this._createFileUploader();

        this.$element()
            .append(this._renameItemDialog.$element())
            .append(this._createFolderDialog.$element())
            .append(this._chooseFolderDialog.$element())
            .append(this._fileUploader.$element());
    }

    _createFileUploader() {
        return this._createComponent($("<div>"), FileManagerFileUploader, {
            onGetController: this._getFileUploaderController.bind(this),
            onFilesUploaded: result => this._raiseOnSuccess("Files uploaded", true),
            onErrorOccurred: e => {
                const title = `Upload failed for the '${e.fileName}' file`;
                this._raiseOnError(title, e.error);
            }
        });
    }

    _getFileUploaderController() {
        const destinationFolder = this._model.getCurrentFolder();
        const that = this;
        return {
            chunkSize: this._provider.getFileUploadChunkSize(),

            initiateUpload(state) {
                state.destinationFolder = destinationFolder;
                return when(that._provider.initiateFileUpload(state));
            },

            uploadChunk(state, chunk) {
                return when(that._provider.uploadFileChunk(state, chunk));
            },

            finalizeUpload(state) {
                return when(that._provider.finalizeFileUpload(state));
            },

            abortUpload(state) {
                return when(that._provider.abortFileUpload(state));
            }
        };
    }

    _createEnterNameDialog(title, buttonText) {
        return this._createComponent($("<div>"), FileManagerNameEditorDialog, {
            title: title,
            buttonText: buttonText,
            onClosed: this._onDialogClosed.bind(this)
        });
    }

    _createConfirmationDialog() {
        return { // TODO implement this dialog
            show: () => {
                setTimeout(() => {
                    this._onDialogClosed({});
                });
            }
        };
    }

    tryRename(fileItem) {
        fileItem && this._tryEditAction(
            this._renameItemDialog,
            result => this._provider.renameItem(fileItem, result.name),
            "Item renamed",
            () => `Rename operation failed for the ${fileItem.name} item`,
            fileItem.name
        );
    }

    tryCreate() {
        const item = this._model.getCurrentFolder();
        const onCreatingHandler = this.option("onCreating");
        onCreatingHandler();

        this._tryEditAction(
            this._createFolderDialog,
            result => this._provider.createFolder(item, result.name),
            "Folder created",
            info => `Create folder operation failed for the ${item.name} parent folder`
        );
    }

    tryDelete(fileItems) {
        if(fileItems.length === 0) {
            return;
        }

        this._tryEditAction(
            this._confirmationDialog,
            result => this._provider.deleteItems(fileItems),
            "Items deleted",
            info => `Delete operation failed for the ${fileItems[info.index].name} item`
        );
    }

    tryMove(fileItems) {
        if(!fileItems || fileItems.length === 0) {
            return;
        }

        this._tryEditAction(
            this._chooseFolderDialog,
            result => this._provider.moveItems(fileItems, result.folder),
            "Items moved",
            info => `Move operation failed for the ${fileItems[info.index].name} item`
        );
    }

    tryCopy(fileItems) {
        if(fileItems.length === 0) {
            return;
        }

        this._tryEditAction(
            this._chooseFolderDialog,
            result => this._provider.copyItems(fileItems, result.folder),
            "Items copied",
            info => `Copy operation failed for the ${fileItems[info.index].name} item`
        );
    }

    _tryEditAction(dialog, editAction, successMessage, errorMessageAction, dialogArgument) {
        this._showDialog(dialog, dialogArgument)
            .then(editAction.bind(this))
            .then(result => {
                whenSome(result,
                    () => this._raiseOnSuccess(successMessage),
                    info => this._raiseOnError(errorMessageAction(info), info.error));
            });
    }

    _tryUpload() {
        this._fileUploader.tryUpload();
    }

    _showDialog(dialog, dialogArgument) {
        this._dialogDeferred = new Deferred();
        dialog.show(dialogArgument);
        return this._dialogDeferred.promise();
    }

    _onDialogClosed(result) {
        if(result) {
            this._dialogDeferred.resolve(result);
        } else {
            this._dialogDeferred.reject();
        }
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            model: {
                provider: null,
                getFolders: null,
                getCurrentFolder: null,
                getSingleSelectedItem: null,
                getMultipleSelectedItems: null
            },
            onSuccess: null,
            onError: null,
            onCreating: null
        });
    }

    _raiseOnSuccess(message) {
        const handler = this.option("onSuccess");
        handler(message);
    }

    _raiseOnError(errorTitle, errorDetails) {
        const handler = this.option("onError");
        handler(errorTitle, errorDetails);
    }

}

module.exports = FileManagerEditingControl;
