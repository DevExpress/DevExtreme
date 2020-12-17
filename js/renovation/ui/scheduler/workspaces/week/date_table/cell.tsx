import {
  Component,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import {
  DateTableCellBase,
  DateTableCellBaseProps,
} from '../../base/date_table/cell';

export const viewFunction = ({
  props: {
    dataCellTemplate,
    startDate,
    endDate,
    groups,
    groupIndex,
    index,
    isLastGroupCell,
    isFirstGroupCell,
  },
  restAttributes,
}: WeekDateTableCell): JSX.Element => (
  <DateTableCellBase
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    dataCellTemplate={dataCellTemplate}
    startDate={startDate}
    endDate={endDate}
    groups={groups}
    groupIndex={groupIndex}
    index={index}
    isFirstGroupCell={isFirstGroupCell}
    isLastGroupCell={isLastGroupCell}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class WeekDateTableCell extends JSXComponent(DateTableCellBaseProps) {}
