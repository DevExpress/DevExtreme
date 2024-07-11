"use strict";

var _m_grid_view = require("../../grids/grid_core/views/m_grid_view");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class TreeListResizingController extends _m_grid_view.ResizingController {
  _getWidgetAriaLabel() {
    return 'dxTreeList-ariaTreeList';
  }
  _toggleBestFitMode(isBestFit) {
    super._toggleBestFitMode(isBestFit);
    const $rowsTable = this._rowsView.getTableElement();
    $rowsTable.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
  }
}
_m_core.default.registerModule('gridView', {
  defaultOptions: _m_grid_view.gridViewModule.defaultOptions,
  controllers: _extends({}, _m_grid_view.gridViewModule.controllers, {
    resizing: TreeListResizingController
  }),
  views: _m_grid_view.gridViewModule.views
});