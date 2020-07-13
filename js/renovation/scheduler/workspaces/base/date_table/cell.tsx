import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = (viewModel: DateTableCellBase) => (
  <td
    className={
      `dx-scheduler-date-table-cell dx-scheduler-cell-sizes-horizontal
      dx-scheduler-cell-sizes-vertical ${viewModel.props.className}`
    }
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

  @OneWay() className?: string = '';

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableCellBase extends JSXComponent(DateTableCellBaseProps) {}
