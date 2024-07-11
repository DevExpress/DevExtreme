"use strict";

exports.exportDataGrid = exportDataGrid;
var _type = require("../../../core/utils/type");
var _export = require("./export");
function _getFullOptions(options) {
  if (!((0, _type.isDefined)(options) && (0, _type.isObject)(options))) {
    throw Error('The "exportDataGrid" method requires a configuration object.');
  }
  if (!((0, _type.isDefined)(options.component) && (0, _type.isObject)(options.component) && options.component.NAME === 'dxDataGrid')) {
    throw Error('The "component" field must contain a DataGrid instance.');
  }
  if (!(0, _type.isDefined)(options.selectedRowsOnly)) {
    options.selectedRowsOnly = false;
  }
  return _export.Export.getFullOptions(options);
}
function exportDataGrid(options) {
  return _export.Export.export(_getFullOptions(options));
}

//#DEBUG
exportDataGrid.__internals = {
  _getFullOptions
};
//#ENDDEBUG