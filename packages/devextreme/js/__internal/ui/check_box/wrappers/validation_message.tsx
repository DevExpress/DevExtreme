import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import LegacyValidationMessage from '@js/ui/validation_message';
import type { BaseWidgetProps } from '@ts/core/r1/base_props';
import { BaseWidgetDefaultProps } from '@ts/core/r1/base_props';
import { DomComponentWrapper } from '@ts/core/r1/dom_component_wrapper';

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

export const defaultValidationMessageProps = {
  ...BaseWidgetDefaultProps,
  mode: 'auto',
  positionSide: 'top',
  offset: Object.freeze({
    h: 0,
    v: 0,
  }),
  isReactComponentWrapper: true,
};

export class ValidationMessage extends BaseInfernoComponent<ValidationMessageProps> {
  constructor(props: ValidationMessageProps) {
    super(props);
    this.state = {};
  }

  get restAttributes(): Record<string, unknown> {
    const {
      // eslint-disable-next-line @stylistic/max-len
      accessKey, activeStateEnabled, boundary, className, contentId, disabled, focusStateEnabled, height, hint, hoverStateEnabled, mode, offset, onClick, onKeyDown, positionSide, rtlEnabled, tabIndex, target, validationErrors, visible, visualContainer, width,
      ...restProps
    } = this.props;

    return restProps;
  }

  render(): JSX.Element {
    return (
      <DomComponentWrapper
        componentType={LegacyValidationMessage}
        componentProps={this.props}
        templateNames={[]}
        {...this.restAttributes}
      />
    );
  }
}
ValidationMessage.defaultProps = defaultValidationMessageProps;
