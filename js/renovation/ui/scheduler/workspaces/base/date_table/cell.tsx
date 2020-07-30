import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = (viewModel: DateTableCellBase): JSX.Element => (
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
  @OneWay() startDate: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() groups?: object;

  @OneWay() className?: string = '';

  @Slot() children?: JSX.Element | JSX.Element[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableCellBase extends JSXComponent(DateTableCellBaseProps) {}
