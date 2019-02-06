import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";

import DataGrid from "../data_grid/ui.data_grid";
import CustomStore from "../../data/custom_store";
import TreeViewSearch from "../tree_view/ui.tree_view.search";

import DataFileProvider from "./ui.file_manager.file_provider.data";
import OneDriveFileProvider from "./ui.file_manager.file_provider.onedrive";

const FIE_MANAGER_CLASS = "dx-filemanager";
const FIE_MANAGER_CONTAINER_CLASS = FIE_MANAGER_CLASS + "-container";
const FIE_MANAGER_DIRS_TREE_CLASS = FIE_MANAGER_CLASS + "-dirs-tree";
const FIE_MANAGER_VIEW_SEPARATOR_CLASS = FIE_MANAGER_CLASS + "-view-separator";

var FileManager = Widget.inherit({

    _init: function() {
        this.callBase();

        // this._providerType = "data";
        this._providerType = "onedrive";
        this._provider = this._createFileProvider();
        this._currentPath = "";
    },

    _initTemplates: function() {
    },

    _initMarkup: function() {
        this.callBase();

        var $viewContainer = this._createViewContainer();
        this.$element()
            .append($viewContainer)
            .addClass(FIE_MANAGER_CLASS);
    },

    _createViewContainer: function() {
        var $container = $("<div>");
        $container.addClass(FIE_MANAGER_CONTAINER_CLASS);

        this._filesTreeView = this._createComponent($("<div>"), TreeViewSearch, {
            dataStructure: "plain",
            rootValue: "",
            keyExpr: "relativeName",
            parentIdExpr: "parentPath",
            displayExpr: "name",
            createChildren: this._onFilesTreeViewCreateChildren.bind(this),
            onItemClick: this._onFilesTreeViewItemClick.bind(this)
        });
        this._filesTreeView.$element().addClass(FIE_MANAGER_DIRS_TREE_CLASS);
        $container.append(this._filesTreeView.$element());

        var $viewSeparator = $("<div>");
        $viewSeparator.addClass(FIE_MANAGER_VIEW_SEPARATOR_CLASS);
        $container.append($viewSeparator);

        this._filesView = this._createComponent($("<div>"), DataGrid, {
            hoverStateEnabled: true,
            selection: {
                mode: "single"
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
        $container.append(this._filesView.$element());

        return $container;
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
        switch(this._providerType) {
            case "onedrive":
                return new OneDriveFileProvider();
            case "data":
                return new DataFileProvider(this._generateFakeItemData());
        }
        return new OneDriveFileProvider();
    },

    _generateFakeItemData: function() {
        return [
            {
                name: "Folder 1",
                isFolder: true,
                children: [
                    {
                        name: "Folder 1.1",
                        isFolder: true
                    },
                    {
                        name: "Folder 1.2",
                        isFolder: true
                    },
                    {
                        name: "File 1-1.txt",
                        isFolder: false
                    },
                    {
                        name: "File 1-2.jpg",
                        isFolder: false
                    } ]
            },
            {
                name: "Folder 2",
                isFolder: true
            },
            {
                name: "Folder 3",
                isFolder: true
            },
            {
                name: "File 1.txt",
                isFolder: false
            },
            {
                name: "File 2.jpg",
                isFolder: false
            },
            {
                name: "File 3.xml",
                isFolder: false
            }
        ];
    }

});

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
