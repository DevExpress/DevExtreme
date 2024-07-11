"use strict";

var _extend = require("../../../core/utils/extend");
var _m_columns_controller = require("../../grids/grid_core/columns_controller/m_columns_controller");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_m_core.default.registerModule('columns', {
  defaultOptions() {
    return (0, _extend.extend)(true, {}, _m_columns_controller.columnsControllerModule.defaultOptions(), {
      commonColumnSettings: {
        allowExporting: true
      }
    });
  },
  controllers: _m_columns_controller.columnsControllerModule.controllers
});