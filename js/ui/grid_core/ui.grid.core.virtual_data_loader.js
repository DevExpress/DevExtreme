import { Deferred, when } from '../../core/utils/deferred';
import { isObject, isString } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';


const NEW_SCROLLING_MODE = 'scrolling.newMode';


const needTwoPagesLoading = (that) => that.option('scrolling.loadTwoPagesOnStart') || that._controller.isVirtual() || that._controller.getViewportItemIndex() > 0;

const getBeginPageIndex = (that) => {
    return that._cache.length ? that._cache[0].pageIndex : -1;
};

const getEndPageIndex = (that) => {
    return that._cache.length ? that._cache[that._cache.length - 1].pageIndex : -1;
};

const fireChanged = (that, changed, args) => {
    that._isChangedFiring = true;
    changed(args);
    that._isChangedFiring = false;
};

const processDelayChanged = (that, changed, args) => {
    if(that._isDelayChanged) {
        that._isDelayChanged = false;
        fireChanged(that, changed, args);
        return true;
    }
};

const getViewportPageCount = (that) => {
    const pageSize = that._dataOptions.pageSize();
    const preventPreload = that.option('scrolling.preventPreload');

    if(preventPreload) {
        return 0;
    }

    let realViewportSize = that._controller.viewportSize();

    if(that._controller.isVirtualMode() && that.option('scrolling.removeInvisiblePages')) {
        realViewportSize = 0;

        const viewportSize = that._controller.viewportSize() * that._controller.viewportItemSize();

        let offset = that._controller.getContentOffset();
        const position = that._controller.getViewportPosition();

        const virtualItemsCount = that._controller.virtualItemsCount();
        const totalItemsCount = that._dataOptions.totalItemsCount();

        for(let itemIndex = virtualItemsCount.begin; itemIndex < totalItemsCount; itemIndex++) {
            if(offset >= position + viewportSize) break;

            const itemSize = that._controller.getItemSizes()[itemIndex] || that._controller.viewportItemSize();
            offset += itemSize;
            if(offset >= position) {
                realViewportSize++;
            }
        }
    }

    return (pageSize && realViewportSize > 0) ? Math.ceil(realViewportSize / pageSize) : 1;
};

const getPreloadPageCount = (that, previous) => {
    const preloadEnabled = that.option('scrolling.preloadEnabled');
    let pageCount = getViewportPageCount(that);
    const isAppendMode = that._controller.isAppendMode();

    if(pageCount) {
        if(previous) {
            pageCount = preloadEnabled ? 1 : 0;
        } else {
            if(preloadEnabled) {
                pageCount++;
            }

            if(isAppendMode || !needTwoPagesLoading(that)) {
                pageCount--;
            }
        }
    }

    return pageCount;
};

