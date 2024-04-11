import {
  Component,
  ComponentBindings,
  Fragment,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from '@devextreme-generator/declarations';
import { Row } from '../../row';
import {
  DateHeaderData,
  DateTimeCellTemplateProps,
} from '../../../types';
import { DateHeaderCell } from './cell';
import getThemeType from '../../../../../../utils/getThemeType';
import { Group, GroupOrientation } from '../../../../../../../__internal/scheduler/r1/types';
import { isHorizontalGroupingApplied } from '../../../../../../../__internal/scheduler/r1/utils/index';

const { isMaterialBased } = getThemeType();

export const viewFunction = ({
  isHorizontalGrouping,
  props: {
    dateHeaderData,
    dateCellTemplate,
  },
}: DateHeaderLayout): JSX.Element => {
  const {
    dataMap,
    leftVirtualCellCount,
    leftVirtualCellWidth,
    rightVirtualCellCount,
    rightVirtualCellWidth,
  } = dateHeaderData;

  return (
    <Fragment>
      {dataMap.map((dateHeaderRow, rowIndex) => (
        <Row
          className="dx-scheduler-header-row"
          key={rowIndex.toString()}
          leftVirtualCellWidth={leftVirtualCellWidth}
          leftVirtualCellCount={leftVirtualCellCount}
          rightVirtualCellWidth={rightVirtualCellWidth}
          rightVirtualCellCount={rightVirtualCellCount}
          isHeaderRow
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
              dateCellTemplate={dateCellTemplate}
              key={key}
              colSpan={colSpan}
              splitText={isMaterialBased}
            />
          ))}
        </Row>
      ))}
    </Fragment>
  );
};

@ComponentBindings()
export class DateHeaderLayoutProps {
  // TODO: bug in angular
  @OneWay() groupOrientation: GroupOrientation = 'horizontal';

  @OneWay() groupByDate = false;

  @OneWay() dateHeaderData!: DateHeaderData;

  @OneWay() groups: Group[] = [];

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateHeaderLayout extends JSXComponent<DateHeaderLayoutProps, 'dateHeaderData'>() {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups, groupByDate } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return isHorizontalGroupingApplied(groups, groupOrientation) && !groupByDate;
  }
}
