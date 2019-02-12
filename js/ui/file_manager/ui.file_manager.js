import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";

import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";
import TreeViewSearch from "../tree_view/ui.tree_view.search";
import FileManagerToolbar from "./ui.file_manager.toolbar";
import FileManagerEnterNameDialog from "./ui.file_manager.dialogs";
import notify from "../notify";

import FileManagerItem from "./ui.file_manager.items";
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

        this._currentPath = "";
        this._currentFolder = new FileManagerItem("", "");
        this._provider = this._createFileProvider();
        this._itemsViewAreaActive = false;

        var toolbar = this._createComponent($("<div>"), FileManagerToolbar, {
            "onItemClick": this._onToolbarItemClick.bind(this)
        });
        toolbar.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS);

        this._renameItemDialog = this._createEnterNameDialog("Rename", "Save");
        this._createFolderDialog = this._createEnterNameDialog("Folder", "Create");

        var $viewContainer = this._createViewContainer();
        this.$element()
            .append(toolbar.$element())
            .append($viewContainer)
            .append(this._renameItemDialog.$element())
            .append(this._createFolderDialog.$element())
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
        this._filesTreeView = this._createComponent($("<div>"), TreeViewSearch, {
            dataStructure: "plain",
            rootValue: "",
            keyExpr: "relativeName",
            parentIdExpr: "parentPath",
            displayExpr: "name",
            createChildren: this._onFilesTreeViewCreateChildren.bind(this),
            onItemClick: this._onFilesTreeViewItemClick.bind(this)
        });
        this._filesTreeView.$element().addClass(FILE_MANAGER_DIRS_TREE_CLASS);
        this._filesTreeView.$element().on("click", function() { this._itemsViewAreaActive = false; }.bind(this));
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
        return this._createComponent($("<div>"), FileManagerEnterNameDialog, {
            title: title,
            buttonText: buttonText,
            onClosed: this._onDialogClosed.bind(this)
        });
    },

    _onFilesTreeViewCreateChildren: function(parent) {
        var path = parent ? parent.itemData.relativeName : "";
        return this._provider.getFolders(path);
    },

    _onFilesTreeViewItemClick: function(e) {
        var newPath = e.itemData.relativeName;
        if(newPath !== this._currentPath) {
            this._currentPath = newPath;
            this._currentFolder = e.itemData;
            this._loadFilesToFilesView();
        }
    },

    _onToolbarItemClick: function(buttonName) {
        this.executeCommand(buttonName);
    },

    _tryRename: function() {
        var item = null;

        if(this._itemsViewAreaActive) {
            var items = this.getSelectedItems();
            if(items.length === 1) item = items[0];
        } else {
            item = this._currentFolder;
        }

        if(!item) return;

        var that = this;
        this._getNewName(item.name)
            .then(result => { return that._provider.renameItem(item, result.name); })
            .then(() => {
                that._showSuccess("Item renamed");
                if(that._itemsViewAreaActive) {
                    that._loadFilesToFilesView();
                } else {
                    that._updateFilesTreeView();
                }

            },
            error => { if(error) that._showError(error); });
    },

    _tryCreate: function() {
        var item = this._currentFolder;

        var that = this;
        this._getNewName()
            .then(result => { return that._provider.createFolder(item, result.name); })
            .then(() => {
                that._showSuccess("Folder created");
                that._updateFilesTreeView();
                that._itemsViewAreaActive = false;
            },
            error => { if(error) that._showError(error); });
    },

    _getNewName: function(oldName) {
        this._dialogDeferred = new Deferred();
        var dialog = oldName ? this._renameItemDialog : this._createFolderDialog;
        dialog.show(oldName);
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

    _updateFilesTreeView: function() {
        this._filesTreeView.option("dataSource", []);
    },

    _createFilesViewStore: function() {
        return new CustomStore({
            load: function(loadOptions) {
                return this._provider.getFiles(this._currentPath);
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
                createUrl: "",
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
        }
    },

    getCurrentFolderPath: function() {
        return this._currentPath;
    },

    getSelectedItems: function() {
        return this._filesView.getSelectedRowsData();
    }

});

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
