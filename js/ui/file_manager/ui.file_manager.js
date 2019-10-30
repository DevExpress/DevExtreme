import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import { extend } from "../../core/utils/extend";
import typeUtils from "../../core/utils/type";
import { when, Deferred } from "../../core/utils/deferred";

import messageLocalization from "../../localization/message";

import registerComponent from "../../core/component_registrator";
import Widget from "../widget/ui.widget";
import notify from "../notify";

import FileItemsController from "./file_items_controller";
import { FileManagerCommandManager } from "./ui.file_manager.command_manager";
import FileManagerContextMenu from "./ui.file_manager.context_menu";
import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";
import FileManagerDetailsItemList from "./ui.file_manager.item_list.details";
import FileManagerThumbnailsItemList from "./ui.file_manager.item_list.thumbnails";
import FileManagerToolbar from "./ui.file_manager.toolbar";
import FileManagerNotificationControl from "./ui.file_manager.notification";
import FileManagerEditingControl from "./ui.file_manager.editing";
import FileManagerBreadcrumbs from "./ui.file_manager.breadcrumbs";
import FileManagerAdaptivityControl from "./ui.file_manager.adaptivity";

import { FileManagerItem } from "./file_provider/file_provider";

const FILE_MANAGER_CLASS = "dx-filemanager";
const FILE_MANAGER_WRAPPER_CLASS = FILE_MANAGER_CLASS + "-wrapper";
const FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-container";
const FILE_MANAGER_DIRS_PANEL_CLASS = FILE_MANAGER_CLASS + "-dirs-panel";
const FILE_MANAGER_INACTIVE_AREA_CLASS = FILE_MANAGER_CLASS + "-inactive-area";
const FILE_MANAGER_EDITING_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-editing-container";
const FILE_MANAGER_ITEMS_PANEL_CLASS = FILE_MANAGER_CLASS + "-items-panel";
const FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS = FILE_MANAGER_CLASS + "-item-custom-thumbnail";

class FileManager extends Widget {

    _initTemplates() {
    }

    _initMarkup() {
        super._initMarkup();

        this._onCurrentDirectoryChangedAction = this._createActionByOption("onCurrentDirectoryChanged");
        this._onSelectedFileOpenedAction = this._createActionByOption("onSelectedFileOpened");

        this._controller = new FileItemsController({
            currentPath: this.option("currentPath"),
            rootText: this.option("rootFolderName"),
            fileProvider: this.option("fileProvider"),
            allowedFileExtensions: this.option("allowedFileExtensions"),
            maxUploadFileSize: this.option("upload").maxFileSize,
            onSelectedDirectoryChanged: this._onSelectedDirectoryChanged.bind(this)
        });
        this._commandManager = new FileManagerCommandManager(this.option("permissions"));

        this.$element().addClass(FILE_MANAGER_CLASS);

        this._createNotificationControl();

        this._initCommandManager();
        this._setItemsViewAreaActive(false);
    }

    _createNotificationControl() {
        const $notificationControl = $("<div>")
            .addClass("dx-filemanager-notification-container")
            .appendTo(this.$element());

        this._notificationControl = this._createComponent($notificationControl, FileManagerNotificationControl, {
            progressPanelContainer: this.$element(),
            contentTemplate: container => this._createWrapper(container),
            onActionProgress: e => this._onActionProgress(e)
        });
        this._editing.option("notificationControl", this._notificationControl);
    }

    _createWrapper(container) {
        this._$wrapper = $("<div>")
            .addClass(FILE_MANAGER_WRAPPER_CLASS)
            .appendTo(container);

        this._createEditing();

        const $toolbar = $("<div>").appendTo(this._$wrapper);
        this._toolbar = this._createComponent($toolbar, FileManagerToolbar, {
            commandManager: this._commandManager,
            generalItems: this.option("toolbar.items"),
            fileItems: this.option("toolbar.fileSelectionItems"),
            itemViewMode: this.option("itemView").mode
        });

        this._createAdaptivityControl();
    }

