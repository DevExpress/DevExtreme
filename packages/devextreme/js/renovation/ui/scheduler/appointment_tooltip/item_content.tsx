import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = (viewModel: TooltipItemContent): JSX.Element => (
  <div
    className={`dx-tooltip-appointment-item-content ${viewModel.props.className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <div className="dx-tooltip-appointment-item-content-subject">{viewModel.props.text}</div>
    <div className="dx-tooltip-appointment-item-content-date">
      {viewModel.props.formattedDate}
    </div>
  </div>
);

@ComponentBindings()
export class TooltipItemContentProps {
  @OneWay() className?: string = '';

  @OneWay() text?: string = '';

  @OneWay() formattedDate?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TooltipItemContent extends JSXComponent(TooltipItemContentProps) {}
