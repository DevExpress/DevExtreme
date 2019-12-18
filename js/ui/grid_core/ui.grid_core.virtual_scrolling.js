import $ from "../../core/renderer";
import { getWindow, hasWindow } from "../../core/utils/window";
import { deferUpdate, deferRender } from "../../core/utils/common";
import virtualScrollingCore from "./ui.grid_core.virtual_scrolling_core";
import gridCoreUtils from "./ui.grid_core.utils";
import { each } from "../../core/utils/iterator";
import { Deferred } from "../../core/utils/deferred";
import translator from "../../animation/translator";
import LoadIndicator from "../load_indicator";

var TABLE_CLASS = "table",
    BOTTOM_LOAD_PANEL_CLASS = "bottom-load-panel",
    TABLE_CONTENT_CLASS = "table-content",
    GROUP_SPACE_CLASS = "group-space",
    CONTENT_CLASS = "content",
    ROW_CLASS = "dx-row",
    FREESPACE_CLASS = "dx-freespace-row",
    COLUMN_LINES_CLASS = "dx-column-lines",
    VIRTUAL_ROW_CLASS = "dx-virtual-row",

    SCROLLING_MODE_INFINITE = "infinite",
    SCROLLING_MODE_VIRTUAL = "virtual",
    SCROLLING_MODE_STANDARD = "standard",
    PIXELS_LIMIT = 250000, // this limit is defined for IE
    LOAD_TIMEOUT = 300;

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

