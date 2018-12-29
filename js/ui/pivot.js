var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    fx = require("../animation/fx"),
    swipeEvents = require("../events/swipe"),
    translator = require("../animation/translator"),
    domUtils = require("../core/utils/dom"),
    extend = require("../core/utils/extend").extend,
    isDefined = require("../core/utils/type").isDefined,
    registerComponent = require("../core/component_registrator"),
    eventUtils = require("../events/utils"),
    config = require("../core/config"),
    CollectionWidget = require("./collection/ui.collection_widget.edit"),
    PivotTabs = require("./pivot/ui.pivot_tabs"),
    EmptyTemplate = require("./widget/empty_template"),
    ChildDefaultTemplate = require("./widget/child_default_template"),
    Deferred = require("../core/utils/deferred").Deferred;

var PIVOT_CLASS = "dx-pivot",
    PIVOT_AUTOHEIGHT_CLASS = "dx-pivot-autoheight",

    PIVOT_WRAPPER_CLASS = "dx-pivot-wrapper",

    PIVOT_TABS_CONTAINER_CLASS = "dx-pivottabs-container",

    PIVOT_ITEM_CONTAINER_CLASS = "dx-pivot-itemcontainer",
    PIVOT_ITEM_WRAPPER_CLASS = "dx-pivot-itemwrapper",

    PIVOT_ITEM_CLASS = "dx-pivot-item",
    PIVOT_ITEM_HIDDEN_CLASS = "dx-pivot-item-hidden",
    PIVOT_ITEM_DATA_KEY = "dxPivotItemData",

    PIVOT_RETURN_BACK_DURATION = 200,

    PIVOT_SLIDE_AWAY_DURATION = 50,

    PIVOT_SLIDE_BACK_DURATION = 250,
    PIVOT_SLIDE_BACK_EASING = "cubic-bezier(.10, 1, 0, 1)";

var animation = {

    returnBack: function($element) {
        fx.animate($element, {
            type: "slide",
            to: { left: 0 },
            duration: PIVOT_RETURN_BACK_DURATION
        });
    },

    slideAway: function($element, position, complete) {
        fx.animate($element, {
            type: "slide",
            to: { left: position },
            duration: PIVOT_SLIDE_AWAY_DURATION,
            complete: complete
        });
    },

    slideBack: function($element) {
        fx.animate($element, {
            type: "slide",
            to: { left: 0 },
            easing: PIVOT_SLIDE_BACK_EASING,
            duration: PIVOT_SLIDE_BACK_DURATION
        });
    },

    complete: function($element) {
        fx.stop($element, true);
    }

};

