import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import messageLocalization from '../../localization/message';
import { getDisplayFileSize } from './ui.file_manager.common';
import { BindableTemplate } from '../../core/templates/bindable_template';

import CollectionWidget from '../collection/ui.collection_widget.edit';

const FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';
const FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS = 'dx-filemanager-thumbnails-item-name';
const FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS = 'dx-filemanager-thumbnails-item-spacer';

const FILE_MANAGER_THUMBNAILS_ITEM_CLASS_DATA_KEY = 'dxFileManagerItemDataKey';

class FileManagerThumbnailListBox extends CollectionWidget {
    _init() {
        super._init();
        this._initActions();
        this._$scrollable = this.option('scrollableElement');
    }

    _initActions() {
        this._onItemEnterKeyPressed = this._createActionByOption('onItemEnterKeyPressed');
    }

    _initTemplates() {
        super._initTemplates();
        this._getItemThumbnailContainer = this.option('getItemThumbnail');
        this._templateManager.addDefaultTemplates({
            item: new BindableTemplate(function($container, data, itemModel) {
                const $itemElement = this._getDefaultItemTemplate(itemModel, $container);
                $container.append($itemElement);
            }.bind(this), ['fileItem'], this.option('integrationOptions.watchMethod'))
        });
    }

    _supportedKeys() {
        return extend(super._supportedKeys(), {
            upArrow(e) {
                this._beforeKeyProcessing(e);
                this._processArrowKeys(-1, false, e);
            },
            downArrow(e) {
                this._beforeKeyProcessing(e);
                this._processArrowKeys(1, false, e);
            },
            home(e) {
                this._beforeKeyProcessing(e);
                this._processHomeEndKeys(0, true, e);
            },
            end(e) {
                this._beforeKeyProcessing(e);
                this._processHomeEndKeys(this._getItemsLength() - 1, true, e);
            },
            pageUp(e) {
                this._beforeKeyProcessing(e);
                this._processPageChange(true, e);
            },
            pageDown(e) {
                this._beforeKeyProcessing(e);
                this._processPageChange(false, e);
            },
            enter(e) {
                this._beforeKeyProcessing(e);
                this._onItemEnterKeyPressed();
            },
            A(e) {
                this._beforeKeyProcessing(e);
                if(e.ctrlKey || e.metaKey) {
                    this.selectAll();
                }
            }
        });
    }

    _beforeKeyProcessing(e) {
        e.preventDefault();
        this._resetLayoutModel();
    }

    _processArrowKeys(offset, horizontal, eventArgs) {
        const item = this.getFocusedItem();
        if(item) {
            if(!horizontal) {
                const layout = this._getLayoutModel();
                if(!layout) {
                    return;
                }

                offset *= layout.itemPerRowCount;
            }

            const newItemIndex = this._getIndexByItem(item) + offset;
            this._focusItemByIndex(newItemIndex, true, eventArgs);
        }
    }

    _processHomeEndKeys(index, scrollToItem, eventArgs) {
        this._focusItemByIndex(index, scrollToItem, eventArgs);
    }

    _processPageChange(pageUp, eventArgs) {
        const item = this.getFocusedItem();
        if(!item) {
            return;
        }

        const layout = this._getLayoutModel();
        if(!layout) {
            return;
        }

        const itemLayout = this._createItemLayoutModel(this._getIndexByItem(item));

        const rowOffset = pageUp ? layout.rowPerPageRate : -layout.rowPerPageRate;
        const newRowRate = itemLayout.itemRowIndex - rowOffset;
        const roundFunc = pageUp ? Math.ceil : Math.floor;
        const newRowIndex = roundFunc(newRowRate);
        let newItemIndex = newRowIndex * layout.itemPerRowCount + itemLayout.itemColumnIndex;
        if(newItemIndex < 0) {
            newItemIndex = 0;
        } else if(newItemIndex >= this._getItemsLength()) {
            newItemIndex = this._getItemsLength() - 1;
        }

        this._focusItemByIndex(newItemIndex, true, eventArgs);
    }

    _itemContainer() {
        return this.$element();
    }

