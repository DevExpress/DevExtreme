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
  leftVirtualCellWidth,
  rightVirtualCellWidth,
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
              leftVirtualCellCount={viewData.leftVirtualCellCount}
              rightVirtualCellCount={viewData.rightVirtualCellCount}
            />
          )}
          {dateTable.map((cellsRow) => (
            <Row
              className="dx-scheduler-date-table-row"
              key={cellsRow[0].key - viewData.leftVirtualCellCount}
              leftVirtualCellWidth={leftVirtualCellWidth}
              rightVirtualCellWidth={rightVirtualCellWidth}
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
export class DateTableBody extends JSXComponent<DateTableLayoutProps, 'cellTemplate'>() {
  get leftVirtualCellWidth(): number | undefined {
    const { viewData, isProvideVirtualCellWidth } = this.props;

    return isProvideVirtualCellWidth ? viewData.leftVirtualCellWidth : undefined;
  }

  get rightVirtualCellWidth(): number | undefined {
    const { viewData, isProvideVirtualCellWidth } = this.props;

    return isProvideVirtualCellWidth ? viewData.rightVirtualCellWidth : undefined;
  }
}
