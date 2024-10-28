/**
* DevExtreme (esm/renovation/ui/overlays/validation_message.js)
* Version: 24.2.0
* Build date: Fri Oct 25 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["accessKey", "activeStateEnabled", "boundary", "className", "contentId", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "mode", "offset", "onClick", "onKeyDown", "positionSide", "rtlEnabled", "tabIndex", "target", "validationErrors", "visible", "visualContainer", "width"];
import { createComponentVNode, normalizeProps } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import LegacyValidationMessage from '../../../ui/validation_message';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { BaseWidgetProps } from '../common/base_props';
export const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return normalizeProps(createComponentVNode(2, DomComponentWrapper, _extends({
    "componentType": LegacyValidationMessage,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
export const ValidationMessageProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseWidgetProps), Object.getOwnPropertyDescriptors({
  mode: 'auto',
  positionSide: 'top',
  offset: Object.freeze({
    h: 0,
    v: 0
  }),
  isReactComponentWrapper: true
})));
export class ValidationMessage extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get componentProps() {
    return this.props;
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
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  }
}
ValidationMessage.defaultProps = ValidationMessageProps;
