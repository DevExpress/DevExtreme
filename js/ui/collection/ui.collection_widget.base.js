import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import commonUtils from "../../core/utils/common";
import { getPublicElement, getElementOptions } from "../../core/utils/dom";
import domAdapter from "../../core/dom_adapter";
import { isPlainObject, isFunction, isDefined } from "../../core/utils/type";
import { when } from "../../core/utils/deferred";
import { extend } from "../../core/utils/extend";
import { inArray } from "../../core/utils/array";
import iteratorUtils from "../../core/utils/iterator";
import Action from "../../core/action";
import Guid from "../../core/guid";
import Widget from "../widget/ui.widget";
import eventUtils from "../../events/utils";
import pointerEvents from "../../events/pointer";
import DataHelperMixin from "../../data_helper";
import CollectionWidgetItem from "./item";
import selectors from "../widget/selectors";
import messageLocalization from "../../localization/message";
import holdEvent from "../../events/hold";
import { compileGetter } from "../../core/utils/data";
import clickEvent from "../../events/click";
import contextMenuEvent from "../../events/contextmenu";
import BindableTemplate from "../widget/bindable_template";

const COLLECTION_CLASS = "dx-collection";
const ITEM_CLASS = "dx-item";
const CONTENT_CLASS_POSTFIX = "-content";
const ITEM_CONTENT_PLACEHOLDER_CLASS = "dx-item-content-placeholder";
const ITEM_DATA_KEY = "dxItemData";
const ITEM_INDEX_KEY = "dxItemIndex";
const ITEM_TEMPLATE_ID_PREFIX = "tmpl-";
const ITEMS_SELECTOR = "[data-options*='dxItem']";
const SELECTED_ITEM_CLASS = "dx-item-selected";
const ITEM_RESPONSE_WAIT_CLASS = "dx-item-response-wait";
const EMPTY_COLLECTION = "dx-empty-collection";
const TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";

const ITEM_PATH_REGEX = /^([^.]+\[\d+\]\.)+([\w.]+)$/;

const FOCUS_UP = "up";
const FOCUS_DOWN = "down";
const FOCUS_LEFT = "left";
const FOCUS_RIGHT = "right";
const FOCUS_PAGE_UP = "pageup";
const FOCUS_PAGE_DOWN = "pagedown";
const FOCUS_LAST = "last";
const FOCUS_FIRST = "first";

