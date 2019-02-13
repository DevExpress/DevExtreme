import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";

import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";
import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";
import FileManagerToolbar from "./ui.file_manager.toolbar";
import FileManagerNameEditorDialog from "./ui.file_manager.dialog.name_editor";
import FileManagerFolderChooserDialog from "./ui.file_manager.dialog.folder_chooser";
import notify from "../notify";

import DataFileProvider from "./ui.file_manager.file_provider.data";
import OneDriveFileProvider from "./ui.file_manager.file_provider.onedrive";
import WebAPIFileProvider from "./ui.file_manager.file_provider.webapi";
import { Deferred } from "../../core/utils/deferred";

const FILE_MANAGER_CLASS = "dx-filemanager";
const FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-container";
const FILE_MANAGER_DIRS_TREE_CLASS = FILE_MANAGER_CLASS + "-dirs-tree";
const FILE_MANAGER_VIEW_SEPARATOR_CLASS = FILE_MANAGER_CLASS + "-view-separator";
const FILE_MANAGER_FILES_VIEW_CLASS = FILE_MANAGER_CLASS + "-files-view";
const FILE_MANAGER_TOOLBAR_CLASS = FILE_MANAGER_CLASS + "-toolbar";

var FileManager = Widget.inherit({

    _initTemplates: function() {
    },

    _initMarkup: function() {
        this.callBase();

        this._provider = this._createFileProvider();
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

        var $viewContainer = this._createViewContainer();
        this.$element()
            .append(toolbar.$element())
            .append($viewContainer)
            .append(this._renameItemDialog.$element())
            .append(this._createFolderDialog.$element())
            .append(this._chooseFolderDialog.$element())
            .addClass(FILE_MANAGER_CLASS);
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
        this._filesView.$element().on("click", function() { this._itemsViewAreaActive = true; }.bind(this));
    },

    _createEnterNameDialog: function(title, buttonText) {
        return this._createComponent($("<div>"), FileManagerNameEditorDialog, {
            title: title,
            buttonText: buttonText,
            onClosed: this._onDialogClosed.bind(this)
        });
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

        var that = this;
        this._showDialog(this._renameItemDialog, item.name)
            .then(result => { return that._provider.renameItem(item, result.name); })
            .then(() => {
                that._showSuccess("Item renamed");
                that._refreshData();
            },
            error => { if(error) that._showError(error); });
    },

    _tryCreate: function() {
        var item = this.getCurrentFolder();
        this._itemsViewAreaActive = false;

        var that = this;
        this._showDialog(this._createFolderDialog)
            .then(result => { return that._provider.createFolder(item, result.name); })
            .then(() => {
                that._showSuccess("Folder created");
                that._refreshData();
            },
            error => { if(error) that._showError(error); });
    },

    _tryDelete: function() {
        var items = this._getMultipleSelectedItems();

        if(items.length === 0) return;

        var that = this;

        new Deferred().resolve().promise() // TODO show confirm-like dialog here
            .then(() => { return that._provider.deleteItems(items); })
            .then(() => {
                that._showSuccess("Items deleted");
                that._refreshData();
            },
            error => { if(error) that._showError(error); });
    },

    _tryMove: function() {
        var items = this._getMultipleSelectedItems();

        if(items.length === 0) return;

        var that = this;
        this._showDialog(this._chooseFolderDialog)
            .then(result => { return that._provider.moveItems(items, result.folder); })
            .then(() => {
                that._showSuccess("Items moved");
                that._refreshData();
            },
            error => { if(error) that._showError(error); });
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
        this._showNotification(error, false);
    },

    _showNotification: function(message, isSuccess) {
        notify({
            message: message,
            width: 450
        }, isSuccess ? "success" : "error", 2000);
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

    _createFileProvider: function() {
        var fileSystemType = this.option("fileSystemType");
        switch(fileSystemType) {
            case "webapi":
                return new WebAPIFileProvider(this.option("webAPI"));
            case "onedrive":
                return new OneDriveFileProvider(this.option("oneDrive"));
            case "data":
            default:
                return new DataFileProvider(this.option("jsonData"));
        }
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
            * @name dxFileManagerOptions.fileSystemType
            * @type string
            * @default 'data'
            */
            fileSystemType: "data",

            /**
            * @name dxFileManagerOptions.jsonData
            * @type object
            * @default null
            */
            jsonData: null,

            /**
            * @name dxFileManagerOptions.oneDrive
            * @type object
            * @default {}
            */
            oneDrive: {
                getAccessTokenUrl: ""
            },

            /**
            * @name dxFileManagerOptions.webAPI
            * @type object
            * @default {}
            */
            webAPI: {
                loadUrl: "",
                createFolderUrl: "",
                renameUrl: "",
                deleteUrl: "",
                moveUrl: "",
                copyUrl: "",
                downloadUrl: "",
                uploadUrl: ""
            }
        });
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "fileSystemType":
            case "jsonData":
            case "oneDrive":
                this.repaint();
                break;
            default:
                this.callBase(args);
        }
    },

    executeCommand: function(commandName) {
        switch(commandName) {
            case "rename":
                this._tryRename();
                break;
            case "create":
                this._tryCreate();
                break;
            case "delete":
                this._tryDelete();
                break;
            case "move":
                this._tryMove();
                break;
        }
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
