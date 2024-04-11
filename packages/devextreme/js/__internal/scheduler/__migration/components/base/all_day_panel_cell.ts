import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import type { VNode } from 'inferno';
import { createComponentVNode } from 'inferno';

import { ALL_DAY_PANEL_CELL_CLASS } from '../const';
import type { DateTableCellBaseProps } from './date_table_cell_base';
import { DateTableCallBaseDefaultProps, DateTableCellBase } from './date_table_cell_base';

export class AllDayPanelCell extends BaseInfernoComponent<DateTableCellBaseProps> {
  render(): VNode {
    const {
      className,
      dataCellTemplate,
      endDate,
      groupIndex,
      groups,
      index,
      isFirstGroupCell,
      isFocused,
      isLastGroupCell,
      isSelected,
      startDate,
    } = this.props;
    const dataCellTemplateComponent = getTemplate(dataCellTemplate);

    return createComponentVNode(2, DateTableCellBase, {
      className: `${ALL_DAY_PANEL_CELL_CLASS} ${className}`,
      startDate,
      endDate,
      groups,
      groupIndex,
      allDay: true,
      isFirstGroupCell,
      isLastGroupCell,
      index,
      dataCellTemplate: dataCellTemplateComponent,
      isSelected,
      isFocused,
    });
  }
}
AllDayPanelCell.defaultProps = DateTableCallBaseDefaultProps;
