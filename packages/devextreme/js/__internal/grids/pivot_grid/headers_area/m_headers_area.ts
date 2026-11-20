/* eslint-disable max-classes-per-file */
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { setHeight, setWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { ScrollOffset } from '@ts/core/utils/scroll';

import { AreaItem } from '../area_item/m_area_item';
import type {
  AreaItemComponent,
  AreaItemStyleOptions,
  AreaItemVirtualContentParams,
  AreaName,
} from '../area_item/types';
import {
  HORIZONTAL_HEADERS_AREA_CLASS as PIVOTGRID_AREA_COLUMN_CLASS,
  VERTICAL_HEADERS_AREA_CLASS as PIVOTGRID_AREA_ROW_CLASS,
} from '../keyboard_navigation/const';
import type { PivotGridCell } from '../types';

const PIVOTGRID_AREA_CLASS = 'dx-pivotgrid-area';
const PIVOTGRID_TOTAL_CLASS = 'dx-total';
const PIVOTGRID_GRAND_TOTAL_CLASS = 'dx-grandtotal';
const PIVOTGRID_ROW_TOTAL_CLASS = 'dx-row-total';
const PIVOTGRID_EXPANDED_CLASS = 'dx-pivotgrid-expanded';
const PIVOTGRID_COLLAPSED_CLASS = 'dx-pivotgrid-collapsed';
const PIVOTGRID_LAST_CELL_CLASS = 'dx-last-cell';
const PIVOTGRID_VERTICAL_SCROLL_CLASS = 'dx-vertical-scroll';
const PIVOTGRID_EXPAND_BORDER = 'dx-expand-border';

function getCellPath(
  tableElement: dxElementWrapper,
  cell: HTMLTableCellElement | undefined,
): PivotGridCell['path'] {
  if (cell) {
    const { data } = tableElement.data<{ data: PivotGridCell[][] }>();
    const { rowIndex } = cell.parentNode as HTMLTableRowElement;
    const { cellIndex } = cell;

    return data[rowIndex] && data[rowIndex][cellIndex] && data[rowIndex][cellIndex].path;
  }

  return undefined;
}

class HorizontalHeadersArea extends AreaItem {
  protected _scrollBarWidth: number;

  protected _virtualContentWidth?: number;

  constructor(component: AreaItemComponent) {
    super(component);
    this._scrollBarWidth = 0;
  }

  protected _getAreaName(): AreaName {
    return 'column';
  }

  protected _getAreaClassName(): string {
    return PIVOTGRID_AREA_COLUMN_CLASS;
  }

  protected _isCellNavigationEnabled(): boolean {
    return true;
  }

  protected _createGroupElement(): dxElementWrapper {
    return $('<div>')
      .addClass(this._getAreaClassName())
      .addClass(PIVOTGRID_AREA_CLASS);
  }

  protected _applyCustomStyles(options: AreaItemStyleOptions): void {
    const { cssArray } = options;
    const { cell } = options;
    const { rowsCount } = options;
    const { classArray } = options;

    if (options.cellIndex === options.cellsCount - 1) {
      cssArray.push(`${options.rtlEnabled ? 'border-left:' : 'border-right:'}0px`);
    }

    if ((cell.rowspan === rowsCount - options.rowIndex) || (options.rowIndex + 1 === rowsCount)) {
      cssArray.push('border-bottom-width:0px');
    }

    if (cell.type === 'T' || cell.type === 'GT') {
      classArray.push(PIVOTGRID_ROW_TOTAL_CLASS);
    }
    if (options.cell.type === 'T') {
      classArray.push(PIVOTGRID_TOTAL_CLASS);
    }
    if (options.cell.type === 'GT') {
      classArray.push(PIVOTGRID_GRAND_TOTAL_CLASS);
    }

    if (isDefined(cell.expanded)) {
      classArray.push(cell.expanded ? PIVOTGRID_EXPANDED_CLASS : PIVOTGRID_COLLAPSED_CLASS);
    }

    super._applyCustomStyles(options);
  }

  protected _getMainElementMarkup(): HTMLElement {
    const thead = domAdapter.createElement('thead');
    thead.setAttribute('class', this._getAreaClassName());
    thead.setAttribute('role', 'presentation');
    return thead;
  }

  public setVirtualContentParams(params: AreaItemVirtualContentParams): void {
    super.setVirtualContentParams(params);

    this._setTableCss({
      left: params.left,
      top: 0,
    });

    this._virtualContentWidth = params.width;
  }

  public hasScroll(): boolean {
    const tableWidth = this._virtualContent ? this._virtualContentWidth : this._tableWidth;
    const groupWidth = this.getGroupWidth();

    if (groupWidth && tableWidth) {
      return (tableWidth - groupWidth) >= 1;
    }
    return false;
  }

  public renderScrollable(): void {
    // @ts-expect-error dxScrollable is added to the renderer at runtime
    this._groupElement?.dxScrollable({
      useNative: false,
      useSimulatedScrollbar: false,
      showScrollbar: 'never',
      bounceEnabled: false,
      direction: 'horizontal',
      rtlEnabled: false,
      updateManually: true,
      useKeyboard: false,
    });
  }

  public processScrollBarSpacing(scrollBarWidth: number): void {
    const groupElement = this._groupElement;

    if (!groupElement) {
      return;
    }

    const groupAlignment = this.option('rtlEnabled') ? 'right' : 'left';
    const groupWidth = this.getGroupWidth();

    if (groupWidth) {
      this.setGroupWidth(groupWidth - scrollBarWidth);
    }

    if (this._scrollBarWidth) {
      groupElement.next().remove();
    }

    groupElement.toggleClass(PIVOTGRID_VERTICAL_SCROLL_CLASS, scrollBarWidth > 0);

    setWidth(groupElement.css('float', groupAlignment), this.getGroupHeight());
    this._scrollBarWidth = scrollBarWidth;
  }

  public getScrollPath(offset: number): PivotGridCell['path'] {
    const tableElement = this.tableElement();

    if (!tableElement) {
      return undefined;
    }

    const tableOffset = offset - (parseInt(tableElement[0].style.left, 10) || 0);
    const cells = tableElement.find('td').toArray() as HTMLTableCellElement[];
    const cell = cells.find((td) => td.colSpan === 1
      && td.offsetLeft <= tableOffset
      && td.offsetWidth + td.offsetLeft > tableOffset);

    return getCellPath(tableElement, cell);
  }

  protected _moveFakeTable(scrollPos: ScrollOffset): void {
    this._moveFakeTableHorizontally(scrollPos.left);
    super._moveFakeTable();
  }
}

class VerticalHeadersArea extends HorizontalHeadersArea {
  protected _virtualContentHeight?: number;

  protected _getAreaClassName(): string {
    return PIVOTGRID_AREA_ROW_CLASS;
  }

  protected _applyCustomStyles(options: AreaItemStyleOptions): void {
    super._applyCustomStyles(options);

    if (options.cellIndex === options.cellsCount - 1) {
      options.classArray.push(PIVOTGRID_LAST_CELL_CLASS);
    }

    if (options.rowIndex === options.rowsCount - 1) {
      options.cssArray.push('border-bottom: 0px');
    }

    if (options.cell.isWhiteSpace) {
      options.classArray.push('dx-white-space-column');
    }
  }

  protected _getAreaName(): AreaName {
    return 'row';
  }

  public setVirtualContentParams(params: AreaItemVirtualContentParams): void {
    super.setVirtualContentParams(params);

    this._setTableCss({
      top: params.top,
      left: 0,
    });
    this._virtualContentHeight = params.height;
  }

  public hasScroll(): boolean {
    const tableHeight = this._virtualContent ? this._virtualContentHeight : this._tableHeight;
    const groupHeight = this.getGroupHeight();

    if (groupHeight && tableHeight) {
      return (tableHeight - groupHeight) >= 1;
    }
    return false;
  }

  public renderScrollable(): void {
    // @ts-expect-error dxScrollable is added to the renderer at runtime
    this._groupElement?.dxScrollable({
      useNative: false,
      useSimulatedScrollbar: false,
      showScrollbar: 'never',
      bounceEnabled: false,
      direction: 'vertical',
      updateManually: true,
      useKeyboard: false,
    });
  }

  public processScrollBarSpacing(scrollBarWidth: number): void {
    const groupElement = this._groupElement;

    if (!groupElement) {
      return;
    }

    const groupHeight = this.getGroupHeight();

    if (groupHeight) {
      this.setGroupHeight(groupHeight - scrollBarWidth);
    }

    if (this._scrollBarWidth) {
      groupElement.next().remove();
    }

    if (scrollBarWidth) {
      const $div = $('<div>');
      setWidth($div, '100%');
      setHeight($div, scrollBarWidth - 1);
      groupElement.after($div);
    }

    this._scrollBarWidth = scrollBarWidth;
  }

  public getScrollPath(offset: number): PivotGridCell['path'] {
    const tableElement = this.tableElement();

    if (!tableElement) {
      return undefined;
    }

    const tableOffset = offset - (parseInt(tableElement[0].style.top, 10) || 0);
    const lastCells = tableElement.find('tr').toArray()
      .map((tr) => tr.childNodes[tr.childNodes.length - 1] as HTMLTableCellElement | undefined);
    const cell = lastCells.find((td) => td?.rowSpan === 1
      && td.offsetTop <= tableOffset
      && td.offsetHeight + td.offsetTop > tableOffset);

    return getCellPath(tableElement, cell);
  }

  protected _moveFakeTable(scrollPos: ScrollOffset): void {
    this._moveFakeTableTop(scrollPos.top);
    super._moveFakeTable(scrollPos);
  }

  protected _getRowClassNames(
    rowIndex: number,
    cell: PivotGridCell | undefined,
    rowClassNames: string[],
  ): void {
    if (rowIndex !== 0 && cell?.expanded && !rowClassNames.includes(PIVOTGRID_EXPAND_BORDER)) {
      rowClassNames.push(PIVOTGRID_EXPAND_BORDER);
    }
  }

  protected _getMainElementMarkup(): HTMLElement {
    const tbody = domAdapter.createElement('tbody');
    tbody.classList.add(this._getAreaClassName());
    tbody.setAttribute('role', 'presentation');
    return tbody;
  }

  public updateColspans(columnCount: number): void {
    const tableElement: HTMLTableElement | undefined = this.tableElement()?.[0];

    if (!tableElement) {
      return;
    }

    const { rows } = tableElement;
    let columnOffset = 0;
    const columnOffsetResetIndexes: number[] = [];

    if (this.getColumnsCount() - columnCount > 0) {
      return;
    }

    for (let i = 0; i < rows.length; i += 1) {
      for (let j = 0; j < rows[i].cells.length; j += 1) {
        const cell = rows[i].cells[j];
        const { rowSpan } = cell;

        if (columnOffsetResetIndexes[i]) {
          columnOffset -= columnOffsetResetIndexes[i];
          columnOffsetResetIndexes[i] = 0;
        }

        const diff = columnCount - (columnOffset + cell.colSpan);

        if (j === rows[i].cells.length - 1 && diff > 0) {
          cell.colSpan += diff;
        }

        columnOffsetResetIndexes[i + rowSpan] = (columnOffsetResetIndexes[i + rowSpan] ?? 0)
          + cell.colSpan;
        columnOffset += cell.colSpan;
      }
    }
  }
}

export default { HorizontalHeadersArea, VerticalHeadersArea };
export { HorizontalHeadersArea, VerticalHeadersArea };
