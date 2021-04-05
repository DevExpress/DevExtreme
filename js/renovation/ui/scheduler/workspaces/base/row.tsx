import {
  Component, ComponentBindings, JSXComponent, Slot, OneWay, CSSAttributes,
} from '@devextreme-generator/declarations';
import { VirtualCell } from './virtual-cell';

export const viewFunction = ({
  props: {
    className,
    leftVirtualCellWidth,
    rightVirtualCellWidth,
    children,
    styles,
  },
  hasLeftVirtualCell,
  hasRightVirtualCell,
}: Row): JSX.Element => (
  <tr
    className={className}
    style={styles}
  >
    {hasLeftVirtualCell && (
      <VirtualCell width={leftVirtualCellWidth} />
    )}

    {children}

    {hasRightVirtualCell && (
      <VirtualCell width={rightVirtualCellWidth} />
    )}
  </tr>
);

@ComponentBindings()
export class RowProps {
  @OneWay() className?: string = '';

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @OneWay() styles?: CSSAttributes;

  @Slot() children?: JSX.Element | JSX.Element[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Row extends JSXComponent(RowProps) {
  get hasLeftVirtualCell(): boolean {
    const { leftVirtualCellWidth } = this.props;

    return !!leftVirtualCellWidth;
  }

  get hasRightVirtualCell(): boolean {
    const { rightVirtualCellWidth } = this.props;

    return !!rightVirtualCellWidth;
  }
}
