import {
  Component, ComponentBindings, JSXComponent, Slot, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { VirtualCell } from './virtual-cell';

export const viewFunction = ({
  props: {
    className,
    leftVirtualCellWidth,
    rightVirtualCellWidth,
    children,
  },
  hasLeftVirtualCell,
  hasRightVirtualCell,
  restAttributes,
}: Row): JSX.Element => (
  <tr
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    className={className}
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

  @OneWay() isVirtual?: boolean;

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @Slot() children?: JSX.Element | JSX.Element[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Row extends JSXComponent(RowProps) {
  get hasLeftVirtualCell(): boolean {
    const { isVirtual, leftVirtualCellWidth } = this.props;

    return !!isVirtual && !!leftVirtualCellWidth;
  }

  get hasRightVirtualCell(): boolean {
    const { isVirtual, rightVirtualCellWidth } = this.props;

    return !!isVirtual && !!rightVirtualCellWidth;
  }
}
