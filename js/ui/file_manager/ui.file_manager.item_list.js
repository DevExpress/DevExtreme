import { extend } from '../../core/utils/extend';
import { name as dblClickName } from '../../events/double_click';
import { addNamespace } from '../../events/utils';
import eventsEngine from '../../events/core/events_engine';
import { getImageContainer } from '../../core/utils/icon';
import devices from '../../core/devices';

import CustomStore from '../../data/custom_store';
import Widget from '../widget/ui.widget';

const FILE_MANAGER_FILES_VIEW_CLASS = 'dx-filemanager-files-view';
const FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE = 'dxFileManager_open';

class FileManagerItemListBase extends Widget {

    _init() {
        this._initActions();
        super._init();
    }

    _initMarkup() {
        this._initActions();

        this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);

        const dblClickEventName = addNamespace(dblClickName, FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE);
        eventsEngine.on(this.$element(), dblClickEventName, this._getItemSelector(), this._onItemDblClick.bind(this));

        super._initMarkup();
    }

    _initActions() {
        this._actions = {
            onError: this._createActionByOption('onError'),
            onSelectionChanged: this._createActionByOption('onSelectionChanged'),
            onFocusedItemChanged: this._createActionByOption('onFocusedItemChanged'),
            onSelectedItemOpened: this._createActionByOption('onSelectedItemOpened')
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            selectionMode: 'single',
            selectedItemKeys: [],
            focusedItemKey: undefined,
            contextMenu: null,
            getItems: null,
            getItemThumbnail: null,
            onError: null,
            onSelectionChanged: null,
            onFocusedItemChanged: null,
            onSelectedItemOpened: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'selectionMode':
            case 'contextMenu':
            case 'getItems':
            case 'getItemThumbnail':
                this.repaint();
                break;
            case 'selectedItemKeys':
                this._setSelectedItemKeys(args.value);
                break;
            case 'focusedItemKey':
                this._setFocusedItemKey(args.value);
                break;
            case 'onError':
            case 'onSelectedItemOpened':
            case 'onSelectionChanged':
            case 'onFocusedItemChanged':
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    _getItems() {
        const itemsGetter = this.option('getItems');
        const itemsResult = itemsGetter ? itemsGetter() : [];

        return itemsResult.done(itemInfos => {
            this._itemCount = itemInfos.length;

            const parentDirectoryItem = this._findParentDirectoryItem(itemInfos);
            this._hasParentDirectoryItem = !!parentDirectoryItem;
            this._parentDirectoryItemKey = parentDirectoryItem ? parentDirectoryItem.fileItem.key : null;
        });
    }

    _raiseOnError(error) {
        this._actions.onError({ error });
    }

    _raiseSelectionChanged(args) {
        this._actions.onSelectionChanged(args);
    }

    _raiseFocusedItemChanged(args) {
        this._actions.onFocusedItemChanged(args);
    }

    _raiseSelectedItemOpened(fileItemInfo) {
        this._actions.onSelectedItemOpened({ fileItemInfo });
    }

    _tryRaiseSelectionChanged({ selectedItems, selectedItemKeys, currentSelectedItemKeys, currentDeselectedItemKeys }) {
        const parentDirectoryItem = this._findParentDirectoryItem(this.getSelectedItems());
        if(parentDirectoryItem) {
            this._deselectItem(parentDirectoryItem);
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

    _getItemThumbnail(fileInfo) {
        const itemThumbnailGetter = this.option('getItemThumbnail');
        return itemThumbnailGetter ? itemThumbnailGetter(fileInfo) : { thumbnail: '' };
    }

    _getItemThumbnailContainer(fileInfo) {
        const { thumbnail, cssClass } = this._getItemThumbnail(fileInfo);

        const $itemThumbnail = getImageContainer(thumbnail)
            .addClass(this._getItemThumbnailCssClass());

        if(cssClass) {
            $itemThumbnail.addClass(cssClass);
        }

        return $itemThumbnail;
    }

    _getItemThumbnailCssClass() {
        return '';
    }

    _getItemSelector() {

    }

    _onItemDblClick(e) {

    }

    _isDesktop() {
        return devices.real().deviceType === 'desktop';
    }

    _showContextMenu(items, element, offset) {
        this._contextMenu.showAt(items, element, offset);
    }

    get _contextMenu() {
        return this.option('contextMenu');
    }

    _findParentDirectoryItem(itemInfos) {
        for(let i = 0; i < itemInfos.length; i++) {
            const itemInfo = itemInfos[i];
            if(this._isParentDirectoryItem(itemInfo)) {
                return itemInfo;
            }
        }
        return null;
    }

    _getFileItemsForContextMenu(fileItem) {
        const result = this.getSelectedItems();

        if(this._isParentDirectoryItem(fileItem)) {
            result.push(fileItem);
        }

        return result;
    }

    _isParentDirectoryItem(itemInfo) {
        return itemInfo.fileItem.isParentFolder;
    }

    _hasValidKeys(keys) {
        return keys.length > 1 || keys.length === 1 && keys[0] !== this._parentDirectoryItemKey;
    }

    _filterOutParentDirectory(array, createNewArray) {
        return this._filterOutItemByPredicate(array, item => item.key === this._parentDirectoryItemKey, createNewArray);
    }

    _filterOutParentDirectoryKey(array, createNewArray) {
        return this._filterOutItemByPredicate(array, key => key === this._parentDirectoryItemKey, createNewArray);
    }

    _filterOutItemByPredicate(array, predicate, createNewArray) {
        let result = array;
        let index = -1;

        for(let i = 0; i < array.length; i++) {
            if(predicate(array[i])) {
                index = i;
                break;
            }
        }

        if(index !== -1) {
            if(createNewArray) {
                result = [...array];
            }
            result.splice(index, 1);
        }

        return result;
    }

    _isMultipleSelectionMode() {
        return this.option('selectionMode') === 'multiple';
    }

    _deselectItem(item) {}

    _setSelectedItemKeys(itemKeys) {
    }

    _setFocusedItemKey(itemKey) {
    }

    _createDataSource() {
        return {
            store: new CustomStore({
                key: 'fileItem.key',
                load: this._getItems.bind(this)
            })
        };
    }

    getSelectedItems() {

    }

    clearSelection() {

    }

    selectItem() {

    }

}

module.exports = FileManagerItemListBase;
