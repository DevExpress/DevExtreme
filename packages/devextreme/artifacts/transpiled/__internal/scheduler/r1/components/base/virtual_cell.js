"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualCellDefaultProps = exports.VirtualCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../utils/index");
var _header_cell = require("./header_cell");
var _ordinary_cell = require("./ordinary_cell");
const VirtualCellDefaultProps = exports.VirtualCellDefaultProps = {
  width: 0,
  isHeaderCell: false
};
class VirtualCell extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      colSpan,
      isHeaderCell,
      width,
      styles
    } = this.props;
    const modifiedStyles = _index.renderUtils.addWidthToStyle(width, styles);
    const Cell = isHeaderCell ? _header_cell.HeaderCell : _ordinary_cell.OrdinaryCell;
    return (0, _inferno.createComponentVNode)(2, Cell, {
      "className": "dx-scheduler-virtual-cell",
      "styles": modifiedStyles,
      "colSpan": colSpan
    });
  }
}
exports.VirtualCell = VirtualCell;
VirtualCell.defaultProps = VirtualCellDefaultProps;