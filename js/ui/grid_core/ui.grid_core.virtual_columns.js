"use strict";

var windowUtils = require("../../core/utils/window");

var DEFAULT_COLUMN_WIDTH = 50;

var VirtualScrollingRowsViewExtender = {
    _handleScroll: function(e) {
        var that = this,
            left = e.scrollOffset.left;

        that.callBase.apply(that, arguments);

        if(that.option("rtlEnabled")) {
            left = e.component.$content().width() - e.component.$element().width() - left;
        }

        that._columnsController.setScrollPosition(left);
    }
};

var HeaderFooterViewExtender = {
    _renderCore: function() {
        var that = this,
            scrollLeft = that._scrollLeft;

        that.callBase.apply(that, arguments);

        if(that._columnsController.isVirtualMode() && scrollLeft >= 0) {
            that._scrollLeft = 0;
            that.scrollTo({ left: scrollLeft });
        }
    }
};

var ColumnsControllerExtender = (function() {
    var getWidths = function(columns) {
        return columns.map(column => column.visibleWidth || parseFloat(column.width) || DEFAULT_COLUMN_WIDTH);
    };

    var members = {
        init: function() {
            var that = this;
            that.callBase();

            that._beginPageIndex = 0;
            that._endPageIndex = 0;
            that._position = 0;
        },
        getBeginPageIndex: function(position) {
            var visibleColumns = this.getVisibleColumns(undefined, true),
                widths = getWidths(visibleColumns),
                currentPosition = 0;

            for(var index = 0; index < widths.length; index++) {
                if(currentPosition >= position) {
                    return Math.floor(index / this.getColumnPageSize());
                }
                currentPosition += widths[index];
            }

            return 0;
        },
        getTotalWidth: function() {
            var width = this.option("width");
            if(typeof width === "number") {
                return width;
            }
            return this.getController("resizing")._lastWidth || this.component.$element().outerWidth();
        },
        getEndPageIndex: function(position) {
            var visibleColumns = this.getVisibleColumns(undefined, true),
                widths = getWidths(visibleColumns),
                currentPosition = 0;

            position += this.getTotalWidth();

            for(var index = 0; index < widths.length; index++) {
                if(currentPosition >= position) {
                    return Math.ceil(index / this.getColumnPageSize());
                }
                currentPosition += widths[index];
            }

            return Math.ceil(widths.length / this.getColumnPageSize());
        },
        getColumnPageSize: function() {
            return this.option("scrolling.columnPageSize");
        },
        _fireColumnsChanged: function() {
            var date = new Date();
            this.columnsChanged.fire({
                optionNames: { all: true, length: 1 },
                changeTypes: { columns: true, length: 1 }
            });
            this._renderTime = new Date() - date;
        },
        setScrollPosition: function(position) {
            var that = this,
                renderingThreshold = that.option("scrolling.columnRenderingThreshold");

            if(that._renderTime > renderingThreshold) {
                clearTimeout(that._changedTimeout);

                that._changedTimeout = setTimeout(function() {
                    that._setScrollPositionCore(position);
                }, Math.max(renderingThreshold, 100 || that.option("scrolling.timeout")));
            } else {
                that._setScrollPositionCore(position);
            }
        },
        isVirtualMode: function() {
            return windowUtils.hasWindow() && this.option("scrolling.columnRenderingMode") === "virtual" && this.getRowCount() <= 1;
        },
        _setScrollPositionCore: function(position) {
            var that = this;

            if(that.isVirtualMode()) {
                var beginPageIndex = that.getBeginPageIndex(position);
                var endPageIndex = that.getEndPageIndex(position);

                if(position < that._position ? that._beginPageIndex !== beginPageIndex : that._endPageIndex !== endPageIndex) {
                    that._beginPageIndex = beginPageIndex;
                    that._endPageIndex = endPageIndex;
                    that._fireColumnsChanged();
                }
                that._position = position;
            }
        },
        getVisibleColumns: function(rowIndex, isBase) {
            var visibleColumns = this.callBase(rowIndex);

            if(isBase || !this.isVirtualMode()) {
                return visibleColumns;
            }

            var fixedColumns = this.getFixedColumns();
            var transparentColumnIndex = fixedColumns.map(c => c.command).indexOf("transparent");
            var beginFixedColumnCount = fixedColumns.length ? transparentColumnIndex : 0;
            var endFixedColumnCount = fixedColumns.length ? fixedColumns.length - transparentColumnIndex - 1 : 0;

            var pageSize = this.getColumnPageSize();

            if(!this._beginPageIndex && !this._endPageIndex) {
                this._beginPageIndex = this.getBeginPageIndex(this._position);
                this._endPageIndex = this.getEndPageIndex(this._position);
            }

            var beginPageIndex = this._beginPageIndex;
            var endPageIndex = this._endPageIndex;

            var beginFixedColumns = visibleColumns.slice(0, beginFixedColumnCount);
            var beginColumns = visibleColumns.slice(beginFixedColumnCount, beginPageIndex * pageSize);
            var beginWidth = getWidths(beginColumns).reduce((a, b) => a + b, 0);

            var endFixedColumns = visibleColumns.slice(visibleColumns.length - endFixedColumnCount);
            var endColumns = visibleColumns.slice(endPageIndex * pageSize, visibleColumns.length - endFixedColumnCount);
            var endWidth = getWidths(endColumns).reduce((a, b) => a + b, 0);

            visibleColumns = visibleColumns.slice(beginPageIndex * pageSize, endPageIndex * pageSize);

            if(beginWidth) {
                visibleColumns.unshift({ command: "virtual", width: beginWidth });
                visibleColumns = beginFixedColumns.concat(visibleColumns);
            }

            if(endWidth) {
                visibleColumns.push({ command: "virtual", width: endWidth });
                visibleColumns = visibleColumns.concat(endFixedColumns);
            }

            return visibleColumns;
        }
    };

    return members;
})();

module.exports = {
    defaultOptions: function() {
        return {
            scrolling: {
                /**
                 * @name GridBaseOptions_scrolling_columnRenderingMode
                 * @publicName columnRenderingMode
                 * @type Enums.GridColumnRenderingMode
                 * @default "standard"
                 */
                columnRenderingMode: "standard",
                columnPageSize: 5,
                columnRenderingThreshold: 500
            }
        };
    },
    extenders: {
        controllers: {
            columns: ColumnsControllerExtender
        },
        views: {
            columnHeadersView: HeaderFooterViewExtender,
            footerView: HeaderFooterViewExtender,
            rowsView: VirtualScrollingRowsViewExtender
        }
    }
};
