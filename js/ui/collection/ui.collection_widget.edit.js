import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import BaseCollectionWidget from './ui.collection_widget.base';
import errors from '../widget/ui.errors';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { noop } from '../../core/utils/common';
import { isDefined } from '../../core/utils/type';
import PlainEditStrategy from './ui.collection_widget.edit.strategy.plain';
import { compileGetter } from '../../core/utils/data';
import { DataSource } from '../../data/data_source/data_source';
import { normalizeLoadResult } from '../../data/data_source/utils';
import Selection from '../selection/selection';
import { when, Deferred, fromPromise } from '../../core/utils/deferred';

const ITEM_DELETING_DATA_KEY = 'dxItemDeleting';
const NOT_EXISTING_INDEX = -1;

const indexExists = function(index) {
    return index !== NOT_EXISTING_INDEX;
};

const CollectionWidget = BaseCollectionWidget.inherit({

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            selectedItem: true
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name CollectionWidgetOptions.selectionMode
            * @type string
            * @default 'none'
            * @acceptValues 'multiple'|'single'|'all'|'none'
            * @hidden
            */
            selectionMode: 'none',

            /**
            * @name CollectionWidgetOptions.selectionRequired
            * @type boolean
            * @default false
            * @hidden
            */
            selectionRequired: false,

            /**
            * @name CollectionWidgetOptions.selectionByClick
            * @type boolean
            * @default true
            * @hidden
            */
            selectionByClick: true,

            selectedItems: [],

            selectedItemKeys: [],

            maxFilterLengthInRequest: 1500,

            keyExpr: null,

            selectedIndex: NOT_EXISTING_INDEX,

            selectedItem: null,

            onSelectionChanged: null,

            /**
            * @name CollectionWidgetOptions.onItemReordered
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:DxElement
            * @type_function_param1_field6 itemIndex:number | object
            * @type_function_param1_field7 fromIndex:number
            * @type_function_param1_field8 toIndex:number
            * @action
            * @hidden
            */
            onItemReordered: null,

            /**
            * @name CollectionWidgetOptions.onItemDeleting
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:DxElement
            * @type_function_param1_field6 itemIndex:number | object
            * @type_function_param1_field7 cancel:boolean | Promise<void>
            * @action
            * @hidden
            */
            onItemDeleting: null,

            /**
            * @name CollectionWidgetOptions.onItemDeleted
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:DxElement
            * @type_function_param1_field6 itemIndex:number | object
            * @action
            * @hidden
            */
            onItemDeleted: null
        });
    },

    ctor: function(element, options) {
        this._userOptions = options || {};

        this.callBase(element, options);
    },

    _init: function() {
        this._initEditStrategy();

        this.callBase();

        this._initKeyGetter();

        this._initSelectionModule();
    },

    _initKeyGetter: function() {
        this._keyGetter = compileGetter(this.option('keyExpr'));
    },

    _getKeysByItems: function(selectedItems) {
        return this._editStrategy.getKeysByItems(selectedItems);
    },

    _getItemsByKeys: function(selectedItemKeys, selectedItems) {
        return this._editStrategy.getItemsByKeys(selectedItemKeys, selectedItems);
    },

    _getKeyByIndex: function(index) {
        return this._editStrategy.getKeyByIndex(index);
    },

    _getIndexByKey: function(key) {
        return this._editStrategy.getIndexByKey(key);
    },

    _getIndexByItemData: function(itemData) {
        return this._editStrategy.getIndexByItemData(itemData);
    },

    _isKeySpecified: function() {
        return !!(this._dataSource && this._dataSource.key());
    },

    _getCombinedFilter: function() {
        return this._dataSource && this._dataSource.filter();
    },

    key: function() {
        if(this.option('keyExpr')) return this.option('keyExpr');
        return this._dataSource && this._dataSource.key();
    },

    keyOf: function(item) {
        let key = item;
        const store = this._dataSource && this._dataSource.store();

        if(this.option('keyExpr')) {
            key = this._keyGetter(item);
        } else if(store) {
            key = store.keyOf(item);
        }

        return key;
    },

    _nullValueSelectionSupported: function() {
        return false;
    },

    _initSelectionModule: function() {
        const that = this;
        const itemsGetter = that._editStrategy.itemsGetter;

        this._selection = new Selection({
            allowNullValue: this._nullValueSelectionSupported(),
            mode: this.option('selectionMode'),
            maxFilterLengthInRequest: this.option('maxFilterLengthInRequest'),
            equalByReference: !this._isKeySpecified(),
            onSelectionChanged: function(args) {
                if(args.addedItemKeys.length || args.removedItemKeys.length) {
                    that.option('selectedItems', that._getItemsByKeys(args.selectedItemKeys, args.selectedItems));
                    that._updateSelectedItems(args);
                }
            },
            filter: that._getCombinedFilter.bind(that),
            totalCount: function() {
                const items = that.option('items');
                const dataSource = that._dataSource;
                return dataSource && dataSource.totalCount() >= 0 ? dataSource.totalCount() : items.length;
            },
            key: that.key.bind(that),
            keyOf: that.keyOf.bind(that),
            load: function(options) {
                if(that._dataSource) {
                    const loadOptions = that._dataSource.loadOptions();
                    options.customQueryParams = loadOptions.customQueryParams;
                    options.userData = that._dataSource._userData;
                }
                const store = that._dataSource && that._dataSource.store();

                if(store) {
                    return store.load(options).done(function(loadResult) {
                        if(that._disposed) {
                            return;
                        }

                        const items = normalizeLoadResult(loadResult).data;

                        that._dataSource._applyMapFunction(items);
                    });
                } else {
                    return new Deferred().resolve(this.plainItems());
                }
            },
            dataFields: function() {
                return that._dataSource && that._dataSource.select();
            },
            plainItems: itemsGetter.bind(that._editStrategy)
        });
    },

    _initEditStrategy: function() {
        const Strategy = PlainEditStrategy;
        this._editStrategy = new Strategy(this);
    },

    _getSelectedItemIndices: function(keys) {
        const that = this;
        const indices = [];

        keys = keys || this._selection.getSelectedItemKeys();

        that._editStrategy.beginCache();

        each(keys, function(_, key) {
            const selectedIndex = that._getIndexByKey(key);

            if(indexExists(selectedIndex)) {
                indices.push(selectedIndex);
            }
        });

        that._editStrategy.endCache();

        return indices;
    },

    _initMarkup: function() {
        this._rendering = true;
        if(!this._dataSource || !this._dataSource.isLoading()) {
            this._syncSelectionOptions().done(() => this._normalizeSelectedItems());
        }

        this.callBase();
    },
    _render: function() {
        this.callBase();

        this._rendering = false;
    },

    _fireContentReadyAction: function() {
        this._rendering = false;
        this._rendered = true;
        this.callBase.apply(this, arguments);
    },

    _syncSelectionOptions: function(byOption) {
        byOption = byOption || this._chooseSelectOption();

        let selectedItem;
        let selectedIndex;
        let selectedItemKeys;
        let selectedItems;

        switch(byOption) {
            case 'selectedIndex':
                selectedItem = this._editStrategy.getItemDataByIndex(this.option('selectedIndex'));

                if(isDefined(selectedItem)) {
                    this._setOptionWithoutOptionChange('selectedItems', [selectedItem]);
                    this._setOptionWithoutOptionChange('selectedItem', selectedItem);
                    this._setOptionWithoutOptionChange('selectedItemKeys', this._editStrategy.getKeysByItems([selectedItem]));
                } else {
                    this._setOptionWithoutOptionChange('selectedItems', []);
                    this._setOptionWithoutOptionChange('selectedItemKeys', []);
                    this._setOptionWithoutOptionChange('selectedItem', null);
                }
                break;

            case 'selectedItems':
                selectedItems = this.option('selectedItems') || [];
                selectedIndex = selectedItems.length ? this._editStrategy.getIndexByItemData(selectedItems[0]) : NOT_EXISTING_INDEX;

                if(this.option('selectionRequired') && !indexExists(selectedIndex)) {
                    return this._syncSelectionOptions('selectedIndex');
                }

                this._setOptionWithoutOptionChange('selectedItem', selectedItems[0]);
                this._setOptionWithoutOptionChange('selectedIndex', selectedIndex);
                this._setOptionWithoutOptionChange('selectedItemKeys', this._editStrategy.getKeysByItems(selectedItems));
                break;

            case 'selectedItem':
                selectedItem = this.option('selectedItem');
                selectedIndex = this._editStrategy.getIndexByItemData(selectedItem);

                if(this.option('selectionRequired') && !indexExists(selectedIndex)) {
                    return this._syncSelectionOptions('selectedIndex');
                }

                if(isDefined(selectedItem)) {
                    this._setOptionWithoutOptionChange('selectedItems', [selectedItem]);
                    this._setOptionWithoutOptionChange('selectedIndex', selectedIndex);
                    this._setOptionWithoutOptionChange('selectedItemKeys', this._editStrategy.getKeysByItems([selectedItem]));
                } else {
                    this._setOptionWithoutOptionChange('selectedItems', []);
                    this._setOptionWithoutOptionChange('selectedItemKeys', []);
                    this._setOptionWithoutOptionChange('selectedIndex', NOT_EXISTING_INDEX);
                }
                break;

            case 'selectedItemKeys':
                selectedItemKeys = this.option('selectedItemKeys');

                if(this.option('selectionRequired')) {
                    const selectedItemIndex = this._getIndexByKey(selectedItemKeys[0]);

                    if(!indexExists(selectedItemIndex)) {
                        return this._syncSelectionOptions('selectedIndex');
                    }
                }

                return this._selection.setSelection(selectedItemKeys);
        }

        return new Deferred().resolve().promise();
    },

    _chooseSelectOption: function() {
        let optionName = 'selectedIndex';

        const isOptionDefined = function(optionName) {
            const optionValue = this.option(optionName);
            const length = isDefined(optionValue) && optionValue.length;
            return length || optionName in this._userOptions;
        }.bind(this);

        if(isOptionDefined('selectedItems')) {
            optionName = 'selectedItems';
        } else if(isOptionDefined('selectedItem')) {
            optionName = 'selectedItem';
        } else if(isOptionDefined('selectedItemKeys')) {
            optionName = 'selectedItemKeys';
        }

        return optionName;
    },

    _compareKeys: function(oldKeys, newKeys) {
        if(oldKeys.length !== newKeys.length) {
            return false;
        }

        for(let i = 0; i < newKeys.length; i++) {
            if(oldKeys[i] !== newKeys[i]) {
                return false;
            }
        }

        return true;
    },

    _normalizeSelectedItems: function() {
        if(this.option('selectionMode') === 'none') {
            this._setOptionWithoutOptionChange('selectedItems', []);
            this._syncSelectionOptions('selectedItems');
        } else if(this.option('selectionMode') === 'single') {
            const newSelection = this.option('selectedItems');

            if(newSelection.length > 1 || !newSelection.length && this.option('selectionRequired') && this.option('items') && this.option('items').length) {
                const currentSelection = this._selection.getSelectedItems();
                let normalizedSelection = newSelection[0] === undefined ? currentSelection[0] : newSelection[0];

                if(normalizedSelection === undefined) {
                    normalizedSelection = this._editStrategy.itemsGetter()[0];
                }

                if(this.option('grouped') && normalizedSelection && normalizedSelection.items) {
                    normalizedSelection.items = [normalizedSelection.items[0]];
                }

                this._selection.setSelection(this._getKeysByItems([normalizedSelection]));

                this._setOptionWithoutOptionChange('selectedItems', [normalizedSelection]);

                return this._syncSelectionOptions('selectedItems');
            } else {
                this._selection.setSelection(this._getKeysByItems(newSelection));
            }
        } else {
            const newKeys = this._getKeysByItems(this.option('selectedItems'));
            const oldKeys = this._selection.getSelectedItemKeys();
            if(!this._compareKeys(oldKeys, newKeys)) {
                this._selection.setSelection(newKeys);
            }
        }

        return new Deferred().resolve().promise();
    },

    _itemClickHandler: function(e) {
        this._createAction((function(e) {
            this._itemSelectHandler(e.event);
        }).bind(this), {
            validatingTargetName: 'itemElement'
        })({
            itemElement: $(e.currentTarget),
            event: e
        });

        this.callBase.apply(this, arguments);
    },

    _itemSelectHandler: function(e) {
        if(!this.option('selectionByClick')) {
            return;
        }

        const $itemElement = e.currentTarget;

        if(this.isItemSelected($itemElement)) {
            this.unselectItem(e.currentTarget);
        } else {
            this.selectItem(e.currentTarget);
        }
    },

    _selectedItemElement: function(index) {
        return this._itemElements().eq(index);
    },

    _postprocessRenderItem: function(args) {
        if(this.option('selectionMode') !== 'none') {
            const $itemElement = $(args.itemElement);
            const normalizedItemIndex = this._editStrategy.getNormalizedIndex($itemElement);
            const isItemSelected = this._isItemSelected(normalizedItemIndex);

            this._processSelectableItem($itemElement, isItemSelected);
        }
    },

    _processSelectableItem: function($itemElement, isSelected) {
        $itemElement.toggleClass(this._selectedItemClass(), isSelected);
        this._setAriaSelected($itemElement, String(isSelected));
    },

    _updateSelectedItems: function(args) {
        const that = this;
        const addedItemKeys = args.addedItemKeys;
        const removedItemKeys = args.removedItemKeys;

        if(that._rendered && (addedItemKeys.length || removedItemKeys.length)) {
            const selectionChangePromise = that._selectionChangePromise;
            if(!that._rendering) {
                const addedSelection = [];
                let normalizedIndex;
                const removedSelection = [];

                that._editStrategy.beginCache();

                for(let i = 0; i < addedItemKeys.length; i++) {
                    normalizedIndex = that._getIndexByKey(addedItemKeys[i]);
                    addedSelection.push(normalizedIndex);
                    that._addSelection(normalizedIndex);
                }

                for(let i = 0; i < removedItemKeys.length; i++) {
                    normalizedIndex = that._getIndexByKey(removedItemKeys[i]);
                    removedSelection.push(normalizedIndex);
                    that._removeSelection(normalizedIndex);
                }

                that._editStrategy.endCache();

                that._updateSelection(addedSelection, removedSelection);
            }

            when(selectionChangePromise).done(function() {
                that._fireSelectionChangeEvent(args.addedItems, args.removedItems);
            });
        }
    },

    _fireSelectionChangeEvent: function(addedItems, removedItems) {
        this._createActionByOption('onSelectionChanged', {
            excludeValidators: ['disabled', 'readOnly']
        })({ addedItems: addedItems, removedItems: removedItems });
    },

    _updateSelection: noop,

    _setAriaSelected: function($target, value) {
        this.setAria('selected', value, $target);
    },

    _removeSelection: function(normalizedIndex) {
        const $itemElement = this._editStrategy.getItemElement(normalizedIndex);

        if(indexExists(normalizedIndex)) {
            this._processSelectableItem($itemElement, false);
            eventsEngine.triggerHandler($itemElement, 'stateChanged', false);
        }
    },

    _addSelection: function(normalizedIndex) {
        const $itemElement = this._editStrategy.getItemElement(normalizedIndex);

        if(indexExists(normalizedIndex)) {
            this._processSelectableItem($itemElement, true);
            eventsEngine.triggerHandler($itemElement, 'stateChanged', true);
        }
    },

    _isItemSelected: function(index) {
        const key = this._getKeyByIndex(index);
        return this._selection.isItemSelected(key, { checkPending: true });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'selectionMode':
                this._invalidate();
                break;
            case 'dataSource':
                if(!args.value || Array.isArray(args.value) && !args.value.length) {
                    this.option('selectedItemKeys', []);
                }

                this.callBase(args);
                break;
            case 'selectedIndex':
            case 'selectedItem':
            case 'selectedItems':
            case 'selectedItemKeys':
                this._syncSelectionOptions(args.name).done(() => this._normalizeSelectedItems());
                break;
            case 'keyExpr':
                this._initKeyGetter();
                break;
            case 'selectionRequired':
                this._normalizeSelectedItems();
                break;
            case 'selectionByClick':
            case 'onSelectionChanged':
            case 'onItemDeleting':
            case 'onItemDeleted':
            case 'onItemReordered':
            case 'maxFilterLengthInRequest':
                break;
            default:
                this.callBase(args);
        }
    },

    _clearSelectedItems: function() {
        this._setOptionWithoutOptionChange('selectedItems', []);
        this._syncSelectionOptions('selectedItems');
    },

    _waitDeletingPrepare: function($itemElement) {
        if($itemElement.data(ITEM_DELETING_DATA_KEY)) {
            return new Deferred().resolve().promise();
        }

        $itemElement.data(ITEM_DELETING_DATA_KEY, true);

        const deferred = new Deferred();
        const deletingActionArgs = { cancel: false };
        const deletePromise = this._itemEventHandler($itemElement, 'onItemDeleting', deletingActionArgs, { excludeValidators: ['disabled', 'readOnly'] });

        when(deletePromise).always((function(value) {
            const deletePromiseExists = !deletePromise;
            const deletePromiseResolved = !deletePromiseExists && deletePromise.state() === 'resolved';
            const argumentsSpecified = !!arguments.length;

            const shouldDelete = deletePromiseExists || deletePromiseResolved && !argumentsSpecified || deletePromiseResolved && value;

            when(fromPromise(deletingActionArgs.cancel))
                .always(function() {
                    $itemElement.data(ITEM_DELETING_DATA_KEY, false);
                })
                .done(function(cancel) {
                    shouldDelete && !cancel ? deferred.resolve() : deferred.reject();
                })
                .fail(deferred.reject);
        }).bind(this));

        return deferred.promise();
    },

    _deleteItemFromDS: function($item) {
        if(!this._dataSource) {
            return new Deferred().resolve().promise();
        }

        const deferred = new Deferred();
        const disabledState = this.option('disabled');
        const dataStore = this._dataSource.store();

        this.option('disabled', true);

        if(!dataStore.remove) {
            throw errors.Error('E1011');
        }

        dataStore.remove(dataStore.keyOf(this._getItemData($item)))
            .done(function(key) {
                if(key !== undefined) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            .fail(function() {
                deferred.reject();
            });

        deferred.always((function() {
            this.option('disabled', disabledState);
        }).bind(this));

        return deferred;
    },

    _tryRefreshLastPage: function() {
        const deferred = new Deferred();

        if(this._isLastPage() || this.option('grouped')) {
            deferred.resolve();
        } else {
            this._refreshLastPage().done(function() {
                deferred.resolve();
            });
        }

        return deferred.promise();
    },

    _refreshLastPage: function() {
        this._expectLastItemLoading();
        return this._dataSource.load();
    },

    _updateSelectionAfterDelete: function(index) {
        const key = this._getKeyByIndex(index);
        this._selection.deselect([key]);
    },

    _updateIndicesAfterIndex: function(index) {
        const itemElements = this._itemElements();
        for(let i = index + 1; i < itemElements.length; i++) {
            $(itemElements[i]).data(this._itemIndexKey(), i - 1);
        }
    },

    _simulateOptionChange: function(optionName) {
        const optionValue = this.option(optionName);

        if(optionValue instanceof DataSource) {
            return;
        }

        this._optionChangedAction({ name: optionName, fullName: optionName, value: optionValue });
    },

    /**
    * @name CollectionWidget.isItemSelected
    * @publicName isItemSelected(itemElement)
    * @param1 itemElement:Element
    * @return boolean
    * @hidden
    */
    isItemSelected: function(itemElement) {
        return this._isItemSelected(this._editStrategy.getNormalizedIndex(itemElement));
    },

    /**
    * @name CollectionWidget.selectItem
    * @publicName selectItem(itemElement)
    * @param1 itemElement:Element
    * @hidden
    */
    selectItem: function(itemElement) {
        if(this.option('selectionMode') === 'none') return;

        const itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
        if(!indexExists(itemIndex)) {
            return;
        }

        const key = this._getKeyByIndex(itemIndex);

        if(this._selection.isItemSelected(key)) {
            return;
        }

        if(this.option('selectionMode') === 'single') {
            this._selection.setSelection([key]);
        } else {
            const selectedItemKeys = this.option('selectedItemKeys') || [];
            this._selection.setSelection([...selectedItemKeys, key]);
        }
    },

    /**
    * @name CollectionWidget.unselectItem
    * @publicName unselectItem(itemElement)
    * @param1 itemElement:Element
    * @hidden
    */
    unselectItem: function(itemElement) {
        const itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
        if(!indexExists(itemIndex)) {
            return;
        }

        const selectedItemKeys = this._selection.getSelectedItemKeys();

        if(this.option('selectionRequired') && selectedItemKeys.length <= 1) {
            return;
        }

        const key = this._getKeyByIndex(itemIndex);

        if(!this._selection.isItemSelected(key, { checkPending: true })) {
            return;
        }

        this._selection.deselect([key]);
    },

    _deleteItemElementByIndex: function(index) {
        this._updateSelectionAfterDelete(index);
        this._updateIndicesAfterIndex(index);
        this._editStrategy.deleteItemAtIndex(index);
    },

    _afterItemElementDeleted: function($item, deletedActionArgs) {
        const changingOption = this._dataSource ? 'dataSource' : 'items';
        this._simulateOptionChange(changingOption);
        this._itemEventHandler($item, 'onItemDeleted', deletedActionArgs, {
            beforeExecute: function() {
                $item.remove();
            },
            excludeValidators: ['disabled', 'readOnly']
        });
        this._renderEmptyMessage();
    },

    /**
    * @name CollectionWidget.deleteItem
    * @publicName deleteItem(itemElement)
    * @param1 itemElement:Element
    * @return Promise<void>
    * @hidden
    */
    deleteItem: function(itemElement) {
        const that = this;

        const deferred = new Deferred();
        const $item = this._editStrategy.getItemElement(itemElement);
        const index = this._editStrategy.getNormalizedIndex(itemElement);
        const itemResponseWaitClass = this._itemResponseWaitClass();

        if(indexExists(index)) {
            this._waitDeletingPrepare($item).done(function() {
                $item.addClass(itemResponseWaitClass);
                const deletedActionArgs = that._extendActionArgs($item);
                that._deleteItemFromDS($item).done(function() {
                    that._deleteItemElementByIndex(index);
                    that._afterItemElementDeleted($item, deletedActionArgs);
                    that._tryRefreshLastPage().done(function() {
                        deferred.resolveWith(that);
                    });
                }).fail(function() {
                    $item.removeClass(itemResponseWaitClass);
                    deferred.rejectWith(that);
                });
            }).fail(function() {
                deferred.rejectWith(that);
            });
        } else {
            deferred.rejectWith(that);
        }

        return deferred.promise();
    },

    /**
    * @name CollectionWidget.reorderItem
    * @publicName reorderItem(itemElement, toItemElement)
    * @param1 itemElement:Element
    * @param2 toItemElement:Element
    * @return Promise<void>
    * @hidden
    */
    reorderItem: function(itemElement, toItemElement) {
        const deferred = new Deferred();

        const that = this;
        const strategy = this._editStrategy;

        const $movingItem = strategy.getItemElement(itemElement);
        const $destinationItem = strategy.getItemElement(toItemElement);
        const movingIndex = strategy.getNormalizedIndex(itemElement);
        const destinationIndex = strategy.getNormalizedIndex(toItemElement);

        const changingOption = this._dataSource ? 'dataSource' : 'items';

        const canMoveItems = indexExists(movingIndex) && indexExists(destinationIndex) && movingIndex !== destinationIndex;
        if(canMoveItems) {
            deferred.resolveWith(this);
        } else {
            deferred.rejectWith(this);
        }

        return deferred.promise().done(function() {
            $destinationItem[strategy.itemPlacementFunc(movingIndex, destinationIndex)]($movingItem);

            strategy.moveItemAtIndexToIndex(movingIndex, destinationIndex);
            this._updateIndicesAfterIndex(movingIndex);
            that.option('selectedItems', that._getItemsByKeys(that._selection.getSelectedItemKeys(), that._selection.getSelectedItems()));

            if(changingOption === 'items') {
                that._simulateOptionChange(changingOption);
            }
            that._itemEventHandler($movingItem, 'onItemReordered', {
                fromIndex: strategy.getIndex(movingIndex),
                toIndex: strategy.getIndex(destinationIndex)
            }, {
                excludeValidators: ['disabled', 'readOnly']
            });
        });
    }
});

export default CollectionWidget;
