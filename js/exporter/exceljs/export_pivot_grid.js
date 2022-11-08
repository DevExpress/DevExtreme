import { isDefined, isObject, isFunction } from '../../core/utils/type';
import { Export } from './export';
import { getDefaultAlignment } from '../../core/utils/position';
import { camelize } from '../../core/utils/inflector';
import { MergedRangesManager } from './export_merged_ranges_manager';

const FIELD_HEADERS_SEPARATOR = ', ';

class PivotGridHelpers {
    constructor(component, dataProvider, worksheet, options) {
        this.component = component;
        this.dataProvider = dataProvider;
        this.worksheet = worksheet;
        this.mergedRangesManager = new MergedRangesManager(dataProvider, worksheet);

        this.topLeftCell = options.topLeftCell;
        this.customizeCell = options.customizeCell;

        this.mergeColumnFieldValues = options.mergeColumnFieldValues;
        this.mergeRowFieldValues = options.mergeRowFieldValues;

        this.exportFilterFieldHeaders = options.exportFilterFieldHeaders;
        this.exportDataFieldHeaders = options.exportDataFieldHeaders;
        this.exportColumnFieldHeaders = options.exportColumnFieldHeaders;
        this.exportRowFieldHeaders = options.exportRowFieldHeaders;

        this.rtlEnabled = component.option('rtlEnabled');
        this.rowHeaderLayout = component.option('rowHeaderLayout');
        this.wrapText = !!component.option('wordWrapEnabled');

        this.filterFieldHeaders = this._tryGetFieldHeaders('filter');
        this.dataFieldHeaders = this._tryGetFieldHeaders('data');
        this.columnFieldHeaders = this._tryGetFieldHeaders('column');
        this.rowFieldHeaders = this._tryGetFieldHeaders('row');
    }

    _getFirstColumnIndex() {
        return this.topLeftCell.column;
    }

    _getWorksheetFrozenState(cellRange) {
        const { x, y } = this.dataProvider.getFrozenArea();

        return {
            state: 'frozen',
            xSplit: cellRange.from.column + x - 1,
            ySplit: cellRange.from.row + y + this._getFieldHeaderRowsCount() - 1,
        };
    }

    _getFieldHeaderRowsCount() {
        return 0
            + this._allowExportFilterFieldHeaders()
            + (this._allowExportDataFieldHeaders() || this._allowExportColumnFieldHeaders());
    }

    _isFrozenZone() {
        return true;
    }

    _isHeaderCell(rowIndex, cellIndex) {
        return rowIndex < this.dataProvider.getColumnAreaRowCount() || cellIndex < this.dataProvider.getRowAreaColCount();
    }

    _getDefaultFieldHeaderCellsData(value) {
        return {
            text: value,
            value: value,
        };
    }

    _isInfoCell(rowIndex, cellIndex) {
        return rowIndex < this.dataProvider.getColumnAreaRowCount() && cellIndex < this.dataProvider.getRowAreaColCount();
    }

    _allowToMergeRange(rowIndex, cellIndex, rowspan, colspan) {
        return !((this.dataProvider.isColumnAreaCell(rowIndex, cellIndex) && !this.mergeColumnFieldValues && !!colspan)
            || (this.dataProvider.isRowAreaCell(rowIndex, cellIndex) && !this.mergeRowFieldValues && !!rowspan));
    }

    _trySetAutoFilter() {}

    _trySetFont(excelCell, bold) {
        if(isDefined(bold)) {
            excelCell.font = excelCell.font || {};
            excelCell.font.bold = bold;
        }
    }

    _getFieldHeaderStyles() {
        // eslint-disable-next-line spellcheck/spell-checker
        const borderStyle = { style: 'thin', color: { argb: 'FF7E7E7E' } };

        return {
            alignment: getDefaultAlignment(this.rtlEnabled),
            bold: true,
            border: {
                bottom: borderStyle,
                left: borderStyle,
                right: borderStyle,
                top: borderStyle
            }
        };
    }

    _trySetOutlineLevel() {}

    _getAllFieldHeaders() {
        return this.dataProvider._exportController.getDataSource()._descriptions;
    }

    _tryGetFieldHeaders(area) {
        if(!this[`export${camelize(area, true)}FieldHeaders`]) {
            return [];
        }

        const fields = this._getAllFieldHeaders()[area === 'data' ? 'values' : `${area}s`]
            .filter(fieldHeader => fieldHeader.area === area);

        if(getDefaultAlignment(this.rtlEnabled) === 'right') {
            fields.sort((a, b) => b.areaIndex - a.areaIndex);
        }

        return fields.map(field => field.caption);
    }

    _customizeCell(excelCell, pivotCell, shouldPreventCall) {
        if(isFunction(this.customizeCell) && !shouldPreventCall) {
            this.customizeCell({ excelCell, pivotCell });
        }
    }

