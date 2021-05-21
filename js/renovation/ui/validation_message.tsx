import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import LegacyValidationMessage from '../../ui/validation_message';
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { BaseWidgetProps } from './common/base_props';

export const viewFunction = ({
  props: { rootElementRef, ...componentProps },
  restAttributes,
}: ValidationMessage): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef}
    componentType={LegacyValidationMessage}
    componentProps={componentProps}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class ValidationMessageProps extends BaseWidgetProps {
  @OneWay() mode?: 'auto'|'always' = 'auto';

  @OneWay() validationErrors?: Record<string, unknown>[] | null;

  @OneWay() positionRequest?: string;

  @OneWay() boundary?: string | Element | null;

  @OneWay() container?: string | Element | null;

  @OneWay() target?: string | Element | null;

  @OneWay() offset?: Record<string, number> = { h: 0, v: 0 };
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ValidationMessage extends JSXComponent(ValidationMessageProps) { }