    _createAdaptivityControl() {
        const $container = $("<div>")
            .addClass(FILE_MANAGER_CONTAINER_CLASS)
            .appendTo(this._$wrapper);

        this._adaptivityControl = this._createComponent($container, FileManagerAdaptivityControl, {
            drawerTemplate: container => this._createFilesTreeView(container),
            contentTemplate: container => this._createItemsPanel(container),
            onAdaptiveStateChanged: e => this._onAdaptiveStateChanged(e)
        });
    }

    _createEditing() {
        const $editingContainer = $("<div>")
            .addClass(FILE_MANAGER_EDITING_CONTAINER_CLASS)
            .appendTo(this.$element());

        this._editing = this._createComponent($editingContainer, FileManagerEditingControl, {
            controller: this._controller,
            model: {
                getMultipleSelectedItems: this._getMultipleSelectedItems.bind(this)
            },
            getItemThumbnail: this._getItemThumbnailInfo.bind(this),
            onSuccess: ({ updatedOnlyFiles }) => this._redrawComponent(updatedOnlyFiles),
            onCreating: () => this._setItemsViewAreaActive(false)
        });
    }

    _createItemsPanel($container) {
        this._$itemsPanel = $("<div>")
            .addClass(FILE_MANAGER_ITEMS_PANEL_CLASS)
            .appendTo($container);

        this._createBreadcrumbs(this._$itemsPanel);
        this._createItemView(this._$itemsPanel);
    }

    _createFilesTreeView(container) {
        const $filesTreeView = $("<div>")
            .addClass(FILE_MANAGER_DIRS_PANEL_CLASS)
            .appendTo(container);

        this._filesTreeView = this._createComponent($filesTreeView, FileManagerFilesTreeView, {
            storeExpandedState: true,
            contextMenu: this._createContextMenu(),
            getDirectories: this.getDirectories.bind(this),
            getCurrentDirectory: this._getCurrentDirectory.bind(this),
            onDirectoryClick: this._onFilesTreeViewDirectoryClick.bind(this)
        });
    }

    _createItemView($container, viewMode) {
        const itemViewOptions = this.option("itemView");

        const options = {
            selectionMode: this.option("selectionMode"),
            contextMenu: this._createContextMenu(),
            getItems: this._getItemViewItems.bind(this),
            onError: ({ error }) => this._showError(error),
            onSelectionChanged: this._onItemViewSelectionChanged.bind(this),
            onSelectedItemOpened: this._onSelectedItemOpened.bind(this),
            getItemThumbnail: this._getItemThumbnailInfo.bind(this),
            customizeDetailColumns: this.option("customizeDetailColumns")
        };

        const $itemView = $("<div>").appendTo($container);

        viewMode = viewMode || itemViewOptions.mode;
        const widgetClass = viewMode === "thumbnails" ? FileManagerThumbnailsItemList : FileManagerDetailsItemList;
        this._itemView = this._createComponent($itemView, widgetClass, options);

        eventsEngine.on($itemView, "click", this._onItemViewClick.bind(this));
    }

    _createBreadcrumbs($container) {
        const $breadcrumbs = $("<div>").appendTo($container);
        this._breadcrumbs = this._createComponent($breadcrumbs, FileManagerBreadcrumbs, {
            rootFolderDisplayName: this.option("rootFolderName"),
            onCurrentDirectoryChanging: ({ currentDirectory }) => this._setCurrentDirectory(currentDirectory),
            onOutsideClick: () => this._clearSelection()
        });
        this._breadcrumbs.setCurrentDirectory(this._getCurrentDirectory());
    }

    _createContextMenu() {
        const $contextMenu = $("<div>").appendTo(this._$wrapper);
        return this._createComponent($contextMenu, FileManagerContextMenu, {
            commandManager: this._commandManager,
            items: this.option("contextMenu.items")
        });
    }

