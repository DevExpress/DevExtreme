import {
  Component,
  JSXComponent,
  Fragment,
} from '@devextreme-generator/declarations';
import { Row } from '../row';
import { ViewCellData } from '../../types.d';
import {
  getKeyByGroup,
  getIsGroupedAllDayPanel,
} from '../../utils';
import { AllDayPanelTableBody } from './all_day_panel/table_body';
import { DateTableLayoutProps } from './layout_props';

export const viewFunction = ({
  props: {
    viewData,
    groupOrientation,
    dataCellTemplate,
    cellTemplate: Cell,
  },
}: DateTableBody): JSX.Element => (
  <Fragment>
    {viewData
      .groupedData.map(({ dateTable, allDayPanel, groupIndex }, index) => (
        <Fragment key={getKeyByGroup(groupIndex, groupOrientation)}>
          {getIsGroupedAllDayPanel(viewData, index) && (
            <AllDayPanelTableBody
              viewData={allDayPanel}
              dataCellTemplate={dataCellTemplate}
              isVerticalGroupOrientation
              leftVirtualCellWidth={viewData.leftVirtualCellWidth}
              rightVirtualCellWidth={viewData.rightVirtualCellWidth}
              leftVirtualCellCount={viewData.leftVirtualCellCount}
              rightVirtualCellCount={viewData.rightVirtualCellCount}
            />
          )}
          {dateTable.map((cellsRow) => (
            <Row
              className="dx-scheduler-date-table-row"
              key={cellsRow[0].key - viewData.leftVirtualCellCount}
              leftVirtualCellWidth={viewData.leftVirtualCellWidth}
              rightVirtualCellWidth={viewData.rightVirtualCellWidth}
              leftVirtualCellCount={viewData.leftVirtualCellCount}
              rightVirtualCellCount={viewData.rightVirtualCellCount}
            >
              {cellsRow.map(({
                startDate,
                endDate,
                groups,
                groupIndex: cellGroupIndex,
                index: cellIndex,
                isFirstGroupCell,
                isLastGroupCell,
                isSelected,
                isFocused,
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
                  index={cellIndex}
                  dataCellTemplate={dataCellTemplate}
                  key={key}
                  text={text}
                  today={today}
                  otherMonth={otherMonth}
                  firstDayOfMonth={firstDayOfMonth}
                  isSelected={isSelected}
                  isFocused={isFocused}
                />
              ))}
            </Row>
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
