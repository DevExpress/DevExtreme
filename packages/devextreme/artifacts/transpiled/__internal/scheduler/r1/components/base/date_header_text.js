"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateHeaderText = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
const DateHeaderTextDefaultProps = {
  text: '',
  splitText: false
};
class DateHeaderText extends _inferno2.BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this._textCache = null;
  }
  getTextParts() {
    if (this._textCache !== null) {
      return this._textCache;
    }
    const {
      text
    } = this.props;
    this._textCache = text ? text.split(' ') : [''];
    return this._textCache;
  }
  componentWillUpdate(nextProps) {
    if (this.props.text !== nextProps.text) {
      this._textCache = null;
    }
  }
  render() {
    const {
      splitText,
      text
    } = this.props;
    const textParts = this.getTextParts();
    return (0, _inferno.createFragment)(splitText ? textParts.map(part => (0, _inferno.createVNode)(1, "div", "dx-scheduler-header-panel-cell-date", (0, _inferno.createVNode)(1, "span", null, part, 0), 2)) : text, 0);
  }
}
exports.DateHeaderText = DateHeaderText;
DateHeaderText.defaultProps = DateHeaderTextDefaultProps;