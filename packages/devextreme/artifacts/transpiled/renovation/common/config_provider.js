"use strict";

exports.viewFunction = exports.ConfigProviderProps = exports.ConfigProvider = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _config_context = require("./config_context");
const _excluded = ["children", "rtlEnabled"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = viewModel => viewModel.props.children;
exports.viewFunction = viewFunction;
const ConfigProviderProps = exports.ConfigProviderProps = {};
class ConfigProvider extends _inferno.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
  }
  getChildContext() {
    return _extends({}, this.context, {
      [_config_context.ConfigContext.id]: this.config || _config_context.ConfigContext.defaultValue
    });
  }
  get config() {
    if (this.__getterCache['config'] !== undefined) {
      return this.__getterCache['config'];
    }
    return this.__getterCache['config'] = (() => {
      return {
        rtlEnabled: this.props.rtlEnabled
      };
    })();
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['rtlEnabled'] !== nextProps['rtlEnabled']) {
      this.__getterCache['config'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      restAttributes: this.restAttributes
    });
  }
}
exports.ConfigProvider = ConfigProvider;
ConfigProvider.defaultProps = ConfigProviderProps;