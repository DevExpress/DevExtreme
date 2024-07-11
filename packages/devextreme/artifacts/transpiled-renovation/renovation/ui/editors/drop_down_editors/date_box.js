"use strict";

exports.viewFunction = exports.DateBoxPropsType = exports.DateBoxProps = exports.DateBox = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _date_box = _interopRequireDefault(require("../../../../ui/date_box"));
var _dom_component_wrapper = require("../../common/dom_component_wrapper");
var _editor = require("../common/editor");
var _editor_state_props = require("../common/editor_state_props");
var _editor_label_props = require("../common/editor_label_props");
const _excluded = ["accessKey", "activeStateEnabled", "calendarOptions", "className", "defaultValue", "disabled", "field", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "isDirty", "isValid", "label", "labelMode", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "tabIndex", "type", "useMaskBehavior", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _date_box.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const DateBoxProps = exports.DateBoxProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  type: 'date',
  useMaskBehavior: false,
  defaultValue: null,
  isReactComponentWrapper: true
})));
const DateBoxPropsType = exports.DateBoxPropsType = {
  get type() {
    return DateBoxProps.type;
  },
  get useMaskBehavior() {
    return DateBoxProps.useMaskBehavior;
  },
  get defaultValue() {
    return DateBoxProps.defaultValue;
  },
  get readOnly() {
    return DateBoxProps.readOnly;
  },
  get name() {
    return DateBoxProps.name;
  },
  get validationError() {
    return DateBoxProps.validationError;
  },
  get validationErrors() {
    return DateBoxProps.validationErrors;
  },
  get validationMessageMode() {
    return DateBoxProps.validationMessageMode;
  },
  get validationMessagePosition() {
    return DateBoxProps.validationMessagePosition;
  },
  get validationStatus() {
    return DateBoxProps.validationStatus;
  },
  get isValid() {
    return DateBoxProps.isValid;
  },
  get isDirty() {
    return DateBoxProps.isDirty;
  },
  get inputAttr() {
    return DateBoxProps.inputAttr;
  },
  get className() {
    return DateBoxProps.className;
  },
  get activeStateEnabled() {
    return _editor_state_props.EditorStateProps.activeStateEnabled;
  },
  get disabled() {
    return DateBoxProps.disabled;
  },
  get focusStateEnabled() {
    return _editor_state_props.EditorStateProps.focusStateEnabled;
  },
  get hoverStateEnabled() {
    return _editor_state_props.EditorStateProps.hoverStateEnabled;
  },
  get tabIndex() {
    return DateBoxProps.tabIndex;
  },
  get visible() {
    return DateBoxProps.visible;
  },
  get label() {
    return _editor_label_props.EditorLabelProps.label;
  },
  get labelMode() {
    return _editor_label_props.EditorLabelProps.labelMode;
  },
  isReactComponentWrapper: true
};
class DateBox extends _inferno2.BaseInfernoComponent {
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
exports.DateBox = DateBox;
DateBox.defaultProps = DateBoxPropsType;