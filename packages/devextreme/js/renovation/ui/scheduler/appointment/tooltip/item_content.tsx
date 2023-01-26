import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = (viewModel: TooltipItemContent): JSX.Element => (
  <div
    className="dx-tooltip-appointment-item-content"
  >
    <div className="dx-tooltip-appointment-item-content-subject">
      {viewModel.props.text}
    </div>
    <div className="dx-tooltip-appointment-item-content-date">
      {viewModel.props.formattedDate}
    </div>
  </div>
);

@ComponentBindings()
export class TooltipItemContentProps {
  @OneWay() text!: string;

  @OneWay() formattedDate!: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TooltipItemContent extends JSXComponent<TooltipItemContentProps, 'text' | 'formattedDate'>() { }
