const $ = require('../core/renderer');
const eventsEngine = require('../events/core/events_engine');
const registerComponent = require('../core/component_registrator');
const commonUtils = require('../core/utils/common');
const typeUtils = require('../core/utils/type');
const windowUtils = require('../core/utils/window');
const extend = require('../core/utils/extend').extend;
const getPublicElement = require('../core/utils/dom').getPublicElement;
const fx = require('../animation/fx');
const clickEvent = require('../events/click');
const translator = require('../animation/translator');
const devices = require('../core/devices');
const Widget = require('./widget/ui.widget');
const eventUtils = require('../events/utils');
const CollectionWidget = require('./collection/ui.collection_widget.edit');
const Swipeable = require('../events/gesture/swipeable');
const BindableTemplate = require('../core/templates/bindable_template').BindableTemplate;
const Deferred = require('../core/utils/deferred').Deferred;

const GALLERY_CLASS = 'dx-gallery';
const GALLERY_WRAPPER_CLASS = GALLERY_CLASS + '-wrapper';
const GALLERY_LOOP_CLASS = 'dx-gallery-loop';
const GALLERY_ITEM_CONTAINER_CLASS = GALLERY_CLASS + '-container';
const GALLERY_ACTIVE_CLASS = GALLERY_CLASS + '-active';

const GALLERY_ITEM_CLASS = GALLERY_CLASS + '-item';
const GALLERY_INVISIBLE_ITEM_CLASS = GALLERY_CLASS + '-item-invisible';
const GALLERY_LOOP_ITEM_CLASS = GALLERY_ITEM_CLASS + '-loop';
const GALLERY_ITEM_SELECTOR = '.' + GALLERY_ITEM_CLASS;
const GALLERY_ITEM_SELECTED_CLASS = GALLERY_ITEM_CLASS + '-selected';

const GALLERY_INDICATOR_CLASS = GALLERY_CLASS + '-indicator';
const GALLERY_INDICATOR_ITEM_CLASS = GALLERY_INDICATOR_CLASS + '-item';
const GALLERY_INDICATOR_ITEM_SELECTOR = '.' + GALLERY_INDICATOR_ITEM_CLASS;
const GALLERY_INDICATOR_ITEM_SELECTED_CLASS = GALLERY_INDICATOR_ITEM_CLASS + '-selected';

const GALLERY_IMAGE_CLASS = 'dx-gallery-item-image';

const GALLERY_ITEM_DATA_KEY = 'dxGalleryItemData';

const MAX_CALC_ERROR = 1;

const GalleryNavButton = Widget.inherit({
    _supportedKeys: function() {
        return extend(this.callBase(), {
            pageUp: commonUtils.noop,
            pageDown: commonUtils.noop
        });
    },
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            direction: 'next',
            onClick: null,
            hoverStateEnabled: true,
            activeStateEnabled: true
        });
    },

    _render: function() {
        this.callBase();

        const that = this;
        const $element = this.$element();
        const eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);

        $element.addClass(GALLERY_CLASS + '-nav-button-' + this.option('direction'));

        eventsEngine.off($element, eventName);
        eventsEngine.on($element, eventName, function(e) {
            that._createActionByOption('onClick')({ event: e });
        });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onClick':
            case 'direction':
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }
});


