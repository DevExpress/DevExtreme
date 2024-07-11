"use strict";

exports.viewFunction = exports.WidgetProps = exports.Widget = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
require("../../../events/click");
require("../../../events/hover");
var _type = require("../../../core/utils/type");
var _short = require("../../../events/short");
var _subscribe_to_event = require("../../utils/subscribe_to_event");
var _combine_classes = require("../../utils/combine_classes");
var _extend = require("../../../core/utils/extend");
var _style = require("../../../core/utils/style");
var _base_props = require("./base_props");
var _config_context = require("../../common/config_context");
var _config_provider = require("../../common/config_provider");
var _resolve_rtl = require("../../utils/resolve_rtl");
var _resize_callbacks = _interopRequireDefault(require("../../../core/utils/resize_callbacks"));
var _errors = _interopRequireDefault(require("../../../core/errors"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
const _excluded = ["_feedbackHideTimeout", "_feedbackShowTimeout", "accessKey", "activeStateEnabled", "activeStateUnit", "addWidgetClass", "aria", "children", "className", "classes", "cssText", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "name", "onActive", "onClick", "onDimensionChanged", "onFocusIn", "onFocusOut", "onHoverEnd", "onHoverStart", "onInactive", "onKeyDown", "onRootElementRendered", "onVisibilityChange", "rootElementRef", "rtlEnabled", "tabIndex", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
const DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;
const getAria = args => Object.keys(args).reduce((r, key) => {
  if (args[key]) {
    return _extends({}, r, {
      [key === 'role' || key === 'id' ? key : `aria-${key}`]: String(args[key])
    });
  }
  return r;
}, {});
const viewFunction = viewModel => {
  const widget = (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "div", viewModel.cssClasses, viewModel.props.children, 0, _extends({}, viewModel.attributes, {
    "tabIndex": viewModel.tabIndex,
    "title": viewModel.props.hint,
    "style": (0, _inferno2.normalizeStyles)(viewModel.styles)
  }), null, viewModel.widgetElementRef));
  return viewModel.shouldRenderConfigProvider ? (0, _inferno.createComponentVNode)(2, _config_provider.ConfigProvider, {
    "rtlEnabled": viewModel.rtlEnabled,
    children: widget
  }) : widget;
};
exports.viewFunction = viewFunction;
const WidgetProps = exports.WidgetProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
  _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
  cssText: '',
  aria: Object.freeze({}),
  classes: '',
  name: '',
  addWidgetClass: true
})));
class Widget extends _inferno2.InfernoWrapperComponent {
  get config() {
    if (this.context[_config_context.ConfigContext.id]) {
      return this.context[_config_context.ConfigContext.id];
    }
    return _config_context.ConfigContext.defaultValue;
  }
  constructor(props) {
    super(props);
    this.widgetElementRef = (0, _inferno.createRef)();
    this.state = {
      active: false,
      focused: false,
      hovered: false
    };
    this.setRootElementRef = this.setRootElementRef.bind(this);
    this.activeEffect = this.activeEffect.bind(this);
    this.inactiveEffect = this.inactiveEffect.bind(this);
    this.clickEffect = this.clickEffect.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.focusInEffect = this.focusInEffect.bind(this);
    this.focusOutEffect = this.focusOutEffect.bind(this);
    this.hoverStartEffect = this.hoverStartEffect.bind(this);
    this.hoverEndEffect = this.hoverEndEffect.bind(this);
    this.keyboardEffect = this.keyboardEffect.bind(this);
    this.resizeEffect = this.resizeEffect.bind(this);
    this.windowResizeEffect = this.windowResizeEffect.bind(this);
    this.visibilityEffect = this.visibilityEffect.bind(this);
    this.checkDeprecation = this.checkDeprecation.bind(this);
    this.applyCssTextEffect = this.applyCssTextEffect.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.setRootElementRef, []), new _inferno2.InfernoEffect(this.activeEffect, [this.props._feedbackShowTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.disabled, this.props.onActive]), new _inferno2.InfernoEffect(this.inactiveEffect, [this.props._feedbackHideTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.onInactive, this.state.active]), new _inferno2.InfernoEffect(this.clickEffect, [this.props.disabled, this.props.name, this.props.onClick]), new _inferno2.InfernoEffect(this.focusInEffect, [this.props.disabled, this.props.focusStateEnabled, this.props.name, this.props.onFocusIn]), new _inferno2.InfernoEffect(this.focusOutEffect, [this.props.focusStateEnabled, this.props.name, this.props.onFocusOut, this.state.focused]), new _inferno2.InfernoEffect(this.hoverStartEffect, [this.props.activeStateUnit, this.props.disabled, this.props.hoverStateEnabled, this.props.onHoverStart, this.state.active]), new _inferno2.InfernoEffect(this.hoverEndEffect, [this.props.activeStateUnit, this.props.hoverStateEnabled, this.props.onHoverEnd, this.state.hovered]), new _inferno2.InfernoEffect(this.keyboardEffect, [this.props.focusStateEnabled, this.props.onKeyDown]), new _inferno2.InfernoEffect(this.resizeEffect, [this.props.name, this.props.onDimensionChanged]), new _inferno2.InfernoEffect(this.windowResizeEffect, [this.props.onDimensionChanged]), new _inferno2.InfernoEffect(this.visibilityEffect, [this.props.name, this.props.onVisibilityChange]), new _inferno2.InfernoEffect(this.checkDeprecation, [this.props.height, this.props.width]), new _inferno2.InfernoEffect(this.applyCssTextEffect, [this.props.cssText]), (0, _inferno2.createReRenderEffect)()];
  }
  updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7, _this$_effects$8, _this$_effects$9, _this$_effects$10, _this$_effects$11, _this$_effects$12, _this$_effects$13;
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props._feedbackShowTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.disabled, this.props.onActive]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 || _this$_effects$2.update([this.props._feedbackHideTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.onInactive, this.state.active]);
    (_this$_effects$3 = this._effects[3]) === null || _this$_effects$3 === void 0 || _this$_effects$3.update([this.props.disabled, this.props.name, this.props.onClick]);
    (_this$_effects$4 = this._effects[4]) === null || _this$_effects$4 === void 0 || _this$_effects$4.update([this.props.disabled, this.props.focusStateEnabled, this.props.name, this.props.onFocusIn]);
    (_this$_effects$5 = this._effects[5]) === null || _this$_effects$5 === void 0 || _this$_effects$5.update([this.props.focusStateEnabled, this.props.name, this.props.onFocusOut, this.state.focused]);
    (_this$_effects$6 = this._effects[6]) === null || _this$_effects$6 === void 0 || _this$_effects$6.update([this.props.activeStateUnit, this.props.disabled, this.props.hoverStateEnabled, this.props.onHoverStart, this.state.active]);
    (_this$_effects$7 = this._effects[7]) === null || _this$_effects$7 === void 0 || _this$_effects$7.update([this.props.activeStateUnit, this.props.hoverStateEnabled, this.props.onHoverEnd, this.state.hovered]);
    (_this$_effects$8 = this._effects[8]) === null || _this$_effects$8 === void 0 || _this$_effects$8.update([this.props.focusStateEnabled, this.props.onKeyDown]);
    (_this$_effects$9 = this._effects[9]) === null || _this$_effects$9 === void 0 || _this$_effects$9.update([this.props.name, this.props.onDimensionChanged]);
    (_this$_effects$10 = this._effects[10]) === null || _this$_effects$10 === void 0 || _this$_effects$10.update([this.props.onDimensionChanged]);
    (_this$_effects$11 = this._effects[11]) === null || _this$_effects$11 === void 0 || _this$_effects$11.update([this.props.name, this.props.onVisibilityChange]);
    (_this$_effects$12 = this._effects[12]) === null || _this$_effects$12 === void 0 || _this$_effects$12.update([this.props.height, this.props.width]);
    (_this$_effects$13 = this._effects[13]) === null || _this$_effects$13 === void 0 || _this$_effects$13.update([this.props.cssText]);
  }
  setRootElementRef() {
    const {
      onRootElementRendered,
      rootElementRef
    } = this.props;
    if (rootElementRef) {
      rootElementRef.current = this.widgetElementRef.current;
    }
    onRootElementRendered === null || onRootElementRendered === void 0 || onRootElementRendered(this.widgetElementRef.current);
  }
  activeEffect() {
    const {
      _feedbackShowTimeout,
      activeStateEnabled,
      activeStateUnit,
      disabled,
      onActive
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (activeStateEnabled) {
      if (!disabled) {
        return (0, _subscribe_to_event.subscribeToDxActiveEvent)(this.widgetElementRef.current, event => {
          this.setState(__state_argument => ({
            active: true
          }));
          onActive === null || onActive === void 0 || onActive(event);
        }, {
          timeout: _feedbackShowTimeout,
          selector
        }, namespace);
      }
    }
    return undefined;
  }
  inactiveEffect() {
    const {
      _feedbackHideTimeout,
      activeStateEnabled,
      activeStateUnit,
      onInactive
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (activeStateEnabled) {
      return (0, _subscribe_to_event.subscribeToDxInactiveEvent)(this.widgetElementRef.current, event => {
        if (this.state.active) {
          this.setState(__state_argument => ({
            active: false
          }));
          onInactive === null || onInactive === void 0 || onInactive(event);
        }
      }, {
        timeout: _feedbackHideTimeout,
        selector
      }, namespace);
    }
    return undefined;
  }
  clickEffect() {
    const {
      disabled,
      name,
      onClick
    } = this.props;
    const namespace = name;
    if (onClick && !disabled) {
      _short.dxClick.on(this.widgetElementRef.current, onClick, {
        namespace
      });
      return () => _short.dxClick.off(this.widgetElementRef.current, {
        namespace
      });
    }
    return undefined;
  }
  focusInEffect() {
    const {
      disabled,
      focusStateEnabled,
      name,
      onFocusIn
    } = this.props;
    const namespace = `${name}Focus`;
    if (focusStateEnabled) {
      if (!disabled) {
        return (0, _subscribe_to_event.subscribeToDxFocusInEvent)(this.widgetElementRef.current, event => {
          if (!event.isDefaultPrevented()) {
            this.setState(__state_argument => ({
              focused: true
            }));
            onFocusIn === null || onFocusIn === void 0 || onFocusIn(event);
          }
        }, null, namespace);
      }
    }
    return undefined;
  }
  focusOutEffect() {
    const {
      focusStateEnabled,
      name,
      onFocusOut
    } = this.props;
    const namespace = `${name}Focus`;
    if (focusStateEnabled) {
      return (0, _subscribe_to_event.subscribeToDxFocusOutEvent)(this.widgetElementRef.current, event => {
        if (!event.isDefaultPrevented() && this.state.focused) {
          this.setState(__state_argument => ({
            focused: false
          }));
          onFocusOut === null || onFocusOut === void 0 || onFocusOut(event);
        }
      }, null, namespace);
    }
    return undefined;
  }
  hoverStartEffect() {
    const {
      activeStateUnit,
      disabled,
      hoverStateEnabled,
      onHoverStart
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (hoverStateEnabled) {
      if (!disabled) {
        return (0, _subscribe_to_event.subscribeToDxHoverStartEvent)(this.widgetElementRef.current, event => {
          !this.state.active && this.setState(__state_argument => ({
            hovered: true
          }));
          onHoverStart === null || onHoverStart === void 0 || onHoverStart(event);
        }, {
          selector
        }, namespace);
      }
    }
    return undefined;
  }
  hoverEndEffect() {
    const {
      activeStateUnit,
      hoverStateEnabled,
      onHoverEnd
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (hoverStateEnabled) {
      return (0, _subscribe_to_event.subscribeToDxHoverEndEvent)(this.widgetElementRef.current, event => {
        if (this.state.hovered) {
          this.setState(__state_argument => ({
            hovered: false
          }));
          onHoverEnd === null || onHoverEnd === void 0 || onHoverEnd(event);
        }
      }, {
        selector
      }, namespace);
    }
    return undefined;
  }
  keyboardEffect() {
    const {
      focusStateEnabled,
      onKeyDown
    } = this.props;
    if (focusStateEnabled && onKeyDown) {
      const id = _short.keyboard.on(this.widgetElementRef.current, this.widgetElementRef.current, e => onKeyDown(e));
      return () => _short.keyboard.off(id);
    }
    return undefined;
  }
  resizeEffect() {
    const namespace = `${this.props.name}VisibilityChange`;
    const {
      onDimensionChanged
    } = this.props;
    if (onDimensionChanged) {
      _short.resize.on(this.widgetElementRef.current, onDimensionChanged, {
        namespace
      });
      return () => _short.resize.off(this.widgetElementRef.current, {
        namespace
      });
    }
    return undefined;
  }
  windowResizeEffect() {
    const {
      onDimensionChanged
    } = this.props;
    if (onDimensionChanged) {
      _resize_callbacks.default.add(onDimensionChanged);
      return () => {
        _resize_callbacks.default.remove(onDimensionChanged);
      };
    }
    return undefined;
  }
  visibilityEffect() {
    const {
      name,
      onVisibilityChange
    } = this.props;
    const namespace = `${name}VisibilityChange`;
    if (onVisibilityChange) {
      _short.visibility.on(this.widgetElementRef.current, () => onVisibilityChange(true), () => onVisibilityChange(false), {
        namespace
      });
      return () => _short.visibility.off(this.widgetElementRef.current, {
        namespace
      });
    }
    return undefined;
  }
  checkDeprecation() {
    const {
      height,
      width
    } = this.props;
    if ((0, _type.isFunction)(width)) {
      _errors.default.log('W0017', 'width');
    }
    if ((0, _type.isFunction)(height)) {
      _errors.default.log('W0017', 'height');
    }
  }
  applyCssTextEffect() {
    const {
      cssText
    } = this.props;
    if (cssText !== '') {
      this.widgetElementRef.current.style.cssText = cssText;
    }
  }
  get shouldRenderConfigProvider() {
    const {
      rtlEnabled
    } = this.props;
    return (0, _resolve_rtl.resolveRtlEnabledDefinition)(rtlEnabled, this.config);
  }
  get rtlEnabled() {
    const {
      rtlEnabled
    } = this.props;
    return (0, _resolve_rtl.resolveRtlEnabled)(rtlEnabled, this.config);
  }
  get attributes() {
    const {
      aria,
      disabled,
      focusStateEnabled,
      visible
    } = this.props;
    const accessKey = focusStateEnabled && !disabled && this.props.accessKey;
    return _extends({}, (0, _extend.extend)({}, accessKey && {
      accessKey
    }), getAria(_extends({}, aria, {
      disabled,
      hidden: !visible
    })), (0, _extend.extend)({}, this.restAttributes));
  }
  get styles() {
    const {
      height,
      width
    } = this.props;
    const style = this.restAttributes.style || {};
    const computedWidth = (0, _style.normalizeStyleProp)('width', (0, _type.isFunction)(width) ? width() : width);
    const computedHeight = (0, _style.normalizeStyleProp)('height', (0, _type.isFunction)(height) ? height() : height);
    return _extends({}, style, {
      height: computedHeight ?? style.height,
      width: computedWidth ?? style.width
    });
  }
  get cssClasses() {
    const {
      activeStateEnabled,
      addWidgetClass,
      className,
      classes,
      disabled,
      focusStateEnabled,
      hoverStateEnabled,
      onVisibilityChange,
      visible
    } = this.props;
    const isFocusable = !!focusStateEnabled && !disabled;
    const isHoverable = !!hoverStateEnabled && !disabled;
    const canBeActive = !!activeStateEnabled && !disabled;
    const classesMap = {
      'dx-widget': !!addWidgetClass,
      [String(classes)]: !!classes,
      [String(className)]: !!className,
      'dx-state-disabled': !!disabled,
      'dx-state-invisible': !visible,
      'dx-state-focused': !!this.state.focused && isFocusable,
      'dx-state-active': !!this.state.active && canBeActive,
      'dx-state-hover': !!this.state.hovered && isHoverable && !this.state.active,
      'dx-rtl': !!this.rtlEnabled,
      'dx-visibility-change-handler': !!onVisibilityChange
    };
    return (0, _combine_classes.combineClasses)(classesMap);
  }
  get tabIndex() {
    const {
      disabled,
      focusStateEnabled,
      tabIndex
    } = this.props;
    const isFocusable = focusStateEnabled && !disabled;
    return isFocusable ? tabIndex : undefined;
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  focus() {
    _short.focus.trigger(this.widgetElementRef.current);
  }
  blur() {
    const activeElement = _dom_adapter.default.getActiveElement(this.widgetElementRef.current);
    if (this.widgetElementRef.current === activeElement) {
      activeElement.blur();
    }
  }
  activate() {
    this.setState(__state_argument => ({
      active: true
    }));
  }
  deactivate() {
    this.setState(__state_argument => ({
      active: false
    }));
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      active: this.state.active,
      focused: this.state.focused,
      hovered: this.state.hovered,
      widgetElementRef: this.widgetElementRef,
      config: this.config,
      shouldRenderConfigProvider: this.shouldRenderConfigProvider,
      rtlEnabled: this.rtlEnabled,
      attributes: this.attributes,
      styles: this.styles,
      cssClasses: this.cssClasses,
      tabIndex: this.tabIndex,
      restAttributes: this.restAttributes
    });
  }
}
exports.Widget = Widget;
Widget.defaultProps = WidgetProps;