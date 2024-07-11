"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTableMonth = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _date_table = require("../base/date_table");
var _date_table_month_cell = require("./date_table_month_cell");
const _excluded = ["viewData", "viewContext", "addDateTableClass", "addVerticalSizesClassToRows", "dataCellTemplate", "groupOrientation", "tableRef", "width"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
class DateTableMonth extends _inferno2.InfernoWrapperComponent {
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  render() {
    const _this$props = this.props,
      {
        viewData,
        viewContext,
        addDateTableClass,
        addVerticalSizesClassToRows,
        dataCellTemplate,
        groupOrientation,
        tableRef,
        width
      } = _this$props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    const DataCellTemplateComponent = (0, _index.getTemplate)(dataCellTemplate);
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _date_table.DateTable, _extends({}, restProps, {
      "viewData": viewData,
      "viewContext": viewContext,
      "groupOrientation": groupOrientation,
      "addDateTableClass": addDateTableClass,
      "dataCellTemplate": DataCellTemplateComponent,
      "cellTemplate": _date_table_month_cell.DateTableMonthCell,
      "tableRef": tableRef,
      "addVerticalSizesClassToRows": addVerticalSizesClassToRows,
      "width": width
    })));
  }
}
exports.DateTableMonth = DateTableMonth;
DateTableMonth.defaultProps = _date_table.DateTableDefaultProps;