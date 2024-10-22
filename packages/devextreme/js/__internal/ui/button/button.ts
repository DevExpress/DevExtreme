/**
* DevExtreme (esm/renovation/ui/button.js)
* Version: 24.2.0
* Build date: Tue Oct 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["accessKey", "activeStateEnabled", "children", "className", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "icon", "iconPosition", "iconTemplate", "onClick", "onKeyDown", "onSubmit", "pressed", "rtlEnabled", "stylingMode", "tabIndex", "template", "templateData", "text", "type", "useInkRipple", "useSubmitBehavior", "visible", "width"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { InfernoEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { createDefaultOptionRules, convertRulesToOptions } from '../../core/options/utils';
import devices from '../../core/devices';
import { isMaterial, current } from '../../ui/themes';
import { click } from '../../events/short';
import { combineClasses } from '../utils/combine_classes';
import { getImageSourceType } from '../../core/utils/icon';
import { camelize } from '../../core/utils/inflector';
import { Icon } from './common/icon';
import { InkRipple } from './common/ink_ripple';
import { Widget } from './common/widget';
import { BaseWidgetProps } from './common/base_props';
import messageLocalization from '../../localization/message';
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
  return combineClasses(classesMap);
};
export const viewFunction = viewModel => {
  const {
    children,
    iconPosition,
    iconTemplate: IconTemplate,
    template: ButtonTemplate,
    text
  } = viewModel.props;
  const renderText = !viewModel.props.template && !children && text !== '';
  const isIconLeft = iconPosition === 'left';
  const iconComponent = !viewModel.props.template && !children && (viewModel.iconSource || viewModel.props.iconTemplate) && createComponentVNode(2, Icon, {
    "source": viewModel.iconSource,
    "position": iconPosition,
    "iconTemplate": IconTemplate
  });
  return normalizeProps(createComponentVNode(2, Widget, _extends({
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
    children: createVNode(1, "div", "dx-button-content", [viewModel.props.template && ButtonTemplate({
      data: viewModel.buttonTemplateData
    }), !viewModel.props.template && children, isIconLeft && iconComponent, renderText && createVNode(1, "span", "dx-button-text", text, 0), !isIconLeft && iconComponent, viewModel.props.useSubmitBehavior && createVNode(64, "input", "dx-button-submit-input", null, 1, {
      "type": "submit",
      "tabIndex": -1
    }, null, viewModel.submitInputRef), viewModel.props.useInkRipple && createComponentVNode(2, InkRipple, {
      "config": viewModel.inkRippleConfig
    }, null, viewModel.inkRippleRef)], 0, null, null, viewModel.contentRef)
  }), null, viewModel.widgetRef));
};
export const ButtonProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseWidgetProps), Object.getOwnPropertyDescriptors({
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
export const defaultOptionRules = createDefaultOptionRules([{
  device: () => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
  options: {
    focusStateEnabled: true
  }
}, {
  device: () => isMaterial(current()),
  options: {
    useInkRipple: true
  }
}]);
import { createReRenderEffect } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class Button extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.contentRef = infernoCreateRef();
    this.inkRippleRef = infernoCreateRef();
    this.submitInputRef = infernoCreateRef();
    this.widgetRef = infernoCreateRef();
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
    return [new InfernoEffect(this.submitEffect, [this.props.onSubmit, this.props.useSubmitBehavior]), createReRenderEffect()];
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
      click.on(this.submitInputRef.current, event => onSubmit({
        event,
        submitInput: this.submitInputRef.current
      }), {
        namespace
      });
      return () => click.off(this.submitInputRef.current, {
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
      const iconSource = getImageSourceType(icon);
      switch (iconSource) {
        case 'image':
          {
            const notURLRegexp = /^(?!(?:https?:\/\/)|(?:ftp:\/\/)|(?:www\.))[^\s]+$/;
            const isPathToImage = !icon.includes('base64') && notURLRegexp.test(icon);
            label = isPathToImage ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : '';
            break;
          }
        case 'dxIcon':
          label = messageLocalization.format(camelize(icon, true)) || icon;
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
Button.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ButtonProps), Object.getOwnPropertyDescriptors(_extends({}, convertRulesToOptions(defaultOptionRules)))));
const __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  Button.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(Button.defaultProps), Object.getOwnPropertyDescriptors(convertRulesToOptions(defaultOptionRules)), Object.getOwnPropertyDescriptors(convertRulesToOptions(__defaultOptionRules))));
}
