import {
  CSSAttributes,
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  JSXTemplate,
  Template,
  RefObject,
  Event,
  ForwardRef,
} from '@devextreme-generator/declarations';
import {
  AppointmentTemplateProps,
  AppointmentViewModel,
  AppointmentClickData,
} from './types';
import { getAppointmentStyles } from './utils';
import { AppointmentContent } from './content/layout';
import { Widget } from '../../common/widget';
import { combineClasses } from '../../../utils/combine_classes';
import type { AppointmentTemplateData } from '../../../../ui/scheduler';

export const viewFunction = ({
  text,
  styles,
  ref,
  onItemClick,
  classes,
  isReduced,
  data,
  dateText,
  props: {
    viewModel: {
      info: {
        isRecurrent,
      },
    },
    index,
    appointmentTemplate,
  },
}: Appointment): JSX.Element => (
  <Widget
    onClick={onItemClick}
    rootElementRef={ref}
    style={styles}
    classes={classes}
    hint={text}
    {...{ role: 'button' }}
  >
    <AppointmentContent
      text={text}
      isReduced={isReduced}
      dateText={dateText}
      isRecurrent={isRecurrent}
      index={index}
      data={data}
      appointmentTemplate={appointmentTemplate}
    />
  </Widget>
);

@ComponentBindings()
export class AppointmentProps {
  @OneWay() viewModel!: AppointmentViewModel;

  @OneWay() index = 0;

  @Template() appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;

  @Event() onItemClick!: (e: AppointmentClickData) => void;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Appointment extends JSXComponent<AppointmentProps, 'viewModel' | 'onItemClick'>() {
  @ForwardRef() ref!: RefObject<HTMLDivElement>;

  get text(): string { return this.props.viewModel.appointment.text; }

  get styles(): CSSAttributes {
    return getAppointmentStyles(this.props.viewModel);
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

  get dateText(): string { return this.props.viewModel.info.dateText; }

  get data(): AppointmentTemplateData {
    return {
      appointmentData: this.props.viewModel.info.appointment,
      targetedAppointmentData: this.props.viewModel.appointment,
    };
  }

  onItemClick(): void {
    const e = {
      data: [this.props.viewModel],
      target: this.ref.current as HTMLDivElement,
      index: this.props.index,
    };

    this.props.onItemClick(e);
  }
}
