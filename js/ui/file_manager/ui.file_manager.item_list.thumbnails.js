import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { when } from '../../core/utils/deferred';
import eventsEngine from '../../events/core/events_engine';
import { addNamespace } from '../../events/utils';
import { name as contextMenuEventName } from '../../events/contextmenu';
import { getDisplayFileSize } from './ui.file_manager.common';
import messageLocalization from '../../localization/message';

import FileManagerThumbnailListBox from './ui.file_manager.items_list.thumbnails.list_box';
// import FileManagerThumbnailsItemListBox from './ui.file_manager.collection_widget_test';
import FileManagerItemListBase from './ui.file_manager.item_list';

const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS = 'dx-filemanager-thumbnails';
const FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS = 'dx-filemanager-thumbnails-view-port';
const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS = 'dx-filemanager-thumbnails-container';
const FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';
const FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-thumbnails-item-thumbnail';
const FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS = 'dx-filemanager-thumbnails-item-spacer';
const FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS = 'dx-filemanager-thumbnails-item-name';

const FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE = 'dxFileManager_thumbnails';

class FileManagerThumbnailsItemList extends FileManagerItemListBase {

    _init() {
        this._items = [];
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

        this._createFilesView();

        this._loadItems();
    }

    _createFilesView() {
        const selectionMode = this._isMultipleSelectionMode() ? 'multiple' : 'single';

        this._filesView = this._createComponent(this._$itemViewContainer, FileManagerThumbnailListBox, {
            selectionMode,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            loopItemFocus: false,
            focusStateEnabled: true,
            defaultItemTemplate: this._getItemTemplate.bind(this),
            onEnterKeyPressed: this.tryOpen.bind(this),
            beforeKeyProcessing: this._beforeKeyProcessing.bind(this),
            processMoveArrow: this._processMoveArrow.bind(this),
            processPageChange: this._processPageChange.bind(this),
            processHomeEndKeys: this._processHomeEndKeys.bind(this),
            onSelectionChanged: this._onFilesViewSelectionChanged.bind(this)
        });
    }

    _beforeKeyProcessing(e) {
        e.preventDefault();
        this._resetLayoutModel();
    }

    _processMoveArrow(offset, horizontal, eventArgs) {
        const item = this._getFocusedItem();
        if(item) {
            if(!horizontal) {
                const layout = this._getLayoutModel();
                if(!layout) {
                    return;
                }

                offset *= layout.itemPerRowCount;
            }

            const newItemIndex = this._filesView.getIndexByItem(item) + offset;
            this._focusItemByIndex(newItemIndex, true, eventArgs);
        }
    }

    _processPageChange(pageUp, eventArgs) {
        const item = this._getFocusedItem();
        if(!item) {
            return;
        }

        const layout = this._getLayoutModel();
        if(!layout) {
            return;
        }

        const itemLayout = this._createItemLayoutModel(this._filesView.getIndexByItem(item));

        const rowOffset = pageUp ? layout.rowPerPageRate : -layout.rowPerPageRate;
        const newRowRate = itemLayout.itemRowIndex - rowOffset;
        const roundFunc = pageUp ? Math.ceil : Math.floor;
        const newRowIndex = roundFunc(newRowRate);
        let newItemIndex = newRowIndex * layout.itemPerRowCount + itemLayout.itemColumnIndex;
        if(newItemIndex < 0) {
            newItemIndex = 0;
        } else if(newItemIndex >= this._items.length) {
            newItemIndex = this._items.length - 1;
        }

        this._focusItemByIndex(newItemIndex, true, eventArgs);
    }

    _simulateSelection(e) {
        const $item = $(e.target).closest(this._getItemSelector());
        if($item.length > 0 && !this._filesView.isItemSelected($item)) {
            this._filesView.selectItemConditionally($item);
        }
        return $item;
    }

    _onContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        const targetItemElement = this._simulateSelection(e);
        let items = null;
        if(targetItemElement.length > 0) {
            const targetItem = this._filesView.getItemByItemElement(targetItemElement);
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
        const item = this._filesView.getItemByItemElement($item);
        this._raiseSelectedItemOpened(item);
    }

    _scrollToItem(item) {
        const layout = this._getLayoutModel();
        if(!layout) {
            return;
        }

        const itemRowIndex = Math.floor(this._filesView.getIndexByItem(item) / layout.itemPerRowCount);
        const itemTop = itemRowIndex * layout.itemHeight;
        const itemBottom = itemTop + layout.itemHeight;

        let newScrollTop = layout.viewPortScrollTop;

        if(itemTop < layout.viewPortScrollTop) {
            newScrollTop = itemTop;
        } else if(itemBottom > layout.viewPortScrollBottom) {
            newScrollTop = itemBottom - layout.viewPortHeight;
        }

        this._$viewPort.scrollTop(newScrollTop);
    }

    _resetLayoutModel() {
        this._layoutModel = null;
    }

    _getLayoutModel() {
        if(!this._layoutModel) {
            this._layoutModel = this._createLayoutModel();
        }
        return this._layoutModel;
    }

    _createLayoutModel() {
        if(this._items.length === 0) {
            return null;
        }

        const item = this._items[0];
        const $item = this._filesView.getItemElementByItem(item);

        const itemWidth = $item.outerWidth(true);
        if(itemWidth === 0) {
            return null;
        }

        const itemHeight = $item.outerHeight(true);

        const viewPortWidth = this._$itemViewContainer.innerWidth();
        const viewPortHeight = this._$viewPort.innerHeight();
        const viewPortScrollTop = this._$viewPort.scrollTop();
        const viewPortScrollBottom = viewPortScrollTop + viewPortHeight;

        const itemPerRowCount = Math.floor(viewPortWidth / itemWidth);
        const rowPerPageRate = viewPortHeight / itemHeight;

        return {
            itemWidth: itemWidth,
            itemHeight: itemHeight,
            viewPortWidth: viewPortWidth,
            viewPortHeight: viewPortHeight,
            viewPortScrollTop: viewPortScrollTop,
            viewPortScrollBottom: viewPortScrollBottom,
            itemPerRowCount: itemPerRowCount,
            rowPerPageRate: rowPerPageRate
        };
    }

