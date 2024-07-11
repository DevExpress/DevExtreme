"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelVerticalCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _group_panel_props = require("./group_panel_props");
class GroupPanelVerticalCell extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      className,
      data,
      id,
      color,
      text,
      index,
      cellTemplate
    } = this.props;
    const CellTemplateComponent = (0, _index.getTemplate)(cellTemplate);
    return (0, _inferno.createVNode)(1, "div", `dx-scheduler-group-header ${className}`, CellTemplateComponent ? CellTemplateComponent({
      data: {
        data,
        id,
        color,
        text
      },
      index
    }) : (0, _inferno.createVNode)(1, "div", "dx-scheduler-group-header-content", text, 0), 0);
  }
}
exports.GroupPanelVerticalCell = GroupPanelVerticalCell;
GroupPanelVerticalCell.defaultProps = _group_panel_props.GroupPanelCellDefaultProps;