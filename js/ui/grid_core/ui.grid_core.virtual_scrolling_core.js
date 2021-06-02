import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import browser from '../../core/utils/browser';
import positionUtils from '../../animation/position';
import { each } from '../../core/utils/iterator';
import Class from '../../core/class';
import { Deferred } from '../../core/utils/deferred';
import Callbacks from '../../core/utils/callbacks';
import { VirtualDataLoader } from './ui.grid.core.virtual_data_loader';

const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const NEW_SCROLLING_MODE = 'scrolling.newMode';

const isVirtualMode = (that) => that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL || that._isVirtual;
const isAppendMode = (that) => that.option('scrolling.mode') === SCROLLING_MODE_INFINITE && !that._isVirtual;

export let getPixelRatio = (window) => window.devicePixelRatio || 1;

///#DEBUG
export function _setPixelRatioFn(value) {
    getPixelRatio = value;
}
///#ENDDEBUG

export function getContentHeightLimit(browser) {
    if(browser.msie) {
        return 4000000;
    } else if(browser.mozilla) {
        return 8000000;
    }

    return 15000000 / getPixelRatio(getWindow());
}

export function subscribeToExternalScrollers($element, scrollChangedHandler, $targetElement) {
    let $scrollElement;
    const scrollableArray = [];
    const scrollToArray = [];
    const disposeArray = [];
    $targetElement = $targetElement || $element;

    function getElementOffset(scrollable) {
        const $scrollableElement = scrollable.element ? scrollable.$element() : scrollable;
        const scrollableOffset = positionUtils.offset($scrollableElement);

        if(!scrollableOffset) {
            return $element.offset().top;
        }

        return scrollable.scrollTop() - (scrollableOffset.top - $element.offset().top);
    }

    function createWindowScrollHandler(scrollable) {
        return function() {
            let scrollTop = scrollable.scrollTop() - getElementOffset(scrollable);

            scrollTop = scrollTop > 0 ? scrollTop : 0;
            scrollChangedHandler(scrollTop);
        };
    }

    const widgetScrollStrategy = {
        on: function(scrollable, eventName, handler) {
            scrollable.on('scroll', handler);
        },
        off: function(scrollable, eventName, handler) {
            scrollable.off('scroll', handler);
        }
    };

    function subscribeToScrollEvents($scrollElement) {
        const isDocument = $scrollElement.get(0).nodeName === '#document';
        let scrollable = $scrollElement.data('dxScrollable');
        let eventsStrategy = widgetScrollStrategy;

        if(!scrollable) {
            scrollable = isDocument && $(getWindow()) || $scrollElement.css('overflowY') === 'auto' && $scrollElement;
            eventsStrategy = eventsEngine;
            if(!scrollable) return;
        }

        const handler = createWindowScrollHandler(scrollable);
        eventsStrategy.on(scrollable, 'scroll', handler);

        scrollToArray.push(function(pos) {
            const topOffset = getElementOffset(scrollable);
            const scrollMethod = scrollable.scrollTo ? 'scrollTo' : 'scrollTop';

            if(pos - topOffset >= 0) {
                scrollable[scrollMethod](pos + topOffset);
            }
        });

        scrollableArray.push(scrollable);

        disposeArray.push(function() {
            eventsStrategy.off(scrollable, 'scroll', handler);
        });
    }

    for($scrollElement = $targetElement.parent(); $scrollElement.length; $scrollElement = $scrollElement.parent()) {
        subscribeToScrollEvents($scrollElement);
    }

    return {
        scrollTo: function(pos) {
            each(scrollToArray, function(_, scrollTo) {
                scrollTo(pos);
            });
        },

        dispose: function() {
            each(disposeArray, function(_, dispose) {
                dispose();
            });
        }
    };
}

