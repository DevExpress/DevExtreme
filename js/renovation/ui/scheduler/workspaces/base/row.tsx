import {
  Component, ComponentBindings, JSXComponent, Slot, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { addHeightToStyle } from '../utils';

export const viewFunction = (viewModel: Row) => (
  <tr
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={`${viewModel.props.className}`}
    style={viewModel.style}
  >
    {viewModel.props.children}
  </tr>
);

@ComponentBindings()
export class RowProps {
  @OneWay() height?: number;

  @OneWay() className?: string = '';

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Row extends JSXComponent(RowProps) {
  get style(): { [key: string]: string | number | undefined } {
    const { height } = this.props;
    const { style } = this.restAttributes;

    return addHeightToStyle(height, style);
  }
}
