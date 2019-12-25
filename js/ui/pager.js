var $ = require('../core/renderer'),
    eventsEngine = require('../events/core/events_engine'),
    Class = require('../core/class'),
    stringUtils = require('../core/utils/string'),
    registerComponent = require('../core/component_registrator'),
    commonUtils = require('../core/utils/common'),
    each = require('../core/utils/iterator').each,
    typeUtils = require('../core/utils/type'),
    extend = require('../core/utils/extend').extend,
    clickEvent = require('../events/click'),
    pointerEvents = require('../events/pointer'),
    messageLocalization = require('../localization/message'),
    Widget = require('./widget/ui.widget'),
    SelectBox = require('./select_box'),
    NumberBox = require('./number_box'),
    eventUtils = require('../events/utils'),
    accessibility = require('./shared/accessibility');

var PAGES_LIMITER = 4,
    PAGER_CLASS = 'dx-pager',
    PAGER_PAGE_CLASS = 'dx-page',
    PAGER_PAGE_CLASS_SELECTOR = '.' + PAGER_PAGE_CLASS,
    PAGER_PAGES_CLASS = 'dx-pages',
    LIGHT_MODE_CLASS = 'dx-light-mode',
    LIGHT_PAGES_CLASS = 'dx-light-pages',
    PAGER_PAGE_INDEX_CLASS = 'dx-page-index',
    PAGER_PAGES_COUNT_CLASS = 'dx-pages-count',
    PAGER_SELECTION_CLASS = 'dx-selection',
    PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator',
    PAGER_PAGE_SIZES_CLASS = 'dx-page-sizes',
    PAGER_PAGE_SIZE_CLASS = 'dx-page-size',
    PAGER_PAGE_SIZE_CLASS_SELECTOR = '.' + PAGER_PAGE_SIZE_CLASS,
    PAGER_NAVIGATE_BUTTON = 'dx-navigate-button',
    PAGER_PREV_BUTTON_CLASS = 'dx-prev-button',
    PAGER_NEXT_BUTTON_CLASS = 'dx-next-button',
    PAGER_INFO_CLASS = 'dx-info',
    PAGER_INFO_TEXT_CLASS = 'dx-info-text',
    PAGER_BUTTON_DISABLE_CLASS = 'dx-button-disable';

var Page = Class.inherit({
    ctor: function(value, index) {
        var that = this;
        that.index = index;
        that._$page = $('<div>')
            .text(value)
            .addClass(PAGER_PAGE_CLASS);
    },

    value: function(value) {
        var that = this;

        if((typeUtils.isDefined(value))) {
            that._$page.text(value);
        } else {
            var text = that._$page.text();
            if(typeUtils.isNumeric(text)) {
                return parseInt(text);
            } else {
                return text;
            }
        }
    },

    element: function() {
        return this._$page;
    },

    select: function(value) {
        this._$page.toggleClass(PAGER_SELECTION_CLASS, value);
    },

    render: function(rootElement, rtlEnabled) {
        rtlEnabled ? this._$page.prependTo(rootElement) : this._$page.appendTo(rootElement);
    }
});

