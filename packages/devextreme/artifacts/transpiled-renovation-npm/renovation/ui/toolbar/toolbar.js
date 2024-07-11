"use strict";

exports.viewFunction = exports.Toolbar = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _toolbar = _interopRequireDefault(require("../../../ui/toolbar"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _toolbar_props = require("./toolbar_props");
var _type = require("../../../core/utils/type");
var _config_context = require("../../common/config_context");
var _resolve_rtl = require("../../utils/resolve_rtl");
const _excluded = ["accessKey", "activeStateEnabled", "className", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "items", "onClick", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _toolbar.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
class Toolbar extends _inferno2.BaseInfernoComponent {
  get config() {
    if (this.context[_config_context.ConfigContext.id]) {
      return this.context[_config_context.ConfigContext.id];
    }
    return _config_context.ConfigContext.defaultValue;
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
  }
  get componentProps() {
    if (this.__getterCache['componentProps'] !== undefined) {
      return this.__getterCache['componentProps'];
    }
    return this.__getterCache['componentProps'] = (() => {
      const {
        items
      } = this.props;
      const toolbarItems = items === null || items === void 0 ? void 0 : items.map(item => {
        if (!(0, _type.isObject)(item)) {
          return item;
        }
        const options = item.options ?? {};
        options.rtlEnabled = options.rtlEnabled ?? this.resolvedRtlEnabled;
        return _extends({}, item, {
          options
        });
      });
      return _extends({}, this.props, {
        items: toolbarItems
      });
    })();
  }
  get resolvedRtlEnabled() {
    const {
      rtlEnabled
    } = this.props;
    return !!(0, _resolve_rtl.resolveRtlEnabled)(rtlEnabled, this.config);
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['items'] !== nextProps['items'] || this.props['rtlEnabled'] !== nextProps['rtlEnabled'] || this.context[_config_context.ConfigContext.id] !== context[_config_context.ConfigContext.id] || this.props !== nextProps) {
      this.__getterCache['componentProps'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      componentProps: this.componentProps,
      resolvedRtlEnabled: this.resolvedRtlEnabled,
      restAttributes: this.restAttributes
    });
  }
}
exports.Toolbar = Toolbar;
Toolbar.defaultProps = _toolbar_props.ToolbarProps;