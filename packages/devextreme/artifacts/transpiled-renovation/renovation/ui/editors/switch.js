"use strict";

exports.viewFunction = exports.SwitchPropsType = exports.SwitchProps = exports.Switch = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _switch = _interopRequireDefault(require("../../../ui/switch"));
var _editor = require("./common/editor");
var _editor_state_props = require("./common/editor_state_props");
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _message = _interopRequireDefault(require("../../../localization/message"));
const _excluded = ["accessKey", "activeStateEnabled", "className", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "isDirty", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "switchedOffText", "switchedOnText", "tabIndex", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _switch.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const SwitchProps = exports.SwitchProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  get switchedOnText() {
    return _message.default.format('dxSwitch-switchedOnText');
  },
  get switchedOffText() {
    return _message.default.format('dxSwitch-switchedOffText');
  },
  defaultValue: false,
  isReactComponentWrapper: true
})));
const SwitchPropsType = exports.SwitchPropsType = {
  get switchedOnText() {
    return SwitchProps.switchedOnText;
  },
  get switchedOffText() {
    return SwitchProps.switchedOffText;
  },
  get defaultValue() {
    return SwitchProps.defaultValue;
  },
  get readOnly() {
    return SwitchProps.readOnly;
  },
  get name() {
    return SwitchProps.name;
  },
  get validationError() {
    return SwitchProps.validationError;
  },
  get validationErrors() {
    return SwitchProps.validationErrors;
  },
  get validationMessageMode() {
    return SwitchProps.validationMessageMode;
  },
  get validationMessagePosition() {
    return SwitchProps.validationMessagePosition;
  },
  get validationStatus() {
    return SwitchProps.validationStatus;
  },
  get isValid() {
    return SwitchProps.isValid;
  },
  get isDirty() {
    return SwitchProps.isDirty;
  },
  get inputAttr() {
    return SwitchProps.inputAttr;
  },
  get className() {
    return SwitchProps.className;
  },
  get activeStateEnabled() {
    return _editor_state_props.EditorStateProps.activeStateEnabled;
  },
  get disabled() {
    return SwitchProps.disabled;
  },
  get focusStateEnabled() {
    return _editor_state_props.EditorStateProps.focusStateEnabled;
  },
  get hoverStateEnabled() {
    return _editor_state_props.EditorStateProps.hoverStateEnabled;
  },
  get tabIndex() {
    return SwitchProps.tabIndex;
  },
  get visible() {
    return SwitchProps.visible;
  },
  isReactComponentWrapper: true
};
class Switch extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value !== undefined ? this.props.value : this.props.defaultValue
    };
  }
  get componentProps() {
    return _extends({}, this.props, {
      value: this.props.value !== undefined ? this.props.value : this.state.value
    });
  }
  get restAttributes() {
    const _this$props$value = _extends({}, this.props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      restProps = _objectWithoutPropertiesLoose(_this$props$value, _excluded);
    return restProps;
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  }
}
exports.Switch = Switch;
Switch.defaultProps = SwitchPropsType;