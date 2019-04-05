import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import { extend } from "../../core/utils/extend";
import typeUtils from "../../core/utils/type";
import { when } from "../../core/utils/deferred";

import registerComponent from "../../core/component_registrator";
import Widget from "../widget/ui.widget";
import notify from "../notify";

import { FileManagerCommandManager } from "./ui.file_manager.command_manager";
import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";
import FileManagerDetailsItemList from "./ui.file_manager.item_list.details";
import FileManagerThumbnailsItemList from "./ui.file_manager.item_list.thumbnails";
import FileManagerToolbar from "./ui.file_manager.toolbar";
import FileManagerEditingControl from "./ui.file_manager.editing";
import FileManagerBreadcrumbs from "./ui.file_manager.breadcrumbs";
import { getName, getParentPath } from "./ui.file_manager.utils";

import { FileProvider, FileManagerItem } from "./file_provider/file_provider";
import ArrayFileProvider from "./file_provider/file_provider.array";
import AjaxFileProvider from "./file_provider/file_provider.ajax";
import OneDriveFileProvider from "./file_provider/file_provider.onedrive";
import WebAPIFileProvider from "./file_provider/file_provider.webapi";

const FILE_MANAGER_CLASS = "dx-filemanager";
const FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-container";
const FILE_MANAGER_DIRS_TREE_CLASS = FILE_MANAGER_CLASS + "-dirs-tree";
const FILE_MANAGER_VIEW_SEPARATOR_CLASS = FILE_MANAGER_CLASS + "-view-separator";
const FILE_MANAGER_INACTIVE_AREA_CLASS = FILE_MANAGER_CLASS + "-inactive-area";
const FILE_MANAGER_EDITING_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-editing-container";
const FILE_MANAGER_ITEMS_PANEL_CLASS = FILE_MANAGER_CLASS + "-items-panel";

class FileManager extends Widget {

    _initTemplates() {
    }

    _initMarkup() {
        super._initMarkup();

        this._provider = this._getFileProvider();
        this._currentFolder = new FileManagerItem("", "", true);

        this._commandManager = new FileManagerCommandManager();

        const $toolbar = $("<div>").appendTo(this.$element());
        this._toolbar = this._createComponent($toolbar, FileManagerToolbar, {
            commandManager: this._commandManager,
            itemListViewMode: this.option("itemList").mode
        });

        this._createEditing();

        this._$viewContainer = this._createViewContainer();
        this.$element()
            .append(this._$viewContainer)
            .append(this._editing.$element())
            .addClass(FILE_MANAGER_CLASS);

        this._initCommandManager();
        this._setItemsViewAreaActive(false);
    }

    _createEditing() {
        this._editing = this._createComponent($("<div>"), FileManagerEditingControl, {
            model: {
                provider: this._provider,
                getFolders: this._getFilesTreeViewItems.bind(this),
                getCurrentFolder: this.getCurrentFolder.bind(this),
                getMultipleSelectedItems: this._getMultipleSelectedItems.bind(this)
            },
            onSuccess: ({ message, updatedOnlyFiles }) => {
                this._showSuccess(message);
                this._refreshData(updatedOnlyFiles);
            },
            onError: ({ title, details }) => this._showError(title + ": " + this._getErrorText(details)),
            onCreating: () => this._setItemsViewAreaActive(false)
        });
        this._editing.$element().addClass(FILE_MANAGER_EDITING_CONTAINER_CLASS);
    }

    _createViewContainer() {
        const $container = $("<div>");
        $container.addClass(FILE_MANAGER_CONTAINER_CLASS);

        this._createFilesTreeView();
        $container.append(this._filesTreeView.$element());

        const $viewSeparator = $("<div>");
        $viewSeparator.addClass(FILE_MANAGER_VIEW_SEPARATOR_CLASS);
        $container.append($viewSeparator);

        this._createBreadcrumbs();
        this._createItemList();

        this._$itemsPanel = $("<div>").addClass(FILE_MANAGER_ITEMS_PANEL_CLASS);
        this._$itemsPanel.append(
            this._breadcrumbs.$element(),
            this._itemList.$element()
        );

        $container.append(this._$itemsPanel);

        return $container;
    }

