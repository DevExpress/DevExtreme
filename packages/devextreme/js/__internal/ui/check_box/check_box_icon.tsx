/* eslint-disable @typescript-eslint/no-unsafe-return */
import '@js/ui/themes';

import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { normalizeStyleProp } from '@js/core/utils/style';
import type { RefObject } from 'inferno';
import { createRef as infernoCreateRef } from 'inferno';

export interface CheckBoxIconProps {
  size?: number | string;
}

export const defaultCheckBoxIconProps = {};

export class CheckBoxIcon extends BaseInfernoComponent<CheckBoxIconProps> {
  elementRef!: RefObject<HTMLDivElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly __getterCache: any;

  constructor(props: CheckBoxIconProps) {
    super(props);
    this.state = {};
    this.elementRef = infernoCreateRef();
    this.__getterCache = {};
  }

  get cssStyles(): Record<string, unknown> {
    if (this.__getterCache.cssStyles !== undefined) {
      return this.__getterCache.cssStyles;
    }
    // eslint-disable-next-line no-return-assign
    return this.__getterCache.cssStyles = ((): Record<string, unknown> => {
      const {
        size,
      } = this.props;
      const fontSize = normalizeStyleProp('fontSize', size);
      return {
        fontSize,
      };
    })();
  }

  get restAttributes(): Record<string, unknown> {
    const { size, ...restProps } = this.props;
    return restProps;
  }

  componentWillUpdate(nextProps: CheckBoxIconProps): void {
    if (this.props.size !== nextProps.size) {
      this.__getterCache.cssStyles = undefined;
    }
  }

  render(): JSX.Element {
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
