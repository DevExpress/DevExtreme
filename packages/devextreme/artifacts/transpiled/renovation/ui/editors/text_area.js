"use strict";

exports.viewFunction = exports.TextAreaPropsType = exports.TextAreaProps = exports.TextArea = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _text_area = _interopRequireDefault(require("../../../ui/text_area"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _editor = require("./common/editor");
var _editor_state_props = require("./common/editor_state_props");
var _editor_label_props = require("./common/editor_label_props");
var _text_editor_props = require("./common/text_editor_props");
const _excluded = ["accessKey", "activeStateEnabled", "autoResizeEnabled", "className", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "isDirty", "isValid", "label", "labelMode", "maxLength", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "spellCheck", "stylingMode", "tabIndex", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "valueChangeEvent", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _text_area.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const TextAreaProps = exports.TextAreaProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  autoResizeEnabled: false,
  isReactComponentWrapper: true
})));
const TextAreaPropsType = exports.TextAreaPropsType = {
  get autoResizeEnabled() {
    return TextAreaProps.autoResizeEnabled;
  },
  get readOnly() {
    return TextAreaProps.readOnly;
  },
  get name() {
    return TextAreaProps.name;
  },
  get validationError() {
    return TextAreaProps.validationError;
  },
  get validationErrors() {
    return TextAreaProps.validationErrors;
  },
  get validationMessageMode() {
    return TextAreaProps.validationMessageMode;
  },
  get validationMessagePosition() {
    return TextAreaProps.validationMessagePosition;
  },
  get validationStatus() {
    return TextAreaProps.validationStatus;
  },
  get isValid() {
    return TextAreaProps.isValid;
  },
  get isDirty() {
    return TextAreaProps.isDirty;
  },
  get defaultValue() {
    return _text_editor_props.TextEditorProps.defaultValue;
  },
  get className() {
    return TextAreaProps.className;
  },
  get activeStateEnabled() {
    return _editor_state_props.EditorStateProps.activeStateEnabled;
  },
  get disabled() {
    return TextAreaProps.disabled;
  },
  get focusStateEnabled() {
    return _editor_state_props.EditorStateProps.focusStateEnabled;
  },
  get hoverStateEnabled() {
    return _editor_state_props.EditorStateProps.hoverStateEnabled;
  },
  get tabIndex() {
    return TextAreaProps.tabIndex;
  },
  get visible() {
    return TextAreaProps.visible;
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
class TextArea extends _inferno2.BaseInfernoComponent {
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
exports.TextArea = TextArea;
TextArea.defaultProps = TextAreaPropsType;