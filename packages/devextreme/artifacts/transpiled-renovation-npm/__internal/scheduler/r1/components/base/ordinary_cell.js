"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrdinaryCellDefaultProps = exports.OrdinaryCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
const OrdinaryCellDefaultProps = exports.OrdinaryCellDefaultProps = {};
class OrdinaryCell extends _inferno2.BaseInfernoComponent {
  render() {
    const {
      children,
      className,
      colSpan,
      styles
    } = this.props;
    return (0, _inferno.createVNode)(1, "td", className, children, 0, {
      "style": (0, _inferno2.normalizeStyles)(styles),
      "colSpan": colSpan
    });
  }
}
exports.OrdinaryCell = OrdinaryCell;
OrdinaryCell.defaultProps = OrdinaryCellDefaultProps;