import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import { Deferred, when } from "../../core/utils/deferred";

import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";
import whenSome from "./ui.file_manager.common";
import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";
import FileManagerToolbar from "./ui.file_manager.toolbar";
import FileManagerNameEditorDialog from "./ui.file_manager.dialog.name_editor";
import FileManagerFolderChooserDialog from "./ui.file_manager.dialog.folder_chooser";
import FileManagerFileUploader from "./ui.file_manager.file_uploader";
import notify from "../notify";

import { FileProvider } from "../../file_provider/file_provider";
import ArrayFileProvider from "../../file_provider/file_provider.array";
import AjaxFileProvider from "../../file_provider/file_provider.ajax";
import OneDriveFileProvider from "../../file_provider/file_provider.onedrive";
import WebAPIFileProvider from "../../file_provider/file_provider.webapi";

const FILE_MANAGER_CLASS = "dx-filemanager";
const FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-container";
const FILE_MANAGER_DIRS_TREE_CLASS = FILE_MANAGER_CLASS + "-dirs-tree";
const FILE_MANAGER_VIEW_SEPARATOR_CLASS = FILE_MANAGER_CLASS + "-view-separator";
const FILE_MANAGER_FILES_VIEW_CLASS = FILE_MANAGER_CLASS + "-files-view";
const FILE_MANAGER_TOOLBAR_CLASS = FILE_MANAGER_CLASS + "-toolbar";

