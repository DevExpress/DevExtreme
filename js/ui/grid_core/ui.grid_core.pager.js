import modules from './ui.grid_core.modules';
import Pager from '../pager';
import { inArray } from '../../core/utils/array';
import { isDefined } from '../../core/utils/type';
import { hasWindow } from '../../core/utils/window';

const PAGER_CLASS = 'pager';
const MAX_PAGES_COUNT = 10;

const getPageIndex = function(dataController) {
    return 1 + (parseInt(dataController.pageIndex()) || 0);
};

const PagerView = modules.View.inherit({
    init: function() {
        const dataController = this.getController('data');

        dataController.changed.add((e) => {
            if(e && e.repaintChangesOnly) {
                const pager = this._getPager();
                if(pager) {
                    pager.option({
                        pageIndex: getPageIndex(dataController),
                        pageSize: dataController.pageSize(),
                        pageCount: dataController.pageCount(),
                        totalCount: dataController.totalCount(),
                        hasKnownLastPage: dataController.hasKnownLastPage()
                    });
                } else {
                    this.render();
                }
            } else if(!e || e.changeType !== 'update' && e.changeType !== 'updateSelection') {
                this.render();
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
            pageIndex: getPageIndex(dataController),
            pageCount: dataController.pageCount(),
            pageSize: dataController.pageSize(),
            showPageSizes: pagerOptions.showPageSizeSelector,
            showInfo: pagerOptions.showInfo,
            displayMode: pagerOptions.displayMode,
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
        const dataController = this.getController('data');
        const pagerOptions = this.option('pager');
        let pagerVisible = pagerOptions && pagerOptions.visible;
        const scrolling = this.option('scrolling');

        if(pagerVisible === 'auto') {
            if(scrolling && (scrolling.mode === 'virtual' || scrolling.mode === 'infinite')) {
                pagerVisible = false;
            } else {
                pagerVisible = dataController.pageCount() > 1 || (dataController.isLoaded() && !dataController.hasKnownLastPage());
            }
        }
        return pagerVisible;
    },

    getHeight: function() {
        return this.getElementHeight();
    },

    optionChanged: function(args) {
        const name = args.name;
        const isPager = name === 'pager';
        const isPaging = name === 'paging';
        const isDataSource = name === 'dataSource';
        const isScrolling = name === 'scrolling';
        const dataController = this.getController('data');

        if(isPager || isPaging || isScrolling || isDataSource) {
            args.handled = true;

            if(dataController.skipProcessingPagingChange(args.fullName)) {
                return;
            }

            if(isPager || isPaging) {
                this._pageSizes = null;
            }

            if(!isDataSource) {
                this._invalidate();
                if(hasWindow() && isPager && this.component) {
                    this.component.resize();
                }
            }
        }
    }
});

export default {
    defaultOptions: function() {
        return {
            pager: {
                /**
                 * @name GridBaseOptions.pager.visible
                 * @type boolean|Enums.Mode
                 * @default "auto"
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
                 * @type Array<number>|Enums.Mode
                 * @default "auto"
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
                /**
                 * name GridBaseOptions.pager.displayMode
                 * type Enums.GridPagerDisplayMode
                */
            }
        };
    },
    views: {
        pagerView: PagerView
    }
};
