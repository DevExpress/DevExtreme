"use strict";

exports.viewFunction = exports.LightButtonProps = exports.LightButton = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _subscribe_to_event = require("../../../utils/subscribe_to_event");
var _keyboard_action_context = require("./keyboard_action_context");
const _excluded = ["children", "className", "label", "onClick", "selected", "tabIndex"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const viewFunction = _ref => {
  let {
    props: {
      children,
      className,
      label,
      selected,
      tabIndex
    },
    widgetRef
  } = _ref;
  return (0, _inferno.createVNode)(1, "div", className, children, 0, {
    "tabIndex": tabIndex,
    "role": "button",
    "aria-label": label,
    "aria-current": selected ? 'page' : undefined
  }, null, widgetRef);
};
exports.viewFunction = viewFunction;
const LightButtonProps = exports.LightButtonProps = {
  className: '',
  label: '',
  tabIndex: 0,
  selected: false
};
class LightButton extends _inferno2.InfernoComponent {
  get keyboardContext() {
    if (this.context[_keyboard_action_context.KeyboardActionContext.id]) {
      return this.context[_keyboard_action_context.KeyboardActionContext.id];
    }
    return _keyboard_action_context.KeyboardActionContext.defaultValue;
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.widgetRef = (0, _inferno.createRef)();
    this.keyboardEffect = this.keyboardEffect.bind(this);
    this.subscribeToClick = this.subscribeToClick.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.keyboardEffect, [this.keyboardContext, this.props.onClick]), new _inferno2.InfernoEffect(this.subscribeToClick, [this.props.onClick])];
  }
  updateEffects() {
    var _this$_effects$, _this$_effects$2;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.keyboardContext, this.props.onClick]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 || _this$_effects$2.update([this.props.onClick]);
  }
  keyboardEffect() {
    return this.keyboardContext.registerKeyboardAction(this.widgetRef.current, this.props.onClick);
  }
  subscribeToClick() {
    return (0, _subscribe_to_event.subscribeToClickEvent)(this.widgetRef.current, this.props.onClick);
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      widgetRef: this.widgetRef,
      keyboardContext: this.keyboardContext,
      restAttributes: this.restAttributes
    });
  }
}
exports.LightButton = LightButton;
LightButton.defaultProps = LightButtonProps;