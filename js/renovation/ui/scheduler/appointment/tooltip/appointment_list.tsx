import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { TooltipItemLayout } from './item_layout';
import { AppointmentViewModel } from '../types';
import { List } from '../../../list';

export const viewFunction = (viewModel: AppointmentList): JSX.Element => (
  <List
    itemTemplate={TooltipItemLayout}
    dataSource={viewModel.props.appointments}
  />
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
