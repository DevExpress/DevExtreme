import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import messageLocalization from '../../../../../../../localization/message';
import { combineClasses } from '../../../../../../utils/combine_classes';

export const viewFunction = (viewModel: AllDayPanelTitle): JSX.Element => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.classes}
  >
    {viewModel.text}
  </div>
);

@ComponentBindings()
export class AllDayPanelTitleProps {
  @OneWay() className = '';

  @OneWay() visible? = true;
}

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

  get classes(): string {
    return combineClasses({
      'dx-scheduler-all-day-title': true,
      'dx-scheduler-all-day-title-hidden': !this.props.visible,
      [this.props.className]: !!this.props.className,
    });
  }
}
