import { hasWindow } from '../../core/utils/window';
import { createColumnsInfo } from './ui.grid_core.virtual_columns_core';

var DEFAULT_COLUMN_WIDTH = 50;

var VirtualScrollingRowsViewExtender = {
    _resizeCore: function() {
        this.callBase.apply(this, arguments);
        this._columnsController.resize();
    },

    _handleScroll: function(e) {
        var that = this,
            scrollable = this.getScrollable(),
            left = e.scrollOffset.left;

        that.callBase.apply(that, arguments);

        if(that.option('rtlEnabled') && scrollable) {
            left = scrollable.$content().width() - scrollable.$element().width() - left;
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
            that._virtualVisibleColumns = {};
        },
        resetColumnsCache: function() {
            this.callBase();
            this._virtualVisibleColumns = {};
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
            var width = this.option('width');
            if(typeof width === 'number') {
                return width;
            }
            return this.getController('resizing')._lastWidth || this.component.$element().outerWidth();
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
            return this.option('scrolling.columnPageSize');
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
                renderingThreshold = that.option('scrolling.columnRenderingThreshold');

            if(that._renderTime > renderingThreshold) {
                clearTimeout(that._changedTimeout);

                that._changedTimeout = setTimeout(function() {
                    that._setScrollPositionCore(position);
                }, that.option('scrolling.timeout'));
            } else {
                that._setScrollPositionCore(position);
            }
        },
        isVirtualMode: function() {
            return hasWindow() && this.option('scrolling.columnRenderingMode') === 'virtual';
        },
        resize: function() {
            this._setScrollPositionCore(this._position);
        },
        _setScrollPositionCore: function(position) {
            var that = this;

            if(that.isVirtualMode()) {
                var beginPageIndex = that.getBeginPageIndex(position),
                    endPageIndex = that.getEndPageIndex(position),
                    needColumnsChanged = position < that._position ? that._beginPageIndex > beginPageIndex : that._endPageIndex < endPageIndex;

                that._position = position;
                if(needColumnsChanged) {
                    that._beginPageIndex = beginPageIndex;
                    that._endPageIndex = endPageIndex;
                    that._fireColumnsChanged();
                }
            }
        },
        getFixedColumns: function(rowIndex, isBase) {
            var fixedColumns = this.callBase(rowIndex);
            if(this.isVirtualMode() && !isBase && fixedColumns.length) {
                var transparentColumnIndex = fixedColumns.map(c => c.command).indexOf('transparent');
                fixedColumns[transparentColumnIndex].colspan = this.getVisibleColumns().length - this.callBase().length + 1;
                return fixedColumns;
            }

            return fixedColumns;
        },
        getVisibleColumns: function(rowIndex, isBase) {
            if(isBase || !this.isVirtualMode()) {
                return this.callBase(rowIndex);
            }

            if(!this._beginPageIndex && !this._endPageIndex) {
                this._beginPageIndex = this.getBeginPageIndex(this._position);
                this._endPageIndex = this.getEndPageIndex(this._position);
            }

            var beginPageIndex = this._beginPageIndex,
                endPageIndex = this._endPageIndex,
                visibleColumnsHash = rowIndex + '-' + beginPageIndex + '-' + endPageIndex;

            if(this._virtualVisibleColumns[visibleColumnsHash]) {
                return this._virtualVisibleColumns[visibleColumnsHash];
            }

            var visibleColumns = this.callBase(),
                rowCount = this.getRowCount(),
                pageSize = this.getColumnPageSize(),
                startIndex = beginPageIndex * pageSize,
                endIndex = endPageIndex * pageSize,
                fixedColumns = this.getFixedColumns(undefined, true),
                transparentColumnIndex = fixedColumns.map(c => c.command).indexOf('transparent');

            var beginFixedColumnCount = fixedColumns.length ? transparentColumnIndex : 0;
            var beginFixedColumns = visibleColumns.slice(0, beginFixedColumnCount);
            var beginColumns = visibleColumns.slice(beginFixedColumnCount, startIndex);
            var beginWidth = getWidths(beginColumns).reduce((a, b) => a + b, 0);

            if(!beginWidth) {
                startIndex = 0;
            }

            var endFixedColumnCount = fixedColumns.length ? fixedColumns.length - transparentColumnIndex - 1 : 0;
            var endFixedColumns = visibleColumns.slice(visibleColumns.length - endFixedColumnCount);
            var endColumns = visibleColumns.slice(endIndex, visibleColumns.length - endFixedColumnCount);
            var endWidth = getWidths(endColumns).reduce((a, b) => a + b, 0);

            if(!endWidth) {
                endIndex = visibleColumns.length;
            }

            if(rowCount > 1 && typeof rowIndex === 'number') {
                var columnsInfo = [];
                for(var i = 0; i < rowCount; i++) {
                    columnsInfo.push(this.callBase(i));
                }
                beginFixedColumns = createColumnsInfo(columnsInfo, 0, beginFixedColumns.length)[rowIndex] || [];
                endFixedColumns = createColumnsInfo(columnsInfo, visibleColumns.length - endFixedColumns.length, visibleColumns.length)[rowIndex] || [];
                visibleColumns = createColumnsInfo(columnsInfo, startIndex, endIndex)[rowIndex] || [];
            } else {
                visibleColumns = visibleColumns.slice(startIndex, endIndex);
            }

            if(beginWidth) {
                visibleColumns.unshift({ command: 'virtual', width: beginWidth });
                visibleColumns = beginFixedColumns.concat(visibleColumns);
            }

            if(endWidth) {
                visibleColumns.push({ command: 'virtual', width: endWidth });
                visibleColumns = visibleColumns.concat(endFixedColumns);
            }

            this._virtualVisibleColumns[visibleColumnsHash] = visibleColumns;

            return visibleColumns;
        },
        dispose: function() {
            clearTimeout(this._changedTimeout);
            this.callBase.apply(this, arguments);
        }
    };

    return members;
})();

module.exports = {
    defaultOptions: function() {
        return {
            scrolling: {
                /**
                 * @name GridBaseOptions.scrolling.columnRenderingMode
                 * @type Enums.GridColumnRenderingMode
                 * @default "standard"
                 */
                columnRenderingMode: 'standard',
                columnPageSize: 5,
                columnRenderingThreshold: 300
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
