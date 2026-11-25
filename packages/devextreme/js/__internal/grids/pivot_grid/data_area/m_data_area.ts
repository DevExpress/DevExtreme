import type { ScrollDirection } from '@js/common';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { setTabIndex } from '@js/ui/shared/accessibility';
import type { ScrollOffset } from '@ts/core/utils/scroll';
import supportUtils from '@ts/core/utils/support';

import { AreaItem } from '../area_item/m_area_item';
import type {
  AreaItemCell,
  AreaItemStyleOptions,
  AreaItemVirtualContentParams,
  AreaName,
} from '../area_item/types';
import { calculateScrollbarWidth } from '../widget_utils';

const PIVOTGRID_AREA_CLASS = 'dx-pivotgrid-area';
const PIVOTGRID_AREA_DATA_CLASS = 'dx-pivotgrid-area-data';
const PIVOTGRID_TOTAL_CLASS = 'dx-total';
const PIVOTGRID_GRAND_TOTAL_CLASS = 'dx-grandtotal';
const PIVOTGRID_ROW_TOTAL_CLASS = 'dx-row-total';

class DataArea extends AreaItem {
  protected _getAreaName(): AreaName {
    return 'data';
  }

  public render(rootElement: dxElementWrapper, data: AreaItemCell[][]): void {
    super.render(rootElement, data);

    this._makeFirstCellFocusable();
  }

  protected _makeFirstCellFocusable(): void {
    const firstCell = this.tableElement()?.get(0)?.querySelector('td');

    if (firstCell) {
      setTabIndex(this.component, $(firstCell));
    }
  }

  protected _createGroupElement(): dxElementWrapper {
    return $('<div>')
      .addClass(PIVOTGRID_AREA_CLASS)
      .addClass(PIVOTGRID_AREA_DATA_CLASS)
      .css('borderTopWidth', 0);
  }

  protected _applyCustomStyles(options: AreaItemStyleOptions): void {
    const {
      cell,
      classArray,
      cssArray,
      rowIndex,
      rowsCount,
    } = options;

    if (cell.rowType === 'T' || cell.columnType === 'T') {
      classArray.push(PIVOTGRID_TOTAL_CLASS);
    }
    if (cell.rowType === 'GT' || cell.columnType === 'GT') {
      classArray.push(PIVOTGRID_GRAND_TOTAL_CLASS);
    }

    if (cell.rowType === 'T' || cell.rowType === 'GT') {
      classArray.push(PIVOTGRID_ROW_TOTAL_CLASS);
    }

    if (rowIndex === rowsCount - 1) {
      cssArray.push('border-bottom: 0px');
    }

    super._applyCustomStyles(options);
  }

  protected _moveFakeTable(scrollPos: ScrollOffset): void {
    this._moveFakeTableHorizontally(scrollPos.left);
    this._moveFakeTableTop(scrollPos.top);
    super._moveFakeTable();
  }

  public renderScrollable(): void {
    this.renderGroupScrollable({
      useNative: this.getUseNativeValue(),
      useSimulatedScrollbar: false,
      rtlEnabled: this.component.option('rtlEnabled'),
      bounceEnabled: false,
      updateManually: true,
      useKeyboard: false,
    });
  }

  public getUseNativeValue(): boolean {
    const useNative = this.component.option('scrolling')?.useNative;

    return useNative === 'auto'
      ? !!supportUtils.nativeScrolling
      : !!useNative;
  }

  public getScrollbarWidth(): number {
    return this.getUseNativeValue() ? calculateScrollbarWidth() : 0;
  }

  public updateScrollableOptions({ direction, rtlEnabled }: {
    direction: ScrollDirection;
    rtlEnabled: boolean | undefined;
  }): void {
    const scrollable = this._getScrollable();

    if (!scrollable) {
      return;
    }

    scrollable.option('useNative', this.getUseNativeValue());
    scrollable.option({ direction, rtlEnabled });
  }

  public getScrollableDirection(horizontal: boolean, vertical: boolean): ScrollDirection {
    if (horizontal && !vertical) {
      return 'horizontal';
    } if (!horizontal && vertical) {
      return 'vertical';
    }

    return 'both';
  }

  public reset(): void {
    super.reset();
    if (this._virtualContent) {
      this._virtualContent.parent().css('height', 'auto');
    }
  }

  public setVirtualContentParams(params: AreaItemVirtualContentParams): void {
    super.setVirtualContentParams(params);

    this._virtualContent?.parent().css('height', params.height);

    this._setTableCss({
      top: params.top,
      left: params.left,
    });
  }
}

export default { DataArea };
export { DataArea };
