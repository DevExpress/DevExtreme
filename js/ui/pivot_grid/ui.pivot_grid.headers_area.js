import $ from '../../core/renderer';
import { isDefined } from '../../core/utils/type';
import { inArray } from '../../core/utils/array';
import { each } from '../../core/utils/iterator';
import { AreaItem } from './ui.pivot_grid.area_item';

const PIVOTGRID_AREA_CLASS = 'dx-pivotgrid-area';
const PIVOTGRID_AREA_COLUMN_CLASS = 'dx-pivotgrid-horizontal-headers';
const PIVOTGRID_AREA_ROW_CLASS = 'dx-pivotgrid-vertical-headers';
const PIVOTGRID_TOTAL_CLASS = 'dx-total';
const PIVOTGRID_GRAND_TOTAL_CLASS = 'dx-grandtotal';
const PIVOTGRID_ROW_TOTAL_CLASS = 'dx-row-total';
const PIVOTGRID_EXPANDED_CLASS = 'dx-pivotgrid-expanded';
const PIVOTGRID_COLLAPSED_CLASS = 'dx-pivotgrid-collapsed';
const PIVOTGRID_LAST_CELL_CLASS = 'dx-last-cell';
const PIVOTGRID_VERTICAL_SCROLL_CLASS = 'dx-vertical-scroll';
const PIVOTGRID_EXPAND_BORDER = 'dx-expand-border';


function getCellPath(tableElement, cell) {
    if(cell) {
        const data = tableElement.data().data;
        const rowIndex = cell.parentNode.rowIndex;
        const cellIndex = cell.cellIndex;

        return data[rowIndex] && data[rowIndex][cellIndex] && data[rowIndex][cellIndex].path;
    }
}

exports.HorizontalHeadersArea = AreaItem.inherit({
    _getAreaName: function() {
        return 'column';
    },

    _getAreaClassName: function() {
        return PIVOTGRID_AREA_COLUMN_CLASS;
    },

    _createGroupElement: function() {
        return $('<div>')
            .addClass(this._getAreaClassName())
            .addClass(PIVOTGRID_AREA_CLASS);
    },

    _applyCustomStyles: function(options) {
        const cssArray = options.cssArray;
        const cell = options.cell;
        const rowsCount = options.rowsCount;
        const classArray = options.classArray;

        if(options.cellIndex === options.cellsCount - 1) {
            cssArray.push((options.rtlEnabled ? 'border-left:' : 'border-right:') + '0px');
        }

        if((cell.rowspan === rowsCount - options.rowIndex) || (options.rowIndex + 1 === rowsCount)) {
            cssArray.push('border-bottom-width:0px');
        }

        if(cell.type === 'T' || cell.type === 'GT') {
            classArray.push(PIVOTGRID_ROW_TOTAL_CLASS);
        }
        if(options.cell.type === 'T') {
            classArray.push(PIVOTGRID_TOTAL_CLASS);
        }
        if(options.cell.type === 'GT') {
            classArray.push(PIVOTGRID_GRAND_TOTAL_CLASS);
        }

        if(isDefined(cell.expanded)) {
            classArray.push(cell.expanded ? PIVOTGRID_EXPANDED_CLASS : PIVOTGRID_COLLAPSED_CLASS);
        }

        this.callBase(options);
    },

    _getMainElementMarkup: function() {
        return '<thead class=\'' + this._getAreaClassName() + '\'>';
    },

    _getCloseMainElementMarkup: function() {
        return '</thead>';
    },

    setVirtualContentParams: function(params) {
        this.callBase(params);

        this._setTableCss({
            left: params.left,
            top: 0
        });

        this._virtualContentWidth = params.width;
    },

    hasScroll: function() {
        const tableWidth = this._virtualContent ? this._virtualContentWidth : this._tableWidth;
        if(this._groupWidth && tableWidth) {
            return (tableWidth - this._groupWidth) >= 1;
        }
        return false;
    },

    processScroll: function() {
        if(!this._getScrollable()) {
            this._groupElement.dxScrollable({
                useNative: false,
                useSimulatedScrollbar: false,
                showScrollbar: false,
                bounceEnabled: false,
                direction: 'horizontal',
                updateManually: true
            });
        }
    },

    processScrollBarSpacing: function(scrollBarWidth) {
        const that = this;
        const groupAlignment = that.option('rtlEnabled') ? 'right' : 'left';

        if(that._groupWidth) {
            that.groupWidth(that._groupWidth - scrollBarWidth);
        }

        if(that._scrollBarWidth) {
            that._groupElement.next().remove();
        }

        that._groupElement.toggleClass(PIVOTGRID_VERTICAL_SCROLL_CLASS, scrollBarWidth > 0);

        that._groupElement.css('float', groupAlignment).width(that._groupHeight);
        that._scrollBarWidth = scrollBarWidth;
    },

    ctor: function(component) {
        this.callBase(component);
        this._scrollBarWidth = 0;
    },

    getScrollPath: function(offset) {
        const tableElement = this.tableElement();
        let cell;

        offset -= parseInt(tableElement[0].style.left, 10) || 0;

        each(tableElement.find('td'), function(_, td) {
            if(td.colSpan === 1 && td.offsetLeft <= offset && td.offsetWidth + td.offsetLeft > offset) {
                cell = td;
                return false;
            }
        });

        return getCellPath(tableElement, cell);
    },

    _moveFakeTable: function(scrollPos) {
        this._moveFakeTableHorizontally(scrollPos);
        this.callBase();
    }
});