    _createItemLayoutModel(index) {
        const layout = this._getLayoutModel();
        if(!layout) {
            return null;
        }

        const itemRowIndex = Math.floor(index / layout.itemPerRowCount);
        const itemColumnIndex = index % layout.itemPerRowCount;
        const itemTop = itemRowIndex * layout.itemHeight;
        const itemBottom = itemTop + layout.itemHeight;

        return {
            itemRowIndex: itemRowIndex,
            itemColumnIndex: itemColumnIndex,
            itemTop: itemTop,
            itemBottom: itemBottom
        };
    }

    _selectAll() {
        this._filesView.selectAll();
    }

    _processHomeEndKeys(index, scrollToItem, eventArgs) {
        if(index >= 0 && index < this._items.length) {
            const item = this._filesView.getItemByIndex(index);
            this._focusItem(item, scrollToItem);
        }
    }

    _focusItem(item, scrollToItem) {
        this._filesView.setFocusedItem(item);
        if(scrollToItem) {
            this._scrollToItem(item);
        }
    }

    _focusItemByIndex(index, scrollToItem, eventArgs) {
        if(index >= 0 && index < this._items.length) {
            const item = this._filesView.getItemByIndex(index);
            this._focusItem(item, scrollToItem, eventArgs);
        }
    }

    _getFocusedItem() {
        return this._filesView.getFocusedItem();
    }

    _loadItems() {
        const loadOperationId = this._getUniqueId();
        this._currentLoadOperationId = loadOperationId;

        when(this._getItems())
            .then(items => {
                if(this._currentLoadOperationId === loadOperationId) {
                    this._applyItems(items || []);
                }
            },
            error => {
                if(this._currentLoadOperationId === loadOperationId) {
                    this._raiseOnError(error);
                }
            });
    }

    _applyItems(items) {
        this._items = items;

        const parentDirectoryItem = this._findParentDirectoryItem(this._items);
        this._hasParentDirectoryItem = !!parentDirectoryItem;
        this._parentDirectoryItemKey = parentDirectoryItem ? parentDirectoryItem.fileItem.key : null;

        if(this._filesView) {
            this._filesView.option('dataSource', this._items);
        }
    }

    _getItemTemplate(fileItemInfo, $itemElement) {
        $itemElement.attr('title', this._getTooltipText(fileItemInfo));

        const $itemThumbnail = this._getItemThumbnailContainer(fileItemInfo);

        const $itemSpacer = $('<div>').addClass(FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS);

        const $itemName = $('<div>')
            .addClass(FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS)
            .text(fileItemInfo.fileItem.name);

        $itemElement.append($itemThumbnail, $itemSpacer, $itemName);
    }

    _getTooltipText(fileItemInfo) {
        const item = fileItemInfo.fileItem;
        if(item.tooltipText) {
            return item.tooltipText;
        }

        let text = `${item.name}\r\n`;
        if(!item.isDirectory) {
            text += `${messageLocalization.format('dxFileManager-listThumbnailsTooltipTextSize')}: ${getDisplayFileSize(item.size)}\r\n`;
        }
        text += `${messageLocalization.format('dxFileManager-listThumbnailsTooltipTextDateModified')}: ${item.dateModified}`;
        return text;
    }

    _getUniqueId() {
        return `${Date.now()}_${Math.round(Math.random() * 100000)}`;
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
        let selectedItems = this.getSelectedItems().map(itemInfo => itemInfo.fileItem);
        let selectedItemKeys = selectedItems.map(item => item.key);
        let currentSelectedItemKeys = addedItems.map(itemInfo => itemInfo.fileItem.key);
        let currentDeselectedItemKeys = removedItems.map(itemInfo => itemInfo.fileItem.key);

        const parentDirectoryItem = this._findParentDirectoryItem(this.getSelectedItems());
        if(parentDirectoryItem) {
            const $parentDir = this._filesView.getItemElementByItem(parentDirectoryItem);
            this._filesView.unselectItem($parentDir);
        }

        let raiseEvent = !this._hasParentDirectoryItem;
        raiseEvent = raiseEvent || this._hasValidKeys(currentSelectedItemKeys) || this._hasValidKeys(currentDeselectedItemKeys);

        if(raiseEvent) {
            selectedItems = this._filterOutParentDirectory(selectedItems);

            selectedItemKeys = this._filterOutParentDirectoryKey(selectedItemKeys, true);
            currentSelectedItemKeys = this._filterOutParentDirectoryKey(currentSelectedItemKeys, true);
            currentDeselectedItemKeys = this._filterOutParentDirectoryKey(currentDeselectedItemKeys, true);
            this._raiseSelectionChanged({ selectedItems, selectedItemKeys, currentSelectedItemKeys, currentDeselectedItemKeys });
        }

    }

    refresh() {
        this.clearSelection();
        this._loadItems();
    }

    tryOpen() {
        const item = this._getFocusedItem();
        if(item) {
            this._raiseSelectedItemOpened(item);
        }
    }

    clearSelection() {
        this._filesView.clearSelection();
    }

    getSelectedItems() {
        return this._filesView.getSelectedItems();
    }

}

module.exports = FileManagerThumbnailsItemList;
