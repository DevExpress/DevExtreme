import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { when } from "../../core/utils/deferred";
import eventsEngine from "../../events/core/events_engine";
import { addNamespace } from "../../events/utils";
import { name as contextMenuEventName } from "../../events/contextmenu";
import { getDisplayFileSize } from "./ui.file_manager.utils.js";
import messageLocalization from "../../localization/message";

import FileManagerItemListBase from "./ui.file_manager.item_list";

const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS = "dx-filemanager-thumbnails";
const FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS = "dx-filemanager-thumbnails-view-port";
const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS = "dx-filemanager-thumbnails-container";
const FILE_MANAGER_THUMBNAILS_ITEM_CLASS = "dx-filemanager-thumbnails-item";
const FILE_MANAGER_THUMBNAILS_ITEM_CONTENT_CLASS = "dx-filemanager-thumbnails-item-content";
const FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS = "dx-filemanager-thumbnails-item-thumbnail";
const FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS = "dx-filemanager-thumbnails-item-spacer";
const FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS = "dx-filemanager-thumbnails-item-name";
const FILE_MANAGER_ITEM_SELECTED_CLASS = "dx-filemanager-item-selected";
const FILE_MANAGER_ITEM_FOCUSED_CLASS = "dx-filemanager-item-focused";

const FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE = "dxFileManager_thumbnails";

class FileManagerThumbnailsItemList extends FileManagerItemListBase {

    _init() {
        this._items = [];
        this._currentLoadOperationId = 0;

        super._init();
    }

    _initMarkup() {
        super._initMarkup();

        const multipleSelection = this.option("selectionMode") === "multiple";
        const controllerOptions = {
            onSelectionChanged: this._raiseSelectionChanged.bind(this)
        };
        const controllerClass = multipleSelection ? MultipleSelectionController : SingleSelectionController;
        this._selectionController = new controllerClass(controllerOptions);

        this._$itemViewContainer = $("<div>").addClass(FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS);

        this._$viewPort = $("<div>").addClass(FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS);
        this._$viewPort.append(this._$itemViewContainer);

        this.$element().addClass(FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS);
        this.$element().append(this._$viewPort);

        const contextMenuEvent = addNamespace(contextMenuEventName, FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE);
        const clickEvent = addNamespace("click", FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE);
        eventsEngine.on(this.$element(), contextMenuEvent, this._onContextMenu.bind(this));
        eventsEngine.on(this.$element(), clickEvent, this._onClick.bind(this));

        this._loadItems();
    }

