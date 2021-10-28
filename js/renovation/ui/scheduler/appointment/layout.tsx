import {
  Component, ComponentBindings, JSXComponent, JSXTemplate, OneWay, Template,
} from '@devextreme-generator/declarations';
import {
  AppointmentTemplateProps,
  AppointmentViewModel,
  OverflowIndicatorTemplateProps,
  OverflowIndicatorViewModel,
} from './types';
import { Appointment } from './appointment';
import { OverflowIndicator } from './overflow_indicator/layout';

export const viewFunction = ({
  props: {
    appointments,
    overflowIndicators,
    appointmentTemplate,
    overflowIndicatorTemplate,
  },
}: AppointmentLayout): JSX.Element => (
  <div className="dx-scheduler-appointments">
    {
      appointments.map((item: AppointmentViewModel, index: number) => (
        <Appointment
          viewModel={item}
          appointmentTemplate={appointmentTemplate}
          index={index}
          key={item.key}
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
  @OneWay() appointments: AppointmentViewModel[] = [];

  @OneWay() overflowIndicators: OverflowIndicatorViewModel[] = [];

  @Template() appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;

  @Template() overflowIndicatorTemplate?: JSXTemplate<OverflowIndicatorTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class AppointmentLayout extends JSXComponent(AppointmentLayoutProps) {
}