    _createFilesTreeView() {
        this._filesTreeView = this._createComponent($("<div>"), FileManagerFilesTreeView, {
            getItems: this._getFilesTreeViewItems.bind(this),
            onCurrentFolderChanged: this._onFilesTreeViewCurrentFolderChanged.bind(this),
            onClick: () => this._setItemsViewAreaActive(false)
        });
        this._filesTreeView.$element().addClass(FILE_MANAGER_DIRS_TREE_CLASS);
    }

    _createItemList(viewMode) {
        const itemListOptions = this.option("itemList");
        const selectionOptions = this.option("selection");

        const options = {
            commandManager: this._commandManager,
            selectionMode: selectionOptions.mode,
            getItems: this._getItemListItems.bind(this),
            onError: ({ error }) => this._showError(error),
            onSelectionChanged: this._onItemListSelectionChanged.bind(this),
            onSelectedItemOpened: ({ item }) => this._tryOpen(item),
            onContextMenuItemClick: ({ name, fileItem }) => this._onContextMenuItemClick(name, fileItem),
            getItemThumbnail: this._getItemThumbnail.bind(this)
        };

        viewMode = viewMode || itemListOptions.mode;
        const widgetClass = viewMode === "thumbnails" ? FileManagerThumbnailsItemList : FileManagerDetailsItemList;
        this._itemList = this._createComponent($("<div>"), widgetClass, options);

        eventsEngine.on(this._itemList.$element(), "click", this._onItemListClick.bind(this));
    }

    _createBreadcrumbs() {
        this._breadcrumbs = this._createComponent($("<div>"), FileManagerBreadcrumbs, {
            path: "",
            onPathChanged: e => this.setCurrentFolderPath(e.newPath),
            onOutsideClick: () => this._itemList.clearSelection()
        });
    }

    _initCommandManager() {
        const actions = extend(this._editing.getCommandActions(), {
            refresh: () => this._refreshData(),
            thumbnails: () => this._switchView("thumbnails"),
            details: () => this._switchView("details")
        });
        this._commandManager.registerActions(actions);
    }

    _onFilesTreeViewCurrentFolderChanged(e) {
        this.setCurrentFolder(this._filesTreeView.getCurrentFolder());
    }

    _onItemListSelectionChanged() {
        const items = this.getSelectedItems();
        this._toolbar.update(items);
    }

    _onContextMenuItemClick(name) {
        this.executeCommand(name);
    }

    _setItemsViewAreaActive(active) {
        if(this._itemsViewAreaActive === active) {
            return;
        }

        this._itemsViewAreaActive = active;

        let $activeArea = null;
        let $inactiveArea = null;
        if(active) {
            $activeArea = this._itemList.$element();
            $inactiveArea = this._filesTreeView.$element();
        } else {
            $activeArea = this._filesTreeView.$element();
            $inactiveArea = this._itemList.$element();
        }

        $activeArea.removeClass(FILE_MANAGER_INACTIVE_AREA_CLASS);
        $inactiveArea.addClass(FILE_MANAGER_INACTIVE_AREA_CLASS);

        if(!active) {
            this._itemList.clearSelection();
        }
    }

    _tryOpen(item) {
        if(!item) {
            const items = this.getSelectedItems();
            if(items.length > 0) {
                item = items[0];
            }
        }
        if(!item || !item.isFolder) {
            return;
        }

        const folder = item.createClone();
        if(item.isParentFolder) {
            folder.name = getName(item.relativeName);
            folder.relativeName = item.relativeName;
        }
        this.setCurrentFolder(folder);
    }

    _switchView(viewMode) {
        this._itemList.dispose();
        this._itemList.$element().remove();

        this._createItemList(viewMode);
        this._$itemsPanel.append(this._itemList.$element());
    }

    _getMultipleSelectedItems() {
        return this._itemsViewAreaActive ? this.getSelectedItems() : [ this.getCurrentFolder() ];
    }

    _showSuccess(message) {
        this._showNotification(message, true);
    }

    _showError(error) {
        const message = this._getErrorText(error);
        this._showNotification(message, false);
    }

    _getErrorText(error) {
        const result = typeof error === "string" ? error : error.responseText;
        return result || "General error";
    }

    _showNotification(message, isSuccess) {
        notify({
            message: message,
            width: 450
        }, isSuccess ? "success" : "error", 5000);
    }

    _loadItemListData() {
        this._itemList.refreshData();
    }

    _refreshData(onlyItems) {
        if(!onlyItems) {
            this._filesTreeView.refreshData();
        }
        this._loadItemListData();
    }

