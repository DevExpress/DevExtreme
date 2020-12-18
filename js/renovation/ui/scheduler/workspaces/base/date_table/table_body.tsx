import {
  Component,
  JSXComponent,
  Fragment,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { Row as DateTableRow } from '../row';
import { ViewCellData } from '../../types.d';
import {
  getKeyByGroup,
  getIsGroupedAllDayPanel,
} from '../../utils';
import { AllDayPanelTableBody } from './all_day_panel/table_body';
import { DateTableLayoutProps, CellTemplateProps } from './layout_props';
import { DateTableCellBase } from './cell';

export const viewFunction = ({
  props: {
    viewData, dataCellTemplate,
  },
  cell: Cell,
}: DateTableBody): JSX.Element => (
  <Fragment>
    {viewData
      .groupedData.map(({ dateTable, allDayPanel }, groupIndex) => (
        <Fragment key={getKeyByGroup(groupIndex)}>
          {getIsGroupedAllDayPanel(viewData, groupIndex) && (
            <AllDayPanelTableBody
              viewData={allDayPanel}
              dataCellTemplate={dataCellTemplate}
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
                text,
                otherMonth,
                firstDayOfMonth,
                today,
              }: ViewCellData) => (
                <Cell
                  isFirstGroupCell={isFirstGroupCell}
                  isLastGroupCell={isLastGroupCell}
                  startDate={startDate}
                  endDate={endDate}
                  groups={groups}
                  groupIndex={cellGroupIndex}
                  index={index}
                  dataCellTemplate={dataCellTemplate}
                  key={key}
                  text={text}
                  today={today}
                  otherMonth={otherMonth}
                  firstDayOfMonth={firstDayOfMonth}
                />
              ))}
            </DateTableRow>
          ))}
        </Fragment>
      ))}
  </Fragment>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableBody extends JSXComponent(DateTableLayoutProps) {
  // This is a workaroung for https://github.com/DevExpress/devextreme-renovation/issues/559
  get cell(): JSXTemplate<CellTemplateProps> {
    const { cellTemplate } = this.props;

    return cellTemplate || DateTableCellBase;
  }
}