    _itemClass() {
        return FILE_MANAGER_THUMBNAILS_ITEM_CLASS;
    }

    _itemDataKey() {
        return FILE_MANAGER_THUMBNAILS_ITEM_CLASS_DATA_KEY;
    }

    _getDefaultItemTemplate(fileItemInfo, $itemElement) {
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

    _itemSelectHandler(e) {
        let options = {};
        if(this.option('selectionMode') === 'multiple') {
            if(!this._isPreserveSelectionMode) {
                this._isPreserveSelectionMode = e.ctrlKey || e.metaKey || e.shiftKey;
            }
            options = {
                control: this._isPreserveSelectionMode,
                shift: e.shiftKey
            };
        }
        this.changeItemSelection(e.currentTarget, options);
    }

    _updateSelection(addedSelection, removedSelection) {
        for(let i = 0; i < removedSelection.length; i++) {
            this._removeSelection(removedSelection[i]);
        }
        for(let i = 0; i < addedSelection.length; i++) {
            this._addSelection(addedSelection[i]);
        }
        const selectedItemsCount = this.getSelectedItems().length;
        if(selectedItemsCount === 0) {
            this._isPreserveSelectionMode = false;
        }
    }

    // #region layoutModel

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
        if(this._getItemsLength() === 0) {
            return null;
        }

        const item = this._getItems()[0];
        const $item = this.getItemElementByItem(item);

        const itemWidth = $item.outerWidth(true);
        if(itemWidth === 0) {
            return null;
        }

        const itemHeight = $item.outerHeight(true);

        const viewPortWidth = this._itemContainer().innerWidth();
        const viewPortHeight = this._$scrollable.innerHeight();
        const viewPortScrollTop = this._$scrollable.scrollTop();
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

    _scrollToItem(item) {
        const layout = this._getLayoutModel();
        if(!layout) {
            return;
        }

        const itemRowIndex = Math.floor(this._getIndexByItem(item) / layout.itemPerRowCount);
        const itemTop = itemRowIndex * layout.itemHeight;
        const itemBottom = itemTop + layout.itemHeight;

        let newScrollTop = layout.viewPortScrollTop;

        if(itemTop < layout.viewPortScrollTop) {
            newScrollTop = itemTop;
        } else if(itemBottom > layout.viewPortScrollBottom) {
            newScrollTop = itemBottom - layout.viewPortHeight;
        }

        this._$scrollable.scrollTop(newScrollTop);
    }

    // #endregion layoutModel

    _focusOutHandler() {}

    _getItems() {
        return this.option('items') || [];
    }

    _getItemsLength() {
        return this._getItems().length;
    }

    _getIndexByItemElement(itemElement) {
        return this._editStrategy.getNormalizedIndex(itemElement);
    }

    _getItemByIndex(index) {
        return this._getItems()[index];
    }

    _focusItem(item, scrollToItem) {
        this.option('focusedElement', this.getItemElementByItem(item));
        if(scrollToItem) {
            this._scrollToItem(item);
        }
    }

    _focusItemByIndex(index, scrollToItem, eventArgs) {
        if(index >= 0 && index < this._getItemsLength()) {
            const item = this._getItemByIndex(index);
            this._focusItem(item, scrollToItem, eventArgs);
        }
    }

    getSelectedItems() {
        return this._selection.getSelectedItems();
    }

    getItemElementByItem(item) {
        return this._findItemElementByItem(item);
    }

    getItemByItemElement(itemElement) {
        return this._getItemByIndex(this._getIndexByItemElement(itemElement));
    }

    getFocusedItem() {
        return this.getItemByItemElement(this.option('focusedElement'));
    }

    selectAll() {
        this._selection.selectAll();
        this._isPreserveSelectionMode = true;
    }

    changeItemSelection(itemElement, options) {
        options = options || { control: this._isPreserveSelectionMode };
        this._selection.changeItemSelection(this._getIndexByItemElement(itemElement), options);
    }

    clearSelection() {
        this._selection.deselectAll();
    }

    clearFocus() { // ?
        this.option('focusedElement', null);
    }

}

module.exports = FileManagerThumbnailListBox;
