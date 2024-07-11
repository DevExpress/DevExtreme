"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllDayTableComponent = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../../core/component_registrator"));
var _all_day_panel_table = require("../../../../scheduler/r1/components/base/all_day_panel_table");
var _date_table = require("./date_table");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class AllDayTableComponent extends _date_table.DateTableComponent {
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['dataCellTemplate'],
      props: ['viewData', 'viewContext', 'groupOrientation', 'leftVirtualCellWidth', 'rightVirtualCellWidth', 'topVirtualRowHeight', 'bottomVirtualRowHeight', 'addDateTableClass', 'addVerticalSizesClassToRows', 'width', 'dataCellTemplate']
    };
  }
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */
  // @ts-expect-error types error in R1
  get _viewComponent() {
    return _all_day_panel_table.AllDayTable;
  }
}
exports.AllDayTableComponent = AllDayTableComponent;
(0, _component_registrator.default)('dxAllDayTable', AllDayTableComponent);