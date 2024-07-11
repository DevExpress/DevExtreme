"use strict";

exports.defaultOptionRules = exports.ButtonProps = exports.Button = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _utils = require("../../core/options/utils");
var _devices = _interopRequireDefault(require("../../core/devices"));
var _themes = require("../../ui/themes");
var _short = require("../../events/short");
var _combine_classes = require("../utils/combine_classes");
var _icon = require("../../core/utils/icon");
var _inflector = require("../../core/utils/inflector");
var _icon2 = require("./common/icon");
var _ink_ripple = require("./common/ink_ripple");
var _widget = require("./common/widget");
var _base_props = require("./common/base_props");
var _message = _interopRequireDefault(require("../../localization/message"));
const _excluded = ["accessKey", "activeStateEnabled", "children", "className", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "icon", "iconPosition", "iconTemplate", "onClick", "onKeyDown", "onSubmit", "pressed", "rtlEnabled", "stylingMode", "tabIndex", "template", "templateData", "text", "type", "useInkRipple", "useSubmitBehavior", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const stylingModes = ['outlined', 'text', 'contained'];
const getCssClasses = model => {
  const {
    icon,
    iconPosition,
    stylingMode,
    text,
    type
  } = model;
  const isValidStylingMode = stylingMode && stylingModes.includes(stylingMode);
  const classesMap = {
    'dx-button': true,
    [`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`]: true,
    [`dx-button-${type ?? 'normal'}`]: true,
    'dx-button-has-text': !!text,
    'dx-button-has-icon': !!icon,
    'dx-button-icon-right': iconPosition !== 'left'
  };
  return (0, _combine_classes.combineClasses)(classesMap);
};
const viewFunction = viewModel => {
  const {
    children,
    iconPosition,
    iconTemplate: IconTemplate,
    template: ButtonTemplate,
    text
  } = viewModel.props;
  const renderText = !viewModel.props.template && !children && text !== '';
  const isIconLeft = iconPosition === 'left';
  const iconComponent = !viewModel.props.template && !children && (viewModel.iconSource || viewModel.props.iconTemplate) && (0, _inferno.createComponentVNode)(2, _icon2.Icon, {
    "source": viewModel.iconSource,
    "position": iconPosition,
    "iconTemplate": IconTemplate
  });
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "accessKey": viewModel.props.accessKey,
    "activeStateEnabled": viewModel.props.activeStateEnabled,
    "aria": viewModel.aria,
    "className": viewModel.props.className,
    "classes": viewModel.cssClasses,
    "disabled": viewModel.props.disabled,
    "focusStateEnabled": viewModel.props.focusStateEnabled,
    "height": viewModel.props.height,
    "hint": viewModel.props.hint,
    "hoverStateEnabled": viewModel.props.hoverStateEnabled,
    "onActive": viewModel.onActive,
    "onClick": viewModel.onWidgetClick,
    "onInactive": viewModel.onInactive,
    "onKeyDown": viewModel.keyDown,
    "rtlEnabled": viewModel.props.rtlEnabled,
    "tabIndex": viewModel.props.tabIndex,
    "visible": viewModel.props.visible,
    "width": viewModel.props.width
  }, viewModel.restAttributes, {
    children: (0, _inferno.createVNode)(1, "div", "dx-button-content", [viewModel.props.template && ButtonTemplate({
      data: viewModel.buttonTemplateData
    }), !viewModel.props.template && children, isIconLeft && iconComponent, renderText && (0, _inferno.createVNode)(1, "span", "dx-button-text", text, 0), !isIconLeft && iconComponent, viewModel.props.useSubmitBehavior && (0, _inferno.createVNode)(64, "input", "dx-button-submit-input", null, 1, {
      "type": "submit",
      "tabIndex": -1
    }, null, viewModel.submitInputRef), viewModel.props.useInkRipple && (0, _inferno.createComponentVNode)(2, _ink_ripple.InkRipple, {
      "config": viewModel.inkRippleConfig
    }, null, viewModel.inkRippleRef)], 0, null, null, viewModel.contentRef)
  }), null, viewModel.widgetRef));
};
exports.viewFunction = viewFunction;
const ButtonProps = exports.ButtonProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  activeStateEnabled: true,
  hoverStateEnabled: true,
  icon: '',
  iconPosition: 'left',
  stylingMode: 'contained',
  text: '',
  type: 'normal',
  useInkRipple: false,
  useSubmitBehavior: false,
  templateData: Object.freeze({})
})));
const defaultOptionRules = exports.defaultOptionRules = (0, _utils.createDefaultOptionRules)([{
  device: () => _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator(),
  options: {
    focusStateEnabled: true
  }
}, {
  device: () => (0, _themes.isMaterial)((0, _themes.current)()),
  options: {
    useInkRipple: true
  }
}]);
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
class Button extends _inferno2.InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.contentRef = (0, _inferno.createRef)();
    this.inkRippleRef = (0, _inferno.createRef)();
    this.submitInputRef = (0, _inferno.createRef)();
    this.widgetRef = (0, _inferno.createRef)();
    this.__getterCache = {};
    this.focus = this.focus.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.submitEffect = this.submitEffect.bind(this);
    this.onActive = this.onActive.bind(this);
    this.onInactive = this.onInactive.bind(this);
    this.onWidgetClick = this.onWidgetClick.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.emitClickEvent = this.emitClickEvent.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.submitEffect, [this.props.onSubmit, this.props.useSubmitBehavior]), (0, _inferno2.createReRenderEffect)()];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.onSubmit, this.props.useSubmitBehavior]);
  }
  submitEffect() {
    const namespace = 'UIFeedback';
    const {
      onSubmit,
      useSubmitBehavior
    } = this.props;
    if (useSubmitBehavior && onSubmit) {
      _short.click.on(this.submitInputRef.current, event => onSubmit({
        event,
        submitInput: this.submitInputRef.current
      }), {
        namespace
      });
      return () => _short.click.off(this.submitInputRef.current, {
        namespace
      });
    }
    return undefined;
  }
  onActive(event) {
    const {
      useInkRipple
    } = this.props;
    useInkRipple && this.inkRippleRef.current.showWave({
      element: this.contentRef.current,
      event
    });
  }
  onInactive(event) {
    const {
      useInkRipple
    } = this.props;
    useInkRipple && this.inkRippleRef.current.hideWave({
      element: this.contentRef.current,
      event
    });
  }
  onWidgetClick(event) {
    const {
      onClick,
      useSubmitBehavior
    } = this.props;
    onClick === null || onClick === void 0 || onClick({
      event
    });
    useSubmitBehavior && this.submitInputRef.current.click();
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
    if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
      originalEvent.preventDefault();
      this.emitClickEvent();
    }
    return undefined;
  }
  emitClickEvent() {
    this.contentRef.current.click();
  }
  get aria() {
    const {
      icon,
      text
    } = this.props;
    let label = text ?? '';
    if (!text && icon) {
      const iconSource = (0, _icon.getImageSourceType)(icon);
      switch (iconSource) {
        case 'image':
          {
            const notURLRegexp = /^(?!(?:https?:\/\/)|(?:ftp:\/\/)|(?:www\.))[^\s]+$/;
            const isPathToImage = !icon.includes('base64') && notURLRegexp.test(icon);
            label = isPathToImage ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : '';
            break;
          }
        case 'dxIcon':
          label = _message.default.format((0, _inflector.camelize)(icon, true)) || icon;
          break;
        case 'fontIcon':
          label = icon;
          break;
        case 'svg':
          {
            var _titleRegexp$exec;
            const titleRegexp = /<title>(.*?)<\/title>/;
            const title = ((_titleRegexp$exec = titleRegexp.exec(icon)) === null || _titleRegexp$exec === void 0 ? void 0 : _titleRegexp$exec[1]) ?? '';
            label = title;
            break;
          }
        default:
          break;
      }
    }
    return _extends({
      role: 'button'
    }, label ? {
      label
    } : {});
  }
  get cssClasses() {
    return getCssClasses(this.props);
  }
  get iconSource() {
    const {
      icon
    } = this.props;
    return icon ?? '';
  }
  get inkRippleConfig() {
    if (this.__getterCache['inkRippleConfig'] !== undefined) {
      return this.__getterCache['inkRippleConfig'];
    }
    return this.__getterCache['inkRippleConfig'] = (() => {
      const {
        icon,
        text
      } = this.props;
      return !text && icon ? {
        isCentered: true,
        useHoldAnimation: false,
        waveSizeCoefficient: 1
      } : {};
    })();
  }
  get buttonTemplateData() {
    const {
      icon,
      templateData,
      text
    } = this.props;
    return _extends({
      icon,
      text
    }, templateData);
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  focus() {
    this.widgetRef.current.focus();
  }
  activate() {
    this.widgetRef.current.activate();
  }
  deactivate() {
    this.widgetRef.current.deactivate();
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (this.props['icon'] !== nextProps['icon'] || this.props['text'] !== nextProps['text']) {
      this.__getterCache['inkRippleConfig'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        template: getTemplate(props.template),
        iconTemplate: getTemplate(props.iconTemplate)
      }),
      contentRef: this.contentRef,
      submitInputRef: this.submitInputRef,
      inkRippleRef: this.inkRippleRef,
      widgetRef: this.widgetRef,
      onActive: this.onActive,
      onInactive: this.onInactive,
      onWidgetClick: this.onWidgetClick,
      keyDown: this.keyDown,
      emitClickEvent: this.emitClickEvent,
      aria: this.aria,
      cssClasses: this.cssClasses,
      iconSource: this.iconSource,
      inkRippleConfig: this.inkRippleConfig,
      buttonTemplateData: this.buttonTemplateData,
      restAttributes: this.restAttributes
    });
  }
}
exports.Button = Button;
Button.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ButtonProps), Object.getOwnPropertyDescriptors(_extends({}, (0, _utils.convertRulesToOptions)(defaultOptionRules)))));
const __defaultOptionRules = [];
function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  Button.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(Button.defaultProps), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)(defaultOptionRules)), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)(__defaultOptionRules))));
}