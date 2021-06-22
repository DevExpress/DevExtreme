import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import { VirtualScrollController, subscribeToExternalScrollers } from './ui.grid_core.virtual_scrolling_core';
import gridCoreUtils from './ui.grid_core.utils';
import { each } from '../../core/utils/iterator';
import { Deferred } from '../../core/utils/deferred';
import LoadIndicator from '../load_indicator';
import browser from '../../core/utils/browser';
import { getBoundingRect } from '../../core/utils/position';
import { isDefined } from '../../core/utils/type';

const TABLE_CLASS = 'table';
const BOTTOM_LOAD_PANEL_CLASS = 'bottom-load-panel';
const TABLE_CONTENT_CLASS = 'table-content';
const GROUP_SPACE_CLASS = 'group-space';
const CONTENT_CLASS = 'content';
const ROW_CLASS = 'dx-row';
const FREESPACE_CLASS = 'dx-freespace-row';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const VIRTUAL_ROW_CLASS = 'dx-virtual-row';

const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const SCROLLING_MODE_STANDARD = 'standard';
const PIXELS_LIMIT = 250000; // this limit is defined for IE
const LOAD_TIMEOUT = 300;
const NEW_SCROLLING_MODE = 'scrolling.newMode';

const isVirtualMode = function(that) {
    return that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL;
};

const isAppendMode = function(that) {
    return that.option('scrolling.mode') === SCROLLING_MODE_INFINITE;
};

const isVirtualRowRendering = function(that) {
    const rowRenderingMode = that.option('scrolling.rowRenderingMode');
    if(rowRenderingMode === SCROLLING_MODE_VIRTUAL) {
        return true;
    } else if(rowRenderingMode === SCROLLING_MODE_STANDARD) {
        return false;
    }
};

const correctCount = function(items, count, fromEnd, isItemCountableFunc) {
    for(let i = 0; i < count + 1; i++) {
        const item = items[fromEnd ? items.length - 1 - i : i];
        if(item && !isItemCountableFunc(item, i === count, fromEnd)) {
            count++;
        }
    }
    return count;
};

const isItemCountableByDataSource = function(item, dataSource) {
    return item.rowType === 'data' && !item.isNewRow || item.rowType === 'group' && dataSource.isGroupItemCountable(item.data);
};

const updateItemIndices = function(items) {
    items.forEach(function(item, index) {
        item.rowIndex = index;
    });

    return items;
};


