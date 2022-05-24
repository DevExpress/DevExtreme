import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Consumer,
  Effect,
  ForwardRef,
  RefObject,
  InternalState,
} from '@devextreme-generator/declarations';
import { AppointmentViewModel, OverflowIndicatorViewModel } from './types';
import { Appointment } from './appointment';
import { OverflowIndicator } from './overflow_indicator/layout';
import { combineClasses } from '../../../utils/combine_classes';
import { AppointmentsContext, IAppointmentContext } from '../appointments_context';
import { EffectReturn } from '../../../utils/effect_return';
import { subscribeToDXPointerDownEvent } from '../../../utils/subscribe_to_event';

const APPOINTMENT_SELECTOR = '.dx-scheduler-appointment';

export const viewFunction = ({
  layoutRef,
  classes,
  appointments,
  overflowIndicators,
  isFocusedAppointment,

  appointmentsContextValue: {
    groups,
    appointmentTemplate,
    showReducedIconTooltip,
    hideReducedIconTooltip,
    onAppointmentClick,
    onAppointmentDoubleClick,
    overflowIndicatorTemplate,
  },
}: AppointmentLayout): JSX.Element => (
  <div
    ref={layoutRef}
    className={classes}
  >
    {
      appointments.map((
        item: AppointmentViewModel,
        index: number,
      ) => (
        <Appointment
          viewModel={item}
          appointmentTemplate={appointmentTemplate}
          index={index}
          key={item.key}
          groups={groups}
          isFocused={isFocusedAppointment(index)}
          onItemClick={onAppointmentClick}
          onItemDoubleClick={onAppointmentDoubleClick}
          showReducedIconTooltip={showReducedIconTooltip}
          hideReducedIconTooltip={hideReducedIconTooltip}
        />
      ))
    }
    {
      overflowIndicators.map((item, index) => (
        <OverflowIndicator
          viewModel={item}
          groups={groups}
          overflowIndicatorTemplate={overflowIndicatorTemplate}
          data-index={index}
          key={item.key}
        />
      ))
    }
  </div>
);

@ComponentBindings()
export class AppointmentLayoutProps {
  @OneWay() isAllDay = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class AppointmentLayout extends JSXComponent(AppointmentLayoutProps) {
  @Consumer(AppointmentsContext)
  appointmentsContextValue!: IAppointmentContext;

  @ForwardRef()
  layoutRef!: RefObject<HTMLDivElement>;

  @InternalState()
  focusedItemIndex = -1;

  get classes(): string {
    const { isAllDay } = this.props;

    return combineClasses({
      'dx-scheduler-scrollable-appointments': !isAllDay,
      'dx-scheduler-all-day-appointments': isAllDay,
    });
  }

  get appointments(): AppointmentViewModel[] {
    if (this.props.isAllDay) {
      return this.appointmentsContextValue.viewModel.allDay;
    }

    return this.appointmentsContextValue.viewModel.regular;
  }

  get overflowIndicators(): OverflowIndicatorViewModel[] {
    if (this.props.isAllDay) {
      return this.appointmentsContextValue.viewModel.allDayCompact;
    }

    return this.appointmentsContextValue.viewModel.regularCompact;
  }

  @Effect()
  pointerEventsEffect(): EffectReturn {
    const disposePointerDown = subscribeToDXPointerDownEvent(
      this.layoutRef.current,
      /* istanbul ignore next: syntetic test */
      (e: MouseEvent) => this.onAppointmentPointerDown(e),
    );

    return (): void => {
      // eslint-disable-next-line rulesdir/no-non-null-assertion
      disposePointerDown!();
    };
  }

  /* istanbul ignore next: syntetic test */
  onAppointmentPointerDown(e: MouseEvent | TouchEvent): void {
    const appointmentElement = (e.target as HTMLElement)
      .closest(APPOINTMENT_SELECTOR) as HTMLElement;

    if (appointmentElement) {
      const { index } = appointmentElement.dataset;
      this.focusedItemIndex = index
        ? parseInt(index, 10)
        : -1;
    }
  }

  isFocusedAppointment(index: number): boolean {
    return index === this.focusedItemIndex;
  }
}
