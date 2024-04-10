import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import type { VNode } from 'inferno';
import {
  createComponentVNode, createFragment,
} from 'inferno';

import { renderUtils } from '../../utils/index';
import { DATE_TABLE_ROW_CLASS } from '../const';
import type { CellTemplateProps } from '../types';
import { AllDayPanelTableBody } from './all_day_panel_table_body';
import { DateTableCellBase } from './date_table_cell_base';
import type { LayoutProps } from './layout_props';
import { LayoutDefaultProps } from './layout_props';
import { Row } from './row';

export interface DateTableBodyProps extends LayoutProps {
  cellTemplate: JSXTemplate<CellTemplateProps>;
}

export const DateTableBodyDefaultProps: DateTableBodyProps = {
  ...LayoutDefaultProps,
  // @ts-expect-error Different types between React and Inferno
  cellTemplate: DateTableCellBase,
};

export class DateTableBody extends BaseInfernoComponent<DateTableBodyProps> {
  render(): VNode {
    const {
      addVerticalSizesClassToRows,
      viewData,
      cellTemplate,
      dataCellTemplate,
    } = this.props;
    const rowClasses = renderUtils.combineClasses({
      [DATE_TABLE_ROW_CLASS]: true,
      'dx-scheduler-cell-sizes-vertical': addVerticalSizesClassToRows,
    });
    const cellTemplateComponent = getTemplate(cellTemplate);
    const dataCellTemplateComponent = getTemplate(dataCellTemplate);

    return createFragment(viewData.groupedData.map((data) => {
      const {
        allDayPanel,
        dateTable,
        isGroupedAllDayPanel,
        key: fragmentKey,
      } = data;
      return createFragment([isGroupedAllDayPanel && createComponentVNode(2, AllDayPanelTableBody, {
        viewData: allDayPanel,
        dataCellTemplate: dataCellTemplateComponent,
        isVerticalGroupOrientation: true,
        leftVirtualCellWidth: viewData.leftVirtualCellWidth,
        rightVirtualCellWidth: viewData.rightVirtualCellWidth,
        leftVirtualCellCount: viewData.leftVirtualCellCount,
        rightVirtualCellCount: viewData.rightVirtualCellCount,
      }), dateTable.map((rowData) => {
        const {
          cells,
          key: rowKey,
        } = rowData;
        return createComponentVNode(2, Row, {
          className: rowClasses,
          leftVirtualCellWidth: viewData.leftVirtualCellWidth,
          rightVirtualCellWidth: viewData.rightVirtualCellWidth,
          leftVirtualCellCount: viewData.leftVirtualCellCount,
          rightVirtualCellCount: viewData.rightVirtualCellCount,
          children: cells.map((_ref4) => {
            const {
              endDate,
              firstDayOfMonth,
              groupIndex: cellGroupIndex,
              groups,
              index: cellIndex,
              isFirstGroupCell,
              isFocused,
              isLastGroupCell,
              isSelected,
              key,
              otherMonth,
              startDate,
              text,
              today,
            } = _ref4;
            return cellTemplateComponent({
              isFirstGroupCell,
              isLastGroupCell,
              startDate,
              endDate,
              groups,
              groupIndex: cellGroupIndex,
              index: cellIndex,
              dataCellTemplate,
              key,
              text,
              today,
              otherMonth,
              firstDayOfMonth,
              isSelected,
              isFocused,
            });
          }),
        }, rowKey);
      })], 0, fragmentKey);
    }), 0);
  }
}
DateTableBody.defaultProps = DateTableBodyDefaultProps;
