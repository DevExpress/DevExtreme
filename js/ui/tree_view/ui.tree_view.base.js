import $ from "../../core/renderer";
import { isElementNode } from "../../core/dom_adapter";
import { on, off } from "../../events/core/events_engine";
import messageLocalization from "../../localization/message";
import clickEvent from "../../events/click";
import commonUtils from "../../core/utils/common";
import windowUtils from "../../core/utils/window";
import { isDefined, isPrimitive, isFunction } from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import { each } from "../../core/utils/iterator";
import { getPublicElement } from "../../core/utils/dom";
import CheckBox from "../check_box";
import HierarchicalCollectionWidget from "../hierarchical_collection/ui.hierarchical_collection_widget";
import { addNamespace } from "../../events/utils";
import { down as PointerDown } from "../../events/pointer";
import dblclickEvent from "../../events/double_click";
import fx from "../../animation/fx";
import Scrollable from "../scroll_view/ui.scrollable";
import LoadIndicator from "../load_indicator";
import { fromPromise, Deferred, when } from "../../core/utils/deferred";

const WIDGET_CLASS = "dx-treeview";

const NODE_CLASS = `${WIDGET_CLASS}-node`;
const NODE_CONTAINER_CLASS = `${NODE_CLASS}-container`;
const NODE_LOAD_INDICATOR_CLASS = `${NODE_CLASS}-loadindicator`;
const OPENED_NODE_CONTAINER_CLASS = `${NODE_CLASS}-container-opened`;
const IS_LEAF = `${NODE_CLASS}-is-leaf`;

const ITEM_CLASS = `${WIDGET_CLASS}-item`;
const ITEM_WITH_CHECKBOX_CLASS = `${ITEM_CLASS}-with-checkbox`;
const ITEM_WITHOUT_CHECKBOX_CLASS = `${ITEM_CLASS}-without-checkbox`;
const ITEM_DATA_KEY = `${ITEM_CLASS}-data`;

const TOGGLE_ITEM_VISIBILITY_CLASS = `${WIDGET_CLASS}-toggle-item-visibility`;
const LOAD_INDICATOR_CLASS = `${WIDGET_CLASS}-loadindicator`;
const LOAD_INDICATOR_WRAPPER_CLASS = `${WIDGET_CLASS}-loadindicator-wrapper`;
const TOGGLE_ITEM_VISIBILITY_OPENED_CLASS = `${WIDGET_CLASS}-toggle-item-visibility-opened`;
const SELECT_ALL_ITEM_CLASS = `${WIDGET_CLASS}-select-all-item`;

const DISABLED_STATE_CLASS = "dx-state-disabled";
const SELECTED_ITEM_CLASS = "dx-state-selected";
const EXPAND_EVENT_NAMESPACE = "dxTreeView_expand";
const DATA_ITEM_ID = "data-item-id";

