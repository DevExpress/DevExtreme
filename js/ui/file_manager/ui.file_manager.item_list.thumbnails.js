import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import eventsEngine from '../../events/core/events_engine';
import { addNamespace } from '../../events/utils';
import { name as contextMenuEventName } from '../../events/contextmenu';
import { getDisplayFileSize } from './ui.file_manager.common';
import messageLocalization from '../../localization/message';

import FileManagerThumbnailListBox from './ui.file_manager.items_list.thumbnails.list_box';
import FileManagerItemListBase from './ui.file_manager.item_list';

const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS = 'dx-filemanager-thumbnails';
const FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';
const FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-thumbnails-item-thumbnail';

const FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE = 'dxFileManager_thumbnails';

class FileManagerThumbnailsItemList extends FileManagerItemListBase {
    _initMarkup() {
        super._initMarkup();

        this.$element().addClass(FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS);

        const contextMenuEvent = addNamespace(contextMenuEventName, FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE);
        eventsEngine.on(this.$element(), contextMenuEvent, this._onContextMenu.bind(this));

        this._createItemList();
    }

    _createItemList() {
        const selectionMode = this._isMultipleSelectionMode() ? 'multiple' : 'single';

        const $itemListContainer = $('<div>').appendTo(this.$element());
        this._itemList = this._createComponent($itemListContainer, FileManagerThumbnailListBox, {
            selectionMode,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            loopItemFocus: false,
            focusStateEnabled: true,
            onItemEnterKeyPressed: this._tryOpen.bind(this),
            itemThumbnailTemplate: this._getItemThumbnailContainer.bind(this),
            getTooltipText: this._getTooltipText.bind(this),
            onSelectionChanged: this._onFilesViewSelectionChanged.bind(this)
        });

        this.refresh();
    }

    _onContextMenu(e) {
        e.preventDefault();
        let items = null;
        const targetItemElement = $(e.target).closest(this._getItemSelector());
        if(targetItemElement.length > 0) {
            const targetItem = this._itemList.getItemByItemElement(targetItemElement);
            this._itemList.selectItem(targetItem);
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

    _onItemDblClick(e) {
        const $item = $(e.currentTarget);
        const item = this._itemList.getItemByItemElement($item);
        this._tryOpen(item);
    }

    _tryOpen(item) {
        if(item) {
            this._raiseSelectedItemOpened(item);
        }
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

        this._tryRaiseSelectionChanged({ selectedItems, selectedItemKeys, currentSelectedItemKeys, currentDeselectedItemKeys });
    }

    refresh() {
        this.clearSelection();
        this._itemList.option('dataSource', this._createDataSource());
    }

    _deselectItem(item) {
        this._itemList.deselectItem(item);
    }

    clearSelection() {
        this._itemList.clearSelection();
    }

    getSelectedItems() {
        return this._itemList.getSelectedItems();
    }

}

module.exports = FileManagerThumbnailsItemList;
