import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import { Marker } from './marker';
import { TooltipItemContent } from './item_content';
import { AppointmentViewModel } from '../types';
import { DeleteButton } from './delete_button';

export const viewFunction = (viewModel: TooltipItemLayout): JSX.Element => (
  <div
    className="dx-tooltip-appointment-item"
  >
    <Marker />
    <TooltipItemContent
      text={viewModel.text}
      formattedDate={viewModel.dateText}
    />
    <DeleteButton />
  </div>
);

@ComponentBindings()
export class TooltipItemLayoutProps {
  @OneWay() item!: AppointmentViewModel;

  @OneWay() index = 0;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TooltipItemLayout extends JSXComponent<TooltipItemLayoutProps, 'item'>() {
  get text(): string {
    return this.props.item.appointment.text;
  }

  get dateText(): string {
    return this.props.item.info.dateText;
  }
}
