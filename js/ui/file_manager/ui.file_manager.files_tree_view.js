import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import { Deferred, when } from "../../core/utils/deferred";
import { extend } from "../../core/utils/extend";
import { getImageContainer } from "../../core/utils/icon";
import { noop } from "../../core/utils/common";

import Widget from "../widget/ui.widget";
import TreeViewSearch from "../tree_view/ui.tree_view.search";

import { FileManagerItem } from "./file_provider/file_provider";
import whenSome from "./ui.file_manager.common";
import { getParentPath, getName } from "./ui.file_manager.utils";

import FileManagerFileActionsButton from "./ui.file_manager.file_actions_button";

const FILE_MANAGER_DIRS_TREE_CLASS = "dx-filemanager-dirs-tree";
const FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS = "dx-filemanager-focused-item";
const TREE_VIEW_ITEM_CLASS = "dx-treeview-item";

class FileManagerFilesTreeView extends Widget {

    _initMarkup() {
        this._initActions();
        this._setSelectedItem();

        this._createFileActionsButton = noop;

        this._model = new FilesTreeViewModel({
            rootItemText: this.option("rootFolderDisplayName"),
            initialDir: this.option("initialFolder"),
            getItems: this.option("getItems"),
            onSelectedItemLoaded: item => this._onModelSelectedItemLoaded(item)
        });

        const $treeView = $("<div>")
            .addClass(FILE_MANAGER_DIRS_TREE_CLASS)
            .appendTo(this.$element());

        const treeViewOptions = {
            dataStructure: "plain",
            rootValue: "",
            createChildren: this._onFilesTreeViewCreateChildren.bind(this),
            itemTemplate: this._createFilesTreeViewItemTemplate.bind(this),
            hasItemsExpr: "dataItem.hasSubDirs",
            onItemClick: this._onFilesTreeViewItemClick.bind(this),
            onItemExpanded: ({ itemData }) => this._model.changeItemExpandState(itemData, true),
            onItemCollapsed: ({ itemData }) => this._model.changeItemExpandState(itemData, false),
            onItemRendered: e => this._onFilesTreeViewItemRendered(e)
        };

        if(this._contextMenu) {
            this._contextMenu.option("onContextMenuHidden", () => this._onContextMenuHidden());
            treeViewOptions.onItemContextMenu = e => this._onFilesTreeViewItemContextMenu(e);
            this._createFileActionsButton = (element, options) => this._createComponent(element, FileManagerFileActionsButton, options);
        }

        this._filesTreeView = this._createComponent($treeView, TreeViewSearch, treeViewOptions);

        eventsEngine.on($treeView, "click", this._raiseClick.bind(this));
    }

    _onFilesTreeViewCreateChildren(parent) {
        return this._model.expandAndGetChildren(parent && parent.itemData);
    }

    _onFilesTreeViewItemClick({ itemElement, itemData }) {
        if(this._selectedItem && this._selectedItem.dataItem.equals(itemData.dataItem)) {
            return;
        }

        this._model.selectItem(itemData);
        this._changeSelectedItem(itemData, $(itemElement));
    }

    _onFilesTreeViewItemRendered({ itemElement, itemData }) {
        const focused = this._selectedItem && this._selectedItem.dataItem.equals(itemData.dataItem);
        if(focused) {
            this._updateFocusedElement($(itemElement));
        }
    }

    _createFilesTreeViewItemTemplate(itemData, itemIndex, itemElement) {
        const $itemElement = $(itemElement);
        const $itemWrapper = $itemElement.closest(this._filesTreeViewItemSelector);
        $itemWrapper.data("item", itemData);

        const $button = $("<div>");
        $itemElement.append(
            getImageContainer(itemData.icon),
            $("<span>").text(itemData.text),
            $button);

        this._createFileActionsButton($button, {
            onClick: e => this._onFileItemActionButtonClick(e)
        });
    }

    _onFilesTreeViewItemContextMenu({ itemElement, event }) {
        event.preventDefault();
        const itemData = $(itemElement).data("item");
        this._contextMenu.showAt([ itemData.dataItem ], itemElement, event);
    }

    _onFileItemActionButtonClick({ component, element, event }) {
        event.stopPropagation();
        const $item = component.$element().closest(this._filesTreeViewItemSelector);
        const item = $item.data("item");
        this._contextMenu.showAt([ item.dataItem ], element);
        this._activeFileActionsButton = component;
        this._activeFileActionsButton.setActive(true);
    }

    _onContextMenuHidden() {
        if(this._activeFileActionsButton) {
            this._activeFileActionsButton.setActive(false);
        }
    }

    _onModelSelectedItemLoaded(item) {
        if(this._filesTreeView) {
            this._handleModelSelectedItemLoaded(item);
        } else {
            setTimeout(() => this._handleModelSelectedItemLoaded(item));
        }
    }

