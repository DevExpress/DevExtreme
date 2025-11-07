// eslint-disable-next-line @stylistic/max-len
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type */
import dateLocalization from '@js/common/core/localization/date';
import numberLocalization from '@js/common/core/localization/number';
import { isDate, isDefined, isNumeric } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type TreeList from '@ts/grids/tree_list/m_widget_base';
import type Gantt from '@ts/ui/gantt/ui.gantt';

const window = getWindow();
const TREELIST_EMPTY_SPACE = 'dx-treelist-empty-space';
const TREELIST_TABLE = 'dx-treelist-table';

export class GanttExportHelper {
  _gantt: Gantt;

  _treeList?: TreeList;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _cache: any;

  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this._treeList = gantt._treeList;
    this._cache = {};
  }

  reset(): void {
    this._cache = {};
  }

  getTreeListTableStyle() {
    const table = this._getTreeListTable();
    // @ts-expect-error ts-error
    const style = window.getComputedStyle(table);
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      textAlign: 'left',
      verticalAlign: 'middle',
    };
  }

  getTreeListColCount() {
    const headerView = this._getHeaderView();
    const widths = headerView.getColumnWidths().filter((w) => w > 0);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return widths.length;
  }

  getTreeListHeaderInfo(colIndex) {
    const element = this._getHeaderElement(colIndex);
    if (!element) return null;

    const style = window.getComputedStyle(element);
    const styleForExport = {
      color: style.color,
      padding: style.padding,
      paddingLeft: style.paddingLeft,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      verticalAlign: style.verticalAlign,
      width: this._getColumnWidth(colIndex),
    };
    return {
      content: element.textContent,
      styles: styleForExport,
    };
  }

  getTreeListCellInfo(key, colIndex) {
    // @ts-expect-error ts-error
    const node = this._treeList?.getNodeByKey(key);
    // @ts-expect-error ts-error
    const visibleRowIndex = this._treeList?.getRowIndexByKey(key);
    const cell = visibleRowIndex > -1
      ? this._getDataCell(visibleRowIndex, colIndex)
      : null;
    const style = cell
      ? window.getComputedStyle(cell)
      : this._getColumnCellStyle(colIndex);
    const styleForExport = {
      color: style.color,
      padding: style.padding,
      paddingLeft: style.paddingLeft,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      width: this._getColumnWidth(colIndex),
    };
    if (colIndex === 0) {
      // @ts-expect-error ts-error
      styleForExport.extraLeftPadding = this._getEmptySpaceWidth(node.level);
    }

    return {
      content: cell?.textContent ?? this._getDisplayText(key, colIndex),
      styles: styleForExport,
    };
  }

  getTreeListEmptyDataCellInfo() {
    return { content: this._treeList?.option('noDataText') };
  }

  _ensureColumnWidthCache(colIndex) {
    this._cache.columnWidths ??= {};
    if (!this._cache.columnWidths[colIndex]) {
      const header = this._getHeaderElement(colIndex);
      this._cache.columnWidths[colIndex] = header?.clientWidth ?? 0;
    }
  }

  _getColumnWidth(colIndex) {
    this._ensureColumnWidthCache(colIndex);
    const widths = this._cache.columnWidths;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return widths?.[colIndex];
  }

  _getEmptySpaceWidth(level) {
    if (!this._cache.emptyWidth) {
      const element = this._getTreeListElement(TREELIST_EMPTY_SPACE);
      // @ts-expect-error ts-error
      this._cache.emptyWidth ??= element?.offsetWidth ?? 0;
    }
    return this._cache.emptyWidth * (level + 1);
  }

  _getColumnCellStyle(colIndex) {
    this._ensureColumnCellStyleCache(colIndex);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._cache.columnStyles[colIndex];
  }

  _ensureColumnCellStyleCache(colIndex) {
    this._cache.columnStyles ??= {};
    if (!this._cache.columnStyles[colIndex]) {
      const cell = this._getDataCell(0, colIndex);
      this._cache.columnStyles[colIndex] = window.getComputedStyle(cell);
    }
  }

  _getTask(key) {
    this._ensureTaskCache(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._cache.tasks[key];
  }

  _ensureTaskCache(key): void {
    this._cache.tasks ??= {};
    this._cache.tasks[key] ??= this._gantt._findTaskByKey(key);
  }

  _getTreeListTable() {
    return this._getTreeListElement(TREELIST_TABLE);
  }

  _getTreeListElement(className: string) {
    return this._treeList?.$element().find(`.${className}`).get(0);
  }

  _getDataCell(rowIndex, colIndex) {
    const treeList = this._treeList;
    // @ts-expect-error ts-error
    const cellElement = treeList?.getCellElement(rowIndex, colIndex);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cellElement?.length ? cellElement[0] : cellElement;
  }

  _getHeaderElement(index) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getHeaderView().getHeaderElement(index).get(0);
  }

  _getHeaderView() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._treeList?._views.columnHeadersView;
  }

  _getDisplayText(key, colIndex) {
    const task = this._getTask(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return task && this._getGridDisplayText(colIndex, task);
  }

  _getGridDisplayText(colIndex, data) {
    // @ts-expect-error ts-error
    const columns = this._treeList?.getController('columns').getVisibleColumns();
    const column = columns[colIndex];
    const field = column?.dataField;
    const format = column?.format;
    const value = gridCoreUtils.getDisplayValue(
      column,
      data[field],
      data,
      'data',
    );
    if (isDefined(format)) {
      if (column?.dataType === 'date' || column?.dataType === 'datetime') {
        const date = isDate(value) ? value : new Date(value);
        return dateLocalization.format(date, format);
      }
      if (isNumeric(value)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return numberLocalization.format(value, format);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return typeof value === 'string' ? value : value?.toString();
  }
}
