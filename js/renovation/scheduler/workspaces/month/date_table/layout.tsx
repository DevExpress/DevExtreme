import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../../base/row';
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
            className="dx-scheduler-date-table-row"
          >
            {cellsRow.map(({
              startDate, endDate, otherMonth, today, groups,
            }: ViewCellData) => (
              <Cell
                startDate={startDate}
                endDate={endDate}
                otherMonth={otherMonth}
                today={today}
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
  jQuery: { register: true },
})
export class MonthDateTableLayout extends JSXComponent(MonthDateTableLayoutProps) {}
