"use strict";

exports.default = void 0;
var _size = require("../core/utils/size");
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));
var _class = _interopRequireDefault(require("../core/class"));
var _string = require("../core/utils/string");
var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));
var _common = require("../core/utils/common");
var _iterator = require("../core/utils/iterator");
var _type = require("../core/utils/type");
var _extend = require("../core/utils/extend");
var _click = require("../events/click");
var _pointer = _interopRequireDefault(require("../events/pointer"));
var _message = _interopRequireDefault(require("../localization/message"));
var _ui = _interopRequireDefault(require("./widget/ui.widget"));
var _select_box = _interopRequireDefault(require("./select_box"));
var _number_box = _interopRequireDefault(require("./number_box"));
var _index = require("../events/utils/index");
var _accessibility = require("./shared/accessibility");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PAGES_LIMITER = 4;
const PAGER_CLASS = 'dx-pager';
const PAGER_PAGE_CLASS = 'dx-page';
const PAGER_PAGE_CLASS_SELECTOR = '.' + PAGER_PAGE_CLASS;
const PAGER_PAGES_CLASS = 'dx-pages';
const LIGHT_MODE_CLASS = 'dx-light-mode';
const LIGHT_PAGES_CLASS = 'dx-light-pages';
const PAGER_PAGE_INDEX_CLASS = 'dx-page-index';
const PAGER_PAGES_COUNT_CLASS = 'dx-pages-count';
const PAGER_SELECTION_CLASS = 'dx-selection';
const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
const PAGER_PAGE_SIZES_CLASS = 'dx-page-sizes';
const PAGER_PAGE_SIZE_CLASS = 'dx-page-size';
const PAGER_PAGE_SIZE_CLASS_SELECTOR = '.' + PAGER_PAGE_SIZE_CLASS;
const PAGER_NAVIGATE_BUTTON = 'dx-navigate-button';
const PAGER_PREV_BUTTON_CLASS = 'dx-prev-button';
const PAGER_NEXT_BUTTON_CLASS = 'dx-next-button';
const PAGER_INFO_CLASS = 'dx-info';
const PAGER_INFO_TEXT_CLASS = 'dx-info-text';
const PAGER_BUTTON_DISABLE_CLASS = 'dx-button-disable';
const Page = _class.default.inherit({
  ctor: function (value, index) {
    const that = this;
    that.index = index;
    that._$page = (0, _renderer.default)('<div>').text(value).addClass(PAGER_PAGE_CLASS);
  },
  value: function (value) {
    const that = this;
    if ((0, _type.isDefined)(value)) {
      that._$page.text(value);
    } else {
      const text = that._$page.text();
      if ((0, _type.isNumeric)(text)) {
        return parseInt(text);
      } else {
        return text;
      }
    }
  },
  element: function () {
    return this._$page;
  },
  select: function (value) {
    this._$page.toggleClass(PAGER_SELECTION_CLASS, value);
  },
  render: function (rootElement, rtlEnabled) {
    rtlEnabled ? this._$page.prependTo(rootElement) : this._$page.appendTo(rootElement);
  }
});
const Pager = _ui.default.inherit({
  _getDefaultOptions: function () {
    return (0, _extend.extend)(this.callBase(), {
      visible: true,
      pagesNavigatorVisible: 'auto',
      pageIndex: 1,
      maxPagesCount: 10,
      pageCount: 10,
      totalCount: 0,
      pageSize: 5,
      showPageSizes: true,
      pageSizes: [5, 10],
      hasKnownLastPage: true,
      showNavigationButtons: false,
      showInfo: false,
      infoText: _message.default.getFormatter('dxPager-infoText'),
      pagesCountText: _message.default.getFormatter('dxPager-pagesCountText'),
      rtlEnabled: false,
      lightModeEnabled: false,
      pageIndexChanged: _common.noop,
      pageSizeChanged: _common.noop
    });
  },
  _toggleVisibility: function (value) {
    const $element = this.$element();
    if ($element) {
      $element.css('display', value ? '' : 'none');
    }
  },
  _getPages: function (currentPage, count) {
    const pages = [];
    const showMoreButton = !this.option('hasKnownLastPage');
    let firstValue;
    let i;

    ///#DEBUG
    this._testPagesCount = count;
    this._testShowMoreButton = showMoreButton;
    ///#ENDDEBUG

    if (count > 0 || showMoreButton) {
      if (count <= this.option('maxPagesCount')) {
        for (i = 1; i <= count; i++) {
          pages.push(new Page(i, i - 1));
        }
        if (showMoreButton) {
          pages.push(new Page('>', i - 1));
        }
      } else {
        pages.push(new Page(1, 0));
        firstValue = currentPage ? currentPage.value() - currentPage.index : 1;
        const pagesCount = count === firstValue + PAGES_LIMITER ? PAGES_LIMITER - 1 : PAGES_LIMITER;
        for (i = 1; i <= pagesCount; i++) {
          pages.push(new Page(firstValue + i, i));
        }
        pages.push(new Page(count, PAGES_LIMITER + 1));
        if (showMoreButton) {
          pages.push(new Page('>', PAGES_LIMITER + 1));
        }
      }
    }
    return pages;
  },
  _getPageByValue: function (value) {
    const that = this;
    let page;
    let i;
    for (i = 0; i < that._pages.length; i++) {
      page = that._pages[i];
      if (page.value() === value) {
        return page;
      }
    }
  },
  _processSelectedPage: function (maxPagesCount, pageIndex, pageCount) {
    const that = this;
    let isPageIndexValid = false;
    let selectedPageIndex;
    if (that._pages) {
      (0, _iterator.each)(that._pages, function (key, page) {
        if (pageIndex === page.value()) {
          isPageIndexValid = true;
        }
      });
      if (!isPageIndexValid) {
        that.selectedPage = null;
      }
    }
    if ((0, _type.isDefined)(that.selectedPage)) {
      if (pageIndex === pageCount && pageCount > maxPagesCount && that.selectedPage.index !== PAGES_LIMITER + 1) {
        that.selectedPage.index = PAGES_LIMITER + 1;
      }
    } else {
      if (pageIndex > PAGES_LIMITER && pageIndex < pageCount) {
        selectedPageIndex = pageCount - PAGES_LIMITER < pageIndex ? PAGES_LIMITER - (pageCount - pageIndex) + 1 : 2;
        that.selectedPage = new Page(pageIndex, selectedPageIndex);
      }
    }
  },
  _selectPageByValue: function (value) {
    const that = this;
    let i;
    const page = that._getPageByValue(value);
    const pages = that._pages;
    let pagesLength = pages.length;
    let nextPage;
    let morePage;
    if (!(0, _type.isDefined)(page)) {
      return;
    }
    const prevPage = that._pages[page.index - 1];
    nextPage = that._pages[page.index + 1];
    if (nextPage && nextPage.value() === '>') {
      morePage = nextPage;
      nextPage = undefined;
      pagesLength--;
      pages.pop();
    }
    if (that.selectedPage) {
      that.selectedPage.select(false);
    }
    page.select(true);
    that.selectedPage = page;
    if (nextPage && nextPage.value() - value > 1) {
      if (page.index !== 0) {
        prevPage.value(value + 1);
        that._pages.splice(page.index, 1);
        that._pages.splice(page.index - 1, 0, page);
        that._pages[page.index].index = page.index;
        page.index = page.index - 1;
        for (i = page.index - 1; i > 0; i--) {
          that._pages[i].value(that._pages[i + 1].value() - 1);
        }
      } else {
        for (i = 0; i < pagesLength - 1; i++) {
          that._pages[i].value(i + 1);
        }
      }
    }
    if (prevPage && value - prevPage.value() > 1) {
      if (page.index !== pagesLength - 1) {
        nextPage.value(value - 1);
        that._pages.splice(page.index, 1);
        that._pages.splice(page.index + 1, 0, page);
        that._pages[page.index].index = page.index;
        page.index = page.index + 1;
        for (i = page.index + 1; i < pagesLength - 1; i++) {
          that._pages[i].value(that._pages[i - 1].value() + 1);
        }
      } else {
        for (i = 1; i <= pagesLength - 2; i++) {
          that._pages[pagesLength - 1 - i].value(that._pages[pagesLength - 1].value() - i);
        }
      }
    }
    if (morePage) {
      pages.push(morePage);
    }
  },
  _updatePagesTabIndices: function () {
    const $selectedPage = this.selectedPage._$page;
    const updatePageIndices = () => {
      const buttons = (0, _renderer.default)(this.element()).find('[role=button]:not(.dx-button-disable)');
      (0, _iterator.each)(buttons, (_, element) => (0, _renderer.default)(element).attr('tabindex', 0));
      _events_engine.default.off($selectedPage, 'focus', updatePageIndices);
    };
    _events_engine.default.on($selectedPage, 'focus', updatePageIndices);
  },
  _nextPage: function (direction) {
    let pageIndex = this.option('pageIndex');
    const pageCount = this.option('pageCount');
    if ((0, _type.isDefined)(pageIndex)) {
      pageIndex = direction === 'next' ? ++pageIndex : --pageIndex;
      if (pageIndex > 0 && pageIndex <= pageCount) {
        this.option('pageIndex', pageIndex);
      }
    }
  },
  _wrapClickAction: function (action) {
    return e => {
      if (e.type === 'dxpointerup') {
        this._pointerUpHappened = true;
      } else if (this._pointerUpHappened) {
        this._pointerUpHappened = false;
        return;
      }
      action({
        event: e
      });
    };
  },
  _renderPages: function (pages) {
    const that = this;
    let $separator;
    const pagesLength = pages.length;
    const clickPagesIndexAction = that._createAction(function (args) {
      const e = args.event;
      const pageNumber = (0, _renderer.default)(e.target).text();
      const pageIndex = pageNumber === '>' ? that.option('pageCount') + 1 : Number(pageNumber);

      ///#DEBUG
      that._testPageIndex = pageIndex;
      ///#ENDDEBUG

      that.option('pageIndex', pageIndex);
    });
    let page;
    if (pagesLength > 1) {
      that._pageClickHandler = this._wrapClickAction(clickPagesIndexAction);
      _events_engine.default.on(that._$pagesChooser, (0, _index.addNamespace)([_pointer.default.up, _click.name], that.Name + 'Pages'), PAGER_PAGE_CLASS_SELECTOR, that._pageClickHandler);
      (0, _accessibility.registerKeyboardAction)('pager', that, that._$pagesChooser, PAGER_PAGE_CLASS_SELECTOR, clickPagesIndexAction);
    }
    for (let i = 0; i < pagesLength; i++) {
      page = pages[i];
      page.render(that._$pagesChooser, that.option('rtlEnabled'));
      that.setAria({
        'role': 'button',
        'label': _message.default.format('dxPager-page') + page.value()
      }, page.element());
      (0, _accessibility.setTabIndex)(that, page.element());
      if (pages[i + 1] && pages[i + 1].value() - page.value() > 1) {
        $separator = (0, _renderer.default)('<div>').text('. . .').addClass(PAGER_PAGE_SEPARATOR_CLASS);
        that.option('rtlEnabled') ? $separator.prependTo(that._$pagesChooser) : $separator.appendTo(that._$pagesChooser);
      }
    }
  },
  _calculateLightPagesWidth: function ($pageIndex, pageCount) {
    return Number($pageIndex.css('minWidth').replace('px', '')) + 10 * pageCount.toString().length;
  },
  _renderLightPages: function () {
    const that = this;
    const pageCount = this.option('pageCount');
    const pageIndex = this.option('pageIndex');
    const clickAction = that._createAction(function () {
      that.option('pageIndex', pageCount);
    });
    const pagesCountText = this.option('pagesCountText');
    const $container = (0, _renderer.default)('<div>').addClass(LIGHT_PAGES_CLASS).appendTo(this._$pagesChooser);
    const $pageIndex = (0, _renderer.default)('<div>').addClass(PAGER_PAGE_INDEX_CLASS).appendTo($container);
    that._pageIndexEditor = that._createComponent($pageIndex, _number_box.default, {
      value: pageIndex,
      min: 1,
      max: pageCount,
      width: that._calculateLightPagesWidth($pageIndex, pageCount),
      onValueChanged: function (e) {
        if (e.value === null) {
          return;
        }
        that.option('pageIndex', e.value);
      }
    });
    (0, _renderer.default)('<span>').text(pagesCountText).addClass(PAGER_INFO_TEXT_CLASS + ' ' + PAGER_INFO_CLASS).appendTo($container);
    const $pageCount = (0, _renderer.default)('<span>').addClass(PAGER_PAGES_COUNT_CLASS).text(pageCount);
    _events_engine.default.on($pageCount, (0, _index.addNamespace)(_click.name, that.Name + 'PagesCount'), function (e) {
      clickAction({
        event: e
      });
    });
    (0, _accessibility.registerKeyboardAction)('pager', that, $pageCount, undefined, clickAction);
    $pageCount.appendTo($container);
    that.setAria({
      'role': 'button',
      'label': 'Navigates to the last page'
    }, $pageCount);
  },
  _renderPagesChooser: function () {
    const that = this;
    const lightModeEnabled = that.option('lightModeEnabled');
    const pagesNavigatorVisible = that.option('pagesNavigatorVisible');
    const $element = that.$element();
    that._$pagesChooser && that._$pagesChooser.remove();
    if (!pagesNavigatorVisible) {
      return;
    }
    if (that._pages && that._pages.length === 0) {
      that.selectedPage = null;
      return;
    }
    that._$pagesChooser = (0, _renderer.default)('<div>').addClass(PAGER_PAGES_CLASS).appendTo($element);
    if (pagesNavigatorVisible === 'auto') {
      that._$pagesChooser.css('visibility', that.option('pageCount') === 1 ? 'hidden' : '');
    }
    if (!lightModeEnabled) {
      that._renderInfo();
    }
    that._renderNavigateButton('prev');
    if (lightModeEnabled) {
      that._renderLightPages();
    } else {
      that._renderPages(that._pages);
    }
    that._renderNavigateButton('next');
    that._updatePagesChooserWidth();
  },
  _renderPageSizes: function () {
    const that = this;
    let i;
    const pageSizes = that.option('pageSizes');
    const pagesSizesLength = pageSizes && pageSizes.length;
    let pageSizeValue;
    const currentPageSize = that.option('pageSize');
    let $pageSize;
    const clickPagesSizeAction = that._createAction(function (args) {
      const e = args.event;
      pageSizeValue = parseInt((0, _renderer.default)(e.target).text());

      ///#DEBUG
      that._testPageSizeIndex = pageSizeValue;
      ///#ENDDEBUG

      that.option('pageSize', pageSizeValue);
    });

    ///#DEBUG
    that._testCurrentPageSize = currentPageSize;
    ///#ENDDEBUG

    _events_engine.default.on(that._$pagesSizeChooser, (0, _index.addNamespace)(_click.name, that.Name + 'PageSize'), PAGER_PAGE_SIZE_CLASS_SELECTOR, function (e) {
      clickPagesSizeAction({
        event: e
      });
    });
    (0, _accessibility.registerKeyboardAction)('pager', that, that._$pagesSizeChooser, PAGER_PAGE_SIZE_CLASS_SELECTOR, clickPagesSizeAction);
    for (i = 0; i < pagesSizesLength; i++) {
      $pageSize = (0, _renderer.default)('<div>').text(pageSizes[i]).addClass(PAGER_PAGE_SIZE_CLASS);
      that.setAria({
        'role': 'button',
        'label': 'Display ' + pageSizes[i] + ' items on page'
      }, $pageSize);
      (0, _accessibility.setTabIndex)(that, $pageSize);
      if (currentPageSize === pageSizes[i]) {
        $pageSize.addClass(PAGER_SELECTION_CLASS);
      }
      that._$pagesSizeChooser.append($pageSize);
    }
  },
  _calculateLightPageSizesWidth: function (pageSizes) {
    return Number(this._$pagesSizeChooser.css('minWidth').replace('px', '')) + 10 * Math.max.apply(Math, pageSizes).toString().length;
  },
  _renderLightPageSizes: function () {
    const that = this;
    const pageSizes = that.option('pageSizes');
    const $editor = (0, _renderer.default)('<div>').appendTo(that._$pagesSizeChooser);
    that._pageSizeEditor = that._createComponent($editor, _select_box.default, {
      dataSource: pageSizes,
      value: that.option('pageSize'),
      onSelectionChanged: function (e) {
        ///#DEBUG
        that._testPageSizeIndex = e.selectedItem;
        ///#ENDDEBUG
        that.option('pageSize', e.selectedItem);
      },
      width: that._calculateLightPageSizesWidth(pageSizes)
    });
  },
  _renderPagesSizeChooser: function () {
    const that = this;
    const pageSizes = that.option('pageSizes');
    const showPageSizes = that.option('showPageSizes');
    const pagesSizesLength = pageSizes && pageSizes.length;
    const $element = that.$element();
    that._$pagesSizeChooser && that._$pagesSizeChooser.remove();
    if (!showPageSizes || !pagesSizesLength) {
      return;
    }
    that._$pagesSizeChooser = (0, _renderer.default)('<div>').addClass(PAGER_PAGE_SIZES_CLASS).appendTo($element);
    if (that.option('lightModeEnabled')) {
      that._renderLightPageSizes();
    } else {
      that._renderPageSizes();
    }
    that._pagesSizeChooserWidth = (0, _size.getWidth)(that._$pagesSizeChooser);
  },
  _renderInfo: function () {
    const infoText = this.option('infoText');
    if (this.option('showInfo') && (0, _type.isDefined)(infoText)) {
      this._$info = (0, _renderer.default)('<div>').css('display', this._isInfoHide ? 'none' : '').addClass(PAGER_INFO_CLASS).text((0, _string.format)(infoText, this.selectedPage && this.selectedPage.value(), this.option('pageCount'), this.option('totalCount'))).appendTo(this._$pagesChooser);
      if (!this._isInfoHide) {
        this._infoWidth = (0, _size.getOuterWidth)(this._$info, true);
      }
    }
  },
  _renderNavigateButton: function (direction) {
    const that = this;
    const clickAction = that._createAction(function () {
      that._nextPage(direction);
    });
    let $button;
    if (that.option('showNavigationButtons') || that.option('lightModeEnabled')) {
      $button = (0, _renderer.default)('<div>').addClass(PAGER_NAVIGATE_BUTTON);
      _events_engine.default.on($button, (0, _index.addNamespace)([_pointer.default.up, _click.name], that.Name + 'Pages'), that._wrapClickAction(clickAction));
      (0, _accessibility.registerKeyboardAction)('pager', that, $button, undefined, clickAction);
      that.setAria({
        'role': 'button',
        'label': _message.default.format(`dxPager-${_message.default.format(direction === 'prev' ? 'prev' : 'next')}Page`)
      }, $button);
      (0, _accessibility.setTabIndex)(that, $button);
      if (that.option('rtlEnabled')) {
        $button.addClass(direction === 'prev' ? PAGER_NEXT_BUTTON_CLASS : PAGER_PREV_BUTTON_CLASS);
        $button.prependTo(this._$pagesChooser);
      } else {
        $button.addClass(direction === 'prev' ? PAGER_PREV_BUTTON_CLASS : PAGER_NEXT_BUTTON_CLASS);
        $button.appendTo(this._$pagesChooser);
      }
    }
  },
  _renderContentImpl: function () {
    this.$element().toggleClass(LIGHT_MODE_CLASS, this.option('lightModeEnabled'));
    this._toggleVisibility(this.option('visible'));
    this._updatePageSizes(true);
    this._updatePages(true);
    (0, _accessibility.restoreFocus)(this);
  },
  _initMarkup: function () {
    const $element = this.$element();
    $element.addClass(PAGER_CLASS);
    const $pageSize = (0, _renderer.default)('<div>').addClass(PAGER_PAGE_CLASS);
    this._$pagesChooser = (0, _renderer.default)('<div>').addClass(PAGER_PAGES_CLASS).append($pageSize).appendTo($element);
  },
  _render: function () {
    this.option().lightModeEnabled = false;
    this.callBase();
    this._updateLightMode();
  },
  _updatePageSizes: function (forceRender) {
    const lightModeEnabled = this.option('lightModeEnabled');
    const pageSize = this.option('pageSize');
    const pageSizes = this.option('pageSizes');
    if (lightModeEnabled) {
      this._pageSizeEditor && this._pageSizeEditor.option({
        value: pageSize,
        dataSource: pageSizes,
        width: this._calculateLightPageSizesWidth(pageSizes)
      });
    }
    if (!lightModeEnabled || forceRender) {
      this._renderPagesSizeChooser();
    }
  },
  _updatePages: function (forceRender) {
    const pageCount = this.option('pageCount');
    const pageIndex = this.option('pageIndex');
    const lightModeEnabled = this.option('lightModeEnabled');
    if (!lightModeEnabled) {
      this._processSelectedPage(this.option('maxPagesCount'), pageIndex, pageCount);
      this._pages = this._getPages(this.selectedPage, pageCount);
      this._selectPageByValue(pageIndex);
    } else {
      this._pageIndexEditor && this._pageIndexEditor.option({
        value: pageIndex,
        width: this._calculateLightPagesWidth(this._pageIndexEditor.$element(), pageCount)
      });
    }
    if (!lightModeEnabled || forceRender) {
      this._renderPagesChooser();
    }
    this._updateButtonsState(pageIndex);
  },
  _isPageIndexInvalid: function (direction, pageIndex) {
    const isNextDirection = direction === 'next';
    const rtlEnabled = this.option('rtlEnabled');
    if (rtlEnabled && isNextDirection || !rtlEnabled && !isNextDirection) {
      return pageIndex <= 1;
    }
    return pageIndex >= this.option('pageCount');
  },
  _updateButtonsState: function (pageIndex) {
    const nextButton = this.$element().find('.' + PAGER_NEXT_BUTTON_CLASS);
    const prevButton = this.$element().find('.' + PAGER_PREV_BUTTON_CLASS);
    nextButton.toggleClass(PAGER_BUTTON_DISABLE_CLASS, this._isPageIndexInvalid('next', pageIndex));
    prevButton.toggleClass(PAGER_BUTTON_DISABLE_CLASS, this._isPageIndexInvalid('prev', pageIndex));
  },
  _optionChanged: function (args) {
    switch (args.name) {
      case 'visible':
        this._toggleVisibility(args.value);
        break;
      case 'pageIndex':
        {
          const pageIndexChanged = this.option('pageIndexChanged');
          if (pageIndexChanged) {
            pageIndexChanged(args.value);
          }
          this._updatePages();
          break;
        }
      case 'maxPagesCount':
      case 'pageCount':
      case 'totalCount':
      case 'hasKnownLastPage':
      case 'pagesNavigatorVisible':
      case 'showNavigationButtons':
        this._updatePages();
        break;
      case 'pageSize':
        {
          const pageSizeChanged = this.option('pageSizeChanged');
          if (pageSizeChanged) {
            pageSizeChanged(args.value);
          }
          this._updatePageSizes();
          break;
        }
      case 'pageSizes':
        this._updatePageSizes();
        break;
      case 'lightModeEnabled':
        this._renderContentImpl();
        !args.value && this._updateLightMode();
        break;
      default:
        this._invalidate();
    }
  },
  _clean: function () {
    if (this._$pagesChooser) {
      _events_engine.default.off(this._$pagesChooser, (0, _index.addNamespace)([_pointer.default.up, _click.name], this.Name + 'Pages'), PAGER_PAGE_CLASS_SELECTOR, this._pageClickHandler);
      (0, _accessibility.registerKeyboardAction)('pager', this, this._$pagesChooser, PAGER_PAGE_CLASS_SELECTOR, this._pageKeyDownHandler);
    }
    this.callBase();
  },
  _getMinPagerWidth: function () {
    const pagesChooserWidth = (0, _type.isDefined)(this._pagesChooserWidth) ? this._pagesChooserWidth : 0;
    const pagesSizeChooserWidth = (0, _type.isDefined)(this._pagesSizeChooserWidth) ? this._pagesSizeChooserWidth : 0;
    return pagesChooserWidth + pagesSizeChooserWidth;
  },
  _updatePagesChooserWidth: (0, _common.deferUpdater)(function () {
    const lastPageWidth = this._pages && this._pages.length > 0 ? (0, _size.getWidth)(this._pages[this._pages.length - 1]._$page) : 0;
    this._pagesChooserWidth = (0, _size.getWidth)(this._$pagesChooser) + lastPageWidth;
  }),
  _updateLightMode: (0, _common.deferUpdater)(function () {
    const that = this;
    const width = (0, _size.getWidth)(this.$element());
    const infoWidth = (0, _type.isDefined)(this._infoWidth) ? this._infoWidth : 0;
    (0, _common.deferRender)(function () {
      if (that._isInfoHide && width > that._getMinPagerWidth() + infoWidth) {
        that._$info.css('display', '');
        that._updatePagesChooserWidth();
        that._isInfoHide = false;
      }
      if (!that._isInfoHide && width > that._getMinPagerWidth() - infoWidth && width < that._getMinPagerWidth()) {
        that._$info.css('display', 'none');
        that._updatePagesChooserWidth();
        that._isInfoHide = true;
      }
      (0, _common.deferUpdate)(function () {
        (0, _common.deferRender)(function () {
          if (that.option('lightModeEnabled') && width > that._previousWidth) {
            that.option('lightModeEnabled', false);
          } else {
            if (width < that._getMinPagerWidth()) {
              that.option('lightModeEnabled', true);
            }
          }
          that._previousWidth = width;
        });
      });
    });
  }),
  _dimensionChanged: function () {
    this._updateLightMode();
  },
  getHeight: function () {
    return this.option('visible') ? (0, _size.getOuterHeight)(this.$element()) : 0;
  }
});
var _default = exports.default = Pager;
(0, _component_registrator.default)('dxPager', Pager);
module.exports = exports.default;
module.exports.default = exports.default;