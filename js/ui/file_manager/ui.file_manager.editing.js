import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { Deferred, when } from "../../core/utils/deferred";

import Widget from "../widget/ui.widget";

import whenSome from "./ui.file_manager.common";
import FileManagerNameEditorDialog from "./ui.file_manager.dialog.name_editor";
import FileManagerFolderChooserDialog from "./ui.file_manager.dialog.folder_chooser";
import FileManagerFileUploader from "./ui.file_manager.file_uploader";

var FileManagerEditingControl = Widget.inherit({

    _init: function() {
        this._commands = {
            rename: this._tryRename,
            create: this._tryCreate,
            delete: this._tryDelete,
            move: this._tryMove,
            copy: this._tryCopy,
            upload: this._tryUpload,
        };

        this.callBase();
    },

    _initMarkup: function() {
        this.callBase();

        this._model = this.option("model");
        this._provider = this._model.provider;

        this._renameItemDialog = this._createEnterNameDialog("Rename", "Save");
        this._createFolderDialog = this._createEnterNameDialog("Folder", "Create");
        this._chooseFolderDialog = this._createComponent($("<div>"), FileManagerFolderChooserDialog, {
            provider: this._provider,
            onClosed: this._onDialogClosed.bind(this)
        });
        this._confirmationDialog = this._createConfirmationDialog();

        this._fileUploader = this._createFileUploader();

        this.$element()
            .append(this._renameItemDialog.$element())
            .append(this._createFolderDialog.$element())
            .append(this._chooseFolderDialog.$element())
            .append(this._fileUploader.$element());
    },

    _createFileUploader: function() {
        var that = this;
        return this._createComponent($("<div>"), FileManagerFileUploader, {
            onGetController: this._getFileUploaderController.bind(this),
            onFilesUploaded: function(result) {
                that._raiseOnSuccess("Files uploaded", true);
            },
            onErrorOccurred: function(e) {
                var title = `Upload failed for the '${e.fileName}' file`;
                that._raiseOnError(title, e.error);
            }
        });
    },

    _getFileUploaderController: function() {
        var destinationFolder = this._model.getCurrentFolder();
        var that = this;
        return {
            chunkSize: this._provider.getFileUploadChunkSize(),

            initiateUpload: function(state) {
                state.destinationFolder = destinationFolder;
                return when(that._provider.initiateFileUpload(state));
            },

            uploadChunk: function(state, chunk) {
                return when(that._provider.uploadFileChunk(state, chunk));
            },

            finalizeUpload: function(state) {
                return when(that._provider.finalizeFileUpload(state));
            },

            abortUpload: function(state) {
                return when(that._provider.abortFileUpload(state));
            }
        };
    },

    _createEnterNameDialog: function(title, buttonText) {
        return this._createComponent($("<div>"), FileManagerNameEditorDialog, {
            title: title,
            buttonText: buttonText,
            onClosed: this._onDialogClosed.bind(this)
        });
    },

    _createConfirmationDialog: function() {
        var that = this;
        return { // TODO implement this dialog
            show: () => {
                setTimeout(() => {
                    that._onDialogClosed({});
                });
            }
        };
    },

    _tryRename: function() {
        var item = this._model.getSingleSelectedItem();

        if(!item) return;

        this._tryEditAction(
            this._renameItemDialog,
            result => this._provider.renameItem(item, result.name),
            "Item renamed",
            info => `Rename operation failed for the ${item.name} item`,
            item.name
        );
    },

    _tryCreate: function() {
        var item = this._model.getCurrentFolder();
        this._setItemsViewAreaActive(false);

        this._tryEditAction(
            this._createFolderDialog,
            result => this._provider.createFolder(item, result.name),
            "Folder created",
            info => `Create folder operation failed for the ${item.name} parent folder`
        );
    },

    _tryDelete: function() {
        var items = this._model.getMultipleSelectedItems();

        if(items.length === 0) return;

        this._tryEditAction(
            this._confirmationDialog,
            result => this._provider.deleteItems(items),
            "Items deleted",
            info => `Delete operation failed for the ${items[info.index].name} item`
        );
    },

    _tryMove: function() {
        var items = this._model.getMultipleSelectedItems();

        if(items.length === 0) return;

        this._tryEditAction(
            this._chooseFolderDialog,
            result => this._provider.moveItems(items, result.folder),
            "Items moved",
            info => `Move operation failed for the ${items[info.index].name} item`
        );
    },

    _tryCopy: function() {
        var items = this._model.getMultipleSelectedItems();

        if(items.length === 0) return;

        this._tryEditAction(
            this._chooseFolderDialog,
            result => this._provider.copyItems(items, result.folder),
            "Items copied",
            info => `Copy operation failed for the ${items[info.index].name} item`
        );
    },

    _tryEditAction: function(dialog, editAction, successMessage, errorMessageAction, dialogArgument) {
        this._showDialog(dialog, dialogArgument)
            .then(editAction.bind(this))
            .then(result => {
                whenSome(result,
                    () => this._raiseOnSuccess(successMessage),
                    info => this._raiseOnError(errorMessageAction(info), info.error));
            });
    },

    _tryUpload: function() {
        this._fileUploader.tryUpload();
    },

    _showDialog: function(dialog, dialogArgument) {
        this._dialogDeferred = new Deferred();
        dialog.show(dialogArgument);
        return this._dialogDeferred.promise();
    },

    _onDialogClosed: function(result) {
        if(result) {
            this._dialogDeferred.resolve(result);
        } else {
            this._dialogDeferred.reject();
        }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            model: {
                provider: null,
                getCurrentFolder: null,
                getSingleSelectedItem: null,
                getMultipleSelectedItems: null
            },
            onSuccess: null,
            onError: null
        });
    },

    _raiseOnSuccess: function(message) {
        var handler = this.option("onSuccess");
        handler(message);
    },

    _raiseOnError: function(errorTitle, errorDetails) {
        var handler = this.option("onError");
        handler(errorTitle, errorDetails);
    },

    executeCommand: function(commandName) {
        var action = this._commands[commandName];
        if(action) {
            action.call(this);
            return true;
        } else {
            return false;
        }
    }

});

module.exports = FileManagerEditingControl;