const getPageIndexForLoad = (that) => {
    let result = -1;
    const beginPageIndex = getBeginPageIndex(that);
    const dataOptions = that._dataOptions;

    if(beginPageIndex < 0) {
        result = that._pageIndex;
    } else if(!that._cache[that._pageIndex - beginPageIndex]) {
        result = that._pageIndex;
    } else if(beginPageIndex >= 0 && that._controller.viewportSize() >= 0) {
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

const loadCore = (that, pageIndex) => {
    const dataOptions = that._dataOptions;

    if(pageIndex === that.pageIndex() || (!dataOptions.isLoading() && pageIndex < dataOptions.pageCount() || (!dataOptions.hasKnownLastPage() && pageIndex === dataOptions.pageCount()))) {
        dataOptions.pageIndex(pageIndex);

        that._loadingPageIndexes[pageIndex] = true;
        return when(dataOptions.load()).always(() => {
            that._loadingPageIndexes[pageIndex] = false;
        });
    }
};

const processChanged = (that, changed, changeType, isDelayChanged, removeCacheItem) => {
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


export class VirtualDataLoader {
    constructor(controller, dataOptions) {
        this._controller = controller;
        this._dataOptions = dataOptions;
        this._pageIndex = this._lastPageIndex = dataOptions.pageIndex();
        this._cache = [];
        this._loadingPageIndexes = {};
    }

    option() {
        return this._controller.option.apply(this._controller, arguments);
    }

    viewportItemIndexChanged(itemIndex) {
        const pageSize = this._dataOptions.pageSize();
        const pageCount = this._dataOptions.pageCount();
        const virtualMode = this._controller.isVirtualMode();
        const appendMode = this._controller.isAppendMode();
        const totalItemsCount = this._dataOptions.totalItemsCount();
        let newPageIndex;

        if(pageSize && (virtualMode || appendMode) && totalItemsCount >= 0) {
            const viewportSize = this._controller.viewportSize();
            if(viewportSize && (itemIndex + viewportSize) >= totalItemsCount && !this._controller.isVirtual()) {
                if(this._dataOptions.hasKnownLastPage()) {
                    newPageIndex = pageCount - 1;
                    const lastPageSize = totalItemsCount % pageSize;
                    if(newPageIndex > 0 && lastPageSize > 0 && lastPageSize < viewportSize) {
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
    }

    pageIndex(pageIndex) {
        const isVirtualMode = this._controller.isVirtualMode();
        const isAppendMode = this._controller.isAppendMode();

        if(!this.option(NEW_SCROLLING_MODE) && (isVirtualMode || isAppendMode)) {
            if(pageIndex !== undefined) {
                this._pageIndex = pageIndex;
            }
            return this._pageIndex;
        } else {
            return this._dataOptions.pageIndex(pageIndex);
        }
    }

    beginPageIndex(defaultPageIndex) {
        let beginPageIndex = getBeginPageIndex(this);
        if(beginPageIndex < 0) {
            beginPageIndex = defaultPageIndex !== undefined ? defaultPageIndex : this.pageIndex();
        }
        return beginPageIndex;
    }

    endPageIndex() {
        const endPageIndex = getEndPageIndex(this);
        return endPageIndex > 0 ? endPageIndex : this._lastPageIndex;
    }

    pageSize() {
        return this._dataOptions.pageSize();
    }

    load() {
        const dataOptions = this._dataOptions;
        let result;
        const isVirtualMode = this._controller.isVirtualMode();
        const isAppendMode = this._controller.isAppendMode();

        if(!this.option(NEW_SCROLLING_MODE) && (isVirtualMode || isAppendMode)) {
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
    }

    loadIfNeed() {
        const isVirtualMode = this._controller.isVirtualMode();
        const isAppendMode = this._controller.isAppendMode();

        if((isVirtualMode || isAppendMode) && !this._dataOptions.isLoading() && (!this._isChangedFiring || this._controller.isVirtual())) {
            const position = this._controller.getViewportPosition();
            if(position > 0) {
                this._controller._setViewportPositionCore(position);
            } else {
                this.load();
            }
        }
    }

    handleDataChanged(callBase, e) {
        const dataOptions = this._dataOptions;
        let lastCacheLength = this._cache.length;
        let changeType;
        let removeInvisiblePages;
        const isVirtualMode = this._controller.isVirtualMode();
        const isAppendMode = this._controller.isAppendMode();

        if(e && e.changes) {
            fireChanged(this, callBase, e);
        } else if(!this.option(NEW_SCROLLING_MODE) && (isVirtualMode || isAppendMode)) {
            const beginPageIndex = getBeginPageIndex(this);
            if(beginPageIndex >= 0) {
                if(isVirtualMode && beginPageIndex + this._cache.length !== dataOptions.pageIndex() && beginPageIndex - 1 !== dataOptions.pageIndex()) {
                    lastCacheLength = 0;
                    this._cache = [];
                }
                if(isAppendMode) {
                    if(dataOptions.pageIndex() === 0) {
                        this._cache = [];
                    } else if(dataOptions.pageIndex() < getEndPageIndex(this)) {
                        fireChanged(this, callBase, { changeType: 'append', items: [] });
                        return;
                    }
                }
            }

            const cacheItem = { pageIndex: dataOptions.pageIndex(), itemsLength: dataOptions.items(true).length, itemsCount: this.itemsCount(true) };

            if(this.option('scrolling.removeInvisiblePages') && isVirtualMode) {
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

            const isDelayChanged = isVirtualMode && lastCacheLength === 0 && needTwoPagesLoading(this);
            processChanged(this, callBase, this._cache.length > 1 ? changeType : undefined, isDelayChanged, removeCacheItem);
            this._delayDeferred = this.load().done(() => {
                if(processDelayChanged(this, callBase)) {
                    this.load(); // needed for infinite scrolling when height is not defined
                }
            });
        } else {
            processChanged(this, callBase, e);
        }
    }

    getDelayDeferred() {
        return this._delayDeferred;
    }

    itemsCount(isBase) {
        let itemsCount = 0;
        const isVirtualMode = this._controller.isVirtualMode();

        if(!isBase && isVirtualMode) {
            each(this._cache, function() {
                itemsCount += this.itemsCount;
            });
        } else {
            itemsCount = this._dataOptions.itemsCount();
        }
        return itemsCount;
    }

    virtualItemsCount() {
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

    reset() {
        this._loadingPageIndexes = {};
        this._cache = [];
    }
}
