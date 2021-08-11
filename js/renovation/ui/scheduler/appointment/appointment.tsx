import {
  CSSAttributes,
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import { AppointmentViewModel } from './types';
import { getAppointmentStyles } from './utils';

export const viewFunction = ({
  text,
  dateText,
  styles,
}: Appointment): JSX.Element => (
  <div
    className="dx-scheduler-appointment"
    style={styles}
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

  get styles(): CSSAttributes { return getAppointmentStyles(this.props.viewModel); }
}
