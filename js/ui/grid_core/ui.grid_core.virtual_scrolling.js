import $ from '../../core/renderer';
import { getWindow, hasWindow } from '../../core/utils/window';
import { deferUpdate, deferRender } from '../../core/utils/common';
import { VirtualScrollController, subscribeToExternalScrollers } from './ui.grid_core.virtual_scrolling_core';
import gridCoreUtils from './ui.grid_core.utils';
import { each } from '../../core/utils/iterator';
import { Deferred } from '../../core/utils/deferred';
import { move } from '../../animation/translator';
import LoadIndicator from '../load_indicator';
import browser from '../../core/utils/browser';
import { getBoundingRect } from '../../core/utils/position';

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
        init: function(dataSource) {
            const that = this;

            that.callBase.apply(that, arguments);
            that._items = [];
            that._isLoaded = true;

            that._virtualScrollController = new VirtualScrollController(that.component, {
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
                    return dataSource.pageIndex(index);
                },
                isLoading: function() {
                    return dataSource.isLoading() && !that.isCustomLoading();
                },
                pageCount: function() {
                    return that.pageCount();
                },
                load: function() {
                    return dataSource.load();
                },
                updateLoading: function() {
                    updateLoading(that);
                },
                itemsCount: function() {
                    return that.itemsCount(true);
                },
                items: function() {
                    return dataSource.items();
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
            });
        },
        _handleLoadingChanged: function(isLoading) {
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
            const that = this;

            that._isLoading = false;
            that.loadingChanged.fire(false);

            that.callBase.apply(that, arguments);
        },
        _handleDataChanged: function(e) {
            const callBase = this.callBase.bind(this);

            this._virtualScrollController.handleDataChanged(callBase, e);
        },
        _customizeRemoteOperations: function(options, operationTypes) {
            const that = this;

            if(!that.option('legacyRendering') && isVirtualMode(that) && !operationTypes.reload && operationTypes.skip && that._renderTime < that.option('scrolling.renderingThreshold')) {
                options.delay = undefined;
            }

            that.callBase.apply(that, arguments);
        },
        items: function() {
            return this._items;
        },
        itemsCount: function(isBase) {
            if(isBase) {
                return this.callBase();
            }
            return this._virtualScrollController.itemsCount();
        },
        load: function(loadOptions) {
            if(loadOptions) {
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

            this.resetPagesCache();

            updateLoading(this);

            return result;
        },
        reload: function() {
            this._dataSource.pageIndex(this.pageIndex());
            const virtualScrollController = this._virtualScrollController;

            if(virtualScrollController) {
                const d = new Deferred();
                this.callBase.apply(this, arguments).done(function(r) {
                    const delayDeferred = virtualScrollController._delayDeferred;
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
            const that = this;
            const storeLoadOptions = options.storeLoadOptions;
            const dataSource = that._dataSource;

            if(operationTypes.reload) {
                that._virtualScrollController.reset();
                dataSource.items().length = 0;
                that._isLoaded = false;

                updateLoading(that);
                that._isLoaded = true;

                if(isAppendMode(that)) {
                    that.pageIndex(0);
                    dataSource.pageIndex(0);
                    storeLoadOptions.pageIndex = 0;
                    options.pageIndex = 0;
                    storeLoadOptions.skip = 0;
                } else {
                    dataSource.pageIndex(that.pageIndex());
                    if(dataSource.paginate()) {
                        options.pageIndex = that.pageIndex();
                        storeLoadOptions.skip = that.pageIndex() * that.pageSize();
                    }
                }
            } else if(isAppendMode(that) && storeLoadOptions.skip && that._skipCorrection < 0) {
                storeLoadOptions.skip += that._skipCorrection;
            }
            return that.callBase.apply(that, arguments);
        },
        dispose: function() {
            this._virtualScrollController.dispose();
            this.callBase.apply(this, arguments);
        }
    };

    [
        'virtualItemsCount',
        'getContentOffset',
        'getVirtualContentSize',
        'setContentSize', 'setViewportPosition',
        'getViewportItemIndex', 'setViewportItemIndex', 'getItemIndexByPosition',
        'viewportSize', 'viewportItemSize', 'getItemSize', 'getItemSizes',
        'pageIndex', 'beginPageIndex', 'endPageIndex',
        'loadIfNeed'
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

            dataController.stateLoaded?.add(() => {
                this._scrollToCurrentPageOnResize();
            });

            this._scrollToCurrentPageOnResize();
        },

        _scrollToCurrentPageOnResize: function() {
            const dataController = this.getController('data');

            if(!this.option('legacyRendering') && dataController.pageIndex() > 0) {
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

                if(isVirtualRowRendering(that)) {
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

        _renderContent: function(contentElement, tableElement) {
            const that = this;
            const virtualItemsCount = that._dataController.virtualItemsCount();

            if(virtualItemsCount && that.option('legacyRendering')) {
                if(hasWindow()) {
                    tableElement.addClass(that.addWidgetPrefix(TABLE_CONTENT_CLASS));
                }

                if(!contentElement.children().length) {
                    contentElement.append(tableElement);
                } else {
                    contentElement.children().first().replaceWith(tableElement);
                }

                if(contentElement.children('table').length === 1) {
                    contentElement.append(that._createTable());
                    that._contentHeight = 0;
                }
                return contentElement;
            }

            return that.callBase.apply(that, arguments);
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
            editingController && editingController.hasChanges() && this._getRowElements(contentTable).each((_, item)=>{
                const rowOptions = $(item).data('options');
                if(rowOptions) {
                    const change = editingController.getChangeByKey(rowOptions.key);
                    change && editingController._showErrorRow(change);
                }
            });
        },

        _updateContent: function(tableElement, change) {
            const that = this;
            let $freeSpaceRowElements;
            const contentElement = that._findContentElement();
            const changeType = change && change.changeType;

            if(changeType === 'append' || changeType === 'prepend') {
                const contentTable = contentElement.children().first();
                const $tBodies = that._getBodies(tableElement);
                if(!that.option('legacyRendering') && $tBodies.length === 1) {
                    that._getBodies(contentTable)[changeType === 'append' ? 'append' : 'prepend']($tBodies.children());
                } else {
                    $tBodies[changeType === 'append' ? 'appendTo' : 'prependTo'](contentTable);
                }

                tableElement.remove();
                $freeSpaceRowElements = that._getFreeSpaceRowElements(contentTable);
                removeEmptyRows($freeSpaceRowElements, FREESPACE_CLASS);

                if(change.removeCount) {
                    that._removeRowsElements(contentTable, change.removeCount, changeType);
                }

                that._restoreErrorRow(contentTable);
            } else {
                that.callBase.apply(that, arguments);
            }

            that._updateBottomLoading();
        },
        _addVirtualRow: function($table, isFixed, location, position) {
            if(!position) return;

            let $virtualRow = this._createEmptyRow(VIRTUAL_ROW_CLASS, isFixed, position);

            $virtualRow = this._wrapRowIfNeed($table, $virtualRow);

            this._appendEmptyRow($table, $virtualRow, location);
        },
        _updateContentPosition: function(isRender) {
            const that = this;
            const dataController = that._dataController;
            const rowHeight = that._rowHeight || 20;

            dataController.viewportItemSize(rowHeight);

            if(!that.option('legacyRendering') && (isVirtualMode(that) || isVirtualRowRendering(that))) {
                if(!isRender) {
                    const rowHeights = that._getRowElements(that._tableElement).toArray().map(function(row) {
                        return getBoundingRect(row).height;
                    });

                    dataController.setContentSize(rowHeights);
                }
                const top = dataController.getContentOffset('begin');
                const bottom = dataController.getContentOffset('end');
                const $tables = that.getTableElements();
                const $virtualRows = $tables.children('tbody').children('.' + VIRTUAL_ROW_CLASS);

                removeEmptyRows($virtualRows, VIRTUAL_ROW_CLASS);

                $tables.each(function(index) {
                    const isFixed = index > 0;
                    that._isFixedTableRendering = isFixed;
                    that._addVirtualRow($(this), isFixed, 'top', top);
                    that._addVirtualRow($(this), isFixed, 'bottom', bottom);
                    that._isFixedTableRendering = false;
                });
            } else {
                deferUpdate(function() {
                    that._updateContentPositionCore();
                });
            }
        },

        _updateContentPositionCore: function() {
            const that = this;
            let contentHeight;
            let $tables;
            let $contentTable;
            const rowHeight = that._rowHeight || 20;
            const virtualItemsCount = that._dataController.virtualItemsCount();

            if(virtualItemsCount) {
                const contentElement = that._findContentElement();
                $tables = contentElement.children();
                $contentTable = $tables.eq(0);
                const virtualTable = $tables.eq(1);

                that._contentTableHeight = $contentTable[0].offsetHeight;

                that._dataController.viewportItemSize(rowHeight);
                that._dataController.setContentSize(that._contentTableHeight);

                contentHeight = that._dataController.getVirtualContentSize();
                const top = that._dataController.getContentOffset();

                deferRender(function() {
                    move($contentTable, { left: 0, top: top });

                    // TODO jsdmitry: Separate this functionality on render and resize
                    const isRenderVirtualTableContentRequired = that._contentHeight !== contentHeight || contentHeight === 0 ||
                        !that._isTableLinesDisplaysCorrect(virtualTable) ||
                        !that._isColumnElementsEqual($contentTable.find('col'), virtualTable.find('col'));

                    if(isRenderVirtualTableContentRequired) {
                        that._contentHeight = contentHeight;
                        that._renderVirtualTableContent(virtualTable, contentHeight);
                    }
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
            const scrollingMode = that.option('scrolling.mode');
            const virtualMode = scrollingMode === SCROLLING_MODE_VIRTUAL;
            const appendMode = scrollingMode === SCROLLING_MODE_INFINITE;
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
            const that = this;

            that.callBase.apply(that, arguments);

            if(that._rowHeight) {

                that._updateContentPosition();

                const viewportHeight = that._hasHeight ? that.element().outerHeight() : $(getWindow()).outerHeight();
                that._dataController.viewportSize(Math.ceil(viewportHeight / that._rowHeight));
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
            const that = this;
            const callBase = that.callBase;
            const dataController = that._dataController;
            const hasBottomLoadPanel = dataController.pageIndex() > 0 && dataController.isLoaded() && !!that._findBottomLoadPanel();

            if(hasBottomLoadPanel) {
                isLoading = false;
            }

            callBase.call(that, isLoading, messageText);
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
            if(dataController && dataController.loadIfNeed) {
                dataController.loadIfNeed();
            }
        },

        setColumnWidths: function(widths) {
            const scrollable = this.getScrollable();
            let $content;

            this.callBase.apply(this, arguments);

            if(this.option('scrolling.mode') === 'virtual') {
                $content = scrollable ? scrollable.$content() : this.element();
                this.callBase(widths, $content.children('.' + this.addWidgetPrefix(CONTENT_CLASS)).children(':not(.' + this.addWidgetPrefix(TABLE_CONTENT_CLASS) + ')'));
            }
        },

        dispose: function() {
            clearTimeout(this._scrollTimeoutID);
            this.callBase();
        }
    };
})();

export default {
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
                loadTwoPagesOnStart: false
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
                    _applyFilter: function() {
                        this.setViewportPosition(0);
                        return this.callBase.apply(this, arguments);
                    },
                    reload: function() {
                        const that = this;
                        const rowsScrollController = that._rowsScrollController || that._dataSource;
                        const itemIndex = rowsScrollController && rowsScrollController.getItemIndexByPosition();
                        const result = this.callBase.apply(this, arguments);
                        return result && result.done(function() {
                            if(isVirtualMode(that) || isVirtualRowRendering(that)) {
                                const rowIndexOffset = that.getRowIndexOffset();
                                const rowIndex = Math.floor(itemIndex) - rowIndexOffset;
                                const component = that.component;
                                const scrollable = component.getScrollable && component.getScrollable();
                                const isSortingOperation = that.dataSource().operationTypes().sorting;

                                if(scrollable && !that.option('legacyRendering') && !isSortingOperation) {
                                    const rowElement = component.getRowElement(rowIndex);
                                    const $rowElement = rowElement && rowElement[0] && $(rowElement[0]);
                                    let top = $rowElement && $rowElement.position().top;

                                    const allowedTopOffset = browser.mozilla || browser.msie ? 1 : 0; // T884308
                                    if(top > allowedTopOffset) {
                                        top = Math.round(top + $rowElement.outerHeight() * (itemIndex % 1));
                                        scrollable.scrollTo({ y: top });
                                    }
                                }
                            }
                        });
                    },
                    initVirtualRows: function() {
                        const that = this;
                        const virtualRowsRendering = isVirtualRowRendering(that);

                        if(that.option('scrolling.mode') !== 'virtual' && virtualRowsRendering !== true || virtualRowsRendering === false || that.option('legacyRendering') || !that.option('scrolling.rowPageSize')) {
                            that._visibleItems = null;
                            that._rowsScrollController = null;
                            return;
                        }

                        that._rowPageIndex = Math.ceil(that.pageIndex() * that.pageSize() / that.getRowPageSize());

                        that._visibleItems = [];

                        const isItemCountable = function(item) {
                            return item.rowType === 'data' && !item.isNewRow || item.rowType === 'group' && that._dataSource.isGroupItemCountable(item.data);
                        };

                        that._rowsScrollController = new VirtualScrollController(that.component, {
                            pageSize: function() {
                                return that.getRowPageSize();
                            },
                            totalItemsCount: function() {
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

                                if(!that._rowsScrollController._dataSource.items().length && this.totalItemsCount()) return;
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
                                return that._rowsScrollController._dataSource.items().filter(isItemCountable).length;
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
                                if(items) {
                                    that._visibleItems = items;
                                }
                                return that._visibleItems;
                            },
                            onChanged: function() {
                            },
                            changingDuration: function(e) {
                                const dataSource = that.dataSource();

                                if(dataSource.isLoading()) {
                                    return LOAD_TIMEOUT;
                                }

                                return dataSource?._renderTime || 0;
                            }
                        }, true);

                        that._rowsScrollController.positionChanged.add(() => {
                            that._dataSource?.setViewportItemIndex(that._rowsScrollController.getViewportItemIndex());
                        });

                        if(that.isLoaded()) {
                            that._rowsScrollController.load();
                        }
                    },
                    _updateItemsCore: function(change) {
                        const delta = this.getRowIndexDelta();
                        this.callBase.apply(this, arguments);
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

                                visibleItems.forEach((item, index) => {
                                    item.rowIndex = index;
                                });
                            }
                        }
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

                        if(rowsScrollController && !byLoadedRows) {
                            offset = rowsScrollController.beginPageIndex() * rowsScrollController._dataSource.pageSize();
                        } else if(this.option('scrolling.mode') === 'virtual' && dataSource) {
                            offset = dataSource.beginPageIndex() * dataSource.pageSize();
                        }

                        return offset;
                    },
                    viewportSize: function() {
                        const rowsScrollController = this._rowsScrollController;
                        rowsScrollController && rowsScrollController.viewportSize.apply(rowsScrollController, arguments);

                        const dataSource = this._dataSource;
                        return dataSource && dataSource.viewportSize.apply(dataSource, arguments);
                    },
                    viewportItemSize: function() {
                        const rowsScrollController = this._rowsScrollController;

                        rowsScrollController && rowsScrollController.viewportItemSize.apply(rowsScrollController, arguments);

                        const dataSource = this._dataSource;
                        return dataSource && dataSource.viewportItemSize.apply(dataSource, arguments);
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
                    setContentSize: function(sizes) {
                        const rowsScrollController = this._rowsScrollController;


                        rowsScrollController && rowsScrollController.setContentSize(sizes);

                        const dataSource = this._dataSource;
                        return dataSource && dataSource.setContentSize(sizes);
                    },
                    loadIfNeed: function() {
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

                    if(!that.option('legacyRendering') && (isVirtualMode(that) || isVirtualRowRendering(that))) {
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