    _initCommandManager() {
        const actions = extend(this._editing.getCommandActions(), {
            refresh: () => this._refreshAndShowProgress(),
            thumbnails: () => this.option("itemView.mode", "thumbnails"),
            details: () => this.option("itemView.mode", "details"),
            clear: () => this._clearSelection(),
            showNavPane: () => this._adaptivityControl.toggleDrawer()
        });
        this._commandManager.registerActions(actions);
    }

    _onFilesTreeViewDirectoryClick({ itemData }) {
        this._setCurrentDirectory(itemData);
        this._setItemsViewAreaActive(false);
    }

    _onItemViewSelectionChanged() {
        this._updateToolbar();
    }

    _onAdaptiveStateChanged({ enabled }) {
        this._commandManager.setCommandEnabled("showNavPane", enabled);
        this._updateToolbar();
    }

    _onActionProgress({ message, status }) {
        this._toolbar.updateRefreshItem(message, status);
        this._updateToolbar();
    }

    _refreshAndShowProgress() {
        this._notificationControl.tryShowProgressPanel();

        return this._controller.refresh()
            .then(() => this._redrawComponent());
    }

    _updateToolbar() {
        const items = this._getSelectedItemInfos();
        this._toolbar.update(items);
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
            this._clearSelection();
        }
    }

    _switchView(viewMode) {
        this._disposeWidget(this._itemView.option("contextMenu"));
        this._disposeWidget(this._itemView);

        this._createItemView(this._$itemsPanel, viewMode);
        this._toolbar.option({ itemViewMode: viewMode });
    }

    _disposeWidget(widget) {
        widget.dispose();
        widget.$element().remove();
    }

    _clearSelection() {
        this._itemView.clearSelection();
    }

    _getMultipleSelectedItems() {
        return this._itemsViewAreaActive ? this._getSelectedItemInfos() : [ this._getCurrentDirectory() ];
    }

    _showError(message) { // TODO use notification control instead of it
        this._showNotification(message, false);
    }

    _showNotification(message, isSuccess) {
        notify({
            message: message,
            width: 450
        }, isSuccess ? "success" : "error", 5000); // TODO: locale ?? not sure
    }

    _redrawComponent(onlyFileItemsView) {
        !onlyFileItemsView && this._filesTreeView.refresh();
        this._itemView.refresh();
    }

    _getItemViewItems() {
        const selectedDir = this._getCurrentDirectory();
        if(!selectedDir) {
            return new Deferred()
                .resolve([])
                .promise();
        }

        let itemInfos = this.option("itemView").showFolders
            ? this._controller.getDirectoryContents(selectedDir)
            : this._controller.getFiles(selectedDir);

        if(this.option("itemView.showParentFolder") && !selectedDir.fileItem.isRoot) {
            let parentDirItem = new FileManagerItem(null, "..", true);
            parentDirItem.isParentFolder = true;
            itemInfos = when(itemInfos)
                .then(items => {
                    let itemInfosCopy = [...items];
                    itemInfosCopy.unshift({
                        fileItem: parentDirItem,
                        icon: "folder"
                    });
                    return itemInfosCopy;
                });
        }

        return itemInfos;
    }

    _onItemViewClick() {
        this._setItemsViewAreaActive(true);
    }

    _getItemThumbnailInfo(fileInfo) {
        const func = this.option("customizeThumbnail");
        const thumbnail = typeUtils.isFunction(func) ? func(fileInfo.fileItem) : fileInfo.fileItem.thumbnail;
        if(thumbnail) {
            return {
                thumbnail,
                cssClass: FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS
            };
        }
        return {
            thumbnail: fileInfo.icon
        };
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
            * @name dxFileManagerOptions.currentPath
            * @type string
            * @default ""
            */
            currentPath: "",

            /**
            * @name dxFileManagerOptions.rootFolderName
            * @type string
            * @default "Files"
            */
            rootFolderName: messageLocalization.format("dxFileManager-rootFolderName"),

            /**
            * @name dxFileManagerOptions.selectionMode
            * @type Enums.FileManagerSelectionMode
            * @default "multiple"
            */
            selectionMode: "multiple", // "single"

            /**
            * @name dxFileManagerOptions.toolbar
            * @type object
            */

            /**
            * @name dxFileManagerOptions.toolbar.items
            * @type Array<dxFileManagerToolbarItem,Enums.FileManagerToolbarItem>
            * @default [ "showNavPane", "create", "upload", "refresh", { name: "separator", location: "after" }, "viewSwitcher" ]
            */
            /**
            * @name dxFileManagerOptions.toolbar.fileSelectionItems
            * @type Array<dxFileManagerToolbarItem,Enums.FileManagerToolbarItem>
            * @default [ "download", "separator", "move", "copy", "rename", "separator", "delete", "refresh", "clear" ]
            */

            /**
            * @name dxFileManagerToolbarItem
            * @inherits dxToolbarItem
            */
            /**
            * @name dxFileManagerToolbarItem.name
            * @type Enums.FileManagerToolbarItem|string
            */
            /**
            * @name dxFileManagerToolbarItem.location
            * @default "before"
            */
            /**
            * @name dxFileManagerToolbarItem.visible
            * @default undefined
            */

            toolbar: {
                items: [
                    "showNavPane", "create", "upload", "refresh",
                    {
                        name: "separator",
                        location: "after"
                    },
                    "viewSwitcher"
                ],

                fileSelectionItems: [
                    "download", "separator", "move", "copy", "rename", "separator", "delete", "refresh", "clear"
                ]
            },

            /**
            * @name dxFileManagerOptions.contextMenu
            * @type object
            */

            /**
            * @name dxFileManagerOptions.contextMenu.items
            * @type Array<dxFileManagerContextMenuItem,Enums.FileManagerContextMenuItem>
            * @default [ "create", "upload", "rename", "move", "copy", "delete", "refresh", "download" ]
            */

            /**
            * @name dxFileManagerContextMenuItem
            * @inherits dxContextMenuItem
            */
            /**
            * @name dxFileManagerContextMenuItem.name
            * @type Enums.FileManagerContextMenuItem|string
            */
            /**
            * @name dxFileManagerContextMenuItem.visible
            * @default undefined
            */

            contextMenu: {
                items: [
                    "create", "upload", "rename", "move", "copy", "delete", "refresh", "download"
                ]
            },

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
            * @name dxFileManagerOptions.customizeDetailColumns
            * @type function
            * @type_function_param1 columns:Array<dxDataGridColumn>
            * @type_function_return Array<dxDataGridColumn>
            */
            customizeDetailColumns: null,

            /**
            * @name dxFileManagerOptions.onCurrentDirectoryChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @default null
            * @action
            */
            onCurrentDirectoryChanged: null,

            /**
            * @name dxFileManagerOptions.onSelectedFileOpened
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 fileItem:object
            * @default null
            * @action
            */
            onSelectedFileOpened: null,

            /**
            * @name dxFileManagerOptions.allowedFileExtensions
            * @type Array<string>
            * @default [".txt", ".rtf", ".doc", ".docx", ".odt", ".xls", ".xlsx", ".ods", ".ppt", ".pptx", ".odp", ".pdf", ".xml", ".png", ".svg", ".gif", ".jpg", ".jpeg", ".ico", ".bmp", ".avi", ".mpeg", ".mkv", ""]
            */
            allowedFileExtensions: [".txt", ".rtf", ".doc", ".docx", ".odt", ".xls", ".xlsx", ".ods", ".ppt", ".pptx", ".odp", ".pdf", ".xml", ".png", ".svg", ".gif", ".jpg", ".jpeg", ".ico", ".bmp", ".avi", ".mpeg", ".mkv", ""],

            /**
            * @name dxFileManagerOptions.upload
            * @type object
            */
            upload: {
                /**
                * @name dxFileManagerOptions.upload.maxFileSize
                * @type number
                * @default 0
                */
                maxFileSize: 0
            },

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
                upload: false,
                /**
                 * @name dxFileManagerOptions.permissions.download
                 * @type boolean
                 * @default false
                 */
                download: false
            }
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "currentPath":
                this._setCurrentPath(args.value);
                break;
            case "fileProvider":
            case "selectionMode":
            case "customizeThumbnail":
            case "customizeDetailColumns":
            case "rootFolderName":
            case "allowedFileExtensions":
            case "permissions":
            case "upload":
                this.repaint();
                break;
            case "itemView":
                if(args.fullName === "itemView.mode") {
                    this._switchView(args.value);
                } else {
                    this.repaint();
                }
                break;
            case "toolbar":
                this._toolbar.option(extend(
                    true,
                    args.value.items ? { generalItems: args.value.items } : {},
                    args.value.fileSelectionItems ? { fileItems: args.value.fileSelectionItems } : {}
                ));
                break;
            case "contextMenu":
                this._itemView.option("contextMenu", this._createContextMenu());
                this._filesTreeView.option("contextMenu", this._createContextMenu());
                break;
            case "onCurrentDirectoryChanged":
                this._onCurrentDirectoryChangedAction = this._createActionByOption("onCurrentDirectoryChanged");
                break;
            case "onSelectedFileOpened":
                this._onSelectedFileOpenedAction = this._createActionByOption("onSelectedFileOpened");
                break;
            default:
                super._optionChanged(args);
        }
    }

    executeCommand(commandName) {
        return this._commandManager.executeCommand(commandName);
    }

    _setCurrentDirectory(directoryInfo) {
        this._controller.setCurrentDirectory(directoryInfo);
    }

    _getCurrentDirectory() {
        return this._controller.getCurrentDirectory();
    }

    _onSelectedDirectoryChanged() {
        const currentPath = this._controller.getCurrentPath();

        this._filesTreeView.updateCurrentDirectory();
        this._itemView.refresh();
        this._breadcrumbs.setCurrentDirectory(this._getCurrentDirectory());

        this.option("currentPath", currentPath);
        this._onCurrentDirectoryChangedAction();
    }

    getDirectories(parentDirectoryInfo) {
        return this._controller.getDirectories(parentDirectoryInfo);
    }

    _getSelectedItemInfos() {
        return this._itemView.getSelectedItems();
    }

    /**
     * @name dxFileManagerMethods.refresh
     * @publicName refresh()
     * @return Promise<any>
     */
    refresh() {
        return this.executeCommand("refresh");
    }

    /**
     * @name dxFileManagerMethods.getCurrentDirectory
     * @publicName getCurrentDirectory()
     * @return object
     */
    getCurrentDirectory() {
        const directoryInfo = this._getCurrentDirectory();
        return directoryInfo && directoryInfo.fileItem || null;
    }

    /**
     * @name dxFileManagerMethods.getSelectedItems
     * @publicName getSelectedItems()
     * @return Array<object>
     */
    getSelectedItems() {
        return this._getSelectedItemInfos().map(itemInfo => itemInfo.fileItem);
    }

    _onSelectedItemOpened({ fileItemInfo }) {
        const fileItem = fileItemInfo.fileItem;
        if(!fileItem.isDirectory) {
            this._onSelectedFileOpenedAction({ fileItem });
            return;
        }

        const newCurrentDirectory = fileItem.isParentFolder ? this._getCurrentDirectory().parentDirectory : fileItemInfo;
        this._setCurrentDirectory(newCurrentDirectory);

        if(newCurrentDirectory) {
            this._filesTreeView.expandDirectory(newCurrentDirectory.parentDirectory);
        }
    }

    _setCurrentPath(path) {
        this._controller.setCurrentPath(path);
    }

}

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
