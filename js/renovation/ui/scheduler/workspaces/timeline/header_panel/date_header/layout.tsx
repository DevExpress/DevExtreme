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
    dateHeaderMap,
    timeCellTemplate,
    dateCellTemplate,
  },
}: TimelineDateHeaderLayout): JSX.Element => (
  <Fragment>
    {dateHeaderMap.map((dateHeaderRow, rowIndex) => {
      const rowsCount = dateHeaderMap.length;
      const isTimeCellTemplate = rowsCount - 1 === rowIndex;
      const isWeekDayRow = rowsCount > 1 && rowIndex === 0;

      return (
        <Row className="dx-scheduler-header-row" key={rowIndex.toString()}>
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

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TimelineDateHeaderLayout extends JSXComponent(DateHeaderLayoutProps) {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups, groupByDate } = this.props;

    return isHorizontalGroupOrientation(groups, groupOrientation) && !groupByDate;
  }
}
