import {
  Component,
  ComponentBindings,
  Fragment,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../../row';
import {
  DateHeaderCellData,
  DateTimeCellTemplateProps,
  Group,
} from '../../../types.d';
import { GroupOrientation } from '../../../../types.d';
import { isHorizontalGroupOrientation } from '../../../utils';
import { DateHeaderCell } from './cell';
import { HORIZONTAL_GROUP_ORIENTATION } from '../../../../consts';

export const viewFunction = ({
  isHorizontalGrouping,
  props: {
    dateHeaderMap,
    timeCellTemplate,
    dateCellTemplate,
    useTimeCellTemplate,
  },
}: DateHeaderLayout): JSX.Element => (
  <Fragment>
    {dateHeaderMap.map((dateHeaderRow, rowIndex) => {
      const rowsCount = dateHeaderMap.length;
      const isTimeCellTemplate = rowsCount - 1 === rowIndex && useTimeCellTemplate;
      const isWeekDayRow = rowsCount > 1 && rowIndex === 0 && useTimeCellTemplate;

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
              cellTemplate={isTimeCellTemplate ? timeCellTemplate : dateCellTemplate}
              key={key}
              colSpan={colSpan}
            />
          ))}
        </Row>
      );
    })}
  </Fragment>
);

@ComponentBindings()
export class DateHeaderLayoutProps {
  @OneWay() groupOrientation: GroupOrientation = HORIZONTAL_GROUP_ORIENTATION;

  @OneWay() dateHeaderMap: DateHeaderCellData[][] = [];

  @OneWay() groups: Group[] = [];

  @OneWay() useTimeCellTemplate = false;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateHeaderLayout extends JSXComponent(DateHeaderLayoutProps) {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups } = this.props;

    return isHorizontalGroupOrientation(groups, groupOrientation);
  }
}