    _getFilesTreeViewItems(parent) {
        const path = parent ? parent.relativeName : "";
        return this._provider.getFolders(path);
    }

    _getItemListItems() {
        const path = this.getCurrentFolderPath();
        const options = this.option("itemList");
        const itemType = options.showFolders ? "" : "file";
        let result = this._provider.getItems(path, itemType);

        if(options.showParentFolder && path) {
            const parentPath = getParentPath(path);
            const parentFolder = this._createFolderItemByPath(parentPath);
            parentFolder.isParentFolder = true;
            parentFolder.name = "..";

            result = when(result).done(items => items.unshift(parentFolder));
        }

        return result;
    }

    _onItemListClick() {
        this._setItemsViewAreaActive(true);
    }

    _getFileProvider() {
        let fileSystemStore = this.option("fileSystemStore");

        if(!fileSystemStore) {
            fileSystemStore = [];
        }

        if(Array.isArray(fileSystemStore)) {
            return new ArrayFileProvider(fileSystemStore);
        }

        if(typeof fileSystemStore === "string") {
            return new AjaxFileProvider({ url: fileSystemStore });
        }

        if(fileSystemStore instanceof FileProvider) {
            return fileSystemStore;
        }

        if(fileSystemStore.type) {
            switch(fileSystemStore.type) {
                case "webapi":
                    return new WebAPIFileProvider(fileSystemStore);
                case "onedrive":
                    return new OneDriveFileProvider(fileSystemStore);
            }
        }

        return new ArrayFileProvider([]);
    }

    _getItemThumbnail(item) {
        const func = this.option("customThumbnail");
        const thumbnail = typeUtils.isFunction(func) ? func(item) : item.thumbnail;
        return thumbnail || this._getPredefinedThumbnail(item);
    }

    _getPredefinedThumbnail(item) {
        if(item.isFolder) {
            return "folder";
        }

        const extension = item.getExtension();
        switch(extension) {
            case ".txt":
                return "doc"; // TODO change icon
            case ".rtf":
            case ".doc":
            case ".docx":
            case ".odt":
                return "doc";
            case ".xls":
            case ".xlsx":
            case ".ods":
                return "exportxlsx";
            case ".ppt":
            case ".pptx":
            case ".odp":
                return "doc"; // TODO change icon
            case ".pdf":
                return "exportpdf";
            case ".png":
            case ".gif":
            case ".jpg":
            case ".jpeg":
            case ".ico":
            case ".bmp":
                return "image";
            default:
                return "doc"; // TODO change icon
        }
    }

    _createFolderItemByPath(path) {
        const parentPath = getParentPath(path);
        const name = getName(path);
        return new FileManagerItem(parentPath, name, true);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxFileManagerOptions.fileSystemStore
            * @type object
            * @default null
            */
            fileSystemStore: null,

            /**
            * @name dxFileManagerOptions.selection
            * @type object
            * @default {}
            */
            selection: {
                mode: "single"
            },

            /**
            * @name dxFileManagerOptions.itemList
            * @type object
            * @default null
            */
            itemList: {
                mode: "details",
                showFolders: true,
                showParentFolder: true
            },

            /**
            * @name dxFileManagerOptions.customThumbnail
            * @type function
            * @type_function_param1 fileItem:object
            * @type_function_return string
            */
            customThumbnail: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "fileSystemStore":
            case "selection":
            case "itemList":
            case "customThumbnail":
                this.repaint();
                break;
            default:
                super._optionChanged(args);
        }
    }

    executeCommand(commandName) {
        this._commandManager.executeCommand(commandName);
    }

    setCurrentFolderPath(path) {
        const folder = this._createFolderItemByPath(path);
        this.setCurrentFolder(folder);
    }

    getCurrentFolderPath() {
        return this._currentFolder.relativeName;
    }

    setCurrentFolder(folder) {
        const newPath = folder.relativeName;
        if(newPath === this.getCurrentFolderPath()) {
            return;
        }

        this._currentFolder = folder;
        this._filesTreeView.setCurrentFolderPath(newPath);
        this._loadItemListData();
        this._breadcrumbs.option("path", newPath);
    }

    getCurrentFolder() {
        return this._currentFolder;
    }

    getSelectedItems() {
        return this._itemList.getSelectedItems();
    }

}

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
