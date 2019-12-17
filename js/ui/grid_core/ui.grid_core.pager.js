import modules from './ui.grid_core.modules';
import Pager from '../pager';
import { inArray } from '../../core/utils/array';
import { isDefined } from '../../core/utils/type';
import { hasWindow } from '../../core/utils/window';

const PAGER_CLASS = 'pager';
const MAX_PAGES_COUNT = 10;

const PagerView = modules.View.inherit({
    init: function() {
        const that = this;
        const dataController = that.getController('data');

        that._isVisible = false;

        dataController.changed.add(function(e) {
            if(e && e.repaintChangesOnly) {
                const pager = that._getPager();
                if(pager) {
                    pager.option({
                        pageCount: dataController.pageCount(),
                        totalCount: dataController.totalCount(),
                        hasKnownLastPage: dataController.hasKnownLastPage()
                    });
                } else {
                    that.render();
                }
            } else if(!e || e.changeType !== 'update' && e.changeType !== 'updateSelection') {
                that.render();
            }
        });
    },

    _getPager: function() {
        const $element = this.element();
        return $element && $element.data('dxPager');
    },

    _renderCore: function() {
        const that = this;
        const $element = that.element().addClass(that.addWidgetPrefix(PAGER_CLASS));
        const pagerOptions = that.option('pager') || {};
        const dataController = that.getController('data');
        const keyboardController = that.getController('keyboardNavigation');
        const options = {
            maxPagesCount: MAX_PAGES_COUNT,
            pageIndex: 1 + (parseInt(dataController.pageIndex()) || 0),
            pageCount: dataController.pageCount(),
            pageSize: dataController.pageSize(),
            showPageSizes: pagerOptions.showPageSizeSelector,
            showInfo: pagerOptions.showInfo,
            pagesNavigatorVisible: pagerOptions.visible,
            showNavigationButtons: pagerOptions.showNavigationButtons,
            pageSizes: that.getPageSizes(),
            totalCount: dataController.totalCount(),
            hasKnownLastPage: dataController.hasKnownLastPage(),
            pageIndexChanged: function(pageIndex) {
                if(dataController.pageIndex() !== pageIndex - 1) {
                    setTimeout(function() {
                        dataController.pageIndex(pageIndex - 1);
                    });
                }
            },
            pageSizeChanged: function(pageSize) {
                setTimeout(function() {
                    dataController.pageSize(pageSize);
                });
            },
            onKeyDown: e => keyboardController && keyboardController.executeAction('onKeyDown', e),
            useLegacyKeyboardNavigation: this.option('useLegacyKeyboardNavigation'),
            useKeyboard: this.option('keyboardNavigation.enabled')
        };

        if(isDefined(pagerOptions.infoText)) {
            options.infoText = pagerOptions.infoText;
        }

        that._createComponent($element, Pager, options);
    },

    getPageSizes: function() {
        const that = this;
        const dataController = that.getController('data');
        const pagerOptions = that.option('pager');
        const allowedPageSizes = pagerOptions && pagerOptions.allowedPageSizes;
        const pageSize = dataController.pageSize();

        if(!isDefined(that._pageSizes) || inArray(pageSize, that._pageSizes) === -1) {
            that._pageSizes = [];
            if(pagerOptions) {
                if(Array.isArray(allowedPageSizes)) {
                    that._pageSizes = allowedPageSizes;
                } else if(allowedPageSizes && pageSize > 1) {
                    that._pageSizes = [Math.floor(pageSize / 2), pageSize, pageSize * 2];
                }
            }
        }
        return that._pageSizes;
    },

    isVisible: function() {
        const that = this;
        const dataController = that.getController('data');
        const pagerOptions = that.option('pager');
        let pagerVisible = pagerOptions && pagerOptions.visible;
        const scrolling = that.option('scrolling');

        if(that._isVisible) {
            return true;
        }
        if(pagerVisible === 'auto') {
            if(scrolling && (scrolling.mode === 'virtual' || scrolling.mode === 'infinite')) {
                pagerVisible = false;
            } else {
                pagerVisible = dataController.pageCount() > 1 || (dataController.isLoaded() && !dataController.hasKnownLastPage());
            }
        }
        that._isVisible = pagerVisible;
        return pagerVisible;
    },

    getHeight: function() {
        return this.getElementHeight();
    },

    optionChanged: function(args) {
        const that = this;
        const name = args.name;
        const isPager = name === 'pager';
        const isPaging = name === 'paging';
        const isDataSource = name === 'dataSource';
        const isScrolling = name === 'scrolling';
        const dataController = that.getController('data');

        if(isPager || isPaging || isScrolling || isDataSource) {
            args.handled = true;

            if(dataController.skipProcessingPagingChange(args.fullName)) {
                return;
            }

            if(isPager || isPaging) {
                that._pageSizes = null;
            }
            if(isPager || isPaging || isScrolling) {
                that._isVisible = false;
            }

            if(!isDataSource) {
                that._invalidate();
                if(hasWindow() && isPager && that.component) {
                    that.component.resize();
                }
            }
        }
    }
});

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions.pager
             * @type object
             */
            pager: {
                /**
                 * @name GridBaseOptions.pager.visible
                 * @type boolean
                 */
                visible: 'auto',
                /**
                 * @name GridBaseOptions.pager.showPageSizeSelector
                 * @type boolean
                 * @default false
                */
                showPageSizeSelector: false,
                /**
                 * @name GridBaseOptions.pager.allowedPageSizes
                 * @type Array<number>
                */
                allowedPageSizes: 'auto'
                /**
                 * @name GridBaseOptions.pager.showNavigationButtons
                 * @type boolean
                 * @default false
                 */
                /**
                 * @name GridBaseOptions.pager.showInfo
                 * @type boolean
                 * @default false
                 */
                /**
                 * @name GridBaseOptions.pager.infoText
                 * @type string
                 * @default "Page {0} of {1} ({2} items)"
                 */
            }
        };
    },
    views: {
        pagerView: PagerView
    }
};
