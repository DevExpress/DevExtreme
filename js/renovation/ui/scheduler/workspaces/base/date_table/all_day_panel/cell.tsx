import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import { DateTableCellBaseProps, DateTableCellBase } from '../cell';

export const viewFunction = (viewModel: AllDayPanelCell): JSX.Element => (
  <DateTableCellBase
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={`dx-scheduler-all-day-table-cell ${viewModel.props.className}`}
    startDate={viewModel.props.startDate}
    endDate={viewModel.props.endDate}
    groups={viewModel.props.groups}
    groupIndex={viewModel.props.groupIndex}
    allDay
    isFirstGroupCell={viewModel.props.isFirstGroupCell}
    isLastGroupCell={viewModel.props.isLastGroupCell}
    index={viewModel.props.index}
    dataCellTemplate={viewModel.props.dataCellTemplate}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelCell extends JSXComponent(DateTableCellBaseProps) {}
