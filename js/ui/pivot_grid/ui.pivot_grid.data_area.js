import $ from '../../core/renderer';
import { AreaItem } from './ui.pivot_grid.area_item';

const PIVOTGRID_AREA_CLASS = 'dx-pivotgrid-area';
const PIVOTGRID_AREA_DATA_CLASS = 'dx-pivotgrid-area-data';
const PIVOTGRID_TOTAL_CLASS = 'dx-total';
const PIVOTGRID_GRAND_TOTAL_CLASS = 'dx-grandtotal';
const PIVOTGRID_ROW_TOTAL_CLASS = 'dx-row-total';

export const DataArea = AreaItem.inherit({
    _getAreaName: function() {
        return 'data';
    },
    _createGroupElement: function() {
        return $('<div>')
            .addClass(PIVOTGRID_AREA_CLASS)
            .addClass(PIVOTGRID_AREA_DATA_CLASS)
            .css('borderTopWidth', 0);
    },

    _applyCustomStyles: function(options) {
        const cell = options.cell;
        const classArray = options.classArray;

        if(cell.rowType === 'T' || cell.columnType === 'T') {
            classArray.push(PIVOTGRID_TOTAL_CLASS);
        }
        if(cell.rowType === 'GT' || cell.columnType === 'GT') {
            classArray.push(PIVOTGRID_GRAND_TOTAL_CLASS);
        }

        if(cell.rowType === 'T' || cell.rowType === 'GT') {
            classArray.push(PIVOTGRID_ROW_TOTAL_CLASS);
        }

        if(options.rowIndex === options.rowsCount - 1) {
            options.cssArray.push('border-bottom: 0px');
        }

        this.callBase(options);
    },

    _moveFakeTable: function(scrollPos) {
        this._moveFakeTableHorizontally(scrollPos.x);
        this._moveFakeTableTop(scrollPos.y);
        this.callBase();
    },

    renderScrollable: function() {
        this._groupElement.dxScrollable({
            rtlEnabled: this.component.option('rtlEnabled'),
            bounceEnabled: false,
            updateManually: true,
        });
    },

    updateScrollableOptions: function({ useNative, ...restOptions }) {
        const scrollable = this._getScrollable();

        scrollable.option('useNative', true);
        scrollable.option(restOptions);
    },

    getScrollableDirection: function(horizontal, vertical) {
        if(horizontal && !vertical) {
            return 'horizontal';
        } else if(!horizontal && vertical) {
            return 'vertical';
        }

        return 'both';
    },

    reset: function() {
        this.callBase();
        if(this._virtualContent) {
            this._virtualContent.parent().css('height', 'auto');
        }
    },

    setVirtualContentParams: function(params) {
        this.callBase(params);

        this._virtualContent.parent().css('height', params.height);

        this._setTableCss({
            top: params.top,
            left: params.left
        });
    }
});
