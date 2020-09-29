import { isDefined, isObject } from '../../core/utils/type';
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
    },

    _renderLoadPanel: function(component) {
        component._renderLoadPanel(component._dataArea.groupElement(), component.$element());
    }
};

function exportPivotGrid(options) {
    return Export.export(_getFullOptions(options), privateOptions);
}

function _getFullOptions(options) {
    if(!(isDefined(options) && isObject(options))) {
        throw Error('The "exportPivotGrid" method requires a configuration object.');
    }
    if(!(isDefined(options.component) && isObject(options.component) && options.component.NAME === 'dxPivotGrid')) {
        throw Error('The "component" field must contain a PivotGrid instance.');
    }
    return Export.getFullOptions(options);
}

//#DEBUG
exportPivotGrid.__internals = { _getFullOptions };
//#ENDDEBUG

export { exportPivotGrid };
