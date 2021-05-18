import {
  Component,
  Fragment,
  JSXComponent,
} from '@devextreme-generator/declarations';
import { Row } from '../../../base/row';
import { isHorizontalGroupOrientation } from '../../../utils';
import { DateHeaderCell } from '../../../base/header_panel/date_header/cell';
import { DateHeaderLayoutProps } from '../../../base/header_panel/date_header/layout';

export const viewFunction = ({
  isHorizontalGrouping,
  props: {
    dateHeaderData,
    timeCellTemplate,
    dateCellTemplate,
  },
}: TimelineDateHeaderLayout): JSX.Element => {
  const {
    dataMap,
    leftVirtualCellCount,
    leftVirtualCellWidth,
    rightVirtualCellCount,
    rightVirtualCellWidth,
    weekDayLeftVirtualCellWidth,
    weekDayRightVirtualCellWidth,
    weekDayLeftVirtualCellCount,
    weekDayRightVirtualCellCount,
  } = dateHeaderData;

  return (
    <Fragment>
      {dataMap.map((dateHeaderRow, rowIndex) => {
        const rowsCount = dataMap.length;
        const isTimeCellTemplate = rowsCount - 1 === rowIndex;
        const isWeekDayRow = rowsCount > 1 && rowIndex === 0;

        let validLeftVirtualCellCount: number | undefined = leftVirtualCellCount;
        let validRightVirtualCellCount: number | undefined = rightVirtualCellCount;
        let validRightVirtualCellWidth: number | undefined = rightVirtualCellWidth;
        let validLeftVirtualCellWidth: number | undefined = leftVirtualCellWidth;

        if (isWeekDayRow) {
          validLeftVirtualCellCount = weekDayLeftVirtualCellCount;
          validRightVirtualCellCount = weekDayRightVirtualCellCount;
          validRightVirtualCellWidth = weekDayRightVirtualCellWidth;
          validLeftVirtualCellWidth = weekDayLeftVirtualCellWidth;
        }

        return (
          <Row
            className="dx-scheduler-header-row"
            leftVirtualCellWidth={validLeftVirtualCellWidth}
            leftVirtualCellCount={validLeftVirtualCellCount}
            rightVirtualCellWidth={validRightVirtualCellWidth}
            rightVirtualCellCount={validRightVirtualCellCount}
            key={rowIndex.toString()}
          >
            {dateHeaderRow.map(({
              startDate,
              endDate,
              today,
              groups: cellGroups,
              groupIndex,
              isFirstGroupCell,
              isLastGroupCell,
              index,
              key,
              text,
              colSpan,
            }) => (
              <DateHeaderCell
                startDate={startDate}
                endDate={endDate}
                groups={isHorizontalGrouping ? cellGroups : undefined}
                groupIndex={isHorizontalGrouping ? groupIndex : undefined}
                today={today}
                index={index}
                text={text}
                isFirstGroupCell={isFirstGroupCell}
                isLastGroupCell={isLastGroupCell}
                isWeekDayCell={isWeekDayRow}
                key={key}
                colSpan={colSpan}

                // TODO: this is a workaround for https://github.com/DevExpress/devextreme-renovation/issues/574
                dateCellTemplate={dateCellTemplate}
                timeCellTemplate={timeCellTemplate}
                isTimeCellTemplate={isTimeCellTemplate}
              />
            ))}
          </Row>
        );
      })}
    </Fragment>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TimelineDateHeaderLayout extends JSXComponent<DateHeaderLayoutProps, 'dateHeaderData'>() {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups, groupByDate } = this.props;

    return isHorizontalGroupOrientation(groups, groupOrientation) && !groupByDate;
  }
}
