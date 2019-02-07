import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";

import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";
import TreeViewSearch from "../tree_view/ui.tree_view.search";
import FileManagerToolbar from "./ui.file_manager.toolbar";

import DataFileProvider from "./ui.file_manager.file_provider.data";
import OneDriveFileProvider from "./ui.file_manager.file_provider.onedrive";

const FILE_MANAGER_CLASS = "dx-filemanager";
const FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-container";
const FILE_MANAGER_DIRS_TREE_CLASS = FILE_MANAGER_CLASS + "-dirs-tree";
const FILE_MANAGER_VIEW_SEPARATOR_CLASS = FILE_MANAGER_CLASS + "-view-separator";
const FILE_MANAGER_FILES_VIEW_CLASS = FILE_MANAGER_CLASS + "-files-view";
const FILE_MANAGER_TOOLBAR_CLASS = FILE_MANAGER_CLASS + "-toolbar";

var FileManager = Widget.inherit({

    _init: function() {
        this.callBase();
    },

    _initTemplates: function() {
    },

    _initMarkup: function() {
        this.callBase();

        this._currentPath = "";
        this._provider = this._createFileProvider();

        var toolbar = this._createComponent($("<div>"), FileManagerToolbar, { });
        toolbar.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS);

        var $viewContainer = this._createViewContainer();
        this.$element()
            .append(toolbar.$element())
            .append($viewContainer)
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
    },

    _onFilesTreeViewCreateChildren: function(parent) {
        var path = parent ? parent.itemData.relativeName : "";
        return this._provider.getFolders(path);
    },

    _onFilesTreeViewItemClick: function(e) {
        var newPath = e.itemData.relativeName;
        if(newPath !== this._currentPath) {
            this._currentPath = newPath;
            this._loadFilesToFilesView();
        }
    },

    _loadFilesToFilesView: function() {
        this._filesView.option("dataSource", {
            "store": this._createFilesViewStore()
        });
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
            case "onedrive":
                return new OneDriveFileProvider(this.option("oneDrive"));
            case "data":
            default:
                return new DataFileProvider(this.option("jsonData"));
        }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
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
                * @default null
                */
            oneDrive: null
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


    getCurrentFolderPath: function() {
        return this._currentPath;
    },

    getSelectedItems: function() {
        return this._filesView.getSelectedRowsData();
    }

});

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
