import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import { AppointmentViewModel } from './types';
import { Appointment } from './appointment';
import { getAppointmentKey } from './utils';

export const viewFunction = ({
  props: {
    items,
  },
}: AppointmentLayout): JSX.Element => (
  <div
    className="dx-scheduler-appointments"
  >
    {
      items.map((item: AppointmentViewModel) => (
        <Appointment
          viewModel={item}
          key={getAppointmentKey(item)}
        />
      ))
    }
  </div>
);

@ComponentBindings()
export class AppointmentLayoutProps {
  @OneWay() items: AppointmentViewModel[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class AppointmentLayout extends JSXComponent(AppointmentLayoutProps) {
}
