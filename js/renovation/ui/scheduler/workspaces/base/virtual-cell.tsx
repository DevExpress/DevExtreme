import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { addWidthToStyle } from '../utils';

export const viewFunction = (viewModel: VirtualCell): JSX.Element => (
  <td
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className="dx-scheduler-virtual-cell"
    style={viewModel.style}
  />
);

@ComponentBindings()
export class VirtualCellProps {
  @OneWay() width = 0;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualCell extends JSXComponent(VirtualCellProps) {
  get style(): CSSAttributes {
    const { width } = this.props;
    const { style } = this.restAttributes;

    return addWidthToStyle(width, style);
  }
}
