import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
// eslint-disable-next-line import/named
import { getDayNames } from '../../../../../localization/date';

export const viewFunction = (viewModel: MonthHeaderPanelCell) => (
  <td
    className={
      `dx-scheduler-header-panel-cell dx-scheduler-cell-sizes-horizontal ${viewModel.props.className}`
    }
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <div>
      {viewModel.weekDay}
    </div>
  </td>
);

@ComponentBindings()
export class MonthHeaderPanelCellProps {
  @OneWay() startDate?: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() className?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class MonthHeaderPanelCell extends JSXComponent(MonthHeaderPanelCellProps) {
  get weekDay(): string {
    const { startDate } = this.props;

    return getDayNames('abbreviated')[startDate!.getDay()];
  }
}
