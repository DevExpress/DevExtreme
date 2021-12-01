import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
  RefObject, Ref, Method, Mutable, Effect,
} from '@devextreme-generator/declarations';
import LegacyCalendar from '../../../ui/calendar';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { EventCallback } from '../common/event_callback';
import { BaseWidgetProps } from '../common/base_props';

function today(): Date { return new Date(); }

export const viewFunction = ({
  componentProps,
  restAttributes,
  domComponentWrapperRef,
}: Calendar): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyCalendar}
    componentProps={componentProps}
    templateNames={['cellTemplate']}
    ref={domComponentWrapperRef}
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
export class Calendar extends JSXComponent<CalendarProps>() {
  @Ref() domComponentWrapperRef!: RefObject<DomComponentWrapper>;

  @Mutable() instance!: { focus };

  @Effect()
  saveInstance(): void {
    this.instance = this.domComponentWrapperRef.current?.getInstance() as unknown as { focus };
  }

  @Method()
  focus(): void {
    this.instance?.focus();
  }

  /* istanbul ignore next: WA for Angular */
  get componentProps(): CalendarProps {
    return this.props;
  }
}
