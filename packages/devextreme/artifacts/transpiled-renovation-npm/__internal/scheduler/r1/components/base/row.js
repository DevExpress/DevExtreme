"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RowDefaultProps = exports.Row = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../utils/index");
var _virtual_cell = require("./virtual_cell");
const MAX_COL_SPAN = 1000;
const RowDefaultProps = exports.RowDefaultProps = {
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  isHeaderRow: false
};
class Row extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      children,
      className,
      isHeaderRow,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      styles
    } = this.props;
    const hasLeftVirtualCell = !!leftVirtualCellCount;
    const hasRightVirtualCell = !!rightVirtualCellCount;
    return (0, _inferno.createVNode)(1, "tr", className, [hasLeftVirtualCell && leftVirtualCellCount != null && (0, _index.splitNumber)(leftVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => (0, _inferno.createComponentVNode)(2, _virtual_cell.VirtualCell, {
      "className": `left-virtual-cell-${index}`,
      "width": leftVirtualCellWidth * (colSpan / leftVirtualCellCount),
      "colSpan": colSpan,
      "isHeaderCell": isHeaderRow ?? _virtual_cell.VirtualCellDefaultProps.isHeaderCell
    })), children, hasRightVirtualCell && rightVirtualCellCount != null && (0, _index.splitNumber)(rightVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => (0, _inferno.createComponentVNode)(2, _virtual_cell.VirtualCell, {
      "className": `right-virtual-cell-${index}`,
      "width": rightVirtualCellWidth * (colSpan / rightVirtualCellCount),
      "colSpan": colSpan,
      "isHeaderCell": isHeaderRow ?? _virtual_cell.VirtualCellDefaultProps.isHeaderCell
    }))], 0, {
      "style": (0, _inferno2.normalizeStyles)(styles)
    });
  }
}
exports.Row = Row;
Row.defaultProps = RowDefaultProps;