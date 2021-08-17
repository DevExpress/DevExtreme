import {
  CSSAttributes,
  Component, ComponentBindings, JSXComponent, OneWay, JSXTemplate, Template,
} from '@devextreme-generator/declarations';
import { AppointmentTemplateProps, AppointmentViewModel } from './types';
import { getAppointmentStyles } from './utils';

export const viewFunction = ({
  text,
  dateText,
  styles,
  appointmentTemplateProps,
  props: {
    AppointmentTemplate,
  },
}: Appointment): JSX.Element => (
  <div
    className="dx-scheduler-appointment"
    style={styles}
  >
    { AppointmentTemplate && (
    <AppointmentTemplate
          // eslint-disable-next-line react/jsx-props-no-spreading
      {...appointmentTemplateProps}
    />
    )}
    { !AppointmentTemplate && (
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
    )}
  </div>
);

@ComponentBindings()
export class AppointmentProps {
  @OneWay() viewModel!: AppointmentViewModel;

  @OneWay() index = 0;

  @Template() AppointmentTemplate?: JSXTemplate;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Appointment extends JSXComponent<AppointmentProps, 'viewModel'>() {
  get text(): string { return this.props.viewModel.appointment.text; }

  get dateText(): string { return this.props.viewModel.info.dateText; }

  get styles(): CSSAttributes { return getAppointmentStyles(this.props.viewModel); }

  get appointmentTemplateProps(): AppointmentTemplateProps {
    return {
      model: {
        appointmentData: this.props.viewModel.info.appointment,
        targetedAppointmentData: this.props.viewModel.appointment,
      },
      itemIndex: this.props.index,
    };
  }
}
