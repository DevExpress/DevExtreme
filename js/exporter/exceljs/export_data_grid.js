import { isDefined, isObject } from '../../core/utils/type';
import { Export } from './export';
import errors from '../../core/errors';

const privateOptions = {
    _setAutoFilter: function(dataProvider, worksheet, cellRange, autoFilterEnabled) {
        if(autoFilterEnabled) {
            if(!isDefined(worksheet.autoFilter) && dataProvider.getRowsCount() > 0) {
                worksheet.autoFilter = cellRange;
            }
        }
    },

    _setFont: function(excelCell, bold) {
        if(isDefined(bold)) {
            excelCell.font = excelCell.font || {};
            excelCell.font.bold = bold;
        }
    },

    _getWorksheetFrozenState: function(dataProvider, cellRange) {
        return { state: 'frozen', ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1 };
    },

    _trySetOutlineLevel: function(dataProvider, row, rowIndex, headerRowCount) {
        if(rowIndex >= headerRowCount) {
            row.outlineLevel = dataProvider.getGroupLevel(rowIndex);
        }
    },

    _getCustomizeCellOptions: function(excelCell, gridCell) {
        const options = { excelCell, gridCell };

        Object.defineProperty(options, 'cell', {
            get: function() {
                errors.log('W0003', 'CustomizeCell handler argument', 'cell', '20.1', 'Use the \'excelCell\' field instead');
                return excelCell;
            },
        });

        return options;
    },

    _needMergeRange: function(rowIndex, headerRowCount) {
        return rowIndex < headerRowCount;
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
