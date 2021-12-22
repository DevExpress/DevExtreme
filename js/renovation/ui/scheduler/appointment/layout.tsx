import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
  Event,
} from '@devextreme-generator/declarations';
import {
  AppointmentTemplateProps,
  AppointmentViewModel,
  OverflowIndicatorTemplateProps,
  OverflowIndicatorViewModel,
  AppointmentClickData,
  ReducedIconHoverData,
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
    showReducedIconTooltip,
    hideReducedIconTooltip,
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
          showReducedIconTooltip={showReducedIconTooltip}
          hideReducedIconTooltip={hideReducedIconTooltip}
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

  @OneWay() showReducedIconTooltip!: (data: ReducedIconHoverData) => void;

  @OneWay() hideReducedIconTooltip!: () => void;

  @Template() appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;

  @Template() overflowIndicatorTemplate?: JSXTemplate<OverflowIndicatorTemplateProps>;

  @Event() onAppointmentClick?: (e: AppointmentClickData) => void;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class AppointmentLayout extends JSXComponent<AppointmentLayoutProps, 'showReducedIconTooltip' | 'hideReducedIconTooltip'>() {
  get classes(): string {
    const { isAllDay } = this.props;

    return combineClasses({
      'dx-scheduler-scrollable-appointments': !isAllDay,
      'dx-scheduler-all-day-appointments': isAllDay,
    });
  }
}
