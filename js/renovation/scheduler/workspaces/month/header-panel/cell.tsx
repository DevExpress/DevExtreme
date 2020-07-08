import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import dateLocalization from '../../../../../localization/date';

const formatWeekday = (date: Date): string => dateLocalization.getDayNames('abbreviated')[date.getDay()];

export const viewFunction = (viewModel: MonthHeaderPanelCell) => (
  <td
    className="dx-scheduler-header-panel-cell dx-scheduler-cell-sizes-horizontal"
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <div>
      {formatWeekday(viewModel.props.startDate!)}
    </div>
  </td>
);

@ComponentBindings()
export class MonthHeaderPanelCellProps {
  @OneWay() startDate?: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() otherMonth?: boolean = false;

  @OneWay() today?: boolean = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class MonthHeaderPanelCell extends JSXComponent(MonthHeaderPanelCellProps) {}
