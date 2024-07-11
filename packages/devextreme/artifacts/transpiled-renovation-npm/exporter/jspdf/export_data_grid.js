"use strict";

exports.exportDataGrid = exportDataGrid;
var _type = require("../../core/utils/type");
var _errors = _interopRequireDefault(require("../../core/errors"));
var _export = require("./common/export");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const HOW_TO_MIGRATE_ARTICLE = 'https://supportcenter.devexpress.com/ticket/details/t1077554';
function _getFullOptions(options) {
  if (!((0, _type.isDefined)(options) && (0, _type.isObject)(options))) {
    throw Error('The "exportDataGrid" method requires a configuration object.');
  }
  if (!((0, _type.isDefined)(options.component) && (0, _type.isObject)(options.component) && options.component.NAME === 'dxDataGrid')) {
    throw Error('The "component" field must contain a DataGrid instance.');
  }
  if (!((0, _type.isDefined)(options.jsPDFDocument) && (0, _type.isObject)(options.jsPDFDocument))) {
    throw Error('The "jsPDFDocument" field must contain a jsPDF instance.');
  }
  if ((0, _type.isDefined)(options.autoTableOptions)) {
    _errors.default.log('W0001', 'Export', 'autoTableOptions', '22.1', `You can migrate from exporting to PDF with the AutoTable plugin to a new export system. See the following topic for more information: ${HOW_TO_MIGRATE_ARTICLE}`);
  }
  return _export.Export.getFullOptions(options);
}
function exportDataGrid(options) {
  return _export.Export.export(_getFullOptions(options));
}