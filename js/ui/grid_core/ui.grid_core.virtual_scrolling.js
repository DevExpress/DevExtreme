"use strict";

var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    virtualScrollingCore = require("./ui.grid_core.virtual_scrolling_core"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    each = require("../../core/utils/iterator").each,
    browser = require("../../core/utils/browser"),
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
    PIXELS_LIMIT = 250000; // this limit is defined for IE

var isVirtualMode = function(that) {
    return that.option("scrolling.mode") === SCROLLING_MODE_VIRTUAL;
};

var isAppendMode = function(that) {
    return that.option("scrolling.mode") === SCROLLING_MODE_INFINITE;
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

    return {
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
        items: function() {
            return this._items;
        },
        itemsCount: function(isBase) {
            if(isBase) {
                return this.callBase();
            }
            return this._virtualScrollController.itemsCount();
        },
        virtualItemsCount: function() {
            return this._virtualScrollController.virtualItemsCount();
        },
        getViewportItemIndex: function() {
            return this._virtualScrollController.getViewportItemIndex();
        },
        setViewportItemIndex: function(itemIndex) {
            return this._virtualScrollController.setViewportItemIndex(itemIndex);
        },
        viewportSize: function(size) {
            return this._virtualScrollController.viewportSize(size);
        },
        pageIndex: function(pageIndex) {
            return this._virtualScrollController.pageIndex(pageIndex);
        },
        beginPageIndex: function() {
            return this._virtualScrollController.beginPageIndex();
        },
        endPageIndex: function() {
            return this._virtualScrollController.endPageIndex();
        },
        load: function(loadOptions) {
            if(loadOptions) {
                return this.callBase(loadOptions);
            }
            return this._virtualScrollController.load();
        },
        loadIfNeed: function() {
            return this._virtualScrollController.loadIfNeed();
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
        },

        scrollToPage: function(pageIndex) {
            var that = this,
                dataController = that._dataController,
                pageSize = dataController ? dataController.pageSize() : 0,
                scrollPosition;

            if(isVirtualMode(that) || isAppendMode(that)) {
                scrollPosition = pageIndex * that._rowHeight * pageSize;
            } else {
                scrollPosition = 0;
            }

            that.scrollTo({ y: scrollPosition, x: that._scrollLeft });
        },

        _renderCore: function() {
            var that = this,
                startRenderDate = new Date();

            that.callBase.apply(that, arguments);

            that._updateContentPosition();

            that._renderTime = new Date() - startRenderDate;
        },

        _renderContent: function(contentElement, tableElement) {
            var that = this,
                virtualItemsCount = that._dataController.virtualItemsCount();

            if(virtualItemsCount) {
                tableElement.addClass(that.addWidgetPrefix(TABLE_CONTENT_CLASS));

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
            } else {
                return that.callBase.apply(that, arguments);
            }
        },

        _updateContent: function(tableElement, change) {
            var that = this,
                contentTable,
                contentElement = that._findContentElement(),
                changeType = change && change.changeType;

            if(changeType === "append" || changeType === "prepend") {
                contentTable = contentElement.children().first();
                tableElement.children("tbody")[changeType === "append" ? "appendTo" : "prependTo"](contentTable);
                tableElement.remove();
                var $rowElements = that._getFreeSpaceRowElements(contentTable);
                for(var i = 0; i < $rowElements.length - 1; i++) {
                    $rowElements.eq(i).remove();
                }
            } else {
                that.callBase.apply(that, arguments);
            }

            that._updateBottomLoading();
        },
        _updateContentPosition: commonUtils.deferUpdater(function() {
            var that = this,
                contentElement,
                contentHeight,
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

                contentHeight = (virtualItemsCount.begin + virtualItemsCount.end + that._dataController.itemsCount()) * that._rowHeight;

                var contentHeightLimit = virtualScrollingCore.getContentHeightLimit(browser);

                if(contentHeight > contentHeightLimit) {
                    that._heightRatio = contentHeightLimit / contentHeight;
                } else {
                    that._heightRatio = 1;
                }

                contentHeight = (virtualItemsCount.begin + virtualItemsCount.end) * rowHeight * that._heightRatio + that._contentTableHeight;

                var top = Math.floor(virtualItemsCount.begin * rowHeight * that._heightRatio);

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

                    if(that._scrollTop < top && !that._isScrollByEvent && that._dataController.pageIndex() > 0) {
                        that.scrollTo({ top: top, left: that._scrollLeft });
                    }
                });
            }
        }),

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
                that._setViewportScrollTop(e.scrollOffset.top);
            }
            that.callBase.apply(that, arguments);
        },

        _setViewportScrollTop: function(scrollTop) {
            var that = this,
                scrollingTimeout = Math.min(that.option("scrolling.timeout") || 0, that._renderTime || 0);

            clearTimeout(that._scrollTimeoutID);
            if(scrollingTimeout > 0) {
                that._scrollTimeoutID = setTimeout(function() {
                    that._setViewportScrollTopCore(scrollTop);
                }, scrollingTimeout);
            } else {
                that._setViewportScrollTopCore(scrollTop);
            }
        },

        _setViewportScrollTopCore: function(scrollTop) {
            var that = this,
                virtualItemsCount = that._dataController.virtualItemsCount(),
                heightRatio = that._heightRatio || 1,
                rowHeight = that._rowHeight,
                beginHeight = virtualItemsCount ? Math.floor(virtualItemsCount.begin * rowHeight * heightRatio) : 0;


            if(virtualItemsCount && scrollTop >= beginHeight && scrollTop <= beginHeight + that._contentTableHeight) {
                that._dataController.setViewportItemIndex(virtualItemsCount.begin + (scrollTop - beginHeight) / rowHeight);
            } else {
                that._dataController.setViewportItemIndex(Math.ceil(scrollTop / (rowHeight * heightRatio)));
            }
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
                that._dataController.viewportSize(Math.round(viewportHeight / that._rowHeight));
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

            if(that.component.$element() && !that._windowScroll && $element.closest(document).length) {
                that._windowScroll = virtualScrollingCore.subscribeToExternalScrollers($element, function(scrollPos) {
                    if(!that._hasHeight && that._rowHeight) {
                        that._setViewportScrollTop(scrollPos);
                    }

                }, that.component.$element());

                that.on("disposing", function() {
                    that._windowScroll.dispose();
                });
            }

            var dataSource = that._dataController.dataSource();
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
                /**
                 * @name dxDataGridOptions_scrolling_mode
                 * @publicName mode
                 * @type Enums.GridScrollingMode
                 * @default "standard"
                 */
                mode: "standard",
                /**
                 * @name GridBaseOptions_scrolling_preloadEnabled
                 * @publicName preloadEnabled
                 * @type boolean
                 * @default false
                 */
                preloadEnabled: false
            }
        };
    },
    extenders: {
        dataSourceAdapter: VirtualScrollingDataSourceAdapterExtender,
        controllers: {
            data: (function() {
                var members = {
                    getRowIndexOffset: function() {
                        var offset = 0,
                            dataSource = this.dataSource();

                        if(this.option("scrolling.mode") === "virtual" && dataSource) {
                            offset = dataSource.beginPageIndex() * dataSource.pageSize();
                        }

                        return offset;
                    }
                };

                gridCoreUtils.proxyMethod(members, "virtualItemsCount");
                gridCoreUtils.proxyMethod(members, "viewportSize");
                gridCoreUtils.proxyMethod(members, "setViewportItemIndex");

                return members;
            })()
        },
        views: {
            rowsView: VirtualScrollingRowsViewExtender
        }
    }
};
