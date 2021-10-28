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
  props: {
    appointmentTemplate,
  },
}: Appointment): JSX.Element => {
  const AppointmentTemplate = appointmentTemplate;

  return (
    <div className={classes} style={styles}>
      {
        !!AppointmentTemplate && (
          <AppointmentTemplate data={data} index={index} />
        )
      }
      {
        !AppointmentTemplate && (
          <AppointmentContent text={text} dateText={dateText} />
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

  get classes(): string {
    const { direction } = this.props.viewModel.info;
    const isVerticalDirection = direction === 'vertical';

    return combineClasses({
      'dx-scheduler-appointment': true,
      'dx-scheduler-appointment-horizontal': !isVerticalDirection,
      'dx-scheduler-appointment-vertical': isVerticalDirection,
    });
  }
}
