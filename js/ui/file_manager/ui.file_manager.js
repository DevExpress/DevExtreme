import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import { extend } from "../../core/utils/extend";
import typeUtils from "../../core/utils/type";

import registerComponent from "../../core/component_registrator";
import Widget from "../widget/ui.widget";
import notify from "../notify";

import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";
import FileManagerDetailsItemList from "./ui.file_manager.item_list.details";
import FileManagerThumbnailsItemList from "./ui.file_manager.item_list.thumbnails";
import FileManagerToolbar from "./ui.file_manager.toolbar";
import FileManagerEditingControl from "./ui.file_manager.editing";
import FileManagerBreadcrumbs from "./ui.file_manager.breadcrumbs";

import { FileProvider } from "../../file_provider/file_provider";
import ArrayFileProvider from "../../file_provider/file_provider.array";
import AjaxFileProvider from "../../file_provider/file_provider.ajax";
import OneDriveFileProvider from "../../file_provider/file_provider.onedrive";
import WebAPIFileProvider from "../../file_provider/file_provider.webapi";

const FILE_MANAGER_CLASS = "dx-filemanager";
const FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-container";
const FILE_MANAGER_DIRS_TREE_CLASS = FILE_MANAGER_CLASS + "-dirs-tree";
const FILE_MANAGER_VIEW_SEPARATOR_CLASS = FILE_MANAGER_CLASS + "-view-separator";
const FILE_MANAGER_TOOLBAR_CLASS = FILE_MANAGER_CLASS + "-toolbar";
const FILE_MANAGER_INACTIVE_AREA_CLASS = FILE_MANAGER_CLASS + "-inactive-area";
const FILE_MANAGER_EDITING_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-editing-container";
const FILE_MANAGER_ITEMS_PANEL_CLASS = FILE_MANAGER_CLASS + "-items-panel";

class FileManager extends Widget {

    _init() {
        this._commands = {
            open: () => this._tryOpen(),
            thumbnails: () => this._switchView("thumbnails"),
            details: () => this._switchView("details")
        };

        super._init();
    }

    _initTemplates() {
    }

    _initMarkup() {
        super._initMarkup();

        this._provider = this._getFileProvider();

        const toolbar = this._createComponent($("<div>"), FileManagerToolbar, {
            "onItemClick": this._onToolbarItemClick.bind(this)
        });
        toolbar.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS);

        this._createEditing();

        this._$viewContainer = this._createViewContainer();
        this.$element()
            .append(toolbar.$element())
            .append(this._$viewContainer)
            .append(this._editing.$element())
            .addClass(FILE_MANAGER_CLASS);

        this._setItemsViewAreaActive(false);
    }

    _createEditing() {
        this._editing = this._createComponent($("<div>"), FileManagerEditingControl, {
            model: {
                provider: this._provider,
                getFolders: this._getFilesTreeViewItems.bind(this),
                getCurrentFolder: this.getCurrentFolder.bind(this),
                getSingleSelectedItem: this._getSingleSelectedItem.bind(this),
                getMultipleSelectedItems: this._getMultipleSelectedItems.bind(this)
            },
            onSuccess: (message, updateOnlyFiles) => {
                this._showSuccess(message);
                this._refreshData(updateOnlyFiles);
            },
            onError: (title, details) => this._showError(title + ": " + this._getErrorText(details)),
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
            selectionMode: selectionOptions.mode,
            onGetItems: this._getItemListItems.bind(this),
            onError: this._showError.bind(this),
            onSelectedItemOpened: item => this._tryOpen(item),
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
            onPathChanged: path => this.setCurrentPath(path)
        });
    }

    _onFilesTreeViewCurrentFolderChanged(e) {
        this._loadItemListData();
        this._breadcrumbs.option("path", this.getCurrentFolderPath());
    }

    _onToolbarItemClick(buttonName) {
        this.executeCommand(buttonName);
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

        this.setCurrentPath(item.relativeName);
    }

    _switchView(viewMode) {
        this._itemList.dispose();
        this._itemList.$element().remove();

        this._createItemList(viewMode);
        this._$itemsPanel.append(this._itemList.$element());
    }

    _getSingleSelectedItem() {
        if(this._itemsViewAreaActive) {
            const items = this.getSelectedItems();
            if(items.length === 1) {
                return items[0];
            }
        } else {
            return this.getCurrentFolder();
        }
        return null;
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
        if(onlyItems || this._itemsViewAreaActive) {
            this._loadItemListData();
        } else {
            this._filesTreeView.refreshData();
        }
    }

    _getFilesTreeViewItems(parent) {
        const path = parent ? parent.relativeName : "";
        return this._provider.getFolders(path);
    }

    _getItemListItems() {
        const path = this.getCurrentFolderPath();
        const showFolders = this.option("itemList").showFolders;
        const itemType = showFolders ? "" : "file";
        return this._provider.getItems(path, itemType);
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
                showFolders: true
            },

            /**
            * @name dxTreeViewOptions.customThumbnail
            * @type function
            * @type_function_param1 item:dxFileManagerItem
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
                this.repaint();
                break;
            case "customThumbnail":
                break;
            default:
                super._optionChanged(args);
        }
    }

    executeCommand(commandName) {
        const done = this._editing.executeCommand(commandName);
        if(done) {
            return;
        }

        const action = this._commands[commandName];
        if(!action) {
            throw "Incorrect command name.";
        }
        action.call(this);
    }

    setCurrentPath(path) {
        this._filesTreeView.setCurrentPath(path);
    }

    getCurrentFolderPath() {
        return this._filesTreeView.getCurrentPath();
    }

    getCurrentFolder() {
        return this._filesTreeView.getCurrentFolder();
    }

    getSelectedItems() {
        return this._itemList.getSelectedItems();
    }

}

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
