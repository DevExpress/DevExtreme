import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { addWidthToStyle } from '../utils';

export const viewFunction = ({
  style,
  props: {
    colSpan,
  },
}: VirtualCell): JSX.Element => (
  <td
    className="dx-scheduler-virtual-cell"
    style={style}
    colSpan={colSpan}
  />
);

@ComponentBindings()
export class VirtualCellProps {
  @OneWay() width = 0;

  @OneWay() colSpan?: number;
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
