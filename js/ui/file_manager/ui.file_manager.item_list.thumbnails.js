import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { addNamespace } from '../../events/utils';
import eventsEngine from '../../events/core/events_engine';
import { name as contextMenuEventName } from '../../events/contextmenu';

import CustomStore from '../../data/custom_store';
import FileManagerThumbnailListBox from './ui.file_manager.items_list.thumbnails.list_box';
import FileManagerItemListBase from './ui.file_manager.item_list';

const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS = 'dx-filemanager-thumbnails';
const FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS = 'dx-filemanager-thumbnails-view-port';
const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS = 'dx-filemanager-thumbnails-container';
const FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';
const FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-thumbnails-item-thumbnail';

const FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE = 'dxFileManager_thumbnails';

class FileManagerThumbnailsItemList extends FileManagerItemListBase {

    _init() {
        this._currentLoadOperationId = 0;

        super._init();
    }

    _initMarkup() {
        super._initMarkup();

        this._$itemViewContainer = $('<div>').addClass(FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS);

        this._$viewPort = $('<div>').addClass(FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS);
        this._$viewPort.append(this._$itemViewContainer);

        this.$element().addClass(FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS);
        this.$element().append(this._$viewPort);

        const contextMenuEvent = addNamespace(contextMenuEventName, FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE);
        eventsEngine.on(this.$element(), contextMenuEvent, this._onContextMenu.bind(this));

        this._createItemList();
    }

    _createItemList() {
        const selectionMode = this._isMultipleSelectionMode() ? 'multiple' : 'single';

        this._itemList = this._createComponent(this._$itemViewContainer, FileManagerThumbnailListBox, {
            selectionMode,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            loopItemFocus: false,
            focusStateEnabled: true,
            onItemEnterKeyPressed: this.tryOpen.bind(this),
            getItemThumbnail: this._getItemThumbnailContainer.bind(this),

            scrollableElement: this._$viewPort,
            onSelectionChanged: this._onFilesViewSelectionChanged.bind(this)
        });

        this.refresh();
    }

    _onContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        let items = null;
        const targetItemElement = $(e.target).closest(this._getItemSelector());
        if(targetItemElement.length > 0) {
            if(!this._itemList.isItemSelected(targetItemElement)) {
                this._itemList.changeItemSelection(targetItemElement);
            }
            const targetItem = this._itemList.getItemByItemElement(targetItemElement);
            items = this._getFileItemsForContextMenu(targetItem);
        }

        this._showContextMenu(items, e.target, e);
    }

    _getItemThumbnailCssClass() {
        return FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS;
    }

    _getItemSelector() {
        return `.${FILE_MANAGER_THUMBNAILS_ITEM_CLASS}`;
    }

    _onItemDblClick(e) {
        const $item = $(e.currentTarget);
        const item = this._itemList.getItemByItemElement($item);
        this._raiseSelectedItemOpened(item);
    }

    _selectAll() {
        this._itemList.selectAll();
    }

    _getFocusedItem() {
        return this._itemList.getFocusedItem();
    }

    _disableDragging() {
        return false;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            focusStateEnabled: true
        });
    }

    _onFilesViewSelectionChanged({ addedItems, removedItems }) {
        const selectedItems = this.getSelectedItems().map(itemInfo => itemInfo.fileItem);
        const selectedItemKeys = selectedItems.map(item => item.key);
        const currentSelectedItemKeys = addedItems.map(itemInfo => itemInfo.fileItem.key);
        const currentDeselectedItemKeys = removedItems.map(itemInfo => itemInfo.fileItem.key);

        const parentDirectoryItem = this._findParentDirectoryItem(this.getSelectedItems());
        if(parentDirectoryItem) {
            const $parentDir = this._itemList.getItemElementByItem(parentDirectoryItem);
            this._itemList.unselectItem($parentDir);
        }

        this._tryRaiseSelectionChanged({ selectedItems, selectedItemKeys, currentSelectedItemKeys, currentDeselectedItemKeys });
    }

    _loadItems() {
        return this._getItems().done(itemInfos => {
            const parentDirectoryItem = this._findParentDirectoryItem(itemInfos);
            this._hasParentDirectoryItem = !!parentDirectoryItem;
            this._parentDirectoryItemKey = parentDirectoryItem ? parentDirectoryItem.fileItem.key : null;
        });
    }

    refresh() {
        this.clearSelection();
        this._itemList.option('dataSource', {
            'store': new CustomStore({
                key: 'fileItem.key',
                load: this._loadItems.bind(this)
            })
        });
    }

    tryOpen() {
        const item = this._getFocusedItem();
        if(item) {
            this._raiseSelectedItemOpened(item);
        }
    }

    clearSelection() {
        this._itemList.clearSelection();
    }

    getSelectedItems() {
        return this._itemList.getSelectedItems();
    }

}

module.exports = FileManagerThumbnailsItemList;
