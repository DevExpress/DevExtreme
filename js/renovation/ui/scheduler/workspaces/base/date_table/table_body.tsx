import {
  Component,
  JSXComponent,
  Fragment,
} from 'devextreme-generator/component_declaration/common';
import { Row as DateTableRow } from '../row';
import { ViewCellData } from '../../types.d';
import {
  getKeyByGroup,
  getIsGroupedAllDayPanel,
} from '../../utils';
import { AllDayPanelTableBody } from './all_day_panel/table_body';
import { DateTableLayoutProps } from './layout_props';

export const viewFunction = ({
  props: {
    viewData, dataCellTemplate, cellTemplate: Cell,
  },
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
export class DateTableBody extends JSXComponent<DateTableLayoutProps, 'cellTemplate'>() {}
