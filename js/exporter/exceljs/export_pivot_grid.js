import { isDefined, isObject, isFunction } from '../../core/utils/type';
import { Export } from './export';
import { getDefaultAlignment } from '../../core/utils/position';
import { camelize } from '../../core/utils/inflector';

const FIELD_HEADERS_SEPARATOR = ', ';

class PivotGridHelpers {
    constructor(worksheet, dataProvider, options) {
        this.worksheet = worksheet;
        this.dataProvider = dataProvider;

        this.topLeftCell = options.topLeftCell;

        this.mergeColumnFieldValues = options.mergeColumnFieldValues;
        this.mergeRowFieldValues = options.mergeRowFieldValues;

        this.exportFilterFieldHeaders = options.exportFilterFieldHeaders;
        this.exportDataFieldHeaders = options.exportDataFieldHeaders;
        this.exportColumnFieldHeaders = options.exportColumnFieldHeaders;
        this.exportRowFieldHeaders = options.exportRowFieldHeaders;

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
        let result = 0;

        if(this._allowExportFilterFieldHeaders()) {
            result++;
        }

        if(this._allowExportDataFieldHeaders() || this._allowExportColumnFieldHeaders()) {
            result++;
        }

        return result;
    }

    _getCustomizeCellOptions(excelCell, pivotCell) {
        return {
            excelCell: excelCell,
            pivotCell: pivotCell
        };
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
            alignment: getDefaultAlignment(this.dataProvider._options.rtlEnabled),
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

        let fields = this._getAllFieldHeaders()[area === 'data' ? 'values' : `${area}s`].filter(r => r.area === area);

        if(getDefaultAlignment(this.dataProvider._options.rtlEnabled) === 'right') {
            fields = fields.sort((a, b) => {
                if(a.areaIndex < b.areaIndex) {
                    return 1;
                }

                return -1;
            });
        }

        return fields.map(r => r.caption);
    }

    _customizeCell(customizeCell, excelCell, pivotCell, shouldPreventCall) {
        if(isFunction(customizeCell) && !shouldPreventCall) {
            customizeCell(this._getCustomizeCellOptions(excelCell, pivotCell));
        }
    }

    _isRowFieldHeadersRow(rowIndex) {
        const isLastInfoRangeCell = this._isInfoCell(rowIndex, 0) && this.dataProvider.getCellData(rowIndex + 1, 0, true).cellSourceData.area === 'row';

        return this._allowExportRowFieldHeaders() && isLastInfoRangeCell;
    }

    _exportAllFieldHeaders(mergedRangesManager, customizeCell, columns, wrapText, setAlignment) {
        const totalCellsCount = columns.length;
        const rowAreaColCount = this.dataProvider.getRowAreaColCount();

        let rowIndex = this.topLeftCell.row;

        if(this._allowExportFilterFieldHeaders()) {
            this._exportFieldHeaders('filter', rowIndex, mergedRangesManager, 0, totalCellsCount, customizeCell, wrapText, setAlignment);
            rowIndex++;
        }

        if(this._allowExportDataFieldHeaders()) {
            this._exportFieldHeaders('data', rowIndex, mergedRangesManager, 0, rowAreaColCount, customizeCell, wrapText, setAlignment);

            if(!this._allowExportColumnFieldHeaders()) {
                this._exportFieldHeaders('column', rowIndex, mergedRangesManager, rowAreaColCount, totalCellsCount - rowAreaColCount, customizeCell, wrapText, setAlignment);
            }
        }

        if(this._allowExportColumnFieldHeaders()) {
            if(!this._allowExportDataFieldHeaders()) {
                this._exportFieldHeaders('data', rowIndex, mergedRangesManager, 0, rowAreaColCount, customizeCell, wrapText, setAlignment);
            }

            this._exportFieldHeaders('column', rowIndex, mergedRangesManager, rowAreaColCount, totalCellsCount - rowAreaColCount, customizeCell, wrapText, setAlignment);
        }
    }

    _exportFieldHeaders(area, rowIndex, mergedRangesManager, startCellIndex, cellsCount, customizeCell, wrapText, setAlignment, rowHeaderLayout) {
        const fieldHeaders = this[`${area}FieldHeaders`];
        const row = this.worksheet.getRow(rowIndex);

        const shouldMergeHeaderField = area !== 'row' || (area === 'row' && rowHeaderLayout === 'tree');

        if(shouldMergeHeaderField) {
            mergedRangesManager.addMergedRange(row.getCell(this.topLeftCell.column + startCellIndex), 0, cellsCount - 1);
        }

        for(let cellIndex = 0; cellIndex < cellsCount; cellIndex++) {
            const excelCell = row.getCell(this.topLeftCell.column + startCellIndex + cellIndex);

            const values = fieldHeaders;
            let cellData = [];

            const value = (values.length > cellsCount || shouldMergeHeaderField)
                ? values.join(FIELD_HEADERS_SEPARATOR)
                : values[cellIndex];

            cellData = { ...this._getDefaultFieldHeaderCellsData(value), headerType: area };

            excelCell.value = value;

            this._applyHeaderStyles(excelCell, wrapText, setAlignment);

            this._customizeCell(customizeCell, excelCell, cellData);
        }
    }

    _applyHeaderStyles(excelCell, wrapText, setAlignment) {
        const { bold, alignment, border } = this._getFieldHeaderStyles();

        this._trySetFont(excelCell, bold);
        setAlignment(excelCell, wrapText, alignment);
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
