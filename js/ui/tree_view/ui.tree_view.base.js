"use strict";

var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter"),
    eventsEngine = require("../../events/core/events_engine"),
    messageLocalization = require("../../localization/message"),
    clickEvent = require("../../events/click"),
    commonUtils = require("../../core/utils/common"),
    windowUtils = require("../../core/utils/window"),
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    CheckBox = require("../check_box"),
    HierarchicalCollectionWidget = require("../hierarchical_collection/ui.hierarchical_collection_widget"),
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer"),
    dblclickEvent = require("../../events/double_click"),
    fx = require("../../animation/fx"),
    Scrollable = require("../scroll_view/ui.scrollable"),
    LoadIndicator = require("../load_indicator"),
    deferredUtils = require("../../core/utils/deferred"),
    Deferred = deferredUtils.Deferred,
    when = deferredUtils.when;

var WIDGET_CLASS = "dx-treeview",
    NODE_CONTAINER_CLASS = "dx-treeview-node-container",
    OPENED_NODE_CONTAINER_CLASS = "dx-treeview-node-container-opened",
    NODE_CLASS = "dx-treeview-node",
    ITEM_CLASS = "dx-treeview-item",
    ITEM_WITH_CHECKBOX_CLASS = "dx-treeview-item-with-checkbox",
    ITEM_WITHOUT_CHECKBOX_CLASS = "dx-treeview-item-without-checkbox",
    ITEM_DATA_KEY = "dx-treeview-item-data",
    IS_LEAF = "dx-treeview-node-is-leaf",
    EXPAND_EVENT_NAMESPACE = "dxTreeView_expand",
    TOGGLE_ITEM_VISIBILITY_CLASS = "dx-treeview-toggle-item-visibility",
    LOAD_INDICATOR_CLASS = "dx-treeview-loadindicator",
    LOAD_INDICATOR_WRAPPER_CLASS = "dx-treeview-loadindicator-wrapper",
    NODE_LOAD_INDICATOR_CLASS = "dx-treeview-node-loadindicator",
    TOGGLE_ITEM_VISIBILITY_OPENED_CLASS = "dx-treeview-toggle-item-visibility-opened",
    SELECT_ALL_ITEM_CLASS = "dx-treeview-select-all-item",
    DISABLED_STATE_CLASS = "dx-state-disabled",
    SELECTED_ITEM_CLASS = "dx-state-selected",

    DATA_ITEM_ID = "data-item-id";