/**
* @name dxGallery
* @inherits CollectionWidget
* @module ui/gallery
* @export default
*/
const Gallery = CollectionWidget.inherit({

    _activeStateUnit: GALLERY_ITEM_SELECTOR,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxGalleryOptions.activeStateEnabled
            * @type boolean
            * @default false
            */
            activeStateEnabled: false,

            /**
            * @name dxGalleryOptions.animationDuration
            * @type number
            * @default 400
            */
            animationDuration: 400,

            /**
            * @name dxGalleryOptions.animationEnabled
            * @type boolean
            * @default true
            */
            animationEnabled: true,

            /**
            * @name dxGalleryOptions.loop
            * @type boolean
            * @default false
            */
            loop: false,

            /**
            * @name dxGalleryOptions.swipeEnabled
            * @type boolean
            * @default true
            */
            swipeEnabled: true,

            /**
            * @name dxGalleryOptions.indicatorEnabled
            * @type boolean
            * @default true
            */
            indicatorEnabled: true,

            /**
            * @name dxGalleryOptions.showIndicator
            * @type boolean
            * @default true
            */
            showIndicator: true,

            /**
            * @name dxGalleryOptions.selectedIndex
            * @type number
            * @default 0
            */
            selectedIndex: 0,

            /**
            * @name dxGalleryOptions.slideshowDelay
            * @type number
            * @default 0
            */
            slideshowDelay: 0,

            /**
            * @name dxGalleryOptions.showNavButtons
            * @type boolean
            * @default false
            */
            showNavButtons: false,

            /**
            * @name dxGalleryOptions.wrapAround
            * @type boolean
            * @default false
            */
            wrapAround: false,

            /**
            * @name dxGalleryOptions.initialItemWidth
            * @type number
            * @default undefined
            */
            initialItemWidth: undefined,

            /**
            * @name dxGalleryOptions.stretchImages
            * @type boolean
            * @default false
            */
            stretchImages: false,

            /**
            * @name dxGalleryOptions.activeStateEnabled
            * @hidden
            */

            /**
            * @name dxGalleryOptions.noDataText
            */

            /**
            * @name dxGalleryOptions.selectedItems
            * @hidden
            */

            /**
            * @name dxGalleryOptions.selectedItemKeys
            * @hidden
            */

            /**
            * @name dxGalleryOptions.keyExpr
            * @hidden
            */

            /**
             * @name dxGalleryOptions.dataSource
             * @type string|Array<string,dxGalleryItem,object>|DataSource|DataSourceOptions
             * @default null
             */

            /**
             * @name dxGalleryOptions.items
             * @type Array<string, dxGalleryItem, object>
             * @fires dxGalleryOptions.onOptionChanged
             */

            _itemAttributes: { role: 'option' },
            loopItemFocus: false,
            selectOnFocus: true,
            selectionMode: 'single',
            selectionRequired: true,
            selectionByClick: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxGalleryOptions.focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    */
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this.option('loopItemFocus', this.option('loop'));
    },

    _initTemplates: function() {
        this.callBase();
        /**
        * @name dxGalleryItem
        * @inherits CollectionWidgetItem
        * @type object
        */
        /**
        * @name dxGalleryItem.imageSrc
        * @type String
        */
        /**
        * @name dxGalleryItem.imageAlt
        * @type String
        */
        /**
        * @name dxGalleryItem.visible
        * @hidden
        */

        this._templateManager.addDefaultTemplates({
            item: new BindableTemplate((function($container, data) {
                const $img = $('<img>').addClass(GALLERY_IMAGE_CLASS);

                if(typeUtils.isPlainObject(data)) {
                    this._prepareDefaultItemTemplate(data, $container);

                    $img.attr({
                        'src': data.imageSrc,
                        'alt': data.imageAlt
                    }).appendTo($container);
                } else {
                    $img.attr('src', String(data)).appendTo($container);
                }
            }).bind(this), ['imageSrc', 'imageAlt', 'text', 'html'], this.option('integrationOptions.watchMethod'))
        });
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
        const isWrapAround = this.option('wrapAround');

        if(this.option('stretchImages')) {
            const itemPerPage = isWrapAround ? this._itemsPerPage() + 1 : this._itemsPerPage();
            return 1 / itemPerPage;
        }

        if(isWrapAround) {
            return this._itemPercentWidth() * this._itemsPerPage() / (this._itemsPerPage() + 1);
        }

        return this._itemPercentWidth();
    },

    _itemPercentWidth: function() {
        let percentWidth;
        const elementWidth = this.$element().outerWidth();
        const initialItemWidth = this.option('initialItemWidth');

        if(initialItemWidth && initialItemWidth <= elementWidth) {
            percentWidth = initialItemWidth / elementWidth;
        } else {
            percentWidth = 1;
        }

        return percentWidth;
    },

    _itemsPerPage: function() {
        const itemsPerPage = windowUtils.hasWindow() ? Math.floor(1 / this._itemPercentWidth()) : 1;

        return Math.min(itemsPerPage, this._itemsCount());
    },

    _pagesCount: function() {
        return Math.ceil(this._itemsCount() / this._itemsPerPage());
    },

    _itemsCount: function() {
        return (this.option('items') || []).length;
    },

    _offsetDirection: function() {
        return this.option('rtlEnabled') ? -1 : 1;
    },

    _initMarkup: function() {
        this._renderWrapper();
        this._renderItemsContainer();

        this.$element().addClass(GALLERY_CLASS);
        this.$element().toggleClass(GALLERY_LOOP_CLASS, this.option('loop'));

        this.callBase();

        this.setAria({
            'role': 'listbox',
            'label': 'gallery'
        });
    },

    _render: function() {
        this._renderDragHandler();

        this._renderContainerPosition();
        this._renderItemSizes();
        this._renderItemPositions();

        this._renderNavButtons();
        this._renderIndicator();
        this._renderSelectedItem();
        this._renderItemVisibility();
        this._renderUserInteraction();

        this._setupSlideShow();

        this._reviseDimensions();

        this.callBase();
    },

    _dimensionChanged: function() {
        const selectedIndex = this.option('selectedIndex') || 0;

        this._stopItemAnimations();
        this._clearCacheWidth();

        this._cloneDuplicateItems();

        this._renderItemSizes();
        this._renderItemPositions();
        this._renderIndicator();
        this._renderContainerPosition(this._calculateIndexOffset(selectedIndex), true);
        this._renderItemVisibility();
    },

    _renderDragHandler: function() {
        const eventName = eventUtils.addNamespace('dragstart', this.NAME);

        eventsEngine.off(this.$element(), eventName);
        eventsEngine.on(this.$element(), eventName, 'img', function() { return false; });
    },

    _renderWrapper: function() {
        if(this._$wrapper) {
            return;
        }
        this._$wrapper = $('<div>')
            .addClass(GALLERY_WRAPPER_CLASS)
            .appendTo(this.$element());
    },

    _renderItems: function(items) {
        if(!windowUtils.hasWindow()) {
            const selectedIndex = this.option('selectedIndex');

            items = items.length > selectedIndex ? items.slice(selectedIndex, selectedIndex + 1) : items.slice(0, 1);
        }
        this.callBase(items);

        this._loadNextPageIfNeeded();
    },

    _renderItemsContainer: function() {
        if(this._$container) {
            return;
        }
        this._$container = $('<div>')
            .addClass(GALLERY_ITEM_CONTAINER_CLASS)
            .appendTo(this._$wrapper);
    },

    _cloneDuplicateItems: function() {
        if(!this.option('loop')) {
            return;
        }

        const items = this.option('items') || [];
        const itemsCount = items.length;
        const lastItemIndex = itemsCount - 1;
        let i;

        if(!itemsCount) return;

        this._getLoopedItems().remove();

        const duplicateCount = Math.min(this._itemsPerPage(), itemsCount);

        const $items = this._getRealItems();
        const $container = this._itemContainer();

        for(i = 0; i < duplicateCount; i++) {
            this._cloneItemForDuplicate($items[i], $container);
        }

        for(i = 0; i < duplicateCount; i++) {
            this._cloneItemForDuplicate($items[lastItemIndex - i], $container);
        }
    },

    _cloneItemForDuplicate: function(item, $container) {
        if(item) {
            $(item)
                .clone(true)
                .addClass(GALLERY_LOOP_ITEM_CLASS)
                .css('margin', 0)
                .appendTo($container);
        }
    },

    _getRealItems: function() {
        const selector = '.' + GALLERY_ITEM_CLASS + ':not(.' + GALLERY_LOOP_ITEM_CLASS + ')';
        return this.$element().find(selector);
    },

    _getLoopedItems: function() {
        return this.$element().find('.' + GALLERY_LOOP_ITEM_CLASS);
    },

    _emptyMessageContainer: function() {
        return this._$wrapper;
    },

    _renderItemSizes: function(startIndex) {
        let $items = this._itemElements();
        const itemWidth = this._actualItemWidth();

        if(startIndex !== undefined) {
            $items = $items.slice(startIndex);
        }

        $items.each(function(index) {
            $($items[index]).outerWidth(itemWidth * 100 + '%');
        });
    },

    _renderItemPositions: function() {
        const itemWidth = this._actualItemWidth();
        const itemsCount = this._itemsCount();
        const itemsPerPage = this._itemsPerPage();
        const loopItemsCount = this.$element().find('.' + GALLERY_LOOP_ITEM_CLASS).length;
        const lastItemDuplicateIndex = itemsCount + loopItemsCount - 1;
        const offsetRatio = this.option('wrapAround') ? 0.5 : 0;
        const freeSpace = this._itemFreeSpace();
        const isGapBetweenImages = !!freeSpace;
        const rtlEnabled = this.option('rtlEnabled');
        const selectedIndex = this.option('selectedIndex');
        const side = rtlEnabled ? 'Right' : 'Left';

        this._itemElements().each(function(index) {
            let realIndex = index;
            const isLoopItem = $(this).hasClass(GALLERY_LOOP_ITEM_CLASS);

            if(index > itemsCount + itemsPerPage - 1) {
                realIndex = lastItemDuplicateIndex - realIndex - itemsPerPage;
            }

            if(!isLoopItem && realIndex !== 0) {
                if(isGapBetweenImages) {
                    $(this).css('margin' + side, freeSpace * 100 + '%');
                }
                return;
            }

            const itemPosition = itemWidth * (realIndex + offsetRatio) + freeSpace * (realIndex + 1 - offsetRatio);
            const property = isLoopItem ? side.toLowerCase() : 'margin' + side;

            $(this).css(property, itemPosition * 100 + '%');
        });

        this._relocateItems(selectedIndex, selectedIndex, true);
    },

    _itemFreeSpace: function() {
        let itemsPerPage = this._itemsPerPage();

        if(this.option('wrapAround')) {
            itemsPerPage = itemsPerPage + 1;
        }

        return (1 - this._actualItemWidth() * itemsPerPage) / (itemsPerPage + 1);
    },

    _renderContainerPosition: function(offset, hideItems, animate) {
        this._releaseInvisibleItems();
        offset = offset || 0;

        const that = this;
        const itemWidth = this._actualItemWidth();
        const targetIndex = offset;
        const targetPosition = this._offsetDirection() * targetIndex * (itemWidth + this._itemFreeSpace());
        let positionReady;

        if(typeUtils.isDefined(this._animationOverride)) {
            animate = this._animationOverride;
            delete this._animationOverride;
        }

        if(animate) {
            that._startSwipe();
            positionReady = that._animate(targetPosition).done(that._endSwipe.bind(that));
        } else {
            translator.move(this._$container, { left: targetPosition * this._elementWidth(), top: 0 });
            positionReady = new Deferred().resolveWith(that);
        }

        positionReady.done(function() {
            this._deferredAnimate && that._deferredAnimate.resolveWith(that);
            hideItems && this._renderItemVisibility();
        });

        return positionReady.promise();
    },

    _startSwipe: function() {
        this.$element().addClass(GALLERY_ACTIVE_CLASS);
    },

    _endSwipe: function() {
        this.$element().removeClass(GALLERY_ACTIVE_CLASS);
    },

    _animate: function(targetPosition, extraConfig) {
        const that = this;
        const $container = this._$container;
        const animationComplete = new Deferred();

        fx.animate(this._$container, extend({
            type: 'slide',
            to: { left: targetPosition * this._elementWidth() },
            duration: that.option('animationDuration'),
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
        const expectedPosition = this._$container.position().left * this._offsetDirection();
        const actualPosition = -this._maxItemWidth() * this._elementWidth() * this._itemsCount();

        return expectedPosition <= actualPosition + MAX_CALC_ERROR;
    },

    _needMoveContainerBack: function() {
        const expectedPosition = this._$container.position().left * this._offsetDirection();
        const actualPosition = this._actualItemWidth() * this._elementWidth();

        return expectedPosition >= actualPosition - MAX_CALC_ERROR;
    },

    _maxContainerOffset: function() {
        return -this._maxItemWidth() * (this._itemsCount() - this._itemsPerPage()) * this._offsetDirection();
    },

    _maxItemWidth: function() {
        return this._actualItemWidth() + this._itemFreeSpace();
    },

    _reviseDimensions: function() {
        const that = this;
        const $firstItem = that._itemElements().first().find('.dx-item-content');

        if(!$firstItem || $firstItem.is(':hidden')) {
            return;
        }

        if(!that.option('height')) {
            that.option('height', $firstItem.outerHeight());
        }
        if(!that.option('width')) {
            that.option('width', $firstItem.outerWidth());
        }

        this._dimensionChanged();
    },

    _renderIndicator: function() {
        this._cleanIndicators();

        if(!this.option('showIndicator')) {
            return;
        }

        const indicator = this._$indicator = $('<div>')
            .addClass(GALLERY_INDICATOR_CLASS)
            .appendTo(this._$wrapper);

        for(let i = 0; i < this._pagesCount(); i++) {
            $('<div>').addClass(GALLERY_INDICATOR_ITEM_CLASS).appendTo(indicator);
        }

        this._renderSelectedPageIndicator();
    },

    _cleanIndicators: function() {
        if(this._$indicator) {
            this._$indicator.remove();
        }
    },

    _renderSelectedItem: function() {
        const selectedIndex = this.option('selectedIndex');

        this._itemElements()
            .removeClass(GALLERY_ITEM_SELECTED_CLASS)
            .eq(selectedIndex)
            .addClass(GALLERY_ITEM_SELECTED_CLASS);
    },

    _renderItemVisibility: function() {
        if(this.option('initialItemWidth') || this.option('wrapAround')) {
            this._releaseInvisibleItems();
            return;
        }

        this._itemElements().each((function(index, item) {
            if(this.option('selectedIndex') === index) {
                $(item).removeClass(GALLERY_INVISIBLE_ITEM_CLASS);
            } else {
                $(item).addClass(GALLERY_INVISIBLE_ITEM_CLASS);
            }
        }).bind(this));

        this._getLoopedItems()
            .addClass(GALLERY_INVISIBLE_ITEM_CLASS);
    },

    _releaseInvisibleItems: function() {
        this._itemElements()
            .removeClass(GALLERY_INVISIBLE_ITEM_CLASS);

        this._getLoopedItems()
            .removeClass(GALLERY_INVISIBLE_ITEM_CLASS);
    },

    _renderSelectedPageIndicator: function() {
        if(!this._$indicator) {
            return;
        }

        const itemIndex = this.option('selectedIndex');
        const lastIndex = this._pagesCount() - 1;
        let pageIndex = Math.ceil(itemIndex / this._itemsPerPage());

        pageIndex = Math.min(lastIndex, pageIndex);

        this._$indicator
            .find(GALLERY_INDICATOR_ITEM_SELECTOR)
            .removeClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS)
            .eq(pageIndex)
            .addClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS);
    },

    _renderUserInteraction: function() {
        const rootElement = this.$element();
        const swipeEnabled = this.option('swipeEnabled') && this._itemsCount() > 1;

        this._createComponent(rootElement, Swipeable, {
            disabled: this.option('disabled') || !swipeEnabled,
            onStart: this._swipeStartHandler.bind(this),
            onUpdated: this._swipeUpdateHandler.bind(this),
            onEnd: this._swipeEndHandler.bind(this),
            itemSizeFunc: this._elementWidth.bind(this)
        });

        const indicatorSelectAction = this._createAction(this._indicatorSelectHandler);

        eventsEngine.off(rootElement, eventUtils.addNamespace(clickEvent.name, this.NAME), GALLERY_INDICATOR_ITEM_SELECTOR);
        eventsEngine.on(rootElement, eventUtils.addNamespace(clickEvent.name, this.NAME), GALLERY_INDICATOR_ITEM_SELECTOR, function(e) {
            indicatorSelectAction({ event: e });
        });
    },

    _indicatorSelectHandler: function(args) {
        const e = args.event;
        const instance = args.component;

        if(!instance.option('indicatorEnabled')) {
            return;
        }

        const indicatorIndex = $(e.target).index();
        const itemIndex = instance._fitPaginatedIndex(indicatorIndex * instance._itemsPerPage());

        instance._needLongMove = true;

        instance.option('selectedIndex', itemIndex);
        instance._loadNextPageIfNeeded(itemIndex);
    },

    _renderNavButtons: function() {
        const that = this;

        if(!that.option('showNavButtons')) {
            that._cleanNavButtons();
            return;
        }

        that._prevNavButton = $('<div>').appendTo(this._$wrapper);
        that._createComponent(that._prevNavButton, GalleryNavButton, {
            direction: 'prev',
            onClick: function() {
                that._prevPage();
            }
        });

        that._nextNavButton = $('<div>').appendTo(this._$wrapper);
        that._createComponent(that._nextNavButton, GalleryNavButton, {
            direction: 'next',
            onClick: function() {
                that._nextPage();
            }
        });

        this._renderNavButtonsVisibility();
    },

    _prevPage: function() {
        const visiblePageSize = this._itemsPerPage();
        const newSelectedIndex = this.option('selectedIndex') - visiblePageSize;

        if(newSelectedIndex === -visiblePageSize && visiblePageSize === this._itemsCount()) {
            return this._relocateItems(newSelectedIndex, 0);
        } else {
            return this.goToItem(this._fitPaginatedIndex(newSelectedIndex));
        }
    },

    _nextPage: function() {
        const visiblePageSize = this._itemsPerPage();
        const newSelectedIndex = this.option('selectedIndex') + visiblePageSize;

        if(newSelectedIndex === visiblePageSize && visiblePageSize === this._itemsCount()) {
            return this._relocateItems(newSelectedIndex, 0);
        } else {
            return this.goToItem(this._fitPaginatedIndex(newSelectedIndex)).done(this._loadNextPageIfNeeded);
        }
    },

    _loadNextPageIfNeeded: function(selectedIndex) {
        selectedIndex = selectedIndex === undefined ? this.option('selectedIndex') : selectedIndex;
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
        const visiblePageSize = this._itemsPerPage();

        return selectedIndex + 2 * visiblePageSize > this.option('items').length;
    },

    _allowDynamicItemsAppend: function() {
        return true;
    },

    _fitPaginatedIndex: function(itemIndex) {
        const itemsPerPage = this._itemsPerPage();

        const restItemsCount = itemIndex < 0 ? itemsPerPage + itemIndex : this._itemsCount() - itemIndex;

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
        if(!this.option('showNavButtons') || !this._prevNavButton || !this._nextNavButton) {
            return;
        }

        const selectedIndex = this.option('selectedIndex');
        const loop = this.option('loop');
        const itemsCount = this._itemsCount();

        this._prevNavButton.show();
        this._nextNavButton.show();

        if(itemsCount === 0) {
            this._prevNavButton.hide();
            this._nextNavButton.hide();
        }

        if(loop) {
            return;
        }

        let nextHidden = selectedIndex === itemsCount - this._itemsPerPage();
        const prevHidden = itemsCount < 2 || selectedIndex === 0;

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
        const that = this;
        const slideshowDelay = that.option('slideshowDelay');

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
            this._cacheElementWidth = this.$element().width();
        }

        return this._cacheElementWidth;
    },

    _clearCacheWidth: function() {
        delete this._cacheElementWidth;
    },

    _swipeStartHandler: function(e) {
        this._releaseInvisibleItems();

        this._clearCacheWidth();
        this._elementWidth();

        const itemsCount = this._itemsCount();

        if(!itemsCount) {
            e.event.cancel = true;
            return;
        }

        this._stopItemAnimations();
        this._startSwipe();
        this._userInteraction = true;
        if(!this.option('loop')) {
            const selectedIndex = this.option('selectedIndex');
            const startOffset = itemsCount - selectedIndex - this._itemsPerPage();
            const endOffset = selectedIndex;
            const rtlEnabled = this.option('rtlEnabled');

            e.event.maxLeftOffset = rtlEnabled ? endOffset : startOffset;
            e.event.maxRightOffset = rtlEnabled ? startOffset : endOffset;
        }
    },

    _stopItemAnimations: function() {
        fx.stop(this._$container, true);
    },

    _swipeUpdateHandler: function(e) {
        const wrapAroundRatio = this.option('wrapAround') ? 1 : 0;

        const offset = this._offsetDirection() * e.event.offset * (this._itemsPerPage() + wrapAroundRatio) - this.option('selectedIndex');

        if(offset < 0) {
            this._loadNextPageIfNeeded(Math.ceil(Math.abs(offset)));
        }

        this._renderContainerPosition(offset);
    },

    _swipeEndHandler: function(e) {
        const targetOffset = e.event.targetOffset * this._offsetDirection() * this._itemsPerPage();
        const selectedIndex = this.option('selectedIndex');
        const newIndex = this._fitIndex(selectedIndex - targetOffset);
        const paginatedIndex = this._fitPaginatedIndex(newIndex);

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

        this.option('selectedIndex', paginatedIndex);
    },

    _setFocusOnSelect: function() {
        this._userInteraction = true;

        const selectedItem = this.itemElements().filter('.' + GALLERY_ITEM_SELECTED_CLASS);
        this.option('focusedElement', getPublicElement(selectedItem));
        this._userInteraction = false;
    },

    _flipIndex: function(index) {
        const itemsCount = this._itemsCount();

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
        if(!this.option('loop')) {
            return index;
        }

        const itemsCount = this._itemsCount();

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

        const indexOffset = this._calculateIndexOffset(newIndex, prevIndex);


        this._renderContainerPosition(indexOffset, true, this.option('animationEnabled') && !withoutAnimation).done(function() {
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

        const index = this.itemElements().index($(this.option('focusedElement')));
        this.goToItem(index, this.option('animationEnabled'));
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

        let indexOffset = lastIndex - newIndex;

        if(this.option('loop') && !this._needLongMove && this._goToGhostItem) {
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
        switch(args.name) {
            case 'width':
            case 'initialItemWidth':
                this.callBase.apply(this, arguments);
                this._dimensionChanged();
                break;
            case 'animationDuration':
                this._renderNavButtonsVisibility();
                break;
            case 'animationEnabled':
                break;
            case 'loop':
                this.$element().toggleClass(GALLERY_LOOP_CLASS, args.value);
                this.option('loopItemFocus', args.value);

                if(windowUtils.hasWindow()) {
                    this._cloneDuplicateItems();
                    this._renderItemPositions();
                    this._renderNavButtonsVisibility();
                }
                break;
            case 'showIndicator':
                this._renderIndicator();
                break;
            case 'showNavButtons':
                this._renderNavButtons();
                break;
            case 'slideshowDelay':
                this._setupSlideShow();
                break;
            case 'wrapAround':
            case 'stretchImages':
                if(windowUtils.hasWindow()) {
                    this._renderItemSizes();
                    this._renderItemPositions();
                    this._renderItemVisibility();
                }
                break;
            case 'swipeEnabled':
            case 'indicatorEnabled':
                this._renderUserInteraction();
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxGalleryMethods.goToItem
    * @publicName goToItem(itemIndex, animation)
    * @param1 itemIndex:numeric
    * @param2 animation:boolean
    * @return Promise<void>
    */
    goToItem: function(itemIndex, animation) {
        const selectedIndex = this.option('selectedIndex');
        const itemsCount = this._itemsCount();

        if(animation !== undefined) {
            this._animationOverride = animation;
        }

        itemIndex = this._fitIndex(itemIndex);

        this._deferredAnimate = new Deferred();

        if(itemIndex > itemsCount - 1 || itemIndex < 0 || selectedIndex === itemIndex) {
            return this._deferredAnimate.resolveWith(this).promise();
        }

        this.option('selectedIndex', itemIndex);
        return this._deferredAnimate.promise();
    },

    /**
    * @name dxGalleryMethods.prevItem
    * @publicName prevItem(animation)
    * @param1 animation:boolean
    * @return Promise<void>
    */
    prevItem: function(animation) {
        return this.goToItem(this.option('selectedIndex') - 1, animation);
    },

    /**
    * @name dxGalleryMethods.nextItem
    * @publicName nextItem(animation)
    * @param1 animation:boolean
    * @return Promise<void>
    */
    nextItem: function(animation) {
        return this.goToItem(this.option('selectedIndex') + 1, animation);
    }
});

registerComponent('dxGallery', Gallery);

module.exports = Gallery;
