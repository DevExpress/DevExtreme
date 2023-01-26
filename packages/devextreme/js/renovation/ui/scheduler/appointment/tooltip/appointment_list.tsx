import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { TooltipItemLayout } from './item_layout';
import { AppointmentViewModel } from '../types';

export const viewFunction = (viewModel: AppointmentList): JSX.Element => (
  <div>
    {viewModel.props.appointments.map((item, index) => (
      <TooltipItemLayout
        item={item}
        index={index}
        key={item.key}
      />
    ))}
  </div>
);

@ComponentBindings()
export class AppointmentListProps {
  @OneWay() appointments!: AppointmentViewModel[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentList extends JSXComponent<AppointmentListProps, 'appointments'>() {
}
