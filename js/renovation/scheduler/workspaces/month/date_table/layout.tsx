import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { DateTableRow as Row } from '../../base/date_table/row';
import { MonthDateTableCell as Cell } from './cell';
import { ViewCellData } from '../../types';

export const viewFunction = (viewModel: MonthDateTableLayout) => (
  <table
    className={`dx-scheduler-date-table ${viewModel.props.className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <tbody>
      {viewModel.props.viewCellsData!.map((cellsRow) => (
        <Row
          key={cellsRow[0].startDate.toString()}
        >
          {cellsRow.map(({
            startDate, endDate, otherMonth, today,
          }: ViewCellData) => (
            <Cell
              startDate={startDate}
              endDate={endDate}
              otherMonth={otherMonth}
              today={today}
              key={startDate.toString()}
            />
          ))}
        </Row>
      ))}
    </tbody>
  </table>
);

@ComponentBindings()
export class MonthDateTableLayoutProps {
  @OneWay() viewCellsData?: ViewCellData[][] = [[]];

  @OneWay() className?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthDateTableLayout extends JSXComponent(MonthDateTableLayoutProps) {}
