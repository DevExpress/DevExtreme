"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableDefaultProps = exports.Table = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../utils/index");
var _virtual_row = require("./virtual_row");
const TableDefaultProps = exports.TableDefaultProps = {
  topVirtualRowHeight: 0,
  bottomVirtualRowHeight: 0,
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  virtualCellsCount: 0
};
class Table extends _inferno2.BaseInfernoComponent {
  getResultStyles() {
    const {
      height,
      width,
      styles
    } = this.props;
    const heightAdded = _index.renderUtils.addHeightToStyle(height, styles);
    return _index.renderUtils.addWidthToStyle(width, heightAdded);
  }
  render() {
    const {
      className,
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      children,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      tableRef,
      virtualCellsCount
    } = this.props;
    const hasTopVirtualRow = !!topVirtualRowHeight;
    const hasBottomVirtualRow = !!bottomVirtualRowHeight;
    const resultStyles = this.getResultStyles();
    return (0, _inferno.createVNode)(1, "table", className, (0, _inferno.createVNode)(1, "tbody", null, [hasTopVirtualRow && (0, _inferno.createComponentVNode)(2, _virtual_row.VirtualRow, {
      "height": topVirtualRowHeight,
      "cellsCount": virtualCellsCount ?? _virtual_row.VirtualRowDefaultProps.cellsCount,
      "leftVirtualCellWidth": leftVirtualCellWidth ?? _virtual_row.VirtualRowDefaultProps.leftVirtualCellWidth,
      "rightVirtualCellWidth": rightVirtualCellWidth ?? _virtual_row.VirtualRowDefaultProps.rightVirtualCellWidth,
      "leftVirtualCellCount": leftVirtualCellCount,
      "rightVirtualCellCount": rightVirtualCellCount
    }), children, hasBottomVirtualRow && (0, _inferno.createComponentVNode)(2, _virtual_row.VirtualRow, {
      "height": bottomVirtualRowHeight,
      "cellsCount": virtualCellsCount ?? _virtual_row.VirtualRowDefaultProps.cellsCount,
      "leftVirtualCellWidth": leftVirtualCellWidth ?? _virtual_row.VirtualRowDefaultProps.leftVirtualCellWidth,
      "rightVirtualCellWidth": rightVirtualCellWidth ?? _virtual_row.VirtualRowDefaultProps.rightVirtualCellWidth,
      "leftVirtualCellCount": leftVirtualCellCount,
      "rightVirtualCellCount": rightVirtualCellCount
    })], 0), 2, {
      "style": (0, _inferno2.normalizeStyles)(resultStyles)
    }, null, tableRef);
  }
}
exports.Table = Table;
Table.defaultProps = TableDefaultProps;