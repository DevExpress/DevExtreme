import { isDefined, isObject } from '../../core/utils/type';
import { Export } from './export';
import { noop } from '../../core/utils/common';

const helpers = {
    _getWorksheetFrozenState(dataProvider, cellRange) {
        return { state: 'frozen', xSplit: cellRange.from.column + dataProvider.getFrozenArea().x - 1, ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1 };
    },

    _getCustomizeCellOptions(excelCell, pivotCell) {
        return {
            excelCell: excelCell,
            pivotCell: pivotCell
        };
    },

    _isFrozenZone() {
        return true;
    },

    _isHeaderCell(dataProvider, rowIndex, cellIndex) {
        return rowIndex < dataProvider.getColumnAreaRowCount() || cellIndex < dataProvider.getRowAreaColCount();
    },

    _allowToMergeRange(dataProvider, rowIndex, cellIndex, rowspan, colspan, mergeRowFieldValues, mergeColumnFieldValues) {
        return !((dataProvider.isColumnAreaCell(rowIndex, cellIndex) && !mergeColumnFieldValues && !!colspan)
        || (dataProvider.isRowAreaCell(rowIndex, cellIndex) && !mergeRowFieldValues && !!rowspan));
    },

    _getLoadPanelTargetElement(component) {
        return component._dataArea.groupElement();
    },

    _getLoadPanelContainer(component) {
        return component.$element();
    },

    _trySetAutoFilter: noop,
    _trySetFont: noop,
    _trySetOutlineLevel: noop,
};

function exportPivotGrid(options) {
    return Export.export(_getFullOptions(options), helpers);
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
    return Export.getFullOptions(options);
}

//#DEBUG
exportPivotGrid.__internals = { _getFullOptions };
//#ENDDEBUG

export { exportPivotGrid };
