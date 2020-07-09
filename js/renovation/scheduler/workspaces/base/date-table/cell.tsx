import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';

const getCssClasses = (model: DateTableCellBaseProps): string => {
  const { className } = model;
  const classNames = [
    'dx-scheduler-date-table-cell',
    'dx-scheduler-cell-sizes-horizontal',
    'dx-scheduler-cell-sizes-vertical',
  ];
  className && classNames.push(className);

  return classNames.join(' ');
};

export const viewFunction = (viewModel: DateTableCellBase) => (
  <td
    className={viewModel.classes}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    {viewModel.props.children}
  </td>
);

@ComponentBindings()
export class DateTableCellBaseProps {
  @OneWay() startDate?: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() className?: string;

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class DateTableCellBase extends JSXComponent(DateTableCellBaseProps) {
  get classes(): string {
    return getCssClasses(this.props);
  }
}