    _isRowFieldHeadersRow(rowIndex) {
        const isLastInfoRangeCell = this._isInfoCell(rowIndex, 0)
            && this.dataProvider.getCellData(rowIndex + 1, 0, true).cellSourceData.area === 'row';

        return this._allowExportRowFieldHeaders() && isLastInfoRangeCell;
    }

    _exportAllFieldHeaders(columns, setAlignment) {
        const totalCellsCount = columns.length;
        const rowAreaColCount = this.dataProvider.getRowAreaColCount();

        let rowIndex = this.topLeftCell.row;

        if(this._allowExportFilterFieldHeaders()) {
            this._exportFieldHeaders('filter', rowIndex, 0, totalCellsCount, setAlignment);
            rowIndex++;
        }

        if(this._allowExportDataFieldHeaders()) {
            this._exportFieldHeaders('data', rowIndex, 0, rowAreaColCount, setAlignment);

            if(!this._allowExportColumnFieldHeaders()) {
                this._exportFieldHeaders('column', rowIndex, rowAreaColCount, totalCellsCount - rowAreaColCount, setAlignment);
            }
        }

        if(this._allowExportColumnFieldHeaders()) {
            if(!this._allowExportDataFieldHeaders()) {
                this._exportFieldHeaders('data', rowIndex, 0, rowAreaColCount, setAlignment);
            }

            this._exportFieldHeaders('column', rowIndex, rowAreaColCount, totalCellsCount - rowAreaColCount, setAlignment);
        }
    }

    _exportFieldHeaders(area, rowIndex, startColumnIndex, totalColumnsCount, setAlignment) {
        const fieldHeaders = this[`${area}FieldHeaders`];
        const row = this.worksheet.getRow(rowIndex);

        const shouldMergeHeaderField = area !== 'row' || (area === 'row' && this.rowHeaderLayout === 'tree');

        if(shouldMergeHeaderField) {
            this.mergedRangesManager.addMergedRange(row.getCell(this.topLeftCell.column + startColumnIndex), 0, totalColumnsCount - 1);
        }

        for(let cellIndex = 0; cellIndex < totalColumnsCount; cellIndex++) {
            const excelCell = row.getCell(this.topLeftCell.column + startColumnIndex + cellIndex);

            const values = fieldHeaders;
            let cellData = [];

            const value = (values.length > totalColumnsCount || shouldMergeHeaderField)
                ? values.join(FIELD_HEADERS_SEPARATOR)
                : values[cellIndex];

            cellData = { ...this._getDefaultFieldHeaderCellsData(value), headerType: area };

            excelCell.value = value;

            this._applyHeaderStyles(excelCell, setAlignment);

            this._customizeCell(excelCell, cellData);
        }
    }

    _applyHeaderStyles(excelCell, setAlignment) {
        const { bold, alignment, border } = this._getFieldHeaderStyles();

        this._trySetFont(excelCell, bold);
        setAlignment(excelCell, this.wrapText, alignment);
        excelCell.border = border;
    }

    _allowExportRowFieldHeaders() {
        return this.rowFieldHeaders.length > 0;
    }

    _allowExportFilterFieldHeaders() {
        return this.filterFieldHeaders.length > 0;
    }

    _allowExportDataFieldHeaders() {
        return this.dataFieldHeaders.length > 0;
    }

    _allowExportColumnFieldHeaders() {
        return this.columnFieldHeaders.length > 0;
    }
}

function exportPivotGrid(options) {
    return Export.export(_getFullOptions(options), PivotGridHelpers, _getLoadPanelTargetElement, _getLoadPanelContainer);
}

function _getFullOptions(options) {
    if(!(isDefined(options) && isObject(options))) {
        throw Error('The "exportPivotGrid" method requires a configuration object.');
    }
    if(!(isDefined(options.component) && isObject(options.component) && options.component.NAME === 'dxPivotGrid')) {
        throw Error('The "component" field must contain a PivotGrid instance.');
    }
    if(!(isDefined(options.mergeRowFieldValues))) {
        options.mergeRowFieldValues = true;
    }
    if(!(isDefined(options.mergeColumnFieldValues))) {
        options.mergeColumnFieldValues = true;
    }
    if(!(isDefined(options.exportDataFieldHeaders))) {
        options.exportDataFieldHeaders = false;
    }
    if(!(isDefined(options.exportRowFieldHeaders))) {
        options.exportRowFieldHeaders = false;
    }
    if(!(isDefined(options.exportColumnFieldHeaders))) {
        options.exportColumnFieldHeaders = false;
    }
    if(!(isDefined(options.exportFilterFieldHeaders))) {
        options.exportFilterFieldHeaders = false;
    }
    return Export.getFullOptions(options);
}

function _getLoadPanelTargetElement(component) {
    return component._dataArea.groupElement();
}

function _getLoadPanelContainer(component) {
    return component.$element();
}

//#DEBUG
exportPivotGrid.__internals = { _getFullOptions };
//#ENDDEBUG

export { exportPivotGrid };
