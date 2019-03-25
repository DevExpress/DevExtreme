import eventsEngine from "../../events/core/events_engine";
import { Deferred, when } from "../../core/utils/deferred";
import { each } from "../../core/utils/iterator";

import Widget from "../widget/ui.widget";
import { extend } from "../../core/utils/extend";
import TreeViewSearch from "../tree_view/ui.tree_view.search";

import { FileManagerItem } from "../../file_provider/file_provider";

const PATH_SEPARATOR = "/";

class FileManagerFilesTreeView extends Widget {

    _initMarkup() {
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
    }

    _onFilesTreeViewCreateChildren(parent) {
        const parentItem = parent ? parent.itemData : null;
        const itemsGetter = this.option("getItems");
        const itemsResult = itemsGetter(parentItem);
        return when(itemsResult).done(items => this._applyIconsToItems(items));
    }

    _onFilesTreeViewItemClick(e) {
        this._changeCurrentFolder(e.itemData);
    }

    _changeCurrentFolder(folder) {
        const newPath = folder.relativeName;
        if(newPath !== this._currentPath) {
            this._currentPath = newPath;
            this._currentFolder = folder;
            this._raiseCurrentFolderChanged();
        }
    }

    _applyIconsToItems(items) {
        each(items, (_, item) => { item.icon = "folder"; });
    }

    _raiseCurrentFolderChanged() {
        this._raiseEvent("CurrentFolderChanged");
    }

    _raiseClick() {
        this._raiseEvent("Click");
    }

    _raiseEvent(eventName) {
        const handler = this.option("on" + eventName);
        if(handler) {
            handler();
        }
    }

    _initCurrentPathState() {
        this._currentPath = "";
        this._rootFolder = new FileManagerItem("", "");
        this._currentFolder = this._rootFolder;
        this._loadMap = {};
    }

    _ensurePathExpanded(path) {
        let result = new Deferred().resolve().promise();

        if(!path) {
            return result;
        }

        let currentPath = "";
        const parts = path.split(PATH_SEPARATOR);

        each(parts, (_, part) => {

            if(currentPath) {
                currentPath += PATH_SEPARATOR;
            }

            currentPath += part;
            const getExpandFunc = p => (() => this._expandLoadedPath(p));
            result = result.then(getExpandFunc(currentPath));

        });

        return result;
    }

    _expandLoadedPath(path) {
        const node = this._filesTreeView._dataAdapter.getNodeByKey(path);
        if(!node.expanded) {
            let deferred = this._loadMap[path];
            if(!deferred) {
                deferred = new Deferred();
                this._loadMap[path] = deferred;
                this._filesTreeView.expandItem(path);
            }
            return deferred.promise();
        } else {
            return new Deferred().resolve().promise();
        }
    }

    _onFilesTreeViewItemExpanded(e) {
        const path = e.itemData ? e.itemData.relativeName : "";
        const deferred = this._loadMap[path];
        if(deferred) {
            this._loadMap[path] = null;
            deferred.resolve();
        }
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            getItems: null,
            onCurrentFolderChanged: null,
            onClick: null
        });
    }

    refreshData() {
        this._filesTreeView.option("dataSource", []);

        const currentFolderChanged = this.getCurrentPath() !== "";

        this._initCurrentPathState();

        if(currentFolderChanged) {
            this._raiseCurrentFolderChanged();
        }
    }

    setCurrentPath(path) {
        this._ensurePathExpanded(path)
            .then(() => this._setCurrentLoadedPath(path));
    }

    _setCurrentLoadedPath(path) {
        let $node = null;
        let folder = this._rootFolder;

        if(path) {
            const node = this._filesTreeView._dataAdapter.getNodeByKey(path);
            $node = this._filesTreeView._getNodeElement(node);
            folder = node.internalFields.item;
        }

        this._filesTreeView.option("focusedElement", $node);
        this._changeCurrentFolder(folder);
    }

    getCurrentPath() {
        return this._currentPath;
    }

    getCurrentFolder() {
        return this._currentFolder;
    }

}

module.exports = FileManagerFilesTreeView;
