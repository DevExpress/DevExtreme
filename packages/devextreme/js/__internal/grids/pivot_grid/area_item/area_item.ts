import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import { setWidth } from '@js/core/utils/size';
import { setStyle } from '@js/core/utils/style';
import { isDefined } from '@js/core/utils/type';
import type { ScrollOffset, ScrollToFunc } from '@ts/core/utils/scroll';
import { getMemoizeScrollTo } from '@ts/core/utils/scroll';
import { foreachColumnInfo } from '@ts/grids/grid_core/virtual_columns/virtual_columns_core';
import type Scrollable from '@ts/ui/scroll_view/scrollable';
import type { ScrollableProperties } from '@ts/ui/scroll_view/scrollable';

import { FAKE_TABLE_CLASS } from '../keyboard_navigation/const';
import type {
  AreaItemCell,
  AreaItemCellAriaIndexOptions,
  AreaItemCellContext,
  AreaItemCellPreparedArgs,
  AreaItemComponent,
  AreaItemOption,
  AreaItemScrollEvent,
  AreaItemStyleOptions,
  AreaItemTableCss,
  AreaItemVirtualContentParams,
  AreaName,
} from './types';

const PIVOTGRID_EXPAND_CLASS = 'dx-expand';

const getRealElementWidth = (element: HTMLElement): number => {
  let width = 0;

  const { offsetWidth } = element;

  if (typeof element.getBoundingClientRect === 'function') {
    const clientRect = getBoundingRect(element);
    width = clientRect.width;

    if (!width) {
      width = clientRect.right - clientRect.left;
    }
    if (width <= offsetWidth - 1) {
      width = offsetWidth;
    }
  }

  return width > 0 ? width : offsetWidth;
};

function getFakeTableOffset(
  scrollPos: number,
  elementOffset: number,
  tableSize: number,
  viewPortSize: number,
): number {
  let offset = 0;
  let halfTableCount = 0;
  const halfTableSize = tableSize / 2;

  if (scrollPos + viewPortSize - (elementOffset + tableSize) > 1) {
    if (scrollPos >= elementOffset + tableSize + halfTableSize) {
      halfTableCount = parseInt(
        String((scrollPos - (elementOffset + tableSize)) / halfTableSize),
        10,
      );
    }

    offset = elementOffset + tableSize + halfTableSize * halfTableCount;
  } else if (scrollPos < elementOffset) {
    if (scrollPos <= elementOffset - halfTableSize) {
      halfTableCount = parseInt(
        String((scrollPos - (elementOffset - halfTableSize)) / halfTableSize),
        10,
      );
    }

    offset = elementOffset - (tableSize - halfTableSize * halfTableCount);
  } else {
    offset = elementOffset;
  }

  return offset;
}

abstract class AreaItem {
  public component: AreaItemComponent;

  protected _tableElement?: dxElementWrapper;

  protected _tableHeight?: number;

  protected _colgroupElement?: dxElementWrapper;

  protected _tableWidth?: number;

  public _groupElement?: dxElementWrapper;

  protected _rootElement?: dxElementWrapper;

  protected _virtualContent?: dxElementWrapper;

  protected _fakeTable?: dxElementWrapper | null;

  protected _memoizeScrollTo?: ScrollToFunc;

  constructor(component: AreaItemComponent) {
    this.component = component;
  }

  public option<TName extends string>(optionName: TName): AreaItemOption<TName> {
    return this.component.option(optionName);
  }

  protected _getRowElement(index: number): HTMLTableRowElement | null {
    if (this._tableElement && this._tableElement.length > 0) {
      const tableElement = this._tableElement.get<HTMLTableElement>(0);
      return tableElement.rows[index];
    }

    return null;
  }

  protected _createGroupElement(): dxElementWrapper {
    return $('<div>');
  }

  protected _createTableElement(): dxElementWrapper {
    return $('<table>')
      .attr('id', `dx-${new Guid()}`)
      .attr('role', 'presentation');
  }

  protected _getCellText(cell: AreaItemCell, encodeHtml: boolean | undefined): string {
    let cellText = cell.isWhiteSpace ? '&nbsp' : cell.text || '&nbsp';

    if (encodeHtml && (cellText.includes('<') || cellText.includes('>'))) {
      cellText = $('<div>').text(cellText).html();
    }

    return cellText;
  }

