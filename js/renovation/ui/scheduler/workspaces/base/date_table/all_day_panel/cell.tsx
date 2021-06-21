import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { DateTableCellBaseProps, DateTableCellBase } from '../cell';

export const viewFunction = ({
  props: {
    className,
    startDate,
    endDate,
    groups,
    groupIndex,
    isFirstGroupCell,
    isLastGroupCell,
    index,
    dataCellTemplate,
    isSelected,
    isFocused,
  },
}: AllDayPanelCell): JSX.Element => (
  <DateTableCellBase
    className={`dx-scheduler-all-day-table-cell ${className}`}
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

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelCell extends JSXComponent(DateTableCellBaseProps) {}
