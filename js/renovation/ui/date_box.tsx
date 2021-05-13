import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
import { WidgetProps } from './common/widget';
import LegacyDateBox from '../../ui/date_box';
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { EventCallback } from './common/event_callback.d';

export const viewFunction = ({
  props: { rootElementRef },
  componentProps,
  restAttributes,
}: DateBox): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef}
    componentType={LegacyDateBox}
    componentProps={componentProps}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class DateBoxProps extends WidgetProps {
  @TwoWay() value?: Date | number | string | null = null;

  @Event() valueChange?: EventCallback<Date|number|string>;

  @OneWay() width?: number | string | (() => number| string);

  @OneWay() calendarOptions?: {
    firstDayOfWeek?: number;
  };

  @OneWay() field?: string;

  @OneWay() type?: string ;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateBox extends JSXComponent(DateBoxProps) {
  get componentProps(): WidgetProps {
    const {
      rootElementRef,
      ...restProps
    } = this.props;

    return restProps;
  }
}
