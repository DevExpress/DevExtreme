"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelHorizontalRow = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _group_panel_horizontal_cell = require("./group_panel_horizontal_cell");
var _group_panel_props = require("./group_panel_props");
class GroupPanelHorizontalRow extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      cellTemplate,
      className,
      groupItems
    } = this.props;
    const CellTemplateComponent = (0, _index.getTemplate)(cellTemplate);
    return (0, _inferno.createVNode)(1, "tr", `dx-scheduler-group-row ${className}`, groupItems.map((_ref, index) => {
      let {
        colSpan,
        color,
        data,
        id,
        isFirstGroupCell,
        isLastGroupCell,
        key,
        text
      } = _ref;
      return (0, _inferno.createComponentVNode)(2, _group_panel_horizontal_cell.GroupPanelHorizontalCell, {
        "text": text,
        "id": id,
        "data": data,
        "index": index,
        "color": color,
        "colSpan": colSpan ?? _group_panel_horizontal_cell.GroupPanelHorizontalCellDefaultProps.colSpan,
        "isFirstGroupCell": !!isFirstGroupCell,
        "isLastGroupCell": !!isLastGroupCell,
        "cellTemplate": CellTemplateComponent
      }, key);
    }), 0);
  }
}
exports.GroupPanelHorizontalRow = GroupPanelHorizontalRow;
GroupPanelHorizontalRow.defaultProps = _group_panel_props.GroupPanelRowDefaultProps;