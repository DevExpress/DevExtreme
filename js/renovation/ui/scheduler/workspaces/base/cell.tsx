import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';
import { getGroupCellClasses } from '../utils';

export const viewFunction = (viewModel: CellBase): JSX.Element => (
  <td
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.classes}
  >
    {viewModel.props.children}
  </td>
);

@ComponentBindings()
export class CellBaseProps {
  @OneWay() className? = '';

  @OneWay() isFirstCell? = false;

  @OneWay() isLastCell? = false;

  @OneWay() startDate?: Date = new Date();

  @OneWay() endDate?: Date = new Date();

  @OneWay() allDay?: boolean = false;

  @OneWay() groups?: object;

  @OneWay() text?: string = '';

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class CellBase extends JSXComponent(CellBaseProps) {
  get classes(): string {
    return getGroupCellClasses(this.props.isFirstCell, this.props.isLastCell, this.props.className);
  }
}
