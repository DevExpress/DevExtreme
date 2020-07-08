import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import Row from '../../base/row';
import Cell from './cell';
import { ViewCellData } from '../../types';

export const viewFunction = (viewModel: MonthDateTableLayout) => (
  <table
    className="dx-scheduler-date-table"
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <tbody>
      {viewModel.props.viewCellsData!.map((cellsRow) => (
        <Row
          key={cellsRow[0].startDate.toString()}
          className="dx-scheduler-date-table-row"
        >
          {cellsRow.map(({ startDate, endDate, otherMonth }) => (
            <Cell
              startDate={startDate}
              endDate={endDate}
              otherMonth={otherMonth}
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
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export default class MonthDateTableLayout extends JSXComponent(MonthDateTableLayoutProps) {}
