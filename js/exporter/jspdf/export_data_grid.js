import { isDefined, isObject } from '../../core/utils/type';
import { Export } from './export';
import DataGrid from '../../ui/data_grid';

function exportDataGrid(options) {
    return Export.export(_getFullOptions(options));
}

function _getFullOptions(options) {
    if(!(isDefined(options) && isObject(options))) {
        throw Error('The "exportDataGrid" method requires a configuration object.');
    }
    if(!(isDefined(options.component) && isObject(options.component) && options.component instanceof DataGrid)) {
        throw Error('The "component" field must contain a DataGrid instance.');
    }
    if(!isDefined(options.selectedRowsOnly)) {
        options.selectedRowsOnly = false;
    }
    return Export._getFullOptions(options);
}

//#DEBUG
exportDataGrid.__internals = { _getFullOptions };
//#ENDDEBUG

export {
    exportDataGrid
};
