"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTableBodyDefaultProps = exports.DateTableBody = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _index2 = require("../../utils/index");
var _const = require("../const");
var _all_day_panel_table_body = require("./all_day_panel_table_body");
var _date_table_cell_base = require("./date_table_cell_base");
var _layout_props = require("./layout_props");
var _row = require("./row");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DateTableBodyDefaultProps = exports.DateTableBodyDefaultProps = _extends({}, _layout_props.LayoutDefaultProps, {
  // @ts-expect-error Different types between React and Inferno
  cellTemplate: _date_table_cell_base.DateTableCellBase
});
class DateTableBody extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      viewData,
      viewContext,
      addVerticalSizesClassToRows,
      cellTemplate,
      dataCellTemplate
    } = this.props;
    const rowClasses = _index2.renderUtils.combineClasses({
      [_const.DATE_TABLE_ROW_CLASS]: true,
      'dx-scheduler-cell-sizes-vertical': addVerticalSizesClassToRows
    });
    const CellTemplateComponent = (0, _index.getTemplate)(cellTemplate);
    const DataCellTemplateComponent = (0, _index.getTemplate)(dataCellTemplate);
    return (0, _inferno.createFragment)(viewData.groupedData.map(_ref => {
      let {
        allDayPanel,
        dateTable,
        isGroupedAllDayPanel,
        key: fragmentKey
      } = _ref;
      return (0, _inferno.createFragment)([isGroupedAllDayPanel && (0, _inferno.createComponentVNode)(2, _all_day_panel_table_body.AllDayPanelTableBody, {
        "viewData": allDayPanel ?? _all_day_panel_table_body.AllDayPanelTableBodyDefaultProps.viewData,
        "viewContext": viewContext,
        "dataCellTemplate": DataCellTemplateComponent,
        "isVerticalGroupOrientation": true,
        "leftVirtualCellWidth": viewData.leftVirtualCellWidth ?? _all_day_panel_table_body.AllDayPanelTableBodyDefaultProps.leftVirtualCellWidth,
        "rightVirtualCellWidth": viewData.rightVirtualCellWidth ?? _all_day_panel_table_body.AllDayPanelTableBodyDefaultProps.rightVirtualCellWidth,
        "leftVirtualCellCount": viewData.leftVirtualCellCount,
        "rightVirtualCellCount": viewData.rightVirtualCellCount
      }), dateTable.map(_ref2 => {
        let {
          cells,
          key: rowKey
        } = _ref2;
        return (0, _inferno.createComponentVNode)(2, _row.Row, {
          "className": rowClasses,
          "leftVirtualCellWidth": viewData.leftVirtualCellWidth ?? _row.RowDefaultProps.leftVirtualCellWidth,
          "rightVirtualCellWidth": viewData.rightVirtualCellWidth ?? _row.RowDefaultProps.rightVirtualCellWidth,
          "leftVirtualCellCount": viewData.leftVirtualCellCount,
          "rightVirtualCellCount": viewData.rightVirtualCellCount,
          children: cells.map(_ref3 => {
            let {
              key: cellKey,
              endDate,
              firstDayOfMonth,
              groupIndex: cellGroupIndex,
              groups,
              index: cellIndex,
              isFirstGroupCell,
              isFocused,
              isLastGroupCell,
              isSelected,
              otherMonth,
              startDate,
              text,
              today
            } = _ref3;
            return CellTemplateComponent({
              key: cellKey,
              viewContext,
              isFirstGroupCell,
              isLastGroupCell,
              startDate,
              endDate,
              groups,
              groupIndex: cellGroupIndex,
              index: cellIndex,
              dataCellTemplate: DataCellTemplateComponent,
              text,
              today,
              otherMonth,
              firstDayOfMonth,
              isSelected,
              isFocused
            });
          })
        }, rowKey);
      })], 0, fragmentKey);
    }), 0);
  }
}
exports.DateTableBody = DateTableBody;
DateTableBody.defaultProps = DateTableBodyDefaultProps;