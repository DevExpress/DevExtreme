import {
    ExportHelper
} from './export_shared';

function exportPivotGrid(options) {
    return ExportHelper.export(_getFullOptions(options), _getWorksheetFrozenState, _setAutoFilter, _setFont, _getCustomizeCellOptions, _needMergeRange, _trySetOutlineLevel);
}

function _getFullOptions(options) {
    return ExportHelper.getFullOptions(options);
}

function _getWorksheetFrozenState(dataProvider, cellRange) {
    return { state: 'frozen', xSplit: cellRange.from.column + dataProvider.getFrozenArea().x - 1, ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1 };
}

function _setAutoFilter() {
    return;
}

function _setFont() {
    return;
}

function _trySetOutlineLevel() {
    return;
}

function _getCustomizeCellOptions(excelCell, pivotCell) {
    return {
        excelCell: excelCell,
        pivotCell: pivotCell
    };
}

function _needMergeRange() {
    return true;
}

export { exportPivotGrid, _getFullOptions };
