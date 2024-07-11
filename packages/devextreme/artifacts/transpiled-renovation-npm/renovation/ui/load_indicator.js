"use strict";

exports.viewFunction = exports.LoadIndicatorProps = exports.LoadIndicator = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _load_indicator = _interopRequireDefault(require("../../ui/load_indicator"));
var _dom_component_wrapper = require("./common/dom_component_wrapper");
var _base_props = require("./common/base_props");
const _excluded = ["accessKey", "activeStateEnabled", "className", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "indicatorSrc", "onClick", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _load_indicator.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const LoadIndicatorProps = exports.LoadIndicatorProps = _base_props.BaseWidgetProps;
class LoadIndicator extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get componentProps() {
    return this.props;
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
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  }
}
exports.LoadIndicator = LoadIndicator;
LoadIndicator.defaultProps = LoadIndicatorProps;