  protected _getRowClassNames(
    rowIndex: number,
    cell: AreaItemCell | undefined,
    rowClassNames: string[],
  ): void;

  protected _getRowClassNames(): void {}

  protected _applyCustomStyles(options: AreaItemStyleOptions): void {
    if (options.cell.width) {
      options.cssArray.push(`min-width:${options.cell.width}px`);
    }
    if (options.cell.sorted) {
      options.classArray.push('dx-pivotgrid-sorted');
    }
  }

  protected _getMainElementMarkup(): HTMLElement {
    const tbody = domAdapter.createElement('tbody');
    tbody.setAttribute('role', 'presentation');
    return tbody;
  }

  protected _isCellNavigationEnabled(): boolean {
    return false;
  }

  protected _getColumnIndexOffset(): number {
    return this.component._dataController?.getColumnIndexOffset() || 0;
  }

  protected _getRowIndexOffset(): number {
    return this.component._dataController?.getRowIndexOffset() || 0;
  }

  protected _createColumnIndexMap(data: AreaItemCell[][]): Map<string, number> {
    const columnIndexMap = new Map<string, number>();

    foreachColumnInfo(data, (cell, visibleIndex, rowIndex, colIndex) => {
      columnIndexMap.set(`${rowIndex}-${colIndex}`, visibleIndex);
    });

    return columnIndexMap;
  }

  protected _getCellAriaRole(): string | undefined {
    const rolesByArea: Partial<Record<AreaName, string>> = {
      column: 'columnheader',
      row: 'rowheader',
      data: 'gridcell',
    };

    return rolesByArea[this._getAreaName()];
  }

  protected _setCellAriaIndexAttributes(
    td: HTMLElement,
    options: AreaItemCellAriaIndexOptions,
  ): void {
    const {
      areaName,
      rowIndex,
      columnIndex,
      columnIndexMap,
      columnIndexOffset,
      rowIndexOffset,
    } = options;

    if (areaName === 'column' || areaName === 'data') {
      const visibleColumnIndex = areaName === 'column'
        ? columnIndexMap?.get(`${rowIndex}-${columnIndex}`)
        : columnIndex;

      if (visibleColumnIndex !== undefined) {
        td.setAttribute('aria-colindex', String(visibleColumnIndex + columnIndexOffset + 1));
      }
    }

    if (areaName === 'row' || areaName === 'data') {
      td.setAttribute('aria-rowindex', String(rowIndex + rowIndexOffset + 1));
    }
  }

  private renderCellContent(
    td: HTMLElement,
    span: HTMLElement,
    cell: AreaItemCell,
    context: AreaItemCellContext,
  ): string {
    const { encodeHtml, isCellNavigationEnabled } = context;

    if (cell.rowspan) {
      td.setAttribute('rowspan', String(cell.rowspan));
    }
    if (cell.colspan) {
      td.setAttribute('colspan', String(cell.colspan));
    }

    if (isCellNavigationEnabled && !cell.isWhiteSpace) {
      td.setAttribute('tabindex', '-1');
    }

    const styleOptions: AreaItemStyleOptions = {
      cellElement: undefined,
      cell,
      cellsCount: context.cellsCount,
      cellIndex: context.cellIndex,
      rowElement: undefined,
      rowIndex: context.rowIndex,
      rowsCount: context.rowsCount,
      rtlEnabled: context.rtlEnabled,
      classArray: [],
      cssArray: [],
    };

    this._applyCustomStyles(styleOptions);

    if (styleOptions.cssArray.length) {
      setStyle(td, styleOptions.cssArray.join(';'));
    }

    if (styleOptions.classArray.length) {
      td.setAttribute('class', styleOptions.classArray.join(' '));
    }

    if (isDefined(cell.expanded)) {
      const div = domAdapter.createElement('div');
      div.classList.add('dx-expand-icon-container');
      const expandSpan = domAdapter.createElement('span');
      expandSpan.classList.add(PIVOTGRID_EXPAND_CLASS);
      div.appendChild(expandSpan);
      td.appendChild(div);
      /* eslint-disable-next-line @typescript-eslint/no-base-to-string
        -- header values are primitives or dates */
      const ariaLabel = String(cell.text ?? cell.value ?? '');
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label', encodeHtml ? ariaLabel : $('<div>').html(ariaLabel).text());
      div.setAttribute('aria-expanded', String(cell.expanded));
      div.setAttribute('tabindex', isCellNavigationEnabled ? '-1' : '0');

      // With cell navigation the cell itself is the focus target, so it
      // must expose the expanded state to assistive technologies.
      if (isCellNavigationEnabled) {
        td.setAttribute('aria-expanded', String(cell.expanded));
      }
    }

    const cellText = this._getCellText(cell, encodeHtml);

    if (isDefined(cell.wordWrapEnabled)) {
      span.style.whiteSpace = cell.wordWrapEnabled ? 'normal' : 'nowrap';
    }

    return cellText;
  }

