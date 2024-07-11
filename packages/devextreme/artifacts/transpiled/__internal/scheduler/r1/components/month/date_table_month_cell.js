"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTableMonthCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _index2 = require("../../utils/index");
var _date_table_cell_base = require("../base/date_table_cell_base");
class DateTableMonthCell extends _inferno2.BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.contentTemplateProps = null;
  }
  getContentTemplateProps() {
    if (this.contentTemplateProps !== null) {
      return this.contentTemplateProps;
    }
    const {
      index,
      text
    } = this.props;
    this.contentTemplateProps = {
      data: {
        text
      },
      index
    };
    return this.contentTemplateProps;
  }
  componentWillUpdate(nextProps) {
    if (this.props.index !== nextProps.index || this.props.text !== nextProps.text) {
      this.contentTemplateProps = null;
    }
  }
  render() {
    const {
      viewContext,
      dataCellTemplate,
      endDate,
      groupIndex,
      groups,
      index,
      isFirstGroupCell,
      isFocused,
      isLastGroupCell,
      isSelected,
      startDate,
      text,
      className,
      firstDayOfMonth,
      otherMonth,
      today
    } = this.props;
    const classes = _index2.renderUtils.combineClasses({
      'dx-scheduler-date-table-other-month': !!otherMonth,
      'dx-scheduler-date-table-current-date': !!today,
      'dx-scheduler-date-table-first-of-month': !!firstDayOfMonth,
      [className ?? '']: !!className
    });
    const contentTemplateProps = this.getContentTemplateProps();
    const DataCellTemplateComponent = (0, _index.getTemplate)(dataCellTemplate);
    return (0, _inferno.createComponentVNode)(2, _date_table_cell_base.DateTableCellBase, {
      "className": classes,
      "viewContext": viewContext,
      "dataCellTemplate": DataCellTemplateComponent,
      "startDate": startDate,
      "endDate": endDate,
      "text": text,
      "groups": groups,
      "groupIndex": groupIndex,
      "index": index,
      "isFirstGroupCell": isFirstGroupCell,
      "isLastGroupCell": isLastGroupCell,
      "isSelected": isSelected,
      "isFocused": isFocused,
      "contentTemplateProps": contentTemplateProps,
      children: (0, _inferno.createVNode)(1, "div", "dx-scheduler-date-table-cell-text", text, 0)
    });
  }
}
exports.DateTableMonthCell = DateTableMonthCell;
DateTableMonthCell.defaultProps = _date_table_cell_base.DateTableCallBaseDefaultProps;