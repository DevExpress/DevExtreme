import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = ({
  props: {
    text,
    dateText,
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
  </div>
);

@ComponentBindings()
export class AppointmentContentProps {
  @OneWay() text = '';

  @OneWay() dateText = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentContent extends JSXComponent(AppointmentContentProps) {
}