  protected _renderTableContent(tableElement: dxElementWrapper, data: AreaItemCell[][]): void {
    const rowsCount = data.length;
    const rtlEnabled = this.option('rtlEnabled');
    const encodeHtml = this.option('encodeHtml');
    const isCellNavigationEnabled = this._isCellNavigationEnabled();

    tableElement.data('area', this._getAreaName());
    tableElement.data('data', data);
    tableElement.css('width', '');

    const tbody = this._getMainElementMarkup();
    const areaName = this._getAreaName();
    const columnIndexOffset = this._getColumnIndexOffset();
    const rowIndexOffset = this._getRowIndexOffset();
    const columnIndexMap = areaName === 'column'
      ? this._createColumnIndexMap(data)
      : null;
    const cellAriaRole = this._getCellAriaRole();

    for (let i = 0; i < rowsCount; i += 1) {
      const row = data[i];
      const rowClassNames: string[] = [];

      const tr = domAdapter.createElement('tr');
      tr.setAttribute('role', 'row');

      for (let j = 0; j < row.length; j += 1) {
        const cell = row[j];
        const td = domAdapter.createElement('td');

        if (cellAriaRole && !cell?.isWhiteSpace) {
          td.setAttribute('role', cellAriaRole);
        }

        this._getRowClassNames(i, cell, rowClassNames);

        let cellText = '';
        const span = domAdapter.createElement('span');

        if (cell) {
          cellText = this.renderCellContent(td, span, cell, {
            cellIndex: j,
            cellsCount: row.length,
            rowIndex: i,
            rowsCount,
            rtlEnabled,
            encodeHtml,
            isCellNavigationEnabled,
          });
        }

        span.innerHTML = cellText;
        td.appendChild(span);

        if (cell?.sorted) {
          const sortedSpan = domAdapter.createElement('span');
          sortedSpan.classList.add('dx-icon-sorted');
          td.appendChild(sortedSpan);
        }

        this._setCellAriaIndexAttributes(td, {
          areaName,
          rowIndex: i,
          columnIndex: j,
          columnIndexMap,
          columnIndexOffset,
          rowIndexOffset,
        });

        tr.appendChild(td);
      }

      if (rowClassNames.length) {
        tr.setAttribute('class', rowClassNames.join(' '));
      }
      tbody.appendChild(tr);
    }

    tableElement.append(tbody);

    this._triggerOnCellPrepared(tableElement, data);
  }

  protected abstract _getAreaName(): AreaName;

