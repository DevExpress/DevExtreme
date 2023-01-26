import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = ({
  props: { text },
}: AppointmentTitle): JSX.Element => (
  <div className="dx-scheduler-appointment-title">
    {text}
  </div>
);

@ComponentBindings()
export class AppointmentTitleProps {
  @OneWay() text = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentTitle extends JSXComponent(AppointmentTitleProps) {
}
