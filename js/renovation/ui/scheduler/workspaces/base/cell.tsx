import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';
import { getGroupCellClasses } from '../utils';

export const viewFunction = (viewModel: CellBase) => (
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

  @Slot() children?: JSX.Element | JSX.Element[];
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
