"use strict";

exports.viewFunction = exports.CalendarProps = exports.Calendar = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _calendar = _interopRequireDefault(require("../../../ui/calendar"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _base_props = require("../common/base_props");
const _excluded = ["_todayDate", "accessKey", "activeStateEnabled", "className", "defaultValue", "disabled", "firstDayOfWeek", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "max", "min", "onClick", "onKeyDown", "rtlEnabled", "skipFocusCheck", "tabIndex", "value", "valueChange", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function today() {
  return new Date();
}
const viewFunction = _ref => {
  let {
    componentProps,
    domComponentWrapperRef,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _calendar.default,
    "componentProps": componentProps,
    "templateNames": ['cellTemplate']
  }, restAttributes), null, domComponentWrapperRef));
};
exports.viewFunction = viewFunction;
const CalendarProps = exports.CalendarProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  _todayDate: today,
  skipFocusCheck: false,
  defaultValue: null,
  isReactComponentWrapper: true
})));
class Calendar extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.domComponentWrapperRef = (0, _inferno.createRef)();
    this.state = {
      value: this.props.value !== undefined ? this.props.value : this.props.defaultValue
    };
    this.saveInstance = this.saveInstance.bind(this);
    this.focus = this.focus.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.saveInstance, [])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([]);
  }
  saveInstance() {
    var _this$domComponentWra;
    this.instance = (_this$domComponentWra = this.domComponentWrapperRef.current) === null || _this$domComponentWra === void 0 ? void 0 : _this$domComponentWra.getInstance();
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
  focus() {
    var _this$instance;
    (_this$instance = this.instance) === null || _this$instance === void 0 || _this$instance.focus();
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      domComponentWrapperRef: this.domComponentWrapperRef,
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  }
}
exports.Calendar = Calendar;
Calendar.defaultProps = CalendarProps;