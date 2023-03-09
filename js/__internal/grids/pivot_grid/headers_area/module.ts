import { setWidth, setHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { isDefined } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { AreaItem } from './ui.pivot_grid.area_item';
import Scrollable from '../scroll_view/ui.scrollable';

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

const isRenovatedScrollable = !!Scrollable.IS_RENOVATED_WIDGET;

function getCellPath(tableElement, cell) {
    if(cell) {
        const data = tableElement.data().data;
        const rowIndex = cell.parentNode.rowIndex;
        const cellIndex = cell.cellIndex;

        return data[rowIndex] && data[rowIndex][cellIndex] && data[rowIndex][cellIndex].path;
    }
}

export const HorizontalHeadersArea = AreaItem.inherit({
    ctor: function(component) {
        this.callBase(component);
        this._scrollBarWidth = 0;
    },

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
        const groupWidth = this.getGroupWidth();

        if(groupWidth && tableWidth) {
            return (tableWidth - groupWidth) >= 1;
        }
        return false;
    },

    renderScrollable: function() {
        this._groupElement.dxScrollable({
            useNative: false,
            useSimulatedScrollbar: false,
            showScrollbar: 'never',
            bounceEnabled: false,
            direction: 'horizontal',
            rtlEnabled: isRenovatedScrollable ? this.component.option('rtlEnabled') : false,
            updateManually: true
        });
    },

    updateScrollableOptions: function({ rtlEnabled }) {
        const scrollable = this._getScrollable();

        isRenovatedScrollable && scrollable.option({ rtlEnabled });
    },

    processScrollBarSpacing: function(scrollBarWidth) {
        const groupAlignment = this.option('rtlEnabled') ? 'right' : 'left';
        const groupWidth = this.getGroupWidth();

        if(groupWidth) {
            this.setGroupWidth(groupWidth - scrollBarWidth);
        }

        if(this._scrollBarWidth) {
            this._groupElement.next().remove();
        }

        this._groupElement.toggleClass(PIVOTGRID_VERTICAL_SCROLL_CLASS, scrollBarWidth > 0);

        setWidth(this._groupElement.css('float', groupAlignment), this.getGroupHeight());
        this._scrollBarWidth = scrollBarWidth;
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

export const VerticalHeadersArea = HorizontalHeadersArea.inherit({
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
        const groupHeight = this.getGroupHeight();

        if(groupHeight && tableHeight) {
            return (tableHeight - groupHeight) >= 1;
        }
        return false;
    },

    renderScrollable: function() {
        this._groupElement.dxScrollable({
            useNative: false,
            useSimulatedScrollbar: false,
            showScrollbar: 'never',
            bounceEnabled: false,
            direction: 'vertical',
            updateManually: true
        });
    },

    processScrollBarSpacing: function(scrollBarWidth) {
        const groupHeight = this.getGroupHeight();

        if(groupHeight) {
            this.setGroupHeight(groupHeight - scrollBarWidth);
        }

        if(this._scrollBarWidth) {
            this._groupElement.next().remove();
        }

        if(scrollBarWidth) {
            const $div = $('<div>');
            setWidth($div, '100%');
            setHeight($div, scrollBarWidth - 1);
            this._groupElement.after($div);
        }

        this._scrollBarWidth = scrollBarWidth;
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
        if(rowIndex !== 0 & cell.expanded && !rowClassNames.includes(PIVOTGRID_EXPAND_BORDER)) {
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
        const columnOffsetResetIndexes = [];


        if(this.getColumnsCount() - columnCount > 0) {
            return;
        }

        for(let i = 0; i < rows.length; i++) {
            for(let j = 0; j < rows[i].cells.length; j++) {
                const cell = rows[i].cells[j];
                const rowSpan = cell.rowSpan;

                if(columnOffsetResetIndexes[i]) {
                    columnOffset -= columnOffsetResetIndexes[i];
                    columnOffsetResetIndexes[i] = 0;
                }

                const diff = columnCount - (columnOffset + cell.colSpan);

                if(j === rows[i].cells.length - 1 && diff > 0) {
                    cell.colSpan = cell.colSpan + diff;
                }

                columnOffsetResetIndexes[i + rowSpan] = (columnOffsetResetIndexes[i + rowSpan] || 0) + cell.colSpan;
                columnOffset += cell.colSpan;
            }
        }
    }
});
