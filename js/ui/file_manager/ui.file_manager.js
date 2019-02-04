import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";

import DataGrid from "../data_grid/ui.data_grid";
import TreeViewSearch from "../tree_view/ui.tree_view.search";

import OneDriveFileProvider from "./ui.file_manager.file_provider.onedrive";

const FIE_MANAGER_CLASS = "dx-filemanager";
const FIE_MANAGER_CONTAINER_CLASS = FIE_MANAGER_CLASS + "-container";
const FIE_MANAGER_DIRS_TREE_CLASS = FIE_MANAGER_CLASS + "-dirs-tree";
const FIE_MANAGER_VIEW_SEPARATOR_CLASS = FIE_MANAGER_CLASS + "-view-separator";

var FileManager = Widget.inherit({

    _initTemplates: function() {
    },

    _initMarkup: function() {
        this.callBase();

        var $viewContainer = this._createViewContainer();
        this.$element()
            .append($viewContainer)
            .addClass(FIE_MANAGER_CLASS);

        this._getFolders();
    },

    _createViewContainer: function() {
        var $container = $("<div>");
        $container.addClass(FIE_MANAGER_CONTAINER_CLASS);

        this._filesTreeView = this._createComponent($("<div>"), TreeViewSearch, {
            items: this._generateFakeFoldersData()
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
            columns: [ "FileName" ],
            dataSource: this._generateFakeFilesData()
        });
        $container.append(this._filesView.$element());

        return $container;
    },
    _getFolders: function() {
        var provider = new OneDriveFileProvider();
        provider.getItems();
    },
    _generateFakeFoldersData: function() {
        return [
            {
                text: "Folder 1",
                items: [
                    { text: "Folder 1.1" },
                    { text: "Folder 1.2" } ] },
            { text: "Folder 2" },
            { text: "Folder 3" }
        ];
    },
    _generateFakeFilesData: function() {
        return [
            { FileName: "FileName 1.cs" },
            { FileName: "FileName 2.cs" },
            { FileName: "FileName 3.cs" }
        ];
    }

});

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
