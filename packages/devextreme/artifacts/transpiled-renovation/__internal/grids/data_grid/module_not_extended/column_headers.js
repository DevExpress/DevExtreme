"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnHeadersView = void 0;
var _m_column_headers = require("../../../grids/grid_core/column_headers/m_column_headers");
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ColumnHeadersView = exports.ColumnHeadersView = _m_column_headers.columnHeadersModule.views.columnHeadersView;
_m_core.default.registerModule('columnHeaders', _m_column_headers.columnHeadersModule);