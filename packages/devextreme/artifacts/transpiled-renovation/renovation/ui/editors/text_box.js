"use strict";

exports.viewFunction = exports.TextBoxPropsType = exports.TextBoxProps = exports.TextBox = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _text_box = _interopRequireDefault(require("../../../ui/text_box"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _editor = require("./common/editor");
var _editor_state_props = require("./common/editor_state_props");
var _editor_label_props = require("./common/editor_label_props");
var _text_editor_props = require("./common/text_editor_props");
const _excluded = ["accessKey", "activeStateEnabled", "buttons", "className", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "isDirty", "isValid", "label", "labelMode", "mask", "maskChar", "maskInvalidMessage", "maskRules", "maxLength", "mode", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "showClearButton", "showMaskMode", "spellCheck", "stylingMode", "tabIndex", "useMaskedValue", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "valueChangeEvent", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _text_box.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const TextBoxProps = exports.TextBoxProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  mask: '',
  maskChar: '_',
  maskInvalidMessage: 'Value is invalid',
  maskRules: Object.freeze({}),
  mode: 'text',
  showClearButton: false,
  showMaskMode: 'always',
  useMaskedValue: false,
  isReactComponentWrapper: true
})));
const TextBoxPropsType = exports.TextBoxPropsType = {
  get mask() {
    return TextBoxProps.mask;
  },
  get maskChar() {
    return TextBoxProps.maskChar;
  },
  get maskInvalidMessage() {
    return TextBoxProps.maskInvalidMessage;
  },
  get maskRules() {
    return TextBoxProps.maskRules;
  },
  get mode() {
    return TextBoxProps.mode;
  },
  get showClearButton() {
    return TextBoxProps.showClearButton;
  },
  get showMaskMode() {
    return TextBoxProps.showMaskMode;
  },
  get useMaskedValue() {
    return TextBoxProps.useMaskedValue;
  },
  get readOnly() {
    return TextBoxProps.readOnly;
  },
  get name() {
    return TextBoxProps.name;
  },
  get validationError() {
    return TextBoxProps.validationError;
  },
  get validationErrors() {
    return TextBoxProps.validationErrors;
  },
  get validationMessageMode() {
    return TextBoxProps.validationMessageMode;
  },
  get validationMessagePosition() {
    return TextBoxProps.validationMessagePosition;
  },
  get validationStatus() {
    return TextBoxProps.validationStatus;
  },
  get isValid() {
    return TextBoxProps.isValid;
  },
  get isDirty() {
    return TextBoxProps.isDirty;
  },
  get defaultValue() {
    return _text_editor_props.TextEditorProps.defaultValue;
  },
  get className() {
    return TextBoxProps.className;
  },
  get activeStateEnabled() {
    return _editor_state_props.EditorStateProps.activeStateEnabled;
  },
  get disabled() {
    return TextBoxProps.disabled;
  },
  get focusStateEnabled() {
    return _editor_state_props.EditorStateProps.focusStateEnabled;
  },
  get hoverStateEnabled() {
    return _editor_state_props.EditorStateProps.hoverStateEnabled;
  },
  get tabIndex() {
    return TextBoxProps.tabIndex;
  },
  get visible() {
    return TextBoxProps.visible;
  },
  get label() {
    return _editor_label_props.EditorLabelProps.label;
  },
  get labelMode() {
    return _editor_label_props.EditorLabelProps.labelMode;
  },
  get maxLength() {
    return _text_editor_props.TextEditorProps.maxLength;
  },
  get spellCheck() {
    return _text_editor_props.TextEditorProps.spellCheck;
  },
  get valueChangeEvent() {
    return _text_editor_props.TextEditorProps.valueChangeEvent;
  },
  get stylingMode() {
    return _text_editor_props.TextEditorProps.stylingMode;
  },
  isReactComponentWrapper: true
};
class TextBox extends _inferno2.BaseInfernoComponent {
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
exports.TextBox = TextBox;
TextBox.defaultProps = TextBoxPropsType;