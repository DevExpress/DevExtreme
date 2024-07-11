"use strict";

exports.viewFunction = exports.ErrorMessageProps = exports.ErrorMessage = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
const _excluded = ["className", "message"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    props: {
      className,
      message
    },
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "div", `dx-validationsummary dx-validationsummary-item ${className}`, message, 0, _extends({}, restAttributes)));
};
exports.viewFunction = viewFunction;
const ErrorMessageProps = exports.ErrorMessageProps = {
  className: '',
  message: ''
};
class ErrorMessage extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      restAttributes: this.restAttributes
    });
  }
}
exports.ErrorMessage = ErrorMessage;
ErrorMessage.defaultProps = ErrorMessageProps;