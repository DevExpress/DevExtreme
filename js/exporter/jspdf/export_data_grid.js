import { isDefined, isObject } from '../../core/utils/type';
import { Export } from './current/export';

function _getFullOptions(options) {
    if(!(isDefined(options) && isObject(options))) {
        throw Error('The "exportDataGrid" method requires a configuration object.');
    }
    if(!(isDefined(options.component) && isObject(options.component) && options.component.NAME === 'dxDataGrid')) {
        throw Error('The "component" field must contain a DataGrid instance.');
    }
    if(!(isDefined(options.jsPDFDocument) && isObject(options.jsPDFDocument))) {
        throw Error('The "jsPDFDocument" field must contain a jsPDF instance.');
    }
    return Export.getFullOptions(options);
}

//#DEBUG
exportDataGrid.__internals = { _getFullOptions };
//#ENDDEBUG

function exportDataGrid(options) {
    return Export.export(_getFullOptions(options));
}

export { exportDataGrid };
