import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment, Template,
} from 'devextreme-generator/component_declaration/common';
import { DateTableRow } from './row';
// eslint-disable-next-line import/extensions
import { GroupedViewData, ViewCellData } from '../../types';
import { getKeyByDateAndGroup } from '../../utils';

export const viewFunction = (viewModel: DateTableBody) => (
  <Fragment>
    {viewModel.props.viewData!
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
export class DateTableBodyProps {
  @OneWay() viewData?: GroupedViewData;

  @OneWay() className?: string;

  @OneWay() isVirtual?: boolean;

  @Template() cellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableBody extends JSXComponent(DateTableBodyProps) {
}
