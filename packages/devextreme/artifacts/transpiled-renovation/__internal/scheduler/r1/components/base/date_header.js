"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateHeaderDefaultProps = exports.DateHeader = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _index2 = require("../../utils/index");
var _date_header_cell = require("./date_header_cell");
var _row = require("./row");
const {
  isMaterialBased
} = _index2.themeUtils.getThemeType();
const DateHeaderDefaultProps = exports.DateHeaderDefaultProps = {
  groupOrientation: 'horizontal',
  groupByDate: false,
  groups: []
};
class DateHeader extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      viewContext,
      dateCellTemplate,
      dateHeaderData: {
        dataMap,
        leftVirtualCellCount,
        leftVirtualCellWidth,
        rightVirtualCellCount,
        rightVirtualCellWidth
      },
      groupByDate,
      groupOrientation,
      groups
    } = this.props;
    const isHorizontalGrouping = (0, _index2.isHorizontalGroupingApplied)(groups, groupOrientation) && !groupByDate;
    const DateCellTemplateComponent = (0, _index.getTemplate)(dateCellTemplate);
    return (0, _inferno.createFragment)(dataMap.map((dateHeaderRow, rowIndex) => (0, _inferno.createComponentVNode)(2, _row.Row, {
      "className": "dx-scheduler-header-row",
      "leftVirtualCellWidth": leftVirtualCellWidth,
      "leftVirtualCellCount": leftVirtualCellCount,
      "rightVirtualCellWidth": rightVirtualCellWidth,
      "rightVirtualCellCount": rightVirtualCellCount,
      "isHeaderRow": true,
      children: dateHeaderRow.map(_ref => {
        let {
          colSpan,
          endDate,
          groupIndex,
          groups: cellGroups,
          index,
          isFirstGroupCell,
          isLastGroupCell,
          key,
          startDate,
          text,
          today
        } = _ref;
        return (0, _inferno.createComponentVNode)(2, _date_header_cell.DateHeaderCell, {
          "viewContext": viewContext,
          "startDate": startDate,
          "endDate": endDate,
          "groups": isHorizontalGrouping ? cellGroups : undefined,
          "groupIndex": isHorizontalGrouping ? groupIndex : undefined,
          "today": today ?? false,
          "isWeekDayCell": false,
          "isTimeCellTemplate": false,
          "index": index,
          "text": text,
          "isFirstGroupCell": isFirstGroupCell,
          "isLastGroupCell": isLastGroupCell,
          "dateCellTemplate": DateCellTemplateComponent,
          "colSpan": colSpan,
          "splitText": isMaterialBased
        }, key);
      })
    }, rowIndex.toString())), 0);
  }
}
exports.DateHeader = DateHeader;
DateHeader.defaultProps = DateHeaderDefaultProps;