import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { CellBase as Cell, CellBaseProps } from '../cell';

export const viewFunction = (viewModel: DateTableCellBase) => (
  <Cell
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    isFirstCell={viewModel.props.isFirstCell}
    isLastCell={viewModel.props.isLastCell}
    className={
        `dx-scheduler-date-table-cell dx-scheduler-cell-sizes-horizontal
        dx-scheduler-cell-sizes-vertical ${viewModel.props.className}`
      }
  >
    {viewModel.props.children}
  </Cell>
);

@ComponentBindings()
export class DateTableCellBaseProps extends CellBaseProps {
  @OneWay() startDate?: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() groups?: object;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableCellBase extends JSXComponent(DateTableCellBaseProps) {}
