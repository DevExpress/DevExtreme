"use strict";

exports.viewFunction = exports.SelectBoxPropsType = exports.SelectBoxProps = exports.SelectBox = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _select_box = _interopRequireDefault(require("../../../../ui/select_box"));
var _dom_component_wrapper = require("../../common/dom_component_wrapper");
var _editor = require("../common/editor");
var _editor_state_props = require("../common/editor_state_props");
var _editor_label_props = require("../common/editor_label_props");
const _excluded = ["accessKey", "activeStateEnabled", "className", "dataSource", "defaultValue", "disabled", "displayExpr", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "isDirty", "isValid", "label", "labelMode", "name", "onClick", "onFocusIn", "onKeyDown", "placeholder", "readOnly", "rtlEnabled", "searchEnabled", "tabIndex", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "valueExpr", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _select_box.default,
    "componentProps": componentProps,
    "templateNames": ['dropDownButtonTemplate', 'groupTemplate', 'itemTemplate']
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const SelectBoxProps = exports.SelectBoxProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  placeholder: '',
  hoverStateEnabled: true,
  searchEnabled: false,
  defaultValue: null,
  isReactComponentWrapper: true
})));
const SelectBoxPropsType = exports.SelectBoxPropsType = {
  get placeholder() {
    return SelectBoxProps.placeholder;
  },
  get hoverStateEnabled() {
    return _editor_state_props.EditorStateProps.hoverStateEnabled;
  },
  get searchEnabled() {
    return SelectBoxProps.searchEnabled;
  },
  get defaultValue() {
    return SelectBoxProps.defaultValue;
  },
  get readOnly() {
    return SelectBoxProps.readOnly;
  },
  get name() {
    return SelectBoxProps.name;
  },
  get validationError() {
    return SelectBoxProps.validationError;
  },
  get validationErrors() {
    return SelectBoxProps.validationErrors;
  },
  get validationMessageMode() {
    return SelectBoxProps.validationMessageMode;
  },
  get validationMessagePosition() {
    return SelectBoxProps.validationMessagePosition;
  },
  get validationStatus() {
    return SelectBoxProps.validationStatus;
  },
  get isValid() {
    return SelectBoxProps.isValid;
  },
  get isDirty() {
    return SelectBoxProps.isDirty;
  },
  get inputAttr() {
    return SelectBoxProps.inputAttr;
  },
  get className() {
    return SelectBoxProps.className;
  },
  get activeStateEnabled() {
    return _editor_state_props.EditorStateProps.activeStateEnabled;
  },
  get disabled() {
    return SelectBoxProps.disabled;
  },
  get focusStateEnabled() {
    return _editor_state_props.EditorStateProps.focusStateEnabled;
  },
  get tabIndex() {
    return SelectBoxProps.tabIndex;
  },
  get visible() {
    return SelectBoxProps.visible;
  },
  get label() {
    return _editor_label_props.EditorLabelProps.label;
  },
  get labelMode() {
    return _editor_label_props.EditorLabelProps.labelMode;
  },
  isReactComponentWrapper: true
};
class SelectBox extends _inferno2.BaseInfernoComponent {
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
exports.SelectBox = SelectBox;
SelectBox.defaultProps = SelectBoxPropsType;