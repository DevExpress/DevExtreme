import { isDefined } from '../../core/utils/type';
import errors from '../../core/errors';
import {
    ExportHelper,
    MAX_EXCEL_COLUMN_WIDTH,
} from './export_shared';

function exportDataGrid(options) {
    return ExportHelper.export(_getFullOptions(options), _getWorksheetFrozenState, _setAutoFilter, _setFont, _getCustomizeCellOptions, _needMergeRange, _trySetOutlineLevel);
}

function _getFullOptions(options) {
    const fullOptions = ExportHelper.getFullOptions(options);

    if(!isDefined(fullOptions.selectedRowsOnly)) {
        fullOptions.selectedRowsOnly = false;
    }
    if(!isDefined(fullOptions.autoFilterEnabled)) {
        fullOptions.autoFilterEnabled = false;
    }

    return fullOptions;
}

function _setAutoFilter(dataProvider, worksheet, cellRange, autoFilterEnabled) {
    if(autoFilterEnabled) {
        if(!isDefined(worksheet.autoFilter) && dataProvider.getRowsCount() > 0) {
            worksheet.autoFilter = cellRange;
        }
    }
}

function _setFont(excelCell, bold) {
    if(isDefined(bold)) {
        excelCell.font = excelCell.font || {};
        excelCell.font.bold = bold;
    }
}

function _getWorksheetFrozenState(dataProvider, cellRange) {
    return { state: 'frozen', ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1 };
}

function _trySetOutlineLevel(dataProvider, row, rowIndex, headerRowCount) {
    if(rowIndex >= headerRowCount) {
        row.outlineLevel = dataProvider.getGroupLevel(rowIndex);
    }
}

function _getCustomizeCellOptions(excelCell, gridCell) {
    const options = { excelCell, gridCell };

    Object.defineProperty(options, 'cell', {
        get: function() {
            errors.log('W0003', 'CustomizeCell handler argument', 'cell', '20.1', 'Use the \'excelCell\' field instead');
            return excelCell;
        },
    });

    return options;
}

function _needMergeRange(rowIndex, headerRowCount) {
    return rowIndex < headerRowCount;
}

export { exportDataGrid, MAX_EXCEL_COLUMN_WIDTH, _getFullOptions };