const VirtualScrollingDataSourceAdapterExtender = (function() {
    const updateLoading = function(that) {
        const beginPageIndex = that._virtualScrollController.beginPageIndex(-1);

        if(isVirtualMode(that)) {
            if(beginPageIndex < 0 || (that.viewportSize() >= 0 && that.getViewportItemIndex() >= 0 && (beginPageIndex * that.pageSize() > that.getViewportItemIndex() ||
                beginPageIndex * that.pageSize() + that.itemsCount() < that.getViewportItemIndex() + that.viewportSize())) && that._dataSource.isLoading()) {
                if(!that._isLoading) {
                    that._isLoading = true;
                    that.loadingChanged.fire(true);
                }
            } else {
                if(that._isLoading) {
                    that._isLoading = false;
                    that.loadingChanged.fire(false);
                }
            }
        }
    };

    const result = {
        init: function() {
            this.callBase.apply(this, arguments);
            this._items = [];
            this._isLoaded = true;
            this._loadPageCount = 1;

            this._virtualScrollController = new VirtualScrollController(this.component, this._getVirtualScrollDataOptions());
        },
        _getVirtualScrollDataOptions: function() {
            const that = this;
            return {
                pageSize: function() {
                    return that.pageSize();
                },
                totalItemsCount: function() {
                    return that.totalItemsCount();
                },
                hasKnownLastPage: function() {
                    return that.hasKnownLastPage();
                },
                pageIndex: function(index) {
                    return that._dataSource.pageIndex(index);
                },
                isLoading: function() {
                    return that._dataSource.isLoading() && !that.isCustomLoading();
                },
                pageCount: function() {
                    return that.pageCount();
                },
                load: function() {
                    return that._dataSource.load();
                },
                updateLoading: function() {
                    updateLoading(that);
                },
                itemsCount: function() {
                    return that.itemsCount(true);
                },
                items: function() {
                    return that._dataSource.items();
                },
                viewportItems: function(items) {
                    if(items) {
                        that._items = items;
                    }
                    return that._items;
                },
                onChanged: function(e) {
                    that.changed.fire(e);
                },
                changingDuration: function(e) {
                    if(that.isLoading()) {
                        return LOAD_TIMEOUT;
                    }

                    return that._renderTime || 0;
                }
            };
        },
        _handleLoadingChanged: function(isLoading) {
            if(this.option(NEW_SCROLLING_MODE)) {
                this.callBase.apply(this, arguments);
                return;
            }

            if(!isVirtualMode(this) || this._isLoadingAll) {
                this._isLoading = isLoading;
                this.callBase.apply(this, arguments);
            }

            if(isLoading) {
                this._startLoadTime = new Date();
            } else {
                this._startLoadTime = undefined;
            }
        },
        _handleLoadError: function() {
            if(!this.option(NEW_SCROLLING_MODE)) {
                this._isLoading = false;
                this.loadingChanged.fire(false);
            }

            this.callBase.apply(this, arguments);
        },
        _handleDataChanged: function(e) {
            if(this.option(NEW_SCROLLING_MODE)) {
                this.callBase.apply(this, arguments);
                return;
            }

            const callBase = this.callBase.bind(this);

            this._virtualScrollController.handleDataChanged(callBase, e);
        },
        _customizeRemoteOperations: function(options, operationTypes) {
            const newMode = this.option(NEW_SCROLLING_MODE);

            if((isVirtualMode(this) || (isAppendMode(this) && newMode)) && !operationTypes.reload && (operationTypes.skip || newMode) && this._renderTime < this.option('scrolling.renderingThreshold')) {
                options.delay = undefined;
            }

            this.callBase.apply(this, arguments);
        },
        items: function() {
            if(this.option(NEW_SCROLLING_MODE)) {
                return this._dataSource.items();
            }
            return this._items;
        },
        itemsCount: function(isBase) {
            if(isBase) {
                return this.callBase();
            }
            return this._virtualScrollController.itemsCount();
        },
        load: function(loadOptions) {
            if(this.option(NEW_SCROLLING_MODE) || loadOptions) {
                return this.callBase(loadOptions);
            }
            return this._virtualScrollController.load();
        },
        isLoading: function() {
            return this._isLoading;
        },
        isLoaded: function() {
            return this._dataSource.isLoaded() && this._isLoaded;
        },
        resetPagesCache: function(isLiveUpdate) {
            if(!isLiveUpdate) {
                this._virtualScrollController.reset(true);
            }
            this.callBase.apply(this, arguments);
        },
        _changeRowExpandCore: function() {
            const result = this.callBase.apply(this, arguments);

            if(this.option(NEW_SCROLLING_MODE)) {
                return result;
            }

            this.resetPagesCache();
            updateLoading(this);

            return result;
        },
        reload: function() {
            this._dataSource.pageIndex(this.pageIndex());
            const virtualScrollController = this._virtualScrollController;

            if(!this.option(NEW_SCROLLING_MODE) && virtualScrollController) {
                const d = new Deferred();
                this.callBase.apply(this, arguments).done(function(r) {
                    const delayDeferred = virtualScrollController.getDelayDeferred();
                    if(delayDeferred) {
                        delayDeferred.done(d.resolve).fail(d.reject);
                    } else {
                        d.resolve(r);
                    }
                }).fail(d.reject);
                return d;
            } else {
                return this.callBase.apply(this, arguments);
            }
        },
        refresh: function(options, operationTypes) {
            if(!this.option(NEW_SCROLLING_MODE)) {
                const storeLoadOptions = options.storeLoadOptions;
                const dataSource = this._dataSource;

                if(operationTypes.reload) {
                    this._virtualScrollController.reset();
                    dataSource.items().length = 0;
                    this._isLoaded = false;

                    updateLoading(this);
                    this._isLoaded = true;

                    if(isAppendMode(this)) {
                        this.pageIndex(0);
                        dataSource.pageIndex(0);
                        storeLoadOptions.pageIndex = 0;
                        options.pageIndex = 0;
                        storeLoadOptions.skip = 0;
                    } else {
                        dataSource.pageIndex(this.pageIndex());
                        if(dataSource.paginate()) {
                            options.pageIndex = this.pageIndex();
                            storeLoadOptions.skip = this.pageIndex() * this.pageSize();
                        }
                    }
                } else if(isAppendMode(this) && storeLoadOptions.skip && this._skipCorrection < 0) {
                    storeLoadOptions.skip += this._skipCorrection;
                }
            }
            return this.callBase.apply(this, arguments);
        },
        dispose: function() {
            this._virtualScrollController.dispose();
            this.callBase.apply(this, arguments);
        },
        loadPageCount: function(count) {
            if(!isDefined(count)) {
                return this._loadPageCount;
            }
            this._loadPageCount = count;
        },
        _handleDataLoading: function(options) {
            const loadPageCount = this.loadPageCount();

            options.loadPageCount = loadPageCount;
            if(this.option(NEW_SCROLLING_MODE) && loadPageCount > 1) {
                options.storeLoadOptions.take = loadPageCount * this.pageSize();
            }
            this.callBase.apply(this, arguments);
        },
        _loadPageSize: function() {
            return this.callBase.apply(this, arguments) * this.loadPageCount();
        }
    };

    [
        'beginPageIndex',
        'endPageIndex'
    ].forEach(function(name) {
        result[name] = function() {
            if(this.option(NEW_SCROLLING_MODE)) {
                const dataSource = this._dataSource;
                return dataSource.pageIndex.apply(dataSource, arguments);
            }

            const virtualScrollController = this._virtualScrollController;
            return virtualScrollController[name].apply(virtualScrollController, arguments);
        };
    });

    [
        'virtualItemsCount',
        'getContentOffset',
        'getVirtualContentSize',
        'setContentItemSizes', 'setViewportPosition',
        'getViewportItemIndex', 'setViewportItemIndex', 'getItemIndexByPosition',
        'viewportSize', 'viewportItemSize', 'getItemSize', 'getItemSizes',
        'pageIndex', 'loadIfNeed'
    ].forEach(function(name) {
        result[name] = function() {
            const virtualScrollController = this._virtualScrollController;
            return virtualScrollController[name].apply(virtualScrollController, arguments);
        };
    });

    return result;

})();

