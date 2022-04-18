import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Consumer,
} from '@devextreme-generator/declarations';
import { AppointmentViewModel, OverflowIndicatorViewModel } from './types';
import { Appointment } from './appointment';
import { OverflowIndicator } from './overflow_indicator/layout';
import { combineClasses } from '../../../utils/combine_classes';
import { AppointmentsContext, IAppointmentContext } from '../appointments_context';

export const viewFunction = ({
  classes,
  appointments,
  overflowIndicators,

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
  <div className={classes}>
    {
      appointments.map((item: AppointmentViewModel, index: number) => (
        <Appointment
          viewModel={item}
          appointmentTemplate={appointmentTemplate}
          index={index}
          key={item.key}
          groups={groups}
          onItemClick={onAppointmentClick}
          onItemDoubleClick={onAppointmentDoubleClick}
          showReducedIconTooltip={showReducedIconTooltip}
          hideReducedIconTooltip={hideReducedIconTooltip}
        />
      ))
    }
    {
      overflowIndicators.map((item) => (
        <OverflowIndicator
          viewModel={item}
          groups={groups}
          overflowIndicatorTemplate={overflowIndicatorTemplate}
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
}