var FileManager = Widget.inherit({

    _init: function() {
        this._commands = {
            rename: this._tryRename,
            create: this._tryCreate,
            delete: this._tryDelete,
            move: this._tryMove,
            copy: this._tryCopy,
            upload: this._tryUpload
        };

        this.callBase();
    },

    _initTemplates: function() {
    },

    _initMarkup: function() {
        this.callBase();

        this._provider = this._getFileProvider();
        this._itemsViewAreaActive = false;

        var toolbar = this._createComponent($("<div>"), FileManagerToolbar, {
            "onItemClick": this._onToolbarItemClick.bind(this)
        });
        toolbar.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS);

        this._renameItemDialog = this._createEnterNameDialog("Rename", "Save");
        this._createFolderDialog = this._createEnterNameDialog("Folder", "Create");
        this._chooseFolderDialog = this._createComponent($("<div>"), FileManagerFolderChooserDialog, {
            provider: this._provider,
            onClosed: this._onDialogClosed.bind(this)
        });
        this._confirmationDialog = this._createConfirmationDialog();

        this._fileUploader = this._createFileUploader();

        var $viewContainer = this._createViewContainer();
        this.$element()
            .append(toolbar.$element())
            .append($viewContainer)
            .append(this._renameItemDialog.$element())
            .append(this._createFolderDialog.$element())
            .append(this._chooseFolderDialog.$element())
            .append(this._fileUploader.$element())
            .addClass(FILE_MANAGER_CLASS);
    },

    _createFileUploader: function() {
        var that = this;
        return this._createComponent($("<div>"), FileManagerFileUploader, {
            onGetController: this._getFileUploaderController.bind(this),
            onFilesUploaded: function(result) {
                that._showSuccess("Files uploaded");
                that._loadFilesToFilesView();
            },
            onErrorOccurred: function(e) {
                var errorText = that._getErrorText(e.error);
                var message = `Upload failed for the '${e.fileName}' file: ${errorText}`;
                that._showError(message);
            }
        });
    },

    _getFileUploaderController: function() {
        var destinationFolder = this.getCurrentFolder();
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

    _createViewContainer: function() {
        var $container = $("<div>");
        $container.addClass(FILE_MANAGER_CONTAINER_CLASS);

        this._createFilesTreeView();
        $container.append(this._filesTreeView.$element());

        var $viewSeparator = $("<div>");
        $viewSeparator.addClass(FILE_MANAGER_VIEW_SEPARATOR_CLASS);
        $container.append($viewSeparator);

        this._createFilesView();
        $container.append(this._filesView.$element());

        return $container;
    },

    _createFilesTreeView: function() {
        this._filesTreeView = this._createComponent($("<div>"), FileManagerFilesTreeView, {
            provider: this._provider,
            onCurrentFolderChanged: this._onFilesTreeViewCurrentFolderChanged.bind(this),
            onClick: function() { this._itemsViewAreaActive = false; }.bind(this)
        });
        this._filesTreeView.$element().addClass(FILE_MANAGER_DIRS_TREE_CLASS);
    },

    _createFilesView: function() {
        var selectionOptions = this.option("selection");

        this._filesView = this._createComponent($("<div>"), DataGrid, {
            hoverStateEnabled: true,
            selection: {
                mode: selectionOptions.mode
            },
            allowColumnResizing: true,
            columns: [
                {
                    dataField: "name",
                    minWidth: 200,
                    width: "60%"
                },
                {
                    dataField: "lastWriteTime",
                    minWidth: 200,
                    width: "20%"
                },
                {
                    dataField: "length",
                    minWidth: 100,
                    width: "10%"
                }
            ]
        });
        this._loadFilesToFilesView();
        this._filesView.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);

        var onClickHandler = () => { this._itemsViewAreaActive = true; };
        eventsEngine.on(this._filesView.$element(), "click", onClickHandler.bind(this));
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

    _onFilesTreeViewCurrentFolderChanged: function(e) {
        this._loadFilesToFilesView();
    },

    _onToolbarItemClick: function(buttonName) {
        this.executeCommand(buttonName);
    },

    _tryRename: function() {
        var item = this._getSingleSelectedItem();

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
        var item = this.getCurrentFolder();
        this._itemsViewAreaActive = false;

        this._tryEditAction(
            this._createFolderDialog,
            result => this._provider.createFolder(item, result.name),
            "Folder created",
            info => `Create folder operation failed for the ${item.name} parent folder`
        );
    },

    _tryDelete: function() {
        var items = this._getMultipleSelectedItems();

        if(items.length === 0) return;

        this._tryEditAction(
            this._confirmationDialog,
            result => this._provider.deleteItems(items),
            "Items deleted",
            info => `Delete operation failed for the ${items[info.index].name} item`
        );
    },

    _tryMove: function() {
        var items = this._getMultipleSelectedItems();

        if(items.length === 0) return;

        this._tryEditAction(
            this._chooseFolderDialog,
            result => this._provider.moveItems(items, result.folder),
            "Items moved",
            info => `Move operation failed for the ${items[info.index].name} item`
        );
    },

    _tryCopy: function() {
        var items = this._getMultipleSelectedItems();

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
                    () => {
                        this._showSuccess(successMessage);
                        this._refreshData();
                    },
                    info => this._showError(errorMessageAction(info) + ": " + this._getErrorText(info.error)));
            });
    },

    _tryUpload: function() {
        this._fileUploader.tryUpload();
    },

    _getSingleSelectedItem: function() {
        if(this._itemsViewAreaActive) {
            var items = this.getSelectedItems();
            if(items.length === 1) return items[0];
        } else {
            return this.getCurrentFolder();
        }
        return null;
    },

    _getMultipleSelectedItems: function() {
        return this._itemsViewAreaActive ? this.getSelectedItems() : [ this.getCurrentFolder() ];
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

    _showSuccess: function(message) {
        this._showNotification(message, true);
    },

    _showError: function(error) {
        var message = this._getErrorText(error);
        this._showNotification(message, false);
    },

    _getErrorText: function(error) {
        var result = typeof error === "string" ? error : error.responseText;
        return result || "General error";
    },

    _showNotification: function(message, isSuccess) {
        notify({
            message: message,
            width: 450
        }, isSuccess ? "success" : "error", 5000);
    },

    _loadFilesToFilesView: function() {
        this._filesView.option("dataSource", {
            "store": this._createFilesViewStore()
        });
    },

    _refreshData: function() {
        if(this._itemsViewAreaActive) {
            this._loadFilesToFilesView();
        } else {
            this._filesTreeView.refreshData();
        }
    },

    _createFilesViewStore: function() {
        return new CustomStore({
            load: function(loadOptions) {
                return this._provider.getFiles(this.getCurrentFolderPath());
            }.bind(this)
        });
    },

    _getFileProvider: function() {
        var fileSystemStore = this.option("fileSystemStore");

        if(!fileSystemStore) {
            fileSystemStore = [];
        }

        if(Array.isArray(fileSystemStore)) {
            return new ArrayFileProvider(fileSystemStore);
        }

        if(typeof fileSystemStore === "string") {
            return new AjaxFileProvider({ url: fileSystemStore });
        }

        if(fileSystemStore instanceof FileProvider) {
            return fileSystemStore;
        }

        if(fileSystemStore.type) {
            switch(fileSystemStore.type) {
                case "webapi":
                    return new WebAPIFileProvider(fileSystemStore);
                case "onedrive":
                    return new OneDriveFileProvider(fileSystemStore);
            }
        }

        return new ArrayFileProvider([]);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxFileManagerOptions.selection
            * @type object
            * @default {}
            */
            selection: {
                mode: "single"
            },

            /**
            * @name dxFileManagerOptions.fileSystemStore
            * @type object
            * @default null
            */
            fileSystemStore: null
        });
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "fileSystemStore":
                this.repaint();
                break;
            default:
                this.callBase(args);
        }
    },

    executeCommand: function(commandName) {
        var action = this._commands[commandName];
        if(!action) throw "Incorrect command name.";
        action.call(this);
    },

    getCurrentFolderPath: function() {
        return this._filesTreeView.getCurrentPath();
    },

    getCurrentFolder: function() {
        return this._filesTreeView.getCurrentFolder();
    },

    getSelectedItems: function() {
        return this._filesView.getSelectedRowsData();
    }

});

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
