import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = ({
  props: {
    dateText,
  },
}: AppointmentDetails): JSX.Element => (
  <div className="dx-scheduler-appointment-content-details">
    <div className="dx-scheduler-appointment-content-date">
      {dateText}
    </div>
  </div>
);

@ComponentBindings()
export class AppointmentDetailsProps {
  @OneWay() dateText = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentDetails extends JSXComponent(AppointmentDetailsProps) {
}
