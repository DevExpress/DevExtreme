import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import {
  DateTableCellBase,
  DateTableCellBaseProps,
} from '../../base/date_table/cell';

export const viewFunction = (viewModel: DayDateTableCell): JSX.Element => (
  <DateTableCellBase
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    dataCellTemplate={viewModel.props.dataCellTemplate}
    isFirstCell={viewModel.props.isFirstCell}
    isLastCell={viewModel.props.isLastCell}
    startDate={viewModel.props.startDate}
    endDate={viewModel.props.endDate}
    groups={viewModel.props.groups}
    groupIndex={viewModel.props.groupIndex}
    index={viewModel.props.index}
    className={viewModel.props.className}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DayDateTableCell extends JSXComponent(DateTableCellBaseProps) {
}
