import { RefObject } from "inferno";
import { createRef as infernoCreateRef } from 'inferno';
import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { normalizeStyleProp } from '@js/core/utils/style';
import '@js/ui/themes';

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
    const { size, ...restProps } = this.props;
    return restProps;
  }

  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['size'] !== nextProps['size']) {
      this.__getterCache['cssStyles'] = undefined;
    }
  }

  render() {
    const { elementRef, cssStyles } = this;
    return (
      <span
        className="dx-checkbox-icon"
        ref={elementRef}
        style={normalizeStyles(cssStyles)}
      />
    );
  }
}

CheckBoxIcon.defaultProps = defaultCheckBoxIconProps;
