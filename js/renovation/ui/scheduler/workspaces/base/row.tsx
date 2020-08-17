import {
  Component, ComponentBindings, JSXComponent, Slot, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { addHeightToStyle } from '../utils';
import { combineClasses } from '../../../../utils/combine_classes';

export const viewFunction = (viewModel: Row): JSX.Element => (
  <tr
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.classes}
    style={viewModel.style}
  >
    {viewModel.props.children}
  </tr>
);

@ComponentBindings()
export class RowProps {
  @OneWay() height?: number;

  @OneWay() className?: string = '';

  @OneWay() isVirtual?: boolean = false;

  @Slot() children?: JSX.Element | JSX.Element[];
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

  get classes(): string {
    const { className } = this.props;

    return combineClasses({
      'dx-scheduler-virtual-row': !!this.props.isVirtual,
      [className!]: !!className,
    });
  }
}
