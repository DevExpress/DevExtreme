"use strict";

exports.CheckBoxPropsType = exports.CheckBoxProps = exports.CheckBox = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _editor = require("../common/editor");
var _combine_classes = require("../../../utils/combine_classes");
var _check_box_icon = require("./check_box_icon");
var _widget = require("../../common/widget");
var _utils = require("../../../../core/options/utils");
const _excluded = ["accessKey", "activeStateEnabled", "aria", "className", "defaultValue", "disabled", "enableThreeStateBehavior", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "iconSize", "inputAttr", "isDirty", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "saveValueChangeEvent", "tabIndex", "text", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const getCssClasses = model => {
  const {
    text,
    value
  } = model;
  const checked = value;
  const indeterminate = checked === null;
  const classesMap = {
    'dx-checkbox': true,
    'dx-checkbox-checked': checked === true,
    'dx-checkbox-has-text': !!text,
    'dx-checkbox-indeterminate': indeterminate
  };
  return (0, _combine_classes.combineClasses)(classesMap);
};
const viewFunction = viewModel => {
  const {
    aria,
    cssClasses: classes,
    editorRef,
    keyDown: onKeyDown,
    onWidgetClick: onClick,
    props: {
      accessKey,
      activeStateEnabled,
      className,
      disabled,
      focusStateEnabled,
      height,
      hint,
      hoverStateEnabled,
      iconSize,
      isValid,
      name,
      onFocusIn,
      readOnly,
      rtlEnabled,
      tabIndex,
      text,
      validationError,
      validationErrors,
      validationMessageMode,
      validationMessagePosition,
      validationStatus,
      value,
      visible,
      width
    },
    restAttributes
  } = viewModel;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _editor.Editor, _extends({
    "aria": aria,
    "classes": classes,
    "onClick": onClick,
    "onKeyDown": onKeyDown,
    "accessKey": accessKey,
    "activeStateEnabled": activeStateEnabled,
    "focusStateEnabled": focusStateEnabled,
    "hoverStateEnabled": hoverStateEnabled,
    "className": className,
    "disabled": disabled,
    "readOnly": readOnly,
    "hint": hint,
    "height": height,
    "width": width,
    "rtlEnabled": rtlEnabled,
    "tabIndex": tabIndex,
    "visible": visible,
    "validationError": validationError,
    "validationErrors": validationErrors,
    "validationMessageMode": validationMessageMode,
    "validationMessagePosition": validationMessagePosition,
    "validationStatus": validationStatus,
    "isValid": isValid,
    "onFocusIn": onFocusIn
  }, restAttributes, {
    children: (0, _inferno.createFragment)([(0, _inferno.normalizeProps)((0, _inferno.createVNode)(64, "input", null, null, 1, _extends({
      "type": "hidden",
      "value": `${value}`
    }, name && {
      name
    }))), (0, _inferno.createVNode)(1, "div", "dx-checkbox-container", [(0, _inferno.createComponentVNode)(2, _check_box_icon.CheckBoxIcon, {
      "size": iconSize,
      "isChecked": value === true
    }), text && (0, _inferno.createVNode)(1, "span", "dx-checkbox-text", text, 0)], 0)], 4)
  }), null, editorRef));
};
exports.viewFunction = viewFunction;
const CheckBoxProps = exports.CheckBoxProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  text: '',
  enableThreeStateBehavior: false,
  activeStateEnabled: true,
  hoverStateEnabled: true,
  get focusStateEnabled() {
    return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
  },
  defaultValue: false,
  valueChange: () => {}
})));
const CheckBoxPropsType = exports.CheckBoxPropsType = {
  get text() {
    return CheckBoxProps.text;
  },
  get enableThreeStateBehavior() {
    return CheckBoxProps.enableThreeStateBehavior;
  },
  get activeStateEnabled() {
    return CheckBoxProps.activeStateEnabled;
  },
  get hoverStateEnabled() {
    return CheckBoxProps.hoverStateEnabled;
  },
  get focusStateEnabled() {
    return CheckBoxProps.focusStateEnabled;
  },
  get defaultValue() {
    return CheckBoxProps.defaultValue;
  },
  get valueChange() {
    return CheckBoxProps.valueChange;
  },
  get readOnly() {
    return CheckBoxProps.readOnly;
  },
  get name() {
    return CheckBoxProps.name;
  },
  get validationError() {
    return CheckBoxProps.validationError;
  },
  get validationErrors() {
    return CheckBoxProps.validationErrors;
  },
  get validationMessageMode() {
    return CheckBoxProps.validationMessageMode;
  },
  get validationMessagePosition() {
    return CheckBoxProps.validationMessagePosition;
  },
  get validationStatus() {
    return CheckBoxProps.validationStatus;
  },
  get isValid() {
    return CheckBoxProps.isValid;
  },
  get isDirty() {
    return CheckBoxProps.isDirty;
  },
  get inputAttr() {
    return CheckBoxProps.inputAttr;
  },
  get className() {
    return CheckBoxProps.className;
  },
  get disabled() {
    return CheckBoxProps.disabled;
  },
  get tabIndex() {
    return CheckBoxProps.tabIndex;
  },
  get visible() {
    return CheckBoxProps.visible;
  },
  get aria() {
    return _widget.WidgetProps.aria;
  }
};
class CheckBox extends _inferno2.InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.editorRef = (0, _inferno.createRef)();
    this.state = {
      value: this.props.value !== undefined ? this.props.value : this.props.defaultValue
    };
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.onWidgetClick = this.onWidgetClick.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  onWidgetClick(event) {
    const {
      enableThreeStateBehavior,
      readOnly,
      saveValueChangeEvent
    } = this.props;
    if (!readOnly) {
      saveValueChangeEvent === null || saveValueChangeEvent === void 0 || saveValueChangeEvent(event);
      if (enableThreeStateBehavior) {
        {
          let __newValue;
          this.setState(__state_argument => {
            __newValue = (this.props.value !== undefined ? this.props.value : __state_argument.value) === null || (!(this.props.value !== undefined ? this.props.value : __state_argument.value) ? null : false);
            return {
              value: __newValue
            };
          });
          this.props.valueChange(__newValue);
        }
      } else {
        {
          let __newValue;
          this.setState(__state_argument => {
            __newValue = !((this.props.value !== undefined ? this.props.value : __state_argument.value) ?? false);
            return {
              value: __newValue
            };
          });
          this.props.valueChange(__newValue);
        }
      }
    }
  }
  keyDown(e) {
    const {
      onKeyDown
    } = this.props;
    const {
      keyName,
      originalEvent,
      which
    } = e;
    const result = onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
    if (result !== null && result !== void 0 && result.cancel) {
      return result;
    }
    if (keyName === 'space' || which === 'space') {
      originalEvent.preventDefault();
      this.onWidgetClick(originalEvent);
    }
    return undefined;
  }
  get cssClasses() {
    return getCssClasses(_extends({}, this.props, {
      value: this.props.value !== undefined ? this.props.value : this.state.value
    }));
  }
  get aria() {
    const checked = (this.props.value !== undefined ? this.props.value : this.state.value) === true;
    const indeterminate = (this.props.value !== undefined ? this.props.value : this.state.value) === null;
    const result = {
      role: 'checkbox',
      checked: indeterminate ? 'mixed' : `${checked}`
    };
    return _extends({}, result, this.props.aria);
  }
  get restAttributes() {
    const _this$props$value = _extends({}, this.props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      restProps = _objectWithoutPropertiesLoose(_this$props$value, _excluded);
    return restProps;
  }
  focus() {
    this.editorRef.current.focus();
  }
  blur() {
    this.editorRef.current.blur();
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      editorRef: this.editorRef,
      onWidgetClick: this.onWidgetClick,
      keyDown: this.keyDown,
      cssClasses: this.cssClasses,
      aria: this.aria,
      restAttributes: this.restAttributes
    });
  }
}
exports.CheckBox = CheckBox;
function __processTwoWayProps(defaultProps) {
  const twoWayProps = ['value'];
  return Object.keys(defaultProps).reduce((props, propName) => {
    const propValue = defaultProps[propName];
    const defaultPropName = twoWayProps.some(p => p === propName) ? 'default' + propName.charAt(0).toUpperCase() + propName.slice(1) : propName;
    props[defaultPropName] = propValue;
    return props;
  }, {});
}
CheckBox.defaultProps = CheckBoxPropsType;
const __defaultOptionRules = [];
function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  CheckBox.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(CheckBox.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps((0, _utils.convertRulesToOptions)(__defaultOptionRules)))));
}