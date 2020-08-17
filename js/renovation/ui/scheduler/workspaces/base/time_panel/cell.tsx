import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { CellBase as Cell, CellBaseProps } from '../cell';

export const viewFunction = (viewModel: TimePanelCell): JSX.Element => (
  <Cell
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    isFirstCell={viewModel.props.isFirstCell}
    isLastCell={viewModel.props.isLastCell}
    className={`dx-scheduler-time-panel-cell dx-scheduler-cell-sizes-vertical ${viewModel.props.className}`}
  >
    <div>
      {viewModel.props.text}
    </div>
  </Cell>
);

@ComponentBindings()
export class TimePanelCellProps extends CellBaseProps {
  @OneWay() startDate?: Date = new Date();

  @OneWay() text?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TimePanelCell extends JSXComponent(TimePanelCellProps) {}
