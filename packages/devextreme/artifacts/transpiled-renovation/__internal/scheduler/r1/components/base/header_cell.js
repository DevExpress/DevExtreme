"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _ordinary_cell = require("./ordinary_cell");
class HeaderCell extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      children,
      className,
      colSpan,
      styles
    } = this.props;
    return (0, _inferno.createVNode)(1, "th", className, children, 0, {
      "style": (0, _inferno2.normalizeStyles)(styles),
      "colSpan": colSpan
    });
  }
}
exports.HeaderCell = HeaderCell;
HeaderCell.defaultProps = _ordinary_cell.OrdinaryCellDefaultProps;