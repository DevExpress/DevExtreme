"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderPanel = void 0;
var _m_header_panel = require("../../../grids/grid_core/header_panel/m_header_panel");
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const HeaderPanel = exports.HeaderPanel = _m_header_panel.headerPanelModule.views.headerPanel;
_m_core.default.registerModule('headerPanel', _m_header_panel.headerPanelModule);