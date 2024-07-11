"use strict";

exports.viewFunction = exports.DomComponentWrapperProps = exports.DomComponentWrapper = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _config_context = require("../../common/config_context");
var _get_updated_options = require("./utils/get_updated_options");
const _excluded = ["valueChange"],
  _excluded2 = ["componentProps", "componentType", "templateNames"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const normalizeProps = props => Object.keys(props).reduce((accumulator, key) => {
  if (props[key] !== undefined) {
    accumulator[key] = props[key];
  }
  return accumulator;
}, {});
const viewFunction = _ref => {
  let {
    props: {
      componentProps: {
        className
      }
    },
    restAttributes,
    widgetRef
  } = _ref;
  return normalizeProps((0, _inferno.createVNode)(1, "div", className, null, 1, _extends({}, restAttributes), null, widgetRef));
};
exports.viewFunction = viewFunction;
const DomComponentWrapperProps = exports.DomComponentWrapperProps = {};
class DomComponentWrapper extends _inferno2.InfernoComponent {
  get config() {
    if (this.context[_config_context.ConfigContext.id]) {
      return this.context[_config_context.ConfigContext.id];
    }
    return _config_context.ConfigContext.defaultValue;
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.widgetRef = (0, _inferno.createRef)();
    this.getInstance = this.getInstance.bind(this);
    this.setupWidget = this.setupWidget.bind(this);
    this.updateWidget = this.updateWidget.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.setupWidget, []), new _inferno2.InfernoEffect(this.updateWidget, [this.props.componentProps, this.config, this.props.templateNames])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.componentProps, this.config, this.props.templateNames]);
  }
  setupWidget() {
    const componentInstance = new this.props.componentType(this.widgetRef.current, this.properties);
    this.instance = componentInstance;
    return () => {
      componentInstance.dispose();
      this.instance = null;
    };
  }
  updateWidget() {
    const instance = this.getInstance();
    if (!instance) {
      return;
    }
    const updatedOptions = (0, _get_updated_options.getUpdatedOptions)(this.prevProps || {}, this.properties);
    if (updatedOptions.length) {
      instance.beginUpdate();
      updatedOptions.forEach(_ref2 => {
        let {
          path,
          value
        } = _ref2;
        instance.option(path, value);
      });
      instance.endUpdate();
    }
    this.prevProps = this.properties;
  }
  get properties() {
    var _this$config;
    const normalizedProps = normalizeProps(this.props.componentProps);
    const {
        valueChange
      } = normalizedProps,
      restProps = _objectWithoutPropertiesLoose(normalizedProps, _excluded);
    const properties = _extends({
      rtlEnabled: !!((_this$config = this.config) !== null && _this$config !== void 0 && _this$config.rtlEnabled),
      isRenovated: true
    }, restProps);
    if (valueChange) {
      properties.onValueChanged = _ref3 => {
        let {
          value
        } = _ref3;
        return valueChange(value);
      };
    }
    const templates = this.props.templateNames;
    templates.forEach(name => {
      if ((0, _inferno2.hasTemplate)(name, properties, this)) {
        properties[name] = (item, index, container) => {
          (0, _inferno2.renderTemplate)(this.props.componentProps[name], {
            item,
            index,
            container
          }, this);
        };
      }
    });
    return properties;
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded2);
    return restProps;
  }
  getInstance() {
    return this.instance;
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      widgetRef: this.widgetRef,
      config: this.config,
      properties: this.properties,
      restAttributes: this.restAttributes
    });
  }
}
exports.DomComponentWrapper = DomComponentWrapper;
DomComponentWrapper.defaultProps = DomComponentWrapperProps;