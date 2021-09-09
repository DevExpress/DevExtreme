import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
import LegacyCalendar from '../../../ui/calendar';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { EventCallback } from '../common/event_callback';
import { BaseWidgetProps } from '../common/base_props';

function today(): Date { return new Date(); }

export const viewFunction = ({
  props,
  restAttributes,
}: Calendar): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyCalendar}
    componentProps={props}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class CalendarProps extends BaseWidgetProps {
  @OneWay() min?: Date | number | string;

  @OneWay() max?: Date | number | string;

  @OneWay() firstDayOfWeek?: number;

  @TwoWay() value?: Date | number | string | null = null;

  @Event() valueChange?: EventCallback<Date | number | string>;

  @OneWay() focusStateEnabled?: boolean;

  @OneWay() tabIndex?: number;

  // Scheduler private API
  @OneWay() _todayDate? = today;

  @OneWay() skipFocusCheck?: boolean = false;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Calendar extends JSXComponent<CalendarProps>() { }
