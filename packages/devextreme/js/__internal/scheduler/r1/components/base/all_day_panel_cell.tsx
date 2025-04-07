import { BaseInfernoComponent } from '@devextreme/runtime/inferno';

import { ALL_DAY_PANEL_CELL_CLASS } from '../const';
import type { DateTableCellBaseProps } from './date_table_cell_base';
import { DateTableCallBaseDefaultProps, DateTableCellBase } from './date_table_cell_base';

export class AllDayPanelCell extends BaseInfernoComponent<DateTableCellBaseProps> {
  render(): JSX.Element {
    const {
      className,
      viewContext,
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

    return (
      // @ts-ignore
      <DateTableCellBase
        className={`${ALL_DAY_PANEL_CELL_CLASS} ${className}`}
        viewContext={viewContext}
        startDate={startDate}
        endDate={endDate}
        groups={groups}
        groupIndex={groupIndex}
        allDay
        isFirstGroupCell={isFirstGroupCell}
        isLastGroupCell={isLastGroupCell}
        index={index}
        dataCellTemplate={dataCellTemplate}
        isSelected={isSelected}
        isFocused={isFocused}
      />
    );
  }
}

AllDayPanelCell.defaultProps = DateTableCallBaseDefaultProps;
