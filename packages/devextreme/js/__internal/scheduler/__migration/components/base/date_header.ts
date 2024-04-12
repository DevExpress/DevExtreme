import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import type { VNode } from 'inferno';
import {
  createComponentVNode,
  createFragment,
} from 'inferno';

import type { DateHeaderData, Group, GroupOrientation } from '../../types';
import { isHorizontalGroupingApplied, themeUtils } from '../../utils/index';
import type { DateTimeCellTemplateProps } from '../types';
import { DateHeaderCell } from './date_header_cell';
import { Row } from './row';

const {
  isMaterialBased,
} = themeUtils.getThemeType();

export interface DateHeaderProps {
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
  render(): VNode {
    const {
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
    const dateCellTemplateComponent = getTemplate(dateCellTemplate);
    const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation)
      && !groupByDate;

    return createFragment(dataMap
      .map((dateHeaderRow, rowIndex) => createComponentVNode(
        2,
        Row,
        {
          className: 'dx-scheduler-header-row',
          leftVirtualCellWidth,
          leftVirtualCellCount,
          rightVirtualCellWidth,
          rightVirtualCellCount,
          isHeaderRow: true,
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
              dateCellTemplate: dateCellTemplateComponent,
              colSpan,
              splitText: isMaterialBased,
            }, key);
          }),
        },
        rowIndex.toString(),
      )), 0);
  }
}
DateHeader.defaultProps = DateHeaderDefaultProps;