var correctCount = function(items, count, fromEnd, isItemCountableFunc) {
    var countCorrection = (fromEnd ? 0 : 1);
    for(var i = 0; i < count + countCorrection; i++) {
        var item = items[fromEnd ? items.length - 1 - i : i];
        if(item && !isItemCountableFunc(item, i === count)) {
            count++;
        }
    }
    return count;
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
                    if(that.isLoading()) {
                        return LOAD_TIMEOUT;
                    }

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

            if(isLoading) {
                that._startLoadTime = new Date();
            } else {
                that._startLoadTime = undefined;
            }
        },
        _handleLoadError: function() {
            var that = this;

            that._isLoading = false;
            that.loadingChanged.fire(false);

            that.callBase.apply(that, arguments);
        },
        _handleDataChanged: function(e) {
            var callBase = this.callBase.bind(this);

            this._virtualScrollController.handleDataChanged(callBase, e);
        },
        _customizeRemoteOperations: function(options, isReload, operationTypes) {
            var that = this;

            if(!that.option("legacyRendering") && isVirtualMode(that) && !(operationTypes.reload || isReload) && operationTypes.skip && that._renderTime < that.option("scrolling.renderingThreshold")) {
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
                this._virtualScrollController.reset();
            }
            this.callBase.apply(this, arguments);
        },
        _changeRowExpandCore: function() {
            var result = this.callBase.apply(this, arguments);

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
                        options.pageIndex = that.pageIndex();
                        storeLoadOptions.skip = that.pageIndex() * that.pageSize();
                    }
                }
            }
            return that.callBase.apply(that, arguments);
        },
        dispose: function() {
            this._virtualScrollController.dispose();
            this.callBase.apply(this, arguments);
        }
    };

    [
        "virtualItemsCount",
        "getContentOffset",
        "getVirtualContentSize",
        "setContentSize", "setViewportPosition",
        "getViewportItemIndex", "setViewportItemIndex", "getItemIndexByPosition",
        "viewportSize", "viewportItemSize", "getItemSize", "getItemSizes",
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
    var removeEmptyRows = function($emptyRows, className) {
        let rowCount,
            getRowParent = row => $(row).parent('.' + className).get(0),
            tBodies = $emptyRows.toArray().map(getRowParent).filter(row => row);

        if(tBodies.length) {
            $emptyRows = $(tBodies);
        }

        rowCount = className === FREESPACE_CLASS ? $emptyRows.length - 1 : $emptyRows.length;

        for(let i = 0; i < rowCount; i++) {
            $emptyRows.eq(i).remove();
        }
    };

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
                var itemSize = dataController.getItemSize(),
                    itemSizes = dataController.getItemSizes(),
                    itemIndex = pageIndex * pageSize;

                scrollPosition = itemIndex * itemSize;

                for(var index in itemSizes) {
                    if(index <= itemIndex) {
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
            var that = this,
                dataSource,
                startRenderTime = new Date();

            that.callBase.apply(that, arguments);

            dataSource = that._dataController._dataSource;

            if(dataSource && e) {
                var itemCount = e.items ? e.items.length : 20,
                    viewportSize = that._dataController.viewportSize() || 20;

                if(isVirtualRowRendering(that)) {
                    dataSource._renderTime = (new Date() - startRenderTime) * viewportSize / itemCount;
                } else {
                    dataSource._renderTime = (new Date() - startRenderTime);
                }
            }
        },

        _getRowElements: function(tableElement) {
            var $rows = this.callBase(tableElement);

            return $rows && $rows.not("." + VIRTUAL_ROW_CLASS);
        },

        _renderContent: function(contentElement, tableElement) {
            var that = this,
                virtualItemsCount = that._dataController.virtualItemsCount();

            if(virtualItemsCount && that.option("legacyRendering")) {
                if(hasWindow()) {
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

        _removeRowsElements: function(contentTable, removeCount, changeType) {
            var rowElements = this._getRowElements(contentTable).toArray();
            if(changeType === "append") {
                rowElements = rowElements.slice(0, removeCount);
            } else {
                rowElements = rowElements.slice(-removeCount);
            }

            let errorHandlingController = this.getController("errorHandling");
            rowElements.map(rowElement => {
                var $rowElement = $(rowElement);
                errorHandlingController && errorHandlingController.removeErrorRow($rowElement.next());
                $rowElement.remove();
            });
        },

        _restoreErrorRow: function(contentTable) {
            let editingController = this.getController("editing");
            editingController && editingController.hasChanges() && this._getRowElements(contentTable).each((_, item)=>{
                let rowOptions = $(item).data("options");
                if(rowOptions) {
                    let editData = editingController.getEditDataByKey(rowOptions.key);
                    editData && editingController._showErrorRow(editData);
                }
            });
        },

        _updateContent: function(tableElement, change) {
            var that = this,
                contentTable,
                $freeSpaceRowElements,
                contentElement = that._findContentElement(),
                changeType = change && change.changeType;

            if(changeType === "append" || changeType === "prepend") {
                contentTable = contentElement.children().first();
                var $tBodies = that._getBodies(tableElement);
                if(!that.option("legacyRendering") && $tBodies.length === 1) {
                    that._getBodies(contentTable)[changeType === "append" ? "append" : "prepend"]($tBodies.children());
                } else {
                    $tBodies[changeType === "append" ? "appendTo" : "prependTo"](contentTable);
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

            var $virtualRow = this._createEmptyRow(VIRTUAL_ROW_CLASS, isFixed, position);

            $virtualRow = this._wrapRowIfNeed($table, $virtualRow);

            this._appendEmptyRow($table, $virtualRow, location);
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
                var top = dataController.getContentOffset("begin"),
                    bottom = dataController.getContentOffset("end"),
                    $tables = that.getTableElements(),
                    $virtualRows = $tables.children("tbody").children("." + VIRTUAL_ROW_CLASS);

                removeEmptyRows($virtualRows, VIRTUAL_ROW_CLASS);

                $tables.each(function(index) {
                    var isFixed = index > 0;
                    that._isFixedTableRendering = isFixed;
                    that._addVirtualRow($(this), isFixed, "top", top);
                    that._addVirtualRow($(this), isFixed, "bottom", bottom);
                    that._isFixedTableRendering = false;
                });

                !isRender && that._updateScrollTopPosition(top);
            } else {
                deferUpdate(function() {
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

                deferRender(function() {
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

        _findBottomLoadPanel: function($contentElement) {
            var $element = $contentElement || this.element();
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
                $contentElement = that._findContentElement(),
                bottomLoadPanelElement = that._findBottomLoadPanel($contentElement);

            if(showBottomLoading) {
                if(!bottomLoadPanelElement) {
                    $("<div>")
                        .addClass(that.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS))
                        .append(that._createComponent($("<div>"), LoadIndicator).$element())
                        .appendTo($contentElement);
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
            return that.callBase.apply(that, arguments) || (itemsCount > 0 && that.option("scrolling.mode") === SCROLLING_MODE_INFINITE && that.option("scrolling.rowRenderingMode") !== SCROLLING_MODE_VIRTUAL);
        },

        _updateRowHeight: function() {
            var that = this,
                viewportHeight;

            that.callBase.apply(that, arguments);

            if(that._rowHeight) {

                that._updateContentPosition();

                viewportHeight = that._hasHeight ? that.element().outerHeight() : $(getWindow()).outerHeight();
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

            if(that.component.$element() && !that._windowScroll && $element.closest(getWindow().document).length) {
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
            var dataController = this._dataController;
            if(dataController && dataController.loadIfNeed) {
                dataController.loadIfNeed();
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
                renderingThreshold: 100,
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
                        var baseResult = this.callBase.apply(this, arguments) || new Deferred().resolve().promise();
                        baseResult.done(this.initVirtualRows.bind(this));
                        return baseResult;
                    },
                    getRowPageSize: function() {
                        var rowPageSize = this.option("scrolling.rowPageSize"),
                            pageSize = this.pageSize();

                        return pageSize && pageSize < rowPageSize ? pageSize : rowPageSize;
                    },
                    reload: function() {
                        var that = this,
                            rowsScrollController = that._rowsScrollController || that._dataSource,
                            itemIndex = rowsScrollController && rowsScrollController.getItemIndexByPosition(),
                            result = this.callBase.apply(this, arguments);
                        return result && result.done(function() {
                            if(isVirtualMode(that) || isVirtualRowRendering(that)) {
                                var rowIndexOffset = that.getRowIndexOffset(),
                                    rowIndex = Math.floor(itemIndex) - rowIndexOffset,
                                    component = that.component,
                                    scrollable = component.getScrollable && component.getScrollable();

                                if(scrollable && !that.option("legacyRendering")) {
                                    var rowElement = component.getRowElement(rowIndex),
                                        $rowElement = rowElement && rowElement[0] && $(rowElement[0]),
                                        top = $rowElement && $rowElement.position().top;

                                    if(top > 0) {
                                        top = Math.round(top + $rowElement.outerHeight() * (itemIndex % 1));
                                        scrollable.scrollTo({ y: top });
                                    }
                                }
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

                        var isItemCountable = function(item) {
                            return item.rowType === "data" && !item.isNewRow || item.rowType === "group" && that._dataSource.isGroupItemCountable(item.data);
                        };

                        that._rowsScrollController = new virtualScrollingCore.VirtualScrollController(that.component, {
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
                                var pageCount = Math.ceil(this.totalItemsCount() / this.pageSize());
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
                                return that._rowsScrollController._dataSource.items().filter(isItemCountable).length;
                            },
                            correctCount: function(items, count, fromEnd) {
                                return correctCount(items, count, fromEnd, isItemCountable);
                            },
                            items: function(countableOnly) {
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
                                var dataSource = that.dataSource();

                                if(dataSource.isLoading()) {
                                    return LOAD_TIMEOUT;
                                }

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
                            var isRefresh = change.changeType === "refresh" || change.isLiveUpdate;

                            if(change.changeType === "append" && change.items && !change.items.length) return;

                            if(isRefresh || change.changeType === "append" || change.changeType === "prepend") {
                                change.cancel = true;
                                isRefresh && rowsScrollController.reset(true);
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
                            var fromEnd = changeType === "prepend";

                            removeCount = correctCount(that._items, removeCount, fromEnd, function(item, isNextAfterLast) {
                                return item.rowType === "data" && !item.isNewRow || (item.rowType === "group" && (that._dataSource.isGroupItemCountable(item.data) || isNextAfterLast));
                            });

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
                    items: function(allItems) {
                        return allItems ? this._items : (this._visibleItems || this._items);
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
                    loadIfNeed: function() {
                        var rowsScrollController = this._rowsScrollController;
                        rowsScrollController && rowsScrollController.loadIfNeed();

                        var dataSource = this._dataSource;
                        return dataSource && dataSource.loadIfNeed();
                    },
                    getItemSize: function() {
                        var rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            return rowsScrollController.getItemSize.apply(rowsScrollController, arguments);
                        }

                        var dataSource = this._dataSource;
                        return dataSource && dataSource.getItemSize.apply(dataSource, arguments);
                    },
                    getItemSizes: function() {
                        var rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            return rowsScrollController.getItemSizes.apply(rowsScrollController, arguments);
                        }

                        var dataSource = this._dataSource;
                        return dataSource && dataSource.getItemSizes.apply(dataSource, arguments);
                    },
                    getContentOffset: function() {
                        var rowsScrollController = this._rowsScrollController;

                        if(rowsScrollController) {
                            return rowsScrollController.getContentOffset.apply(rowsScrollController, arguments);
                        }

                        var dataSource = this._dataSource;
                        return dataSource && dataSource.getContentOffset.apply(dataSource, arguments);
                    },
                    dispose: function() {
                        var rowsScrollController = this._rowsScrollController;

                        rowsScrollController && rowsScrollController.dispose();

                        this.callBase.apply(this, arguments);
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
