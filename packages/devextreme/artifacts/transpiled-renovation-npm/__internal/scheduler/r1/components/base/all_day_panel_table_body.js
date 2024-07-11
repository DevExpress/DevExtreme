"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllDayPanelTableBodyDefaultProps = exports.AllDayPanelTableBody = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _index2 = require("../../utils/index");
var _all_day_panel_cell = require("./all_day_panel_cell");
var _row = require("./row");
const AllDayPanelTableBodyDefaultProps = exports.AllDayPanelTableBodyDefaultProps = {
  viewData: [],
  isVerticalGroupOrientation: false,
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0
};
class AllDayPanelTableBody extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      className,
      viewData,
      viewContext,
      leftVirtualCellWidth,
      rightVirtualCellWidth,
      leftVirtualCellCount,
      rightVirtualCellCount,
      isVerticalGroupOrientation,
      dataCellTemplate
    } = this.props;
    const classes = _index2.renderUtils.combineClasses({
      'dx-scheduler-all-day-table-row': true,
      [className ?? '']: !!className
    });
    const DataCellTemplateComponent = (0, _index.getTemplate)(dataCellTemplate);
    return (0, _inferno.createComponentVNode)(2, _row.Row, {
      "leftVirtualCellWidth": leftVirtualCellWidth,
      "rightVirtualCellWidth": rightVirtualCellWidth,
      "leftVirtualCellCount": leftVirtualCellCount,
      "rightVirtualCellCount": rightVirtualCellCount,
      "className": classes,
      children: viewData.map(_ref => {
        let {
          endDate,
          groupIndex: cellGroupIndex,
          groups,
          index: cellIndex,
          isFirstGroupCell,
          isFocused,
          isLastGroupCell,
          isSelected,
          key,
          startDate
        } = _ref;
        return (0, _inferno.createComponentVNode)(2, _all_day_panel_cell.AllDayPanelCell, {
          "viewContext": viewContext,
          "isFirstGroupCell": !isVerticalGroupOrientation && isFirstGroupCell,
          "isLastGroupCell": !isVerticalGroupOrientation && isLastGroupCell,
          "startDate": startDate,
          "endDate": endDate,
          "groups": groups,
          "groupIndex": cellGroupIndex,
          "index": cellIndex,
          "dataCellTemplate": DataCellTemplateComponent,
          "isSelected": isSelected ?? false,
          "isFocused": isFocused ?? false
        }, key);
      })
    });
  }
}
exports.AllDayPanelTableBody = AllDayPanelTableBody;
AllDayPanelTableBody.defaultProps = AllDayPanelTableBodyDefaultProps;