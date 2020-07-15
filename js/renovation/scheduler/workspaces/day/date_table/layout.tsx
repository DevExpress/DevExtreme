import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { DateTableRow } from '../../base/date_table/row';
import { DayDateTableCell as Cell } from './cell';
import { ViewCellData } from '../../types';

export const viewFunction = (viewModel: DayDateTableLayout) => (
  <table
    className={`${viewModel.props.className} dx-scheduler-date-table`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <tbody>
      {viewModel.props.viewCellsData!.map((cellsRow) => (
        <DateTableRow
          key={cellsRow[0].startDate.toString()}
        >
          {cellsRow.map(({
            startDate,
            endDate,
          }: ViewCellData) => (
            <Cell
              startDate={startDate}
              endDate={endDate}
              key={startDate.toString()}
            />
          ))}
        </DateTableRow>
      ))}
    </tbody>
  </table>
);

@ComponentBindings()
export class DayDateTableLayoutProps {
  @OneWay() viewCellsData?: ViewCellData[][] = [[]];

  @OneWay() className?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DayDateTableLayout extends JSXComponent(DayDateTableLayoutProps) {
}