  protected _triggerOnCellPrepared(tableElement: dxElementWrapper, data: AreaItemCell[][]): void {
    const rowElements = tableElement.find('tr');
    const areaName = this._getAreaName();
    const onCellPrepared = this.option('onCellPrepared');
    const hasEvent = this.component._eventsStrategy.hasEvent('cellPrepared');
    const defaultActionArgs = this.component._defaultActionArgs();

    if (!onCellPrepared && !hasEvent) {
      return;
    }

    for (let rowIndex = 0; rowIndex < data.length; rowIndex += 1) {
      const row = data[rowIndex];
      const rowElement = rowElements.eq(rowIndex);

      for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
        const cell = row[columnIndex];
        const $cellElement = rowElement.children().eq(columnIndex);
        const onCellPreparedArgs: AreaItemCellPreparedArgs = {
          area: areaName,
          rowIndex,
          columnIndex,
          cellElement: getPublicElement<HTMLTableCellElement>($cellElement),
          cell,
        };
        if (hasEvent) {
          this.component._trigger('onCellPrepared', onCellPreparedArgs);
        } else {
          // @ts-expect-error the cell prepared args use internal cell and component types
          onCellPrepared?.(extend(onCellPreparedArgs, defaultActionArgs));
        }
      }
    }
  }

  protected _getRowHeight(index: number): number {
    const row = this._getRowElement(index);

    if (row?.lastChild) {
      const { height } = row.getBoundingClientRect();

      return height <= row.offsetHeight - 1 ? row.offsetHeight : height;
    }

    return 0;
  }

  protected _setRowHeight(index: number, value: number): void {
    const row = this._getRowElement(index);
    if (row) {
      row.style.height = `${value}px`;
    }
  }

  protected getRowsLength(): number {
    if (this._tableElement && this._tableElement.length > 0) {
      const tableElement = this._tableElement.get<HTMLTableElement>(0);
      return tableElement.rows.length;
    }
    return 0;
  }

  public getRowsHeight(): number[] {
    const result: number[] = [];
    const rowsLength = this.getRowsLength();

    for (let i = 0; i < rowsLength; i += 1) {
      result.push(this._getRowHeight(i));
    }
    return result;
  }

  public setRowsHeight(values: number[]): void {
    let totalHeight = 0;
    const valuesLength = values.length;

    for (let i = 0; i < valuesLength; i += 1) {
      totalHeight += values[i];
      this._setRowHeight(i, values[i]);
    }

    this._tableHeight = totalHeight;
    const tableElement = this._tableElement?.get<HTMLTableElement>(0);
    if (tableElement) {
      tableElement.style.height = `${totalHeight}px`;
    }
  }

  public getColumnsWidth(): number[] {
    const rowsLength = this.getRowsLength();
    const processedCells: boolean[][] = [];
    const result: number[] = [];
    const colSpans: number[] = [];

    if (!rowsLength) {
      return [];
    }

    for (let rowIndex = 0; rowIndex < rowsLength; rowIndex += 1) {
      processedCells[rowIndex] ||= [];
      const row = this._getRowElement(rowIndex) as HTMLTableRowElement;

      Array.from(row.cells).forEach((cell) => {
        let columnIndex = 0;
        for (; processedCells[rowIndex][columnIndex]; columnIndex += 1);

        for (let rowOffset = 0; rowOffset < cell.rowSpan; rowOffset += 1) {
          for (let columnOffset = 0; columnOffset < cell.colSpan; columnOffset += 1) {
            processedCells[rowIndex + rowOffset] ||= [];
            processedCells[rowIndex + rowOffset][columnIndex + columnOffset] = true;
          }
        }

        if (colSpans[columnIndex] === undefined || cell.colSpan < colSpans[columnIndex]) {
          result[columnIndex] = getRealElementWidth(cell);
          colSpans[columnIndex] = cell.colSpan;
        }
      });
    }

    return result;
  }

  public setColumnsWidth(values: number[]): void {
    const tableElement = this._tableElement?.get<HTMLTableElement>(0);
    const colgroupElement = this._colgroupElement;

    if (!tableElement || !colgroupElement) {
      return;
    }

    const columnsCount = this.getColumnsCount();
    const columnWidth: number[] = [];

    for (let i = 0; i < columnsCount; i += 1) {
      columnWidth.push(values[i] || 0);
    }

    if (columnsCount) {
      for (let i = columnsCount; i < values.length; i += 1) {
        columnWidth[columnsCount - 1] += values[i];
      }
    }

    colgroupElement.html('');

    for (let i = 0; i < columnsCount; i += 1) {
      const col = domAdapter.createElement('col');
      col.style.width = `${columnWidth[i]}px`;
      colgroupElement.append(col);
    }

    this._tableWidth = (columnsCount ? columnWidth : values)
      .reduce((sum, width) => sum + width, 0);
    tableElement.style.width = `${this._tableWidth}px`;
    tableElement.style.tableLayout = 'fixed';
  }

  protected resetColumnsWidth(): void {
    if (this._colgroupElement) {
      setWidth(this._colgroupElement.find('col'), 'auto');
    }
    this._tableElement?.css({
      width: '',
      tableLayout: '',
    });
  }

  public setGroupWidth(value: number | string): void {
    this._getScrollable()?.option('width', value);
  }

  public setGroupHeight(value: number | string): void {
    this._getScrollable()?.option('height', value);
  }

  protected getGroupHeight(): number | null {
    return this._getGroupElementSize('height');
  }

  public getGroupWidth(): number | null {
    return this._getGroupElementSize('width');
  }

  protected _getGroupElementSize(dimension: 'width' | 'height'): number | null {
    const groupElement = this.groupElement()?.get<HTMLElement>(0);

    if (!groupElement) {
      return null;
    }

    const size = groupElement.style[dimension];

    if (size.indexOf('px') > 0) {
      return parseFloat(size);
    }

    return null;
  }

  public groupElement(): dxElementWrapper | undefined {
    return this._groupElement;
  }

  public tableElement(): dxElementWrapper | undefined {
    return this._tableElement;
  }

  public element(): dxElementWrapper | undefined {
    return this._rootElement;
  }

  public headElement(): dxElementWrapper | undefined {
    return this._tableElement?.find('thead');
  }

  protected _setTableCss(styles: AreaItemTableCss): void {
    if (this.option('rtlEnabled')) {
      styles.right = styles.left;
      delete styles.left;
    }

    this.tableElement()?.css(styles);
  }

  public setVirtualContentParams(params: AreaItemVirtualContentParams): void {
    this._virtualContent?.css({
      width: params.width,
      height: params.height,
    });

    this.groupElement()?.addClass('dx-virtual-mode');
  }

  public disableVirtualMode(): void {
    this.groupElement()?.removeClass('dx-virtual-mode');
  }

  protected _renderVirtualContent(): void {
    if (
      !this._virtualContent
      && this._tableElement
      && this.option('scrolling.mode') === 'virtual'
    ) {
      this._virtualContent = $('<div>').addClass('dx-virtual-content').insertBefore(this._tableElement);
    }
  }

  public reset(): void {
    const tableElement = this._tableElement?.get<HTMLTableElement>(0);

    this._fakeTable?.detach();
    this._fakeTable = null;

    this.disableVirtualMode();
    this.setGroupWidth('100%');
    this.setGroupHeight('auto');

    this.resetColumnsWidth();

    if (tableElement) {
      for (const row of tableElement.rows) {
        row.style.height = '';
      }
      tableElement.style.height = '';
      tableElement.style.width = '100%';
    }
  }

  protected _updateFakeTableVisibility(): void {
    const tableElement = this.tableElement()?.get<HTMLElement>(0);
    const horizontalOffsetName = this.option('rtlEnabled') ? 'right' : 'left';
    const fakeTable = this._fakeTable;

    if (!tableElement || !fakeTable) {
      return;
    }

    const fakeTableElement = fakeTable.get<HTMLElement>(0);

    if (
      tableElement.style.top === fakeTableElement.style.top
      && fakeTableElement.style[horizontalOffsetName] === tableElement.style[horizontalOffsetName]
    ) {
      fakeTable.addClass('dx-hidden');
    } else {
      fakeTable.removeClass('dx-hidden');
    }
  }

  protected _moveFakeTableHorizontally(scrollPos: number | undefined): void {
    const rtlEnabled = this.option('rtlEnabled');
    const offsetStyleName = rtlEnabled ? 'right' : 'left';
    const tableElement = this.tableElement()?.get<HTMLElement>(0);
    const fakeTableElement = this._fakeTable?.get<HTMLElement>(0);

    if (!tableElement || !fakeTableElement) {
      return;
    }

    const tableElementOffset = parseFloat(tableElement.style[offsetStyleName]);
    const offset = getFakeTableOffset(
      Number(scrollPos),
      tableElementOffset,
      Number(this._tableWidth),
      this.getGroupWidth() ?? 0,
    );
    if (parseFloat(fakeTableElement.style[offsetStyleName]) !== offset) {
      fakeTableElement.style[offsetStyleName] = `${offset}px`;
    }
  }

  protected _moveFakeTableTop(scrollPos: number | undefined): void {
    const tableElement = this.tableElement()?.get<HTMLElement>(0);
    const fakeTableElement = this._fakeTable?.get<HTMLElement>(0);

    if (!tableElement || !fakeTableElement) {
      return;
    }

    const tableElementOffsetTop = parseFloat(tableElement.style.top);
    const offsetTop = getFakeTableOffset(
      Number(scrollPos),
      tableElementOffsetTop,
      Number(this._tableHeight),
      this.getGroupHeight() ?? 0,
    );

    if (parseFloat(fakeTableElement.style.top) !== offsetTop) {
      fakeTableElement.style.top = `${offsetTop}px`;
    }
  }

  protected _moveFakeTable(scrollPos?: ScrollOffset): void;

  protected _moveFakeTable(): void {
    this._updateFakeTableVisibility();
  }

  protected _createFakeTable(): void {
    const tableElement = this.tableElement();

    if (!this._fakeTable && tableElement && this._virtualContent) {
      this._fakeTable = tableElement
        .clone()
        .removeAttr('id')
        .attr('aria-hidden', 'true')
        .addClass(FAKE_TABLE_CLASS);
      this._fakeTable.find('[tabindex]').removeAttr('tabindex');
      this._fakeTable.appendTo(this._virtualContent);
    }
  }

  public render(rootElement: dxElementWrapper, data: AreaItemCell[][]): void {
    if (this._tableElement) {
      try {
        this._tableElement.get(0).innerHTML = '';
      } catch (e) {
        this._tableElement.empty();
      }
      this._tableElement.removeAttr('style');
    } else {
      this._groupElement = this._createGroupElement();
      this._tableElement = this._createTableElement();

      this._tableElement.appendTo(this._groupElement);
      this._groupElement.appendTo(rootElement);
      this._rootElement = rootElement;
    }

    this._colgroupElement = $('<colgroup>').appendTo(this._tableElement);
    this._renderTableContent(this._tableElement, data);

    this._renderVirtualContent();
  }

  public _getScrollable(): Scrollable | undefined {
    const scrollable: Scrollable | undefined = this.groupElement()?.data('dxScrollable');
    return scrollable;
  }

  protected renderGroupScrollable(options: ScrollableProperties): void {
    // @ts-expect-error dxScrollable is not defined in dxElementWrapper
    this._groupElement?.dxScrollable(options);
  }

  protected _getMemoizeScrollTo(scrollable: Scrollable): ScrollToFunc {
    this._memoizeScrollTo ??= getMemoizeScrollTo(() => scrollable);
    return this._memoizeScrollTo;
  }

  protected _getMaxLeftOffset(scrollable: Scrollable): number {
    const containerElement = $(scrollable.container()).get(0);

    return containerElement.scrollWidth - containerElement.clientWidth;
  }

  public on(eventName: string, handler: (e: AreaItemScrollEvent) => void): this {
    const scrollable = this._getScrollable();

    if (scrollable) {
      scrollable.on(eventName, (e: AreaItemScrollEvent): void => {
        if (this.option('rtlEnabled') && isDefined(e.scrollOffset.left)) {
          e.scrollOffset.left = this._getMaxLeftOffset(scrollable) - e.scrollOffset.left;
        }
        handler(e);
      });
    }
    return this;
  }

  public off(eventName: string): this {
    const scrollable = this._getScrollable();
    if (scrollable) {
      scrollable.off(eventName);
    }
    return this;
  }

  public scrollTo(pos: ScrollOffset, force = false): void {
    const scrollable = this._getScrollable();
    if (!scrollable) {
      return;
    }

    const rtlEnabled = this.option('rtlEnabled');
    const areaName = this._getAreaName();
    const scrollablePos = {
      ...pos,
      left: rtlEnabled && (areaName === 'column' || areaName === 'data')
        ? this._getMaxLeftOffset(scrollable) - Number(pos.left)
        : pos.left,
    };

    const memoizeScrollTo = this._getMemoizeScrollTo(scrollable);
    memoizeScrollTo(scrollablePos, force);

    if (this._virtualContent) {
      this._createFakeTable();
      this._moveFakeTable(pos);
    }
  }

  public scrollToElement(element: Element | dxElementWrapper): void {
    const scrollable = this._getScrollable();
    if (scrollable) {
      scrollable.scrollToElement(element);
    }
  }

  public updateScrollable(): DeferredObj<unknown> | undefined {
    const scrollable = this._getScrollable();
    if (scrollable) {
      return scrollable.update();
    }

    return undefined;
  }

  public getColumnsCount(): number {
    let columnCount = 0;
    const row = this._getRowElement(0);

    if (row) {
      for (const cell of row.cells) {
        columnCount += cell.colSpan;
      }
    }

    return columnCount;
  }

  public getData(): AreaItemCell[][] {
    const tableElement = this._tableElement;
    const data: AreaItemCell[][] = tableElement ? tableElement.data('data') : [];
    return data;
  }
}

export default { AreaItem, getRealElementWidth };
export { AreaItem, getRealElementWidth };
