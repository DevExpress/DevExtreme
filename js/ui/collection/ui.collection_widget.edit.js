var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    BaseCollectionWidget = require("./ui.collection_widget.base"),
    errors = require("../widget/ui.errors"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    noop = require("../../core/utils/common").noop,
    isDefined = require("../../core/utils/type").isDefined,
    PlainEditStrategy = require("./ui.collection_widget.edit.strategy.plain"),
    compileGetter = require("../../core/utils/data").compileGetter,
    DataSource = require("../../data/data_source/data_source").DataSource,
    Selection = require("../selection/selection"),
    arrayUtils = require("../../data/array_utils"),
    dataUtils = require("../../data/utils"),
    keysEqual = dataUtils.keysEqual,
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    findChanges = require("../../core/utils/array_compare").findChanges;

var ITEM_DELETING_DATA_KEY = "dxItemDeleting",
    NOT_EXISTING_INDEX = -1;

var indexExists = function(index) {
    return index !== NOT_EXISTING_INDEX;
};

var CollectionWidget = BaseCollectionWidget.inherit({

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

            /**
            * @name CollectionWidgetOptions.selectedItems
            * @type Array<any>
            * @fires CollectionWidgetOptions.onSelectionChanged
            */
            selectedItems: [],

            /**
             * @name CollectionWidgetOptions.selectedItemKeys
             * @type Array<any>
             * @fires CollectionWidgetOptions.onSelectionChanged
             */
            selectedItemKeys: [],

            maxFilterLengthInRequest: 1500,

            /**
             * @name CollectionWidgetOptions.keyExpr
             * @type string|function
             * @default null
             */
            keyExpr: null,

            /**
            * @name CollectionWidgetOptions.selectedIndex
            * @type number
            * @default -1
            * @fires CollectionWidgetOptions.onSelectionChanged
            */
            selectedIndex: NOT_EXISTING_INDEX,

            /**
            * @name CollectionWidgetOptions.selectedItem
            * @type object
            * @default null
            * @fires CollectionWidgetOptions.onSelectionChanged
            * @ref
            */
            selectedItem: null,

            /**
            * @name CollectionWidgetOptions.onSelectionChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 addedItems:array<any>
            * @type_function_param1_field5 removedItems:array<any>
            * @action
            */
            onSelectionChanged: null,

            /**
            * @name CollectionWidgetOptions.onItemReordered
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
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
            * @type_function_param1_field5 itemElement:dxElement
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
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number | object
            * @action
            * @hidden
            */
            onItemDeleted: null,

            /**
            * @name CollectionWidgetOptions.repaintChangesOnly
            * @type boolean
            * @hidden
            */
            repaintChangesOnly: false
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

        if(this.option("selectionMode") === "multi") {
            this._showDeprecatedSelectionMode();
        }

        this._refreshItemsCache();
    },

    _initKeyGetter: function() {
        this._keyGetter = compileGetter(this.option("keyExpr"));
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
        if(this.option("keyExpr")) return this.option("keyExpr");
        return this._dataSource && this._dataSource.key();
    },

    keyOf: function(item) {
        var key = item,
            store = this._dataSource && this._dataSource.store();

        if(this.option("keyExpr")) {
            key = this._keyGetter(item);
        } else if(store) {
            key = store.keyOf(item);
        }

        return key;
    },

    _findItemElementByKey: function(key) {
        var result = $();
        this.itemElements().each(function(_, item) {
            var $item = $(item);
            if(keysEqual(this.key(), this.keyOf($item.data(this._itemDataKey())), key)) {
                result = $item;
                return false;
            }
        }.bind(this));

        return result;
    },

    _initSelectionModule: function() {
        var that = this,
            itemsGetter = that._editStrategy.itemsGetter;

        this._selection = new Selection({
            mode: this.option("selectionMode"),
            maxFilterLengthInRequest: this.option("maxFilterLengthInRequest"),
            equalByReference: !this._isKeySpecified(),
            onSelectionChanged: function(args) {
                if(args.addedItemKeys.length || args.removedItemKeys.length) {
                    that.option("selectedItems", that._getItemsByKeys(args.selectedItemKeys, args.selectedItems));
                    that._updateSelectedItems(args);
                }
            },
            filter: that._getCombinedFilter.bind(that),
            totalCount: function() {
                var items = that.option("items");
                var dataSource = that._dataSource;
                return dataSource && dataSource.totalCount() >= 0 ? dataSource.totalCount() : items.length;
            },
            key: that.key.bind(that),
            keyOf: that.keyOf.bind(that),
            load: function(options) {
                if(that._dataSource) {
                    var loadOptions = that._dataSource.loadOptions();
                    options.customQueryParams = loadOptions.customQueryParams;
                    options.userData = that._dataSource._userData;
                }
                var store = that._dataSource && that._dataSource.store();
                return store ? store.load(options).done(function(items) {
                    that._dataSource._applyMapFunction(items);
                }) : new Deferred().resolve([]);
            },
            dataFields: function() {
                return that._dataSource && that._dataSource.select();
            },
            plainItems: itemsGetter.bind(that._editStrategy)
        });
    },

    _initEditStrategy: function() {
        var Strategy = PlainEditStrategy;
        this._editStrategy = new Strategy(this);
    },

    _getSelectedItemIndices: function(keys) {
        var that = this,
            indices = [];

        keys = keys || this._selection.getSelectedItemKeys();

        that._editStrategy.beginCache();

        each(keys, function(_, key) {
            var selectedIndex = that._getIndexByKey(key);

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
            this._syncSelectionOptions();
            this._normalizeSelectedItems();
        }

        this.callBase();

        var selectedItemIndices = this._getSelectedItemIndices();
        this._renderSelection(selectedItemIndices, []);
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

        var selectedItem,
            selectedItems,
            selectedIndex;

        switch(byOption) {
            case "selectedIndex":
                selectedItem = this._editStrategy.getItemDataByIndex(this.option("selectedIndex"));

                if(isDefined(selectedItem)) {
                    this._setOptionSilent("selectedItems", [selectedItem]);
                    this._setOptionSilent("selectedItem", selectedItem);
                    this._setOptionSilent("selectedItemKeys", this._editStrategy.getKeysByItems([selectedItem]));
                } else {
                    this._setOptionSilent("selectedItems", []);
                    this._setOptionSilent("selectedItemKeys", []);
                    this._setOptionSilent("selectedItem", null);
                }
                break;
            case "selectedItems":
                selectedItems = this.option("selectedItems") || [];
                selectedIndex = this._editStrategy.getIndexByItemData(selectedItems[0]);

                if(this.option("selectionRequired") && !indexExists(selectedIndex)) {
                    this._syncSelectionOptions("selectedIndex");
                    return;
                }

                this._setOptionSilent("selectedItem", selectedItems[0]);
                this._setOptionSilent("selectedIndex", selectedIndex);
                this._setOptionSilent("selectedItemKeys", this._editStrategy.getKeysByItems(selectedItems));
                break;
            case "selectedItem":
                selectedItem = this.option("selectedItem");
                selectedIndex = this._editStrategy.getIndexByItemData(selectedItem);

                if(this.option("selectionRequired") && !indexExists(selectedIndex)) {
                    this._syncSelectionOptions("selectedIndex");
                    return;
                }

                if(isDefined(selectedItem)) {
                    this._setOptionSilent("selectedItems", [selectedItem]);
                    this._setOptionSilent("selectedIndex", selectedIndex);
                    this._setOptionSilent("selectedItemKeys", this._editStrategy.getKeysByItems([selectedItem]));
                } else {
                    this._setOptionSilent("selectedItems", []);
                    this._setOptionSilent("selectedItemKeys", []);
                    this._setOptionSilent("selectedIndex", NOT_EXISTING_INDEX);
                }
                break;
            case "selectedItemKeys":
                var selectedItemKeys = this.option("selectedItemKeys");
                if(this.option("selectionRequired") && !indexExists(this._getIndexByKey(selectedItemKeys[0]))) {
                    this._syncSelectionOptions("selectedIndex");
                    return;
                }
                this._selection.setSelection(selectedItemKeys);
                break;
        }
    },

    _chooseSelectOption: function() {
        var optionName = "selectedIndex";

        var isOptionDefined = function(optionName) {
            var optionValue = this.option(optionName),
                length = isDefined(optionValue) && optionValue.length;
            return length || optionName in this._userOptions;
        }.bind(this);

        if(isOptionDefined("selectedItems")) {
            optionName = "selectedItems";
        } else if(isOptionDefined("selectedItem")) {
            optionName = "selectedItem";
        } else if(isOptionDefined("selectedItemKeys")) {
            optionName = "selectedItemKeys";
        }

        return optionName;
    },

    _compareKeys: function(oldKeys, newKeys) {
        if(oldKeys.length !== newKeys.length) {
            return false;
        }

        for(var i = 0; i < newKeys.length; i++) {
            if(oldKeys[i] !== newKeys[i]) {
                return false;
            }
        }

        return true;
    },

    _normalizeSelectedItems: function() {
        if(this.option("selectionMode") === "none") {
            this._setOptionSilent("selectedItems", []);
            this._syncSelectionOptions("selectedItems");
        } else if(this.option("selectionMode") === "single") {
            var newSelection = this.option("selectedItems");

            if(newSelection.length > 1 || !newSelection.length && this.option("selectionRequired") && this.option("items") && this.option("items").length) {
                var currentSelection = this._selection.getSelectedItems();

                var normalizedSelection = newSelection[0] === undefined ? currentSelection[0] : newSelection[0];

                if(normalizedSelection === undefined) {
                    normalizedSelection = this._editStrategy.itemsGetter()[0];
                }

                if(this.option("grouped") && normalizedSelection && normalizedSelection.items) {
                    normalizedSelection.items = [normalizedSelection.items[0]];
                }

                this._selection.setSelection(this._getKeysByItems([normalizedSelection]));

                this._setOptionSilent("selectedItems", [normalizedSelection]);
                this._syncSelectionOptions("selectedItems");
            } else {
                this._selection.setSelection(this._getKeysByItems(newSelection));
            }
        } else {
            var newKeys = this._getKeysByItems(this.option("selectedItems"));
            var oldKeys = this._selection.getSelectedItemKeys();
            if(!this._compareKeys(oldKeys, newKeys)) {
                this._selection.setSelection(newKeys);
            }
        }
    },

    _renderSelection: noop,

    _itemClickHandler: function(e) {
        this._createAction((function(e) {
            this._itemSelectHandler(e.event);
        }).bind(this), {
            validatingTargetName: "itemElement"
        })({
            itemElement: $(e.currentTarget),
            event: e
        });

        this.callBase.apply(this, arguments);
    },

    _itemSelectHandler: function(e) {
        if(!this.option("selectionByClick")) {
            return;
        }

        var $itemElement = e.currentTarget;

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
        if(this.option("selectionMode") === "none") {
            return;
        }

        var $itemElement = $(args.itemElement);

        if(this._isItemSelected(this._editStrategy.getNormalizedIndex($itemElement))) {
            $itemElement.addClass(this._selectedItemClass());
            this._setAriaSelected($itemElement, "true");
        } else {
            this._setAriaSelected($itemElement, "false");
        }
    },

    _updateSelectedItems: function(args) {
        var that = this,
            addedItemKeys = args.addedItemKeys,
            removedItemKeys = args.removedItemKeys;

        if(that._rendered && (addedItemKeys.length || removedItemKeys.length)) {
            var selectionChangePromise = that._selectionChangePromise;
            if(!that._rendering) {
                var addedSelection = [],
                    normalizedIndex, i,
                    removedSelection = [];

                that._editStrategy.beginCache();

                for(i = 0; i < addedItemKeys.length; i++) {
                    normalizedIndex = that._getIndexByKey(addedItemKeys[i]);
                    addedSelection.push(normalizedIndex);
                    that._addSelection(normalizedIndex);
                }

                for(i = 0; i < removedItemKeys.length; i++) {
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
        this._createActionByOption("onSelectionChanged", {
            excludeValidators: ["disabled", "readOnly"]
        })({ addedItems: addedItems, removedItems: removedItems });
    },

    _updateSelection: function() {
        this._renderSelection.apply(this, arguments);
    },

    _setAriaSelected: function($target, value) {
        this.setAria("selected", value, $target);
    },

    _removeSelection: function(normalizedIndex) {
        var $itemElement = this._editStrategy.getItemElement(normalizedIndex);

        if(indexExists(normalizedIndex)) {
            $itemElement.removeClass(this._selectedItemClass());
            this._setAriaSelected($itemElement, "false");
            eventsEngine.triggerHandler($itemElement, "stateChanged", false);
        }
    },

    _showDeprecatedSelectionMode: function() {
        errors.log("W0001", this.NAME, "selectionMode: 'multi'", "16.1", "Use selectionMode: 'multiple' instead");
        this.option("selectionMode", "multiple");
    },

    _addSelection: function(normalizedIndex) {
        var $itemElement = this._editStrategy.getItemElement(normalizedIndex);

        if(indexExists(normalizedIndex)) {
            $itemElement.addClass(this._selectedItemClass());
            this._setAriaSelected($itemElement, "true");
            eventsEngine.triggerHandler($itemElement, "stateChanged", true);
        }
    },

    _isItemSelected: function(index) {
        var key = this._getKeyByIndex(index);
        return this._selection.isItemSelected(key);
    },

    _optionChanged: function(args) {
        if(this._cancelOptionChange === args.name) {
            return;
        }

        if(args.name === "items") {
            if(this.option("repaintChangesOnly")) {
                var that = this,
                    getKey = function(item) {
                        return that.keyOf(item);
                    },
                    isItemEquals = function(item1, item2) {
                        return JSON.stringify(item1) === JSON.stringify(item2);
                    };
                var oldItems = this._itemsCache,
                    newItems = args.value.slice();
                var result = findChanges(oldItems, newItems, getKey, isItemEquals);
                this._refreshItemsCache();
                if(result) {
                    this._modifyByChanges(result);
                    return;
                }
            }
        }

        switch(args.name) {
            case "selectionMode":
                if(args.value === "multi") {
                    this._showDeprecatedSelectionMode();
                } else {
                    this._invalidate();
                }
                break;
            case "dataSource":
                if(!args.value || Array.isArray(args.value) && !args.value.length) {
                    this.option("selectedItemKeys", []);
                }

                if(!this.option("repaintChangesOnly") || !args.value) {
                    this.option("items", []);
                }

                this.callBase(args);
                break;
            case "selectedIndex":
            case "selectedItem":
            case "selectedItems":
            case "selectedItemKeys":
                this._syncSelectionOptions(args.name);
                this._normalizeSelectedItems();
                break;
            case "keyExpr":
                this._initKeyGetter();
                break;
            case "selectionRequired":
                this._normalizeSelectedItems();
                break;
            case "selectionByClick":
            case "onSelectionChanged":
            case "onItemDeleting":
            case "onItemDeleted":
            case "onItemReordered":
            case "maxFilterLengthInRequest":
            case "repaintChangesOnly":
                break;
            default:
                this.callBase(args);
        }
    },

    _clearSelectedItems: function() {
        this._setOptionSilent("selectedItems", []);
        this._syncSelectionOptions("selectedItems");
    },

    // TODO: move this ability to component?
    _setOptionSilent: function(name, value) {
        this._cancelOptionChange = name;
        this.option(name, value);
        this._cancelOptionChange = false;
    },

    _waitDeletingPrepare: function($itemElement) {
        if($itemElement.data(ITEM_DELETING_DATA_KEY)) {
            return new Deferred().resolve().promise();
        }

        $itemElement.data(ITEM_DELETING_DATA_KEY, true);

        var deferred = new Deferred(),
            deletingActionArgs = { cancel: false },
            deletePromise = this._itemEventHandler($itemElement, "onItemDeleting", deletingActionArgs, { excludeValidators: ["disabled", "readOnly"] });

        when(deletePromise).always((function(value) {
            var deletePromiseExists = !deletePromise,
                deletePromiseResolved = !deletePromiseExists && deletePromise.state() === "resolved",
                argumentsSpecified = !!arguments.length,

                shouldDelete = deletePromiseExists || deletePromiseResolved && !argumentsSpecified || deletePromiseResolved && value;

            when(deferredUtils.fromPromise(deletingActionArgs.cancel))
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

        var deferred = new Deferred(),
            disabledState = this.option("disabled"),
            dataStore = this._dataSource.store();

        this.option("disabled", true);

        if(!dataStore.remove) {
            throw errors.Error("E1011");
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
            this.option("disabled", disabledState);
        }).bind(this));

        return deferred;
    },

    _tryRefreshLastPage: function() {
        var deferred = new Deferred();

        if(this._isLastPage() || this.option("grouped")) {
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
        var key = this._getKeyByIndex(index);
        this._selection.deselect([key]);
    },

    _updateIndicesAfterIndex: function(index) {
        var itemElements = this._itemElements();
        for(var i = index + 1; i < itemElements.length; i++) {
            $(itemElements[i]).data(this._itemIndexKey(), i - 1);
        }
    },

    _simulateOptionChange: function(optionName) {
        var optionValue = this.option(optionName);

        if(optionValue instanceof DataSource) {
            return;
        }

        this._optionChangedAction({ name: optionName, fullName: optionName, value: optionValue });
    },

    _refreshItemsCache: function() {
        if(this.option("repaintChangesOnly")) {
            this._itemsCache = extend(true, [], this.option("items"));
        }
    },

    _updateByChange: function(items, change) {
        if(change.oldItem) {
            this._renderItem(change.index, change.data, null, this._findItemElementByKey(change.key));
        } else {
            let changedItem = items[arrayUtils.indexByKey(this, items, change.key)];
            if(changedItem) {
                arrayUtils.update(this, items, change.key, change.data).done(() => {
                    this._renderItem(items.indexOf(changedItem), changedItem, null, this._findItemElementByItem(changedItem));
                });
            }
        }
    },

    _insertByChange: function(items, change) {
        when(change.index || arrayUtils.insert(this, items, change.data)).done(()=>{
            this._renderedItemsCount++;
            this._renderItem(this._renderedItemsCount, change.data);
        });
    },

    _removeByChange: function(items, change) {
        let index = change.index || arrayUtils.indexByKey(this, items, change.key),
            removedItem = change.oldItem || items[index];
        if(removedItem) {
            let $removedItemElement = this._findItemElementByKey(change.key),
                deletedActionArgs = this._extendActionArgs($removedItemElement);
            arrayUtils.remove(this, items, change.key).done(() => {
                this._renderedItemsCount--;
                this._deleteItemElement($removedItemElement, deletedActionArgs, index);
            });
        }
    },

    _modifyByChanges: function(changes) {
        const items = this._editStrategy.itemsGetter();
        changes.forEach(change => this[`_${change.type}ByChange`](items, change));
        this._renderedItemsCount = items.length;
    },

    /**
    * @name CollectionWidgetMethods.isItemSelected
    * @publicName isItemSelected(itemElement)
    * @param1 itemElement:Node
    * @return boolean
    * @hidden
    */
    isItemSelected: function(itemElement) {
        return this._isItemSelected(this._editStrategy.getNormalizedIndex(itemElement));
    },

    /**
    * @name CollectionWidgetMethods.selectItem
    * @publicName selectItem(itemElement)
    * @param1 itemElement:Node
    * @hidden
    */
    selectItem: function(itemElement) {
        if(this.option("selectionMode") === "none") return;

        var itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
        if(!indexExists(itemIndex)) {
            return;
        }

        var key = this._getKeyByIndex(itemIndex);

        if(this._selection.isItemSelected(key)) {
            return;
        }

        if(this.option("selectionMode") === "single") {
            this._selection.setSelection([key]);
        } else {
            var selectedItemKeys = this.option("selectedItemKeys");
            selectedItemKeys.push(key);
            this._selection.setSelection(selectedItemKeys);
        }
    },

    /**
    * @name CollectionWidgetMethods.unselectItem
    * @publicName unselectItem(itemElement)
    * @param1 itemElement:Node
    * @hidden
    */
    unselectItem: function(itemElement) {
        var itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
        if(!indexExists(itemIndex)) {
            return;
        }

        var selectedItemKeys = this._selection.getSelectedItemKeys();

        if(this.option("selectionRequired") && selectedItemKeys.length <= 1) {
            return;
        }

        var key = this._getKeyByIndex(itemIndex);

        if(!this._selection.isItemSelected(key)) {
            return;
        }

        this._selection.deselect([key]);
    },

    _deleteItemElement: function($item, deletedActionArgs, index) {
        var changingOption = this._dataSource ? "dataSource" : "items";
        this._updateSelectionAfterDelete(index);
        this._updateIndicesAfterIndex(index);
        this._editStrategy.deleteItemAtIndex(index);
        this._simulateOptionChange(changingOption);
        this._fireDeleted($item, deletedActionArgs);
        this._renderEmptyMessage();
    },

    _fireDeleted: function($item, deletedActionArgs) {
        this._itemEventHandler($item, "onItemDeleted", deletedActionArgs, {
            beforeExecute: function() {
                $item.detach();
            },
            excludeValidators: ["disabled", "readOnly"]
        });
    },

    /**
    * @name CollectionWidgetMethods.deleteItem
    * @publicName deleteItem(itemElement)
    * @param1 itemElement:Node
    * @return Promise<void>
    * @hidden
    */
    deleteItem: function(itemElement) {
        var that = this,

            deferred = new Deferred(),
            $item = this._editStrategy.getItemElement(itemElement),
            index = this._editStrategy.getNormalizedIndex(itemElement),
            itemResponseWaitClass = this._itemResponseWaitClass();

        if(indexExists(index)) {
            this._waitDeletingPrepare($item).done(function() {
                $item.addClass(itemResponseWaitClass);
                var deletedActionArgs = that._extendActionArgs($item);
                that._deleteItemFromDS($item).done(function() {
                    that._deleteItemElement($item, deletedActionArgs, index);
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
    * @name CollectionWidgetMethods.reorderItem
    * @publicName reorderItem(itemElement, toItemElement)
    * @param1 itemElement:Node
    * @param2 toItemElement:Node
    * @return Promise<void>
    * @hidden
    */
    reorderItem: function(itemElement, toItemElement) {
        var deferred = new Deferred(),

            that = this,
            strategy = this._editStrategy,

            $movingItem = strategy.getItemElement(itemElement),
            $destinationItem = strategy.getItemElement(toItemElement),
            movingIndex = strategy.getNormalizedIndex(itemElement),
            destinationIndex = strategy.getNormalizedIndex(toItemElement),

            changingOption = this._dataSource ? "dataSource" : "items";

        var canMoveItems = indexExists(movingIndex) && indexExists(destinationIndex) && movingIndex !== destinationIndex;
        if(canMoveItems) {
            deferred.resolveWith(this);
        } else {
            deferred.rejectWith(this);
        }

        return deferred.promise().done(function() {
            $destinationItem[strategy.itemPlacementFunc(movingIndex, destinationIndex)]($movingItem);

            strategy.moveItemAtIndexToIndex(movingIndex, destinationIndex);
            this._updateIndicesAfterIndex(movingIndex);
            that.option("selectedItems", that._getItemsByKeys(that._selection.getSelectedItemKeys(), that._selection.getSelectedItems()));

            if(changingOption === "items") {
                that._simulateOptionChange(changingOption);
            }
            that._itemEventHandler($movingItem, "onItemReordered", {
                fromIndex: strategy.getIndex(movingIndex),
                toIndex: strategy.getIndex(destinationIndex)
            }, {
                excludeValidators: ["disabled", "readOnly"]
            });
        });
    }
});

module.exports = CollectionWidget;
