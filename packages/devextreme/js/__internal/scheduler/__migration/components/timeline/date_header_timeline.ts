import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import { getThemeType } from '@ts/scheduler/__migration/utils/themes';
import type { VNode } from 'inferno';
import {
  createComponentVNode,
  createFragment,
} from 'inferno';

import { isHorizontalGroupingApplied } from '../../utils/index';
import type { DateHeaderProps } from '../base/date_header';
import { DateHeaderDefaultProps } from '../base/date_header';
import { DateHeaderCell } from '../base/date_header_cell';
import { Row } from '../base/row';

const {
  isMaterialBased,
} = getThemeType();

export class TimelineDateHeaderLayout extends BaseInfernoComponent<DateHeaderProps> {
  render(): VNode {
    const {
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
    const dateCellTemplateComponent = getTemplate(dateCellTemplate);
    const timeCellTemplateComponent = getTemplate(timeCellTemplate);

    return createFragment(dataMap.map((dateHeaderRow, rowIndex) => {
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

      return createComponentVNode(2, Row, {
        className: 'dx-scheduler-header-row',
        leftVirtualCellWidth: validLeftVirtualCellWidth,
        leftVirtualCellCount: validLeftVirtualCellCount,
        rightVirtualCellWidth: validRightVirtualCellWidth,
        rightVirtualCellCount: validRightVirtualCellCount,
        children: dateHeaderRow.map((_ref2) => {
          const {
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
          } = _ref2;
          return createComponentVNode(2, DateHeaderCell, {
            startDate,
            endDate,
            groups: isHorizontalGrouping ? cellGroups : undefined,
            groupIndex: isHorizontalGrouping ? groupIndex : undefined,
            today,
            index,
            text,
            isFirstGroupCell,
            isLastGroupCell,
            isWeekDayCell: isWeekDayRow,
            colSpan,
            splitText,
            dateCellTemplate: dateCellTemplateComponent,
            timeCellTemplate: timeCellTemplateComponent,
            isTimeCellTemplate,
          }, key);
        }),
      }, rowIndex.toString());
    }), 0);
  }
}

TimelineDateHeaderLayout.defaultProps = DateHeaderDefaultProps;