    _supportedKeys() {
        return extend(super._supportedKeys(), {
            rightArrow(e) {
                this._beforeKeyProcessing(e);
                this._processMoveArrow(1, true, e);
            },
            leftArrow(e) {
                this._beforeKeyProcessing(e);
                this._processMoveArrow(-1, true, e);
            },
            upArrow(e) {
                this._beforeKeyProcessing(e);
                this._processMoveArrow(-1, false, e);
            },
            downArrow(e) {
                this._beforeKeyProcessing(e);
                this._processMoveArrow(1, false, e);
            },
            home(e) {
                this._beforeKeyProcessing(e);
                this._selectItemByIndex(0, true, e);
            },
            end(e) {
                this._beforeKeyProcessing(e);
                this._selectItemByIndex(this._items.length - 1, true, e);
            },
            pageUp(e) {
                this._beforeKeyProcessing(e);
                this._processPageChange(true, e);
            },
            pageDown(e) {
                this._beforeKeyProcessing(e);
                this._processPageChange(false, e);
            },
            space(e) {
                this._beforeKeyProcessing(e);
                this._selectionController.invertFocusedItemSelection();
            },
            enter(e) {
                this._beforeKeyProcessing(e);
                this.tryOpen();
            },
            A(e) {
                this._beforeKeyProcessing(e);
                if(e.ctrlKey) {
                    this._selectAll();
                }
            }
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

            const newItemIndex = item._state.index + offset;
            this._selectItemByIndex(newItemIndex, true, eventArgs);
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

        const itemLayout = this._createItemLayoutModel(item._state.index);

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

        this._selectItemByIndex(newItemIndex, true, eventArgs);
    }

    _onClick(e) {
        const $item = $(e.target).closest(this._getItemSelector());
        if($item.length > 0) {
            this._selectItemByItemElement($item, e);
        } else {
            this.clearSelection();
        }
    }

    _onContextMenu(e) {
        e.preventDefault();
        this._onClick(e);

        const items = this.getSelectedItems();
        this._showContextMenu(items, e.target, e);
    }

    _selectItemByItemElement($item, e) {
        const index = $item.data("index");
        this._selectItemByIndex(index, false, e);
    }

    _getItemThumbnailCssClass() {
        return FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS;
    }

    _getItemSelector() {
        return `.${FILE_MANAGER_THUMBNAILS_ITEM_CLASS}`;
    }

    _onItemDblClick(e) {
        const $item = $(e.currentTarget);
        const index = $item.data("index");
        const item = this._items[index];
        this._raiseSelectedItemOpened(item);
    }

    _scrollToItem(item) {
        const layout = this._getLayoutModel();
        if(!layout) {
            return;
        }

        const itemRowIndex = Math.floor(item._state.index / layout.itemPerRowCount);
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
        const $item = item._state.$element;

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
        this._selectionController.selectAll();
    }

    _selectItem(item, scrollToItem, eventArgs) {
        this._selectionController.selectItem(item, eventArgs);
        if(scrollToItem) {
            this._scrollToItem(item);
        }
    }

    _selectItemByIndex(index, scrollToItem, eventArgs) {
        if(index >= 0 && index < this._items.length) {
            const item = this._items[index];
            this._selectItem(item, scrollToItem, eventArgs);
        }
    }

    _getFocusedItem() {
        return this._selectionController.getFocusedItem();
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
        this._selectionController.setItems(items);
        this._renderItems(items);
    }

    _renderItems(items) {
        this._$itemViewContainer.empty();

        for(let i = 0; i < items.length; i++) {
            const item = items[i];

            item._state = {
                index: i,
                selected: false,
                $element: null
            };
            this._renderItem(item);
        }
    }

    _renderItem(fileItemInfo) {
        const $item = $("<div>").addClass(FILE_MANAGER_THUMBNAILS_ITEM_CLASS)
            .attr("title", this._getTooltipText(fileItemInfo))
            .data("index", fileItemInfo._state.index);

        const $itemContent = $("<div>").addClass(FILE_MANAGER_THUMBNAILS_ITEM_CONTENT_CLASS);

        const $itemThumbnail = this._getItemThumbnailContainer(fileItemInfo);
        eventsEngine.on($itemThumbnail, "dragstart", this._disableDragging);

        const $itemSpacer = $("<div>").addClass(FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS);

        const $itemName = $("<div>")
            .addClass(FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS)
            .text(fileItemInfo.fileItem.name);

        $item.append($itemContent);
        $itemContent.append($itemThumbnail, $itemSpacer, $itemName);
        this._$itemViewContainer.append($item);

        fileItemInfo._state.$element = $item;
    }

    _getTooltipText(fileItemInfo) {
        const item = fileItemInfo.fileItem;
        if(item.tooltipText) {
            return item.tooltipText;
        }

        let text = `${item.name}\r\n`;
        if(!item.isDirectory) {
            text += `${messageLocalization.format("dxFileManager-listThumbnailsTooltipTextSize")}: ${getDisplayFileSize(item.size)}\r\n`;
        }
        text += `${messageLocalization.format("dxFileManager-listThumbnailsTooltipTextDateModified")}: ${item.dateModified}`;
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
        this._selectionController.clearSelection();
    }

    getSelectedItems() {
        return this._selectionController.getSelectedItems();
    }

}

class SingleSelectionController {

    constructor(options) {
        this._items = [];

        this._selectionChangedHandler = options.onSelectionChanged;
        this._selectionChanged = false;
    }

    selectAll() {

    }

    clearSelection() {
        this._beginUpdate();

        this._setAllItemsSelectedState(false);

        this._endUpdate();
    }

    selectItem(item, eventArgs) {
        this._beginUpdate();

        this._setAllItemsSelectedState(false, [item]);
        this._setItemSelectedState(item, true);

        this._endUpdate();
    }

    invertFocusedItemSelection(item) {

    }

    getFocusedItem() {
        const selectedItems = this.getSelectedItems();
        return selectedItems.length > 0 ? selectedItems[0] : null;
    }

    getSelectedItems() {
        return this._items.filter(item => item._state.selected);
    }

    setItems(items) {
        this._items = items;
    }

    _setItemSelectedState(item, selected) {
        if(item._state.selected === selected) {
            return;
        }

        item._state.selected = selected;
        item._state.$element.toggleClass(FILE_MANAGER_ITEM_SELECTED_CLASS, selected);

        this._selectionChanged = true;
    }

    _setAllItemsSelectedState(selected, exceptedItems) {
        for(let i = 0; i < this._items.length; i++) {
            const item = this._items[i];

            if(exceptedItems && exceptedItems.indexOf(item) !== -1) {
                continue;
            }

            this._setItemSelectedState(item, selected);
        }
    }

    _beginUpdate() {
        this._selectionChanged = false;
    }

    _endUpdate() {
        if(this._selectionChanged) {
            this._selectionChangedHandler();
            this._selectionChanged = false;
        }
    }

}

class MultipleSelectionController extends SingleSelectionController {

    constructor(options) {
        super(options);
        this._focusedItem = null;
    }

    selectAll() {
        this._beginUpdate();

        this._setAllItemsSelectedState(true);

        this._endUpdate();
    }

    selectItem(item, eventArgs) {
        this._beginUpdate();

        if(eventArgs.shiftKey) {
            this._setItemsRangeSelectedState(this._focusedItem._state.index, item._state.index, eventArgs.ctrlKey, true);
        } else if(eventArgs.ctrlKey) {
            const needSelect = this._items.length === 1 && this._focusedItem === item || !item._state.selected;
            this._setItemSelectedState(item, needSelect);
        } else {
            this._setAllItemsSelectedState(false, [item]);
            this._setItemSelectedState(item, true);
        }

        this._setFocusedItem(item);

        this._endUpdate();
    }

    _setItemsRangeSelectedState(startIndex, endIndex, invert, selected) {
        if(startIndex > endIndex) {
            const temp = endIndex;
            endIndex = startIndex;
            startIndex = temp;
        }

        for(let i = startIndex; i <= endIndex; i++) {
            const item = this._items[i];
            const actualSelected = invert ? !item._state.selected : selected;
            this._setItemSelectedState(item, actualSelected);
        }
    }

    _setFocusedItem(item) {
        if(this._focusedItem === item) {
            return;
        }

        if(this._focusedItem) {
            this._focusedItem._state.$element.removeClass(FILE_MANAGER_ITEM_FOCUSED_CLASS);
        }
        item._state.$element.addClass(FILE_MANAGER_ITEM_FOCUSED_CLASS);

        this._focusedItem = item;
    }

    invertFocusedItemSelection() {
        if(!this._focusedItem) {
            return;
        }

        this._beginUpdate();

        this._setItemSelectedState(this._focusedItem, !this._focusedItem._state.selected);

        this._endUpdate();
    }

    getFocusedItem() {
        return this._focusedItem;
    }

    setItems(items) {
        super.setItems(items);
        this._focusedItem = items.length > 0 ? items[0] : null;
    }

}

module.exports = FileManagerThumbnailsItemList;
