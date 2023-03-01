import $ from '../../core/renderer';
import { AreaItem } from './ui.pivot_grid.area_item';
import { nativeScrolling } from '../../core/utils/support';
import { calculateScrollbarWidth } from './utils/calculate_scrollbar_width';
const PIVOTGRID_AREA_CLASS = 'dx-pivotgrid-area';
const PIVOTGRID_AREA_DATA_CLASS = 'dx-pivotgrid-area-data';
const PIVOTGRID_TOTAL_CLASS = 'dx-total';
const PIVOTGRID_GRAND_TOTAL_CLASS = 'dx-grandtotal';
const PIVOTGRID_ROW_TOTAL_CLASS = 'dx-row-total';
export const DataArea = AreaItem.inherit({
    _getAreaName() {
        return 'data';
    },
    _createGroupElement() {
        return $('<div>')
            .addClass(PIVOTGRID_AREA_CLASS)
            .addClass(PIVOTGRID_AREA_DATA_CLASS)
            .css('borderTopWidth', 0);
    },
    _applyCustomStyles(options) {
        const { cell } = options;
        const { classArray } = options;
        if (cell.rowType === 'T' || cell.columnType === 'T') {
            classArray.push(PIVOTGRID_TOTAL_CLASS);
        }
        if (cell.rowType === 'GT' || cell.columnType === 'GT') {
            classArray.push(PIVOTGRID_GRAND_TOTAL_CLASS);
        }
        if (cell.rowType === 'T' || cell.rowType === 'GT') {
            classArray.push(PIVOTGRID_ROW_TOTAL_CLASS);
        }
        if (options.rowIndex === options.rowsCount - 1) {
            options.cssArray.push('border-bottom: 0px');
        }
        this.callBase(options);
    },
    _moveFakeTable(scrollPos) {
        this._moveFakeTableHorizontally(scrollPos.x);
        this._moveFakeTableTop(scrollPos.y);
        this.callBase();
    },
    renderScrollable() {
        this._groupElement.dxScrollable({
            useNative: this.getUseNativeValue(),
            useSimulatedScrollbar: false,
            rtlEnabled: this.component.option('rtlEnabled'),
            bounceEnabled: false,
            updateManually: true,
        });
    },
    getUseNativeValue() {
        const { useNative } = this.component.option('scrolling');
        return useNative === 'auto'
            ? !!nativeScrolling
            : !!useNative;
    },
    getScrollbarWidth() {
        return this.getUseNativeValue() ? calculateScrollbarWidth() : 0;
    },
    updateScrollableOptions({ direction, rtlEnabled }) {
        const scrollable = this._getScrollable();
        scrollable.option('useNative', this.getUseNativeValue());
        scrollable.option({ direction, rtlEnabled });
    },
    getScrollableDirection(horizontal, vertical) {
        if (horizontal && !vertical) {
            return 'horizontal';
        }
        if (!horizontal && vertical) {
            return 'vertical';
        }
        return 'both';
    },
    reset() {
        this.callBase();
        if (this._virtualContent) {
            this._virtualContent.parent().css('height', 'auto');
        }
    },
    setVirtualContentParams(params) {
        this.callBase(params);
        this._virtualContent.parent().css('height', params.height);
        this._setTableCss({
            top: params.top,
            left: params.left,
        });
    },
});
