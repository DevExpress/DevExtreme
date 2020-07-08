import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';

const getCssClasses = (model: MonthDateTableCellProps): string => {
  const {
    otherMonth,
  } = model;
  const classNames = [
    'dx-scheduler-date-table-cell',
    'dx-scheduler-cell-sizes-horizontal',
    'dx-scheduler-cell-sizes-vertical',
  ];
  otherMonth && classNames.push('dx-scheduler-date-table-other-month');

  return classNames.join(' ');
};

export const viewFunction = (viewModel: MonthDateTableCell) => (
  <td
    className={viewModel.classes}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <div>
      {viewModel.props.startDate!.getDate()}
    </div>
  </td>
);

@ComponentBindings()
export class MonthDateTableCellProps {
  @OneWay() startDate?: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() otherMonth?: boolean = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class MonthDateTableCell extends JSXComponent(MonthDateTableCellProps) {
  get classes(): string {
    return getCssClasses(this.props);
  }
}
