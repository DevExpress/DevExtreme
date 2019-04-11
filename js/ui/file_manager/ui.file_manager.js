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
import WebApiFileProvider from "./file_provider/file_provider.webapi";

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

        this._commandManager = new FileManagerCommandManager(this.option("permissions"));

        const $toolbar = $("<div>").appendTo(this.$element());
        this._toolbar = this._createComponent($toolbar, FileManagerToolbar, {
            commandManager: this._commandManager,
            itemViewMode: this.option("itemView").mode
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
        this._createItemView();

        this._$itemsPanel = $("<div>").addClass(FILE_MANAGER_ITEMS_PANEL_CLASS);
        this._$itemsPanel.append(
            this._breadcrumbs.$element(),
            this._itemView.$element()
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

    _createItemView(viewMode) {
        const itemViewOptions = this.option("itemView");

        const options = {
            commandManager: this._commandManager,
            selectionMode: this.option("selectionMode"),
            getItems: this._getItemViewItems.bind(this),
            onError: ({ error }) => this._showError(error),
            onSelectionChanged: this._onItemViewSelectionChanged.bind(this),
            onSelectedItemOpened: ({ item }) => this._tryOpen(item),
            onContextMenuItemClick: ({ name, fileItem }) => this._onContextMenuItemClick(name, fileItem),
            getItemThumbnail: this._getItemThumbnail.bind(this)
        };

        viewMode = viewMode || itemViewOptions.mode;
        const widgetClass = viewMode === "thumbnails" ? FileManagerThumbnailsItemList : FileManagerDetailsItemList;
        this._itemView = this._createComponent($("<div>"), widgetClass, options);

        eventsEngine.on(this._itemView.$element(), "click", this._onItemViewClick.bind(this));
    }

    _createBreadcrumbs() {
        this._breadcrumbs = this._createComponent($("<div>"), FileManagerBreadcrumbs, {
            path: "",
            onPathChanged: e => this.setCurrentFolderPath(e.newPath),
            onOutsideClick: () => this._itemView.clearSelection()
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

    _onItemViewSelectionChanged() {
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
            $activeArea = this._itemView.$element();
            $inactiveArea = this._filesTreeView.$element();
        } else {
            $activeArea = this._filesTreeView.$element();
            $inactiveArea = this._itemView.$element();
        }

        $activeArea.removeClass(FILE_MANAGER_INACTIVE_AREA_CLASS);
        $inactiveArea.addClass(FILE_MANAGER_INACTIVE_AREA_CLASS);

        if(!active) {
            this._itemView.clearSelection();
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
        this._itemView.dispose();
        this._itemView.$element().remove();

        this._createItemView(viewMode);
        this._$itemsPanel.append(this._itemView.$element());
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

    _loadItemViewData() {
        this._itemView.refreshData();
    }

    _refreshData(onlyItems) {
        if(!onlyItems) {
            this._filesTreeView.refreshData();
        }
        this._loadItemViewData();
    }

    _getFilesTreeViewItems(parent) {
        const path = parent ? parent.relativeName : "";
        return this._provider.getFolders(path);
    }

    _getItemViewItems() {
        const path = this.getCurrentFolderPath();
        const options = this.option("itemView");
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

    _onItemViewClick() {
        this._setItemsViewAreaActive(true);
    }

    _getFileProvider() {
        let fileProvider = this.option("fileProvider");

        if(!fileProvider) {
            fileProvider = [];
        }

        if(Array.isArray(fileProvider)) {
            return new ArrayFileProvider(fileProvider);
        }

        if(typeof fileProvider === "string") {
            return new AjaxFileProvider({ url: fileProvider });
        }

        if(fileProvider instanceof FileProvider) {
            return fileProvider;
        }

        if(fileProvider.type) {
            switch(fileProvider.type) {
                case "webapi":
                    return new WebApiFileProvider(fileProvider);
                case "onedrive":
                    return new OneDriveFileProvider(fileProvider);
            }
        }

        return new ArrayFileProvider([]);
    }

    _getItemThumbnail(item) {
        const func = this.option("customizeThumbnail");
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
            * @name dxFileManagerOptions.fileProvider
            * @type object
            * @default null
            */
            fileProvider: null,

            /**
            * @name dxFileManagerOptions.selectionMode
            * @type Enums.FileManagerSelectionMode
            * @default "multiple"
            */
            selectionMode: "multiple", // "single"

            /**
            * @name dxFileManagerOptions.itemView
            * @type object
            * @default null
            */
            itemView: {
                /**
                * @name dxFileManagerOptions.itemView.mode
                * @type Enums.FileManagerItemViewMode
                * @default "details"
                */
                mode: "details", // "thumbnails"
                /**
                * @name dxFileManagerOptions.itemView.showFolders
                * @type boolean
                * @default true
                */
                showFolders: true,
                /**
                * @name dxFileManagerOptions.itemView.showParentFolder
                * @type boolean
                * @default true
                */
                showParentFolder: true
            },

            /**
            * @name dxFileManagerOptions.customizeThumbnail
            * @type function
            * @type_function_param1 fileItem:object
            * @type_function_return string
            */
            customizeThumbnail: null,

            /**
             * @name dxFileManagerOptions.permissions
             * @type object
             */
            permissions: {
                /**
                 * @name dxFileManagerOptions.permissions.create
                 * @type boolean
                 * @default false
                 */
                create: false,
                /**
                 * @name dxFileManagerOptions.permissions.copy
                 * @type boolean
                 * @default false
                 */
                copy: false,
                /**
                 * @name dxFileManagerOptions.permissions.move
                 * @type boolean
                 * @default false
                 */
                move: false,
                /**
                 * @name dxFileManagerOptions.permissions.remove
                 * @type boolean
                 * @default false
                 */
                remove: false,
                /**
                 * @name dxFileManagerOptions.permissions.rename
                 * @type boolean
                 * @default false
                 */
                rename: false,
                /**
                 * @name dxFileManagerOptions.permissions.upload
                 * @type boolean
                 * @default false
                 */
                upload: false
            }
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "fileProvider":
            case "selectionMode":
            case "itemView":
            case "customizeThumbnail":
            case "permissions":
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
        this._loadItemViewData();
        this._breadcrumbs.option("path", newPath);
    }

    getCurrentFolder() {
        return this._currentFolder;
    }

    getSelectedItems() {
        return this._itemView.getSelectedItems();
    }

}

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
