"use strict";

exports.viewFunction = exports.RadioGroupPropsType = exports.RadioGroupProps = exports.RadioGroup = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _radio_group = _interopRequireDefault(require("../../../ui/radio_group"));
var _editor = require("./common/editor");
var _editor_state_props = require("./common/editor_state_props");
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _devices = _interopRequireDefault(require("../../../core/devices"));
const _excluded = ["accessKey", "activeStateEnabled", "className", "dataSource", "defaultValue", "disabled", "displayExpr", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "isDirty", "isValid", "items", "layout", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "tabIndex", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "valueExpr", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _radio_group.default,
    "componentProps": componentProps,
    "templateNames": ['itemTemplate']
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const RadioGroupProps = exports.RadioGroupProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  get layout() {
    return _devices.default.real().deviceType === 'tablet' ? 'horizontal' : 'vertical';
  },
  isReactComponentWrapper: true
})));
const RadioGroupPropsType = exports.RadioGroupPropsType = {
  get layout() {
    return RadioGroupProps.layout;
  },
  get readOnly() {
    return RadioGroupProps.readOnly;
  },
  get name() {
    return RadioGroupProps.name;
  },
  get validationError() {
    return RadioGroupProps.validationError;
  },
  get validationErrors() {
    return RadioGroupProps.validationErrors;
  },
  get validationMessageMode() {
    return RadioGroupProps.validationMessageMode;
  },
  get validationMessagePosition() {
    return RadioGroupProps.validationMessagePosition;
  },
  get validationStatus() {
    return RadioGroupProps.validationStatus;
  },
  get isValid() {
    return RadioGroupProps.isValid;
  },
  get isDirty() {
    return RadioGroupProps.isDirty;
  },
  get inputAttr() {
    return RadioGroupProps.inputAttr;
  },
  get defaultValue() {
    return RadioGroupProps.defaultValue;
  },
  get className() {
    return RadioGroupProps.className;
  },
  get activeStateEnabled() {
    return _editor_state_props.EditorStateProps.activeStateEnabled;
  },
  get disabled() {
    return RadioGroupProps.disabled;
  },
  get focusStateEnabled() {
    return _editor_state_props.EditorStateProps.focusStateEnabled;
  },
  get hoverStateEnabled() {
    return _editor_state_props.EditorStateProps.hoverStateEnabled;
  },
  get tabIndex() {
    return RadioGroupProps.tabIndex;
  },
  get visible() {
    return RadioGroupProps.visible;
  },
  isReactComponentWrapper: true
};
class RadioGroup extends _inferno2.BaseInfernoComponent {
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
exports.RadioGroup = RadioGroup;
RadioGroup.defaultProps = RadioGroupPropsType;