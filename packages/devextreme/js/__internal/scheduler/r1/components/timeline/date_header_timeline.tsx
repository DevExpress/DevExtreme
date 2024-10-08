import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';
import { getThemeType } from '@ts/scheduler/r1/utils/themes';

import { isHorizontalGroupingApplied } from '../../utils/index';
import type { DateHeaderProps } from '../base/date_header';
import { DateHeaderDefaultProps } from '../base/date_header';
import { DateHeaderCell, DateHeaderCellDefaultProps } from '../base/date_header_cell';
import { Row, RowDefaultProps } from '../base/row';

const {
  isMaterialBased,
} = getThemeType();

export class TimelineDateHeaderLayout extends BaseInfernoComponent<DateHeaderProps> {
  render(): JSX.Element {
    const {
      viewContext,
      groupByDate,
      groupOrientation,
      groups,
      dateHeaderData,
      dateCellTemplate,
      timeCellTemplate,
    } = this.props;
    const {
      dataMap,
      isMonthDateHeader,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      weekDayLeftVirtualCellCount,
      weekDayLeftVirtualCellWidth,
      weekDayRightVirtualCellCount,
      weekDayRightVirtualCellWidth,
    } = dateHeaderData;
    const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation)
      && !groupByDate;
    const DateCellTemplateComponent = getTemplate(dateCellTemplate);
    const TimeCellTemplateComponent = getTemplate(timeCellTemplate);

    return (
      <>
        {
          dataMap.map((dateHeaderRow, rowIndex) => {
            const rowsCount = dataMap.length;
            const isTimeCellTemplate = rowsCount - 1 === rowIndex;
            const isWeekDayRow = rowsCount > 1 && rowIndex === 0;
            const splitText = isMaterialBased && (isMonthDateHeader || isWeekDayRow);

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
              // @ts-ignore
              <Row
                key={rowIndex.toString()}
                className="dx-scheduler-header-row"
                leftVirtualCellWidth={validLeftVirtualCellWidth
                  ?? RowDefaultProps.leftVirtualCellWidth}
                leftVirtualCellCount={validLeftVirtualCellCount}
                rightVirtualCellWidth={validRightVirtualCellWidth
                  ?? RowDefaultProps.rightVirtualCellWidth}
                rightVirtualCellCount={validRightVirtualCellCount}
              >
                {
                  dateHeaderRow.map(({
                    colSpan,
                    endDate,
                    groupIndex,
                    groups: cellGroups,
                    index,
                    isFirstGroupCell,
                    isLastGroupCell,
                    key,
                    startDate,
                    text,
                    today,
                  }) => (
                    // @ts-ignore
                    <DateHeaderCell
                      key={key}
                      viewContext={viewContext}
                      startDate={startDate}
                      endDate={endDate}
                      groups={isHorizontalGrouping ? cellGroups : undefined}
                      groupIndex={isHorizontalGrouping ? groupIndex : undefined}
                      today={today ?? DateHeaderCellDefaultProps.today}
                      index={index}
                      text={text}
                      isFirstGroupCell={isFirstGroupCell}
                      isLastGroupCell={isLastGroupCell}
                      isWeekDayCell={isWeekDayRow}
                      colSpan={colSpan}
                      splitText={splitText}
                      // @ts-expect-error
                      dateCellTemplate={DateCellTemplateComponent}
                      // @ts-expect-error
                      timeCellTemplate={TimeCellTemplateComponent}
                      isTimeCellTemplate={isTimeCellTemplate}
                    />
                  ))
                }
              </Row>
            );
          })
        }
      </>
    );
  }
}

TimelineDateHeaderLayout.defaultProps = DateHeaderDefaultProps;
