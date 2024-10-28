import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["size"];
import { createVNode, RefObject } from "inferno";
import { createRef as infernoCreateRef } from 'inferno';
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { normalizeStyles } from '@devextreme/runtime/inferno';
import { normalizeStyleProp } from '@js/core/utils/style';
import '@js/ui/themes';

export const viewFunction = viewModel => {
  const {
    cssStyles,
    elementRef
  } = viewModel;
  return createVNode(1, "span", "dx-checkbox-icon", null, 1, {
    "style": normalizeStyles(cssStyles)
  }, null, elementRef);
};

export interface CheckBoxIconProps {
  size?: number | string;
}

export const defaultCheckBoxIconProps = {};

export class CheckBoxIcon extends BaseInfernoComponent {
  elementRef!: RefObject<HTMLDivElement>;

  private __getterCache: any;

  constructor(props) {
    super(props);
    this.state = {};
    this.elementRef = infernoCreateRef();
    this.__getterCache = {};
  }

  get cssStyles() {
    if (this.__getterCache['cssStyles'] !== undefined) {
      return this.__getterCache['cssStyles'];
    }
    return this.__getterCache['cssStyles'] = (() => {
      const {
        size
      } = this.props;
      const fontSize = normalizeStyleProp('fontSize', size);
      return {
        fontSize
      };
    })();
  }

  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }

  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['size'] !== nextProps['size']) {
      this.__getterCache['cssStyles'] = undefined;
    }
  }

  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      elementRef: this.elementRef,
      cssStyles: this.cssStyles,
      restAttributes: this.restAttributes
    });
  }
}

CheckBoxIcon.defaultProps = defaultCheckBoxIconProps;