    _handleModelSelectedItemLoaded(item) {
        const $element = this._getItemElement(item);
        this._changeSelectedItem(item, $element);
    }

    _changeSelectedItem(item, $element) {
        this._setSelectedItem(item, $element);
        this._raiseCurrentFolderChanged();
    }

    _setSelectedItem(item, $element) {
        this._selectedItem = item || null;
        this._updateFocusedElement($element);
    }

    _updateFocusedElement($element) {
        if(this._$focusedElement) {
            this._$focusedElement.toggleClass(FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS, false);
        }
        this._$focusedElement = $element || $();
        this._$focusedElement.toggleClass(FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS, true);
    }

    _getItemElement(item) {
        const node = this._filesTreeView._dataAdapter.getNodeByKey(item.id);
        if(node) {
            const $node = this._filesTreeView._getNodeElement(node);
            if($node) {
                return $node.children(this._filesTreeViewItemSelector);
            }
        }
        return null;
    }

    _raiseCurrentFolderChanged() {
        this._actions.onCurrentFolderChanged();
    }

    _raiseClick() {
        this._actions.onClick();
    }

    _initActions() {
        this._actions = {
            onCurrentFolderChanged: this._createActionByOption("onCurrentFolderChanged"),
            onClick: this._createActionByOption("onClick")
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            rootFolderDisplayName: "Files",
            initialFolder: null,
            contextMenu: null,
            getItems: null,
            onCurrentFolderChanged: null,
            onClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "getItems":
            case "rootFolderDisplayName":
            case "initialFolder":
            case "contextMenu":
                this.repaint();
                break;
            case "onCurrentFolderChanged":
            case "onClick":
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    get _filesTreeViewItemSelector() {
        return `.${TREE_VIEW_ITEM_CLASS}`;
    }

    get _contextMenu() {
        return this.option("contextMenu");
    }

    refreshData() {
        const oldPath = this.getCurrentFolderPath();

        this._setSelectedItem();

        this._model.refresh();
        this._filesTreeView.option("dataSource", []);

        const currentFolderChanged = this.getCurrentFolderPath() !== oldPath;

        if(currentFolderChanged) {
            this._raiseCurrentFolderChanged();
        }
    }

    setCurrentFolderPath(path) {
        if(path === this.getCurrentFolderPath()) {
            return;
        }

        const folder = new FileManagerItem(getParentPath(path), getName(path), true);
        const parentFolder = folder.getParent();
        const item = this._model.getItemByDataItem(folder);
        const parentItem = parentFolder ? this._model.getItemByDataItem(parentFolder) : null;

        this._model.selectItem(item);
        if(!parentItem || parentItem.childrenLoaded) {
            this._onModelSelectedItemLoaded(item);
        } else {
            this._model.expandAndGetChildren(parentItem).done(() => {
                parentItem.expanded = false;
                this._filesTreeView.expandItem(parentItem);
            });
        }
    }

    getCurrentFolderPath() {
        return this.getCurrentFolder() ? this.getCurrentFolder().relativeName : null;
    }

    getCurrentFolder() {
        return this._selectedItem ? this._selectedItem.dataItem : null;
    }

}

class FilesTreeViewModel {

    constructor(options) {
        this._options = options;

        this._expandedDataItems = { };

        this._selectedDataItem = null;

        this._initState();

        const initialDir = this._options.initialDir;
        if(initialDir) {
            this._selectedDataItem = initialDir;
            this._setTreeLineExpandState(initialDir);
        }
    }

    selectItem(item) {
        this._selectedDataItem = item.dataItem;
    }

    expandAndGetChildren(item) {
        if(!item) {
            this._onItemLoaded(this._rootItem);
            return new Deferred().resolve([ this._rootItem ]).promise();
        } else if(item.isRoot) {
            return this._expandAndGetChildrenForRootItem();
        } else {
            return this._expandAndGetChildrenForGeneralItem(item);
        }
    }

    refresh() {
        this._initState();
    }

    changeItemExpandState(item, expanded) {
        if(expanded) {
            this._expandedDataItems[item.dataKey] = item.dataItem;
        } else {
            delete this._expandedDataItems[item.dataKey];
        }

        item.expanded = expanded;
    }

    getItemByDataItem(dataItem, updateIfExists) {
        let result = this._itemMap[dataItem.relativeName];
        if(!result) {
            result = this._createItem(dataItem);
        } else if(updateIfExists) {
            result.dataItem = dataItem;
        }
        return result;
    }

    _expandAndGetChildrenForRootItem() {
        const dataItems = Object.keys(this._expandedDataItems)
            .filter(key => this._isVisibleAndExpandedItem(key))
            .map(key => this._expandedDataItems[key]);

        const deferreds = dataItems.map(dataItem => {
            const item = this.getItemByDataItem(dataItem);
            return this._expandAndGetChildrenForGeneralItem(item);
        });

        return whenSome(deferreds)
            .then(() => {
                this._ensureSelectedItemLoaded();
                return this._rootItem.children;
            });
    }

    _expandAndGetChildrenForGeneralItem(item) {
        if(item.expanded && item.childrenLoaded) {
            return new Deferred().resolve(item.children).promise();
        }

        let result = this._loadMap[item.id];
        if(result) {
            return result;
        }

        this.changeItemExpandState(item, true);

        if(item.isRoot) {
            result = new Deferred().resolve().promise();
        } else {
            const parentData = item.dataItem.getParent();
            const parentItem = this.getItemByDataItem(parentData);
            result = this._expandAndGetChildrenForGeneralItem(parentItem);
        }

        result = result.then(items => {
            if(!items || items.some(i => item.dataItem.equals(i.dataItem))) {
                return this._loadChildren(item);
            } else {
                this._onItemNotFound(item);
                return [];
            }
        });

        this._loadMap[item.id] = result;

        const deleteLoadAction = () => { delete this._loadMap[item.id]; };
        result.done(deleteLoadAction).fail(deleteLoadAction);

        return result;
    }

    _loadChildren(item) {
        const dataResult = this._options.getItems(item.dataItem);

        return when(dataResult)
            .then(dataItems => {
                item.children = [];
                dataItems.forEach(dataItem => {
                    const childItem = this.getItemByDataItem(dataItem, true);
                    item.children.push(childItem);
                    this._onItemLoaded(childItem);
                });
                item.childrenLoaded = true;
                return item.children;
            });
    }

    _isVisibleAndExpandedItem(dataKey) {
        const dataItem = this._expandedDataItems[dataKey];
        if(!dataItem) {
            return false;
        } else if(dataItem.isRoot()) {
            return true;
        }

        const parentKey = getParentPath(dataItem.relativeName);
        return this._isVisibleAndExpandedItem(parentKey);
    }

    _setTreeLineExpandState(dataItem) {
        const item = this.getItemByDataItem(dataItem);
        this.changeItemExpandState(item, true);

        if(!item.isRoot) {
            const parentData = dataItem.getParent();
            this._setTreeLineExpandState(parentData);
        }
    }

    _ensureSelectedItemLoaded() {
        let selectedItem = this._getSelectedItem();
        if(selectedItem.isRoot || selectedItem.childrenLoaded) {
            return;
        }

        for(let key in this._itemMap) {
            if(!Object.prototype.hasOwnProperty.call(this._itemMap, key)) {
                continue;
            }

            const item = this._itemMap[key];
            if(item.childrenLoaded && item.children.indexOf(selectedItem) !== -1) {
                return;
            }
        }

        this._selectedDataItem = selectedItem.dataItem.getParent();
        selectedItem = this._getSelectedItem();
        this._raiseSelectedItemLoaded(selectedItem);
    }

    _onItemLoaded(item) {
        if(this._isSelectedItem(item)) {
            this._raiseSelectedItemLoaded(item);
        }
    }

    _onItemNotFound(item) {
        this.changeItemExpandState(item, false);

        if(this._selectedDataItem.relativeName.indexOf(item.dataItem.relativeName) === 0) {
            this._selectedDataItem = item.dataItem.getParent();
            const selectedItem = this._getSelectedItem();
            this._raiseSelectedItemLoaded(selectedItem);
        }
    }

    _getSelectedItem() {
        return this.getItemByDataItem(this._selectedDataItem);
    }

    _isSelectedItem(item) {
        return item === this._getSelectedItem();
    }

    _initState() {
        this._itemMap = { };
        this._loadMap = { };

        const rootData = new FileManagerItem("", "", true);
        rootData.name = this._options.rootItemText;
        this._rootItem = this.getItemByDataItem(rootData);
        this.changeItemExpandState(this._rootItem, true);

        if(!this._selectedDataItem) {
            this._selectedDataItem = rootData;
        }
    }

    _createItem(dataItem) {
        const dataKey = dataItem.relativeName;
        const isRoot = !dataItem.relativeName;
        const parentId = isRoot ? "" : this._getTreeItemKey(dataItem.parentPath);
        const expanded = !!this._expandedDataItems[dataKey];

        const result = {
            dataKey,
            childrenLoaded: false,
            dataItem,
            isRoot,

            id: this._getTreeItemKey(dataItem.relativeName),
            parentId,
            text: dataItem.name,
            expanded,
            icon: "folder"
        };

        this._itemMap[result.dataKey] = result;

        return result;
    }

    _getTreeItemKey(dataKey) {
        return `TVK_${dataKey}`;
    }

    _raiseSelectedItemLoaded(item) {
        this._options.onSelectedItemLoaded(item);
    }

}

module.exports = FileManagerFilesTreeView;
