import { isDefined, isObject } from '../../core/utils/type';
import { Export } from './export';
import { noop } from '../../core/utils/common';

const privateOptions = {
    _getWorksheetFrozenState(dataProvider, cellRange) {
        return { state: 'frozen', xSplit: cellRange.from.column + dataProvider.getFrozenArea().x - 1, ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1 };
    },

    _getCustomizeCellOptions(excelCell, pivotCell) {
        return {
            excelCell: excelCell,
            pivotCell: pivotCell
        };
    },

    _isHeader() {
        return true;
    },

    _isHeaderCell(dataProvider, rowIndex, cellIndex) {
        return rowIndex < dataProvider.getColumnAreaRowCount() || cellIndex < dataProvider.getRowAreaColCount();
    },

    _isRangeMerged(dataProvider, rowIndex, cellIndex, rowspan, colspan, mergeRowFieldValues, mergeColumnFieldValues) {
        return !((dataProvider.isColumnAreaCell(rowIndex, cellIndex) && !mergeColumnFieldValues && !!colspan)
        || (dataProvider.isRowAreaCell(rowIndex, cellIndex) && !mergeRowFieldValues && !!rowspan));
    },

    _renderLoadPanel(component) {
        component._renderLoadPanel(component._dataArea.groupElement(), component.$element());
    },

    _trySetAutoFilter: noop,
    _trySetFont: noop,
    _trySetOutlineLevel: noop,
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
