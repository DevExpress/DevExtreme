import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = ({
  props: {
    text,
    dateText,
    isRecurrent,
    isReduced,
  },
}: AppointmentContent): JSX.Element => (
  <div className="dx-scheduler-appointment-content">
    <div className="dx-scheduler-appointment-title">
      {text}
    </div>
    <div className="dx-scheduler-appointment-content-details">
      <div className="dx-scheduler-appointment-content-date">
        {dateText}
      </div>
    </div>
    {
      isRecurrent && (
        <div className="dx-scheduler-appointment-recurrence-icon dx-icon-repeat" />
      )
    }
    {
      isReduced && (
        <div className="dx-scheduler-appointment-reduced-icon" />
      )
    }
  </div>
);

@ComponentBindings()
export class AppointmentContentProps {
  @OneWay() text = '';

  @OneWay() dateText = '';

  @OneWay() isRecurrent = false;

  @OneWay() isReduced = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentContent extends JSXComponent(AppointmentContentProps) {
}
