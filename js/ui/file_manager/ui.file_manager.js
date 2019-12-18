import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { extend } from '../../core/utils/extend';
import typeUtils from '../../core/utils/type';
import { when, Deferred } from '../../core/utils/deferred';

import registerComponent from '../../core/component_registrator';
import Widget from '../widget/ui.widget';
import notify from '../notify';

import { FileManagerCommandManager } from './ui.file_manager.command_manager';
import FileManagerContextMenu from './ui.file_manager.context_menu';
import FileManagerFilesTreeView from './ui.file_manager.files_tree_view';
import FileManagerDetailsItemList from './ui.file_manager.item_list.details';
import FileManagerThumbnailsItemList from './ui.file_manager.item_list.thumbnails';
import FileManagerToolbar from './ui.file_manager.toolbar';
import FileManagerEditingControl from './ui.file_manager.editing';
import FileManagerBreadcrumbs from './ui.file_manager.breadcrumbs';
import FileManagerAdaptivityControl from './ui.file_manager.adaptivity';
import { getName, getParentPath } from './ui.file_manager.utils';

import { FileProvider, FileManagerItem } from './file_provider/file_provider';
import ArrayFileProvider from './file_provider/array';
import AjaxFileProvider from './file_provider/ajax';
import OneDriveFileProvider from './file_provider/onedrive';
import WebApiFileProvider from './file_provider/webapi';

const FILE_MANAGER_CLASS = 'dx-filemanager';
const FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + '-container';
const FILE_MANAGER_DIRS_PANEL_CLASS = FILE_MANAGER_CLASS + '-dirs-panel';
const FILE_MANAGER_INACTIVE_AREA_CLASS = FILE_MANAGER_CLASS + '-inactive-area';
const FILE_MANAGER_EDITING_CONTAINER_CLASS = FILE_MANAGER_CLASS + '-editing-container';
const FILE_MANAGER_ITEMS_PANEL_CLASS = FILE_MANAGER_CLASS + '-items-panel';
const FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS = FILE_MANAGER_CLASS + '-item-custom-thumbnail';

class FileManager extends Widget {

    _initTemplates() {
    }

    _initMarkup() {
        super._initMarkup();

        this._onSelectedFileOpenedAction = this._createActionByOption('onSelectedFileOpened');

        this._provider = this._getFileProvider();
        this._currentFolder = null;

        this._commandManager = new FileManagerCommandManager(this.option('permissions'));

        this.$element().addClass(FILE_MANAGER_CLASS);

        const $toolbar = $('<div>').appendTo(this.$element());
        this._toolbar = this._createComponent($toolbar, FileManagerToolbar, {
            commandManager: this._commandManager,
            itemViewMode: this.option('itemView').mode
        });

        this._createAdaptivityControl();
        this._createEditing();

        this._initCommandManager();
        this._setItemsViewAreaActive(false);
    }

    _createAdaptivityControl() {
        const $container = $('<div>')
            .addClass(FILE_MANAGER_CONTAINER_CLASS)
            .appendTo(this.$element());

        this._adaptivityControl = this._createComponent($container, FileManagerAdaptivityControl, {
            drawerTemplate: container => this._createFilesTreeView(container),
            contentTemplate: container => this._createItemsPanel(container),
            onAdaptiveStateChanged: e => this._onAdaptiveStateChanged(e)
        });
    }

    _createEditing() {
        const $editingContainer = $('<div>')
            .addClass(FILE_MANAGER_EDITING_CONTAINER_CLASS)
            .appendTo(this.$element());

        this._editing = this._createComponent($editingContainer, FileManagerEditingControl, {
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
            onError: ({ message }) => this._showError(message),
            onCreating: () => this._setItemsViewAreaActive(false)
        });
    }

    _createItemsPanel($container) {
        this._$itemsPanel = $('<div>')
            .addClass(FILE_MANAGER_ITEMS_PANEL_CLASS)
            .appendTo($container);

        this._createBreadcrumbs(this._$itemsPanel);
        this._createItemView(this._$itemsPanel);
    }

