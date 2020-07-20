import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { DateTableRow } from '../../base/date_table/row';
import { DayDateTableCell as Cell } from './cell';
import { GroupedViewData, ViewCellData } from '../../types';
import { getKeyByDateAndGroup } from '../../utils';

export const viewFunction = (viewModel: DayDateTableLayout) => (
  <table
    className={`${viewModel.props.className} dx-scheduler-date-table`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <tbody>
      {viewModel.props.viewCellsData!
        .groupedData.map(({ dateTable }) => dateTable.map((cellsRow) => (
          <DateTableRow
            key={getKeyByDateAndGroup(cellsRow[0].startDate, cellsRow[0].groups)}
          >
            {cellsRow.map(({
              startDate,
              endDate,
              groups,
            }: ViewCellData) => (
              <Cell
                startDate={startDate}
                endDate={endDate}
                groups={groups}
                key={getKeyByDateAndGroup(startDate, groups)}
              />
            ))}
          </DateTableRow>
        )))}
    </tbody>
  </table>
);

@ComponentBindings()
export class DayDateTableLayoutProps {
  @OneWay() viewCellsData?: GroupedViewData;

  @OneWay() className?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DayDateTableLayout extends JSXComponent(DayDateTableLayoutProps) {
}
