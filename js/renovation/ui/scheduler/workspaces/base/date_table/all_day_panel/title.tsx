/* eslint-disable @typescript-eslint/no-extraneous-class */
import {
  Component, ComponentBindings, JSXComponent,
} from '@devextreme-generator/declarations';
import messageLocalization from '../../../../../../../localization/message';

export const viewFunction = (viewModel: AllDayPanelTitle): JSX.Element => (
  <div
    className="dx-scheduler-all-day-title"
  >
    {viewModel.text}
  </div>
);

@ComponentBindings()
export class AllDayPanelTitleProps {}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class AllDayPanelTitle extends JSXComponent(AllDayPanelTitleProps) {
  // eslint-disable-next-line class-methods-use-this
  get text(): string {
    return messageLocalization.format('dxScheduler-allDay');
  }
}
