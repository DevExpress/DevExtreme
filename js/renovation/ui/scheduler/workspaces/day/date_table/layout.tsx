import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { DateTableRow } from '../../base/date_table/row';
import { DayDateTableCell as Cell } from './cell';
import { GroupedViewData, ViewCellData } from '../../types';
import { getKeyByDateAndGroup } from '../../utils';
import { Table } from '../../base/table';
import { VirtualTable } from '../../base/virtual_table';

export const viewFunction = (viewModel: DayDateTableLayout): object => {
  const DateTable = viewModel.props.isVirtual ? VirtualTable : Table;

  return (
    <DateTable
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
      className={`dx-scheduler-date-table ${viewModel.props.className}`}
    >
      {
          viewModel.props.viewData!
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
            )))
      }
    </DateTable>
  );
};

@ComponentBindings()
export class DayDateTableLayoutProps {
  @OneWay() viewData?: GroupedViewData;

  @OneWay() className?: string;

  @OneWay() isVirtual?: boolean;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DayDateTableLayout extends JSXComponent(DayDateTableLayoutProps) {
}
