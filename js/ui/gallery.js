"use strict";

var $ = require("../core/renderer"),
    registerComponent = require("../core/component_registrator"),
    commonUtils = require("../core/utils/common"),
    typeUtils = require("../core/utils/type"),
    extend = require("../core/utils/extend").extend,
    fx = require("../animation/fx"),
    clickEvent = require("../events/click"),
    translator = require("../animation/translator"),
    devices = require("../core/devices"),
    Widget = require("./widget/ui.widget"),
    eventUtils = require("../events/utils"),
    CollectionWidget = require("./collection/ui.collection_widget.edit"),
    Swipeable = require("../events/gesture/swipeable"),
    BindableTemplate = require("./widget/bindable_template");

var GALLERY_CLASS = "dx-gallery",
    GALLERY_WRAPPER_CLASS = GALLERY_CLASS + "-wrapper",
    GALLERY_LOOP_CLASS = "dx-gallery-loop",
    GALLERY_ITEM_CONTAINER_CLASS = GALLERY_CLASS + "-container",
    GALLERY_ACTIVE_CLASS = GALLERY_CLASS + "-active",

    GALLERY_ITEM_CLASS = GALLERY_CLASS + "-item",
    GALLERY_LOOP_ITEM_CLASS = GALLERY_ITEM_CLASS + "-loop",
    GALLERY_ITEM_SELECTOR = "." + GALLERY_ITEM_CLASS,
    GALLERY_ITEM_SELECTED_CLASS = GALLERY_ITEM_CLASS + "-selected",

    GALLERY_INDICATOR_CLASS = GALLERY_CLASS + "-indicator",
    GALLERY_INDICATOR_ITEM_CLASS = GALLERY_INDICATOR_CLASS + "-item",
    GALLERY_INDICATOR_ITEM_SELECTOR = "." + GALLERY_INDICATOR_ITEM_CLASS,
    GALLERY_INDICATOR_ITEM_SELECTED_CLASS = GALLERY_INDICATOR_ITEM_CLASS + "-selected",

    GALLERY_IMAGE_CLASS = "dx-gallery-item-image",

    GALLERY_ITEM_DATA_KEY = "dxGalleryItemData",

    MAX_CALC_ERROR = 1;

var GalleryNavButton = Widget.inherit({
    _supportedKeys: function() {
        return extend(this.callBase(), {
            pageUp: commonUtils.noop,
            pageDown: commonUtils.noop
        });
    },
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            direction: "next",
            onClick: null,
            hoverStateEnabled: true,
            activeStateEnabled: true
        });
    },

    _render: function() {
        this.callBase();

        var that = this,
            $element = this.element(),
            eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);

        $element
            .addClass(GALLERY_CLASS + "-nav-button-" + this.option("direction"))
            .off(eventName)
            .on(eventName, function(e) {
                that._createActionByOption("onClick")({ jQueryEvent: e });
            });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "onClick":
            case "direction":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }
});


