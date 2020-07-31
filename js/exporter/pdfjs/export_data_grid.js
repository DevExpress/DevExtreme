import { isDefined, isObject } from '../../core/utils/type';
import { Export } from './export';
import DataGrid from '../../ui/data_grid';

const privateOptions = {
};

function exportDataGrid(options) {
    return Export.export(_getFullOptions(options), privateOptions);
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
    if(!isDefined(options.autoFilterEnabled)) {
        options.autoFilterEnabled = false;
    }
    return Export.getFullOptions(options);
}

//#DEBUG
exportDataGrid.__internals = { _getFullOptions };
//#ENDDEBUG

export {
    exportDataGrid
};
