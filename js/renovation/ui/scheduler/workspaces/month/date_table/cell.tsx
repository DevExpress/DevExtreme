import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { DateTableCellBase, DateTableCellBaseProps } from '../../base/date_table/cell';

export const viewFunction = (viewModel: MonthDateTableCell): JSX.Element => (
  <DateTableCellBase
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.classes}
    dataCellTemplate={viewModel.props.dataCellTemplate}
  >
    <div>
      {viewModel.props.startDate!.getDate()}
    </div>
  </DateTableCellBase>
);

@ComponentBindings()
export class MonthDateTableCellProps extends DateTableCellBaseProps {
  @OneWay() otherMonth?: boolean = false;

  @OneWay() today?: boolean = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthDateTableCell extends JSXComponent(MonthDateTableCellProps) {
  get classes(): string | undefined {
    const { otherMonth, today, className } = this.props;
    const classes: string[] = [];

    otherMonth && classes.push('dx-scheduler-date-table-other-month');
    today && classes.push('dx-scheduler-date-table-current-date');
    className && classes.push(className);

    return classes.length !== 0 ? classes.join(' ') : undefined;
  }
}
