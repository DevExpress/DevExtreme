import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { Deferred, when } from "../../core/utils/deferred";
import { isFunction } from "../../core/utils/type";
import { noop } from "../../core/utils/common";
import { each } from "../../core/utils/iterator";

import Widget from "../widget/ui.widget";

import whenSome from "./ui.file_manager.common";
import FileManagerNameEditorDialog from "./ui.file_manager.dialog.name_editor";
import FileManagerFolderChooserDialog from "./ui.file_manager.dialog.folder_chooser";
import FileManagerFileUploader from "./ui.file_manager.file_uploader";
import { FileManagerMessages } from "./ui.file_manager.messages";

class FileManagerEditingControl extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._model = this.option("model");
        this._provider = this._model.provider;
        this._initActions();

        this._renameItemDialog = this._createEnterNameDialog("Rename", "Save");
        this._createFolderDialog = this._createEnterNameDialog("Folder", "Create");

        const $chooseFolderDialog = $("<div>").appendTo(this.$element());
        this._chooseFolderDialog = this._createComponent($chooseFolderDialog, FileManagerFolderChooserDialog, {
            provider: this._provider,
            getItems: this._model.getFolders,
            onClosed: this._onDialogClosed.bind(this)
        });

        this._confirmationDialog = this._createConfirmationDialog();

        this._fileUploader = this._createFileUploader();

        this._createEditActions();
    }

    _createFileUploader() {
        const $fileUploader = $("<div>").appendTo(this.$element());
        return this._createComponent($fileUploader, FileManagerFileUploader, {
            getController: this._getFileUploaderController.bind(this),
            onFilesUploaded: result => this._raiseOnSuccess("Files uploaded", true),
            onErrorOccurred: ({ info }) => {
                const title = `Upload failed for the '${info.fileName}' file`;
                this._raiseOnError(title, info.error);
            }
        });
    }

    _getFileUploaderController() {
        const destinationFolder = this._uploadFolder;
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
                action: ([item], { name }) => this._provider.createFolder(item, name),
                getSuccessMessage: items => "Folder created"
            },

            rename: {
                dialog: this._renameItemDialog,
                getDialogArgument: ([{ name }]) => name,
                action: ([item], { name }) => this._provider.renameItem(item, name),
                getSuccessMessage: items => "Item renamed"
            },

            delete: {
                dialog: this._confirmationDialog,
                getDialogArgument: ([{ name }]) => name,
                action: (items, arg) => this._provider.deleteItems(items),
                getSuccessMessage: items => "Items deleted"
            },

            move: {
                dialog: this._chooseFolderDialog,
                action: (items, arg) => this._provider.moveItems(items, arg.folder),
                getSuccessMessage: items => "Items moved"
            },

            copy: {
                dialog: this._chooseFolderDialog,
                action: (items, arg) => this._provider.copyItems(items, arg.folder),
                getSuccessMessage: items => "Items copied"
            },

            upload: this._tryUpload.bind(this),

            download: () => { } // TODO implement this action
        };
    }

    getCommandActions() {
        const result = {};

        each(this._editActions, (name, action) => {
            if(this._editActions.hasOwnProperty(name)) {
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

        if(isFunction(action)) {
            action(arg);
        } else {
            this._tryEditAction(action, arg);
        }
    }

    _tryEditAction(action, arg) {
        let items = arg;
        if(!items) {
            items = action.useCurrentFolder ? [ this._model.getCurrentFolder() ] : this._model.getMultipleSelectedItems();
        }
        const onlyFiles = !action.affectsAllItems && items.every(item => !item.isDirectory);
        const dialogArgumentGetter = action.getDialogArgument || noop;

        this._showDialog(action.dialog, dialogArgumentGetter(items))
            .then(dialogResult => action.action(items, dialogResult))
            .then(result => {
                whenSome(
                    result,
                    () => this._raiseOnSuccess(action.getSuccessMessage(items), onlyFiles),
                    info => this._onFileProviderError(info, items)
                );
            },
            info => this._onFileProviderError(info, items));
    }

    _onFileProviderError(errorInfo, fileItems) {
        const fileItem = fileItems[errorInfo.index];
        this._raiseOnError(errorInfo.errorId, fileItem);
    }

    _tryUpload(destinationFolder) {
        this._uploadFolder = destinationFolder && destinationFolder[0] || this._model.getCurrentFolder();
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
                provider: null,
                getFolders: null,
                getCurrentFolder: null,
                getMultipleSelectedItems: null
            },
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
            case "onSuccess":
            case "onError":
            case "onCreating":
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    _raiseOnSuccess(message, updatedOnlyFiles) {
        this._actions.onSuccess({ message, updatedOnlyFiles });
    }

    _raiseOnError(errorId, fileItem) {
        const fileItemName = fileItem ? fileItem.name : null;
        const message = FileManagerMessages.get(errorId, fileItemName);
        this._actions.onError({ message });
    }

}

module.exports = FileManagerEditingControl;
