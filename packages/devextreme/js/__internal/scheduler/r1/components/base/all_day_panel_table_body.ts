import type { PropsWithClassName } from '__internal/core/r1';
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/r1/utils/index';
import type { VNode } from 'inferno';
import { createComponentVNode } from 'inferno';

import type { ViewCellData } from '../../types';
import { renderUtils } from '../../utils/index';
import type { DataCellTemplateProps } from '../types';
import { AllDayPanelCell } from './all_day_panel_cell';
import { Row } from './row';

export interface AllDayPanelTableBodyProps extends PropsWithClassName {
  viewData: ViewCellData[];
  isVerticalGroupOrientation?: boolean;
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  leftVirtualCellCount?: number;
  rightVirtualCellCount?: number;
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}

export const AllDayPanelTableBodyDefaultProps: AllDayPanelTableBodyProps = {
  viewData: [],
  isVerticalGroupOrientation: false,
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
};

export class AllDayPanelTableBody extends BaseInfernoComponent<AllDayPanelTableBodyProps> {
  render(): VNode {
    const {
      className,
      leftVirtualCellWidth,
      rightVirtualCellWidth,
      leftVirtualCellCount,
      rightVirtualCellCount,
      viewData,
      isVerticalGroupOrientation,
      dataCellTemplate,
    } = this.props;
    const classes = renderUtils.combineClasses({
      'dx-scheduler-all-day-table-row': true,
      [className]: !!className,
    });
    const dataCellTemplateComponent = getTemplate(dataCellTemplate);

    return createComponentVNode(2, Row, {
      leftVirtualCellWidth,
      rightVirtualCellWidth,
      leftVirtualCellCount,
      rightVirtualCellCount,
      className: classes,
      children: viewData.map((cellData) => {
        const {
          endDate,
          groupIndex: cellGroupIndex,
          groups,
          index: cellIndex,
          isFirstGroupCell,
          isFocused,
          isLastGroupCell,
          isSelected,
          key,
          startDate,
        } = cellData;
        return createComponentVNode(2, AllDayPanelCell, {
          isFirstGroupCell: !isVerticalGroupOrientation && isFirstGroupCell,
          isLastGroupCell: !isVerticalGroupOrientation && isLastGroupCell,
          startDate,
          endDate,
          groups,
          groupIndex: cellGroupIndex,
          index: cellIndex,
          dataCellTemplate: dataCellTemplateComponent,
          isSelected,
          isFocused,
        }, key);
      }),
    });
  }
}
AllDayPanelTableBody.defaultProps = AllDayPanelTableBodyDefaultProps;