var TreeViewBase = HierarchicalCollectionWidget.inherit({

    _supportedKeys: function(e) {
        var click = function(e) {
            var $itemElement = $(this.option("focusedElement"));

            if(!$itemElement.length) {
                return;
            }

            e.target = $itemElement;
            e.currentTarget = $itemElement;
            this._itemClickHandler(e, $itemElement.children("." + ITEM_CLASS));
        };

        var select = function(e) {
            e.preventDefault();
            this._changeCheckBoxState($(this.option("focusedElement")));
        };

        var toggleExpandedNestedItems = function(state, e) {
            if(!this.option("expandAllEnabled")) {
                return;
            }

            e.preventDefault();

            var $rootElement = $(this.option("focusedElement"));

            if(!$rootElement.length) {
                return;
            }

            var rootItem = this._getItemData($rootElement.find("." + ITEM_CLASS));
            this._toggleExpandedNestedItems([rootItem], state);
        };

        return extend(this.callBase(), {
            enter: this._showCheckboxes() ? select : click,
            space: this._showCheckboxes() ? select : click,
            asterisk: toggleExpandedNestedItems.bind(this, true),
            minus: toggleExpandedNestedItems.bind(this, false)
        });
    },

    _changeCheckBoxState: function($element) {
        var checkboxInstance = this._getCheckBoxInstance($element),
            currentState = checkboxInstance.option("value");
        if(!checkboxInstance.option("disabled")) {
            this._updateItemSelection(!currentState, $element.find("." + ITEM_CLASS).get(0), true, $element);
        }
    },

    _toggleExpandedNestedItems: function(items, state) {
        if(!items) {
            return;
        }

        for(var i = 0, len = items.length; i < len; i++) {
            var item = items[i],
                node = this._dataAdapter.getNodeByItem(item);

            this._toggleExpandedState(node, state);
            this._toggleExpandedNestedItems(item.items, state);
        }
    },

    _getNodeElement: function(node, cache) {
        var normalizedKey = commonUtils.normalizeKey(node.internalFields.key);
        if(cache) {
            if(!cache.$nodeByKey) {
                cache.$nodeByKey = {};
                this.$element().find(".dx-treeview-node").each(function() {
                    var $node = $(this),
                        key = $node.attr(DATA_ITEM_ID);
                    cache.$nodeByKey[key] = $node;
                });
            }
            return cache.$nodeByKey[normalizedKey] || $();
        }
        return this.$element().find("[" + DATA_ITEM_ID + "='" + normalizedKey + "']");
    },

    _activeStateUnit: "." + ITEM_CLASS,

    _widgetClass: function() {
        return WIDGET_CLASS;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTreeViewOptions.items
            * @type Array<dxTreeViewItemTemplate>
            * @inheritdoc
            */
            /**
            * @name dxTreeViewOptions.animationEnabled
            * @type boolean
            * @default true
            */
            animationEnabled: true,

            /**
            * @name dxTreeViewOptions.dataStructure
            * @type Enums.TreeViewDataStructure
            * @default 'tree'
            */
            dataStructure: "tree",

            /**
            * @name dxTreeViewOptions.expandAllEnabled
            * @type boolean
            * @default false
            */
            expandAllEnabled: false,

            /**
            * @name dxTreeViewOptions.hasItemsExpr
            * @type string|function
            * @default 'hasItems'
            */
            hasItemsExpr: "hasItems",

            /**
             * @name dxTreeViewOptions.selectNodesRecursive
             * @type boolean
             * @default true
             */
            selectNodesRecursive: true,

            /**
             * @name dxTreeViewOptions.expandNodesRecursive
             * @type boolean
             * @default true
             */
            expandNodesRecursive: true,

            /**
             * @name dxTreeViewOptions.showCheckBoxesMode
             * @type Enums.TreeViewCheckBoxMode
             * @default 'none'
             */
            showCheckBoxesMode: "none",

            /**
             * @name dxTreeViewOptions.selectAllText
             * @type string
             * @default "Select All"
             */
            selectAllText: messageLocalization.format("dxList-selectAll"),

            /**
            * @name dxTreeViewOptions.onItemSelectionChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field7 node:dxTreeViewNode
             * @type_function_param1_field8 itemElement:dxElement
            * @action
            */
            onItemSelectionChanged: null,

            /**
            * @name dxTreeViewOptions.onItemClick
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field7 node:dxTreeViewNode
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.onItemContextMenu
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field8 node:dxTreeViewNode
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.onItemRendered
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field8 node:dxTreeViewNode
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.onItemHold
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field8 node:dxTreeViewNode
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.onItemExpanded
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:Number
            * @type_function_param1_field7 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field8 event:event
            * @type_function_param1_field9 node:dxTreeViewNode
            * @action
            */
            onItemExpanded: null,

            /**
            * @name dxTreeViewOptions.onItemCollapsed
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:Number
            * @type_function_param1_field7 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field8 event:event
            * @type_function_param1_field9 node:dxTreeViewNode
            * @action
            */
            onItemCollapsed: null,

            /**
            * @name dxTreeViewOptions.scrollDirection
            * @type Enums.ScrollDirection
            * @default "vertical"
            */
            scrollDirection: "vertical",

            /**
            * @name dxTreeViewOptions.virtualModeEnabled
            * @type boolean
            * @default false
            */
            virtualModeEnabled: false,

            /**
            * @name dxTreeViewOptions.rootValue
            * @type Object
            * @default 0
            */
            rootValue: 0,

            focusStateEnabled: false,

            /**
             * @name dxTreeViewOptions.selectionMode
             * @type Enums.NavSelectionMode
             * @default "multiple"
             */
            selectionMode: "multiple",

            expandEvent: 'dblclick',

            /**
            * @name dxTreeViewOptions.selectByClick
            * @type boolean
            * @default false
            */
            selectByClick: false,

            /**
            * @name dxTreeViewOptions.createChildren
            * @type function
            * @type_function_param1 parentNode:dxTreeViewNode
            * @type_function_return Promise<any>|Array<Object>
            */
            createChildren: null,

            /**
             * @name dxTreeViewOptions.onSelectAllValueChanged
             * @extends Action
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 value:boolean
             * @action
             */
            onSelectAllValueChanged: null

            /**
             * @name dxTreeViewOptions.onSelectionChanged
             * @extends Action
             * @action
             */

            /**
            * @name dxTreeViewOptions.parentIdExpr
            * @type string|function
            * @default 'parentId'
            * @hidden false
            */

            /**
            * @name dxTreeViewOptions.expandedExpr
            * @type string|function
            * @default 'expanded'
            * @hidden false
            */

            /**
            * @name dxTreeViewOptions.selectedItem
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.selectedItems
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.selectedItemKeys
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.selectedIndex
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxTreeViewItemTemplate
            * @inherits CollectionWidgetItemTemplate
            * @type object
            */
            /**
            * @name dxTreeViewItemTemplate.selected
            * @type boolean
            * @default false
            */
            /**
            * @name dxTreeViewItemTemplate.expanded
            * @type boolean
            * @default false
            */
            /**
            * @name dxTreeViewItemTemplate.icon
            * @type String
            */
            /**
            * @name dxTreeViewItemTemplate.items
            * @type Array<dxTreeViewItemTemplate>
            */
            /**
            * @name dxTreeViewItemTemplate.parentId
            * @type number|string
            * @default undefined
            */
            /**
            * @name dxTreeViewItemTemplate.hasItems
            * @type boolean
            * @default undefined
            */
        });
    },

    // TODO: implement these functions
    _initSelectedItems: commonUtils.noop,
    _syncSelectionOptions: commonUtils.noop,

    _fireSelectionChanged: function() {
        var selectionChangePromise = this._selectionChangePromise;
        when(selectionChangePromise).done((function() {
            this._createActionByOption("onSelectionChanged", {
                excludeValidators: ["disabled", "readOnly"]
            })();
        }).bind(this));
    },

    _createSelectAllValueChangedAction: function() {
        this._selectAllValueChangedAction = this._createActionByOption("onSelectAllValueChanged", {
            excludeValidators: ["disabled", "readOnly"]
        });
    },

    _fireSelectAllValueChanged: function(value) {
        this._selectAllValueChangedAction({ value: value });
    },

    _checkBoxModeChange: function(value, previousValue) {
        if(previousValue === "none" || value === "none") {
            this.repaint();
            return;
        }

        var selectAllExists = this._$selectAllItem && this._$selectAllItem.length;
        switch(value) {
            case "selectAll":
                !selectAllExists && this._renderSelectAllItem();
                break;
            case "normal":
                if(selectAllExists) {
                    this._$selectAllItem.remove();
                    delete this._$selectAllItem;
                }
                break;
        }
    },

    _removeSelection: function() {
        var that = this;

        each(this._dataAdapter.getFullData(), function(_, node) {
            if(!that._hasChildren(node)) {
                return;
            }

            that._dataAdapter.toggleSelection(node.internalFields.key, false, true);
        });
    },

    _optionChanged: function(args) {
        var name = args.name,
            value = args.value,
            previousValue = args.previousValue;

        switch(name) {
            case "selectAllText":
                if(this._$selectAllItem) {
                    this._$selectAllItem.dxCheckBox("instance").option("text", value);
                }
                break;
            case "showCheckBoxesMode":
                this._checkBoxModeChange(value, previousValue);
                break;
            case "scrollDirection":
                this._scrollableContainer.option("direction", value);
                break;
            case "items":
                delete this._$selectAllItem;
                this.callBase(args);
                break;
            case "dataSource":
                this.callBase(args);
                this._initDataAdapter();
                this._filter = {};
                break;
            case "hasItemsExpr":
                this._initAccessors();
                this.repaint();
                break;
            case "expandEvent":
                this._initExpandEvent();
                break;
            case "dataStructure":
            case "rootValue":
            case "createChildren":
            case "expandNodesRecursive":
            case "onItemSelectionChanged":
            case "onItemExpanded":
            case "onItemCollapsed":
            case "expandAllEnabled":
            case "animationEnabled":
            case "virtualModeEnabled":
            case "selectByClick":
                break;
            case "onSelectAllValueChanged":
                this._createSelectAllValueChangedAction();
                break;
            case "selectNodesRecursive":
                this._dataAdapter.setOption("recursiveSelection", args.value);
                this.repaint();
                break;
            default:
                this.callBase(args);
        }
    },

    _initDataSource: function() {
        if(this._useCustomChildrenLoader()) {
            this._loadChildrenByCustomLoader(null).done(function(newItems) {
                if(newItems && newItems.length) {
                    this.option("items", newItems);
                }
            }.bind(this));
        } else {
            this.callBase();
            this._isVirtualMode() && this._initVirtualMode();
        }
    },

    _initVirtualMode: function() {
        var that = this,
            filter = that._filter;

        if(!filter.custom) {
            filter.custom = that._dataSource.filter();
        }

        if(!filter.internal) {
            filter.internal = [that.option("parentIdExpr"), that.option("rootValue")];
        }
    },

    _useCustomChildrenLoader: function() {
        return typeUtils.isFunction(this.option("createChildren")) && this._isDataStructurePlain();
    },

    _loadChildrenByCustomLoader: function(parentNode) {
        var invocationResult = this.option("createChildren").call(this, parentNode);

        if(Array.isArray(invocationResult)) {
            return new Deferred().resolve(invocationResult).promise();
        }

        if(invocationResult && typeUtils.isFunction(invocationResult.then)) {
            return deferredUtils.fromPromise(invocationResult);
        }

        return new Deferred().resolve([]).promise();
    },

    _combineFilter: function() {
        if(!this._filter.custom || !this._filter.custom.length) {
            return this._filter.internal;
        }

        return [this._filter.custom, this._filter.internal];
    },

    _dataSourceLoadErrorHandler: function() {
        this._renderEmptyMessage();
    },

    _init: function() {
        this._filter = {};
        this.callBase();

        this._initStoreChangeHandlers();
    },

    _dataSourceChangedHandler: function(newItems) {
        if(this._initialized && this._isVirtualMode() && this.option("items").length) {
            return;
        }

        this.option("items", newItems);
    },

    _removeTreeViewLoadIndicator: function() {
        if(!this._treeViewLoadIndicator) return;
        this._treeViewLoadIndicator.remove();
        this._treeViewLoadIndicator = null;
    },

    _createTreeViewLoadIndicator: function() {
        this._treeViewLoadIndicator = $("<div>").addClass(LOAD_INDICATOR_CLASS);
        this._createComponent(this._treeViewLoadIndicator, LoadIndicator, {});
        return this._treeViewLoadIndicator;
    },

    _dataSourceLoadingChangedHandler: function(isLoading) {
        var resultFilter;

        if(this._isVirtualMode()) {
            resultFilter = this._combineFilter();
            this._dataSource.filter(resultFilter);
        }

        if(isLoading && !this._dataSource.isLoaded()) {
            this.option("items", []);

            var $wrapper = $("<div>").addClass(LOAD_INDICATOR_WRAPPER_CLASS);

            this._createTreeViewLoadIndicator().appendTo($wrapper);

            this.itemsContainer().append($wrapper);

            if(this._isVirtualMode() && this._dataSource.filter() !== resultFilter) {
                this._dataSource.filter([]);
            }
        } else {
            this._removeTreeViewLoadIndicator();
        }
    },

    _initStoreChangeHandlers: function() {
        if(this.option("dataStructure") !== "plain") {
            return;
        }

        var that = this;
        this._dataSource && this._dataSource.store()
            .on("inserted", function(newItem) {
                that.option().items = that.option("items").concat(newItem);
                that._dataAdapter.addItem(newItem);

                if(!that._dataAdapter.isFiltered(newItem)) {
                    return;
                }

                that._updateLevel(that._parentIdGetter(newItem));
            })
            .on("removed", function(removedKey) {
                var node = that._dataAdapter.getNodeByKey(removedKey);

                that.option("items")[that._dataAdapter.getIndexByKey(node.internalFields.key)] = 0;
                that._markChildrenItemsToRemove(node);
                that._removeItems();

                that._dataAdapter.removeItem(removedKey);
                that._updateLevel(that._parentIdGetter(node));
            });
    },

    _markChildrenItemsToRemove: function(node) {
        var that = this,
            keys = node.internalFields.childrenKeys;

        each(keys, function(_, key) {
            that.option("items")[that._dataAdapter.getIndexByKey(key)] = 0;
            that._markChildrenItemsToRemove(that._dataAdapter.getNodeByKey(key));
        });
    },

    _removeItems: function() {
        var that = this,
            counter = 0,
            items = extend(true, [], this.option("items"));
        each(items, function(index, item) {
            if(!item) {
                that.option("items").splice(index - counter, 1);
                counter++;
            }
        });
    },

    _updateLevel: function(parentId) {
        var $container = this._getContainerByParentKey(parentId);

        this._renderItems($container, this._dataAdapter.getChildrenNodes(parentId));
    },

    _getOldContainer: function($itemElement) {
        if($itemElement.length) {
            return $itemElement.children("." + NODE_CONTAINER_CLASS);
        }

        if(this._scrollableContainer) {
            return this._scrollableContainer.$content().children();
        }

        return $();
    },

    _getContainerByParentKey: function(parentId) {
        var $container,
            node = this._dataAdapter.getNodeByKey(parentId),
            $itemElement = node ? this._getNodeElement(node) : [];

        this._getOldContainer($itemElement).remove();
        $container = this._renderNodeContainer($itemElement);

        if(this._isRootLevel(parentId)) {
            if(!this._scrollableContainer) this._renderScrollableContainer();
            this._scrollableContainer.$content().append($container);
        }

        return $container;
    },

    _isRootLevel: function(parentId) {
        return parentId === this.option("rootValue");
    },

    _getAccessors: function() {
        return ["key", "display", "selected", "expanded", "items", "parentId", "disabled", "hasItems"];
    },

    _getDataAdapterOptions: function() {
        return {
            rootValue: this.option("rootValue"),
            multipleSelection: !this._isSingleSelection(),
            recursiveSelection: this._isRecursiveSelection(),
            recursiveExpansion: this.option("expandNodesRecursive"),
            dataType: this.option("dataStructure"),
            sort: this._dataSource && this._dataSource.sort()
        };
    },

    _initMarkup: function() {
        this._renderScrollableContainer();
        this._renderEmptyMessage(this._dataAdapter.getRootNodes());
        this.callBase();
        this.setAria("role", "tree");
    },

    _renderContentImpl: function() {
        var $nodeContainer = this._renderNodeContainer();

        this._scrollableContainer.$content().append($nodeContainer);

        if(!this.option("items") || !this.option("items").length) {
            return;
        }
        this._renderItems($nodeContainer, this._dataAdapter.getRootNodes());

        this._initExpandEvent();

        if(this._selectAllEnabled()) {
            this._createSelectAllValueChangedAction();
            this._renderSelectAllItem($nodeContainer);
        }
    },

    _isVirtualMode: function() {
        return this.option("virtualModeEnabled") && this._isDataStructurePlain() && !!this.option("dataSource");
    },

    _isDataStructurePlain: function() {
        return this.option("dataStructure") === "plain";
    },

    _fireContentReadyAction: function() {
        this.callBase();

        if(this._scrollableContainer && windowUtils.hasWindow()) {
            this._scrollableContainer.update();
        }
    },

    _renderScrollableContainer: function() {
        this._scrollableContainer = this._createComponent($("<div>").appendTo(this.$element()), Scrollable, {
            direction: this.option("scrollDirection"),
            useKeyboard: false
        });
    },

    _renderNodeContainer: function($parent) {
        var $container = $("<ul>").addClass(NODE_CONTAINER_CLASS);

        this.setAria("role", "group", $container);

        if($parent && $parent.length) {
            var itemData = this._getItemData($parent.children("." + ITEM_CLASS));

            if(this._expandedGetter(itemData)) {
                $container.addClass(OPENED_NODE_CONTAINER_CLASS);
            }

            $container.appendTo($parent);
        }
        return $container;
    },

    _createDOMElement: function($nodeContainer, node) {
        var $node = $("<li>")
            .addClass(NODE_CLASS)
            .attr(DATA_ITEM_ID, commonUtils.normalizeKey(node.internalFields.key))
            .prependTo($nodeContainer);

        this.setAria({
            "role": "treeitem",
            "label": this._displayGetter(node.internalFields.item) || "",
            "expanded": node.internalFields.expanded || false,
            "level": this._getLevel($nodeContainer)
        }, $node);

        return $node;
    },

    _getLevel: function($nodeContainer) {
        var parent = $nodeContainer.parent();
        return parent.hasClass("dx-scrollable-content") ? 1 : parseInt(parent.attr("aria-level")) + 1;
    },

    _showCheckboxes: function() {
        return this.option("showCheckBoxesMode") !== "none";
    },

    _selectAllEnabled: function() {
        return this.option("showCheckBoxesMode") === "selectAll";
    },

    _renderItems: function($nodeContainer, nodes) {
        var length = nodes.length - 1;

        for(var i = length; i >= 0; i--) {
            this._renderItem(nodes[i], $nodeContainer);
        }

        this._renderFocusTarget();
    },

    _renderItem: function(node, $nodeContainer) {
        var $node = this._createDOMElement($nodeContainer, node),
            nodeData = node.internalFields,
            showCheckBox = this._showCheckboxes();

        $node.addClass(showCheckBox ? ITEM_WITH_CHECKBOX_CLASS : ITEM_WITHOUT_CHECKBOX_CLASS);
        showCheckBox && this._renderCheckBox($node, node);

        this.setAria("selected", nodeData.selected, $node);
        this._toggleSelectedClass($node, nodeData.selected);

        this.callBase(nodeData.key, nodeData.item, $node);

        if(nodeData.item.visible !== false) {
            this._renderChildren($node, node);
        }
    },

    _renderChildren: function($node, node) {
        if(!this._hasChildren(node)) {
            this._addLeafClass($node);
            return;
        }

        this._renderToggleItemVisibilityIcon($node, node);

        if(!node.internalFields.expanded) {
            return;
        }

        var that = this;
        that._loadSublevel(node).done(function(childNodes) {
            that._renderSublevel($node, that._getActualNode(node), childNodes);
        });
    },

    _getActualNode: function(cachedNode) {
        return this._dataAdapter.getNodeByKey(cachedNode.internalFields.key);
    },

    _hasChildren: function(node) {
        if(this._isVirtualMode() || this._useCustomChildrenLoader()) {
            return this._hasItemsGetter(node.internalFields.item) !== false;
        }

        return this.callBase(node);
    },

    _loadSublevel: function(node) {
        var deferred = new Deferred(),
            that = this,
            childrenNodes = that._getChildNodes(node);

        if(childrenNodes.length) {
            deferred.resolve(childrenNodes);
        } else {
            that._loadNestedItems(node).done(function(items) {
                deferred.resolve(that._dataAdapter.getNodesByItems(items));
            });
        }

        return deferred.promise();
    },

    _renderSublevel: function($node, node, childNodes) {
        var $nestedNodeContainer = this._renderNodeContainer($node, node);

        this._renderItems($nestedNodeContainer, childNodes);

        if(childNodes.length && !node.internalFields.selected) {
            var firstChild = childNodes[0];
            this._updateParentsState(firstChild, this._getNodeElement(firstChild));
        }

        this._normalizeIconState($node, childNodes.length);
        $nestedNodeContainer.addClass(OPENED_NODE_CONTAINER_CLASS);
    },

    _executeItemRenderAction: function(key, itemData, itemElement) {
        var node = this._dataAdapter.getNodeByKey(key);

        this._getItemRenderAction()({
            itemElement: itemElement,
            itemIndex: key,
            itemData: itemData,
            node: node
        });
    },

    _addLeafClass: function($node) {
        $node.addClass(IS_LEAF);
    },

    _initExpandEvent: function() {
        var that = this,
            expandedEventName = this._getEventNameByOption(this.option("expandEvent")),
            $itemsContainer = this._itemContainer(),
            itemSelector = this._itemSelector();

        eventsEngine.off($itemsContainer, "." + EXPAND_EVENT_NAMESPACE, itemSelector);
        eventsEngine.on($itemsContainer, expandedEventName, itemSelector, function(e) {
            var $nodeElement = $(e.currentTarget.parentNode);

            if(!$nodeElement.hasClass(IS_LEAF)) {
                that._toggleExpandedState(e.currentTarget, undefined, e);
            }
        });
    },

    _getEventNameByOption: function(name) {
        var event = name === "click" ? clickEvent : dblclickEvent;
        return eventUtils.addNamespace(event.name, EXPAND_EVENT_NAMESPACE);
    },

    _getNode: function(identifier) {
        if(!typeUtils.isDefined(identifier)) {
            return null;
        }

        if(identifier.internalFields) {
            return identifier;
        }

        if(typeUtils.isPrimitive(identifier)) {
            return this._dataAdapter.getNodeByKey(identifier);
        }

        var itemElement = $(identifier).get(0);
        if(!itemElement) {
            return null;
        }

        if(domAdapter.isElementNode(itemElement)) {
            return this._getNodeByElement(itemElement);
        }

        return this._dataAdapter.getNodeByItem(itemElement);
    },

    _getNodeByElement: function(itemElement) {
        var $node = $(itemElement).closest("." + NODE_CLASS),
            key = commonUtils.denormalizeKey($node.attr(DATA_ITEM_ID));

        return this._dataAdapter.getNodeByKey(key);
    },

    _toggleExpandedState: function(itemElement, state, e) {
        var node = this._getNode(itemElement),
            currentState = node.internalFields.expanded;

        if(node.internalFields.disabled || currentState === state) {
            return;
        }

        if(!typeUtils.isDefined(state)) {
            state = !currentState;
        }

        this._dataAdapter.toggleExpansion(node.internalFields.key, state);
        node.internalFields.expanded = state;

        if(this._hasChildren(node)) {
            var $node = this._getNodeElement(node);
            this._createLoadIndicator($node);
        }

        this._updateExpandedItemsUI(node, state, e);
    },

    _createLoadIndicator: function($node) {
        var $icon = $node.children("." + TOGGLE_ITEM_VISIBILITY_CLASS),
            $nodeContainer = $node.children("." + NODE_CONTAINER_CLASS);

        if($icon.hasClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS) || $nodeContainer.not(":empty").length) {
            return;
        }

        this._createComponent($("<div>").addClass(NODE_LOAD_INDICATOR_CLASS), LoadIndicator, {}).$element().appendTo($node);
        $icon.hide();
    },

    _renderToggleItemVisibilityIcon: function($node, node) {
        var $icon = $("<div>")
            .addClass(TOGGLE_ITEM_VISIBILITY_CLASS)
            .appendTo($node);

        if(node.internalFields.expanded) {
            $icon.addClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS);
            $node.parent().addClass(OPENED_NODE_CONTAINER_CLASS);
        }

        if(node.internalFields.disabled) {
            $icon.addClass(DISABLED_STATE_CLASS);
        }

        this._renderToggleItemVisibilityIconClick($icon, node);
    },

    _renderToggleItemVisibilityIconClick: function($icon, node) {
        var that = this;
        var eventName = eventUtils.addNamespace(clickEvent.name, that.NAME);

        eventsEngine.off($icon, eventName);
        eventsEngine.on($icon, eventName, function(e) {
            that._toggleExpandedState(node.internalFields.key, undefined, e);
        });
    },

    _updateExpandedItemsUI: function(node, state, e) {
        var $node = this._getNodeElement(node);

        if(!$node.length && this.option("expandNodesRecursive")) {
            this._updateExpandedItemsUI(this._getNode(node.internalFields.parentKey), state, e);
        }

        var $icon = $node.children("." + TOGGLE_ITEM_VISIBILITY_CLASS);
        var $nodeContainer = $node.children("." + NODE_CONTAINER_CLASS);

        $icon.toggleClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS, state);

        var nodeContainerExists = $nodeContainer.length > 0;

        if(!state || nodeContainerExists && !$nodeContainer.is(":empty")) {
            this._updateExpandedItem(node, state, e);
            return;
        }

        if(this._isVirtualMode() || this._useCustomChildrenLoader()) {
            this._loadNestedItemsWithUpdate(node, state, e);
            return;
        }

        this._renderSublevel($node, node, this._getChildNodes(node));
        this._fireContentReadyAction();
        this._updateExpandedItem(node, state, e);
    },

    _loadNestedItemsWithUpdate: function(node, state, e) {
        var that = this,
            $node = this._getNodeElement(node);

        that._loadNestedItems(node).done(function(items) {
            var actualNodeData = that._getActualNode(node);
            that._renderSublevel($node, actualNodeData, that._dataAdapter.getNodesByItems(items));

            if(!items || !items.length) {
                return;
            }

            that._fireContentReadyAction();
            that._updateExpandedItem(actualNodeData, state, e);
        });
    },

    _loadNestedItems: function(node) {
        var that = this;

        if(that._useCustomChildrenLoader()) {
            var publicNode = this._dataAdapter.getPublicNode(node);
            return that._loadChildrenByCustomLoader(publicNode).done(function(newItems) {
                that._appendItems(newItems);
            });
        }

        if(!that._isVirtualMode()) {
            return new Deferred().resolve([]).promise();
        }

        that._filter.internal = [that.option("parentIdExpr"), node.internalFields.key];
        that._dataSource.filter(that._combineFilter());

        return that._dataSource.load().done(function(newItems) {
            if(!that._areNodesExists(newItems)) {
                that._appendItems(newItems);
            }
        });
    },

    _areNodesExists: function(newItems, items) {
        var keyOfRootItem = this.keyOf(newItems[0]),
            fullData = this._dataAdapter.getFullData();

        return !!this._dataAdapter.getNodeByKey(keyOfRootItem, fullData);
    },

    _appendItems: function(newItems) {
        this.option().items = this.option("items").concat(newItems);
        this._initDataAdapter();
    },

    _updateExpandedItem: function(node, state, e) {
        this._animateNodeContainer(node, state, e);
    },

    _animateNodeContainer: function(node, state, e) {
        var $node = this._getNodeElement(node),
            $nodeContainer = $node.children("." + NODE_CONTAINER_CLASS),
            nodeHeight;

        // NOTE: The height of node container is should be used when the container is shown (T606878)
        $nodeContainer.addClass(OPENED_NODE_CONTAINER_CLASS);
        nodeHeight = $nodeContainer.height();

        fx.stop($nodeContainer, true);
        fx.animate($nodeContainer, {
            type: "custom",
            duration: this.option("animationEnabled") ? 400 : 0,
            from: {
                "maxHeight": state ? 0 : nodeHeight
            },
            to: {
                "maxHeight": state ? nodeHeight : 0
            },
            complete: (function() {
                $nodeContainer.css("maxHeight", "none");
                $nodeContainer.toggleClass(OPENED_NODE_CONTAINER_CLASS, state);
                this.setAria("expanded", state, $node);
                this._scrollableContainer.update();
                this._fireExpandedStateUpdatedEvent(state, node, e);
            }).bind(this)
        });
    },

    _fireExpandedStateUpdatedEvent: function(isExpanded, node, e) {
        var optionName = isExpanded ? "onItemExpanded" : "onItemCollapsed",
            target;

        if(!this._hasChildren(node)) {
            return;
        }

        if(typeUtils.isDefined(e)) {
            this._itemDXEventHandler(e, optionName, { node: this._dataAdapter.getPublicNode(node) });
        } else {
            target = this._getNodeElement(node);
            this._itemEventHandler(target, optionName, { event: e, node: this._dataAdapter.getPublicNode(node) });
        }
    },

    _normalizeIconState: function($node, hasNewItems) {
        var $loadIndicator = $node.find(".dx-loadindicator"),
            $icon;

        $loadIndicator.length && LoadIndicator.getInstance($loadIndicator).option("visible", false);

        if(hasNewItems) {
            $icon = $node.find("." + TOGGLE_ITEM_VISIBILITY_CLASS);
            $icon.show();
            return;
        }

        $node.find("." + TOGGLE_ITEM_VISIBILITY_CLASS).removeClass(TOGGLE_ITEM_VISIBILITY_CLASS);
        $node.addClass(IS_LEAF);
    },

    _emptyMessageContainer: function() {
        return this._scrollableContainer ? this._scrollableContainer.content() : this.callBase();
    },

    _renderContent: function() {
        var items = this.option("items");
        if(items && items.length) {
            this._contentAlreadyRendered = true;
        }

        this.callBase();
    },

    _renderSelectAllItem: function($container) {
        $container = $container || this.$element().find("." + NODE_CONTAINER_CLASS).first();

        this._$selectAllItem = $("<div>").addClass(SELECT_ALL_ITEM_CLASS);

        var value = this._dataAdapter.isAllSelected();
        this._createComponent(this._$selectAllItem, CheckBox, {
            value: value,
            text: this.option("selectAllText"),
            onValueChanged: function(args) {
                this._toggleSelectAll(args);
                this._fireSelectAllValueChanged(args.value);
            }.bind(this)
        });

        this._toggleSelectedClass(this._$selectAllItem, value);

        $container.before(this._$selectAllItem);
    },

    _toggleSelectAll: function(args) {
        this._dataAdapter.toggleSelectAll(args.value);
        this._updateItemsUI();
        this._fireSelectionChanged();
    },

    _renderCheckBox: function($node, node) {
        var $checkbox = $("<div>").appendTo($node);

        this._createComponent($checkbox, CheckBox, {
            value: node.internalFields.selected,
            onValueChanged: this._changeCheckboxValue.bind(this),
            focusStateEnabled: false,
            disabled: this._disabledGetter(node)
        });
    },

    _toggleSelectedClass: function($node, value) {
        $node.toggleClass(SELECTED_ITEM_CLASS, !!value);
    },

    _toggleNodeDisabledState: function(node, state) {
        var $node = this._getNodeElement(node),
            $item = $node.find("." + ITEM_CLASS).eq(0);

        this._dataAdapter.toggleNodeDisabledState(node.internalFields.key, state);

        $item.toggleClass(DISABLED_STATE_CLASS, !!state);

        if(this._showCheckboxes()) {
            var checkbox = this._getCheckBoxInstance($node);

            checkbox.option("disabled", !!state);
        }
    },

    _itemOptionChanged: function(item, property, value) {
        var node = this._dataAdapter.getNodeByItem(item);

        switch(property) {
            case this.option("disabledExpr"):
                this._toggleNodeDisabledState(node, value);
                break;
        }
    },

    _changeCheckboxValue: function(e) {
        var $node = $(e.element).parent("." + NODE_CLASS),
            $item = $node.children("." + ITEM_CLASS),
            item = this._getItemData($item),
            node = this._getNodeByElement($item),
            value = e.value;

        if(node && node.internalFields.selected === value) {
            return;
        }

        this._updateItemSelection(value, item, e.event);
    },

    _isSingleSelection: function() {
        return this.option("selectionMode") === "single";
    },

    _isRecursiveSelection: function() {
        return this.option("selectNodesRecursive") && this.option("selectionMode") !== "single";
    },

    _updateItemSelection: function(value, itemElement, dxEvent) {
        var that = this,
            node = that._getNode(itemElement);

        if(!node || node.internalFields.selected === value) {
            return;
        }

        if(that._isSingleSelection() && value) {
            var selectedNodesKeys = that.getSelectedNodesKeys();
            each(selectedNodesKeys, function(index, nodeKey) {
                that.unselectItem(nodeKey);
            });
        }

        that._dataAdapter.toggleSelection(node.internalFields.key, value);
        that._updateItemsUI();

        var initiator = dxEvent || that._findItemElementByItem(node.internalFields.item),
            handler = dxEvent ? that._itemDXEventHandler : that._itemEventHandler;

        handler.call(that, initiator, "onItemSelectionChanged", {
            node: that._dataAdapter.getPublicNode(node),
            itemData: node.internalFields.item
        });

        that._fireSelectionChanged();
    },

    _getCheckBoxInstance: function($node) {
        return $node.children(".dx-checkbox").dxCheckBox("instance");
    },

    _updateItemsUI: function() {
        var that = this,
            cache = {};

        each(this._dataAdapter.getData(), function(_, node) {
            var $node = that._getNodeElement(node, cache),
                nodeSelection = node.internalFields.selected;

            if(!$node.length) {
                return;
            }

            that._toggleSelectedClass($node, nodeSelection);
            that.setAria("selected", nodeSelection, $node);

            if(that._showCheckboxes()) {
                var checkbox = that._getCheckBoxInstance($node);
                checkbox.option("value", nodeSelection);
            }
        });

        if(this._selectAllEnabled()) {
            this._$selectAllItem.dxCheckBox("instance").option("value", this._dataAdapter.isAllSelected());
        }
    },

    _updateParentsState: function(node, $node) {
        var parentNode = this._dataAdapter.getNodeByKey(node.internalFields.parentKey);

        if(!$node) {
            return;
        }

        var $parentNode = $($node.parents("." + NODE_CLASS)[0]);

        if(this._showCheckboxes()) {
            var parentValue = parentNode.internalFields.selected;
            this._getCheckBoxInstance($parentNode).option("value", parentValue);
            this._toggleSelectedClass($parentNode, parentValue);
        }

        if(parentNode.internalFields.parentKey !== this.option("rootValue")) {
            this._updateParentsState(parentNode, $parentNode);
        }

    },

    _itemEventHandlerImpl: function(initiator, action, actionArgs) {
        var $itemElement = $(initiator).closest("." + NODE_CLASS).children("." + ITEM_CLASS);

        return action(extend(this._extendActionArgs($itemElement), actionArgs));
    },

    _itemContextMenuHandler: function(e) {
        this._createEventHandler("onItemContextMenu", e);
    },

    _itemHoldHandler: function(e) {
        this._createEventHandler("onItemHold", e);
    },

    _createEventHandler: function(eventName, e) {
        var node = this._getNodeByElement(e.currentTarget);

        this._itemDXEventHandler(e, eventName, { node: this._dataAdapter.getPublicNode(node) });
    },

    _itemClass: function() {
        return ITEM_CLASS;
    },

    _itemDataKey: function() {
        return ITEM_DATA_KEY;
    },

    _attachClickEvent: function() {
        var that = this;
        var clickSelector = "." + that._itemClass();
        var pointerDownSelector = "." + NODE_CLASS + ", ." + SELECT_ALL_ITEM_CLASS;
        var eventName = eventUtils.addNamespace(clickEvent.name, that.NAME);
        var pointerDownEvent = eventUtils.addNamespace(pointerEvents.down, that.NAME);
        var $itemContainer = that._itemContainer();

        eventsEngine.off($itemContainer, eventName, clickSelector);
        eventsEngine.off($itemContainer, pointerDownEvent, pointerDownSelector);
        eventsEngine.on($itemContainer, eventName, clickSelector, function(e) {
            that._itemClickHandler(e, $(this));
        });
        eventsEngine.on($itemContainer, pointerDownEvent, pointerDownSelector, function(e) {
            that._itemPointerDownHandler(e);
        });
    },

    _itemClickHandler: function(e, $item) {
        var itemData = this._getItemData($item),
            node = this._getNodeByElement($item);

        this._itemDXEventHandler(e, "onItemClick", { node: this._dataAdapter.getPublicNode(node) });

        if(this.option("selectByClick")) {
            this._updateItemSelection(!node.internalFields.selected, itemData, e);
        }
    },

    _updateSelectionToFirstItem: function($items, startIndex) {
        var itemIndex = startIndex;

        while(itemIndex >= 0) {
            var $item = $($items[itemIndex]);
            this._updateItemSelection(true, $item.find("." + ITEM_CLASS).get(0));
            itemIndex--;
        }
    },

    _updateSelectionToLastItem: function($items, startIndex) {
        var itemIndex = startIndex,
            length = $items.length;

        while(itemIndex < length) {
            var $item = $($items[itemIndex]);
            this._updateItemSelection(true, $item.find("." + ITEM_CLASS).get(0));
            itemIndex++;
        }
    },

    _focusInHandler: function(e) {
        var that = this;

        that._updateFocusState(e, true);

        if(that.option("focusedElement")) {
            clearTimeout(that._setFocusedItemTimeout);

            that._setFocusedItemTimeout = setTimeout(function() {
                that._setFocusedItem($(that.option("focusedElement")));
            });

            return;
        }

        var $activeItem = that._getActiveItem();
        that.option("focusedElement", getPublicElement($activeItem.closest("." + NODE_CLASS)));
    },

    _setFocusedItem: function($target) {
        if(!$target || !$target.length) {
            return;
        }

        if(!$target.children().hasClass(DISABLED_STATE_CLASS)) {
            this.callBase($target);
        }

        this._scrollableContainer.scrollToElement($target.find("." + ITEM_CLASS).first());
    },

    _itemPointerDownHandler: function(e) {
        if(!this.option("focusStateEnabled")) {
            return;
        }

        var $target = $(e.target).closest("." + NODE_CLASS + ", ." + SELECT_ALL_ITEM_CLASS);

        if(!$target.length) {
            return;
        }

        var itemElement = $target.hasClass(DISABLED_STATE_CLASS) ? null : $target;
        this.option("focusedElement", getPublicElement(itemElement));
    },

    _findNonDisabledNodes: function($nodes) {
        return $nodes.not(function() {
            return $(this).children("." + ITEM_CLASS).hasClass(DISABLED_STATE_CLASS);
        });
    },

    _moveFocus: function(location, e) {
        var FOCUS_UP = "up",
            FOCUS_DOWN = "down",
            FOCUS_FIRST = "first",
            FOCUS_LAST = "last",
            FOCUS_LEFT = this.option("rtlEnabled") ? "right" : "left",
            FOCUS_RIGHT = this.option("rtlEnabled") ? "left" : "right";

        this.$element().find("." + NODE_CONTAINER_CLASS).each(function() {
            fx.stop(this, true);
        });

        var $items = this._findNonDisabledNodes(this._nodeElements());

        if(!$items || !$items.length) {
            return;
        }

        switch(location) {
            case FOCUS_UP:
                var $prevItem = this._prevItem($items);

                this.option("focusedElement", getPublicElement($prevItem));
                if(e.shiftKey && this._showCheckboxes()) {
                    this._updateItemSelection(true, $prevItem.find("." + ITEM_CLASS).get(0));
                }
                break;
            case FOCUS_DOWN:
                var $nextItem = this._nextItem($items);

                this.option("focusedElement", getPublicElement($nextItem));
                if(e.shiftKey && this._showCheckboxes()) {
                    this._updateItemSelection(true, $nextItem.find("." + ITEM_CLASS).get(0));
                }
                break;
            case FOCUS_FIRST:
                var $firstItem = $items.first();

                if(e.shiftKey && this._showCheckboxes()) {
                    this._updateSelectionToFirstItem($items, $items.index(this._prevItem($items)));
                }

                this.option("focusedElement", getPublicElement($firstItem));
                break;
            case FOCUS_LAST:
                var $lastItem = $items.last();

                if(e.shiftKey && this._showCheckboxes()) {
                    this._updateSelectionToLastItem($items, $items.index(this._nextItem($items)));
                }

                this.option("focusedElement", getPublicElement($lastItem));
                break;
            case FOCUS_RIGHT:
                this._expandFocusedContainer();
                break;
            case FOCUS_LEFT:
                this._collapseFocusedContainer();
                break;
            default:
                this.callBase.apply(this, arguments);
                return;
        }
    },

    _nodeElements: function() {
        return this.$element()
            .find("." + NODE_CLASS)
            .not(":hidden");
    },

    _expandFocusedContainer: function() {
        var $focusedNode = $(this.option("focusedElement"));
        if(!$focusedNode.length || $focusedNode.hasClass(IS_LEAF)) {
            return;
        }

        var $node = $focusedNode.find("." + NODE_CONTAINER_CLASS).eq(0);

        if($node.hasClass(OPENED_NODE_CONTAINER_CLASS)) {
            var $nextItem = this._nextItem(this._findNonDisabledNodes(this._nodeElements()));
            this.option("focusedElement", getPublicElement($nextItem));
            return;
        }

        var node = this._getNodeByElement($focusedNode.children("." + ITEM_CLASS));
        this._toggleExpandedState(node, true);
    },

    _getClosestNonDisabledNode: function($node) {
        do {
            $node = $node.parent().closest("." + NODE_CLASS);
        } while($node.children(".dx-treeview-item.dx-state-disabled").length);

        return $node;
    },

    _collapseFocusedContainer: function() {
        var $focusedNode = $(this.option("focusedElement"));

        if(!$focusedNode.length) {
            return;
        }

        var nodeElement = $focusedNode.find("." + NODE_CONTAINER_CLASS).eq(0);

        if(!$focusedNode.hasClass(IS_LEAF) && nodeElement.hasClass(OPENED_NODE_CONTAINER_CLASS)) {
            var node = this._getNodeByElement($focusedNode.children("." + ITEM_CLASS));
            this._toggleExpandedState(node, false);
        } else {
            var collapsedNode = this._getClosestNonDisabledNode($focusedNode);
            collapsedNode.length && this.option("focusedElement", getPublicElement(collapsedNode));
        }
    },

    /**
    * @name dxTreeViewMethods.updateDimensions
    * @publicName updateDimensions()
    * @return Promise<void>
    */
    updateDimensions: function() {
        var that = this,
            deferred = new Deferred();

        if(that._scrollableContainer) {
            that._scrollableContainer.update().done(function() {
                deferred.resolveWith(that);
            });
        } else {
            deferred.resolveWith(that);
        }

        return deferred.promise();
    },

    /**
    * @name dxTreeViewMethods.selectItem
    * @publicName selectItem(itemElement)
    * @param1 itemElement:Node
    */
    /**
    * @name dxTreeViewMethods.selectItem
    * @publicName selectItem(itemData)
    * @param1 itemData:Object
    */
    /**
    * @name dxTreeViewMethods.selectItem
    * @publicName selectItem(key)
    * @param1 key:any
    */
    selectItem: function(itemElement) {
        this._updateItemSelection(true, itemElement);
    },

    /**
    * @name dxTreeViewMethods.unselectItem
    * @publicName unselectItem(itemElement)
    * @param1 itemElement:Node
    */
    /**
    * @name dxTreeViewMethods.unselectItem
    * @publicName unselectItem(itemData)
    * @param1 itemData:Object
    */
    /**
    * @name dxTreeViewMethods.unselectItem
    * @publicName unselectItem(key)
    * @param1 key:any
    */
    unselectItem: function(itemElement) {
        this._updateItemSelection(false, itemElement);
    },

    /**
    * @name dxTreeViewMethods.expandItem
    * @publicName expandItem(itemElement)
    * @param1 itemElement:Node
    */
    /**
    * @name dxTreeViewMethods.expandItem
    * @publicName expandItem(itemData)
    * @param1 itemData:Object
    */
    /**
    * @name dxTreeViewMethods.expandItem
    * @publicName expandItem(key)
    * @param1 key:any
    */
    expandItem: function(itemElement) {
        this._toggleExpandedState(itemElement, true);
    },

    /**
    * @name dxTreeViewMethods.collapseItem
    * @publicName collapseItem(itemElement)
    * @param1 itemElement:Node
    */
    /**
    * @name dxTreeViewMethods.collapseItem
    * @publicName collapseItem(itemData)
    * @param1 itemData:Object
    */
    /**
    * @name dxTreeViewMethods.collapseItem
    * @publicName collapseItem(key)
    * @param1 key:any
    */
    collapseItem: function(itemElement) {
        this._toggleExpandedState(itemElement, false);
    },

    /**
    * @name dxTreeViewMethods.getNodes
    * @publicName getNodes()
    * @return Array<dxTreeViewNode>
    */
         /**
         * @name dxTreeViewNode
         * @type object
         */
         /**
         * @name dxTreeViewNode.children
         * @type Array<dxTreeViewNode>
         */

         /**
         * @name dxTreeViewNode.disabled
         * @type boolean
         */

         /**
         * @name dxTreeViewNode.expanded
         * @type boolean
         */

         /**
         * @name dxTreeViewNode.itemData
         * @type object
         */

         /**
         * @name dxTreeViewNode.key
         * @type any
         */

         /**
         * @name dxTreeViewNode.parent
         * @type dxTreeViewNode
         */

         /**
         * @name dxTreeViewNode.selected
         * @type boolean
         */

         /**
         * @name dxTreeViewNode.text
         * @type string
         */

    getNodes: function() {
        return this._dataAdapter.getTreeNodes();
    },

    getSelectedNodesKeys: function() {
        return this._dataAdapter.getSelectedNodesKeys();
    },

    /**
    * @name dxTreeViewMethods.selectAll
    * @publicName selectAll()
    */
    selectAll: function() {
        if(this._selectAllEnabled()) {
            this._$selectAllItem.dxCheckBox("instance").option("value", true);
        } else {
            this._toggleSelectAll({ value: true });
        }
    },

    /**
    * @name dxTreeViewMethods.unselectAll
    * @publicName unselectAll()
    */
    unselectAll: function() {
        if(this._selectAllEnabled()) {
            this._$selectAllItem.dxCheckBox("instance").option("value", false);
        } else {
            this._toggleSelectAll({ value: false });
        }
    },

    /**
    * @name dxTreeViewMethods.expandAll
    * @publicName expandAll()
    */
    expandAll: function() {
        each(this._dataAdapter.getData(), (function(_, node) {
            this._toggleExpandedState(node.internalFields.key, true);
        }).bind(this));
    },

    /**
     * @name dxTreeViewMethods.collapseAll
     * @publicName collapseAll()
     */
    collapseAll: function() {
        each(this._dataAdapter.getExpandedNodesKeys(), (function(_, key) {
            this._toggleExpandedState(key, false);
        }).bind(this));
    }

});

module.exports = TreeViewBase;
