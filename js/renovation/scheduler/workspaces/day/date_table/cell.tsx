import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';
import {
  DateTableCellBase,
} from '../../base/date_table/cell';

export const viewFunction = (viewModel: DayDateTableCell) => (
  <DateTableCellBase
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className="dx-scheduler-first-group-cell dx-scheduler-last-group-cell"
  />
);

@ComponentBindings()
export class DayDateTableCellProps {
  @OneWay() startDate?: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DayDateTableCell extends JSXComponent(DayDateTableCellProps) {
}
