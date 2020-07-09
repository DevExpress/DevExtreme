import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import DateTableCell from '../../base/date-table/cell';

export const viewFunction = (viewModel: MonthDateTableCell) => (
  <DateTableCell
    className={viewModel.classes}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <div>
      {viewModel.props.startDate!.getDate()}
    </div>
  </DateTableCell>
);

@ComponentBindings()
export class MonthDateTableCellProps {
  @OneWay() startDate?: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() otherMonth?: boolean = false;

  @OneWay() today?: boolean = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class MonthDateTableCell extends JSXComponent(MonthDateTableCellProps) {
  get classes(): string | undefined {
    const { otherMonth, today } = this.props;
    const classes: string[] = [];

    otherMonth && classes.push('dx-scheduler-date-table-other-month');
    today && classes.push('dx-scheduler-date-table-current-date');

    return classes.length !== 0 ? classes.join(' ') : undefined;
  }
}
