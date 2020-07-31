import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = (viewModel: TimePanelCell) => (
  <td
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={
      `dx-scheduler-time-panel-cell dx-scheduler-cell-sizes-vertical
      dx-scheduler-first-group-cell dx-scheduler-last-group-cell
      ${viewModel.props.className}`
    }
  >
    <div>
      {viewModel.props.text}
    </div>
  </td>
);

@ComponentBindings()
export class TimePanelCellProps {
  @OneWay() startDate?: Date = new Date();

  @OneWay() text?: string = '';

  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TimePanelCell extends JSXComponent(TimePanelCellProps) {}
