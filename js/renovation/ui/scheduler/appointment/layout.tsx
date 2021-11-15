import {
  Component, ComponentBindings, JSXComponent, JSXTemplate, OneWay, Template, Event,
} from '@devextreme-generator/declarations';
import {
  AppointmentTemplateProps,
  AppointmentViewModel,
  OverflowIndicatorTemplateProps,
  OverflowIndicatorViewModel,
} from './types';
import { Appointment } from './appointment';
import { OverflowIndicator } from './overflow_indicator/layout';
import { combineClasses } from '../../../utils/combine_classes';

export const viewFunction = ({
  classes,
  props: {
    appointments,
    overflowIndicators,
    appointmentTemplate,
    onAppointmentClick,
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
          onItemClick={onAppointmentClick}
        />
      ))
    }
    {
      overflowIndicators.map((item) => (
        <OverflowIndicator
          viewModel={item}
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

  @OneWay() appointments: AppointmentViewModel[] = [];

  @OneWay() overflowIndicators: OverflowIndicatorViewModel[] = [];

  @Template() appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;

  @Event() onAppointmentClick?: (e: {
    data: AppointmentViewModel[];
    target: HTMLElement | undefined;
    index: number;
  }) => void;

  @Template() overflowIndicatorTemplate?: JSXTemplate<OverflowIndicatorTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class AppointmentLayout extends JSXComponent(AppointmentLayoutProps) {
  get classes(): string {
    const { isAllDay } = this.props;

    return combineClasses({
      'dx-scheduler-scrollable-appointments': !isAllDay,
      'dx-scheduler-all-day-appointments': isAllDay,
    });
  }
}
