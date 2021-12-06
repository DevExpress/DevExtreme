import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { ALL_DAY_PANEL_CELL_CLASS } from '../../../const';
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
    className={`${ALL_DAY_PANEL_CELL_CLASS} ${className}`}
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
