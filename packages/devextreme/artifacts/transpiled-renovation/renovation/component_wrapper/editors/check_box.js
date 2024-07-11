"use strict";

exports.default = void 0;
var _editor = _interopRequireDefault(require("./editor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CheckBox extends _editor.default {
  _useTemplates() {
    return false;
  }
  _isFocused() {
    const focusTarget = this.$element()[0];
    return focusTarget.classList.contains('dx-state-focused');
  }
  getSupportedKeyNames() {
    return ['space'];
  }
  getProps() {
    const props = super.getProps();
    if (props.value !== null) {
      props.value = Boolean(props.value);
    }
    return props;
  }
}
exports.default = CheckBox;
module.exports = exports.default;
module.exports.default = exports.default;