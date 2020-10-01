import $ from '../../core/renderer';
import CollectionWidget from './ui.collection_widget.edit';
import { extend } from '../../core/utils/extend';
import { isDefined } from '../../core/utils/type';
import { update, insert, indexByKey } from '../../data/array_utils';
import dataUtils from '../../data/utils';
import { when } from '../../core/utils/deferred';
import { findChanges } from '../../core/utils/array_compare';
import domAdapter from '../../core/dom_adapter';
import { noop } from '../../core/utils/common';

const PRIVATE_KEY_FIELD = '__dx_key__';

export default CollectionWidget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            repaintChangesOnly: false
        });
    },

    ctor: function() {
        this.callBase.apply(this, arguments);

        this._customizeStoreLoadOptions = (e) => {
            const dataSource = this._dataSource;
            if(dataSource && !dataSource.isLoaded()) {
                this._correctionIndex = 0;
            }
            if(this._correctionIndex && e.storeLoadOptions) {
                e.storeLoadOptions.skip += this._correctionIndex;
            }
        },

        this._dataSource && this._dataSource.on('customizeStoreLoadOptions', this._customizeStoreLoadOptions);
    },

    reload: function() {
        this._correctionIndex = 0;
    },

    _init: function() {
        this.callBase();
        this._refreshItemsCache();
        this._correctionIndex = 0;
    },

    _findItemElementByKey: function(key) {
        let result = $();
        const keyExpr = this.key();
        this.itemElements().each((_, item) => {
            const $item = $(item);
            const itemData = this._getItemData($item);
            if(keyExpr ? dataUtils.keysEqual(keyExpr, this.keyOf(itemData), key) : this._isItemEquals(itemData, key)) {
                result = $item;
                return false;
            }
        });
        return result;
    },

    _dataSourceChangedHandler: function(newItems, e) {
        e && e.changes ? this._modifyByChanges(e.changes) : this.callBase(newItems, e);
    },

    _isItemEquals: function(item1, item2) {
        if(item1 && item1[PRIVATE_KEY_FIELD]) {
            item1 = item1.data;
        }
        try {
            return JSON.stringify(item1) === JSON.stringify(item2);
        } catch(e) {
            return item1 === item2;
        }
    },

    _partialRefresh: function() {
        if(this.option('repaintChangesOnly')) {
            const keyOf = (data) => {
                if(data && data[PRIVATE_KEY_FIELD] !== undefined) {
                    return data[PRIVATE_KEY_FIELD];
                }
                return this.keyOf(data);
            };
            const result = findChanges(this._itemsCache, this._editStrategy.itemsGetter(), keyOf, this._isItemEquals);
            if(result && this._itemsCache.length) {
                this._modifyByChanges(result, true);
                this._renderEmptyMessage();
                return true;
            } else {
                this._refreshItemsCache();
            }
        }
        return false;
    },

    _refreshItemsCache: function() {
        if(this.option('repaintChangesOnly')) {
            const items = this._editStrategy.itemsGetter();
            try {
                this._itemsCache = extend(true, [], items);
                if(!this.key()) {
                    this._itemsCache = this._itemsCache.map((itemCache, index) => {
                        return {
                            [PRIVATE_KEY_FIELD]: items[index],
                            data: itemCache
                        };
                    });
                }
            } catch(e) {
                this._itemsCache = extend([], items);
            }
        }
    },

    _dispose: function() {
        this._dataSource && this._dataSource.off('customizeStoreLoadOptions', this._customizeStoreLoadOptions);
        this.callBase();
    },

    _updateByChange: function(keyInfo, items, change, isPartialRefresh) {
        if(isPartialRefresh) {
            this._renderItem(change.index, change.data, null, this._findItemElementByKey(change.key));
        } else {
            const changedItem = items[indexByKey(keyInfo, items, change.key)];
            if(changedItem) {
                update(keyInfo, items, change.key, change.data).done(() => {
                    this._renderItem(items.indexOf(changedItem), changedItem, null, this._findItemElementByKey(change.key));
                });
            }
        }
    },

    _insertByChange: function(keyInfo, items, change, isPartialRefresh) {
        when(isPartialRefresh || insert(keyInfo, items, change.data, change.index)).done(() => {
            this._beforeItemElementInserted(change);
            this._renderItem(isDefined(change.index) ? change.index : items.length, change.data);
            this._afterItemElementInserted();
            this._correctionIndex++;
        });
    },

    _updateSelectionAfterRemoveByChange: function(removeIndex) {
        const selectedIndex = this.option('selectedIndex');

        if(selectedIndex > removeIndex) {
            this.option('selectedIndex', selectedIndex - 1);
        } else if(selectedIndex === removeIndex && this.option('selectedItems').length === 1) {
            this.option('selectedItems', []);
        } else {
            this._normalizeSelectedItems();
        }
    },

    _beforeItemElementInserted: function(change) {
        const selectedIndex = this.option('selectedIndex');

        if(change.index <= selectedIndex) {
            this.option('selectedIndex', selectedIndex + 1);
        }
    },

    _afterItemElementInserted: noop,

    _removeByChange: function(keyInfo, items, change, isPartialRefresh) {
        const index = isPartialRefresh ? change.index : indexByKey(keyInfo, items, change.key);
        const removedItem = isPartialRefresh ? change.oldItem : items[index];
        if(removedItem) {
            const $removedItemElement = this._findItemElementByKey(change.key);
            const deletedActionArgs = this._extendActionArgs($removedItemElement);

            this._waitDeletingPrepare($removedItemElement).done(()=>{
                if(isPartialRefresh) {
                    this._updateIndicesAfterIndex(index - 1);
                    this._afterItemElementDeleted($removedItemElement, deletedActionArgs);
                    this._updateSelectionAfterRemoveByChange(index);
                } else {
                    this._deleteItemElementByIndex(index);
                    this._afterItemElementDeleted($removedItemElement, deletedActionArgs);
                }
            });

            this._correctionIndex--;
        }
    },

    _modifyByChanges: function(changes, isPartialRefresh) {
        const items = this._editStrategy.itemsGetter();
        const keyInfo = { key: this.key.bind(this), keyOf: this.keyOf.bind(this) };
        const dataSource = this._dataSource;
        const paginate = dataSource && dataSource.paginate();
        const group = dataSource && dataSource.group();

        if(paginate || group) {
            changes = changes.filter(item => item.type !== 'insert' || item.index !== undefined);
        }

        changes.forEach(change => this[`_${change.type}ByChange`](keyInfo, items, change, isPartialRefresh));
        this._renderedItemsCount = items.length;
        this._refreshItemsCache();
        this._fireContentReadyAction();
    },

    _appendItemToContainer: function($container, $itemFrame, index) {
        const nextSiblingElement = $container.children(this._itemSelector()).get(index);
        domAdapter.insertElement($container.get(0), $itemFrame.get(0), nextSiblingElement);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'items': {
                const isItemsUpdated = this._partialRefresh(args.value);
                if(!isItemsUpdated) {
                    this.callBase(args);
                }
                break;
            }
            case 'dataSource':
                if(!this.option('repaintChangesOnly') || !args.value) {
                    this.option('items', []);
                }

                this.callBase(args);
                break;
            case 'repaintChangesOnly':
                break;
            default:
                this.callBase(args);
        }
    }
});
