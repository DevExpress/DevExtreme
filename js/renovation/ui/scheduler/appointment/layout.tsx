import {
  Component, ComponentBindings, JSXComponent, JSXTemplate, OneWay, Template, Event,
} from '@devextreme-generator/declarations';
import { AppointmentTemplateProps, AppointmentViewModel } from './types';
import { Appointment } from './appointment';

export const viewFunction = ({
  props: {
    appointments,
    appointmentTemplate,
    onAppointmentClick,
  },
}: AppointmentLayout): JSX.Element => (
  <div
    className="dx-scheduler-appointments"
  >
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
  </div>
);

@ComponentBindings()
export class AppointmentLayoutProps {
  @OneWay() appointments: AppointmentViewModel[] = [];

  @Template() appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;

  @Event() onAppointmentClick?: (e: {
    data: AppointmentViewModel[];
    target: HTMLElement | undefined;
    index: number;
  }) => void;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class AppointmentLayout extends JSXComponent(AppointmentLayoutProps) {
}
