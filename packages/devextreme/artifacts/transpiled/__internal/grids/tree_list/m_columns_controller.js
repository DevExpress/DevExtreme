"use strict";

var _type = require("../../../core/utils/type");
var _m_columns_controller = require("../../grids/grid_core/columns_controller/m_columns_controller");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class TreeListColumnsController extends _m_columns_controller.ColumnsController {
  _getFirstItems(dataSourceAdapter) {
    return super._getFirstItems(dataSourceAdapter).map(node => node.data);
  }
  getFirstDataColumnIndex() {
    const visibleColumns = this.getVisibleColumns();
    const visibleColumnsLength = visibleColumns.length;
    let firstDataColumnIndex = 0;
    for (let i = 0; i <= visibleColumnsLength - 1; i++) {
      if (!(0, _type.isDefined)(visibleColumns[i].command)) {
        firstDataColumnIndex = visibleColumns[i].index;
        break;
      }
    }
    return firstDataColumnIndex;
  }
}
_m_core.default.registerModule('columns', {
  defaultOptions: _m_columns_controller.columnsControllerModule.defaultOptions,
  controllers: {
    columns: TreeListColumnsController
  }
});