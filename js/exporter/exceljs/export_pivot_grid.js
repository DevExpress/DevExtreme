import {
    ExportHelper
} from './export_shared';

const SharedFunctions = {
    _getWorksheetFrozenState: function(dataProvider, cellRange) {
        return { state: 'frozen', xSplit: cellRange.from.column + dataProvider.getFrozenArea().x - 1, ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1 };
    },

    _setAutoFilter: function() {},
    _setFont: function() {},
    _trySetOutlineLevel: function() {},

    _getCustomizeCellOptions: function(excelCell, pivotCell) {
        return {
            excelCell: excelCell,
            pivotCell: pivotCell
        };
    },

    _needMergeRange: function() {
        return true;
    }
};

function exportPivotGrid(options) {
    return ExportHelper.export(_getFullOptions(options), SharedFunctions);
}

function _getFullOptions(options) {
    return ExportHelper.getFullOptions(options);
}

export { exportPivotGrid, _getFullOptions };
