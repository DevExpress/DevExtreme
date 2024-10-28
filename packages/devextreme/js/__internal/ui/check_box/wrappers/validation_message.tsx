import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["accessKey", "activeStateEnabled", "boundary", "className", "contentId", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "mode", "offset", "onClick", "onKeyDown", "positionSide", "rtlEnabled", "tabIndex", "target", "validationErrors", "visible", "visualContainer", "width"];
import { createComponentVNode, normalizeProps } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import LegacyValidationMessage from '@js/ui/validation_message';
import { DomComponentWrapper } from '@ts/core/r1/dom_component_wrapper';
import { BaseWidgetProps, BaseWidgetDefaultProps } from '@ts/core/r1/base_props';

export interface ValidationMessageProps extends BaseWidgetProps {
  mode?: 'auto' | 'always';

  validationErrors?: Record<string, unknown>[] | null;

  positionSide?: string;

  boundary?: string | Element | null;

  visualContainer?: string | Element | null;

  target?: string | Element | null;

  offset?: Record<string, number>;

  contentId?: string;
}

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

export const defaultValidationMessageProps = {
  ...BaseWidgetDefaultProps,
  mode: 'auto',
  positionSide: 'top',
  offset: Object.freeze({
    h: 0,
    v: 0
  }),
  isReactComponentWrapper: true
}

export class ValidationMessage extends BaseInfernoComponent<ValidationMessageProps> {
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
ValidationMessage.defaultProps = defaultValidationMessageProps;
