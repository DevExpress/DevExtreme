import {
  Component, ComponentBindings, ForwardRef, JSXComponent, OneWay, RefObject,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './common/widget';
import LegacyValidationMessage from '../../ui/validation_message';
import { DomComponentWrapper } from './common/dom_component_wrapper';

export const viewFunction = ({
  props: { rootElementRef },
  componentProps,
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
export class ValidationMessageProps extends WidgetProps {
  @OneWay() mode?: 'auto'|'always' = 'auto';

  @OneWay() validationErrors?: object[] | null;

  @OneWay() positionRequest?: string;

  @ForwardRef() boundary?: RefObject<string | Element>;

  @ForwardRef() container?: RefObject<string | Element>;

  @ForwardRef() target?: RefObject<string | Element>;

  @OneWay() offset?: object = { h: 0, v: 0 };
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ValidationMessage extends JSXComponent(ValidationMessageProps) {
  get componentProps(): WidgetProps {
    const {
      rootElementRef,
      ...restProps
    } = this.props;

    return restProps;
  }
}
