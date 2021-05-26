import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
import LegacyCalendar from '../../ui/calendar';
/* eslint-disable import/named */
import { DxElement } from '../../core/element';
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { EventCallback } from './common/event_callback.d';
import { BaseWidgetProps } from './common/base_props';

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
  @OneWay() min?: Date|number|string;

  @OneWay() max?: Date|number|string;

  @OneWay() firstDayOfWeek?: number;

  @TwoWay() value?: Date|number| string | null = null;

  @Event() valueChange?: EventCallback<Date|number|string>;

  @OneWay() focusStateEnabled?: boolean;

  @OneWay() tabIndex?: number;

  @OneWay() _todayDate: () => Date = () => new Date();

  @OneWay() hasFocus: ((e: DxElement) => boolean) = () => true;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Calendar extends JSXComponent<CalendarProps>() { }
