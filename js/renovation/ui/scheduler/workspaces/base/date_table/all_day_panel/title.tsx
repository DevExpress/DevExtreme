import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import messageLocalization from '../../../../../../../localization/message';

export const viewFunction = (viewModel: AllDayPanelTitle) => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={`dx-scheduler-all-day-title ${viewModel.props.className}`}
  >
    {viewModel.text}
  </div>
);

@ComponentBindings()
export class AllDayPanelTitleProps {
  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelTitle extends JSXComponent(AllDayPanelTitleProps) {
  // eslint-disable-next-line class-methods-use-this
  get text(): string {
    return messageLocalization.format('dxScheduler-allDay');
  }
}
