import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import { extend } from "../../core/utils/extend";
import { Deferred, when } from "../../core/utils/deferred";
import typeUtils from "../../core/utils/type";

import registerComponent from "../../core/component_registrator";
import Widget from "../widget/ui.widget";
import notify from "../notify";

import whenSome from "./ui.file_manager.common";
import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";
import FileManagerDetailsItemList from "./ui.file_manager.item_list.details";
import FileManagerThumbnailsItemList from "./ui.file_manager.item_list.thumbnails";
import FileManagerToolbar from "./ui.file_manager.toolbar";
import FileManagerNameEditorDialog from "./ui.file_manager.dialog.name_editor";
import FileManagerFolderChooserDialog from "./ui.file_manager.dialog.folder_chooser";
import FileManagerFileUploader from "./ui.file_manager.file_uploader";

import { FileProvider } from "../../file_provider/file_provider";
import ArrayFileProvider from "../../file_provider/file_provider.array";
import AjaxFileProvider from "../../file_provider/file_provider.ajax";
import OneDriveFileProvider from "../../file_provider/file_provider.onedrive";
import WebAPIFileProvider from "../../file_provider/file_provider.webapi";

const FILE_MANAGER_CLASS = "dx-filemanager";
const FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-container";
const FILE_MANAGER_DIRS_TREE_CLASS = FILE_MANAGER_CLASS + "-dirs-tree";
const FILE_MANAGER_VIEW_SEPARATOR_CLASS = FILE_MANAGER_CLASS + "-view-separator";
const FILE_MANAGER_TOOLBAR_CLASS = FILE_MANAGER_CLASS + "-toolbar";
const FILE_MANAGER_INACTIVE_AREA_CLASS = FILE_MANAGER_CLASS + "-inactive-area";

var FileManager = Widget.inherit({

    _init: function() {
        this._commands = {
            rename: this._tryRename,
            create: this._tryCreate,
            delete: this._tryDelete,
            move: this._tryMove,
            copy: this._tryCopy,
            upload: this._tryUpload,
            thumbnails: () => this._switchView("thumbnails"),
            details: () => this._switchView("details")
        };

        this.callBase();
    },

    _initTemplates: function() {
    },

    _initMarkup: function() {
        this.callBase();

        this._provider = this._getFileProvider();

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

        this._$viewContainer = this._createViewContainer();
        this.$element()
            .append(toolbar.$element())
            .append(this._$viewContainer)
            .append(this._renameItemDialog.$element())
            .append(this._createFolderDialog.$element())
            .append(this._chooseFolderDialog.$element())
            .append(this._fileUploader.$element())
            .addClass(FILE_MANAGER_CLASS);

        this._setItemsViewAreaActive(false);
    },

    _createFileUploader: function() {
        var that = this;
        return this._createComponent($("<div>"), FileManagerFileUploader, {
            onGetController: this._getFileUploaderController.bind(this),
            onFilesUploaded: function(result) {
                that._showSuccess("Files uploaded");
                that._loadItemListData();
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

        this._createItemList();
        $container.append(this._itemList.$element());

        return $container;
    },

    _createFilesTreeView: function() {
        this._filesTreeView = this._createComponent($("<div>"), FileManagerFilesTreeView, {
            provider: this._provider,
            onCurrentFolderChanged: this._onFilesTreeViewCurrentFolderChanged.bind(this),
            onClick: () => this._setItemsViewAreaActive(false)
        });
        this._filesTreeView.$element().addClass(FILE_MANAGER_DIRS_TREE_CLASS);
    },

    _createItemList: function(viewMode) {
        var itemListOptions = this.option("itemList");
        var selectionOptions = this.option("selection");

        var options = {
            selectionMode: selectionOptions.mode,
            onGetItems: this._getItemListItems.bind(this),
            onError: this._showError.bind(this),
            getItemThumbnail: this._getItemThumbnail.bind(this)
        };

        viewMode = viewMode || itemListOptions.mode;
        var widgetClass = viewMode === "thumbnails" ? FileManagerThumbnailsItemList : FileManagerDetailsItemList;
        this._itemList = this._createComponent($("<div>"), widgetClass, options);

        eventsEngine.on(this._itemList.$element(), "click", this._onItemListClick.bind(this));
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
        this._loadItemListData();
    },

    _onToolbarItemClick: function(buttonName) {
        this.executeCommand(buttonName);
    },

    _setItemsViewAreaActive: function(active) {
        if(this._itemsViewAreaActive === active) return;

        this._itemsViewAreaActive = active;

        var $activeArea = null;
        var $inactiveArea = null;
        if(active) {
            $activeArea = this._itemList.$element();
            $inactiveArea = this._filesTreeView.$element();
        } else {
            $activeArea = this._filesTreeView.$element();
            $inactiveArea = this._itemList.$element();
        }

        $activeArea.removeClass(FILE_MANAGER_INACTIVE_AREA_CLASS);
        $inactiveArea.addClass(FILE_MANAGER_INACTIVE_AREA_CLASS);
    },

    _switchView: function(viewMode) {
        this._itemList.dispose();
        this._itemList.$element().remove();

        this._createItemList(viewMode);
        this._$viewContainer.append(this._itemList.$element());
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
        this._setItemsViewAreaActive(false);

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

    _loadItemListData: function() {
        this._itemList.refreshData();
    },

    _refreshData: function() {
        if(this._itemsViewAreaActive) {
            this._loadItemListData();
        } else {
            this._filesTreeView.refreshData();
        }
    },

    _getItemListItems: function() {
        return this._provider.getFiles(this.getCurrentFolderPath());
    },

    _onItemListClick: function() {
        this._setItemsViewAreaActive(true);
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

    _getItemThumbnail: function(item) {
        var func = this.option("customThumbnail");
        return typeUtils.isFunction(func) ? func(item) : item.thumbnailUrl;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxFileManagerOptions.fileSystemStore
            * @type object
            * @default null
            */
            fileSystemStore: null,

            /**
            * @name dxFileManagerOptions.selection
            * @type object
            * @default {}
            */
            selection: {
                mode: "single"
            },

            /**
            * @name dxFileManagerOptions.itemList
            * @type object
            * @default null
            */
            itemList: {
                mode: "details"
            },

            /**
            * @name dxTreeViewOptions.customThumbnail
            * @type function
            * @type_function_param1 item:dxFileManagerItem
            * @type_function_return string
            */
            customThumbnail: null
        });
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "fileSystemStore":
                this.repaint();
                break;
            case "customThumbnail":
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
        return this._itemList.getSelectedItems();
    }

});

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
