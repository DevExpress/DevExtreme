"use strict";

exports.viewFunction = exports.OverlayProps = exports.Overlay = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _ui = _interopRequireDefault(require("../../../ui/overlay/ui.overlay"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _base_props = require("../common/base_props");
const _excluded = ["_checkParentVisibility", "accessKey", "activeStateEnabled", "animation", "className", "container", "contentTemplate", "disabled", "focusStateEnabled", "height", "hideOnOutsideClick", "hideOnParentScroll", "hint", "hoverStateEnabled", "integrationOptions", "maxWidth", "onClick", "onKeyDown", "position", "propagateOutsideClick", "rtlEnabled", "shading", "tabIndex", "templatesRenderAsynchronously", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _ui.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const OverlayProps = exports.OverlayProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  integrationOptions: Object.freeze({}),
  templatesRenderAsynchronously: false,
  shading: true,
  hideOnOutsideClick: false,
  hideOnParentScroll: false,
  animation: Object.freeze({
    type: 'pop',
    duration: 300,
    to: {
      opacity: 0,
      scale: 0.55
    },
    from: {
      opacity: 1,
      scale: 1
    }
  }),
  visible: false,
  propagateOutsideClick: true,
  _checkParentVisibility: false,
  rtlEnabled: false,
  contentTemplate: 'content',
  maxWidth: null,
  isReactComponentWrapper: true
})));
class Overlay extends _inferno2.BaseInfernoComponent {
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
exports.Overlay = Overlay;
Overlay.defaultProps = OverlayProps;