import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { combineClasses } from '../../../../utils/combine_classes';
import { addWidthToStyle } from '../utils';

export const viewFunction = (viewModel: VirtualCell): JSX.Element => (
  <td
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.classes}
    style={viewModel.style}
  />
);

@ComponentBindings()
export class VirtualCellProps {
  @OneWay() className = '';

  @OneWay() width = 0;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualCell extends JSXComponent(VirtualCellProps) {
  get style(): { [key: string]: string | number | undefined } {
    const { width } = this.props;
    const { style } = this.restAttributes;

    return addWidthToStyle(width, style);
  }

  get classes(): string {
    const { className } = this.props;

    const result = combineClasses({
      'dx-scheduler-virtual-cell': true,
      [className]: !!className,
    });

    return result;
  }
}
