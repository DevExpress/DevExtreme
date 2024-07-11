"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelVerticalRow = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _group_panel_props = require("./group_panel_props");
var _group_panel_vertical_cell = require("./group_panel_vertical_cell");
class GroupPanelVerticalRow extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      className,
      groupItems,
      cellTemplate
    } = this.props;
    const CellTemplateComponent = (0, _index.getTemplate)(cellTemplate);
    return (0, _inferno.createVNode)(1, "div", `dx-scheduler-group-row ${className}`, groupItems.map((_ref, index) => {
      let {
        color,
        data,
        id,
        key,
        text
      } = _ref;
      return (0, _inferno.createComponentVNode)(2, _group_panel_vertical_cell.GroupPanelVerticalCell, {
        "text": text,
        "id": id,
        "data": data,
        "index": index,
        "color": color,
        "cellTemplate": CellTemplateComponent
      }, key);
    }), 0);
  }
}
exports.GroupPanelVerticalRow = GroupPanelVerticalRow;
GroupPanelVerticalRow.defaultProps = _group_panel_props.GroupPanelRowDefaultProps;