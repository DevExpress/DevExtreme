"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelHorizontalCellDefaultProps = exports.GroupPanelHorizontalCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _index2 = require("../../utils/index");
var _group_panel_props = require("./group_panel_props");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const GroupPanelHorizontalCellDefaultProps = exports.GroupPanelHorizontalCellDefaultProps = _extends({}, _group_panel_props.GroupPanelCellDefaultProps, {
  isFirstGroupCell: false,
  isLastGroupCell: false,
  colSpan: 1
});
class GroupPanelHorizontalCell extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      cellTemplate,
      colSpan,
      color,
      data,
      id,
      index,
      text,
      className,
      isFirstGroupCell,
      isLastGroupCell
    } = this.props;
    const classes = _index2.renderUtils.combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-first-group-cell': isFirstGroupCell,
      'dx-scheduler-last-group-cell': isLastGroupCell,
      [className ?? '']: !!className
    });
    const CellTemplateComponent = (0, _index.getTemplate)(cellTemplate);
    return (0, _inferno.createVNode)(1, "th", classes, (0, _inferno.createVNode)(1, "div", "dx-scheduler-group-header-content", CellTemplateComponent ? CellTemplateComponent({
      data: {
        data,
        id,
        color,
        text
      },
      index
    }) : (0, _inferno.createVNode)(1, "div", null, text, 0), 0), 2, {
      "colSpan": colSpan
    });
  }
}
exports.GroupPanelHorizontalCell = GroupPanelHorizontalCell;
GroupPanelHorizontalCell.defaultProps = GroupPanelHorizontalCellDefaultProps;