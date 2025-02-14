import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@ts/core/r1/types';
import { getTemplate } from '@ts/core/r1/utils/index';

import type { DateHeaderData, Group, GroupOrientation } from '../../types';
import { isHorizontalGroupingApplied, themeUtils } from '../../utils/index';
import type { DateTimeCellTemplateProps, PropsWithViewContext } from '../types';
import { DateHeaderCell } from './date_header_cell';
import { Row } from './row';

const {
  isMaterialBased,
} = themeUtils.getThemeType();

export interface DateHeaderProps extends PropsWithViewContext {
  // TODO: bug in angular
  groupOrientation: GroupOrientation;
  groupByDate: boolean;
  dateHeaderData: DateHeaderData;
  groups: Group[];
  dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
  timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

export const DateHeaderDefaultProps = {
  groupOrientation: 'horizontal',
  groupByDate: false,
  groups: [],
};

export class DateHeader extends BaseInfernoComponent<DateHeaderProps> {
  render(): JSX.Element {
    const {
      viewContext,
      dateCellTemplate,
      dateHeaderData: {
        dataMap,
        leftVirtualCellCount,
        leftVirtualCellWidth,
        rightVirtualCellCount,
        rightVirtualCellWidth,
      },
      groupByDate,
      groupOrientation,
      groups,
    } = this.props;
    const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation)
      && !groupByDate;
    const DateCellTemplateComponent = getTemplate(dateCellTemplate);

    return (
      <>
        {
          dataMap.map((dateHeaderRow, rowIndex) => (
            // @ts-ignore
            <Row
              key={rowIndex.toString()}
              className="dx-scheduler-header-row"
              leftVirtualCellWidth={leftVirtualCellWidth}
              leftVirtualCellCount={leftVirtualCellCount}
              rightVirtualCellWidth={rightVirtualCellWidth}
              rightVirtualCellCount={rightVirtualCellCount}
              isHeaderRow={true}
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
                    today={today ?? false}
                    isWeekDayCell={false}
                    isTimeCellTemplate={false}
                    index={index}
                    text={text}
                    isFirstGroupCell={isFirstGroupCell}
                    isLastGroupCell={isLastGroupCell}
                    dateCellTemplate={DateCellTemplateComponent}
                    colSpan={colSpan}
                    splitText={isMaterialBased}
                  />
                ))
              }
            </Row>
          ))
        }
      </>
    );
  }
}

DateHeader.defaultProps = DateHeaderDefaultProps;
