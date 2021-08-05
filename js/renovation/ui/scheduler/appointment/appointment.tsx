import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import { AppointmentViewModel } from './types';
import {
  getAppointmentStyles,
  getAppointmentKey,
} from './utils';

export const viewFunction = ({
  restAttributes,
  props: {
    viewModel,
  },
  text,
  dateText,
}: Appointment): JSX.Element => (
  <div
    className="dx-scheduler-appointment"
    style={getAppointmentStyles(viewModel)}
    key={getAppointmentKey(viewModel)}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    <div className="dx-scheduler-appointment-content">
      <div className="dx-scheduler-appointment-title">
        {text}
      </div>
      <div className="dx-scheduler-appointment-content-details">
        <div className="dx-scheduler-appointment-content-date">
          {dateText}
        </div>
      </div>
    </div>
  </div>
);

@ComponentBindings()
export class AppointmentProps {
  @OneWay() viewModel!: AppointmentViewModel;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Appointment extends JSXComponent(AppointmentProps) {
  get text(): string { return this.props.viewModel.appointment.text; }

  get dateText(): string { return this.props.viewModel.info.dateText; }
}
