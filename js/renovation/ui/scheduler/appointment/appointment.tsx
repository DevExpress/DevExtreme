import {
  CSSAttributes,
  Component, ComponentBindings, JSXComponent, OneWay, JSXTemplate, Template,
} from '@devextreme-generator/declarations';
import type { AppointmentTemplateData } from '../../../../ui/scheduler';
import { AppointmentTemplateProps, AppointmentViewModel } from './types';
import { getAppointmentStyles } from './utils';
import { AppointmentContent } from './content';
import { combineClasses } from '../../../utils/combine_classes';

export const viewFunction = ({
  text,
  dateText,
  styles,
  data,
  index,
  classes,
  isReduced,
  props: {
    viewModel: {
      info: {
        isRecurrent,
      },
    },
    appointmentTemplate,
  },
}: Appointment): JSX.Element => {
  const AppointmentTemplate = appointmentTemplate;

  return (
    <div className={classes} style={styles} title={text} role="button">
      {
        !!AppointmentTemplate && (
          <AppointmentTemplate data={data} index={index} />
        )
      }
      {
        !AppointmentTemplate && (
          <AppointmentContent
            text={text}
            dateText={dateText}
            isRecurrent={isRecurrent}
            isReduced={isReduced}
          />
        )
      }
    </div>
  );
};

@ComponentBindings()
export class AppointmentProps {
  @OneWay() viewModel!: AppointmentViewModel;

  @OneWay() index = 0;

  @Template() appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Appointment extends JSXComponent<AppointmentProps, 'viewModel'>() {
  get text(): string { return this.props.viewModel.appointment.text; }

  get dateText(): string { return this.props.viewModel.info.dateText; }

  get styles(): CSSAttributes { return getAppointmentStyles(this.props.viewModel); }

  get data(): AppointmentTemplateData {
    return {
      appointmentData: this.props.viewModel.info.appointment,
      targetedAppointmentData: this.props.viewModel.appointment,
    };
  }

  get index(): number {
    return this.props.index;
  }

  get isReduced(): boolean {
    const { appointmentReduced } = this.props.viewModel.info;
    return !!appointmentReduced;
  }

  get classes(): string {
    const {
      direction,
      isRecurrent,
      allDay,
      appointmentReduced,
    } = this.props.viewModel.info;
    const isVerticalDirection = direction === 'vertical';

    return combineClasses({
      'dx-scheduler-appointment': true,
      'dx-scheduler-appointment-horizontal': !isVerticalDirection,
      'dx-scheduler-appointment-vertical': isVerticalDirection,
      'dx-scheduler-appointment-recurrence': isRecurrent,
      'dx-scheduler-all-day-appointment': allDay,
      'dx-scheduler-appointment-reduced': this.isReduced,
      'dx-scheduler-appointment-head': appointmentReduced === 'head',
      'dx-scheduler-appointment-body': appointmentReduced === 'body',
      'dx-scheduler-appointment-tail': appointmentReduced === 'tail',
    });
  }
}