exports.VerticalHeadersArea = exports.HorizontalHeadersArea.inherit({
    _getAreaClassName: function() {
        return PIVOTGRID_AREA_ROW_CLASS;
    },

    _applyCustomStyles: function(options) {
        this.callBase(options);

        if(options.cellIndex === options.cellsCount - 1) {
            options.classArray.push(PIVOTGRID_LAST_CELL_CLASS);
        }

        if(options.rowIndex === options.rowsCount - 1) {
            options.cssArray.push('border-bottom: 0px');
        }

        if(options.cell.isWhiteSpace) {
            options.classArray.push('dx-white-space-column');
        }
    },

    _getAreaName: function() {
        return 'row';
    },

    setVirtualContentParams: function(params) {
        this.callBase(params);

        this._setTableCss({
            top: params.top,
            left: 0
        });
        this._virtualContentHeight = params.height;
    },

    hasScroll: function() {
        const tableHeight = this._virtualContent ? this._virtualContentHeight : this._tableHeight;
        if(this._groupHeight && tableHeight) {
            return (tableHeight - this._groupHeight) >= 1;
        }
        return false;
    },

    processScroll: function() {
        if(!this._getScrollable()) {
            this._groupElement.dxScrollable({
                useNative: false,
                useSimulatedScrollbar: false,
                showScrollbar: false,
                bounceEnabled: false,
                direction: 'vertical',
                updateManually: true
            });
        }
    },

    processScrollBarSpacing: function(scrollBarWidth) {
        const that = this;
        if(that._groupHeight) {
            that.groupHeight(that._groupHeight - scrollBarWidth);
        }

        if(that._scrollBarWidth) {
            that._groupElement.next().remove();
        }

        if(scrollBarWidth) {
            that._groupElement.after(
                $('<div>')
                    .width('100%')
                    .height(scrollBarWidth - 1)
            );
        }

        that._scrollBarWidth = scrollBarWidth;
    },

    getScrollPath: function(offset) {
        const tableElement = this.tableElement();
        let cell;

        offset -= parseInt(tableElement[0].style.top, 10) || 0;

        each(tableElement.find('tr'), function(_, tr) {
            const td = tr.childNodes[tr.childNodes.length - 1];

            if(td && td.rowSpan === 1 && td.offsetTop <= offset && td.offsetHeight + td.offsetTop > offset) {
                cell = td;
                return false;
            }
        });

        return getCellPath(tableElement, cell);
    },

    _moveFakeTable: function(scrollPos) {
        this._moveFakeTableTop(scrollPos);
        this.callBase();
    },

    _getRowClassNames: function(rowIndex, cell, rowClassNames) {
        if(rowIndex !== 0 & cell.expanded && inArray(PIVOTGRID_EXPAND_BORDER, rowClassNames) === -1) {
            rowClassNames.push(PIVOTGRID_EXPAND_BORDER);
        }
    },

    _getMainElementMarkup: function() {
        return '<tbody class=\'' + this._getAreaClassName() + '\'>';
    },

    _getCloseMainElementMarkup: function() {
        return '</tbody>';
    },

    updateColspans: function(columnCount) {
        const rows = this.tableElement()[0].rows;
        let columnOffset = 0;
        let diff;
        const columnOffsetResetIndexes = [];
        let i;
        let j;


        if(this.getColumnsCount() - columnCount > 0) {
            return;
        }

        for(i = 0; i < rows.length; i++) {
            for(j = 0; j < rows[i].cells.length; j++) {
                const cell = rows[i].cells[j];
                const rowSpan = cell.rowSpan;

                if(columnOffsetResetIndexes[i]) {
                    columnOffset -= columnOffsetResetIndexes[i];
                    columnOffsetResetIndexes[i] = 0;
                }

                diff = columnCount - (columnOffset + cell.colSpan);

                if(j === rows[i].cells.length - 1 && diff > 0) {
                    cell.colSpan = cell.colSpan + diff;
                }

                columnOffsetResetIndexes[i + rowSpan] = (columnOffsetResetIndexes[i + rowSpan] || 0) + cell.colSpan;
                columnOffset += cell.colSpan;
            }
        }
    }
});
