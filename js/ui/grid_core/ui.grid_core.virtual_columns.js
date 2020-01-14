import { hasWindow } from '../../core/utils/window';
import { createColumnsInfo } from './ui.grid_core.virtual_columns_core';

const DEFAULT_COLUMN_WIDTH = 50;

const VirtualScrollingRowsViewExtender = {
    _resizeCore: function() {
        this.callBase.apply(this, arguments);
        this._columnsController.resize();
    },

    _handleScroll: function(e) {
        const that = this;
        const scrollable = this.getScrollable();
        let left = e.scrollOffset.left;

        that.callBase.apply(that, arguments);

        if(that.option('rtlEnabled') && scrollable) {
            left = scrollable.$content().width() - scrollable.$element().width() - left;
        }

        that._columnsController.setScrollPosition(left);
    }
};

const HeaderFooterViewExtender = {
    _renderCore: function() {
        const that = this;
        const scrollLeft = that._scrollLeft;

        that.callBase.apply(that, arguments);

        if(that._columnsController.isVirtualMode() && scrollLeft >= 0) {
            that._scrollLeft = 0;
            that.scrollTo({ left: scrollLeft });
        }
    }
};

const ColumnsControllerExtender = (function() {
    const getWidths = function(columns) {
        return columns.map(column => column.visibleWidth || parseFloat(column.width) || DEFAULT_COLUMN_WIDTH);
    };

    const members = {
        init: function() {
            const that = this;
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
            const visibleColumns = this.getVisibleColumns(undefined, true);
            const widths = getWidths(visibleColumns);
            let currentPosition = 0;

            for(let index = 0; index < widths.length; index++) {
                if(currentPosition >= position) {
                    return Math.floor(index / this.getColumnPageSize());
                }
                currentPosition += widths[index];
            }

            return 0;
        },
        getTotalWidth: function() {
            const width = this.option('width');
            if(typeof width === 'number') {
                return width;
            }
            return this.getController('resizing')._lastWidth || this.component.$element().outerWidth();
        },
        getEndPageIndex: function(position) {
            const visibleColumns = this.getVisibleColumns(undefined, true);
            const widths = getWidths(visibleColumns);
            let currentPosition = 0;

            position += this.getTotalWidth();

            for(let index = 0; index < widths.length; index++) {
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
            const date = new Date();
            this.columnsChanged.fire({
                optionNames: { all: true, length: 1 },
                changeTypes: { columns: true, length: 1 }
            });
            this._renderTime = new Date() - date;
        },
        setScrollPosition: function(position) {
            const that = this;
            const renderingThreshold = that.option('scrolling.columnRenderingThreshold');

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
            const that = this;

            if(that.isVirtualMode()) {
                const beginPageIndex = that.getBeginPageIndex(position);
                const endPageIndex = that.getEndPageIndex(position);
                const needColumnsChanged = position < that._position ? that._beginPageIndex > beginPageIndex : that._endPageIndex < endPageIndex;

                that._position = position;
                if(needColumnsChanged) {
                    that._beginPageIndex = beginPageIndex;
                    that._endPageIndex = endPageIndex;
                    that._fireColumnsChanged();
                }
            }
        },
        getFixedColumns: function(rowIndex, isBase) {
            const fixedColumns = this.callBase(rowIndex);
            if(this.isVirtualMode() && !isBase && fixedColumns.length) {
                const transparentColumnIndex = fixedColumns.map(c => c.command).indexOf('transparent');
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

            const beginPageIndex = this._beginPageIndex;
            const endPageIndex = this._endPageIndex;
            const visibleColumnsHash = rowIndex + '-' + beginPageIndex + '-' + endPageIndex;

            if(this._virtualVisibleColumns[visibleColumnsHash]) {
                return this._virtualVisibleColumns[visibleColumnsHash];
            }

            let visibleColumns = this.callBase();
            const rowCount = this.getRowCount();
            const pageSize = this.getColumnPageSize();
            let startIndex = beginPageIndex * pageSize;
            let endIndex = endPageIndex * pageSize;
            const fixedColumns = this.getFixedColumns(undefined, true);
            const transparentColumnIndex = fixedColumns.map(c => c.command).indexOf('transparent');

            const beginFixedColumnCount = fixedColumns.length ? transparentColumnIndex : 0;
            let beginFixedColumns = visibleColumns.slice(0, beginFixedColumnCount);
            const beginColumns = visibleColumns.slice(beginFixedColumnCount, startIndex);
            const beginWidth = getWidths(beginColumns).reduce((a, b) => a + b, 0);

            if(!beginWidth) {
                startIndex = 0;
            }

            const endFixedColumnCount = fixedColumns.length ? fixedColumns.length - transparentColumnIndex - 1 : 0;
            let endFixedColumns = visibleColumns.slice(visibleColumns.length - endFixedColumnCount);
            const endColumns = visibleColumns.slice(endIndex, visibleColumns.length - endFixedColumnCount);
            const endWidth = getWidths(endColumns).reduce((a, b) => a + b, 0);

            if(!endWidth) {
                endIndex = visibleColumns.length;
            }

            if(rowCount > 1 && typeof rowIndex === 'number') {
                const columnsInfo = [];
                for(let i = 0; i < rowCount; i++) {
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