const VirtualScrollingRowsViewExtender = (function() {
    const removeEmptyRows = function($emptyRows, className) {
        const getRowParent = row => $(row).parent('.' + className).get(0);
        const tBodies = $emptyRows.toArray().map(getRowParent).filter(row => row);

        if(tBodies.length) {
            $emptyRows = $(tBodies);
        }

        const rowCount = className === FREESPACE_CLASS ? $emptyRows.length - 1 : $emptyRows.length;

        for(let i = 0; i < rowCount; i++) {
            $emptyRows.eq(i).remove();
        }
    };

    return {
        init: function() {
            const dataController = this.getController('data');

            this.callBase();

            dataController.pageChanged.add(() => {
                this.scrollToPage(dataController.pageIndex());
            });

            dataController.dataSourceChanged.add(() => {
                !this._scrollTop && this._scrollToCurrentPageOnResize();
            });

            dataController.stateLoaded?.add(() => {
                this._scrollToCurrentPageOnResize();
            });

            this._scrollToCurrentPageOnResize();
        },

        _scrollToCurrentPageOnResize: function() {
            const dataController = this.getController('data');

            if(dataController.pageIndex() > 0) {
                const resizeHandler = () => {
                    this.resizeCompleted.remove(resizeHandler);
                    this.scrollToPage(dataController.pageIndex());
                };
                this.resizeCompleted.add(resizeHandler);
            }
        },

        scrollToPage: function(pageIndex) {
            const that = this;
            const dataController = that._dataController;
            const pageSize = dataController ? dataController.pageSize() : 0;
            let scrollPosition;

            if(isVirtualMode(that) || isAppendMode(that)) {
                const itemSize = dataController.getItemSize();
                const itemSizes = dataController.getItemSizes();
                const itemIndex = pageIndex * pageSize;

                scrollPosition = itemIndex * itemSize;

                for(const index in itemSizes) {
                    if(index < itemIndex) {
                        scrollPosition += itemSizes[index] - itemSize;
                    }
                }
            } else {
                scrollPosition = 0;
            }

            that.scrollTo({ y: scrollPosition, x: that._scrollLeft });
        },

        renderDelayedTemplates: function(e) {
            this._updateContentPosition(true);
            this.callBase.apply(this, arguments);
        },

        _renderCore: function(e) {
            const that = this;
            const startRenderTime = new Date();

            that.callBase.apply(that, arguments);

            const dataSource = that._dataController._dataSource;

            if(dataSource && e) {
                const itemCount = e.items ? e.items.length : 20;
                const viewportSize = that._dataController.viewportSize() || 20;

                if(isVirtualRowRendering(that) && itemCount > 0) {
                    dataSource._renderTime = (new Date() - startRenderTime) * viewportSize / itemCount;
                } else {
                    dataSource._renderTime = (new Date() - startRenderTime);
                }
            }
        },

        _getRowElements: function(tableElement) {
            const $rows = this.callBase(tableElement);

            return $rows && $rows.not('.' + VIRTUAL_ROW_CLASS);
        },

        _removeRowsElements: function(contentTable, removeCount, changeType) {
            let rowElements = this._getRowElements(contentTable).toArray();
            if(changeType === 'append') {
                rowElements = rowElements.slice(0, removeCount);
            } else {
                rowElements = rowElements.slice(-removeCount);
            }

            const errorHandlingController = this.getController('errorHandling');
            rowElements.map(rowElement => {
                const $rowElement = $(rowElement);
                errorHandlingController && errorHandlingController.removeErrorRow($rowElement.next());
                $rowElement.remove();
            });
        },

        _restoreErrorRow: function(contentTable) {
            const editingController = this.getController('editing');
            editingController && editingController.hasChanges() && this._getRowElements(contentTable).each((_, item) => {
                const rowOptions = $(item).data('options');
                if(rowOptions) {
                    const change = editingController.getChangeByKey(rowOptions.key);
                    change && editingController._showErrorRow(change);
                }
            });
        },

        _updateContent: function(tableElement, change) {
            let $freeSpaceRowElements;
            const contentElement = this._findContentElement();
            const changeType = change && change.changeType;

            if(changeType === 'append' || changeType === 'prepend') {
                const contentTable = contentElement.children().first();
                const $tBodies = this._getBodies(tableElement);
                if($tBodies.length === 1) {
                    this._getBodies(contentTable)[changeType === 'append' ? 'append' : 'prepend']($tBodies.children());
                } else {
                    $tBodies[changeType === 'append' ? 'appendTo' : 'prependTo'](contentTable);
                }

                tableElement.remove();
                $freeSpaceRowElements = this._getFreeSpaceRowElements(contentTable);
                removeEmptyRows($freeSpaceRowElements, FREESPACE_CLASS);

                if(change.removeCount) {
                    this._removeRowsElements(contentTable, change.removeCount, changeType);
                }

                this._restoreErrorRow(contentTable);
            } else {
                this.callBase.apply(this, arguments);
            }

            this._updateBottomLoading();
        },
        _addVirtualRow: function($table, isFixed, location, position) {
            if(!position) return;

            let $virtualRow = this._createEmptyRow(VIRTUAL_ROW_CLASS, isFixed, position);

            $virtualRow = this._wrapRowIfNeed($table, $virtualRow);

            this._appendEmptyRow($table, $virtualRow, location);
        },
        _getRowHeights: function() {
            const rowHeights = this._getRowElements(this._tableElement).toArray().map(function(row) {
                return getBoundingRect(row).height;
            });
            return rowHeights;
        },
        _correctRowHeights: function(rowHeights) {
            const dataController = this._dataController;
            const dataSource = dataController._dataSource;
            const correctedRowHeights = [];
            const visibleRows = dataController.getVisibleRows();
            let itemSize = 0;
            let firstCountableItem = true;
            for(let i = 0; i < rowHeights.length; i++) {
                const currentItem = visibleRows[i];
                if(!isDefined(currentItem)) {
                    continue;
                }
                if(isItemCountableByDataSource(currentItem, dataSource)) {
                    if(firstCountableItem) {
                        firstCountableItem = false;
                    } else {
                        correctedRowHeights.push(itemSize);
                        itemSize = 0;
                    }
                }
                itemSize += rowHeights[i];
            }
            itemSize > 0 && correctedRowHeights.push(itemSize);
            return correctedRowHeights;
        },
        _updateContentPosition: function(isRender) {
            const dataController = this._dataController;
            const rowHeight = this._rowHeight || 20;

            dataController.viewportItemSize(rowHeight);

            if(isVirtualMode(this) || isVirtualRowRendering(this)) {
                if(!isRender) {
                    const rowHeights = this._getRowHeights();
                    const correctedRowHeights = this._correctRowHeights(rowHeights);
                    dataController.setContentItemSizes(correctedRowHeights);
                }
                const top = dataController.getContentOffset('begin');
                const bottom = dataController.getContentOffset('end');
                const $tables = this.getTableElements();
                const $virtualRows = $tables.children('tbody').children('.' + VIRTUAL_ROW_CLASS);

                removeEmptyRows($virtualRows, VIRTUAL_ROW_CLASS);

                $tables.each((index, element) => {
                    const isFixed = index > 0;
                    this._isFixedTableRendering = isFixed;
                    this._addVirtualRow($(element), isFixed, 'top', top);
                    this._addVirtualRow($(element), isFixed, 'bottom', bottom);
                    this._isFixedTableRendering = false;
                });
            }
        },

        _isTableLinesDisplaysCorrect: function(table) {
            const hasColumnLines = table.find('.' + COLUMN_LINES_CLASS).length > 0;
            return hasColumnLines === this.option('showColumnLines');
        },

        _isColumnElementsEqual: function($columns, $virtualColumns) {
            let result = $columns.length === $virtualColumns.length;

            if(result) {
                each($columns, function(index, element) {
                    if(element.style.width !== $virtualColumns[index].style.width) {
                        result = false;
                        return result;
                    }
                });
            }

            return result;
        },

        _renderVirtualTableContent: function(container, height) {
            const that = this;
            const columns = that._columnsController.getVisibleColumns();
            let html = that._createColGroup(columns).prop('outerHTML');
            let freeSpaceCellsHtml = '';
            const columnLinesClass = that.option('showColumnLines') ? COLUMN_LINES_CLASS : '';
            const createFreeSpaceRowHtml = function(height) {
                return '<tr style=\'height:' + height + 'px;\' class=\'' + FREESPACE_CLASS + ' ' + ROW_CLASS + ' ' + columnLinesClass + '\' >' + freeSpaceCellsHtml + '</tr>';
            };

            for(let i = 0; i < columns.length; i++) {
                const classes = that._getCellClasses(columns[i]);
                const classString = classes.length ? ' class=\'' + classes.join(' ') + '\'' : '';

                freeSpaceCellsHtml += '<td' + classString + '/>';
            }

            while(height > PIXELS_LIMIT) {
                html += createFreeSpaceRowHtml(PIXELS_LIMIT);
                height -= PIXELS_LIMIT;
            }
            html += createFreeSpaceRowHtml(height);

            container.addClass(that.addWidgetPrefix(TABLE_CLASS));
            container.html(html);
        },

        _getCellClasses: function(column) {
            const classes = [];
            const cssClass = column.cssClass;
            const isExpandColumn = column.command === 'expand';

            cssClass && classes.push(cssClass);
            isExpandColumn && classes.push(this.addWidgetPrefix(GROUP_SPACE_CLASS));

            return classes;
        },

        _findBottomLoadPanel: function($contentElement) {
            const $element = $contentElement || this.element();
            const $bottomLoadPanel = $element && $element.find('.' + this.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS));
            if($bottomLoadPanel && $bottomLoadPanel.length) {
                return $bottomLoadPanel;
            }
        },

        _updateBottomLoading: function() {
            const that = this;
            const virtualMode = isVirtualMode(this);
            const appendMode = isAppendMode(this);
            const showBottomLoading = !that._dataController.hasKnownLastPage() && that._dataController.isLoaded() && (virtualMode || appendMode);
            const $contentElement = that._findContentElement();
            const bottomLoadPanelElement = that._findBottomLoadPanel($contentElement);

            if(showBottomLoading) {
                if(!bottomLoadPanelElement) {
                    $('<div>')
                        .addClass(that.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS))
                        .append(that._createComponent($('<div>'), LoadIndicator).$element())
                        .appendTo($contentElement);
                }
            } else if(bottomLoadPanelElement) {
                bottomLoadPanelElement.remove();
            }
        },

        _handleScroll: function(e) {
            const that = this;

            if(that._hasHeight && that._rowHeight) {
                that._dataController.setViewportPosition(e.scrollOffset.top);
            }
            that.callBase.apply(that, arguments);
        },

        _needUpdateRowHeight: function(itemsCount) {
            const that = this;
            return that.callBase.apply(that, arguments) || (itemsCount > 0 && that.option('scrolling.mode') === SCROLLING_MODE_INFINITE && that.option('scrolling.rowRenderingMode') !== SCROLLING_MODE_VIRTUAL);
        },

        _updateRowHeight: function() {
            this.callBase.apply(this, arguments);

            if(this._rowHeight) {

                this._updateContentPosition();

                const viewportHeight = this._hasHeight ? this.element().outerHeight() : $(getWindow()).outerHeight();
                const dataController = this._dataController;
                dataController.viewportSize(Math.ceil(viewportHeight / this._rowHeight));

                if(this.option(NEW_SCROLLING_MODE) && !isDefined(dataController._loadViewportParams)) {
                    const viewportSize = dataController.viewportSize();
                    const viewportIsNotFilled = viewportSize > dataController.items().length && (isAppendMode(this) || dataController.totalItemsCount() > viewportSize);
                    viewportIsNotFilled && dataController.loadViewport();
                }
            }
        },

        updateFreeSpaceRowHeight: function() {
            const result = this.callBase.apply(this, arguments);

            if(result) {
                this._updateContentPosition();
            }

            return result;
        },

        setLoading: function(isLoading, messageText) {
            const dataController = this._dataController;
            const hasBottomLoadPanel = dataController.pageIndex() > 0 && dataController.isLoaded() && !!this._findBottomLoadPanel();

            if(this.option(NEW_SCROLLING_MODE) && isLoading && dataController.isViewportChanging()) {
                return;
            }

            if(hasBottomLoadPanel) {
                isLoading = false;
            }

            this.callBase.call(this, isLoading, messageText);
        },

        _resizeCore: function() {
            const that = this;
            const $element = that.element();

            that.callBase();

            if(that.component.$element() && !that._windowScroll && $element.closest(getWindow().document).length) {
                that._windowScroll = subscribeToExternalScrollers($element, function(scrollPos) {
                    if(!that._hasHeight && that._rowHeight) {
                        that._dataController.setViewportPosition(scrollPos);
                    }

                }, that.component.$element());

                that.on('disposing', function() {
                    that._windowScroll.dispose();
                });
            }

            that.loadIfNeed();
        },

        loadIfNeed: function() {
            const dataController = this._dataController;
            dataController?.loadIfNeed?.();
        },

        setColumnWidths: function(widths) {
            const scrollable = this.getScrollable();
            let $content;

            this.callBase.apply(this, arguments);

            if(this.option('scrolling.mode') === 'virtual') {
                $content = scrollable ? $(scrollable.content()) : this.element();
                this.callBase(widths, $content.children('.' + this.addWidgetPrefix(CONTENT_CLASS)).children(':not(.' + this.addWidgetPrefix(TABLE_CONTENT_CLASS) + ')'));
            }
        },

        dispose: function() {
            clearTimeout(this._scrollTimeoutID);
            this.callBase();
        }
    };
})();

