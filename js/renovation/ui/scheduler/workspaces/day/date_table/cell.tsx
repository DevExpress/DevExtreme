import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import {
  DateTableCellBase,
  DateTableCellBaseProps,
} from '../../base/date_table/cell';

export const viewFunction = (viewModel: DayDateTableCell): JSX.Element => (
  <DateTableCellBase
    startDate={viewModel.props.startDate}
    endDate={viewModel.props.endDate}
    groups={viewModel.props.groups}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    isFirstCell={viewModel.props.isFirstCell}
    isLastCell={viewModel.props.isLastCell}
    className={viewModel.props.className}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DayDateTableCell extends JSXComponent(DateTableCellBaseProps) {
}
