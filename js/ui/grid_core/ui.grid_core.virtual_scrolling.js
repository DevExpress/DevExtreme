"use strict";

var $ = require("../../core/renderer"),
    windowUtils = require("../../core/utils/window"),
    window = windowUtils.getWindow(),
    commonUtils = require("../../core/utils/common"),
    virtualScrollingCore = require("./ui.grid_core.virtual_scrolling_core"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    each = require("../../core/utils/iterator").each,
    Deferred = require("../../core/utils/deferred").Deferred,
    translator = require("../../animation/translator"),
    LoadIndicator = require("../load_indicator");

var TABLE_CLASS = "table",
    BOTTOM_LOAD_PANEL_CLASS = "bottom-load-panel",
    TABLE_CONTENT_CLASS = "table-content",
    GROUP_SPACE_CLASS = "group-space",
    CONTENT_CLASS = "content",
    ROW_CLASS = "dx-row",
    FREESPACE_CLASS = "dx-freespace-row",
    COLUMN_LINES_CLASS = "dx-column-lines",

    SCROLLING_MODE_INFINITE = "infinite",
    SCROLLING_MODE_VIRTUAL = "virtual",
    SCROLLING_MODE_STANDARD = "standard",
    PIXELS_LIMIT = 250000; // this limit is defined for IE

var isVirtualMode = function(that) {
    return that.option("scrolling.mode") === SCROLLING_MODE_VIRTUAL;
};

var isAppendMode = function(that) {
    return that.option("scrolling.mode") === SCROLLING_MODE_INFINITE;
};

var isVirtualRowRendering = function(that) {
    var rowRenderingMode = that.option("scrolling.rowRenderingMode");
    if(rowRenderingMode === SCROLLING_MODE_VIRTUAL) {
        return true;
    } else if(rowRenderingMode === SCROLLING_MODE_STANDARD) {
        return false;
    }
};


var VirtualScrollingDataSourceAdapterExtender = (function() {
    var updateLoading = function(that) {
        var beginPageIndex = that._virtualScrollController.beginPageIndex(-1);

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

    var result = {
        init: function(dataSource) {
            var that = this;

            that.callBase.apply(that, arguments);
            that._items = [];
            that._isLoaded = true;

            that._virtualScrollController = new virtualScrollingCore.VirtualScrollController(that.component, {
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
                    return that._renderTime || 0;
                }
            });

        },
        _handleLoadingChanged: function(isLoading) {
            var that = this;

            if(!isVirtualMode(that)) {
                that._isLoading = isLoading;
                that.callBase.apply(that, arguments);
            }
        },
        _handleLoadError: function() {
            var that = this;

            that._isLoading = false;
            that.loadingChanged.fire(false);

            that.callBase.apply(that, arguments);
        },
        _handleDataChanged: function() {
            var callBase = this.callBase.bind(this);

            this._virtualScrollController.handleDataChanged(callBase);
        },
        _customizeRemoteOperations: function(options, isReload, operationTypes) {
            var that = this;

            if(!that.option("legacyRendering") && isVirtualMode(that) && !operationTypes.reload && operationTypes.paging && that._renderTime < that.option("scrolling.renderingThreshold")) {
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
        _changeRowExpandCore: function() {
            var result = this.callBase.apply(this, arguments);

            this._virtualScrollController.reset();
            this.resetPagesCache();

            updateLoading(this);

            return result;
        },
        reload: function() {
            this._dataSource.pageIndex(this.pageIndex());
            var virtualScrollController = this._virtualScrollController;

            if(virtualScrollController) {
                var d = new Deferred();
                this.callBase.apply(this, arguments).done(function(r) {
                    var delayDeferred = virtualScrollController._delayDeferred;
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
        refresh: function(options, isReload, operationTypes) {
            var that = this,
                storeLoadOptions = options.storeLoadOptions,
                dataSource = that._dataSource;

            if(isReload || operationTypes.reload) {
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
                        storeLoadOptions.skip = that.pageIndex() * that.pageSize();
                    }
                }
            }
            return that.callBase.apply(that, arguments);
        }
    };

    [
        "virtualItemsCount",
        "getContentOffset",
        "getVirtualContentSize",
        "setContentSize", "setViewportPosition",
        "getViewportItemIndex", "setViewportItemIndex",
        "viewportSize", "viewportItemSize", "getItemSize",
        "pageIndex", "beginPageIndex", "endPageIndex",
        "loadIfNeed"
    ].forEach(function(name) {
        result[name] = function() {
            var virtualScrollController = this._virtualScrollController;
            return virtualScrollController[name].apply(virtualScrollController, arguments);
        };
    });

    return result;

})();

var VirtualScrollingRowsViewExtender = (function() {
    return {
        init: function() {
            var that = this,
                dataController = that.getController("data");

            that.callBase();

            dataController.pageChanged.add(function() {
                that.scrollToPage(dataController.pageIndex());
            });

            if(!that.option("legacyRendering") && dataController.pageIndex() > 0) {
                var resizeHandler = function() {
                    that.resizeCompleted.remove(resizeHandler);
                    that.scrollToPage(dataController.pageIndex());
                };
                that.resizeCompleted.add(resizeHandler);
            }
        },

        scrollToPage: function(pageIndex) {
            var that = this,
                dataController = that._dataController,
                pageSize = dataController ? dataController.pageSize() : 0,
                scrollPosition;

            if(isVirtualMode(that) || isAppendMode(that)) {
                scrollPosition = pageIndex * pageSize * dataController.getItemSize();
            } else {
                scrollPosition = 0;
            }
            that.scrollTo({ y: scrollPosition, x: that._scrollLeft });
        },

        _renderCore: function(e) {
            var that = this,
                startRenderDate = new Date();

            that.callBase.apply(that, arguments);

            that._updateContentPosition(true);

            var dataSource = that._dataController._dataSource;
            if(dataSource && e) {
                var itemCount = e.items ? e.items.length : 20;
                var viewportSize = that._dataController.viewportSize() || 20;
                if(isVirtualRowRendering(that)) {
                    dataSource._renderTime = (new Date() - startRenderDate) * viewportSize / itemCount;
                } else {
                    dataSource._renderTime = (new Date() - startRenderDate);
                }
            }
        },

        _getRowElements: function(tableElement) {
            var $rows = this.callBase(tableElement);

            return $rows && $rows.not(".dx-virtual-row");
        },

        _renderContent: function(contentElement, tableElement) {
            var that = this,
                virtualItemsCount = that._dataController.virtualItemsCount();

            if(virtualItemsCount && that.option("legacyRendering")) {
                if(windowUtils.hasWindow()) {
                    tableElement.addClass(that.addWidgetPrefix(TABLE_CONTENT_CLASS));
                }

                if(!contentElement.children().length) {
                    contentElement.append(tableElement);
                } else {
                    contentElement.children().first().replaceWith(tableElement);
                }

                if(contentElement.children("table").length === 1) {
                    contentElement.append(that._createTable());
                    that._contentHeight = 0;
                }
                return contentElement;
            }

            return that.callBase.apply(that, arguments);
        },

        _updateContent: function(tableElement, change) {
            var that = this,
                contentTable,
                contentElement = that._findContentElement(),
                changeType = change && change.changeType;

            if(changeType === "append" || changeType === "prepend") {
                contentTable = contentElement.children().first();
                var $tBodies = tableElement.children("tbody");
                if(!that.option("legacyRendering") && $tBodies.length === 1) {
                    contentTable.children("tbody")[changeType === "append" ? "append" : "prepend"]($tBodies.children());
                } else {
                    $tBodies[changeType === "append" ? "appendTo" : "prependTo"](contentTable);
                }
                tableElement.remove();
                var $rowElements = that._getFreeSpaceRowElements(contentTable);
                for(var i = 0; i < $rowElements.length - 1; i++) {
                    $rowElements.eq(i).remove();
                }
                if(change.removeCount) {
                    var rowElements = that._getRowElements(contentTable).toArray();
                    if(changeType === "append") {
                        rowElements = rowElements.slice(0, change.removeCount);
                    } else {
                        rowElements = rowElements.slice(-change.removeCount);
                    }
                    rowElements.map(rowElement => $(rowElement).remove());
                }
            } else {
                that.callBase.apply(that, arguments);
            }

            that._updateBottomLoading();
        },
        _updateContentPosition: function(isRender) {
            var that = this,
                dataController = that._dataController,
                rowHeight = that._rowHeight || 20;

            dataController.viewportItemSize(rowHeight);

            if(!that.option("legacyRendering") && (isVirtualMode(that) || isVirtualRowRendering(that))) {
                if(!isRender) {
                    var rowHeights = that._getRowElements(that._tableElement).toArray().map(function(row) {
                        return row.getBoundingClientRect().height;
                    });

                    dataController.setContentSize(rowHeights);
                }
                var top = dataController.getContentOffset("begin");
                var bottom = dataController.getContentOffset("end");
                var $body = that._tableElement.children("tbody");

                $body.children(".dx-virtual-row").remove();

                if(top) {
                    var $topRow = that._createEmptyRow().addClass("dx-virtual-row");
                    $topRow.prependTo($body.first()).css("height", top);
                }

                if(bottom) {
                    var $bottomRow = that._createEmptyRow().addClass("dx-virtual-row");
                    $bottomRow.appendTo($body.last()).css("height", bottom);
                }

                !isRender && that._updateScrollTopPosition(top);
            } else {
                commonUtils.deferUpdate(function() {
                    that._updateContentPositionCore();
                });
            }
        },

        _updateScrollTopPosition: function(top) {
            if(this._scrollTop < top && !this._isScrollByEvent && this._dataController.pageIndex() > 0) {
                this.scrollTo({ top: top, left: this._scrollLeft });
            }
        },

        _updateContentPositionCore: function() {
            var that = this,
                contentElement,
                contentHeight,
                top,
                $tables,
                $contentTable,
                virtualTable,
                rowHeight = that._rowHeight || 20,
                virtualItemsCount = that._dataController.virtualItemsCount(),
                isRenderVirtualTableContentRequired;

            if(virtualItemsCount) {
                contentElement = that._findContentElement();
                $tables = contentElement.children();
                $contentTable = $tables.eq(0);
                virtualTable = $tables.eq(1);

                that._contentTableHeight = $contentTable[0].offsetHeight;

                that._dataController.viewportItemSize(rowHeight);
                that._dataController.setContentSize(that._contentTableHeight);

                contentHeight = that._dataController.getVirtualContentSize();
                top = that._dataController.getContentOffset();

                commonUtils.deferRender(function() {
                    translator.move($contentTable, { left: 0, top: top });

                    // TODO jsdmitry: Separate this functionality on render and resize
                    isRenderVirtualTableContentRequired = that._contentHeight !== contentHeight || contentHeight === 0 ||
                        !that._isTableLinesDisplaysCorrect(virtualTable) ||
                        !that._isColumnElementsEqual($contentTable.find("col"), virtualTable.find("col"));

                    if(isRenderVirtualTableContentRequired) {
                        that._contentHeight = contentHeight;
                        that._renderVirtualTableContent(virtualTable, contentHeight);
                    }

                    that._updateScrollTopPosition(top);
                });
            }
        },

        _isTableLinesDisplaysCorrect: function(table) {
            var hasColumnLines = table.find("." + COLUMN_LINES_CLASS).length > 0;
            return hasColumnLines === this.option("showColumnLines");
        },

        _isColumnElementsEqual: function($columns, $virtualColumns) {
            var result = $columns.length === $virtualColumns.length;

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
            var that = this,
                columns = that._columnsController.getVisibleColumns(),
                html = that._createColGroup(columns).prop("outerHTML"),
                freeSpaceCellsHtml = "",
                i,
                columnLinesClass = that.option("showColumnLines") ? COLUMN_LINES_CLASS : "",
                createFreeSpaceRowHtml = function(height) {
                    return "<tr style='height:" + height + "px;' class='" + FREESPACE_CLASS + " " + ROW_CLASS + " " + columnLinesClass + "' >" + freeSpaceCellsHtml + "</tr>";
                };

            for(i = 0; i < columns.length; i++) {
                var classes = that._getCellClasses(columns[i]),
                    classString = classes.length ? " class='" + classes.join(" ") + "'" : "";

                freeSpaceCellsHtml += "<td" + classString + "/>";
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
            var classes = [],
                cssClass = column.cssClass,
                isExpandColumn = column.command === "expand";

            cssClass && classes.push(cssClass);
            isExpandColumn && classes.push(this.addWidgetPrefix(GROUP_SPACE_CLASS));

            return classes;
        },

        _findBottomLoadPanel: function() {
            var $element = this.element();
            var $bottomLoadPanel = $element && $element.find("." + this.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS));
            if($bottomLoadPanel && $bottomLoadPanel.length) {
                return $bottomLoadPanel;
            }
        },

        _updateBottomLoading: function() {
            var that = this,
                scrollingMode = that.option("scrolling.mode"),
                virtualMode = scrollingMode === SCROLLING_MODE_VIRTUAL,
                appendMode = scrollingMode === SCROLLING_MODE_INFINITE,
                showBottomLoading = !that._dataController.hasKnownLastPage() && that._dataController.isLoaded() && (virtualMode || appendMode),
                bottomLoadPanelElement = that._findBottomLoadPanel();

            if(showBottomLoading) {
                if(!bottomLoadPanelElement) {
                    $("<div>")
                        .addClass(that.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS))
                        .append(that._createComponent($("<div>"), LoadIndicator).$element())
                        .appendTo(that._findContentElement());
                }
            } else if(bottomLoadPanelElement) {
                bottomLoadPanelElement.remove();
            }
        },

        _handleScroll: function(e) {
            var that = this;

            if(that._hasHeight && that._rowHeight) {
                that._dataController.setViewportPosition(e.scrollOffset.top);
            }
            that.callBase.apply(that, arguments);
        },

        _needUpdateRowHeight: function(itemsCount) {
            var that = this;
            return that.callBase.apply(that, arguments) || (itemsCount > 0 && that.option("scrolling.mode") === SCROLLING_MODE_INFINITE);
        },

        _updateRowHeight: function() {
            var that = this,
                viewportHeight;

            that.callBase.apply(that, arguments);

            if(that._rowHeight) {

                that._updateContentPosition();

                viewportHeight = that._hasHeight ? that.element().outerHeight() : $(window).outerHeight();
                that._dataController.viewportSize(Math.ceil(viewportHeight / that._rowHeight));
            }
        },

        updateFreeSpaceRowHeight: function() {
            var result = this.callBase.apply(this, arguments);

            if(result) {
                this._updateContentPosition();
            }

            return result;
        },

        setLoading: function(isLoading, messageText) {
            var that = this,
                callBase = that.callBase,
                dataController = that._dataController,
                hasBottomLoadPanel = dataController.pageIndex() > 0 && dataController.isLoaded() && !!that._findBottomLoadPanel();

            if(hasBottomLoadPanel) {
                isLoading = false;
            }

            callBase.call(that, isLoading, messageText);
        },

        _resizeCore: function() {
            var that = this,
                $element = that.element();

            that.callBase();

            if(that.component.$element() && !that._windowScroll && $element.closest(window.document).length) {
                that._windowScroll = virtualScrollingCore.subscribeToExternalScrollers($element, function(scrollPos) {
                    if(!that._hasHeight && that._rowHeight) {
                        that._dataController.setViewportPosition(scrollPos);
                    }

                }, that.component.$element());

                that.on("disposing", function() {
                    that._windowScroll.dispose();
                });
            }

            that.loadIfNeed();
        },

        loadIfNeed: function() {
            var dataSource = this._dataController.dataSource();
            if(dataSource && dataSource.loadIfNeed) {
                dataSource.loadIfNeed();
            }
        },

        setColumnWidths: function(widths) {
            var scrollable = this.getScrollable(),
                $content;

            this.callBase.apply(this, arguments);

            if(this.option("scrolling.mode") === "virtual") {
                $content = scrollable ? scrollable.$content() : this.element();
                this.callBase(widths, $content.children("." + this.addWidgetPrefix(CONTENT_CLASS)).children(":not(." + this.addWidgetPrefix(TABLE_CONTENT_CLASS) + ")"));
            }
        },

        dispose: function() {
            clearTimeout(this._scrollTimeoutID);
            this.callBase();
        }
    };
})();

module.exports = {
    defaultOptions: function() {
        return {
            scrolling: {
                timeout: 300,
                updateTimeout: 300,
                minTimeout: 0,
                renderingThreshold: 150,
                removeInvisiblePages: true,
                rowPageSize: 5,
                /**
                 * @name dxDataGridOptions.scrolling.mode
                 * @type Enums.GridScrollingMode
                 * @default "standard"
                 */
                mode: "standard",
                /**
                 * @name GridBaseOptions.scrolling.preloadEnabled
                 * @type boolean
                 * @default false
                 */
                preloadEnabled: false,
                /**
                 * @name GridBaseOptions.scrolling.rowRenderingMode
                 * @type Enums.GridRowRenderingMode
                 * @default "standard"
                 */
                rowRenderingMode: "standard"
            }
        };
    },
    extenders: {
        dataSourceAdapter: VirtualScrollingDataSourceAdapterExtender,
        controllers: {
            data: (function() {
                var members = {
                    _refreshDataSource: function() {
                        this.callBase.apply(this, arguments);
                        this.initVirtualRows();
                    },
                    getRowPageSize: function() {
                        var rowPageSize = this.option("scrolling.rowPageSize"),
                            pageSize = this.pageSize();

                        return pageSize && pageSize < rowPageSize ? pageSize : rowPageSize;
                    },
                    reload: function() {
                        var that = this,
                            result = this.callBase.apply(this, arguments);
                        return result && result.done(function() {
                            var rowsScrollController = that._rowsScrollController;
                            if(rowsScrollController) {
                                rowsScrollController.setViewportItemIndex(rowsScrollController.getViewportItemIndex());
                            }
                        });
                    },
                    initVirtualRows: function() {
                        var that = this,
                            virtualRowsRendering = isVirtualRowRendering(that);

                        if(that.option("scrolling.mode") !== "virtual" && virtualRowsRendering !== true || virtualRowsRendering === false || that.option("legacyRendering") || !that.option("scrolling.rowPageSize")) {
                            that._visibleItems = null;
                            that._rowsScrollController = null;
                            return;
                        }

                        that._rowPageIndex = Math.ceil(that.pageIndex() * that.pageSize() / that.getRowPageSize());

                        that._visibleItems = [];

                        that._rowsScrollController = new virtualScrollingCore.VirtualScrollController(that.component, {
                            pageSize: function() {
                                return that.getRowPageSize();
                            },
                            totalItemsCount: function() {
                                return isVirtualMode(that) ? that.totalItemsCount() : that._items.length;
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
                                var pageCount = Math.ceil(this.totalItemsCount() / this.pageSize());
                                return pageCount ? pageCount : 1;
                            },
                            load: function() {
                                if(that._rowsScrollController.pageIndex() >= this.pageCount()) {
                                    that._rowPageIndex = this.pageCount() - 1;
                                    that._rowsScrollController.pageIndex(that._rowPageIndex);
                                }

                                if(!that._rowsScrollController._dataSource.items().length && this.totalItemsCount()) return;
                                that._rowsScrollController.handleDataChanged(function(change) {
                                    change = change || {};
                                    change.changeType = change.changeType || "refresh";
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
                                return that._rowsScrollController._dataSource.items().length;
                            },
                            items: function() {
                                var dataSource = that.dataSource(),
                                    virtualItemsCount = dataSource && dataSource.virtualItemsCount(),
                                    begin = virtualItemsCount ? virtualItemsCount.begin : 0,
                                    rowPageSize = that.getRowPageSize();

                                var skip = that._rowPageIndex * rowPageSize - begin;
                                var take = rowPageSize;

                                var result = that._items;

                                if(skip < 0) {
                                    return [];
                                }

                                if(skip) {
                                    result = result.slice(skip);
                                }
                                if(take) {
                                    result = result.slice(0, take);
                                }

                                return result;
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
                                var dataSource = that.dataSource();
                                return dataSource && dataSource._renderTime || 0;
                            }
                        }, true);

                        if(that.isLoaded()) {
                            that._rowsScrollController.load();
                        }
                    },
                    _updateItemsCore: function(change) {
                        var delta = this.getRowIndexDelta();
                        this.callBase.apply(this, arguments);
                        var rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            var visibleItems = this._visibleItems;
                            var isRefresh = change.changeType === "refresh";

                            if(isRefresh || change.changeType === "append" || change.changeType === "prepend") {
                                change.cancel = true;
                                isRefresh && rowsScrollController.reset();
                                rowsScrollController.load();
                            } else {
                                if(change.changeType === "update") {
                                    change.rowIndices.forEach((rowIndex, index) => {
                                        var changeType = change.changeTypes[index];
                                        var newItem = change.items[index];
                                        if(changeType === "update") {
                                            visibleItems[rowIndex] = newItem;
                                        } else if(changeType === "insert") {
                                            visibleItems.splice(rowIndex, 0, newItem);
                                        } else if(changeType === "remove") {
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
                        var that = this,
                            items = change.items,
                            changeType = change.changeType,
                            removeCount = change.removeCount;

                        if(removeCount) {
                            for(var i = 0; i < removeCount + 1; i++) {
                                var item = that._items[changeType === "prepend" ? that._items.length - 1 - i : i];
                                if(item && item.rowType !== "data" && item.rowType !== "group") {
                                    removeCount++;
                                }
                            }
                            change.removeCount = removeCount;
                        }

                        switch(changeType) {
                            case "prepend":
                                that._items.unshift.apply(that._items, items);
                                if(removeCount) {
                                    that._items.splice(-removeCount);
                                }
                                break;
                            case "append":
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
                    items: function() {
                        return this._visibleItems || this._items;
                    },
                    getRowIndexDelta: function() {
                        var visibleItems = this._visibleItems,
                            delta = 0;

                        if(visibleItems && visibleItems[0]) {
                            delta = this._items.indexOf(visibleItems[0]);
                        }

                        return delta < 0 ? 0 : delta;
                    },
                    getRowIndexOffset: function() {
                        var offset = 0,
                            dataSource = this.dataSource(),
                            rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            offset = rowsScrollController.beginPageIndex() * rowsScrollController._dataSource.pageSize();
                        } else if(this.option("scrolling.mode") === "virtual" && dataSource) {
                            offset = dataSource.beginPageIndex() * dataSource.pageSize();
                        }

                        return offset;
                    },
                    viewportSize: function() {
                        var rowsScrollController = this._rowsScrollController;
                        rowsScrollController && rowsScrollController.viewportSize.apply(rowsScrollController, arguments);

                        var dataSource = this._dataSource;
                        return dataSource && dataSource.viewportSize.apply(dataSource, arguments);
                    },
                    viewportItemSize: function() {
                        var rowsScrollController = this._rowsScrollController;

                        rowsScrollController && rowsScrollController.viewportItemSize.apply(rowsScrollController, arguments);

                        var dataSource = this._dataSource;
                        return dataSource && dataSource.viewportItemSize.apply(dataSource, arguments);
                    },
                    setViewportPosition: function() {
                        var rowsScrollController = this._rowsScrollController,
                            dataSource = this._dataSource;

                        if(rowsScrollController) {
                            rowsScrollController.setViewportPosition.apply(rowsScrollController, arguments).done(function() {
                                dataSource && dataSource.setViewportItemIndex(rowsScrollController.getViewportItemIndex());
                            });
                        } else {
                            dataSource && dataSource.setViewportPosition.apply(dataSource, arguments);
                        }
                    },
                    setContentSize: function(sizes) {
                        var rowsScrollController = this._rowsScrollController;


                        rowsScrollController && rowsScrollController.setContentSize(sizes);

                        var dataSource = this._dataSource;
                        return dataSource && dataSource.setContentSize(sizes);
                    },
                    getItemSize: function() {
                        var rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            return rowsScrollController.getItemSize.apply(rowsScrollController, arguments);
                        }

                        var dataSource = this._dataSource;
                        return dataSource && dataSource.getItemSize.apply(dataSource, arguments);
                    },
                    getContentOffset: function() {
                        var rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            return rowsScrollController.getContentOffset.apply(rowsScrollController, arguments);
                        }

                        var dataSource = this._dataSource;
                        return dataSource && dataSource.getContentOffset.apply(dataSource, arguments);
                    }
                };

                gridCoreUtils.proxyMethod(members, "virtualItemsCount");
                gridCoreUtils.proxyMethod(members, "getVirtualContentSize");
                gridCoreUtils.proxyMethod(members, "setViewportItemIndex");

                return members;
            })(),
            resizing: {
                resize: function() {
                    var that = this,
                        callBase = that.callBase,
                        result;

                    if(!that.option("legacyRendering") && (isVirtualMode(that) || isVirtualRowRendering(that))) {
                        clearTimeout(that._resizeTimeout);
                        var diff = new Date() - that._lastTime;
                        var updateTimeout = that.option("scrolling.updateTimeout");

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
