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
  Group,
} from '../../../types';
import { GroupOrientation } from '../../../../types';
import { isHorizontalGroupingApplied } from '../../../utils';
import { DateHeaderCell } from './cell';
import getThemeType from '../../../../../../utils/getThemeType';

const { isMaterial } = getThemeType();

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
              splitText={isMaterial}
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

    return isHorizontalGroupingApplied(groups, groupOrientation) && !groupByDate;
  }
}
