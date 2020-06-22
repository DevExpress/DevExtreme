import { Export } from './export';

const privateOptions = {
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
    return Export.export(_getFullOptions(options), privateOptions);
}

function _getFullOptions(options) {
    return Export.getFullOptions(options);
}

//#DEBUG
exportPivotGrid._getFullOptions = _getFullOptions;
//#ENDDEBUG

export { exportPivotGrid };
