import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import browser from '../../core/utils/browser';
import { isObject, isString } from '../../core/utils/type';
import positionUtils from '../../animation/position';
import { each } from '../../core/utils/iterator';
import Class from '../../core/class';
import { Deferred, when } from '../../core/utils/deferred';
import Callbacks from '../../core/utils/callbacks';

const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const NEW_SCROLLING_MODE = 'scrolling.newMode';

const isVirtualMode = (that) => that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL || that._isVirtual;

const isAppendMode = (that) => that.option('scrolling.mode') === SCROLLING_MODE_INFINITE && !that._isVirtual;

const needTwoPagesLoading = (that) => that.option('scrolling.loadTwoPagesOnStart') || that._isVirtual || that._viewportItemIndex > 0;

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
    const getViewportPageCount = function(that) {
        const pageSize = that._dataOptions.pageSize();
        const preventPreload = that.option('scrolling.preventPreload');

        if(preventPreload) {
            return 0;
        }

        let realViewportSize = that._viewportSize;

        if(isVirtualMode(that) && that.option('scrolling.removeInvisiblePages')) {
            realViewportSize = 0;

            const viewportSize = that._viewportSize * that._viewportItemSize;

            let offset = that.getContentOffset();
            const position = that._position || 0;

            const virtualItemsCount = that.virtualItemsCount();
            const totalItemsCount = that._dataOptions.totalItemsCount();

            for(let itemIndex = virtualItemsCount.begin; itemIndex < totalItemsCount; itemIndex++) {
                if(offset >= position + viewportSize) break;

                const itemSize = that._itemSizes[itemIndex] || that._viewportItemSize;
                offset += itemSize;
                if(offset >= position) {
                    realViewportSize++;
                }
            }
        }

        return (pageSize && realViewportSize > 0) ? Math.ceil(realViewportSize / pageSize) : 1;
    };

    const getPreloadPageCount = function(that, previous) {
        const preloadEnabled = that.option('scrolling.preloadEnabled');
        let pageCount = getViewportPageCount(that);

        if(pageCount) {
            if(previous) {
                pageCount = preloadEnabled ? 1 : 0;
            } else {
                if(preloadEnabled) {
                    pageCount++;
                }

                if(isAppendMode(that) || !needTwoPagesLoading(that)) {
                    pageCount--;
                }
            }
        }

        return pageCount;
    };

    const getPageIndexForLoad = function(that) {
        let result = -1;
        const beginPageIndex = getBeginPageIndex(that);
        const dataOptions = that._dataOptions;

        if(beginPageIndex < 0) {
            result = that._pageIndex;
        } else if(!that._cache[that._pageIndex - beginPageIndex]) {
            result = that._pageIndex;
        } else if(beginPageIndex >= 0 && that._viewportSize >= 0) {
            if(beginPageIndex > 0) {
                const needToLoadPageBeforeLast = getEndPageIndex(that) + 1 === dataOptions.pageCount() && that._cache.length < getPreloadPageCount(that) + 1;
                const needToLoadPrevPage = needToLoadPageBeforeLast || that._pageIndex === beginPageIndex && getPreloadPageCount(that, true);

                if(needToLoadPrevPage) {
                    result = beginPageIndex - 1;
                }
            }

            if(result < 0) {
                const needToLoadNextPage = beginPageIndex + that._cache.length <= that._pageIndex + getPreloadPageCount(that);

                if(needToLoadNextPage) {
                    result = beginPageIndex + that._cache.length;
                }
            }
        }

        if(that._loadingPageIndexes[result]) {
            result = -1;
        }

        return result;
    };

    function getBeginPageIndex(that) {
        return that._cache.length ? that._cache[0].pageIndex : -1;
    }

    function getEndPageIndex(that) {
        return that._cache.length ? that._cache[that._cache.length - 1].pageIndex : -1;
    }

    const fireChanged = function(that, changed, args) {
        that._isChangedFiring = true;
        changed(args);
        that._isChangedFiring = false;
    };

    const processDelayChanged = function(that, changed, args) {
        if(that._isDelayChanged) {
            that._isDelayChanged = false;
            fireChanged(that, changed, args);
            return true;
        }
    };

    const processChanged = function(that, changed, changeType, isDelayChanged, removeCacheItem) {
        const dataOptions = that._dataOptions;
        const items = dataOptions.items().slice();
        let change = isObject(changeType) ? changeType : undefined;
        const isPrepend = changeType === 'prepend';
        const viewportItems = dataOptions.viewportItems();

        if(changeType && isString(changeType) && !that._isDelayChanged) {
            change = {
                changeType: changeType,
                items: items
            };
            if(removeCacheItem) {
                change.removeCount = removeCacheItem.itemsCount;
                if(change.removeCount && dataOptions.correctCount) {
                    change.removeCount = dataOptions.correctCount(viewportItems, change.removeCount, isPrepend);
                }
            }
        }
        let removeItemCount = removeCacheItem ? removeCacheItem.itemsLength : 0;

        if(removeItemCount && dataOptions.correctCount) {
            removeItemCount = dataOptions.correctCount(viewportItems, removeItemCount, isPrepend);
        }

        if(changeType === 'append') {
            viewportItems.push.apply(viewportItems, items);
            if(removeCacheItem) {
                viewportItems.splice(0, removeItemCount);
            }
        } else if(isPrepend) {
            viewportItems.unshift.apply(viewportItems, items);
            if(removeCacheItem) {
                viewportItems.splice(-removeItemCount);
            }
        } else {
            that._dataOptions.viewportItems(items);
        }
        dataOptions.updateLoading();
        that._lastPageIndex = that.pageIndex();
        that._isDelayChanged = isDelayChanged;

        if(!isDelayChanged) {
            fireChanged(that, changed, change);
        }
    };

    const loadCore = function(that, pageIndex) {
        const dataOptions = that._dataOptions;

        if(pageIndex === that.pageIndex() || (!dataOptions.isLoading() && pageIndex < dataOptions.pageCount() || (!dataOptions.hasKnownLastPage() && pageIndex === dataOptions.pageCount()))) {
            dataOptions.pageIndex(pageIndex);

            that._loadingPageIndexes[pageIndex] = true;
            return when(dataOptions.load()).always(function() {
                that._loadingPageIndexes[pageIndex] = false;
            });
        }
    };

    return {
        ctor: function(component, dataOptions, isVirtual) {
            this._dataOptions = dataOptions;
            this.component = component;
            this._pageIndex = this._lastPageIndex = dataOptions.pageIndex();

            this._viewportSize = 0;
            this._viewportItemSize = 20;
            this._viewportItemIndex = 0;
            this._contentSize = 0;
            this._itemSizes = {};
            this._sizeRatio = 1;
            this._cache = [];
            this._isVirtual = isVirtual;
            this._loadingPageIndexes = {};
            this.positionChanged = Callbacks();
        },

        getItemSizes: function() {
            return this._itemSizes;
        },

        option: function() {
            return this.component.option.apply(this.component, arguments);
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

                let pageIndex = getBeginPageIndex(this);
                if(pageIndex < 0) {
                    pageIndex = this._dataOptions.pageIndex();
                }
                const beginItemsCount = pageIndex * this._dataOptions.pageSize();
                const itemsCount = this._cache.length * this._dataOptions.pageSize();
                const endItemsCount = Math.max(0, this._dataOptions.totalItemsCount() - itemsCount - beginItemsCount);
                return {
                    begin: beginItemsCount,
                    end: endItemsCount
                };
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

            const pageSize = this._dataOptions.pageSize();
            const pageCount = this._dataOptions.pageCount();
            const virtualMode = isVirtualMode(this);
            const appendMode = isAppendMode(this);
            const totalItemsCount = this._dataOptions.totalItemsCount();
            let newPageIndex;

            if(pageSize && (virtualMode || appendMode) && totalItemsCount >= 0) {
                if(this._viewportSize && (itemIndex + this._viewportSize) >= totalItemsCount && !this._isVirtual) {
                    if(this._dataOptions.hasKnownLastPage()) {
                        newPageIndex = pageCount - 1;
                        const lastPageSize = totalItemsCount % pageSize;
                        if(newPageIndex > 0 && lastPageSize > 0 && lastPageSize < this._viewportSize) {
                            newPageIndex--;
                        }
                    } else {
                        newPageIndex = pageCount;
                    }
                } else {
                    newPageIndex = Math.floor(itemIndex / pageSize);
                    const maxPageIndex = pageCount - 1;
                    newPageIndex = Math.max(newPageIndex, 0);
                    newPageIndex = Math.min(newPageIndex, maxPageIndex);
                }

                this.pageIndex(newPageIndex);
                return this.load();
            }
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
        pageIndex: function(pageIndex) {
            if(!this.option(NEW_SCROLLING_MODE) && (isVirtualMode(this) || isAppendMode(this))) {
                if(pageIndex !== undefined) {
                    this._pageIndex = pageIndex;
                }
                return this._pageIndex;
            } else {
                return this._dataOptions.pageIndex(pageIndex);
            }
        },
        beginPageIndex: function(defaultPageIndex) {
            let beginPageIndex = getBeginPageIndex(this);
            if(beginPageIndex < 0) {
                beginPageIndex = defaultPageIndex !== undefined ? defaultPageIndex : this.pageIndex();
            }
            return beginPageIndex;
        },
        endPageIndex: function() {
            const endPageIndex = getEndPageIndex(this);
            return endPageIndex > 0 ? endPageIndex : this._lastPageIndex;
        },
        pageSize: function() {
            return this._dataOptions.pageSize();
        },
        load: function() {
            const dataOptions = this._dataOptions;
            let result;

            if(!this.option(NEW_SCROLLING_MODE) && (isVirtualMode(this) || isAppendMode(this))) {
                const pageIndexForLoad = getPageIndexForLoad(this);

                if(pageIndexForLoad >= 0) {
                    const loadResult = loadCore(this, pageIndexForLoad);
                    if(loadResult) {
                        result = new Deferred();
                        loadResult.done(() => {
                            const delayDeferred = this._delayDeferred;
                            if(delayDeferred) {
                                delayDeferred.done(result.resolve).fail(result.reject);
                            } else {
                                result.resolve();
                            }
                        }).fail(result.reject);
                        dataOptions.updateLoading();
                    }
                }
            } else {
                result = dataOptions.load();
            }

            if(!result && this._lastPageIndex !== this.pageIndex()) {
                this._dataOptions.onChanged({
                    changeType: 'pageIndex'
                });
            }

            return result || new Deferred().resolve();
        },
        loadIfNeed: function() {
            if((isVirtualMode(this) || isAppendMode(this)) && !this._dataOptions.isLoading() && (!this._isChangedFiring || this._isVirtual)) {
                const position = this.getViewportPosition();
                if(position > 0) {
                    this._setViewportPositionCore(position);
                } else {
                    this.load();
                }
            }
        },
        handleDataChanged: function(callBase, e) {
            const dataOptions = this._dataOptions;
            let lastCacheLength = this._cache.length;
            let changeType;
            let removeInvisiblePages;

            if(e && e.changes) {
                fireChanged(this, callBase, e);
            } else if(!this.option(NEW_SCROLLING_MODE) && (isVirtualMode(this) || isAppendMode(this))) {
                const beginPageIndex = getBeginPageIndex(this);
                if(beginPageIndex >= 0) {
                    if(isVirtualMode(this) && beginPageIndex + this._cache.length !== dataOptions.pageIndex() && beginPageIndex - 1 !== dataOptions.pageIndex()) {
                        lastCacheLength = 0;
                        this._cache = [];
                    }
                    if(isAppendMode(this)) {
                        if(dataOptions.pageIndex() === 0) {
                            this._cache = [];
                        } else if(dataOptions.pageIndex() < getEndPageIndex(this)) {
                            fireChanged(this, callBase, { changeType: 'append', items: [] });
                            return;
                        }
                    }
                }

                const cacheItem = { pageIndex: dataOptions.pageIndex(), itemsLength: dataOptions.items(true).length, itemsCount: this.itemsCount(true) };

                if(this.option('scrolling.removeInvisiblePages') && isVirtualMode(this)) {
                    removeInvisiblePages = this._cache.length > Math.max(getPreloadPageCount(this) + (this.option('scrolling.preloadEnabled') ? 1 : 0), 2);
                } else {
                    processDelayChanged(this, callBase, { isDelayed: true });
                }

                let removeCacheItem;
                if(beginPageIndex === dataOptions.pageIndex() + 1) {
                    if(removeInvisiblePages) {
                        removeCacheItem = this._cache.pop();
                    }
                    changeType = 'prepend';
                    this._cache.unshift(cacheItem);
                } else {
                    if(removeInvisiblePages) {
                        removeCacheItem = this._cache.shift();
                    }
                    changeType = 'append';
                    this._cache.push(cacheItem);
                }

                const isDelayChanged = isVirtualMode(this) && lastCacheLength === 0 && needTwoPagesLoading(this);
                processChanged(this, callBase, this._cache.length > 1 ? changeType : undefined, isDelayChanged, removeCacheItem);
                this._delayDeferred = this.load().done(() => {
                    if(processDelayChanged(this, callBase)) {
                        this.load(); // needed for infinite scrolling when height is not defined
                    }
                });
            } else {
                processChanged(this, callBase, e);
            }
        },
        itemsCount: function(isBase) {
            let itemsCount = 0;

            if(!isBase && isVirtualMode(this)) {
                each(this._cache, function() {
                    itemsCount += this.itemsCount;
                });
            } else {
                itemsCount = this._dataOptions.itemsCount();
            }
            return itemsCount;
        },

        reset: function(isRefresh) {
            this._loadingPageIndexes = {};
            this._cache = [];
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

        // new mode
        getViewportParams: function() {
            const skip = Math.floor(this._viewportItemIndex);
            let take = this._viewportSize + 1;
            if(isVirtualMode(this)) {
                const remainedItems = this._dataOptions.totalItemsCount() - skip;
                take = Math.min(take, remainedItems);
            }

            return {
                skip,
                take
            };
        }
    };
})());