const TreeViewBase = HierarchicalCollectionWidget.inherit({

    _supportedKeys: function(e) {
        const click = (e) => {
            const $itemElement = $(this.option("focusedElement"));

            if(!$itemElement.length) {
                return;
            }

            e.target = $itemElement;
            e.currentTarget = $itemElement;
            this._itemClickHandler(e, $itemElement.children("." + ITEM_CLASS));

            const expandEventName = this._getEventNameByOption(this.option("expandEvent")),
                expandByClick = expandEventName === addNamespace(clickEvent.name, EXPAND_EVENT_NAMESPACE);

            if(expandByClick) {
                this._expandEventHandler(e);
            }
        };

        const select = (e) => {
            e.preventDefault();
            this._changeCheckBoxState($(this.option("focusedElement")));
        };

        const toggleExpandedNestedItems = function(state, e) {
            if(!this.option("expandAllEnabled")) {
                return;
            }

            e.preventDefault();

            const $rootElement = $(this.option("focusedElement"));

            if(!$rootElement.length) {
                return;
            }

            const rootItem = this._getItemData($rootElement.find(`.${ITEM_CLASS}`));
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
        const checkboxInstance = this._getCheckBoxInstance($element),
            currentState = checkboxInstance.option("value");
        if(!checkboxInstance.option("disabled")) {
            this._updateItemSelection(!currentState, $element.find("." + ITEM_CLASS).get(0), true, $element);
        }
    },

    _toggleExpandedNestedItems: function(items, state) {
        if(!items) {
            return;
        }

        for(let i = 0, len = items.length; i < len; i++) {
            const item = items[i],
                node = this._dataAdapter.getNodeByItem(item);

            this._toggleExpandedState(node, state);
            this._toggleExpandedNestedItems(item.items, state);
        }
    },

    _getNodeElement: function(node, cache) {
        const normalizedKey = commonUtils.normalizeKey(node.internalFields.key);
        if(cache) {
            if(!cache.$nodeByKey) {
                cache.$nodeByKey = {};
                this.$element().find(`.${NODE_CLASS}`).each(function() {
                    const $node = $(this);
                    const key = $node.attr(DATA_ITEM_ID);

                    cache.$nodeByKey[key] = $node;
                });
            }
            return cache.$nodeByKey[normalizedKey] || $();
        }
        return this.$element().find(`[${DATA_ITEM_ID}='${normalizedKey}']`);
    },

    _activeStateUnit: "." + ITEM_CLASS,

    _widgetClass: function() {
        return WIDGET_CLASS;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTreeViewOptions.items
            * @type Array<dxTreeViewItem>
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

            deferRendering: true,

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
            * @type_function_param1_field4 node:dxTreeViewNode
            * @type_function_param1_field5 itemElement:dxElement
            * @action
            */
            onItemSelectionChanged: null,

            /**
            * @name dxTreeViewOptions.onItemClick
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number | object
            * @type_function_param1_field7 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field8 event:event
            * @type_function_param1_field9 node:dxTreeViewNode
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.onItemContextMenu
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number | object
            * @type_function_param1_field7 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field8 event:event
            * @type_function_param1_field9 node:dxTreeViewNode
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.onItemRendered
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number
            * @type_function_param1_field7 node:dxTreeViewNode
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTreeViewOptions.onItemHold
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number
            * @type_function_param1_field7 event:event
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

            /**
             * @name dxTreeViewOptions.expandEvent
             * @type Enums.TreeViewExpandEvent
             * @default "dblclick"
             */
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
            * @name dxTreeViewItem
            * @inherits CollectionWidgetItem
            * @type object
            */
            /**
            * @name dxTreeViewItem.selected
            * @type boolean
            * @default false
            */
            /**
            * @name dxTreeViewItem.expanded
            * @type boolean
            * @default false
            */
            /**
            * @name dxTreeViewItem.icon
            * @type String
            */
            /**
            * @name dxTreeViewItem.items
            * @type Array<dxTreeViewItem>
            */
            /**
            * @name dxTreeViewItem.parentId
            * @type number|string
            * @default undefined
            */
            /**
            * @name dxTreeViewItem.hasItems
            * @type boolean
            * @default undefined
            */
        });
    },

    // TODO: implement these functions
    _initSelectedItems: commonUtils.noop,
    _syncSelectionOptions: commonUtils.asyncNoop,

    _fireSelectionChanged: function() {
        const selectionChangePromise = this._selectionChangePromise;
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

        const selectAllExists = this._$selectAllItem && this._$selectAllItem.length;
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
        const that = this;

        each(this._dataAdapter.getFullData(), function(_, node) {
            if(!that._hasChildren(node)) {
                return;
            }

            that._dataAdapter.toggleSelection(node.internalFields.key, false, true);
        });
    },

    _optionChanged: function(args) {
        const { name, value, previousValue } = args;

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
            case "deferRendering":
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
            case "selectionMode":
                this._initDataAdapter();
                this.callBase(args);
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
        const filter = this._filter;

        if(!filter.custom) {
            filter.custom = this._dataSource.filter();
        }

        if(!filter.internal) {
            filter.internal = [this.option("parentIdExpr"), this.option("rootValue")];
        }
    },

    _useCustomChildrenLoader: function() {
        return isFunction(this.option("createChildren")) && this._isDataStructurePlain();
    },

    _loadChildrenByCustomLoader: function(parentNode) {
        const invocationResult = this.option("createChildren").call(this, parentNode);

        if(Array.isArray(invocationResult)) {
            return new Deferred().resolve(invocationResult).promise();
        }

        if(invocationResult && isFunction(invocationResult.then)) {
            return fromPromise(invocationResult);
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
        let resultFilter;

        if(this._isVirtualMode()) {
            resultFilter = this._combineFilter();
            this._dataSource.filter(resultFilter);
        }

        if(isLoading && !this._dataSource.isLoaded()) {
            this.option("items", []);

            const $wrapper = $("<div>").addClass(LOAD_INDICATOR_WRAPPER_CLASS);

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

        this._dataSource && this._dataSource.store()
            .on("inserted", newItem => {
                this.option().items = this.option("items").concat(newItem);
                this._dataAdapter.addItem(newItem);

                if(!this._dataAdapter.isFiltered(newItem)) {
                    return;
                }

                this._updateLevel(this._parentIdGetter(newItem));
            })
            .on("removed", removedKey => {
                const node = this._dataAdapter.getNodeByKey(removedKey);

                this.option("items")[this._dataAdapter.getIndexByKey(node.internalFields.key)] = 0;
                this._markChildrenItemsToRemove(node);
                this._removeItems();

                this._dataAdapter.removeItem(removedKey);
                this._updateLevel(this._parentIdGetter(node));
            });
    },

    _markChildrenItemsToRemove: function(node) {
        const keys = node.internalFields.childrenKeys;

        each(keys, (_, key) => {
            this.option("items")[this._dataAdapter.getIndexByKey(key)] = 0;
            this._markChildrenItemsToRemove(this._dataAdapter.getNodeByKey(key));
        });
    },

    _removeItems: function() {
        const items = extend(true, [], this.option("items"));
        let counter = 0;

        each(items, (index, item) => {
            if(!item) {
                this.option("items").splice(index - counter, 1);
                counter++;
            }
        });
    },

    _updateLevel: function(parentId) {
        const $container = this._getContainerByParentKey(parentId);

        this._renderItems($container, this._dataAdapter.getChildrenNodes(parentId));
    },

    _getOldContainer: function($itemElement) {
        if($itemElement.length) {
            return $itemElement.children(`.${NODE_CONTAINER_CLASS}`);
        }

        if(this._scrollableContainer) {
            return this._scrollableContainer.$content().children();
        }

        return $();
    },

    _getContainerByParentKey: function(parentId) {
        const node = this._dataAdapter.getNodeByKey(parentId);
        const $itemElement = node ? this._getNodeElement(node) : [];

        this._getOldContainer($itemElement).remove();
        const $container = this._renderNodeContainer($itemElement);

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
        let accessors = this.callBase();

        accessors.push("hasItems");

        return accessors;
    },

    _getDataAdapterOptions: function() {
        return {
            rootValue: this.option("rootValue"),
            multipleSelection: !this._isSingleSelection(),
            recursiveSelection: this._isRecursiveSelection(),
            recursiveExpansion: this.option("expandNodesRecursive"),
            selectionRequired: this.option("selectionRequired"),
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
        const $nodeContainer = this._renderNodeContainer();

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
        const $container = $("<ul>").addClass(NODE_CONTAINER_CLASS);

        this.setAria("role", "group", $container);

        if($parent && $parent.length) {
            const itemData = this._getItemData($parent.children("." + ITEM_CLASS));

            if(this._expandedGetter(itemData)) {
                $container.addClass(OPENED_NODE_CONTAINER_CLASS);
            }

            $container.appendTo($parent);
        }
        return $container;
    },

    _createDOMElement: function($nodeContainer, node) {
        const $node = $("<li>")
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
        const parent = $nodeContainer.parent();
        return parent.hasClass("dx-scrollable-content") ? 1 : parseInt(parent.attr("aria-level")) + 1;
    },

    _showCheckboxes: function() {
        return this.option("showCheckBoxesMode") !== "none";
    },

    _selectAllEnabled: function() {
        return this.option("showCheckBoxesMode") === "selectAll" && !this._isSingleSelection();
    },

    _renderItems: function($nodeContainer, nodes) {
        const length = nodes.length - 1;

        for(let i = length; i >= 0; i--) {
            this._renderItem(nodes[i], $nodeContainer);
        }

        this._renderFocusTarget();
    },

    _renderItem: function(node, $nodeContainer) {
        const $node = this._createDOMElement($nodeContainer, node);
        const nodeData = node.internalFields;
        const showCheckBox = this._showCheckboxes();

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

        if(this.option("deferRendering") && !node.internalFields.expanded) {
            return;
        }

        this._loadSublevel(node).done(childNodes => {
            this._renderSublevel($node, this._getActualNode(node), childNodes);
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
        const deferred = new Deferred();
        const childrenNodes = this._getChildNodes(node);

        if(childrenNodes.length) {
            deferred.resolve(childrenNodes);
        } else {
            this._loadNestedItems(node).done(items => {
                deferred.resolve(this._dataAdapter.getNodesByItems(items));
            });
        }

        return deferred.promise();
    },

    _renderSublevel: function($node, node, childNodes) {
        const $nestedNodeContainer = this._renderNodeContainer($node, node);

        this._renderItems($nestedNodeContainer, childNodes);

        if(childNodes.length && !node.internalFields.selected) {
            const firstChild = childNodes[0];
            this._updateParentsState(firstChild, this._getNodeElement(firstChild));
        }

        this._normalizeIconState($node, childNodes.length);

        if(node.internalFields.expanded) {
            $nestedNodeContainer.addClass(OPENED_NODE_CONTAINER_CLASS);
        }
    },

    _executeItemRenderAction: function(key, itemData, itemElement) {
        const node = this._dataAdapter.getNodeByKey(key);

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

    _expandEventHandler: function(e) {
        const $nodeElement = $(e.currentTarget.parentNode);

        if(!$nodeElement.hasClass(IS_LEAF)) {
            this._toggleExpandedState(e.currentTarget, undefined, e);
        }
    },

    _initExpandEvent: function() {
        const expandedEventName = this._getEventNameByOption(this.option("expandEvent"));
        const $itemsContainer = this._itemContainer();
        const itemSelector = this._itemSelector();

        off($itemsContainer, "." + EXPAND_EVENT_NAMESPACE, itemSelector);
        on($itemsContainer, expandedEventName, itemSelector, this._expandEventHandler.bind(this));
    },

    _getEventNameByOption: function(name) {
        const event = name === "click" ? clickEvent : dblclickEvent;
        return addNamespace(event.name, EXPAND_EVENT_NAMESPACE);
    },

    _getNode: function(identifier) {
        if(!isDefined(identifier)) {
            return null;
        }

        if(identifier.internalFields) {
            return identifier;
        }

        if(isPrimitive(identifier)) {
            return this._dataAdapter.getNodeByKey(identifier);
        }

        const itemElement = $(identifier).get(0);
        if(!itemElement) {
            return null;
        }

        if(isElementNode(itemElement)) {
            return this._getNodeByElement(itemElement);
        }

        return this._dataAdapter.getNodeByItem(itemElement);
    },

    _getNodeByElement: function(itemElement) {
        const $node = $(itemElement).closest("." + NODE_CLASS);
        const key = commonUtils.denormalizeKey($node.attr(DATA_ITEM_ID));

        return this._dataAdapter.getNodeByKey(key);
    },

    _toggleExpandedState: function(itemElement, state, e) {
        const node = this._getNode(itemElement);
        const currentState = node.internalFields.expanded;

        if(node.internalFields.disabled || currentState === state) {
            return;
        }

        if(!isDefined(state)) {
            state = !currentState;
        }

        this._dataAdapter.toggleExpansion(node.internalFields.key, state);
        node.internalFields.expanded = state;

        if(this._hasChildren(node)) {
            const $node = this._getNodeElement(node);
            this._createLoadIndicator($node);
        }

        this._updateExpandedItemsUI(node, state, e);
    },

    _createLoadIndicator: function($node) {
        const $icon = $node.children("." + TOGGLE_ITEM_VISIBILITY_CLASS);
        const $nodeContainer = $node.children(`.${NODE_CONTAINER_CLASS}`);

        if($icon.hasClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS) || $nodeContainer.not(":empty").length) {
            return;
        }

        this._createComponent($("<div>").addClass(NODE_LOAD_INDICATOR_CLASS), LoadIndicator, {}).$element().appendTo($node);
        $icon.hide();
    },

    _renderToggleItemVisibilityIcon: function($node, node) {
        const $icon = $("<div>")
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
        const eventName = addNamespace(clickEvent.name, this.NAME);

        off($icon, eventName);
        on($icon, eventName, e => {
            this._toggleExpandedState(node.internalFields.key, undefined, e);
        });
    },

    _updateExpandedItemsUI: function(node, state, e) {
        const $node = this._getNodeElement(node);
        const isHiddenNode = !$node.length || state && $node.is(':hidden');

        if(this.option("expandNodesRecursive") && isHiddenNode) {
            const parentNode = this._getNode(node.internalFields.parentKey);

            if(parentNode) {
                this._updateExpandedItemsUI(parentNode, state, e);
            }
        }

        const $icon = $node.children("." + TOGGLE_ITEM_VISIBILITY_CLASS);
        const $nodeContainer = $node.children(`.${NODE_CONTAINER_CLASS}`);

        $icon.toggleClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS, state);

        const nodeContainerExists = $nodeContainer.length > 0;

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
        const $node = this._getNodeElement(node);

        this._loadNestedItems(node).done(items => {
            const actualNodeData = this._getActualNode(node);
            this._renderSublevel($node, actualNodeData, this._dataAdapter.getNodesByItems(items));

            if(!items || !items.length) {
                return;
            }

            this._fireContentReadyAction();
            this._updateExpandedItem(actualNodeData, state, e);
        });
    },

    _loadNestedItems: function(node) {
        if(this._useCustomChildrenLoader()) {
            const publicNode = this._dataAdapter.getPublicNode(node);
            return this._loadChildrenByCustomLoader(publicNode).done(newItems => {
                if(!this._areNodesExists(newItems)) {
                    this._appendItems(newItems);
                }
            });
        }

        if(!this._isVirtualMode()) {
            return new Deferred().resolve([]).promise();
        }

        this._filter.internal = [this.option("parentIdExpr"), node.internalFields.key];
        this._dataSource.filter(this._combineFilter());

        return this._dataSource.load().done(newItems => {
            if(!this._areNodesExists(newItems)) {
                this._appendItems(newItems);
            }
        });
    },

    _areNodesExists: function(newItems, items) {
        const keyOfRootItem = this.keyOf(newItems[0]);
        const fullData = this._dataAdapter.getFullData();

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
        const $node = this._getNodeElement(node);
        const $nodeContainer = $node.children(`.${NODE_CONTAINER_CLASS}`);
        let nodeHeight;

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
        if(!this._hasChildren(node)) {
            return;
        }

        const optionName = isExpanded ? "onItemExpanded" : "onItemCollapsed";
        if(isDefined(e)) {
            this._itemDXEventHandler(e, optionName, { node: this._dataAdapter.getPublicNode(node) });
        } else {
            const target = this._getNodeElement(node);
            this._itemEventHandler(target, optionName, { event: e, node: this._dataAdapter.getPublicNode(node) });
        }
    },

    _normalizeIconState: function($node, hasNewItems) {
        const $loadIndicator = $node.find(".dx-loadindicator");
        $loadIndicator.length && LoadIndicator.getInstance($loadIndicator).option("visible", false);

        if(hasNewItems) {
            const $icon = $node.find("." + TOGGLE_ITEM_VISIBILITY_CLASS);
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
        const items = this.option("items");
        if(items && items.length) {
            this._contentAlreadyRendered = true;
        }

        this.callBase();
    },

    _renderSelectAllItem: function($container) {
        $container = $container || this.$element().find(`.${NODE_CONTAINER_CLASS}`).first();

        this._$selectAllItem = $("<div>").addClass(SELECT_ALL_ITEM_CLASS);

        const value = this._dataAdapter.isAllSelected();
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
        const $checkbox = $("<div>").appendTo($node);

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
        const $node = this._getNodeElement(node);
        const $item = $node.find("." + ITEM_CLASS).eq(0);

        this._dataAdapter.toggleNodeDisabledState(node.internalFields.key, state);

        $item.toggleClass(DISABLED_STATE_CLASS, !!state);

        if(this._showCheckboxes()) {
            const checkbox = this._getCheckBoxInstance($node);
            checkbox.option("disabled", !!state);
        }
    },

    _itemOptionChanged: function(item, property, value) {
        const node = this._dataAdapter.getNodeByItem(item);

        if(property === this.option("disabledExpr")) {
            this._toggleNodeDisabledState(node, value);
        }
    },

    _changeCheckboxValue: function(e) {
        const $node = $(e.element).parent("." + NODE_CLASS);
        const $item = $node.children("." + ITEM_CLASS);
        const item = this._getItemData($item);
        const node = this._getNodeByElement($item);
        const value = e.value;

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

    _isLastSelectedBranch: function(publicNode, selectedNodesKeys, deep) {
        const keyIndex = selectedNodesKeys.indexOf(publicNode.key);

        if(keyIndex >= 0) {
            selectedNodesKeys.splice(keyIndex, 1);
        }

        if(deep) {
            each(publicNode.children, function(_, childNode) {
                this._isLastSelectedBranch(childNode, selectedNodesKeys, true);
            }.bind(this));
        }

        if(publicNode.parent) {
            this._isLastSelectedBranch(publicNode.parent, selectedNodesKeys);
        }

        return selectedNodesKeys.length === 0;
    },

    _isLastRequired: function(node) {
        const selectionRequired = this.option("selectionRequired");
        const isSingleMode = this._isSingleSelection();
        const selectedNodesKeys = this.getSelectedNodesKeys();

        if(!selectionRequired) {
            return;
        }

        if(isSingleMode) {
            return selectedNodesKeys.length === 1;
        } else {
            return this._isLastSelectedBranch(node.internalFields.publicNode, selectedNodesKeys.slice(), true);
        }

    },

    _updateItemSelection: function(value, itemElement, dxEvent) {
        const node = this._getNode(itemElement);

        if(!node || node.internalFields.selected === value) {
            return;
        }

        if(!value && this._isLastRequired(node)) {
            if(this._showCheckboxes()) {
                const $node = this._getNodeElement(node),
                    checkbox = this._getCheckBoxInstance($node);

                checkbox && checkbox.option("value", true);
            }
            return;
        }

        const selectedNodesKeys = this.getSelectedNodesKeys();
        if(this._isSingleSelection() && value) {
            each(selectedNodesKeys, (index, nodeKey) => {
                this.unselectItem(nodeKey);
            });
        }

        this._dataAdapter.toggleSelection(node.internalFields.key, value);
        this._updateItemsUI();

        const initiator = dxEvent || this._findItemElementByItem(node.internalFields.item),
            handler = dxEvent ? this._itemDXEventHandler : this._itemEventHandler;

        handler.call(this, initiator, "onItemSelectionChanged", {
            node: this._dataAdapter.getPublicNode(node),
            itemData: node.internalFields.item
        });

        this._fireSelectionChanged();
    },

    _getCheckBoxInstance: function($node) {
        return $node.children(".dx-checkbox").dxCheckBox("instance");
    },

    _updateItemsUI: function() {
        const cache = {};

        each(this._dataAdapter.getData(), (_, node) => {
            const $node = this._getNodeElement(node, cache),
                nodeSelection = node.internalFields.selected;

            if(!$node.length) {
                return;
            }

            this._toggleSelectedClass($node, nodeSelection);
            this.setAria("selected", nodeSelection, $node);

            if(this._showCheckboxes()) {
                const checkbox = this._getCheckBoxInstance($node);
                checkbox.option("value", nodeSelection);
            }
        });

        if(this._selectAllEnabled()) {
            this._$selectAllItem.dxCheckBox("instance").option("value", this._dataAdapter.isAllSelected());
        }
    },

    _updateParentsState: function(node, $node) {
        if(!$node) {
            return;
        }

        const parentNode = this._dataAdapter.getNodeByKey(node.internalFields.parentKey);
        const $parentNode = $($node.parents("." + NODE_CLASS)[0]);

        if(this._showCheckboxes()) {
            const parentValue = parentNode.internalFields.selected;
            this._getCheckBoxInstance($parentNode).option("value", parentValue);
            this._toggleSelectedClass($parentNode, parentValue);
        }

        if(parentNode.internalFields.parentKey !== this.option("rootValue")) {
            this._updateParentsState(parentNode, $parentNode);
        }

    },

    _itemEventHandlerImpl: function(initiator, action, actionArgs) {
        const $itemElement = $(initiator).closest("." + NODE_CLASS).children("." + ITEM_CLASS);

        return action(extend(this._extendActionArgs($itemElement), actionArgs));
    },

    _itemContextMenuHandler: function(e) {
        this._createEventHandler("onItemContextMenu", e);
    },

    _itemHoldHandler: function(e) {
        this._createEventHandler("onItemHold", e);
    },

    _createEventHandler: function(eventName, e) {
        const node = this._getNodeByElement(e.currentTarget);

        this._itemDXEventHandler(e, eventName, { node: this._dataAdapter.getPublicNode(node) });
    },

    _itemClass: function() {
        return ITEM_CLASS;
    },

    _itemDataKey: function() {
        return ITEM_DATA_KEY;
    },

    _attachClickEvent: function() {
        const clickSelector = "." + this._itemClass();
        const pointerDownSelector = "." + NODE_CLASS + ", ." + SELECT_ALL_ITEM_CLASS;
        const eventName = addNamespace(clickEvent.name, this.NAME);
        const pointerDownEvent = addNamespace(PointerDown, this.NAME);
        const $itemContainer = this._itemContainer();

        const that = this;
        off($itemContainer, eventName, clickSelector);
        off($itemContainer, pointerDownEvent, pointerDownSelector);
        on($itemContainer, eventName, clickSelector, function(e) {
            that._itemClickHandler(e, $(this));
        });
        on($itemContainer, pointerDownEvent, pointerDownSelector, function(e) {
            that._itemPointerDownHandler(e);
        });
    },

    _itemClickHandler: function(e, $item) {
        const itemData = this._getItemData($item);
        const node = this._getNodeByElement($item);

        this._itemDXEventHandler(e, "onItemClick", { node: this._dataAdapter.getPublicNode(node) });

        if(this.option("selectByClick") && !e.isDefaultPrevented()) {
            this._updateItemSelection(!node.internalFields.selected, itemData, e);
        }
    },

    _updateSelectionToFirstItem: function($items, startIndex) {
        let itemIndex = startIndex;

        while(itemIndex >= 0) {
            const $item = $($items[itemIndex]);
            this._updateItemSelection(true, $item.find("." + ITEM_CLASS).get(0));
            itemIndex--;
        }
    },

    _updateSelectionToLastItem: function($items, startIndex) {
        const length = $items.length;
        let itemIndex = startIndex;

        while(itemIndex < length) {
            const $item = $($items[itemIndex]);
            this._updateItemSelection(true, $item.find("." + ITEM_CLASS).get(0));
            itemIndex++;
        }
    },

    _focusInHandler: function(e) {
        this._updateFocusState(e, true);

        if(this.option("focusedElement")) {
            clearTimeout(this._setFocusedItemTimeout);

            this._setFocusedItemTimeout = setTimeout(() => {
                this._setFocusedItem($(this.option("focusedElement")));
            });

            return;
        }

        const $activeItem = this._getActiveItem();
        this.option("focusedElement", getPublicElement($activeItem.closest("." + NODE_CLASS)));
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

        const $target = $(e.target).closest("." + NODE_CLASS + ", ." + SELECT_ALL_ITEM_CLASS);

        if(!$target.length) {
            return;
        }

        const itemElement = $target.hasClass(DISABLED_STATE_CLASS) ? null : $target;
        this.option("focusedElement", getPublicElement(itemElement));
    },

    _findNonDisabledNodes: function($nodes) {
        return $nodes.not(function() {
            return $(this).children("." + ITEM_CLASS).hasClass(DISABLED_STATE_CLASS);
        });
    },

    _moveFocus: function(location, e) {
        const FOCUS_UP = "up";
        const FOCUS_DOWN = "down";
        const FOCUS_FIRST = "first";
        const FOCUS_LAST = "last";
        const FOCUS_LEFT = this.option("rtlEnabled") ? "right" : "left";
        const FOCUS_RIGHT = this.option("rtlEnabled") ? "left" : "right";

        this.$element().find(`.${NODE_CONTAINER_CLASS}`).each(function() {
            fx.stop(this, true);
        });

        const $items = this._findNonDisabledNodes(this._nodeElements());

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
        const $focusedNode = $(this.option("focusedElement"));
        if(!$focusedNode.length || $focusedNode.hasClass(IS_LEAF)) {
            return;
        }

        const $node = $focusedNode.find(`.${NODE_CONTAINER_CLASS}`).eq(0);

        if($node.hasClass(OPENED_NODE_CONTAINER_CLASS)) {
            const $nextItem = this._nextItem(this._findNonDisabledNodes(this._nodeElements()));
            this.option("focusedElement", getPublicElement($nextItem));
            return;
        }

        const node = this._getNodeByElement($focusedNode.children("." + ITEM_CLASS));
        this._toggleExpandedState(node, true);
    },

    _getClosestNonDisabledNode: function($node) {
        do {
            $node = $node.parent().closest("." + NODE_CLASS);
        } while($node.children(".dx-treeview-item.dx-state-disabled").length);

        return $node;
    },

    _collapseFocusedContainer: function() {
        const $focusedNode = $(this.option("focusedElement"));

        if(!$focusedNode.length) {
            return;
        }

        const nodeElement = $focusedNode.find(`.${NODE_CONTAINER_CLASS}`).eq(0);

        if(!$focusedNode.hasClass(IS_LEAF) && nodeElement.hasClass(OPENED_NODE_CONTAINER_CLASS)) {
            const node = this._getNodeByElement($focusedNode.children("." + ITEM_CLASS));
            this._toggleExpandedState(node, false);
        } else {
            const collapsedNode = this._getClosestNonDisabledNode($focusedNode);
            collapsedNode.length && this.option("focusedElement", getPublicElement(collapsedNode));
        }
    },

    /**
    * @name dxTreeViewMethods.updateDimensions
    * @publicName updateDimensions()
    * @return Promise<void>
    */
    updateDimensions: function() {
        const deferred = new Deferred();

        if(this._scrollableContainer) {
            this._scrollableContainer.update().done(() => {
                deferred.resolveWith(this);
            });
        } else {
            deferred.resolveWith(this);
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
