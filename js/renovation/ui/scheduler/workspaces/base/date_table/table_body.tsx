import {
  Component, ComponentBindings, JSXComponent, Fragment, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { Row as DateTableRow } from '../row';
import { ViewCellData } from '../../types.d';
import {
  getKeyByGroup,
  getIsGroupedAllDayPanel,
} from '../../utils';
import { LayoutProps } from '../layout_props';
import { AllDayPanelTableBody } from './all_day_panel/table_body';
import { MonthDateTableCell } from '../../month/date_table/cell';
import { DateTableCellBase } from './cell';

export const viewFunction = (viewModel: DateTableBody): JSX.Element => (
  <Fragment>
    {viewModel.props.viewData!
      .groupedData.map(({ dateTable, allDayPanel }, groupIndex) => (
        <Fragment key={getKeyByGroup(groupIndex)}>
          {getIsGroupedAllDayPanel(viewModel.props.viewData!, groupIndex) && (
            <AllDayPanelTableBody
              viewData={allDayPanel}
              dataCellTemplate={viewModel.props.dataCellTemplate}
              isVerticalGroupOrientation
            />
          )}
          {dateTable.map((cellsRow) => (
            <DateTableRow
              className="dx-scheduler-date-table-row"
              key={cellsRow[0].key}
            >
              {cellsRow.map(({
                startDate,
                endDate,
                groups,
                groupIndex: cellGroupIndex,
                index,
                isFirstGroupCell,
                isLastGroupCell,
                key,
              }: ViewCellData) => (
                <viewModel.cell
                  isFirstGroupCell={isFirstGroupCell}
                  isLastGroupCell={isLastGroupCell}
                  startDate={startDate}
                  endDate={endDate}
                  groups={groups}
                  groupIndex={cellGroupIndex}
                  index={index}
                  dataCellTemplate={viewModel.props.dataCellTemplate}
                  key={key}
                />
              ))}
            </DateTableRow>
          ))}
        </Fragment>
      ))}
  </Fragment>
);

@ComponentBindings()
export class DateTableBodyProps extends LayoutProps {
  @OneWay() viewType?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableBody extends JSXComponent(DateTableBodyProps) {
  // This is a workaround: cannot use template inside a template
  get cell(): any {
    const { viewType } = this.props;

    return viewType === 'month' ? MonthDateTableCell : DateTableCellBase;
  }
}
