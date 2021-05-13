import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
import { WidgetProps } from './common/widget';
import LegacyCalendar from '../../ui/calendar';
/* eslint-disable import/named */
import { DxElement } from '../../core/element';
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { EventCallback } from './common/event_callback.d';

export const viewFunction = ({
  props: { rootElementRef },
  componentProps,
  restAttributes,
}: Calendar): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef}
    componentType={LegacyCalendar}
    componentProps={componentProps}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class CalendarProps extends WidgetProps {
  @OneWay() min?: Date|number|string;

  @OneWay() max?: Date|number|string;

  @OneWay() firstDayOfWeek?: number;

  @TwoWay() value?: Date|number| string | null = null;

  @Event() valueChange?: EventCallback<Date|number|string>;

  @OneWay() _todayDate: () => Date = () => new Date();

  @OneWay() focusStateEnabled?: boolean;

  @OneWay() hasFocus: ((e: DxElement) => boolean) = () => true;

  @OneWay() tabIndex?: number;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Calendar extends JSXComponent(CalendarProps) {
  get componentProps(): WidgetProps {
    const {
      rootElementRef,
      ...restProps
    } = this.props;

    return restProps;
  }
}