export const virtualScrollingModule = {
    defaultOptions: function() {
        return {
            scrolling: {
                timeout: 300,
                updateTimeout: 300,
                minTimeout: 0,
                renderingThreshold: 100,
                removeInvisiblePages: true,
                rowPageSize: 5,
                mode: 'standard',
                preloadEnabled: false,
                rowRenderingMode: 'standard',
                loadTwoPagesOnStart: false,
                newMode: false,
                minGap: 1
            }
        };
    },
    extenders: {
        dataSourceAdapter: VirtualScrollingDataSourceAdapterExtender,
        controllers: {
            data: (function() {
                const members = {
                    _refreshDataSource: function() {
                        const baseResult = this.callBase.apply(this, arguments) || new Deferred().resolve().promise();
                        baseResult.done(this.initVirtualRows.bind(this));
                        return baseResult;
                    },
                    getRowPageSize: function() {
                        const rowPageSize = this.option('scrolling.rowPageSize');
                        const pageSize = this.pageSize();

                        return pageSize && pageSize < rowPageSize ? pageSize : rowPageSize;
                    },
                    reload: function() {
                        const rowsScrollController = this._rowsScrollController || this._dataSource;
                        const itemIndex = rowsScrollController && rowsScrollController.getItemIndexByPosition();
                        const result = this.callBase.apply(this, arguments);
                        return result && result.done(() => {
                            if(isVirtualMode(this) || isVirtualRowRendering(this)) {
                                const rowIndexOffset = this.getRowIndexOffset();
                                const rowIndex = Math.floor(itemIndex) - rowIndexOffset;
                                const component = this.component;
                                const scrollable = component.getScrollable && component.getScrollable();
                                const isSortingOperation = this.dataSource().operationTypes().sorting;

                                if(scrollable && !isSortingOperation) {
                                    const rowElement = component.getRowElement(rowIndex);
                                    const $rowElement = rowElement && rowElement[0] && $(rowElement[0]);
                                    let top = $rowElement && $rowElement.position().top;
                                    const isChromeLatest = browser.chrome && browser.version >= 91;
                                    const allowedTopOffset = browser.mozilla || browser.msie || isChromeLatest ? 1 : 0; // T884308
                                    if(top > allowedTopOffset) {
                                        top = Math.round(top + $rowElement.outerHeight() * (itemIndex % 1));
                                        scrollable.scrollTo({ y: top });
                                    }
                                }
                            }
                        });
                    },
                    initVirtualRows: function() {
                        const virtualRowsRendering = isVirtualRowRendering(this);

                        if(this.option('scrolling.mode') !== 'virtual' && virtualRowsRendering !== true || virtualRowsRendering === false || !this.option('scrolling.rowPageSize')) {
                            this._visibleItems = null;
                            this._rowsScrollController = null;
                            return;
                        }

                        const pageIndex = !isVirtualMode(this) && this.pageIndex() >= this.pageCount() ? this.pageCount() - 1 : this.pageIndex();
                        this._rowPageIndex = Math.ceil(pageIndex * this.pageSize() / this.getRowPageSize());
                        this._uncountableItemCount = 0;

                        this._visibleItems = this.option(NEW_SCROLLING_MODE) ? null : [];
                        this._rowsScrollController = new VirtualScrollController(this.component, this._getRowsScrollDataOptions(), true);
                        this._viewportChanging = false;

                        this._rowsScrollController.positionChanged.add(() => {
                            if(this.option(NEW_SCROLLING_MODE)) {
                                this._viewportChanging = true;
                                this.loadViewport();
                                this._viewportChanging = false;
                                return;
                            }
                            this._dataSource?.setViewportItemIndex(this._rowsScrollController.getViewportItemIndex());
                        });

                        if(this.isLoaded() && !this.option(NEW_SCROLLING_MODE)) {
                            this._rowsScrollController.load();
                        }
                    },
                    isViewportChanging: function() {
                        return this._viewportChanging;
                    },
                    _getRowsScrollDataOptions: function() {
                        const that = this;
                        const isItemCountable = function(item) {
                            return isItemCountableByDataSource(item, that._dataSource);
                        };

                        return {
                            pageSize: function() {
                                return that.getRowPageSize();
                            },
                            totalItemsCount: function() {
                                if(that.option(NEW_SCROLLING_MODE)) {
                                    return that.totalItemsCount() + that._uncountableItemCount;
                                }

                                return isVirtualMode(that) ? that.totalItemsCount() : that._items.filter(isItemCountable).length;
                            },
                            hasKnownLastPage: function() {
                                return true;
                            },
                            pageIndex: function(index) {
                                if(index !== undefined) {
                                    that._rowPageIndex = index;
                                }
                                return that._rowPageIndex;
                            },
                            isLoading: function() {
                                return that.isLoading();
                            },
                            pageCount: function() {
                                const pageCount = Math.ceil(this.totalItemsCount() / this.pageSize());
                                return pageCount ? pageCount : 1;
                            },
                            load: function() {
                                if(that._rowsScrollController.pageIndex() >= this.pageCount()) {
                                    that._rowPageIndex = this.pageCount() - 1;
                                    that._rowsScrollController.pageIndex(that._rowPageIndex);
                                }

                                if(!this.items().length && this.totalItemsCount()) return;

                                that._rowsScrollController.handleDataChanged(change => {
                                    change = change || {};
                                    change.changeType = change.changeType || 'refresh';
                                    change.items = change.items || that._visibleItems;

                                    that._visibleItems.forEach((item, index) => {
                                        item.rowIndex = index;
                                    });
                                    that._fireChanged(change);
                                });
                            },
                            updateLoading: function() {
                            },
                            itemsCount: function() {
                                return this.items().filter(isItemCountable).length;
                            },
                            correctCount: function(items, count, fromEnd) {
                                return correctCount(items, count, fromEnd, (item, isNextAfterLast, fromEnd) => {
                                    if(item.isNewRow) {
                                        return isNextAfterLast && !fromEnd;
                                    }

                                    if(isNextAfterLast && fromEnd) {
                                        return !item.isNewRow;
                                    }

                                    return isItemCountable(item);
                                });
                            },
                            items: function(countableOnly) {
                                const dataSource = that.dataSource();
                                const virtualItemsCount = dataSource && dataSource.virtualItemsCount();
                                const begin = virtualItemsCount ? virtualItemsCount.begin : 0;
                                const rowPageSize = that.getRowPageSize();

                                let skip = that._rowPageIndex * rowPageSize - begin;
                                let take = rowPageSize;

                                let result = that._items;

                                if(skip < 0) {
                                    return [];
                                }

                                if(skip) {
                                    skip = this.correctCount(result, skip);
                                    result = result.slice(skip);
                                }
                                if(take) {
                                    take = this.correctCount(result, take);
                                    result = result.slice(0, take);
                                }

                                return countableOnly ? result.filter(isItemCountable) : result;
                            },
                            viewportItems: function(items) {
                                if(items && !that.option(NEW_SCROLLING_MODE)) {
                                    that._visibleItems = items;
                                }
                                return that._visibleItems;
                            },
                            onChanged: function() {
                            },
                            changingDuration: function(e) {
                                const dataSource = that.dataSource();

                                if(dataSource.isLoading() && !that.option(NEW_SCROLLING_MODE)) {
                                    return LOAD_TIMEOUT;
                                }

                                return dataSource?._renderTime || 0;
                            }
                        };
                    },
                    _updateItemsCore: function(change) {
                        const delta = this.getRowIndexDelta();

                        this.callBase.apply(this, arguments);
                        if(this.option(NEW_SCROLLING_MODE) && isVirtualRowRendering(this)) {
                            return;
                        }

                        const rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            const visibleItems = this._visibleItems;
                            const isRefresh = change.changeType === 'refresh' || change.isLiveUpdate;

                            if(change.changeType === 'append' && change.items && !change.items.length) return;

                            if(isRefresh || change.changeType === 'append' || change.changeType === 'prepend') {
                                change.cancel = true;
                                isRefresh && rowsScrollController.reset(true);
                                rowsScrollController.load();
                            } else {
                                if(change.changeType === 'update') {
                                    change.rowIndices.forEach((rowIndex, index) => {
                                        const changeType = change.changeTypes[index];
                                        const newItem = change.items[index];
                                        if(changeType === 'update') {
                                            visibleItems[rowIndex] = newItem;
                                        } else if(changeType === 'insert') {
                                            visibleItems.splice(rowIndex, 0, newItem);
                                        } else if(changeType === 'remove') {
                                            visibleItems.splice(rowIndex, 1);
                                        }
                                    });
                                } else {
                                    visibleItems.forEach((item, index) => {
                                        visibleItems[index] = this._items[index + delta] || visibleItems[index];
                                    });
                                    change.items = visibleItems;
                                }

                                updateItemIndices(visibleItems);
                            }
                        }
                    },
                    _updateLoadViewportParams: function() {
                        this._loadViewportParams = this._rowsScrollController.getViewportParams();
                    },
                    _afterProcessItems: function(items, change) {
                        this._uncountableItemCount = 0;
                        if(isDefined(this._loadViewportParams)) {
                            this._uncountableItemCount = items.filter(item => !isItemCountableByDataSource(item, this._dataSource)).length;
                            this._updateLoadViewportParams();
                            const { skipForCurrentPage } = this.getLoadPageParams();
                            change.repaintChangesOnly = change.changeType === 'refresh';

                            return items.slice(skipForCurrentPage, skipForCurrentPage + this._loadViewportParams.take);
                        }

                        return this.callBase.apply(this, arguments);
                    },
                    _applyChange: function(change) {
                        const that = this;
                        const items = change.items;
                        const changeType = change.changeType;
                        let removeCount = change.removeCount;

                        if(removeCount) {
                            const fromEnd = changeType === 'prepend';
                            removeCount = correctCount(that._items, removeCount, fromEnd, function(item, isNextAfterLast) {
                                return item.rowType === 'data' && !item.isNewRow || (item.rowType === 'group' && (that._dataSource.isGroupItemCountable(item.data) || isNextAfterLast));
                            });

                            change.removeCount = removeCount;
                        }

                        switch(changeType) {
                            case 'prepend':
                                that._items.unshift.apply(that._items, items);
                                if(removeCount) {
                                    that._items.splice(-removeCount);
                                }
                                break;
                            case 'append':
                                that._items.push.apply(that._items, items);
                                if(removeCount) {
                                    that._items.splice(0, removeCount);
                                }
                                break;
                            default:
                                that.callBase(change);
                                break;
                        }
                    },
                    items: function(allItems) {
                        return allItems ? this._items : (this._visibleItems || this._items);
                    },
                    getRowIndexDelta: function() {
                        const visibleItems = this._visibleItems;
                        let delta = 0;

                        if(visibleItems && visibleItems[0]) {
                            delta = this._items.indexOf(visibleItems[0]);
                        }

                        return delta < 0 ? 0 : delta;
                    },
                    getRowIndexOffset: function(byLoadedRows) {
                        let offset = 0;
                        const dataSource = this.dataSource();
                        const rowsScrollController = this._rowsScrollController;
                        const virtualMode = isVirtualMode(this);
                        const appendMode = isAppendMode(this);
                        const newMode = this.option(NEW_SCROLLING_MODE);

                        if(rowsScrollController && !byLoadedRows) {
                            if(this.option(NEW_SCROLLING_MODE) && isDefined(this._loadViewportParams)) {
                                const { skipForCurrentPage, pageIndex } = this.getLoadPageParams();
                                offset = pageIndex * this.pageSize() + skipForCurrentPage;
                            } else {
                                offset = rowsScrollController.beginPageIndex() * rowsScrollController.pageSize();
                            }
                        } else if((virtualMode || (appendMode && newMode)) && dataSource) {
                            offset = dataSource.beginPageIndex() * dataSource.pageSize();
                        }

                        return offset;
                    },
                    viewportSize: function() {
                        const rowsScrollController = this._rowsScrollController;
                        const dataSource = this._dataSource;
                        const result = rowsScrollController?.viewportSize.apply(rowsScrollController, arguments);

                        if(this.option(NEW_SCROLLING_MODE)) {
                            return result;
                        }

                        return dataSource?.viewportSize.apply(dataSource, arguments);
                    },
                    viewportItemSize: function() {
                        const rowsScrollController = this._rowsScrollController;
                        const dataSource = this._dataSource;
                        const result = rowsScrollController?.viewportItemSize.apply(rowsScrollController, arguments);

                        if(this.option(NEW_SCROLLING_MODE)) {
                            return result;
                        }


                        return dataSource?.viewportItemSize.apply(dataSource, arguments);
                    },
                    setViewportPosition: function() {
                        const rowsScrollController = this._rowsScrollController;
                        const dataSource = this._dataSource;

                        if(rowsScrollController) {
                            rowsScrollController.setViewportPosition.apply(rowsScrollController, arguments);
                        } else {
                            dataSource?.setViewportPosition.apply(dataSource, arguments);
                        }
                    },
                    setContentItemSizes: function(sizes) {
                        const rowsScrollController = this._rowsScrollController;
                        const dataSource = this._dataSource;
                        const result = rowsScrollController?.setContentItemSizes(sizes);

                        if(this.option(NEW_SCROLLING_MODE)) {
                            return result;
                        }

                        return dataSource?.setContentItemSizes(sizes);
                    },
                    getLoadPageParams: function() {
                        const viewportParams = this._loadViewportParams;

                        const pageIndex = Math.floor(viewportParams.skip / this.pageSize());
                        const skipForCurrentPage = viewportParams.skip - (pageIndex * this.pageSize());
                        const loadPageCount = Math.ceil((skipForCurrentPage + viewportParams.take) / this.pageSize());

                        return {
                            pageIndex,
                            loadPageCount,
                            skipForCurrentPage
                        };
                    },
                    loadViewport: function() {
                        if(isVirtualMode(this) || isAppendMode(this)) {
                            this._updateLoadViewportParams();
                            const { pageIndex, loadPageCount } = this.getLoadPageParams();
                            const dataSourceAdapter = this._dataSource;

                            if(pageIndex !== dataSourceAdapter.pageIndex() || loadPageCount !== dataSourceAdapter.loadPageCount()) {
                                dataSourceAdapter.pageIndex(pageIndex);
                                dataSourceAdapter.loadPageCount(loadPageCount);
                                this.load();
                            } else if(!this._isLoading) {
                                this.updateItems();
                            }
                        }
                    },
                    loadIfNeed: function() {
                        if(this.option(NEW_SCROLLING_MODE)) {
                            return;
                        }

                        const rowsScrollController = this._rowsScrollController;
                        rowsScrollController && rowsScrollController.loadIfNeed();

                        const dataSource = this._dataSource;
                        return dataSource && dataSource.loadIfNeed();
                    },
                    getItemSize: function() {
                        const rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            return rowsScrollController.getItemSize.apply(rowsScrollController, arguments);
                        }

                        const dataSource = this._dataSource;
                        return dataSource && dataSource.getItemSize.apply(dataSource, arguments);
                    },
                    getItemSizes: function() {
                        const rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            return rowsScrollController.getItemSizes.apply(rowsScrollController, arguments);
                        }

                        const dataSource = this._dataSource;
                        return dataSource && dataSource.getItemSizes.apply(dataSource, arguments);
                    },
                    getContentOffset: function() {
                        const rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            return rowsScrollController.getContentOffset.apply(rowsScrollController, arguments);
                        }

                        const dataSource = this._dataSource;
                        return dataSource && dataSource.getContentOffset.apply(dataSource, arguments);
                    },
                    refresh: function(options) {
                        const dataSource = this._dataSource;

                        if(dataSource && options && options.load && isAppendMode(this)) {
                            dataSource.resetCurrentTotalCount();
                        }

                        return this.callBase.apply(this, arguments);
                    },
                    dispose: function() {
                        const rowsScrollController = this._rowsScrollController;

                        rowsScrollController && rowsScrollController.dispose();

                        this.callBase.apply(this, arguments);
                    },
                    topItemIndex: function() {
                        return this._loadViewportParams?.skip;
                    },
                    bottomItemIndex: function() {
                        const viewportParams = this._loadViewportParams;
                        return viewportParams && viewportParams.skip + viewportParams.take;
                    }
                };

                gridCoreUtils.proxyMethod(members, 'virtualItemsCount');
                gridCoreUtils.proxyMethod(members, 'getVirtualContentSize');
                gridCoreUtils.proxyMethod(members, 'setViewportItemIndex');

                return members;
            })(),
            resizing: {
                resize: function() {
                    const that = this;
                    const callBase = that.callBase;
                    let result;

                    if(isVirtualMode(that) || isVirtualRowRendering(that)) {
                        clearTimeout(that._resizeTimeout);
                        const diff = new Date() - that._lastTime;
                        const updateTimeout = that.option('scrolling.updateTimeout');

                        if(that._lastTime && diff < updateTimeout) {
                            result = new Deferred();
                            that._resizeTimeout = setTimeout(function() {
                                callBase.apply(that).done(result.resolve).fail(result.reject);
                                that._lastTime = new Date();
                            }, updateTimeout);
                            that._lastTime = new Date();
                        } else {
                            result = callBase.apply(that);
                            if(that._dataController.isLoaded()) {
                                that._lastTime = new Date();
                            }
                        }

                    } else {
                        result = callBase.apply(that);
                    }
                    return result;
                },
                dispose: function() {
                    this.callBase.apply(this, arguments);
                    clearTimeout(this._resizeTimeout);
                }
            }
        },
        views: {
            rowsView: VirtualScrollingRowsViewExtender
        }
    }
};
