"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fx = _interopRequireDefault(require("../../animation/fx"));
var _translator = require("../../animation/translator");
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../core/devices"));
var _element = require("../../core/element");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _bindable_template = require("../../core/templates/bindable_template");
var _common = require("../../core/utils/common");
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _size = require("../../core/utils/size");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _click = require("../../events/click");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _swipeable = _interopRequireDefault(require("../../events/gesture/swipeable"));
var _index = require("../../events/utils/index");
var _visibility_change = require("../../events/visibility_change");
var _message = _interopRequireDefault(require("../../localization/message"));
var _uiCollection_widget = _interopRequireDefault(require("../../ui/collection/ui.collection_widget.edit"));
var _ui = _interopRequireDefault(require("../../ui/widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const GALLERY_CLASS = 'dx-gallery';
const GALLERY_INDICATOR_VISIBLE_CLASS = 'dx-gallery-indicator-visible';
const GALLERY_WRAPPER_CLASS = `${GALLERY_CLASS}-wrapper`;
const GALLERY_LOOP_CLASS = 'dx-gallery-loop';
const GALLERY_ITEM_CONTAINER_CLASS = `${GALLERY_CLASS}-container`;
const GALLERY_ACTIVE_CLASS = `${GALLERY_CLASS}-active`;
const GALLERY_ITEM_CLASS = `${GALLERY_CLASS}-item`;
const GALLERY_INVISIBLE_ITEM_CLASS = `${GALLERY_CLASS}-item-invisible`;
const GALLERY_LOOP_ITEM_CLASS = `${GALLERY_ITEM_CLASS}-loop`;
const GALLERY_ITEM_SELECTOR = `.${GALLERY_ITEM_CLASS}`;
const GALLERY_ITEM_SELECTED_CLASS = `${GALLERY_ITEM_CLASS}-selected`;
const GALLERY_INDICATOR_CLASS = `${GALLERY_CLASS}-indicator`;
const GALLERY_INDICATOR_ITEM_CLASS = `${GALLERY_INDICATOR_CLASS}-item`;
const GALLERY_INDICATOR_ITEM_SELECTOR = `.${GALLERY_INDICATOR_ITEM_CLASS}`;
const GALLERY_INDICATOR_ITEM_SELECTED_CLASS = `${GALLERY_INDICATOR_ITEM_CLASS}-selected`;
const ITEM_CONTENT_SELECTOR = '.dx-item-content';
const GALLERY_IMAGE_CLASS = 'dx-gallery-item-image';
const GALLERY_ITEM_DATA_KEY = 'dxGalleryItemData';
const MAX_CALC_ERROR = 1;
// @ts-expect-error
const GalleryNavButton = _ui.default.inherit({
  _supportedKeys() {
    return (0, _extend.extend)(this.callBase(), {
      pageUp: _common.noop,
      pageDown: _common.noop
    });
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      direction: 'next',
      onClick: null,
      hoverStateEnabled: true,
      activeStateEnabled: true
    });
  },
  _render() {
    this.callBase();
    const that = this;
    const $element = this.$element();
    const eventName = (0, _index.addNamespace)(_click.name, this.NAME);
    $element.addClass(`${GALLERY_CLASS}-nav-button-${this.option('direction')}`);
    _events_engine.default.off($element, eventName);
    _events_engine.default.on($element, eventName, e => {
      that._createActionByOption('onClick')({
        event: e
      });
    });
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'onClick':
      case 'direction':
        this._invalidate();
        break;
      default:
        this.callBase(args);
    }
  }
});
const Gallery = _uiCollection_widget.default.inherit({
  _activeStateUnit: GALLERY_ITEM_SELECTOR,
  _wasAnyItemTemplateRendered: false,
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      activeStateEnabled: false,
      animationDuration: 400,
      animationEnabled: true,
      loop: false,
      swipeEnabled: true,
      indicatorEnabled: true,
      showIndicator: true,
      selectedIndex: 0,
      slideshowDelay: 0,
      showNavButtons: false,
      wrapAround: false,
      initialItemWidth: undefined,
      stretchImages: false,
      _itemAttributes: {
        role: 'option',
        'aria-label': _message.default.format('dxGallery-itemName')
      },
      loopItemFocus: false,
      selectOnFocus: true,
      selectionMode: 'single',
      selectionRequired: true,
      selectByClick: false
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _init() {
    this.callBase();
    this.option('loopItemFocus', this.option('loop'));
  },
  _initTemplates() {
    this.callBase();
    this._templateManager.addDefaultTemplates({
      item: new _bindable_template.BindableTemplate(($container, data) => {
        const $img = (0, _renderer.default)('<img>').addClass(GALLERY_IMAGE_CLASS);
        if ((0, _type.isPlainObject)(data)) {
          this._prepareDefaultItemTemplate(data, $container);
          // @ts-expect-error
          $img.attr({
            src: data.imageSrc,
            alt: data.imageAlt
          }).appendTo($container);
        } else {
          $img.attr('src', String(data)).appendTo($container);
        }
      }, ['imageSrc', 'imageAlt', 'text', 'html'], this.option('integrationOptions.watchMethod'))
    });
  },
  _dataSourceOptions() {
    return {
      paginate: false
    };
  },
  _itemContainer() {
    return this._$container;
  },
  _itemClass() {
    return GALLERY_ITEM_CLASS;
  },
  _itemDataKey() {
    return GALLERY_ITEM_DATA_KEY;
  },
  _actualItemWidth() {
    const isWrapAround = this.option('wrapAround');
    if (this.option('stretchImages')) {
      const itemPerPage = isWrapAround ? this._itemsPerPage() + 1 : this._itemsPerPage();
      return 1 / itemPerPage;
    }
    if (isWrapAround) {
      return this._itemPercentWidth() * this._itemsPerPage() / (this._itemsPerPage() + 1);
    }
    return this._itemPercentWidth();
  },
  _itemPercentWidth() {
    let percentWidth;
    const elementWidth = (0, _size.getOuterWidth)(this.$element());
    const initialItemWidth = this.option('initialItemWidth');
    if (initialItemWidth && initialItemWidth <= elementWidth) {
      percentWidth = initialItemWidth / elementWidth;
    } else {
      percentWidth = 1;
    }
    return percentWidth;
  },
  _itemsPerPage() {
    const itemsPerPage = (0, _window.hasWindow)() ? Math.floor(1 / this._itemPercentWidth()) : 1;
    return Math.min(itemsPerPage, this._itemsCount());
  },
  _pagesCount() {
    return Math.ceil(this._itemsCount() / this._itemsPerPage());
  },
  _itemsCount() {
    return (this.option('items') || []).length;
  },
  _offsetDirection() {
    return this.option('rtlEnabled') ? -1 : 1;
  },
  _initMarkup() {
    this._renderWrapper();
    this._renderItemsContainer();
    this.$element().addClass(GALLERY_CLASS);
    this.$element().toggleClass(GALLERY_LOOP_CLASS, this.option('loop'));
    this.callBase();
    const useListBoxRole = this._itemsCount() > 0;
    const ariaAttrs = {
      role: useListBoxRole ? 'listbox' : undefined,
      label: 'gallery'
    };
    this.setAria(ariaAttrs);
  },
  _render() {
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
  _dimensionChanged() {
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
  _renderDragHandler() {
    const eventName = (0, _index.addNamespace)('dragstart', this.NAME);
    _events_engine.default.off(this.$element(), eventName);
    _events_engine.default.on(this.$element(), eventName, 'img', () => false);
  },
  _renderWrapper() {
    if (this._$wrapper) {
      return;
    }
    this._$wrapper = (0, _renderer.default)('<div>').addClass(GALLERY_WRAPPER_CLASS).appendTo(this.$element());
  },
  _renderItems(items) {
    if (!(0, _window.hasWindow)()) {
      const selectedIndex = this.option('selectedIndex');
      items = items.length > selectedIndex ? items.slice(selectedIndex, selectedIndex + 1) : items.slice(0, 1);
    }
    this.callBase(items);
    this._loadNextPageIfNeeded();
  },
  _onItemTemplateRendered() {
    return () => {
      if (!this._wasAnyItemTemplateRendered) {
        this._wasAnyItemTemplateRendered = true;
        (0, _visibility_change.triggerResizeEvent)(this.$element()); // NOTE: T1132935
      }
    };
  },
  _renderItemsContainer() {
    if (this._$container) {
      return;
    }
    this._$container = (0, _renderer.default)('<div>').addClass(GALLERY_ITEM_CONTAINER_CLASS).appendTo(this._$wrapper);
  },
  _cloneDuplicateItems() {
    if (!this.option('loop')) {
      return;
    }
    const items = this.option('items') || [];
    const itemsCount = items.length;
    const lastItemIndex = itemsCount - 1;
    let i;
    if (!itemsCount) return;
    this._getLoopedItems().remove();
    const duplicateCount = Math.min(this._itemsPerPage(), itemsCount);
    const $items = this._getRealItems();
    const $container = this._itemContainer();
    for (i = 0; i < duplicateCount; i++) {
      this._cloneItemForDuplicate($items[i], $container);
    }
    for (i = 0; i < duplicateCount; i++) {
      this._cloneItemForDuplicate($items[lastItemIndex - i], $container);
    }
  },
  _cloneItemForDuplicate(item, $container) {
    if (item) {
      const $clonedItem = (0, _renderer.default)(item)
      // @ts-expect-error
      .clone(false).addClass(GALLERY_LOOP_ITEM_CLASS).removeAttr('id').css('margin', 0).appendTo($container);
      this.setAria({
        hidden: true
      }, $clonedItem);
    }
  },
  _getRealItems() {
    const selector = `.${GALLERY_ITEM_CLASS}:not(.${GALLERY_LOOP_ITEM_CLASS})`;
    return this.$element().find(selector);
  },
  _getLoopedItems() {
    return this.$element().find(`.${GALLERY_LOOP_ITEM_CLASS}`);
  },
  _emptyMessageContainer() {
    return this._$wrapper;
  },
  _renderItemSizes(startIndex) {
    let $items = this._itemElements();
    const itemWidth = this._actualItemWidth();
    if (startIndex !== undefined) {
      $items = $items.slice(startIndex);
    }
    $items.each(index => {
      (0, _size.setOuterWidth)((0, _renderer.default)($items[index]), `${itemWidth * 100}%`);
    });
  },
  _renderItemPositions() {
    const itemWidth = this._actualItemWidth();
    const itemsCount = this._itemsCount();
    const itemsPerPage = this._itemsPerPage();
    const loopItemsCount = this.$element().find(`.${GALLERY_LOOP_ITEM_CLASS}`).length;
    const lastItemDuplicateIndex = itemsCount + loopItemsCount - 1;
    const offsetRatio = this.option('wrapAround') ? 0.5 : 0;
    const freeSpace = this._itemFreeSpace();
    const isGapBetweenImages = !!freeSpace;
    const rtlEnabled = this.option('rtlEnabled');
    const selectedIndex = this.option('selectedIndex');
    const side = rtlEnabled ? 'Right' : 'Left';
    this._itemElements().each(function (index) {
      let realIndex = index;
      const isLoopItem = (0, _renderer.default)(this).hasClass(GALLERY_LOOP_ITEM_CLASS);
      if (index > itemsCount + itemsPerPage - 1) {
        realIndex = lastItemDuplicateIndex - realIndex - itemsPerPage;
      }
      if (!isLoopItem && realIndex !== 0) {
        if (isGapBetweenImages) {
          (0, _renderer.default)(this).css(`margin${side}`, `${freeSpace * 100}%`);
        }
        return;
      }
      const itemPosition = itemWidth * (realIndex + offsetRatio) + freeSpace * (realIndex + 1 - offsetRatio);
      const property = isLoopItem ? side.toLowerCase() : `margin${side}`;
      (0, _renderer.default)(this).css(property, `${itemPosition * 100}%`);
    });
    this._relocateItems(selectedIndex, selectedIndex, true);
  },
  _itemFreeSpace() {
    let itemsPerPage = this._itemsPerPage();
    if (this.option('wrapAround')) {
      itemsPerPage += 1;
    }
    return (1 - this._actualItemWidth() * itemsPerPage) / (itemsPerPage + 1);
  },
  _renderContainerPosition(offset, hideItems, animate) {
    this._releaseInvisibleItems();
    offset = offset || 0;
    const that = this;
    const itemWidth = this._actualItemWidth();
    const targetIndex = offset;
    const targetPosition = this._offsetDirection() * targetIndex * (itemWidth + this._itemFreeSpace());
    let positionReady;
    if ((0, _type.isDefined)(this._animationOverride)) {
      animate = this._animationOverride;
      delete this._animationOverride;
    }
    if (animate) {
      that._startSwipe();
      positionReady = that._animate(targetPosition).done(that._endSwipe.bind(that));
    } else {
      (0, _translator.move)(this._$container, {
        left: targetPosition * this._elementWidth(),
        top: 0
      });
      positionReady = (0, _deferred.Deferred)().resolveWith(that);
    }
    positionReady.done(function () {
      this._deferredAnimate && that._deferredAnimate.resolveWith(that);
      hideItems && this._renderItemVisibility();
    });
    return positionReady.promise();
  },
  _startSwipe() {
    this.$element().addClass(GALLERY_ACTIVE_CLASS);
  },
  _endSwipe() {
    this.$element().removeClass(GALLERY_ACTIVE_CLASS);
  },
  _animate(targetPosition, extraConfig) {
    const that = this;
    const $container = this._$container;
    const animationComplete = (0, _deferred.Deferred)();
    _fx.default.animate(this._$container, (0, _extend.extend)({
      type: 'slide',
      to: {
        left: targetPosition * this._elementWidth()
      },
      duration: that.option('animationDuration'),
      complete() {
        if (that._needMoveContainerForward()) {
          (0, _translator.move)($container, {
            left: 0,
            top: 0
          });
        }
        if (that._needMoveContainerBack()) {
          (0, _translator.move)($container, {
            left: that._maxContainerOffset() * that._elementWidth(),
            top: 0
          });
        }
        animationComplete.resolveWith(that);
      }
    }, extraConfig || {}));
    return animationComplete;
  },
  _needMoveContainerForward() {
    const expectedPosition = this._$container.position().left * this._offsetDirection();
    const actualPosition = -this._maxItemWidth() * this._elementWidth() * this._itemsCount();
    return expectedPosition <= actualPosition + MAX_CALC_ERROR;
  },
  _needMoveContainerBack() {
    const expectedPosition = this._$container.position().left * this._offsetDirection();
    const actualPosition = this._actualItemWidth() * this._elementWidth();
    return expectedPosition >= actualPosition - MAX_CALC_ERROR;
  },
  _maxContainerOffset() {
    return -this._maxItemWidth() * (this._itemsCount() - this._itemsPerPage()) * this._offsetDirection();
  },
  _maxItemWidth() {
    return this._actualItemWidth() + this._itemFreeSpace();
  },
  _reviseDimensions() {
    const that = this;
    const $firstItem = that._itemElements().first().find(ITEM_CONTENT_SELECTOR);
    if (!$firstItem || $firstItem.is(':hidden')) {
      return;
    }
    if (!that.option('height')) {
      that.option('height', (0, _size.getOuterHeight)($firstItem));
    }
    if (!that.option('width')) {
      that.option('width', (0, _size.getOuterWidth)($firstItem));
    }
    this._dimensionChanged();
  },
  _renderIndicator() {
    const {
      showIndicator
    } = this.option();
    this._cleanIndicators();
    this.$element().toggleClass(GALLERY_INDICATOR_VISIBLE_CLASS, showIndicator);
    if (!showIndicator) {
      return;
    }
    const indicator = this._$indicator = (0, _renderer.default)('<div>').addClass(GALLERY_INDICATOR_CLASS).appendTo(this._$wrapper);
    const isIndicatorEnabled = this.option('indicatorEnabled');
    for (let i = 0; i < this._pagesCount(); i++) {
      const $indicatorItem = (0, _renderer.default)('<div>').addClass(GALLERY_INDICATOR_ITEM_CLASS).appendTo(indicator);
      if (isIndicatorEnabled) {
        this._attachIndicatorClickHandler($indicatorItem, i);
      }
    }
    this._renderSelectedPageIndicator();
  },
  _attachIndicatorClickHandler($element, index) {
    _events_engine.default.on($element, (0, _index.addNamespace)(_click.name, this.NAME), event => {
      this._indicatorSelectHandler(event, index);
    });
  },
  _detachIndicatorClickHandler($element) {
    _events_engine.default.off($element, (0, _index.addNamespace)(_click.name, this.NAME));
  },
  _toggleIndicatorInteraction(clickEnabled) {
    var _this$_$indicator;
    const $indicatorItems = ((_this$_$indicator = this._$indicator) === null || _this$_$indicator === void 0 ? void 0 : _this$_$indicator.find(GALLERY_INDICATOR_ITEM_SELECTOR)) || [];
    if ($indicatorItems.length) {
      $indicatorItems.each((index, element) => {
        clickEnabled ? this._attachIndicatorClickHandler((0, _renderer.default)(element), index) : this._detachIndicatorClickHandler((0, _renderer.default)(element));
      });
    }
  },
  _cleanIndicators() {
    if (this._$indicator) {
      this._$indicator.remove();
    }
  },
  _renderSelectedItem() {
    const selectedIndex = this.option('selectedIndex');
    this._itemElements().removeClass(GALLERY_ITEM_SELECTED_CLASS).eq(selectedIndex).addClass(GALLERY_ITEM_SELECTED_CLASS);
  },
  _renderItemVisibility() {
    if (this.option('initialItemWidth') || this.option('wrapAround')) {
      this._releaseInvisibleItems();
      return;
    }
    const selectedIndex = this.option('selectedIndex');
    this._itemElements().each((index, item) => {
      if (selectedIndex !== index) {
        (0, _renderer.default)(item).find(ITEM_CONTENT_SELECTOR).addClass(GALLERY_INVISIBLE_ITEM_CLASS);
      }
    });
  },
  _releaseInvisibleItems() {
    this._itemElements().find(ITEM_CONTENT_SELECTOR).removeClass(GALLERY_INVISIBLE_ITEM_CLASS);
  },
  _renderSelectedPageIndicator() {
    if (!this._$indicator) {
      return;
    }
    const itemIndex = this.option('selectedIndex');
    const lastIndex = this._pagesCount() - 1;
    let pageIndex = Math.ceil(itemIndex / this._itemsPerPage());
    pageIndex = Math.min(lastIndex, pageIndex);
    this._$indicator.find(GALLERY_INDICATOR_ITEM_SELECTOR).removeClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS).eq(pageIndex).addClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS);
  },
  _renderUserInteraction() {
    const rootElement = this.$element();
    const swipeEnabled = this.option('swipeEnabled') && this._itemsCount() > 1;
    this._createComponent(rootElement, _swipeable.default, {
      disabled: this.option('disabled') || !swipeEnabled,
      onStart: this._swipeStartHandler.bind(this),
      onUpdated: this._swipeUpdateHandler.bind(this),
      onEnd: this._swipeEndHandler.bind(this),
      itemSizeFunc: this._elementWidth.bind(this)
    });
  },
  _indicatorSelectHandler(e, indicatorIndex) {
    if (!this.option('indicatorEnabled')) {
      return;
    }
    const itemIndex = this._fitPaginatedIndex(indicatorIndex * this._itemsPerPage());
    this._needLongMove = true;
    this.option('selectedIndex', itemIndex);
    this._loadNextPageIfNeeded(itemIndex);
  },
  _renderNavButtons() {
    const that = this;
    if (!that.option('showNavButtons')) {
      that._cleanNavButtons();
      return;
    }
    that._prevNavButton = (0, _renderer.default)('<div>').appendTo(this._$wrapper);
    that._createComponent(that._prevNavButton, GalleryNavButton, {
      direction: 'prev',
      onClick() {
        that._prevPage();
      }
    });
    that._nextNavButton = (0, _renderer.default)('<div>').appendTo(this._$wrapper);
    that._createComponent(that._nextNavButton, GalleryNavButton, {
      direction: 'next',
      onClick() {
        that._nextPage();
      }
    });
    this._renderNavButtonsVisibility();
  },
  _prevPage() {
    const visiblePageSize = this._itemsPerPage();
    const newSelectedIndex = this.option('selectedIndex') - visiblePageSize;
    if (newSelectedIndex === -visiblePageSize && visiblePageSize === this._itemsCount()) {
      return this._relocateItems(newSelectedIndex, 0);
    }
    return this.goToItem(this._fitPaginatedIndex(newSelectedIndex));
  },
  _nextPage() {
    const visiblePageSize = this._itemsPerPage();
    const newSelectedIndex = this.option('selectedIndex') + visiblePageSize;
    if (newSelectedIndex === visiblePageSize && visiblePageSize === this._itemsCount()) {
      return this._relocateItems(newSelectedIndex, 0);
    }
    return this.goToItem(this._fitPaginatedIndex(newSelectedIndex)).done(this._loadNextPageIfNeeded);
  },
  _loadNextPageIfNeeded(selectedIndex) {
    selectedIndex = selectedIndex === undefined ? this.option('selectedIndex') : selectedIndex;
    if (this._dataSource && this._dataSource.paginate() && this._shouldLoadNextPage(selectedIndex) && !this._isDataSourceLoading() && !this._isLastPage()) {
      this._loadNextPage().done(() => {
        this._renderIndicator();
        this._cloneDuplicateItems();
        this._renderItemPositions();
        this._renderNavButtonsVisibility();
        this._renderItemSizes(selectedIndex);
      });
    }
  },
  _shouldLoadNextPage(selectedIndex) {
    const visiblePageSize = this._itemsPerPage();
    return selectedIndex + 2 * visiblePageSize > this.option('items').length;
  },
  _allowDynamicItemsAppend() {
    return true;
  },
  _fitPaginatedIndex(itemIndex) {
    const itemsPerPage = this._itemsPerPage();
    const restItemsCount = itemIndex < 0 ? itemsPerPage + itemIndex : this._itemsCount() - itemIndex;
    if (itemIndex > this._itemsCount() - 1) {
      itemIndex = 0;
      this._goToGhostItem = true;
    } else if (restItemsCount < itemsPerPage && restItemsCount > 0) {
      if (itemIndex > 0) {
        itemIndex -= itemsPerPage - restItemsCount;
      } else {
        itemIndex += itemsPerPage - restItemsCount;
      }
    }
    return itemIndex;
  },
  _cleanNavButtons() {
    if (this._prevNavButton) {
      this._prevNavButton.remove();
      delete this._prevNavButton;
    }
    if (this._nextNavButton) {
      this._nextNavButton.remove();
      delete this._nextNavButton;
    }
  },
  _renderNavButtonsVisibility() {
    if (!this.option('showNavButtons') || !this._prevNavButton || !this._nextNavButton) {
      return;
    }
    const selectedIndex = this.option('selectedIndex');
    const loop = this.option('loop');
    const itemsCount = this._itemsCount();
    this._prevNavButton.show();
    this._nextNavButton.show();
    if (itemsCount === 0) {
      this._prevNavButton.hide();
      this._nextNavButton.hide();
    }
    if (loop) {
      return;
    }
    let nextHidden = selectedIndex === itemsCount - this._itemsPerPage();
    const prevHidden = itemsCount < 2 || selectedIndex === 0;
    if (this._dataSource && this._dataSource.paginate()) {
      nextHidden = nextHidden && this._isLastPage();
    } else {
      nextHidden = nextHidden || itemsCount < 2;
    }
    if (prevHidden) {
      this._prevNavButton.hide();
    }
    if (nextHidden) {
      this._nextNavButton.hide();
    }
  },
  _setupSlideShow() {
    const that = this;
    const slideshowDelay = that.option('slideshowDelay');
    clearTimeout(that._slideshowTimer);
    if (!slideshowDelay) {
      return;
    }
    that._slideshowTimer = setTimeout(() => {
      if (that._userInteraction) {
        that._setupSlideShow();
        return;
      }
      that.nextItem(true).done(that._setupSlideShow);
    }, slideshowDelay);
  },
  _elementWidth() {
    if (!this._cacheElementWidth) {
      this._cacheElementWidth = (0, _size.getWidth)(this.$element());
    }
    return this._cacheElementWidth;
  },
  _clearCacheWidth() {
    delete this._cacheElementWidth;
  },
  _swipeStartHandler(e) {
    this._releaseInvisibleItems();
    this._clearCacheWidth();
    this._elementWidth();
    const itemsCount = this._itemsCount();
    if (!itemsCount) {
      e.event.cancel = true;
      return;
    }
    this._stopItemAnimations();
    this._startSwipe();
    this._userInteraction = true;
    if (!this.option('loop')) {
      const selectedIndex = this.option('selectedIndex');
      const startOffset = itemsCount - selectedIndex - this._itemsPerPage();
      const endOffset = selectedIndex;
      const rtlEnabled = this.option('rtlEnabled');
      e.event.maxLeftOffset = rtlEnabled ? endOffset : startOffset;
      e.event.maxRightOffset = rtlEnabled ? startOffset : endOffset;
    }
  },
  _stopItemAnimations() {
    _fx.default.stop(this._$container, true);
  },
  _swipeUpdateHandler(e) {
    const wrapAroundRatio = this.option('wrapAround') ? 1 : 0;
    const offset = this._offsetDirection() * e.event.offset * (this._itemsPerPage() + wrapAroundRatio) - this.option('selectedIndex');
    if (offset < 0) {
      this._loadNextPageIfNeeded(Math.ceil(Math.abs(offset)));
    }
    this._renderContainerPosition(offset);
  },
  _swipeEndHandler(e) {
    const targetOffset = e.event.targetOffset * this._offsetDirection() * this._itemsPerPage();
    const selectedIndex = this.option('selectedIndex');
    const newIndex = this._fitIndex(selectedIndex - targetOffset);
    const paginatedIndex = this._fitPaginatedIndex(newIndex);
    if (Math.abs(targetOffset) < this._itemsPerPage()) {
      this._relocateItems(selectedIndex);
      return;
    }
    if (this._itemsPerPage() === this._itemsCount()) {
      if (targetOffset > 0) {
        this._relocateItems(-targetOffset);
      } else {
        this._relocateItems(0);
      }
      return;
    }
    this.option('selectedIndex', paginatedIndex);
  },
  _setFocusOnSelect() {
    this._userInteraction = true;
    const selectedItem = this._getRealItems().filter(`.${GALLERY_ITEM_SELECTED_CLASS}`);
    this.option('focusedElement', (0, _element.getPublicElement)(selectedItem));
    this._userInteraction = false;
  },
  _flipIndex(index) {
    const itemsCount = this._itemsCount();
    index %= itemsCount;
    if (index > (itemsCount + 1) / 2) {
      index -= itemsCount;
    }
    if (index < -(itemsCount - 1) / 2) {
      index += itemsCount;
    }
    return index;
  },
  _fitIndex(index) {
    if (!this.option('loop')) {
      return index;
    }
    const itemsCount = this._itemsCount();
    if (index >= itemsCount || index < 0) {
      this._goToGhostItem = true;
    }
    if (index >= itemsCount) {
      index = itemsCount - index;
    }
    index %= itemsCount;
    if (index < 0) {
      index += itemsCount;
    }
    return index;
  },
  _clean() {
    this.callBase();
    this._cleanIndicators();
    this._cleanNavButtons();
  },
  _dispose() {
    this._wasAnyItemTemplateRendered = null;
    clearTimeout(this._slideshowTimer);
    this.callBase();
  },
  _updateSelection(addedSelection, removedSelection) {
    this._stopItemAnimations();
    this._renderNavButtonsVisibility();
    this._renderSelectedItem();
    this._relocateItems(addedSelection[0], removedSelection[0]);
    this._renderSelectedPageIndicator();
  },
  _relocateItems(newIndex, prevIndex, withoutAnimation) {
    if (prevIndex === undefined) {
      prevIndex = newIndex;
    }
    const indexOffset = this._calculateIndexOffset(newIndex, prevIndex);
    this._renderContainerPosition(indexOffset, true, this.option('animationEnabled') && !withoutAnimation).done(function () {
      this._setFocusOnSelect();
      this._userInteraction = false;
      this._setupSlideShow();
    });
  },
  _focusInHandler() {
    if (_fx.default.isAnimating(this._$container) || this._userInteraction) {
      return;
    }
    this.callBase.apply(this, arguments);
  },
  _focusOutHandler() {
    if (_fx.default.isAnimating(this._$container) || this._userInteraction) {
      return;
    }
    this.callBase.apply(this, arguments);
  },
  _selectFocusedItem: _common.noop,
  _moveFocus() {
    this._stopItemAnimations();
    this.callBase.apply(this, arguments);
    const index = this.itemElements().index((0, _renderer.default)(this.option('focusedElement')));
    this.goToItem(index, this.option('animationEnabled'));
  },
  _visibilityChanged(visible) {
    if (visible) {
      this._reviseDimensions();
    }
  },
  _calculateIndexOffset(newIndex, lastIndex) {
    if (lastIndex === undefined) {
      lastIndex = newIndex;
    }
    let indexOffset = lastIndex - newIndex;
    if (this.option('loop') && !this._needLongMove && this._goToGhostItem) {
      if (this._isItemOnFirstPage(newIndex) && this._isItemOnLastPage(lastIndex)) {
        indexOffset = -this._itemsPerPage();
      } else if (this._isItemOnLastPage(newIndex) && this._isItemOnFirstPage(lastIndex)) {
        indexOffset = this._itemsPerPage();
      }
      this._goToGhostItem = false;
    }
    this._needLongMove = false;
    indexOffset -= lastIndex;
    return indexOffset;
  },
  _isItemOnLastPage(itemIndex) {
    return itemIndex >= this._itemsCount() - this._itemsPerPage();
  },
  _isItemOnFirstPage(itemIndex) {
    return itemIndex <= this._itemsPerPage();
  },
  _optionChanged(args) {
    switch (args.name) {
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
        if ((0, _window.hasWindow)()) {
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
        if ((0, _window.hasWindow)()) {
          this._renderItemSizes();
          this._renderItemPositions();
          this._renderItemVisibility();
        }
        break;
      case 'swipeEnabled':
        this._renderUserInteraction();
        break;
      case 'indicatorEnabled':
        this._toggleIndicatorInteraction(args.value);
        break;
      default:
        this.callBase(args);
    }
  },
  goToItem(itemIndex, animation) {
    const selectedIndex = this.option('selectedIndex');
    const itemsCount = this._itemsCount();
    if (animation !== undefined) {
      this._animationOverride = animation;
    }
    itemIndex = this._fitIndex(itemIndex);
    this._deferredAnimate = (0, _deferred.Deferred)();
    if (itemIndex > itemsCount - 1 || itemIndex < 0 || selectedIndex === itemIndex) {
      return this._deferredAnimate.resolveWith(this).promise();
    }
    this.option('selectedIndex', itemIndex);
    return this._deferredAnimate.promise();
  },
  prevItem(animation) {
    return this.goToItem(this.option('selectedIndex') - 1, animation);
  },
  nextItem(animation) {
    return this.goToItem(this.option('selectedIndex') + 1, animation);
  }
});
(0, _component_registrator.default)('dxGallery', Gallery);
var _default = exports.default = Gallery;