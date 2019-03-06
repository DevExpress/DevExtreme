import eventsEngine from "../../events/core/events_engine";

import Widget from "../widget/ui.widget";
import { extend } from "../../core/utils/extend";
import TreeViewSearch from "../tree_view/ui.tree_view.search";

import { FileManagerItem } from "../../file_provider/file_provider";

var FileManagerFilesTreeView = Widget.inherit({

    _initMarkup: function() {
        this._initCurrentPathState();
        this._provider = this.option("provider");

        this._filesTreeView = this._createComponent(this.$element(), TreeViewSearch, {
            dataStructure: "plain",
            rootValue: "",
            keyExpr: "relativeName",
            parentIdExpr: "parentPath",
            displayExpr: "name",
            createChildren: this._onFilesTreeViewCreateChildren.bind(this),
            onItemClick: this._onFilesTreeViewItemClick.bind(this)
        });
        eventsEngine.on(this._filesTreeView.$element(), "click", this._raiseClick.bind(this));
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
            this._raiseCurrentFolderChanged();
        }
    },

    _raiseCurrentFolderChanged: function() {
        this._raiseEvent("CurrentFolderChanged");
    },

    _raiseClick: function() {
        this._raiseEvent("Click");
    },

    _raiseEvent: function(eventName) {
        var handler = this.option("on" + eventName);
        if(handler) handler();
    },

    _initCurrentPathState: function() {
        this._currentPath = "";
        this._currentFolder = new FileManagerItem("", "");
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            provider: null,
            onCurrentFolderChanged: null,
            onClick: null
        });
    },

    refreshData: function() {
        this._filesTreeView.option("dataSource", []);
        var currentFolderChanged = this.getCurrentPath() !== "";
        this._initCurrentPathState();
        if(currentFolderChanged) this._raiseCurrentFolderChanged();
    },

    getCurrentPath: function() {
        return this._currentPath;
    },

    getCurrentFolder: function() {
        return this._currentFolder;
    }

});

module.exports = FileManagerFilesTreeView;
