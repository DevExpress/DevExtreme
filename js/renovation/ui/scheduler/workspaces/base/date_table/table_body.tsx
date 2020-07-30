import {
  Component, ComponentBindings, JSXComponent, Fragment, Template,
} from 'devextreme-generator/component_declaration/common';
import { DateTableRow } from './row';
import { ViewCellData } from '../../types.d';
import { getKeyByDateAndGroup } from '../../utils';
import { LayoutProps } from '../layout_props';

export const viewFunction = (viewModel: DateTableBody): JSX.Element => (
  <Fragment>
    {viewModel.props.viewData
      .groupedData.map((table) => table.dateTable.map((cellsRow) => (
        <DateTableRow
          key={getKeyByDateAndGroup(cellsRow[0].startDate, cellsRow[0].groups)}
        >
          {cellsRow.map(({
            startDate,
            endDate,
            groups,
          }: ViewCellData) => (
            <viewModel.props.cellTemplate
              startDate={startDate}
              endDate={endDate}
              groups={groups}
              key={getKeyByDateAndGroup(startDate, groups)}
            />
          ))}
        </DateTableRow>
      )))}
  </Fragment>
);
@ComponentBindings()
export class DateTableBodyProps extends LayoutProps {
  @Template() cellTemplate?: (props: ViewCellData) => JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableBody extends JSXComponent(DateTableBodyProps) {
}
