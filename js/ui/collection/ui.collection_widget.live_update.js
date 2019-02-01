import $ from "../../core/renderer";
import CollectionWidget from "./ui.collection_widget.edit";
import { extend } from "../../core/utils/extend";
import { isDefined } from "../../core/utils/type";
import arrayUtils from "../../data/array_utils";
import { keysEqual } from "../../data/utils";
import { when } from "../../core/utils/deferred";
import { findChanges } from "../../core/utils/array_compare";
import { stringify } from "../../core/utils/stringify";
import { insertElement } from "../../core/dom_adapter";

export default CollectionWidget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            repaintChangesOnly: false
        });
    },

    ctor: function() {
        this.callBase.apply(this, arguments);

        this._customizeStoreLoadOptions = (e) => {
            if(this._correctionIndex && e.storeLoadOptions) {
                e.storeLoadOptions.skip += this._correctionIndex;
            }
        },

        this._dataSource && this._dataSource.on("customizeStoreLoadOptions", this._customizeStoreLoadOptions);
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
        var keyExpr = this.key();
        this.itemElements().each((_, item) => {
            let $item = $(item),
                itemData = this._getItemData($item);
            if(keyExpr ? keysEqual(keyExpr, this.keyOf(itemData), key) : this._isItemEquals(itemData, key)) {
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
        return stringify(item1) === stringify(item2);
    },

    _partialRefresh: function() {
        if(this.option("repaintChangesOnly")) {
            let result = findChanges(this._itemsCache, this._editStrategy.itemsGetter(), this.keyOf.bind(this), this._isItemEquals);
            if(result) {
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
        if(this.option("repaintChangesOnly")) {
            try {
                this._itemsCache = extend(true, [], this._editStrategy.itemsGetter());
            } catch(e) {
                this._itemsCache = extend([], this._editStrategy.itemsGetter());
            }
        }
    },

    _dispose: function() {
        this._dataSource && this._dataSource.off("customizeStoreLoadOptions", this._customizeStoreLoadOptions);
        this.callBase();
    },

    _updateByChange: function(keyInfo, items, change, isPartialRefresh) {
        if(isPartialRefresh) {
            this._renderItem(change.index, change.data, null, this._findItemElementByKey(change.key));
        } else {
            let changedItem = items[arrayUtils.indexByKey(keyInfo, items, change.key)];
            if(changedItem) {
                arrayUtils.update(keyInfo, items, change.key, change.data).done(() => {
                    this._renderItem(items.indexOf(changedItem), changedItem, null, this._findItemElementByKey(change.key));
                });
            }
        }
    },

    _insertByChange: function(keyInfo, items, change, isPartialRefresh) {
        when(isPartialRefresh || arrayUtils.insert(keyInfo, items, change.data, change.index)).done(() => {
            this._renderItem(isDefined(change.index) ? change.index : items.length, change.data);
            this._correctionIndex++;
        });
    },

    _removeByChange: function(keyInfo, items, change, isPartialRefresh) {
        let index = isPartialRefresh ? change.index : arrayUtils.indexByKey(keyInfo, items, change.key),
            removedItem = isPartialRefresh ? change.oldItem : items[index];
        if(removedItem) {
            let $removedItemElement = this._findItemElementByKey(change.key),
                deletedActionArgs = this._extendActionArgs($removedItemElement);

            this._waitDeletingPrepare($removedItemElement).done(()=>{
                if(isPartialRefresh) {
                    this._updateIndicesAfterIndex(index - 1);
                    this._afterItemElementDeleted($removedItemElement, deletedActionArgs);
                    this._normalizeSelectedItems();
                } else {
                    this._deleteItemElementByIndex(index);
                    this._afterItemElementDeleted($removedItemElement, deletedActionArgs);
                }
            });

            this._correctionIndex--;
        }
    },

    _modifyByChanges: function(changes, isPartialRefresh) {
        let items = this._editStrategy.itemsGetter(),
            keyInfo = { key: this.key.bind(this), keyOf: this.keyOf.bind(this) };
        changes.forEach(change => this[`_${change.type}ByChange`](keyInfo, items, change, isPartialRefresh));
        this._renderedItemsCount = items.length;
        this._refreshItemsCache();
        this._fireContentReadyAction();
    },

    _appendItemToContainer: function($container, $itemFrame, index) {
        let nextSiblingElement = $container.children(this._itemSelector()).get(index);
        insertElement($container.get(0), $itemFrame.get(0), nextSiblingElement);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "items":
                var isItemsUpdated = this._partialRefresh(args.value);
                if(!isItemsUpdated) {
                    this.callBase(args);
                }
                break;
            case "dataSource":
                if(!this.option("repaintChangesOnly") || !args.value) {
                    this.option("items", []);
                }

                this.callBase(args);
                break;
            case "repaintChangesOnly":
                break;
            default:
                this.callBase(args);
        }
    }
});
