import { isDefined, isObject } from '../../core/utils/type';
import { Export } from './export';
import errors from '../../core/errors';

const privateOptions = {
    _trySetAutoFilter(dataProvider, worksheet, cellRange, autoFilterEnabled) {
        if(autoFilterEnabled) {
            if(!isDefined(worksheet.autoFilter) && dataProvider.getRowsCount() > 0) {
                const dataRange = { from: { row: cellRange.from.row + dataProvider.getHeaderRowCount() - 1, column: cellRange.from.column }, to: cellRange.to };

                worksheet.autoFilter = dataRange;
            }
        }
    },

    _trySetFont(excelCell, bold) {
        if(isDefined(bold)) {
            excelCell.font = excelCell.font || {};
            excelCell.font.bold = bold;
        }
    },

    _getWorksheetFrozenState(dataProvider, cellRange) {
        return { state: 'frozen', ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1 };
    },

    _trySetOutlineLevel(dataProvider, row, rowIndex) {
        if(rowIndex >= dataProvider.getHeaderRowCount()) {
            row.outlineLevel = dataProvider.getGroupLevel(rowIndex);
        }
    },

    _getCustomizeCellOptions(excelCell, gridCell) {
        const options = { excelCell, gridCell };

        Object.defineProperty(options, 'cell', {
            get() {
                errors.log('W0003', 'CustomizeCell handler argument', 'cell', '20.1', 'Use the \'excelCell\' field instead');
                return excelCell;
            },
        });

        return options;
    },

    _isFrozenZone(dataProvider) {
        return dataProvider.getHeaderRowCount() > 0;
    },

    _isHeaderCell(dataProvider, rowIndex) {
        return rowIndex < dataProvider.getHeaderRowCount();
    },

    _allowToMergeRange() {
        return true;
    },

    _renderLoadPanel(component) {
        const rowsView = component.getView('rowsView');
        rowsView._renderLoadPanel(rowsView.element(), rowsView.element().parent());
    }
};

function exportDataGrid(options) {
    return Export.export(_getFullOptions(options), privateOptions);
}

function _getFullOptions(options) {
    if(!(isDefined(options) && isObject(options))) {
        throw Error('The "exportDataGrid" method requires a configuration object.');
    }
    if(!(isDefined(options.component) && isObject(options.component) && options.component.NAME === 'dxDataGrid')) {
        throw Error('The "component" field must contain a DataGrid instance.');
    }
    if(!isDefined(options.selectedRowsOnly)) {
        options.selectedRowsOnly = false;
    }
    if(!isDefined(options.autoFilterEnabled)) {
        options.autoFilterEnabled = false;
    }
    return Export.getFullOptions(options);
}

//#DEBUG
exportDataGrid.__internals = { _getFullOptions };
//#ENDDEBUG

export { exportDataGrid };
