import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import { AppointmentViewModel } from './types';
import { Appointment } from './appointment';

export const viewFunction = ({
  restAttributes,
  props: {
    items,
  },
}: AppointmentLayout): JSX.Element => (
  <div
    className="dx-scheduler-appointments"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    {
      items.map((item: AppointmentViewModel) => (
        <Appointment viewModel={item} />
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
