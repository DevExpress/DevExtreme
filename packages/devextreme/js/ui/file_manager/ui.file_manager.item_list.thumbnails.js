import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { isDefined } from '../../core/utils/type';
import { Deferred } from '../../core/utils/deferred';
import eventsEngine from '../../common/core/events/core/events_engine';
import { addNamespace } from '../../common/core/events/utils/index';
import { name as contextMenuEventName } from '../../common/core/events/contextmenu';
import { getDisplayFileSize } from './ui.file_manager.common';
import messageLocalization from '../../common/core/localization/message';

import FileManagerThumbnailListBox from './ui.file_manager.items_list.thumbnails.list_box';
import FileManagerItemListBase from './ui.file_manager.item_list';
import { OPERATIONS } from './file_items_controller';

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
            dataSource: this._createDataSource(),
            selectionMode,
            selectedItemKeys: this.option('selectedItemKeys'),
            focusedItemKey: this.option('focusedItemKey'),
            activeStateEnabled: true,
            hoverStateEnabled: true,
            loopItemFocus: false,
            focusStateEnabled: true,
            onItemEnterKeyPressed: this._tryOpen.bind(this),
            itemThumbnailTemplate: this._getItemThumbnailContainer.bind(this),
            getTooltipText: this._getTooltipText.bind(this),
            onSelectionChanged: this._onItemListSelectionChanged.bind(this),
            onFocusedItemChanged: this._onItemListFocusedItemChanged.bind(this),
            onContentReady: this._onContentReady.bind(this)
        });
    }

    _onContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        if(!this._isDesktop()) {
            return;
        }
        let items = null;
        const targetItemElement = $(e.target).closest(this._getItemSelector());
        let targetItem = null;
        if(targetItemElement.length > 0) {
            targetItem = this._itemList.getItemByItemElement(targetItemElement);
            this._itemList.selectItem(targetItem);
            items = this._getFileItemsForContextMenu(targetItem);
        }

        const target = {
            itemData: targetItem,
            itemElement: targetItemElement.length ? targetItemElement : undefined
        };
        this._showContextMenu(items, e.target, e, target);
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

    _getItemsInternal() {
        return super._getItemsInternal().then(items => {
            const deferred = new Deferred();
            setTimeout(() => deferred.resolve(items));
            return deferred.promise();
        });
    }

    _disableDragging() {
        return false;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            focusStateEnabled: true
        });
    }

    _onItemListSelectionChanged({ addedItemKeys, removedItemKeys }) {
        const selectedItemInfos = this.getSelectedItems();
        const selectedItems = selectedItemInfos.map(itemInfo => itemInfo.fileItem);
        const selectedItemKeys = selectedItems.map(item => item.key);

        this._tryRaiseSelectionChanged({
            selectedItemInfos,
            selectedItems,
            selectedItemKeys,
            currentSelectedItemKeys: addedItemKeys,
            currentDeselectedItemKeys: removedItemKeys
        });
    }

    _onItemListFocusedItemChanged({ item, itemElement }) {
        if(!this._isMultipleSelectionMode()) {
            this._selectItemSingleSelection(item);
        }

        const fileSystemItem = item?.fileItem || null;
        this._onFocusedItemChanged({
            item: fileSystemItem,
            itemKey: fileSystemItem?.key,
            itemElement: itemElement || undefined
        });
    }

    _getScrollable() {
        return this._itemList.getScrollable();
    }

    _setSelectedItemKeys(itemKeys) {
        this._itemList.option('selectedItemKeys', itemKeys);
    }

    _setFocusedItemKey(itemKey) {
        this._itemList.option('focusedItemKey', itemKey);
    }

    refresh(options, operation) {
        const actualOptions = {
            dataSource: this._createDataSource()
        };

        if(options && Object.prototype.hasOwnProperty.call(options, 'focusedItemKey')) {
            actualOptions.focusedItemKey = options.focusedItemKey;
        }
        if(options && Object.prototype.hasOwnProperty.call(options, 'selectedItemKeys')) {
            actualOptions.selectedItemKeys = options.selectedItemKeys;
        }

        if(!isDefined(actualOptions.focusedItemKey) && operation === OPERATIONS.NAVIGATION) {
            this._needResetScrollPosition = true;
        }
        this._itemList.option(actualOptions);

        this._refreshDeferred = new Deferred();
        return this._refreshDeferred.promise();
    }

    _deselectItem(item) {
        const itemElement = this._itemList.getItemElementByItem(item);
        this._itemList.unselectItem(itemElement);
    }

    _selectItemSingleSelection(item) {
        if(item) {
            this._itemList.selectItem(item);
        } else {
            this._itemList.clearSelection();
        }
    }

    clearSelection() {
        this._itemList.clearSelection();
    }

    getSelectedItems() {
        return this._itemList.getSelectedItems();
    }

}

export default FileManagerThumbnailsItemList;
