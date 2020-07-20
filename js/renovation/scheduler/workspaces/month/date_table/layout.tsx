import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { DateTableRow as Row } from '../../base/date_table/row';
import { MonthDateTableCell as Cell } from './cell';
import { ViewCellData, GroupedViewData } from '../../types';
import { getKeyByDateAndGroup } from '../../utils';

export const viewFunction = (viewModel: MonthDateTableLayout) => (
  <table
    className={`dx-scheduler-date-table ${viewModel.props.className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <tbody>
      {viewModel.props.viewCellsData!
        .groupedData.map(({ dateTable }) => dateTable.map((cellsRow) => (
          <Row
            key={getKeyByDateAndGroup(cellsRow[0].startDate, cellsRow[0].groups)}
          >
            {cellsRow.map(({
              startDate, endDate, otherMonth, today, groups,
            }: ViewCellData) => (
              <Cell
                startDate={startDate}
                endDate={endDate}
                otherMonth={otherMonth}
                today={today}
                groups={groups}
                key={getKeyByDateAndGroup(startDate, groups)}
              />
            ))}
          </Row>
        )))}
    </tbody>
  </table>
);

@ComponentBindings()
export class MonthDateTableLayoutProps {
  @OneWay() viewCellsData?: GroupedViewData;

  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthDateTableLayout extends JSXComponent(MonthDateTableLayoutProps) {}
