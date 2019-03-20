import eventsEngine from "../../events/core/events_engine";
import { Deferred, when } from "../../core/utils/deferred";

import Widget from "../widget/ui.widget";
import { extend } from "../../core/utils/extend";
import TreeViewSearch from "../tree_view/ui.tree_view.search";

import { FileManagerItem } from "../../file_provider/file_provider";

const PATH_SEPARATOR = "/";

var FileManagerFilesTreeView = Widget.inherit({

    _initMarkup: function() {
        this._initCurrentPathState();

        this._filesTreeView = this._createComponent(this.$element(), TreeViewSearch, {
            dataStructure: "plain",
            rootValue: "",
            keyExpr: "relativeName",
            parentIdExpr: "parentPath",
            displayExpr: "name",
            createChildren: this._onFilesTreeViewCreateChildren.bind(this),
            onItemClick: this._onFilesTreeViewItemClick.bind(this),
            onItemExpanded: this._onFilesTreeViewItemExpanded.bind(this)
        });
        eventsEngine.on(this._filesTreeView.$element(), "click", this._raiseClick.bind(this));
    },

    _onFilesTreeViewCreateChildren: function(parent) {
        var parentItem = parent ? parent.itemData : null;
        var itemsGetter = this.option("getItems");
        var itemsResult = itemsGetter(parentItem);
        return when(itemsResult).done(items => this._applyIconsToItems(items));
    },

    _onFilesTreeViewItemClick: function(e) {
        this._changeCurrentFolder(e.itemData);
    },

    _changeCurrentFolder: function(folder) {
        var newPath = folder.relativeName;
        if(newPath !== this._currentPath) {
            this._currentPath = newPath;
            this._currentFolder = folder;
            this._raiseCurrentFolderChanged();
        }
    },

    _applyIconsToItems: function(items) {
        for(let item of items) {
            item.icon = "folder";
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
        this._rootFolder = new FileManagerItem("", "");
        this._currentFolder = this._rootFolder;
        this._loadMap = {};
    },

    _ensurePathExpanded: function(path) {
        var result = new Deferred().resolve().promise();

        if(!path) return result;

        var currentPath = "";
        var parts = path.split(PATH_SEPARATOR);

        for(let part of parts) {

            if(currentPath) {
                currentPath += PATH_SEPARATOR;
            }

            currentPath += part;
            var getExpandFunc = p => (() => this._expandLoadedPath(p));
            result = result.then(getExpandFunc(currentPath));

        }

        return result;
    },

    _expandLoadedPath: function(path) {
        var node = this._filesTreeView._dataAdapter.getNodeByKey(path);
        if(!node.expanded) {
            var deferred = this._loadMap[path];
            if(!deferred) {
                deferred = new Deferred();
                this._loadMap[path] = deferred;
                this._filesTreeView.expandItem(path);
            }
            return deferred.promise();
        } else {
            return new Deferred().resolve().promise();
        }
    },

    _onFilesTreeViewItemExpanded: function(e) {
        var path = e.itemData ? e.itemData.relativeName : "";
        var deferred = this._loadMap[path];
        if(deferred) {
            this._loadMap[path] = null;
            deferred.resolve();
        }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            getItems: null,
            onCurrentFolderChanged: null,
            onClick: null
        });
    },

    refreshData: function() {
        this._filesTreeView.option("dataSource", []);

        var currentFolderChanged = this.getCurrentPath() !== "";

        this._initCurrentPathState();

        if(currentFolderChanged) {
            this._raiseCurrentFolderChanged();
        }
    },

    setCurrentPath: function(path) {
        this._ensurePathExpanded(path)
            .then(() => this._setCurrentLoadedPath(path));
    },

    _setCurrentLoadedPath: function(path) {
        var $node = null;
        var folder = this._rootFolder;

        if(path) {
            var node = this._filesTreeView._dataAdapter.getNodeByKey(path);
            $node = this._filesTreeView._getNodeElement(node);
            folder = node.internalFields.item;
        }

        this._filesTreeView.option("focusedElement", $node);
        this._changeCurrentFolder(folder);
    },

    getCurrentPath: function() {
        return this._currentPath;
    },

    getCurrentFolder: function() {
        return this._currentFolder;
    }

});

module.exports = FileManagerFilesTreeView;