export const VirtualScrollController = Class.inherit((function() {
    const members = {
        ctor: function(component, dataOptions, isVirtual) {
            this._dataOptions = dataOptions;
            this.component = component;
            this._viewportSize = 0;
            this._viewportItemSize = 20;
            this._viewportItemIndex = 0;
            this._contentSize = 0;
            this._itemSizes = {};
            this._sizeRatio = 1;
            this._isVirtual = isVirtual;
            this.positionChanged = Callbacks();
            this._dataLoader = new VirtualDataLoader(this, this._dataOptions);
        },

        getItemSizes: function() {
            return this._itemSizes;
        },

        option: function() {
            return this.component.option.apply(this.component, arguments);
        },

        isVirtual: function() {
            return this._isVirtual;
        },

        virtualItemsCount: function() {
            if(isVirtualMode(this)) {
                const totalItemsCount = this._dataOptions.totalItemsCount();
                if(this.option(NEW_SCROLLING_MODE) && totalItemsCount !== -1) {
                    const viewportParams = this.getViewportParams();
                    const endItemsCount = totalItemsCount - (viewportParams.skip + viewportParams.take);
                    return {
                        begin: viewportParams.skip,
                        end: endItemsCount
                    };
                }

                return this._dataLoader.virtualItemsCount.apply(this._dataLoader, arguments);
            }
        },

        setViewportPosition: function(position) {
            const result = new Deferred();
            let scrollingTimeout = Math.min(this.option('scrolling.timeout') || 0, this._dataOptions.changingDuration());

            if(scrollingTimeout < this.option('scrolling.renderingThreshold')) {
                scrollingTimeout = this.option('scrolling.minTimeout') || 0;
            }

            clearTimeout(this._scrollTimeoutID);
            if(scrollingTimeout > 0) {
                this._scrollTimeoutID = setTimeout(() => {
                    this._setViewportPositionCore(position);
                    result.resolve();
                }, scrollingTimeout);
            } else {
                this._setViewportPositionCore(position);
                result.resolve();
            }
            return result.promise();
        },

        getViewportPosition: function() {
            return this._position || 0;
        },

        getItemIndexByPosition: function() {
            const position = this._position;
            const defaultItemSize = this.getItemSize();
            let offset = 0;
            let itemOffset = 0;

            const itemOffsetsWithSize = Object.keys(this._itemSizes).concat(-1);
            for(let i = 0; i < itemOffsetsWithSize.length && offset < position; i++) {
                const itemOffsetWithSize = parseInt(itemOffsetsWithSize[i]);
                let itemOffsetDiff = (position - offset) / defaultItemSize;
                if(itemOffsetWithSize < 0 || itemOffset + itemOffsetDiff < itemOffsetWithSize) {
                    itemOffset += itemOffsetDiff;
                    break;
                } else {
                    itemOffsetDiff = itemOffsetWithSize - itemOffset;
                    offset += itemOffsetDiff * defaultItemSize;
                    itemOffset += itemOffsetDiff;
                }
                const itemSize = this._itemSizes[itemOffsetWithSize];
                offset += itemSize;
                itemOffset += offset < position ? 1 : (position - offset + itemSize) / itemSize;
            }
            return Math.round(itemOffset * 50) / 50;
        },

        _setViewportPositionCore: function(position) {
            this._position = position;

            const itemIndex = this.getItemIndexByPosition();
            const result = this.setViewportItemIndex(itemIndex);
            this.positionChanged.fire();
            return result;
        },

        setContentItemSizes: function(sizes) {
            const virtualItemsCount = this.virtualItemsCount();

            this._contentSize = sizes.reduce((a, b) => a + b, 0);

            if(virtualItemsCount) {
                sizes.forEach((size, index) => {
                    this._itemSizes[virtualItemsCount.begin + index] = size;
                });

                const virtualContentSize = (virtualItemsCount.begin + virtualItemsCount.end + this.itemsCount()) * this._viewportItemSize;
                const contentHeightLimit = getContentHeightLimit(browser);
                if(virtualContentSize > contentHeightLimit) {
                    this._sizeRatio = contentHeightLimit / virtualContentSize;
                } else {
                    this._sizeRatio = 1;
                }
            }
        },
        getItemSize: function() {
            return this._viewportItemSize * this._sizeRatio;
        },
        getItemOffset: function(itemIndex, isEnd) {
            const virtualItemsCount = this.virtualItemsCount();
            let itemCount = itemIndex;

            if(!virtualItemsCount) return 0;

            let offset = 0;
            const totalItemsCount = this._dataOptions.totalItemsCount();

            Object.keys(this._itemSizes).forEach(currentItemIndex => {
                if(!itemCount) return;
                if(isEnd ? (currentItemIndex >= totalItemsCount - itemIndex) : (currentItemIndex < itemIndex)) {
                    offset += this._itemSizes[currentItemIndex];
                    itemCount--;
                }
            });

            return Math.floor(offset + itemCount * this._viewportItemSize * this._sizeRatio);
        },
        getContentOffset: function(type) {
            const isEnd = type === 'end';
            const virtualItemsCount = this.virtualItemsCount();

            if(!virtualItemsCount) return 0;

            return this.getItemOffset(isEnd ? virtualItemsCount.end : virtualItemsCount.begin, isEnd);
        },
        getVirtualContentSize: function() {
            const virtualItemsCount = this.virtualItemsCount();

            return virtualItemsCount ? this.getContentOffset('begin') + this.getContentOffset('end') + this._contentSize : 0;
        },
        getViewportItemIndex: function() {
            return this._viewportItemIndex;
        },
        setViewportItemIndex: function(itemIndex) {
            this._viewportItemIndex = itemIndex;
            if(this.option(NEW_SCROLLING_MODE)) {
                return;
            }

            return this._dataLoader.viewportItemIndexChanged.apply(this._dataLoader, arguments);
        },
        viewportItemSize: function(size) {
            if(size !== undefined) {
                this._viewportItemSize = size;
            }
            return this._viewportItemSize;
        },
        viewportSize: function(size) {
            if(size !== undefined) {
                this._viewportSize = size;
            }
            return this._viewportSize;
        },

        reset: function(isRefresh) {
            this._dataLoader.reset();
            if(!isRefresh) {
                this._itemSizes = {};
            }
        },

        subscribeToWindowScrollEvents: function($element) {
            this._windowScroll = this._windowScroll || subscribeToExternalScrollers($element, (scrollTop) => {
                if(this.viewportItemSize()) {
                    this.setViewportPosition(scrollTop);
                }
            });
        },

        dispose: function() {
            clearTimeout(this._scrollTimeoutID);
            this._windowScroll && this._windowScroll.dispose();
            this._windowScroll = null;
        },

        scrollTo: function(pos) {
            this._windowScroll && this._windowScroll.scrollTo(pos);
        },

        isVirtualMode: function() {
            return isVirtualMode(this);
        },

        isAppendMode: function() {
            return isAppendMode(this);
        },

        // new mode
        getViewportParams: function() {
            const topIndex = this._viewportItemIndex;
            const bottomIndex = this._viewportSize + topIndex;
            const maxGap = this.pageSize();
            const minGap = this.option('scrolling.minGap');
            const virtualMode = this.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL;
            const skip = Math.floor(Math.max(0, topIndex - minGap) / maxGap) * maxGap;
            let take = Math.ceil((bottomIndex + minGap) / maxGap) * maxGap - skip;

            if(virtualMode) {
                const remainedItems = this._dataOptions.totalItemsCount() - skip;
                take = Math.min(take, remainedItems);
            }

            return {
                skip,
                take
            };
        }
    };

    [
        'pageIndex', 'beginPageIndex', 'endPageIndex',
        'pageSize', 'load', 'loadIfNeed', 'handleDataChanged',
        'itemsCount', 'getDelayDeferred'
    ].forEach(function(name) {
        members[name] = function() {
            return this._dataLoader[name].apply(this._dataLoader, arguments);
        };
    });

    return members;
})());
