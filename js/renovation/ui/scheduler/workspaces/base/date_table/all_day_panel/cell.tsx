import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = (viewModel: AllDayPanelCell) => (
  <td
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={`dx-scheduler-all-day-table-cell dx-scheduler-cell-sizes-horizontal
      dx-scheduler-first-group-cell dx-scheduler-last-group-cell
      ${viewModel.props.className}`}
  />
);

@ComponentBindings()
export class AllDayPanelCellProps {
  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelCell extends JSXComponent(AllDayPanelCellProps) {
}