/**
* @name CollectionWidget
* @type object
* @inherits Widget, DataHelperMixin
* @module ui/collection/ui.collection_widget.base
* @export default
* @hidden
*/
var CollectionWidget = Widget.inherit({

    _activeStateUnit: "." + ITEM_CLASS,

    _supportedKeys: function() {
        var enter = function(e) {
                var $itemElement = $(this.option("focusedElement"));

                if(!$itemElement.length) {
                    return;
                }

                this._itemClickHandler(extend({}, e, {
                    target: $itemElement,
                    currentTarget: $itemElement
                }));
            },
            space = function(e) {
                e.preventDefault();
                enter.call(this, e);
            },
            move = function(location, e) {
                e.preventDefault();
                e.stopPropagation();
                this._moveFocus(location, e);
            };
        return extend(this.callBase(), {
            space: space,
            enter: enter,
            leftArrow: move.bind(this, FOCUS_LEFT),
            rightArrow: move.bind(this, FOCUS_RIGHT),
            upArrow: move.bind(this, FOCUS_UP),
            downArrow: move.bind(this, FOCUS_DOWN),
            pageUp: move.bind(this, FOCUS_UP),
            pageDown: move.bind(this, FOCUS_DOWN),
            home: move.bind(this, FOCUS_FIRST),
            end: move.bind(this, FOCUS_LAST)
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name CollectionWidgetOptions.selectOnFocus
            * @type boolean
            * @hidden
            */
            selectOnFocus: false,

            /**
            * @name CollectionWidgetOptions.loopItemFocus
            * @type boolean
            * @hidden
            */
            loopItemFocus: true,

            /**
            * @name CollectionWidgetOptions.items
            * @type Array<string, CollectionWidgetItem, object>
            * @fires CollectionWidgetOptions.onOptionChanged
            */
            items: [],

            /**
            * @name CollectionWidgetOptions.itemTemplate
            * @type template|function
            * @default "item"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            itemTemplate: "item",

            /**
            * @name CollectionWidgetOptions.onItemRendered
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number
            * @action
            */
            onItemRendered: null,

            /**
            * @name CollectionWidgetOptions.onItemClick
            * @type function(e)|string
            * @extends Action
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number
            * @type_function_param1_field7 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field8 event:event
            * @action
            */
            onItemClick: null,

            /**
            * @name CollectionWidgetOptions.onItemHold
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number
            * @type_function_param1_field7 event:event
            * @action
            */
            onItemHold: null,

            /**
            * @name CollectionWidgetOptions.itemHoldTimeout
            * @type number
            * @default 750
            */
            itemHoldTimeout: 750,

            /**
            * @name CollectionWidgetOptions.onItemContextMenu
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number
            * @type_function_param1_field7 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field8 event:event
            * @action
            */
            onItemContextMenu: null,

            onFocusedItemChanged: null,

            /**
            * @name CollectionWidgetOptions.noDataText
            * @type string
            * @default "No data to display"
            */
            noDataText: messageLocalization.format("dxCollectionWidget-noDataText"),

            /**
            * @name CollectionWidgetOptions.dataSource
            * @type string|Array<string,CollectionWidgetItem>|DataSource|DataSourceOptions
            * @default null
            */
            dataSource: null,
            /**
            * @name CollectionWidgetItem
            * @type object
            */
            /**
            * @name CollectionWidgetItem.template
            * @type template|function
            * @type_function_return string|Node|jQuery
            */

            _itemAttributes: {},
            itemTemplateProperty: "template",
            focusOnSelectedItem: true,
            /**
            * @name CollectionWidgetOptions.focusedElement
            * @type dxElement
            * @default null
            * @hidden
            */
            focusedElement: null,

            displayExpr: undefined,
            disabledExpr: function(data) { return data ? data.disabled : undefined; },
            visibleExpr: function(data) { return data ? data.visible : undefined; }

            /**
            * @name CollectionWidgetItem.html
            * @type String
            */
            /**
            * @name CollectionWidgetItem.text
            * @type String
            */
            /**
            * @name CollectionWidgetItem.disabled
            * @type boolean
            * @default false
            */
            /**
            * @name CollectionWidgetItem.visible
            * @type boolean
            * @default true
            */
        });
    },

    _getAnonymousTemplateName: function() {
        return "item";
    },

    _init: function() {
        this._compileDisplayGetter();
        this.callBase();

        this._cleanRenderedItems();
        this._refreshDataSource();
    },

    _compileDisplayGetter: function() {
        var displayExpr = this.option("displayExpr");
        this._displayGetter = displayExpr ? compileGetter(this.option("displayExpr")) : undefined;
    },

    _initTemplates: function() {
        this._initItemsFromMarkup();

        this.callBase();
        this._initDefaultItemTemplate();
    },

    _initDefaultItemTemplate: function() {
        var fieldsMap = this._getFieldsMap();
        this._defaultTemplates["item"] = new BindableTemplate((function($container, data) {
            if(isPlainObject(data)) {
                this._prepareDefaultItemTemplate(data, $container);
            } else {
                if(fieldsMap && isFunction(fieldsMap.text)) {
                    data = fieldsMap.text(data);
                }
                $container.text(String(commonUtils.ensureDefined(data, "")));
            }
        }).bind(this), this._getBindableFields(), this.option("integrationOptions.watchMethod"), fieldsMap);
    },

    _getBindableFields: function() {
        return ["text", "html"];
    },

    _getFieldsMap: function() {
        if(this._displayGetter) {
            return { text: this._displayGetter };
        }
    },

    _prepareDefaultItemTemplate: function(data, $container) {
        if(data.text) {
            $container.text(data.text);
        }

        if(data.html) {
            $container.html(data.html);
        }
    },

    _initItemsFromMarkup: function() {
        var $items = this.$element().contents().filter(ITEMS_SELECTOR);
        if(!$items.length || this.option("items").length) {
            return;
        }

        var items = [].slice.call($items).map((item) => {
            var $item = $(item);
            var result = getElementOptions(item).dxItem;
            var isTemplateRequired = $item.html().trim() && !result.template;

            if(isTemplateRequired) {
                result.template = this._prepareItemTemplate($item);
            } else {
                $item.remove();
            }

            return result;
        });

        this.option("items", items);
    },

    _prepareItemTemplate: function($item) {
        var templateId = ITEM_TEMPLATE_ID_PREFIX + new Guid();
        var $template = $item
            .detach()
            .clone()
            .removeAttr("data-options")
            .addClass(TEMPLATE_WRAPPER_CLASS);

        this._saveTemplate(templateId, $template);

        return templateId;
    },

    _dataSourceOptions: function() {
        return { paginate: false };
    },

    _cleanRenderedItems: function() {
        this._renderedItemsCount = 0;
    },

    _focusTarget: function() {
        return this.$element();
    },

    _focusInHandler: function(e) {
        this.callBase.apply(this, arguments);

        if(inArray(e.target, this._focusTarget()) === -1) {
            return;
        }

        var $focusedElement = $(this.option("focusedElement"));
        if($focusedElement.length) {
            this._setFocusedItem($focusedElement);
        } else {
            var $activeItem = this._getActiveItem();
            if($activeItem.length) {
                this.option("focusedElement", getPublicElement($activeItem));
            }
        }
    },

    _focusOutHandler: function() {
        this.callBase.apply(this, arguments);

        const $target = $(this.option("focusedElement"));

        this._updateFocusedItemState($target, false);
    },

    _getActiveItem: function(last) {
        const $focusedElement = $(this.option("focusedElement"));

        if($focusedElement.length) {
            return $focusedElement;
        }

        let index = this.option("focusOnSelectedItem") ? this.option("selectedIndex") : 0;

        const activeElements = this._getActiveElement();
        const lastIndex = activeElements.length - 1;

        if(index < 0) {
            index = last ? lastIndex : 0;
        }

        return activeElements.eq(index);
    },

    _moveFocus: function(location) {
        var $items = this._getAvailableItems(),
            $newTarget;

        switch(location) {
            case FOCUS_PAGE_UP:
            case FOCUS_UP:
                $newTarget = this._prevItem($items);
                break;
            case FOCUS_PAGE_DOWN:
            case FOCUS_DOWN:
                $newTarget = this._nextItem($items);
                break;
            case FOCUS_RIGHT:
                $newTarget = this.option("rtlEnabled") ? this._prevItem($items) : this._nextItem($items);
                break;
            case FOCUS_LEFT:
                $newTarget = this.option("rtlEnabled") ? this._nextItem($items) : this._prevItem($items);
                break;
            case FOCUS_FIRST:
                $newTarget = $items.first();
                break;
            case FOCUS_LAST:
                $newTarget = $items.last();
                break;
            default:
                return false;
        }

        if($newTarget.length !== 0) {
            this.option("focusedElement", getPublicElement($newTarget));
        }
    },

    _getVisibleItems: function($itemElements) {
        $itemElements = $itemElements || this._itemElements();
        return $itemElements.filter(":visible");
    },

    _getAvailableItems: function($itemElements) {
        return this._getVisibleItems($itemElements).not(".dx-state-disabled");
    },

    _prevItem: function($items) {
        var $target = this._getActiveItem(),
            targetIndex = $items.index($target),
            $last = $items.last(),
            $item = $($items[targetIndex - 1]),
            loop = this.option("loopItemFocus");

        if($item.length === 0 && loop) {
            $item = $last;
        }

        return $item;
    },

    _nextItem: function($items) {
        var $target = this._getActiveItem(true),
            targetIndex = $items.index($target),
            $first = $items.first(),
            $item = $($items[targetIndex + 1]),
            loop = this.option("loopItemFocus");

        if($item.length === 0 && loop) {
            $item = $first;
        }

        return $item;
    },

    _selectFocusedItem: function($target) {
        this.selectItem($target);
    },

    _updateFocusedItemState: function(target, isFocused, needCleanItemId) {
        const $target = $(target);

        if($target.length) {
            this._refreshActiveDescendant();
            this._refreshItemId($target, needCleanItemId);
            this._toggleFocusClass(isFocused, $target);
        }
    },

    _refreshActiveDescendant: function($target) {
        this.setAria("activedescendant", isDefined(this.option("focusedElement")) ? this.getFocusedItemId() : null, $target);
    },

    _refreshItemId: function($target, needCleanItemId) {
        if(!needCleanItemId && this.option("focusedElement")) {
            this.setAria("id", this.getFocusedItemId(), $target);
        } else {
            this.setAria("id", null, $target);
        }
    },

    _setFocusedItem: function($target) {
        if(!$target || !$target.length) {
            return;
        }

        this._updateFocusedItemState($target, true);
        this.onFocusedItemChanged(this.getFocusedItemId());

        if(this.option("selectOnFocus")) {
            this._selectFocusedItem($target);
        }
    },

    _findItemElementByItem: function(item) {
        var result = $(),
            that = this;

        this.itemElements().each(function() {
            var $item = $(this);
            if($item.data(that._itemDataKey()) === item) {
                result = $item;
                return false;
            }
        });

        return result;
    },

    _getIndexByItem: function(item) {
        return this.option("items").indexOf(item);
    },

    _itemOptionChanged: function(item, property, value, oldValue) {
        var $item = this._findItemElementByItem(item);
        if(!$item.length) {
            return;
        }
        if(!this.constructor.ItemClass.getInstance($item).setDataField(property, value)) {
            this._refreshItem($item, item);
        }

        const isDisabling = property === 'disabled' && value;

        if(isDisabling && $item.is(this.option('focusedElement'))) {
            this.option('focusedElement', null);
        }
    },

    _refreshItem: function($item) {
        var itemData = this._getItemData($item),
            index = $item.data(this._itemIndexKey());
        this._renderItem(this._renderedItemsCount + index, itemData, null, $item);
    },

    _optionChanged: function(args) {
        if(args.name === "items") {
            var matches = args.fullName.match(ITEM_PATH_REGEX);

            if(matches && matches.length) {
                var property = matches[matches.length - 1],
                    itemPath = args.fullName.replace("." + property, ""),
                    item = this.option(itemPath);

                this._itemOptionChanged(item, property, args.value, args.previousValue);
                return;
            }
        }

        switch(args.name) {
            case "items":
            case "_itemAttributes":
            case "itemTemplateProperty":
                this._cleanRenderedItems();
                this._invalidate();
                break;
            case "dataSource":
                this._refreshDataSource();
                this._renderEmptyMessage();
                break;
            case "noDataText":
                this._renderEmptyMessage();
                break;
            case "itemTemplate":
                this._invalidate();
                break;
            case "onItemRendered":
                this._createItemRenderAction();
                break;
            case "onItemClick":
                break;
            case "onItemHold":
            case "itemHoldTimeout":
                this._attachHoldEvent();
                break;
            case "onItemContextMenu":
                this._attachContextMenuEvent();
                break;
            case "onFocusedItemChanged":
                this.onFocusedItemChanged = this._createActionByOption("onFocusedItemChanged");
                break;
            case "selectOnFocus":
            case "loopItemFocus":
            case "focusOnSelectedItem":
                break;
            case "focusedElement":
                this._updateFocusedItemState(args.previousValue, false, true);
                this._setFocusedItem($(args.value));
                break;
            case "displayExpr":
                this._compileDisplayGetter();
                this._initDefaultItemTemplate();
                this._invalidate();
                break;
            case "visibleExpr":
            case "disabledExpr":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _invalidate: function() {
        this.option("focusedElement", null);

        return this.callBase.apply(this, arguments);
    },

    _loadNextPage: function() {
        var dataSource = this._dataSource;

        this._expectNextPageLoading();
        dataSource.pageIndex(1 + dataSource.pageIndex());

        return dataSource.load();
    },

    _expectNextPageLoading: function() {
        this._startIndexForAppendedItems = 0;
    },

    _expectLastItemLoading: function() {
        this._startIndexForAppendedItems = -1;
    },

    _forgetNextPageLoading: function() {
        this._startIndexForAppendedItems = null;
    },

    _dataSourceChangedHandler: function(newItems) {
        var items = this.option("items");
        if(this._initialized && items && this._shouldAppendItems()) {
            this._renderedItemsCount = items.length;
            if(!this._isLastPage() || this._startIndexForAppendedItems !== -1) {
                this.option().items = items.concat(newItems.slice(this._startIndexForAppendedItems));
            }

            this._forgetNextPageLoading();
            this._refreshContent();
        } else {
            this.option("items", newItems.slice());
        }
    },

    _refreshContent: function() {
        this._prepareContent();
        this._renderContent();
    },

    _dataSourceLoadErrorHandler: function() {
        this._forgetNextPageLoading();
        this.option("items", this.option("items"));
    },

    _shouldAppendItems: function() {
        return this._startIndexForAppendedItems != null && this._allowDynamicItemsAppend();
    },

    _allowDynamicItemsAppend: function() {
        return false;
    },

    _clean: function() {
        this._cleanFocusState();
        this._cleanItemContainer();
    },

    _cleanItemContainer: function() {
        $(this._itemContainer()).empty();
    },

    _dispose: function() {
        this.callBase();

        clearTimeout(this._itemFocusTimeout);
    },

    _refresh: function() {
        this._cleanRenderedItems();

        this.callBase.apply(this, arguments);
    },

    _itemContainer: function() {
        return this.$element();
    },

    _itemClass: function() {
        return ITEM_CLASS;
    },

    _itemContentClass: function() {
        return this._itemClass() + CONTENT_CLASS_POSTFIX;
    },

    _selectedItemClass: function() {
        return SELECTED_ITEM_CLASS;
    },

    _itemResponseWaitClass: function() {
        return ITEM_RESPONSE_WAIT_CLASS;
    },

    _itemSelector: function() {
        return "." + this._itemClass();
    },

    _itemDataKey: function() {
        return ITEM_DATA_KEY;
    },

    _itemIndexKey: function() {
        return ITEM_INDEX_KEY;
    },

    _itemElements: function() {
        return this._itemContainer().find(this._itemSelector());
    },

    _initMarkup: function() {
        this.callBase();
        this.onFocusedItemChanged = this._createActionByOption("onFocusedItemChanged");

        this.$element().addClass(COLLECTION_CLASS);
        this._prepareContent();
    },

    _prepareContent: commonUtils.deferRenderer(function() {
        this._renderContentImpl();
    }),

    _renderContent: function() {
        this._fireContentReadyAction();
    },

    _render: function() {
        this.callBase();

        this._attachClickEvent();
        this._attachHoldEvent();
        this._attachContextMenuEvent();
    },

    _attachClickEvent: function() {
        var itemSelector = this._itemSelector(),
            clickEventNamespace = eventUtils.addNamespace(clickEvent.name, this.NAME),
            pointerDownEventNamespace = eventUtils.addNamespace(pointerEvents.down, this.NAME),
            that = this;

        var pointerDownAction = new Action(function(args) {
            var event = args.event;
            that._itemPointerDownHandler(event);
        });

        eventsEngine.off(this._itemContainer(), clickEventNamespace, itemSelector);
        eventsEngine.off(this._itemContainer(), pointerDownEventNamespace, itemSelector);
        eventsEngine.on(this._itemContainer(), clickEventNamespace, itemSelector, (function(e) { this._itemClickHandler(e); }).bind(this));
        eventsEngine.on(this._itemContainer(), pointerDownEventNamespace, itemSelector, function(e) {
            pointerDownAction.execute({
                element: $(e.target),
                event: e
            });
        });
    },

    _itemClickHandler: function(e, args, config) {
        this._itemDXEventHandler(e, "onItemClick", args, config);
    },

    _itemPointerDownHandler: function(e) {
        if(!this.option("focusStateEnabled")) {
            return;
        }

        this._itemFocusHandler = function() {
            clearTimeout(this._itemFocusTimeout);
            this._itemFocusHandler = null;

            if(e.isDefaultPrevented()) {
                return;
            }

            var $target = $(e.target),
                $closestItem = $target.closest(this._itemElements()),
                $closestFocusable = this._closestFocusable($target);

            if($closestItem.length && $closestFocusable && inArray($closestFocusable.get(0), this._focusTarget()) !== -1) {
                this.option("focusedElement", getPublicElement($closestItem));
            }
        }.bind(this);

        this._itemFocusTimeout = setTimeout(this._forcePointerDownFocus.bind(this));
    },

    _closestFocusable: function($target) {
        if($target.is(selectors.focusable)) {
            return $target;
        } else {
            $target = $target.parent();

            while($target.length && !domAdapter.isDocument($target.get(0))) {
                if($target.is(selectors.focusable)) {
                    return $target;
                }
                $target = $target.parent();
            }
        }
    },

    _forcePointerDownFocus: function() {
        this._itemFocusHandler && this._itemFocusHandler();
    },

    _updateFocusState: function() {
        this.callBase.apply(this, arguments);

        this._forcePointerDownFocus();
    },

    _attachHoldEvent: function() {
        var $itemContainer = this._itemContainer(),
            itemSelector = this._itemSelector(),
            eventName = eventUtils.addNamespace(holdEvent.name, this.NAME);

        eventsEngine.off($itemContainer, eventName, itemSelector);
        eventsEngine.on($itemContainer, eventName, itemSelector, { timeout: this._getHoldTimeout() }, this._itemHoldHandler.bind(this));
    },

    _getHoldTimeout: function() {
        return this.option("itemHoldTimeout");
    },

    _shouldFireHoldEvent: function() {
        return this.hasActionSubscription("onItemHold");
    },

    _itemHoldHandler: function(e) {
        if(this._shouldFireHoldEvent()) {
            this._itemDXEventHandler(e, "onItemHold");
        } else {
            e.cancel = true;
        }
    },

    _attachContextMenuEvent: function() {
        var $itemContainer = this._itemContainer(),
            itemSelector = this._itemSelector(),
            eventName = eventUtils.addNamespace(contextMenuEvent.name, this.NAME);

        eventsEngine.off($itemContainer, eventName, itemSelector);
        eventsEngine.on($itemContainer, eventName, itemSelector, this._itemContextMenuHandler.bind(this));
    },

    _shouldFireContextMenuEvent: function() {
        return this.hasActionSubscription("onItemContextMenu");
    },

    _itemContextMenuHandler: function(e) {
        if(this._shouldFireContextMenuEvent()) {
            this._itemDXEventHandler(e, "onItemContextMenu");
        } else {
            e.cancel = true;
        }
    },

    _renderContentImpl: function() {
        var items = this.option("items") || [];
        if(this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount));
        } else {
            this._renderItems(items);
        }
    },

    _renderItems: function(items) {
        if(items.length) {
            iteratorUtils.each(items, function(index, itemData) {
                this._renderItem(this._renderedItemsCount + index, itemData);
            }.bind(this));
        }

        this._renderEmptyMessage();
    },

    _renderItem: function(index, itemData, $container, $itemToReplace) {
        $container = $container || this._itemContainer();
        var $itemFrame = this._renderItemFrame(index, itemData, $container, $itemToReplace);
        this._setElementData($itemFrame, itemData, index);
        $itemFrame.attr(this.option("_itemAttributes"));
        this._attachItemClickEvent(itemData, $itemFrame);
        var $itemContent = this._getItemContent($itemFrame);

        var renderContentPromise = this._renderItemContent({
            index: index,
            itemData: itemData,
            container: getPublicElement($itemContent),
            contentClass: this._itemContentClass(),
            defaultTemplateName: this.option("itemTemplate")
        });

        var that = this;
        when(renderContentPromise).done(function($itemContent) {
            that._postprocessRenderItem({
                itemElement: $itemFrame,
                itemContent: $itemContent,
                itemData: itemData,
                itemIndex: index
            });

            that._executeItemRenderAction(index, itemData, getPublicElement($itemFrame));
        });

        return $itemFrame;
    },

    _getItemContent: function($itemFrame) {
        var $itemContent = $itemFrame.find("." + ITEM_CONTENT_PLACEHOLDER_CLASS);
        $itemContent.removeClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
        return $itemContent;
    },

    _attachItemClickEvent: function(itemData, $itemElement) {
        if(!itemData || !itemData.onClick) {
            return;
        }

        eventsEngine.on($itemElement, clickEvent.name, (function(e) {
            this._itemEventHandlerByHandler($itemElement, itemData.onClick, {
                event: e
            });
        }).bind(this));
    },

    _renderItemContent: function(args) {
        var itemTemplateName = this._getItemTemplateName(args);
        var itemTemplate = this._getTemplate(itemTemplateName);

        this._addItemContentClasses(args);
        var $templateResult = $(this._createItemByTemplate(itemTemplate, args));
        if(!$templateResult.hasClass(TEMPLATE_WRAPPER_CLASS)) {
            return args.container;
        }

        return this._renderItemContentByNode(args, $templateResult);
    },

    _renderItemContentByNode: function(args, $node) {
        $(args.container).replaceWith($node);
        args.container = getPublicElement($node);
        this._addItemContentClasses(args);

        return $node;
    },

    _addItemContentClasses: function(args) {
        var classes = [
            ITEM_CLASS + CONTENT_CLASS_POSTFIX,
            args.contentClass
        ];

        $(args.container).addClass(classes.join(" "));
    },

    _appendItemToContainer: function($container, $itemFrame, index) {
        $itemFrame.appendTo($container);
    },

    _renderItemFrame: function(index, itemData, $container, $itemToReplace) {
        var $itemFrame = $("<div>");
        new (this.constructor.ItemClass)($itemFrame, this._itemOptions(), itemData || {});

        if($itemToReplace && $itemToReplace.length) {
            $itemToReplace.replaceWith($itemFrame);
        } else {
            this._appendItemToContainer.call(this, $container, $itemFrame, index);
        }

        return $itemFrame;
    },

    _itemOptions: function() {
        var that = this;
        return {
            watchMethod: function() {
                return that.option("integrationOptions.watchMethod");
            },
            fieldGetter: function(field) {
                var expr = that.option(field + "Expr"),
                    getter = compileGetter(expr);

                return getter;
            }
        };
    },

    _postprocessRenderItem: commonUtils.noop,

    _executeItemRenderAction: function(index, itemData, itemElement) {
        this._getItemRenderAction()({
            itemElement: itemElement,
            itemIndex: index,
            itemData: itemData
        });
    },

    _setElementData: function(element, data, index) {
        element
            .addClass([ITEM_CLASS, this._itemClass()].join(" "))
            .data(this._itemDataKey(), data)
            .data(this._itemIndexKey(), index);
    },

    _createItemRenderAction: function() {
        return (this._itemRenderAction = this._createActionByOption("onItemRendered", {
            element: this.element(),
            excludeValidators: ["disabled", "readOnly"],
            category: "rendering"
        }));
    },

    _getItemRenderAction: function() {
        return this._itemRenderAction || this._createItemRenderAction();
    },

    _getItemTemplateName: function(args) {
        var data = args.itemData,
            templateProperty = args.templateProperty || this.option("itemTemplateProperty"),
            template = data && data[templateProperty];

        return template || args.defaultTemplateName;
    },

    _createItemByTemplate: function(itemTemplate, renderArgs) {
        return itemTemplate.render({
            model: renderArgs.itemData,
            container: renderArgs.container,
            index: renderArgs.index
        });
    },

    _emptyMessageContainer: function() {
        return this._itemContainer();
    },

    _renderEmptyMessage: function(items) {
        items = items || this.option("items");
        var noDataText = this.option("noDataText"),
            hideNoData = !noDataText || (items && items.length) || this._isDataSourceLoading();

        if(hideNoData && this._$noData) {
            this._$noData.remove();
            this._$noData = null;
            this.setAria("label", undefined);
        }

        if(!hideNoData) {
            this._$noData = this._$noData || $("<div>").addClass("dx-empty-message");
            this._$noData
                .appendTo(this._emptyMessageContainer())
                .html(noDataText);
            this.setAria("label", noDataText);
        }
        this.$element().toggleClass(EMPTY_COLLECTION, !hideNoData);
    },

    _itemDXEventHandler: function(dxEvent, handlerOptionName, actionArgs, actionConfig) {
        this._itemEventHandler(dxEvent.target, handlerOptionName, extend(actionArgs, {
            event: dxEvent
        }), actionConfig);
    },

    _itemEventHandler: function(initiator, handlerOptionName, actionArgs, actionConfig) {
        var action = this._createActionByOption(handlerOptionName, extend({
            validatingTargetName: "itemElement"
        }, actionConfig));
        return this._itemEventHandlerImpl(initiator, action, actionArgs);
    },

    _itemEventHandlerByHandler: function(initiator, handler, actionArgs, actionConfig) {
        var action = this._createAction(handler, extend({
            validatingTargetName: "itemElement"
        }, actionConfig));
        return this._itemEventHandlerImpl(initiator, action, actionArgs);
    },

    _itemEventHandlerImpl: function(initiator, action, actionArgs) {
        var $itemElement = this._closestItemElement($(initiator)),
            args = extend({}, actionArgs);

        return action(extend(actionArgs, this._extendActionArgs($itemElement), args));
    },

    _extendActionArgs: function($itemElement) {
        return {
            itemElement: getPublicElement($itemElement),
            itemIndex: this._itemElements().index($itemElement),
            itemData: this._getItemData($itemElement)
        };
    },

    _closestItemElement: function($element) {
        return $($element).closest(this._itemSelector());
    },

    _getItemData: function(itemElement) {
        return $(itemElement).data(this._itemDataKey());
    },

    _getSummaryItemsWidth: function(items, includeMargin) {
        var result = 0;

        if(items) {
            iteratorUtils.each(items, function(_, item) {
                result += $(item).outerWidth(includeMargin || false);
            });
        }

        return result;
    },

    /**
    * @name CollectionWidgetmethods.getFocusedItemId
    * @publicName getFocusedItemId()
    * @return string
    * @hidden
    */
    getFocusedItemId: function() {
        if(!this._focusedItemId) {
            this._focusedItemId = "dx-" + new Guid();
        }

        return this._focusedItemId;
    },

    /**
    * @name CollectionWidgetmethods.itemElements
    * @publicName itemElements()
    * @return Array<Node>
    * @hidden
    */
    itemElements: function() {
        return this._itemElements();
    },

    /**
    * @name CollectionWidgetmethods.itemsContainer
    * @publicName itemsContainer()
    * @return Node
    * @hidden
    */
    itemsContainer: function() {
        return this._itemContainer();
    }

}).include(DataHelperMixin);

CollectionWidget.ItemClass = CollectionWidgetItem;

module.exports = CollectionWidget;
