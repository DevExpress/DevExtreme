import { getWindow } from '../../core/utils/window';
import gridCoreUtils from '../../__internal/grids/grid_core/m_utils';
import { isDate, isDefined, isNumeric } from '../../core/utils/type';
import dateLocalization from '../../common/core/localization/date';
import numberLocalization from '../../common/core/localization/number';

const window = getWindow();
const TREELIST_EMPTY_SPACE = 'dx-treelist-empty-space';
const TREELIST_TABLE = 'dx-treelist-table';

export class GanttExportHelper {
    constructor(gantt) {
        this._gantt = gantt;
        this._treeList = gantt._treeList;
        this._cache = { };
    }
    reset() {
        this._cache = { };
    }

    getTreeListTableStyle() {
        const table = this._getTreeListTable();
        const style = window.getComputedStyle(table);
        return {
            color: style.color,
            backgroundColor: style.backgroundColor,
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            textAlign: 'left',
            verticalAlign: 'middle'
        };
    }
    getTreeListColCount() {
        const headerView = this._getHeaderView();
        const widths = headerView.getColumnWidths().filter(w => w > 0);
        return widths.length;
    }
    getTreeListHeaderInfo(colIndex) {
        const element = this._getHeaderElement(colIndex);
        if(!element) return null;

        const style = window.getComputedStyle(element);
        const styleForExport = {
            color: style.color,
            padding: style.padding,
            paddingLeft: style.paddingLeft,
            paddingTop: style.paddingTop,
            paddingRight: style.paddingRight,
            paddingBottom: style.paddingBottom,
            verticalAlign: style.verticalAlign,
            width: this._getColumnWidth(colIndex)
        };
        return {
            content: element.textContent,
            styles: styleForExport
        };
    }

    getTreeListCellInfo(key, colIndex) {
        const node = this._treeList.getNodeByKey(key);
        const visibleRowIndex = this._treeList.getRowIndexByKey(key);
        const cell = visibleRowIndex > -1 ? this._getDataCell(visibleRowIndex, colIndex) : null;
        const style = cell ? window.getComputedStyle(cell) : this._getColumnCellStyle(colIndex);
        const styleForExport = {
            color: style.color,
            padding: style.padding,
            paddingLeft: style.paddingLeft,
            paddingTop: style.paddingTop,
            paddingRight: style.paddingRight,
            paddingBottom: style.paddingBottom,
            width: this._getColumnWidth(colIndex)
        };
        if(colIndex === 0) {
            styleForExport.extraLeftPadding = this._getEmptySpaceWidth(node.level);
        }

        return {
            content: cell?.textContent ?? this._getDisplayText(key, colIndex),
            styles: styleForExport
        };
    }
    getTreeListEmptyDataCellInfo() {
        return { content: this._treeList.option('noDataText') };
    }
    _ensureColumnWidthCache(colIndex) {
        this._cache['columnWidths'] ??= { };
        if(!this._cache['columnWidths'][colIndex]) {
            const header = this._getHeaderElement(colIndex);
            this._cache['columnWidths'][colIndex] = header?.clientWidth ?? 0;
        }
    }
    _getColumnWidth(colIndex) {
        this._ensureColumnWidthCache(colIndex);
        const widths = this._cache['columnWidths'];
        return widths && widths[colIndex];
    }
    _getEmptySpaceWidth(level) {
        if(!this._cache['emptyWidth']) {
            const element = this._getTreeListElement(TREELIST_EMPTY_SPACE);
            this._cache['emptyWidth'] ??= element.offsetWidth ?? 0;
        }
        return this._cache['emptyWidth'] * (level + 1);
    }
    _getColumnCellStyle(colIndex) {
        this._ensureColumnCellStyleCache(colIndex);
        return this._cache['columnStyles'][colIndex];
    }
    _ensureColumnCellStyleCache(colIndex) {
        this._cache['columnStyles'] ??= { };
        if(!this._cache['columnStyles'][colIndex]) {
            const cell = this._getDataCell(0, colIndex);
            this._cache['columnStyles'][colIndex] = window.getComputedStyle(cell);
        }
    }
    _getTask(key) {
        this._ensureTaskCache(key);
        return this._cache['tasks'][key];
    }
    _ensureTaskCache(key) {
        this._cache['tasks'] ??= { };
        this._cache['tasks'][key] ??= this._gantt._findTaskByKey(key);
    }
    _getTreeListTable() {
        return this._getTreeListElement(TREELIST_TABLE);
    }
    _getTreeListElement(className) {
        return this._treeList._$element.find('.' + className).get(0);
    }
    _getDataCell(rowIndex, colIndex) {
        const treeList = this._treeList;
        const cellElement = treeList.getCellElement(rowIndex, colIndex);
        return cellElement && cellElement.length ? cellElement[0] : cellElement;
    }
    _getHeaderElement(index) {
        return this._getHeaderView().getHeaderElement(index).get(0);
    }
    _getHeaderView() {
        return this._treeList._views.columnHeadersView;
    }
    _getDisplayText(key, colIndex) {
        const task = this._getTask(key);
        return task && this._getGridDisplayText(colIndex, task);
    }
    _getGridDisplayText(colIndex, data) {
        const columns = this._treeList.getController('columns').getColumns();
        const column = columns[colIndex];
        const field = column?.dataField;
        const format = column?.format;
        const value = gridCoreUtils.getDisplayValue(column, data[field], data, 'data');
        if(isDefined(format)) {
            if(column?.dataType === 'date' || column?.dataType === 'datetime') {
                const date = isDate(value) ? value : new Date(value);
                return dateLocalization.format(date, format);
            }
            if(isNumeric(value)) {
                return numberLocalization.format(value, format);
            }
        }
        return typeof value === 'string' ? value : value?.toString();
    }
}