    _createFilesTreeView(container) {
        const $filesTreeView = $('<div>')
            .addClass(FILE_MANAGER_DIRS_PANEL_CLASS)
            .appendTo(container);

        this._filesTreeView = this._createComponent($filesTreeView, FileManagerFilesTreeView, {
            contextMenu: this._createContextMenu(),
            getItems: this._getFilesTreeViewItems.bind(this),
            onCurrentFolderChanged: this._onFilesTreeViewCurrentFolderChanged.bind(this),
            onClick: () => this._setItemsViewAreaActive(false)
        });
    }

    _createItemView($container, viewMode) {
        const itemViewOptions = this.option('itemView');

        const options = {
            selectionMode: this.option('selectionMode'),
            contextMenu: this._createContextMenu(),
            getItems: this._getItemViewItems.bind(this),
            onError: ({ error }) => this._showError(error),
            onSelectionChanged: this._onItemViewSelectionChanged.bind(this),
            onSelectedItemOpened: this._onSelectedItemOpened.bind(this),
            onSelectedFileOpened: this._createActionByOption('onSelectedFileOpened'),
            getItemThumbnail: this._getItemThumbnailInfo.bind(this),
            customizeDetailColumns: this.option('customizeDetailColumns')
        };

        const $itemView = $('<div>').appendTo($container);

        viewMode = viewMode || itemViewOptions.mode;
        const widgetClass = viewMode === 'thumbnails' ? FileManagerThumbnailsItemList : FileManagerDetailsItemList;
        this._itemView = this._createComponent($itemView, widgetClass, options);

        eventsEngine.on($itemView, 'click', this._onItemViewClick.bind(this));
    }

    _createBreadcrumbs($container) {
        const $breadcrumbs = $('<div>').appendTo($container);
        this._breadcrumbs = this._createComponent($breadcrumbs, FileManagerBreadcrumbs, {
            path: '',
            onPathChanged: e => this.setCurrentFolderPath(e.newPath),
            onOutsideClick: () => this._clearSelection()
        });
    }

    _createContextMenu() {
        const $contextMenu = $('<div>').appendTo(this.$element());
        return this._createComponent($contextMenu, FileManagerContextMenu, {
            commandManager: this._commandManager
        });
    }

    _initCommandManager() {
        const actions = extend(this._editing.getCommandActions(), {
            refresh: () => this._refreshData(),
            thumbnails: () => this._switchView('thumbnails'),
            details: () => this._switchView('details'),
            clear: () => this._clearSelection(),
            showDirsPanel: () => this._adaptivityControl.toggleDrawer()
        });
        this._commandManager.registerActions(actions);
    }

    _onFilesTreeViewCurrentFolderChanged(e) {
        this.setCurrentFolder(this._filesTreeView.getCurrentFolder());
    }

    _onItemViewSelectionChanged() {
        this._updateToolbar();
    }

    _onAdaptiveStateChanged({ enabled }) {
        this._commandManager.setCommandEnabled('showDirsPanel', enabled);
        this._updateToolbar();
    }