var Pager = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
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
            infoText: messageLocalization.getFormatter('dxPager-infoText'),
            pagesCountText: messageLocalization.getFormatter('dxPager-pagesCountText'),
            rtlEnabled: false,
            lightModeEnabled: false,
            pageIndexChanged: commonUtils.noop,
            pageSizeChanged: commonUtils.noop
        });
    },

    _toggleVisibility: function(value) {
        var $element = this.$element();
        if($element) {
            $element.css('display', value ? '' : 'none');
        }
    },

    _getPages: function(currentPage, count) {
        var pages = [],
            showMoreButton = !this.option('hasKnownLastPage'),
            firstValue,
            i;

        ///#DEBUG
        this._testPagesCount = count;
        this._testShowMoreButton = showMoreButton;
        ///#ENDDEBUG

        if(count > 0 || showMoreButton) {
            if(count <= this.option('maxPagesCount')) {
                for(i = 1; i <= count; i++) {
                    pages.push(new Page(i, i - 1));
                }
                if(showMoreButton) {
                    pages.push(new Page('>', i - 1));
                }
            } else {
                pages.push(new Page(1, 0));
                firstValue = currentPage ? currentPage.value() - currentPage.index : 1;
                for(i = 1; i <= PAGES_LIMITER; i++) {
                    pages.push(new Page(firstValue + i, i));
                }
                pages.push(new Page(count, PAGES_LIMITER + 1));
                if(showMoreButton) {
                    pages.push(new Page('>', PAGES_LIMITER + 1));
                }
            }
        }
        return pages;
    },

    _getPageByValue: function(value) {
        var that = this,
            page,
            i;

        for(i = 0; i < that._pages.length; i++) {
            page = that._pages[i];
            if(page.value() === value) {
                return page;
            }
        }
    },

    _processSelectedPage: function(maxPagesCount, pageIndex, pageCount) {
        var that = this,
            isPageIndexValid = false,
            selectedPageIndex;

        if(that._pages) {
            each(that._pages, function(key, page) {
                if(pageIndex === page.value()) {
                    isPageIndexValid = true;
                }
            });

            if(!isPageIndexValid) {
                that.selectedPage = null;
            }
        }

        if(typeUtils.isDefined(that.selectedPage)) {
            if(pageIndex === pageCount && pageCount > maxPagesCount && that.selectedPage.index !== PAGES_LIMITER + 1) {
                that.selectedPage.index = PAGES_LIMITER + 1;
            }
        } else {
            if(pageIndex > PAGES_LIMITER && pageIndex < pageCount) {
                selectedPageIndex = pageCount - PAGES_LIMITER < pageIndex ? PAGES_LIMITER - (pageCount - pageIndex) + 1 : 2;
                that.selectedPage = new Page(pageIndex, selectedPageIndex);
            }
        }
    },

    _selectPageByValue: function(value) {
        var that = this,
            i,
            page = that._getPageByValue(value),
            pages = that._pages,
            pagesLength = pages.length,
            prevPage,
            nextPage,
            morePage;

        if(!typeUtils.isDefined(page)) {
            return;
        }

        prevPage = that._pages[page.index - 1];
        nextPage = that._pages[page.index + 1];

        if(nextPage && nextPage.value() === '>') {
            morePage = nextPage;
            nextPage = undefined;
            pagesLength--;
            pages.pop();
        }

        if(that.selectedPage) {
            that.selectedPage.select(false);
        }
        page.select(true);
        that.selectedPage = page;

        if(nextPage && nextPage.value() - value > 1) {
            if(page.index !== 0) {
                prevPage.value(value + 1);
                that._pages.splice(page.index, 1);
                that._pages.splice(page.index - 1, 0, page);

                that._pages[page.index].index = page.index;
                page.index = page.index - 1;

                for(i = page.index - 1; i > 0; i--) {
                    that._pages[i].value(that._pages[i + 1].value() - 1);
                }
            } else {
                for(i = 0; i < pagesLength - 1; i++) {
                    that._pages[i].value(i + 1);
                }
            }
        }

        if(prevPage && value - prevPage.value() > 1) {
            if(page.index !== pagesLength - 1) {
                nextPage.value(value - 1);

                that._pages.splice(page.index, 1);
                that._pages.splice(page.index + 1, 0, page);

                that._pages[page.index].index = page.index;
                page.index = page.index + 1;

                for(i = page.index + 1; i < pagesLength - 1; i++) {
                    that._pages[i].value(that._pages[i - 1].value() + 1);
                }
            } else {
                for(i = 1; i <= pagesLength - 2; i++) {
                    that._pages[pagesLength - 1 - i].value(that._pages[pagesLength - 1].value() - i);
                }
            }
        }
        if(morePage) {
            pages.push(morePage);
        }
    },

    _updatePagesTabIndices: function() {
        var $selectedPage = this.selectedPage._$page,
            updatePageIndices = () => {
                let buttons = $(this.element()).find('[role=button]:not(.dx-button-disable)');
                each(buttons, (_, element) => $(element).attr('tabindex', 0));
                eventsEngine.off($selectedPage, 'focus', updatePageIndices);
            };
        eventsEngine.on($selectedPage, 'focus', updatePageIndices);
    },

    _nextPage: function(direction) {
        var pageIndex = this.option('pageIndex'),
            pageCount = this.option('pageCount');

        if(typeUtils.isDefined(pageIndex)) {
            pageIndex = direction === 'next' ? ++pageIndex : --pageIndex;
            if(pageIndex > 0 && pageIndex <= pageCount) {
                this.option('pageIndex', pageIndex);
            }
        }
    },

    _wrapClickAction: function(action) {
        return (e) => {
            if(e.type === 'dxpointerup') {
                this._pointerUpHappened = true;
            } else if(this._pointerUpHappened) {
                this._pointerUpHappened = false;
                return;
            }

            action({ event: e });
        };
    },

    _renderPages: function(pages) {
        var that = this,
            $separator,
            pagesLength = pages.length,
            clickPagesIndexAction = that._createAction(function(args) {
                var e = args.event,
                    pageNumber = $(e.target).text(),
                    pageIndex = pageNumber === '>' ? that.option('pageCount') + 1 : Number(pageNumber);

                ///#DEBUG
                that._testPageIndex = pageIndex;
                ///#ENDDEBUG

                that.option('pageIndex', pageIndex);
            }),
            page;

        if(pagesLength > 1) {
            that._pageClickHandler = this._wrapClickAction(clickPagesIndexAction);

            eventsEngine.on(that._$pagesChooser, eventUtils.addNamespace([pointerEvents.up, clickEvent.name], that.Name + 'Pages'), PAGER_PAGE_CLASS_SELECTOR, that._pageClickHandler);

            accessibility.registerKeyboardAction('pager', that, that._$pagesChooser, PAGER_PAGE_CLASS_SELECTOR, clickPagesIndexAction);
        }

        for(var i = 0; i < pagesLength; i++) {
            page = pages[i];

            page.render(that._$pagesChooser, that.option('rtlEnabled'));

            that.setAria({
                'role': 'button',
                'label': 'Page ' + page.value()
            }, page.element());

            accessibility.setTabIndex(that, page.element());

            if(pages[i + 1] && pages[i + 1].value() - page.value() > 1) {
                $separator = $('<div>').text('. . .').addClass(PAGER_PAGE_SEPARATOR_CLASS);

                that.option('rtlEnabled') ? $separator.prependTo(that._$pagesChooser) : $separator.appendTo(that._$pagesChooser);
            }
        }
    },

    _calculateLightPagesWidth: function($pageIndex, pageCount) {
        return Number($pageIndex.css('minWidth').replace('px', '')) + 10 * pageCount.toString().length;
    },

    _renderLightPages: function() {
        var that = this,
            pageCount = this.option('pageCount'),
            pageIndex = this.option('pageIndex'),
            $pageCount,
            $pageIndex,
            clickAction = that._createAction(function() {
                that.option('pageIndex', pageCount);
            }),
            pagesCountText = this.option('pagesCountText');

        var $container = $('<div>')
            .addClass(LIGHT_PAGES_CLASS)
            .appendTo(this._$pagesChooser);

        $pageIndex = $('<div>').addClass(PAGER_PAGE_INDEX_CLASS).appendTo($container);

        that._pageIndexEditor = that._createComponent($pageIndex, NumberBox, {
            value: pageIndex,
            min: 1,
            max: pageCount,
            width: that._calculateLightPagesWidth($pageIndex, pageCount),
            onValueChanged: function(e) {
                that.option('pageIndex', e.value);
            }
        });

        $('<span>')
            .text(pagesCountText)
            .addClass(PAGER_INFO_TEXT_CLASS + ' ' + PAGER_INFO_CLASS)
            .appendTo($container);

        $pageCount = $('<span>')
            .addClass(PAGER_PAGES_COUNT_CLASS)
            .text(pageCount);

        eventsEngine.on($pageCount, eventUtils.addNamespace(clickEvent.name, that.Name + 'PagesCount'), function(e) {
            clickAction({ event: e });
        });

        accessibility.registerKeyboardAction('pager', that, $pageCount, undefined, clickAction);

        $pageCount.appendTo($container);

        that.setAria({
            'role': 'button',
            'label': 'Navigates to the last page'
        }, $pageCount);
    },

    _renderPagesChooser: function() {
        var that = this,
            lightModeEnabled = that.option('lightModeEnabled'),
            pagesNavigatorVisible = that.option('pagesNavigatorVisible'),
            $element = that.$element();

        that._$pagesChooser && that._$pagesChooser.remove();

        if(!pagesNavigatorVisible) {
            return;
        }

        if(that._pages && that._pages.length === 0) {
            that.selectedPage = null;
            return;
        }

        that._$pagesChooser = $('<div>').addClass(PAGER_PAGES_CLASS).appendTo($element);

        if(pagesNavigatorVisible === 'auto') {
            that._$pagesChooser.css('visibility', that.option('pageCount') === 1 ? 'hidden' : '');
        }

        if(!lightModeEnabled) {
            that._renderInfo();
        }

        that._renderNavigateButton('prev');

        if(lightModeEnabled) {
            that._renderLightPages();
        } else {
            that._renderPages(that._pages);
        }

        that._renderNavigateButton('next');

        that._updatePagesChooserWidth();
    },

    _renderPageSizes: function() {
        var that = this,
            i,
            pageSizes = that.option('pageSizes'),
            pagesSizesLength = pageSizes && pageSizes.length,
            pageSizeValue,
            currentPageSize = that.option('pageSize'),
            $pageSize,
            clickPagesSizeAction = that._createAction(function(args) {
                var e = args.event;

                pageSizeValue = parseInt($(e.target).text());

                ///#DEBUG
                that._testPageSizeIndex = pageSizeValue;
                ///#ENDDEBUG

                that.option('pageSize', pageSizeValue);
            });

        ///#DEBUG
        that._testCurrentPageSize = currentPageSize;
        ///#ENDDEBUG

        eventsEngine.on(that._$pagesSizeChooser, eventUtils.addNamespace(clickEvent.name, that.Name + 'PageSize'), PAGER_PAGE_SIZE_CLASS_SELECTOR, function(e) {
            clickPagesSizeAction({ event: e });
        });

        accessibility.registerKeyboardAction('pager', that, that._$pagesSizeChooser, PAGER_PAGE_SIZE_CLASS_SELECTOR, clickPagesSizeAction);

        for(i = 0; i < pagesSizesLength; i++) {
            $pageSize = $('<div>')
                .text(pageSizes[i])
                .addClass(PAGER_PAGE_SIZE_CLASS);

            that.setAria({
                'role': 'button',
                'label': 'Display ' + pageSizes[i] + ' items on page'
            }, $pageSize);

            accessibility.setTabIndex(that, $pageSize);

            if(currentPageSize === pageSizes[i]) {
                $pageSize.addClass(PAGER_SELECTION_CLASS);
            }
            that._$pagesSizeChooser.append($pageSize);
        }
    },

    _calculateLightPageSizesWidth: function(pageSizes) {
        return Number(this._$pagesSizeChooser.css('minWidth').replace('px', '')) + 10 * Math.max.apply(Math, pageSizes).toString().length;
    },

    _renderLightPageSizes: function() {
        var that = this,
            $editor,
            pageSizes = that.option('pageSizes');

        $editor = $('<div>').appendTo(that._$pagesSizeChooser);

        that._pageSizeEditor = that._createComponent($editor, SelectBox, {
            dataSource: pageSizes,
            value: that.option('pageSize'),
            onSelectionChanged: function(e) {
                ///#DEBUG
                that._testPageSizeIndex = e.selectedItem;
                ///#ENDDEBUG
                that.option('pageSize', e.selectedItem);
            },
            width: that._calculateLightPageSizesWidth(pageSizes)
        });
    },

    _renderPagesSizeChooser: function() {
        var that = this,
            pageSizes = that.option('pageSizes'),
            showPageSizes = that.option('showPageSizes'),
            pagesSizesLength = pageSizes && pageSizes.length,
            $element = that.$element();

        that._$pagesSizeChooser && that._$pagesSizeChooser.remove();

        if(!showPageSizes || !pagesSizesLength) {
            return;
        }

        that._$pagesSizeChooser = $('<div>').addClass(PAGER_PAGE_SIZES_CLASS).appendTo($element);

        if(that.option('lightModeEnabled')) {
            that._renderLightPageSizes();
        } else {
            that._renderPageSizes();
        }

        that._pagesSizeChooserWidth = that._$pagesSizeChooser.width();
    },

    _renderInfo: function() {
        var infoText = this.option('infoText');

        if(this.option('showInfo') && typeUtils.isDefined(infoText)) {
            this._$info = $('<div>')
                .css('display', this._isInfoHide ? 'none' : '')
                .addClass(PAGER_INFO_CLASS)
                .text(stringUtils.format(infoText, this.selectedPage && this.selectedPage.value(), this.option('pageCount'), this.option('totalCount')))
                .appendTo(this._$pagesChooser);

            if(!this._isInfoHide) {
                this._infoWidth = this._$info.outerWidth(true);
            }
        }
    },

    _renderNavigateButton: function(direction) {
        var that = this,
            clickAction = that._createAction(function() {
                that._nextPage(direction);
            }),
            $button;

        if(that.option('showNavigationButtons') || that.option('lightModeEnabled')) {
            $button = $('<div>').addClass(PAGER_NAVIGATE_BUTTON);

            eventsEngine.on($button, eventUtils.addNamespace([pointerEvents.up, clickEvent.name], that.Name + 'Pages'), that._wrapClickAction(clickAction));

            accessibility.registerKeyboardAction('pager', that, $button, undefined, clickAction);

            that.setAria({
                'role': 'button',
                'label': direction === 'prev' ? 'Previous page' : ' Next page'
            }, $button);

            accessibility.setTabIndex(that, $button);

            if(that.option('rtlEnabled')) {
                $button.addClass(direction === 'prev' ? PAGER_NEXT_BUTTON_CLASS : PAGER_PREV_BUTTON_CLASS);
                $button.prependTo(this._$pagesChooser);
            } else {
                $button.addClass(direction === 'prev' ? PAGER_PREV_BUTTON_CLASS : PAGER_NEXT_BUTTON_CLASS);
                $button.appendTo(this._$pagesChooser);
            }
        }
    },

    _renderContentImpl: function() {
        this.$element()
            .toggleClass(LIGHT_MODE_CLASS, this.option('lightModeEnabled'));

        this._toggleVisibility(this.option('visible'));
        this._updatePageSizes(true);
        this._updatePages(true);

        accessibility.restoreFocus(this);
    },

    _initMarkup: function() {
        var $element = this.$element();

        $element.addClass(PAGER_CLASS);

        var $pageSize = $('<div>').addClass(PAGER_PAGE_CLASS);

        this._$pagesChooser = $('<div>').addClass(PAGER_PAGES_CLASS).append($pageSize).appendTo($element);
    },

    _render: function() {
        this.option().lightModeEnabled = false;
        this.callBase();
        this._updateLightMode();
    },

    _updatePageSizes: function(forceRender) {
        var lightModeEnabled = this.option('lightModeEnabled'),
            pageSize = this.option('pageSize'),
            pageSizes = this.option('pageSizes');

        if(lightModeEnabled) {
            this._pageSizeEditor && this._pageSizeEditor.option({
                value: pageSize,
                dataSource: pageSizes,
                width: this._calculateLightPageSizesWidth(pageSizes)
            });
        }

        if(!lightModeEnabled || forceRender) {
            this._renderPagesSizeChooser();
        }
    },

    _updatePages: function(forceRender) {
        var pageCount = this.option('pageCount'),
            pageIndex = this.option('pageIndex'),
            lightModeEnabled = this.option('lightModeEnabled');

        if(!lightModeEnabled) {
            this._processSelectedPage(this.option('maxPagesCount'), pageIndex, pageCount);
            this._pages = this._getPages(this.selectedPage, pageCount);
            this._selectPageByValue(pageIndex);
        } else {
            this._pageIndexEditor && this._pageIndexEditor.option({
                value: pageIndex,
                width: this._calculateLightPagesWidth(this._pageIndexEditor.$element(), pageCount)
            });
        }

        if(!lightModeEnabled || forceRender) {
            this._renderPagesChooser();
        }
        this._updateButtonsState(pageIndex);
    },

    _isPageIndexInvalid: function(direction, pageIndex) {
        var isNextDirection = direction === 'next',
            rtlEnabled = this.option('rtlEnabled');

        if((rtlEnabled && isNextDirection) || (!rtlEnabled && !isNextDirection)) {
            return pageIndex <= 1;
        }

        return pageIndex >= this.option('pageCount');
    },

    _updateButtonsState: function(pageIndex) {
        var nextButton = this.$element().find('.' + PAGER_NEXT_BUTTON_CLASS),
            prevButton = this.$element().find('.' + PAGER_PREV_BUTTON_CLASS);

        nextButton.toggleClass(PAGER_BUTTON_DISABLE_CLASS, this._isPageIndexInvalid('next', pageIndex));
        prevButton.toggleClass(PAGER_BUTTON_DISABLE_CLASS, this._isPageIndexInvalid('prev', pageIndex));
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'visible':
                this._toggleVisibility(args.value);
                break;
            case 'pageIndex':
                var pageIndexChanged = this.option('pageIndexChanged');
                if(pageIndexChanged) {
                    pageIndexChanged(args.value);
                }
                this._updatePages();
                break;
            case 'maxPagesCount':
            case 'pageCount':
            case 'totalCount':
            case 'hasKnownLastPage':
            case 'pagesNavigatorVisible':
            case 'showNavigationButtons':
                this._updatePages();
                break;
            case 'pageSize':
                var pageSizeChanged = this.option('pageSizeChanged');
                if(pageSizeChanged) {
                    pageSizeChanged(args.value);
                }
                this._updatePageSizes();
                break;
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

    _clean: function() {
        if(this._$pagesChooser) {
            eventsEngine.off(this._$pagesChooser, eventUtils.addNamespace([pointerEvents.up, clickEvent.name], this.Name + 'Pages'), PAGER_PAGE_CLASS_SELECTOR, this._pageClickHandler);

            accessibility.registerKeyboardAction('pager', this, this._$pagesChooser, PAGER_PAGE_CLASS_SELECTOR, this._pageKeyDownHandler);
        }

        this.callBase();
    },

    _getMinPagerWidth: function() {
        var pagesChooserWidth = typeUtils.isDefined(this._pagesChooserWidth) ? this._pagesChooserWidth : 0,
            pagesSizeChooserWidth = typeUtils.isDefined(this._pagesSizeChooserWidth) ? this._pagesSizeChooserWidth : 0;

        return pagesChooserWidth + pagesSizeChooserWidth;
    },

    _updatePagesChooserWidth: commonUtils.deferUpdater(function() {
        var lastPageWidth = this._pages && this._pages.length > 0 ? this._pages[this._pages.length - 1]._$page.width() : 0;
        this._pagesChooserWidth = this._$pagesChooser.width() + lastPageWidth;
    }),

    _updateLightMode: commonUtils.deferUpdater(function() {
        var that = this,
            width = this.$element().width(),
            infoWidth = typeUtils.isDefined(this._infoWidth) ? this._infoWidth : 0;

        commonUtils.deferRender(function() {
            if(that._isInfoHide && width > that._getMinPagerWidth() + infoWidth) {
                that._$info.show();
                that._updatePagesChooserWidth();
                that._isInfoHide = false;
            }

            if(!that._isInfoHide && width > that._getMinPagerWidth() - infoWidth && width < that._getMinPagerWidth()) {
                that._$info.hide();
                that._updatePagesChooserWidth();
                that._isInfoHide = true;
            }
            commonUtils.deferUpdate(function() {
                commonUtils.deferRender(function() {
                    if(that.option('lightModeEnabled') && width > that._previousWidth) {
                        that.option('lightModeEnabled', false);
                    } else {
                        if(width < that._getMinPagerWidth()) {
                            that.option('lightModeEnabled', true);
                        }
                    }
                    that._previousWidth = width;
                });

            });
        });
    }),

    _dimensionChanged: function() {
        this._updateLightMode();
    },

    getHeight: function() {
        return this.option('visible') ? this.$element().outerHeight() : 0;
    }
});

module.exports = Pager;

registerComponent('dxPager', Pager);