/**
* @name dxPivot
* @inherits CollectionWidget
* @module ui/pivot
* @export default
* @deprecated
*/
var Pivot = CollectionWidget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxPivotOptions.selectedIndex
            * @type number
            * @default 0
            */
            selectedIndex: 0,

            /**
            * @name dxPivotOptions.swipeEnabled
            * @type boolean
            * @default true
            */
            swipeEnabled: true,

            /**
            * @name dxPivotOptions.itemTitleTemplate
            * @type template|function
            * @default "title"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            itemTitleTemplate: "title",

            /**
            * @name dxPivotOptions.contentTemplate
            * @type template|function
            * @default "content"
            * @type_function_param1 container:dxElement
            * @type_function_return string|Node|jQuery
            */
            contentTemplate: "content",

            /**
             * @name dxPivotOptions.focusStateEnabled
             * @type boolean
             * @default false
             * @hidden
             */
            focusStateEnabled: false,

            selectionMode: "single",
            selectionRequired: true,
            selectionByClick: false

            /**
            * @name dxPivotOptions.noDataText
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPivotOptions.selectedItems
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPivotOptions.selectedItemKeys
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPivotOptions.keyExpr
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPivotOptions.accessKey
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPivotOptions.tabIndex
            * @hidden
            * @inheritdoc
            */

            /**
             * @name dxPivotOptions.items
             * @type Array<string, dxPivotItem, object>
             * @fires dxPivotOptions.onOptionChanged
             * @inheritdoc
             */
        });
    },

    _itemClass: function() {
        return PIVOT_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return PIVOT_ITEM_DATA_KEY;
    },

    _itemContainer: function() {
        return this._$itemWrapper;
    },

    _elementWidth: function() {
        if(!this._elementWidthCache) {
            this._elementWidthCache = this.$element().width();
        }

        return this._elementWidthCache;
    },

    _clearElementWidthCache: function() {
        delete this._elementWidthCache;
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(PIVOT_CLASS);

        this._initWrapper();

        this._initTabs();
        this._initItemContainer();
        this._clearItemsCache();

        this._initSwipeHandlers();
    },

    _initTemplates: function() {
        this.callBase();
        /**
        * @name dxPivotItem
        * @inherits CollectionWidgetItem
        * @type object
        */
        /**
        * @name dxPivotItem.titleTemplate
        * @type template|function
        * @type_function_return string|Node|jQuery
        */
        /**
        * @name dxPivotItem.visible
        * @hidden
        * @inheritdoc
        */
        /**
        * @name dxPivotItem.title
        * @type String
        */
        this._defaultTemplates["content"] = new EmptyTemplate();
        this._defaultTemplates["title"] = new ChildDefaultTemplate("item", this);
    },

    _dimensionChanged: function() {
        this._clearElementWidthCache();
    },

    _initWrapper: function() {
        this._$wrapper = $("<div>")
            .addClass(PIVOT_WRAPPER_CLASS)
            .appendTo(this.$element());
    },

    _initItemContainer: function() {
        var $itemContainer = $("<div>").addClass(PIVOT_ITEM_CONTAINER_CLASS);
        this._$wrapper.append($itemContainer);

        this._$itemWrapper = $("<div>").addClass(PIVOT_ITEM_WRAPPER_CLASS);
        $itemContainer.append(this._$itemWrapper);
    },

    _clearItemsCache: function() {
        this._itemsCache = [];
    },

    _initTabs: function() {
        var that = this,
            $tabsContainer = $("<div>").addClass(PIVOT_TABS_CONTAINER_CLASS);

        this._$wrapper.append($tabsContainer);

        this._tabs = this._createComponent($tabsContainer, PivotTabs, {
            itemTemplateProperty: "titleTemplate",
            itemTemplate: this._getTemplateByOption("itemTitleTemplate"),

            items: this.option("items"),

            selectedIndex: this.option("selectedIndex"),

            onPrepare: function() {
                that._prepareAnimation();
            },
            onUpdatePosition: function(args) {
                that._updateContentPosition(args.offset);
            },
            onRollback: function() {
                that._animateRollback();
            },
            onSelectionChanged: function(args) {
                that.option("selectedItem", args.addedItems[0]);
            },

            swipeEnabled: this.option("swipeEnabled")
        });
    },

    _initMarkup: function() {
        this._renderContentTemplate();
        this.callBase();
    },

    _render: function() {
        this.callBase();

        var selectedIndex = this.option("selectedIndex");
        this._renderCurrentContent(selectedIndex, selectedIndex);
    },

    _renderContentTemplate: function() {
        if(isDefined(this._singleContent)) {
            return;
        }

        this._getTemplateByOption("contentTemplate").render({
            container: domUtils.getPublicElement(this._$itemWrapper)
        });
        this._singleContent = !this._$itemWrapper.is(":empty");
    },

    _renderDimensions: function() {
        this.callBase();

        this.$element().toggleClass(PIVOT_AUTOHEIGHT_CLASS, this.option("height") === "auto");
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._tabs._dimensionChanged();
        }
    },

    _renderCurrentContent: function(currentIndex, previousIndex) {
        var itemsCache = this._itemsCache;
        itemsCache[previousIndex] = this._selectedItemElement();

        var $hidingItem = itemsCache[previousIndex],
            $showingItem = itemsCache[currentIndex];

        domUtils.triggerHidingEvent($hidingItem);
        $hidingItem.addClass(PIVOT_ITEM_HIDDEN_CLASS);
        if($showingItem) {
            $showingItem.removeClass(PIVOT_ITEM_HIDDEN_CLASS);
            domUtils.triggerShownEvent($showingItem);
        } else {
            this._prepareContent();
            this._renderContent();
        }

        this._selectionChangePromise && this._selectionChangePromise.resolve();
        this._selectionChangePromise = new Deferred();
    },

    _updateContentPosition: function(offset) {
        translator.move(this._$itemWrapper, { left: this._calculatePixelOffset(offset) });
    },

    _animateRollback: function() {
        animation.returnBack(this._$itemWrapper);
    },

    _animateComplete: function(newIndex, currentIndex) {
        var $itemWrapper = this._$itemWrapper,

            rtlSignCorrection = this._getRTLSignCorrection(),
            intermediatePosition = this._elementWidth() * (this._isPrevSwipeHandled() ? 1 : -1) * rtlSignCorrection;

        animation.slideAway($itemWrapper, intermediatePosition, (function() {
            translator.move($itemWrapper, { left: -intermediatePosition });

            this._renderCurrentContent(newIndex, currentIndex);
        }).bind(this));
        animation.slideBack($itemWrapper);
    },

    _calculatePixelOffset: function(offset) {
        offset = offset || 0;

        return offset * this._elementWidth();
    },

    _isPrevSwipeHandled: function() {
        var wrapperOffset = translator.locate(this._$itemWrapper).left,
            rtl = this.option("rtlEnabled");

        return rtl ^ (wrapperOffset > 0) && (wrapperOffset !== 0);
    },

    _initSwipeHandlers: function() {
        var $element = this.$element();

        eventsEngine.on($element, eventUtils.addNamespace(swipeEvents.start, this.NAME), {
            itemSizeFunc: this._elementWidth.bind(this)
        }, this._swipeStartHandler.bind(this));
        eventsEngine.on($element, eventUtils.addNamespace(swipeEvents.swipe, this.NAME), this._swipeUpdateHandler.bind(this));
        eventsEngine.on($element, eventUtils.addNamespace(swipeEvents.end, this.NAME), this._swipeEndHandler.bind(this));
    },

    _swipeStartHandler: function(e) {
        this._prepareAnimation();
        this._tabs.prepare();

        if(config().designMode || this.option("disabled") || !this.option("swipeEnabled") || this._indexBoundary() <= 1) {
            e.cancel = true;
        } else {
            this._swipeGestureRunning = true;
        }

        e.maxLeftOffset = 1;
        e.maxRightOffset = 1;
    },

    _prepareAnimation: function() {
        this._stopAnimation();
    },

    _stopAnimation: function() {
        animation.complete(this._$itemWrapper);
    },

    _swipeUpdateHandler: function(e) {
        var offset = e.offset;

        this._updateContentPosition(offset);
        this._tabs.updatePosition(offset);
    },

    _swipeEndHandler: function(e) {
        var targetOffset = e.targetOffset * this._getRTLSignCorrection();

        if(targetOffset === 0) {
            this._animateRollback();
            this._tabs.rollback();
        } else {
            var newIndex = this._normalizeIndex(this.option("selectedIndex") - targetOffset);
            this.option("selectedIndex", newIndex);
        }

        this._swipeGestureRunning = false;
    },

    _normalizeIndex: function(index) {
        var boundary = this._indexBoundary();

        if(index < 0) {
            index = boundary + index;
        }
        if(index >= boundary) {
            index = index - boundary;
        }

        return index;
    },

    _indexBoundary: function() {
        return this.option("items").length;
    },

    _renderContentImpl: function() {
        if(this._singleContent) {
            return;
        }

        var items = this.option("items"),
            selectedIndex = this.option("selectedIndex");

        if(items.length) {
            this._renderItems([items[selectedIndex]]);
        }
    },

    _selectedItemElement: function() {
        return this._$itemWrapper.children("." + PIVOT_ITEM_CLASS + ":not(." + PIVOT_ITEM_HIDDEN_CLASS + ")");
    },

    _getRTLSignCorrection: function() {
        return this.option("rtlEnabled") ? -1 : 1;
    },

    _clean: function() {
        animation.complete(this._$itemWrapper);

        this.callBase();
    },

    _cleanItemContainer: function() {
        if(this._singleContent) {
            return;
        }

        this.callBase();
    },

    _refresh: function() {
        this._tabs._refresh();

        this.callBase();
    },

    _updateSelection: function(addedItems, removedItems) {
        var newIndex = addedItems[0],
            oldIndex = removedItems[0];

        if(!this._swipeGestureRunning) {
            this._prepareAnimation();
        }

        this._animateComplete(newIndex, oldIndex);
        this._tabs.option("selectedIndex", newIndex);
    },

    _optionChanged: function(args) {
        var value = args.value;

        switch(args.name) {
            case "disabled":
                this._tabs.option("disabled", value);
                this.callBase(args);
                break;
            case "items":
                this._tabs.option(args.fullName, value);
                this._clearItemsCache();
                this.callBase(args);
                break;
            case "rtlEnabled":
                this._tabs.option("rtlEnabled", value);
                this._clearItemsCache();
                this.callBase(args);
                break;
            case "itemTitleTemplate":
                this._tabs.option("itemTemplate", this._getTemplate(value));
                break;
            case "swipeEnabled":
                this._tabs.option("swipeEnabled", value);
                break;
            case "contentTemplate":
                this._singleContent = null;
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }

    /**
    * @name dxPivotMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @inheritdoc
    */

    /**
    * @name dxPivotMethods.focus
    * @publicName focus()
    * @hidden
    * @inheritdoc
    */

});

registerComponent("dxPivot", Pivot);

module.exports = Pivot;

///#DEBUG
module.exports.mockPivotTabs = function(Mock) {
    PivotTabs = Mock;
};
module.exports.animation = animation;
///#ENDDEBUG
