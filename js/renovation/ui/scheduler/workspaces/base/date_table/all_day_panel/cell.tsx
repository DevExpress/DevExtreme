import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { getGroupCellClasses } from '../../../utils';

export const viewFunction = (viewModel: AllDayPanelCell) => (
  <td
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.classes}
  />
);

@ComponentBindings()
export class AllDayPanelCellProps {
  @OneWay() className?: string = '';

  @OneWay() isFirstCell?: boolean;

  @OneWay() isLastCell?: boolean;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelCell extends JSXComponent(AllDayPanelCellProps) {
  get classes() {
    const groupClasses = getGroupCellClasses(this.props.isFirstCell, this.props.isLastCell);
    return `dx-scheduler-all-day-table-cell dx-scheduler-cell-sizes-horizontal ${groupClasses} ${this.props.className}`;
  }
}
