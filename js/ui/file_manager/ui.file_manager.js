import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";

import DataGrid from "../data_grid/ui.data_grid";
import TreeViewSearch from "../tree_view/ui.tree_view.search";

const FIE_MANAGER_CLASS = "dx-filemanager";
const FIE_MANAGER_DIRS_TREE_CLASS = FIE_MANAGER_CLASS + "-dirs-tree";

var FileManager = Widget.inherit({

    _initTemplates: function() {
    },

    _initMarkup: function() {
        this.callBase();

        this.$element().addClass(FIE_MANAGER_CLASS);

        this._filesTreeView = this._createComponent($("<div>"), TreeViewSearch, {
            items: this.generateFakeFoldersData()
        });
        this._filesTreeView.$element().addClass(FIE_MANAGER_DIRS_TREE_CLASS);
        this.$element().append(this._filesTreeView.$element());

        this._filesView = this._createComponent($("<div>"), DataGrid, {
            columns: [ "FileName" ],
            dataSource: this.generateFakeFilesData()
        });
        this.$element().append(this._filesView.$element());
    },

    generateFakeFoldersData: function() {
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
    generateFakeFilesData: function() {
        return [
            { FileName: "FileName 1.cs" },
            { FileName: "FileName 2.cs" },
            { FileName: "FileName 3.cs" }
        ];
    }

});

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
