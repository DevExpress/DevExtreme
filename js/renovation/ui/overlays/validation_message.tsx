import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import LegacyValidationMessage from '../../../ui/validation_message';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { BaseWidgetProps } from '../common/base_props';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: ValidationMessage): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyValidationMessage}
    componentProps={componentProps}
    templateNames={[]}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class ValidationMessageProps extends BaseWidgetProps {
  @OneWay() mode?: 'auto' | 'always' = 'auto';

  @OneWay() validationErrors?: Record<string, unknown>[] | null;

  @OneWay() positionSide?: string = 'top';

  @OneWay() boundary?: string | Element | null;

  @OneWay() visualContainer?: string | Element | null;

  @OneWay() target?: string | Element | null;

  @OneWay() offset?: Record<string, number> = { h: 0, v: 0 };

  @OneWay() contentId?: string;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ValidationMessage extends JSXComponent(ValidationMessageProps) {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): ValidationMessageProps {
    return this.props;
  }
}
