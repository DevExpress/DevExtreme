"use strict";

var _m_virtual_scrolling = require("../../../grids/grid_core/virtual_scrolling/m_virtual_scrolling");
var _m_core = _interopRequireDefault(require("../m_core"));
var _m_data_source_adapter = _interopRequireDefault(require("../m_data_source_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_m_core.default.registerModule('virtualScrolling', _m_virtual_scrolling.virtualScrollingModule);
_m_data_source_adapter.default.extend(_m_virtual_scrolling.dataSourceAdapterExtender);