    _updateToolbar() {
        const items = this.getSelectedItems();
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

    _tryOpen(item) {
        if(!item) {
            const items = this.getSelectedItems();
            if(items.length > 0) {
                item = items[0];
            }
        }
        if(!item || !item.isDirectory) {
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
        this._disposeWidget(this._itemView.option('contextMenu'));
        this._disposeWidget(this._itemView);

        this._createItemView(this._$itemsPanel, viewMode);
    }

    _disposeWidget(widget) {
        widget.dispose();
        widget.$element().remove();
    }

    _clearSelection() {
        this._itemView.clearSelection();
    }

    _getMultipleSelectedItems() {
        return this._itemsViewAreaActive ? this.getSelectedItems() : [ this.getCurrentFolder() ];
    }

    _showSuccess(message) {
        this._showNotification(message, true);
    }

    _showError(message) {
        this._showNotification(message, false);
    }

    _showNotification(message, isSuccess) {
        notify({
            message: message,
            width: 450
        }, isSuccess ? 'success' : 'error', 5000);
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
        const path = parent ? parent.relativeName : '';
        return this._provider.getFolders(path);
    }

    _getItemViewItems() {
        const path = this.getCurrentFolderPath();

        if(path === null) {
            return new Deferred().promise();
        }

        const options = this.option('itemView');
        const itemType = options.showFolders ? '' : 'file';
        let result = this._provider.getItems(path, itemType);

        if(options.showParentFolder && path) {
            const parentPath = getParentPath(path);
            const parentFolder = this._createFolderItemByPath(parentPath);
            parentFolder.isParentFolder = true;
            parentFolder.name = '..';

            result = when(result).done(items => items.unshift(parentFolder));
        }

        return result;
    }

    _onItemViewClick() {
        this._setItemsViewAreaActive(true);
    }

    _getFileProvider() {
        let fileProvider = this.option('fileProvider');

        if(!fileProvider) {
            fileProvider = [];
        }

        if(Array.isArray(fileProvider)) {
            return new ArrayFileProvider({ data: fileProvider });
        }

        if(typeof fileProvider === 'string') {
            return new AjaxFileProvider({ url: fileProvider });
        }

        if(fileProvider instanceof FileProvider) {
            return fileProvider;
        }

        if(fileProvider.type) {
            switch(fileProvider.type) {
                case 'webapi':
                    return new WebApiFileProvider(fileProvider);
                case 'onedrive':
                    return new OneDriveFileProvider(fileProvider);
            }
        }

        return new ArrayFileProvider(fileProvider);
    }

    _getItemThumbnailInfo(item) {
        const func = this.option('customizeThumbnail');
        const thumbnail = typeUtils.isFunction(func) ? func(item) : item.thumbnail;
        if(thumbnail) {
            return {
                thumbnail,
                cssClass: FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS
            };
        }
        return {
            thumbnail: this._getPredefinedThumbnail(item)
        };
    }

    _getPredefinedThumbnail(item) {
        if(item.isDirectory) {
            return 'folder';
        }

        const extension = item.getExtension();
        switch(extension) {
            case '.txt':
                return 'doc'; // TODO change icon
            case '.rtf':
            case '.doc':
            case '.docx':
            case '.odt':
                return 'doc';
            case '.xls':
            case '.xlsx':
            case '.ods':
                return 'exportxlsx';
            case '.ppt':
            case '.pptx':
            case '.odp':
                return 'doc'; // TODO change icon
            case '.pdf':
                return 'exportpdf';
            case '.png':
            case '.gif':
            case '.jpg':
            case '.jpeg':
            case '.ico':
            case '.bmp':
                return 'image';
            default:
                return 'doc'; // TODO change icon
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
            selectionMode: 'multiple', // "single"

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
                mode: 'details', // "thumbnails"
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
            case 'fileProvider':
            case 'selectionMode':
            case 'itemView':
            case 'customizeThumbnail':
            case 'customizeDetailColumns':
            case 'permissions':
                this.repaint();
                break;
            case 'onSelectedFileOpened':
                this._onSelectedFileOpenedAction = this._createActionByOption('onSelectedFileOpened');
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
        return this.getCurrentFolder() ? this.getCurrentFolder().relativeName : null;
    }

    setCurrentFolder(folder) {
        const newPath = folder ? folder.relativeName : null;
        if(newPath === this.getCurrentFolderPath()) {
            return;
        }

        this._currentFolder = folder;
        this._filesTreeView.setCurrentFolderPath(newPath);
        this._loadItemViewData();
        this._breadcrumbs.option('path', newPath || '');
    }

    getCurrentFolder() {
        return this._currentFolder;
    }

    getSelectedItems() {
        return this._itemView.getSelectedItems();
    }

    _onSelectedItemOpened({ item }) {
        if(!item.isDirectory) {
            this._onSelectedFileOpenedAction({ fileItem: item });
        }
        this._tryOpen(item);
    }

}

registerComponent('dxFileManager', FileManager);

module.exports = FileManager;