/**
* @name dxgallery
* @publicName dxGallery
* @inherits CollectionWidget
* @groupName Collection Widgets
* @module ui/gallery
* @export default
*/
var Gallery = CollectionWidget.inherit({

    _activeStateUnit: GALLERY_ITEM_SELECTOR,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxGalleryOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @type boolean
            * @default false
            */
            activeStateEnabled: false,

            /**
            * @name dxGalleryOptions_animationDuration
            * @publicName animationDuration
            * @type number
            * @default 400
            */
            animationDuration: 400,

            /**
            * @name dxGalleryOptions_animationEnabled
            * @publicName animationEnabled
            * @type boolean
            * @default true
            */
            animationEnabled: true,

            /**
            * @name dxGalleryOptions_loop
            * @publicName loop
            * @type boolean
            * @default false
            */
            loop: false,

            /**
            * @name dxGalleryOptions_swipeEnabled
            * @publicName swipeEnabled
            * @type boolean
            * @default true
            */
            swipeEnabled: true,

            /**
            * @name dxGalleryOptions_indicatorEnabled
            * @publicName indicatorEnabled
            * @type boolean
            * @default true
            */
            indicatorEnabled: true,

            /**
            * @name dxGalleryOptions_showIndicator
            * @publicName showIndicator
            * @type boolean
            * @default true
            */
            showIndicator: true,

            /**
            * @name dxGalleryOptions_selectedindex
            * @publicName selectedIndex
            * @type number
            * @default 0
            */
            selectedIndex: 0,

            /**
            * @name dxGalleryOptions_slideshowdelay
            * @publicName slideshowDelay
            * @type number
            * @default 0
            */
            slideshowDelay: 0,

            /**
            * @name dxGalleryOptions_showNavButtons
            * @publicName showNavButtons
            * @type boolean
            * @default false
            */
            showNavButtons: false,

            /**
            * @name dxGalleryOptions_wrapAround
            * @publicName wrapAround
            * @type boolean
            * @default false
            */
            wrapAround: false,

            /**
            * @name dxGalleryOptions_initialItemWidth
            * @publicName initialItemWidth
            * @type number
            * @default undefined
            */
            initialItemWidth: undefined,

            /**
            * @name dxGalleryOptions_stretchImages
            * @publicName stretchImages
            * @type boolean
            * @default false
            */
            stretchImages: false,

            /**
            * @name dxGalleryOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @hidden
            */

            /**
            * @name dxGalleryOptions_noDataText
            * @publicName noDataText
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxGalleryOptions_selectedItems
            * @publicName selectedItems
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxGalleryOptions_selectedItemKeys
            * @publicName selectedItemKeys
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxGalleryOptions_keyExpr
            * @publicName keyExpr
            * @hidden
            * @extend_doc
            */

            _itemAttributes: { role: "option" },
            loopItemFocus: false,
            selectOnFocus: true,
            selectionMode: "single",
            selectionRequired: true,
            selectionByClick: false

            /**
            * @name dxGalleryItemTemplate_imageSrc
            * @publicName imageSrc
            * @type String
            */
            /**
            * @name dxGalleryItemTemplate_imageAlt
            * @publicName imageAlt
            * @type String
            */
            /**
            * @name dxGalleryItemTemplate_visible
            * @publicName visible
            * @hidden
            * @extend_doc
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxGalleryOptions_focusStateEnabled
                    * @publicName focusStateEnabled
                    * @type boolean
                    * @custom_default_for_generic true
                    * @extend_doc
                    */
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this.option("loopItemFocus", this.option("loop"));
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["item"] = new BindableTemplate(function($container, data) {
            var $img = $('<img>').addClass(GALLERY_IMAGE_CLASS);

            if(typeUtils.isPlainObject(data)) {
                $img.attr({
                    'src': data.imageSrc,
                    'alt': data.imageAlt
                }).appendTo($container);
            } else {
                $img.attr('src', String(data)).appendTo($container);
            }
        }, ["imageSrc", "imageAlt"], this.option("integrationOptions.watchMethod"));
    },

    _dataSourceOptions: function() {
        return {
            paginate: false
        };
    },

    _itemContainer: function() {
        return this._$container;
    },

    _itemClass: function() {
        return GALLERY_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return GALLERY_ITEM_DATA_KEY;
    },

    _actualItemWidth: function() {
        var itemPerPage = this.option("wrapAround") ? this._itemsPerPage() + 1 : this._itemsPerPage();

        if(this.option("stretchImages")) {
            return 1 / itemPerPage;
        }

        if(this.option("wrapAround")) {
            return this._itemPercentWidth() * this._itemsPerPage() / (this._itemsPerPage() + 1);
        }

        return this._itemPercentWidth();
    },

    _itemPercentWidth: function() {
        var percentWidth,
            elementWidth = this.element().outerWidth(),
            initialItemWidth = this.option("initialItemWidth");

        if(initialItemWidth && initialItemWidth <= elementWidth) {
            percentWidth = this.option("initialItemWidth") / elementWidth;
        } else {
            percentWidth = 1;
        }

        return percentWidth;
    },

    _itemsPerPage: function() {
        var itemsPerPage = Math.floor(1 / this._itemPercentWidth());

        return Math.min(itemsPerPage, this._itemsCount());
    },

    _pagesCount: function() {
        return Math.ceil(this._itemsCount() / this._itemsPerPage());
    },

    _itemsCount: function() {
        return (this.option("items") || []).length;
    },

    _offsetDirection: function() {
        return this.option("rtlEnabled") ? -1 : 1;
    },

    _render: function() {
        this.element().addClass(GALLERY_CLASS);
        this.element().toggleClass(GALLERY_LOOP_CLASS, this.option("loop"));

        this._renderDragHandler();
        this._renderWrapper();
        this._renderItemsContainer();

        this.callBase();
        this._renderContainerPosition();
        this._renderItemSizes();
        this._renderItemPositions();

        this._renderNavButtons();
        this._renderIndicator();
        this._renderSelectedItem();
        this._renderUserInteraction();

        this._setupSlideShow();

        this._reviseDimensions();

        this.setAria({
            "role": "listbox",
            "label": "gallery"
        });
        this._fireContentReadyAction();
    },

    _renderContent: function() {
        this._renderContentImpl();
    },

    _dimensionChanged: function() {
        var selectedIndex = this.option("selectedIndex") || 0;

        this._stopItemAnimations();
        this._clearCacheWidth();

        this._renderDuplicateItems();

        this._renderItemSizes();
        this._renderItemPositions();
        this._renderIndicator();
        this._renderContainerPosition(this._calculateIndexOffset(selectedIndex));
    },

    _renderDragHandler: function() {
        var eventName = eventUtils.addNamespace("dragstart", this.NAME);

        this.element()
            .off(eventName)
            .on(eventName, "img", function() { return false; });
    },

    _renderWrapper: function() {
        if(this._$wrapper) {
            return;
        }
        this._$wrapper = $("<div />")
            .addClass(GALLERY_WRAPPER_CLASS)
            .appendTo(this.element());
    },

    _renderItems: function(items) {
        this.callBase(items);

        this._loadNextPageIfNeeded();
    },

    _renderItemsContainer: function() {
        if(this._$container) {
            return;
        }
        this._$container = $("<div>")
            .addClass(GALLERY_ITEM_CONTAINER_CLASS)
            .appendTo(this._$wrapper);
    },

    _renderDuplicateItems: function() {
        if(!this.option("loop")) {
            return;
        }

        var items = this.option("items") || [],
            itemsCount = items.length,
            lastItemIndex = itemsCount - 1,
            i;

        if(!itemsCount) return;

        this.element().find("." + GALLERY_LOOP_ITEM_CLASS).remove();

        var duplicateCount = Math.min(this._itemsPerPage(), itemsCount);

        for(i = 0; i < duplicateCount; i++) {
            this._renderItem(0, items[i]).addClass(GALLERY_LOOP_ITEM_CLASS);
        }

        for(i = 0; i < duplicateCount; i++) {
            this._renderItem(0, items[lastItemIndex - i]).addClass(GALLERY_LOOP_ITEM_CLASS);
        }
    },

    _emptyMessageContainer: function() {
        return this._$wrapper;
    },

    _renderItemSizes: function(startIndex) {
        var $items = this._itemElements(),
            itemWidth = this._actualItemWidth();

        if(startIndex !== undefined) {
            $items = $items.slice(startIndex);
        }

        $items.each(function(index) {
            $($items[index]).outerWidth(itemWidth * 100 + "%");
        });
    },

    _renderItemPositions: function() {
        var itemWidth = this._actualItemWidth(),
            itemsCount = this._itemsCount(),
            itemsPerPage = this._itemsPerPage(),
            loopItemsCount = this.element().find("." + GALLERY_LOOP_ITEM_CLASS).length,
            lastItemDuplicateIndex = itemsCount + loopItemsCount - 1,
            offsetRatio = this.option("wrapAround") ? 0.5 : 0,
            freeSpace = this._itemFreeSpace(),
            rtlEnabled = this.option("rtlEnabled");

        this._itemElements().each(function(index) {
            var realIndex = index;

            if(index > itemsCount + itemsPerPage - 1) {
                realIndex = lastItemDuplicateIndex - realIndex - itemsPerPage;
            }


            var itemPosition = itemWidth * (realIndex + offsetRatio) + freeSpace * (realIndex + 1 - offsetRatio);
            $(this).css(rtlEnabled ? "right" : "left", itemPosition * 100 + "%");
        });

        this._relocateItems(this.option("selectedIndex"), this.option("selectedIndex"), true);
    },

    _itemFreeSpace: function() {
        var itemsPerPage = this._itemsPerPage();

        if(this.option("wrapAround")) {
            itemsPerPage = itemsPerPage + 1;
        }

        return (1 - this._actualItemWidth() * itemsPerPage) / (itemsPerPage + 1);
    },

    _renderContainerPosition: function(offset, animate) {
        offset = offset || 0;

        var that = this,
            itemWidth = this._actualItemWidth(),
            targetIndex = offset,
            targetPosition = this._offsetDirection() * targetIndex * (itemWidth + this._itemFreeSpace()),
            positionReady;

        if(typeUtils.isDefined(this._animationOverride)) {
            animate = this._animationOverride;
            delete this._animationOverride;
        }

        if(animate) {
            that._startSwipe();
            positionReady = that._animate(targetPosition).done(that._endSwipe.bind(that));
        } else {
            translator.move(this._$container, { left: targetPosition * this._elementWidth(), top: 0 });
            positionReady = $.Deferred().resolveWith(that);
        }

        if(this._deferredAnimate) {
            positionReady.done(function() {
                that._deferredAnimate.resolveWith(that);
            });
        }

        return positionReady.promise();
    },

    _startSwipe: function() {
        this.element().addClass(GALLERY_ACTIVE_CLASS);
    },

    _endSwipe: function() {
        this.element().removeClass(GALLERY_ACTIVE_CLASS);
    },

    _animate: function(targetPosition, extraConfig) {
        var that = this,
            $container = this._$container,
            animationComplete = $.Deferred();

        fx.animate(this._$container, extend({
            type: "slide",
            to: { left: targetPosition * this._elementWidth() },
            duration: that.option("animationDuration"),
            complete: function() {
                if(that._needMoveContainerForward()) {
                    translator.move($container, { left: 0, top: 0 });
                }

                if(that._needMoveContainerBack()) {
                    translator.move($container, { left: that._maxContainerOffset() * that._elementWidth(), top: 0 });
                }

                animationComplete.resolveWith(that);
            }
        }, extraConfig || {}));

        return animationComplete;
    },

    _needMoveContainerForward: function() {
        var expectedPosition = this._$container.position().left * this._offsetDirection(),
            actualPosition = -this._maxItemWidth() * this._elementWidth() * this._itemsCount();

        return expectedPosition <= actualPosition + MAX_CALC_ERROR;
    },

    _needMoveContainerBack: function() {
        var expectedPosition = this._$container.position().left * this._offsetDirection(),
            actualPosition = this._actualItemWidth() * this._elementWidth();

        return expectedPosition >= actualPosition - MAX_CALC_ERROR;
    },

    _maxContainerOffset: function() {
        return -this._maxItemWidth() * (this._itemsCount() - this._itemsPerPage()) * this._offsetDirection();
    },

    _maxItemWidth: function() {
        return this._actualItemWidth() + this._itemFreeSpace();
    },

    _reviseDimensions: function() {
        var that = this,
            $firstItem = that._itemElements().first().find(".dx-item-content");

        if(!$firstItem || $firstItem.is(":hidden")) {
            return;
        }

        if(!that.option("height")) {
            that.option("height", $firstItem.outerHeight());
        }
        if(!that.option("width")) {
            that.option("width", $firstItem.outerWidth());
        }

        this._dimensionChanged();
    },

    _renderIndicator: function() {
        this._cleanIndicators();

        if(!this.option("showIndicator")) {
            return;
        }

        var indicator = this._$indicator = $("<div>")
            .addClass(GALLERY_INDICATOR_CLASS)
            .appendTo(this._$wrapper);

        for(var i = 0; i < this._pagesCount(); i++) {
            $("<div>").addClass(GALLERY_INDICATOR_ITEM_CLASS).appendTo(indicator);
        }

        this._renderSelectedPageIndicator();
    },

    _cleanIndicators: function() {
        if(this._$indicator) {
            this._$indicator.remove();
        }
    },

    _renderSelectedItem: function() {
        var selectedIndex = this.option("selectedIndex");

        this._itemElements()
            .removeClass(GALLERY_ITEM_SELECTED_CLASS)
            .eq(selectedIndex)
            .addClass(GALLERY_ITEM_SELECTED_CLASS);
    },

    _renderSelectedPageIndicator: function() {
        if(!this._$indicator) {
            return;
        }

        var itemIndex = this.option("selectedIndex"),
            lastIndex = this._pagesCount() - 1,
            pageIndex = Math.ceil(itemIndex / this._itemsPerPage());

        pageIndex = Math.min(lastIndex, pageIndex);

        this._$indicator
            .find(GALLERY_INDICATOR_ITEM_SELECTOR)
            .removeClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS)
            .eq(pageIndex)
            .addClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS);
    },

    _renderUserInteraction: function() {
        var rootElement = this.element(),
            swipeEnabled = this.option("swipeEnabled") && this._itemsCount() > 1;

        this._createComponent(rootElement, Swipeable, {
            disabled: this.option("disabled") || !swipeEnabled,
            onStart: this._swipeStartHandler.bind(this),
            onUpdated: this._swipeUpdateHandler.bind(this),
            onEnd: this._swipeEndHandler.bind(this),
            itemSizeFunc: this._elementWidth.bind(this)
        });

        var indicatorSelectAction = this._createAction(this._indicatorSelectHandler);

        rootElement
            .off(eventUtils.addNamespace(clickEvent.name, this.NAME), GALLERY_INDICATOR_ITEM_SELECTOR)
            .on(eventUtils.addNamespace(clickEvent.name, this.NAME), GALLERY_INDICATOR_ITEM_SELECTOR, function(e) {
                indicatorSelectAction({ jQueryEvent: e });
            });
    },

    _indicatorSelectHandler: function(args) {
        var e = args.jQueryEvent,
            instance = args.component;

        if(!instance.option("indicatorEnabled")) {
            return;
        }

        var indicatorIndex = $(e.target).index(),
            itemIndex = instance._fitPaginatedIndex(indicatorIndex * instance._itemsPerPage());

        instance._needLongMove = true;

        instance.option("selectedIndex", itemIndex);
        instance._loadNextPageIfNeeded(itemIndex);
    },

    _renderNavButtons: function() {
        var that = this;

        if(!that.option("showNavButtons")) {
            that._cleanNavButtons();
            return;
        }

        that._prevNavButton = $("<div>").appendTo(this._$wrapper);
        that._createComponent(that._prevNavButton, GalleryNavButton, {
            direction: "prev",
            onClick: function() {
                that._prevPage();
            }
        });

        that._nextNavButton = $("<div>").appendTo(this._$wrapper);
        that._createComponent(that._nextNavButton, GalleryNavButton, {
            direction: "next",
            onClick: function() {
                that._nextPage();
            }
        });

        this._renderNavButtonsVisibility();
    },

    _prevPage: function() {
        var visiblePageSize = this._itemsPerPage(),
            newSelectedIndex = this.option("selectedIndex") - visiblePageSize;

        if(newSelectedIndex === -visiblePageSize && visiblePageSize === this._itemsCount()) {
            return this._relocateItems(newSelectedIndex, 0);
        } else {
            return this.goToItem(this._fitPaginatedIndex(newSelectedIndex));
        }
    },

    _nextPage: function() {
        var visiblePageSize = this._itemsPerPage(),
            newSelectedIndex = this.option("selectedIndex") + visiblePageSize;

        if(newSelectedIndex === visiblePageSize && visiblePageSize === this._itemsCount()) {
            return this._relocateItems(newSelectedIndex, 0);
        } else {
            return this.goToItem(this._fitPaginatedIndex(newSelectedIndex)).done(this._loadNextPageIfNeeded);
        }
    },

    _loadNextPageIfNeeded: function(selectedIndex) {
        selectedIndex = selectedIndex === undefined ? this.option("selectedIndex") : selectedIndex;
        if(
           this._dataSource &&
           this._dataSource.paginate() &&
           this._shouldLoadNextPage(selectedIndex) &&
           !this._isDataSourceLoading() &&
           !this._isLastPage()
        ) {
            this._loadNextPage().done((function() {
                this._renderIndicator();
                this._renderItemPositions();
                this._renderNavButtonsVisibility();
                this._renderItemSizes(selectedIndex);
            }).bind(this));
        }
    },

    _shouldLoadNextPage: function(selectedIndex) {
        var visiblePageSize = this._itemsPerPage();

        return selectedIndex + 2 * visiblePageSize > this.option("items").length;
    },

    _allowDynamicItemsAppend: function() {
        return true;
    },

    _fitPaginatedIndex: function(itemIndex) {
        var itemsPerPage = this._itemsPerPage();

        var restItemsCount = itemIndex < 0 ? itemsPerPage + itemIndex : this._itemsCount() - itemIndex;

        if(itemIndex > this._itemsCount() - 1) {
            itemIndex = 0;
            this._goToGhostItem = true;
        } else if(restItemsCount < itemsPerPage && restItemsCount > 0) {
            if(itemIndex > 0) {
                itemIndex = itemIndex - (itemsPerPage - restItemsCount);
            } else {
                itemIndex = itemIndex + (itemsPerPage - restItemsCount);
            }
        }
        return itemIndex;
    },

    _cleanNavButtons: function() {
        if(this._prevNavButton) {
            this._prevNavButton.remove();
            delete this._prevNavButton;
        }
        if(this._nextNavButton) {
            this._nextNavButton.remove();
            delete this._nextNavButton;
        }
    },

    _renderNavButtonsVisibility: function() {
        if(!this.option("showNavButtons") || !this._prevNavButton || !this._nextNavButton) {
            return;
        }

        var selectedIndex = this.option("selectedIndex"),
            loop = this.option("loop"),
            itemsCount = this._itemsCount();

        this._prevNavButton.show();
        this._nextNavButton.show();

        if(itemsCount === 0) {
            this._prevNavButton.hide();
            this._nextNavButton.hide();
        }

        if(loop) {
            return;
        }

        var nextHidden = selectedIndex === itemsCount - this._itemsPerPage(),
            prevHidden = itemsCount < 2 || selectedIndex === 0;

        if(this._dataSource && this._dataSource.paginate()) {
            nextHidden = nextHidden && this._isLastPage();
        } else {
            nextHidden = nextHidden || itemsCount < 2;
        }

        if(prevHidden) {
            this._prevNavButton.hide();
        }
        if(nextHidden) {
            this._nextNavButton.hide();
        }
    },

    _setupSlideShow: function() {
        var that = this,
            slideshowDelay = that.option("slideshowDelay");

        clearTimeout(that._slideshowTimer);

        if(!slideshowDelay) {
            return;
        }

        that._slideshowTimer = setTimeout(function() {
            if(that._userInteraction) {
                that._setupSlideShow();
                return;
            }
            that.nextItem(true).done(that._setupSlideShow);
        }, slideshowDelay);
    },

    _elementWidth: function() {
        if(!this._cacheElementWidth) {
            this._cacheElementWidth = this.element().width();
        }

        return this._cacheElementWidth;
    },

    _clearCacheWidth: function() {
        delete this._cacheElementWidth;
    },

    _swipeStartHandler: function(e) {
        this._clearCacheWidth();
        this._elementWidth();

        var itemsCount = this._itemsCount();

        if(!itemsCount) {
            e.jQueryEvent.cancel = true;
            return;
        }

        this._stopItemAnimations();
        this._startSwipe();
        this._userInteraction = true;
        if(!this.option("loop")) {
            var selectedIndex = this.option("selectedIndex"),
                startOffset = itemsCount - selectedIndex - this._itemsPerPage(),
                endOffset = selectedIndex,
                rtlEnabled = this.option("rtlEnabled");

            e.jQueryEvent.maxLeftOffset = rtlEnabled ? endOffset : startOffset;
            e.jQueryEvent.maxRightOffset = rtlEnabled ? startOffset : endOffset;
        }
    },

    _stopItemAnimations: function() {
        fx.stop(this._$container, true);
    },

    _swipeUpdateHandler: function(e) {
        var wrapAroundRatio = this.option("wrapAround") ? 1 : 0;

        var offset = this._offsetDirection() * e.jQueryEvent.offset * (this._itemsPerPage() + wrapAroundRatio) - this.option("selectedIndex");

        if(offset < 0) {
            this._loadNextPageIfNeeded(Math.ceil(Math.abs(offset)));
        }

        this._renderContainerPosition(offset);
    },

    _swipeEndHandler: function(e) {
        var targetOffset = e.jQueryEvent.targetOffset * this._offsetDirection() * this._itemsPerPage(),
            selectedIndex = this.option("selectedIndex"),
            newIndex = this._fitIndex(selectedIndex - targetOffset),
            paginatedIndex = this._fitPaginatedIndex(newIndex);

        if(Math.abs(targetOffset) < this._itemsPerPage()) {
            this._relocateItems(selectedIndex);
            return;
        }

        if(this._itemsPerPage() === this._itemsCount()) {
            if(targetOffset > 0) {
                this._relocateItems(-targetOffset);
            } else {
                this._relocateItems(0);
            }

            return;
        }

        this.option("selectedIndex", paginatedIndex);
    },

    _setFocusOnSelect: function() {
        this._userInteraction = true;

        var selectedItem = this.itemElements().filter("." + GALLERY_ITEM_SELECTED_CLASS);
        this.option("focusedElement", selectedItem);
        this._userInteraction = false;
    },

    _flipIndex: function(index) {
        var itemsCount = this._itemsCount();

        index = index % itemsCount;
        if(index > (itemsCount + 1) / 2) {
            index -= itemsCount;
        }
        if(index < -(itemsCount - 1) / 2) {
            index += itemsCount;
        }

        return index;
    },

    _fitIndex: function(index) {
        if(!this.option("loop")) {
            return index;
        }

        var itemsCount = this._itemsCount();

        if(index >= itemsCount || index < 0) {
            this._goToGhostItem = true;
        }

        if(index >= itemsCount) {
            index = itemsCount - index;
        }

        index = index % itemsCount;

        if(index < 0) {
            index += itemsCount;
        }

        return index;
    },

    _clean: function() {
        this.callBase();
        this._cleanIndicators();
        this._cleanNavButtons();
    },

    _dispose: function() {
        clearTimeout(this._slideshowTimer);
        this.callBase();
    },

    _updateSelection: function(addedSelection, removedSelection) {
        this._stopItemAnimations();
        this._renderNavButtonsVisibility();

        this._renderSelectedItem();

        this._relocateItems(addedSelection[0], removedSelection[0]);

        this._renderSelectedPageIndicator();
    },

    _relocateItems: function(newIndex, prevIndex, withoutAnimation) {
        if(prevIndex === undefined) {
            prevIndex = newIndex;
        }

        var indexOffset = this._calculateIndexOffset(newIndex, prevIndex);


        this._renderContainerPosition(indexOffset, this.option("animationEnabled") && !withoutAnimation).done(function() {
            this._setFocusOnSelect();
            this._userInteraction = false;
            this._setupSlideShow();
        });
    },

    _focusInHandler: function() {
        if(fx.isAnimating(this._$container) || this._userInteraction) {
            return;
        }

        this.callBase.apply(this, arguments);
    },

    _focusOutHandler: function() {
        if(fx.isAnimating(this._$container) || this._userInteraction) {
            return;
        }

        this.callBase.apply(this, arguments);
    },

    _selectFocusedItem: commonUtils.noop,

    _moveFocus: function() {
        this._stopItemAnimations();

        this.callBase.apply(this, arguments);

        var index = this.itemElements().index(this.option("focusedElement"));
        this.goToItem(index, this.option("animationEnabled"));
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._reviseDimensions();
        }
    },

    _calculateIndexOffset: function(newIndex, lastIndex) {
        if(lastIndex === undefined) {
            lastIndex = newIndex;
        }

        var indexOffset = lastIndex - newIndex;

        if(this.option("loop") && !this._needLongMove && this._goToGhostItem) {
            if(this._isItemOnFirstPage(newIndex) && this._isItemOnLastPage(lastIndex)) {
                indexOffset = -this._itemsPerPage();
            } else if(this._isItemOnLastPage(newIndex) && this._isItemOnFirstPage(lastIndex)) {
                indexOffset = this._itemsPerPage();
            }

            this._goToGhostItem = false;
        }

        this._needLongMove = false;
        indexOffset = indexOffset - lastIndex;

        return indexOffset;
    },

    _isItemOnLastPage: function(itemIndex) {
        return itemIndex >= this._itemsCount() - this._itemsPerPage();
    },

    _isItemOnFirstPage: function(itemIndex) {
        return itemIndex <= this._itemsPerPage();
    },

    _optionChanged: function(args) {
        var value = args.value;

        switch(args.name) {
            case "width":
            case "initialItemWidth":
                this.callBase.apply(this, arguments);
                this._dimensionChanged();
                break;
            case "animationDuration":
                this._renderNavButtonsVisibility();
                break;
            case "animationEnabled":
                break;
            case "loop":
                this.option("loopItemFocus", value);
                this.element().toggleClass(GALLERY_LOOP_CLASS, value);
                this._renderDuplicateItems();
                this._renderItemPositions();
                this._renderNavButtonsVisibility();
                return;
            case "showIndicator":
                this._renderIndicator();
                return;
            case "showNavButtons":
                this._renderNavButtons();
                return;
            case "slideshowDelay":
                this._setupSlideShow();
                return;
            case "wrapAround":
            case "stretchImages":
                this._renderItemSizes();
                this._renderItemPositions();
                break;
            case "swipeEnabled":
            case "indicatorEnabled":
                this._renderUserInteraction();
                return;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxgallerymethods_goToItem
    * @publicName goToItem(itemIndex, animation)
    * @param1 itemIndex:numeric
    * @param2 animation:boolean
    * @return Promise
    */
    goToItem: function(itemIndex, animation) {
        var selectedIndex = this.option("selectedIndex"),
            itemsCount = this._itemsCount();

        if(animation !== undefined) {
            this._animationOverride = animation;
        }

        itemIndex = this._fitIndex(itemIndex);

        this._deferredAnimate = $.Deferred();

        if(itemIndex > itemsCount - 1 || itemIndex < 0 || selectedIndex === itemIndex) {
            return this._deferredAnimate.resolveWith(this).promise();
        }

        this.option("selectedIndex", itemIndex);

        return this._deferredAnimate.promise();
    },

    /**
    * @name dxgallerymethods_prevItem
    * @publicName prevItem(animation)
    * @param1 animation:boolean
    * @return Promise
    */
    prevItem: function(animation) {
        return this.goToItem(this.option("selectedIndex") - 1, animation);
    },

    /**
    * @name dxgallerymethods_nextItem
    * @publicName nextItem(animation)
    * @param1 animation:boolean
    * @return Promise
    */
    nextItem: function(animation) {
        return this.goToItem(this.option("selectedIndex") + 1, animation);
    }
});

registerComponent("dxGallery", Gallery);

module.exports = Gallery;
