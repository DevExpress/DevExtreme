import {
  CSSAttributes,
  Component, ComponentBindings, JSXComponent, OneWay, JSXTemplate, Template, Ref, RefObject,
} from '@devextreme-generator/declarations';
import type { AppointmentTemplateData } from '../../../../ui/scheduler';
import { AppointmentTemplateProps, AppointmentViewModel } from './types';
import { getAppointmentStyles } from './utils';
import { AppointmentContent } from './content';

export const viewFunction = ({
  text,
  dateText,
  styles,
  data,
  index,
  thisAptRef,
  onItemClick,
  props: {
    appointmentTemplate,
  },
}: Appointment): JSX.Element => {
  const AppointmentTemplate = appointmentTemplate;
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      ref={thisAptRef}
      onClick={onItemClick}
      className="dx-scheduler-appointment"
      style={styles}
    >
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

  @OneWay() onItemClick!: (
    data: AppointmentViewModel[],
    target: RefObject<HTMLElement>,
    index: number
  ) => void;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Appointment extends JSXComponent<AppointmentProps, 'viewModel'>() {
  @Ref() thisAptRef!: RefObject<HTMLElement>;

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

  onItemClick(): void {
    this.props.onItemClick([this.props.viewModel], this.thisAptRef, this.props.index);
  }
}
