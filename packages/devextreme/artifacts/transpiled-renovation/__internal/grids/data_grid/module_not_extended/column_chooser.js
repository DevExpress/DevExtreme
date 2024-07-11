"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnChooserView = exports.ColumnChooserController = void 0;
var _m_column_chooser = require("../../../grids/grid_core/column_chooser/m_column_chooser");
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ColumnChooserController = exports.ColumnChooserController = _m_column_chooser.columnChooserModule.controllers.columnChooser;
const ColumnChooserView = exports.ColumnChooserView = _m_column_chooser.columnChooserModule.views.columnChooserView;
_m_core.default.registerModule('columnChooser', _m_column_chooser.columnChooserModule);