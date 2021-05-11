import {
  Component, ComponentBindings, JSXComponent, Slot, OneWay, CSSAttributes,
} from '@devextreme-generator/declarations';
import { VirtualCell } from './virtual_cell';

export const viewFunction = ({
  props: {
    className,
    leftVirtualCellWidth,
    rightVirtualCellWidth,
    leftVirtualCellCount,
    rightVirtualCellCount,
    children,
    styles,
    isHeaderRow,
  },
  hasLeftVirtualCell,
  hasRightVirtualCell,
}: Row): JSX.Element => (
  <tr
    className={className}
    style={styles}
  >
    {hasLeftVirtualCell && (
      <VirtualCell
        width={leftVirtualCellWidth}
        colSpan={leftVirtualCellCount}
        isHeaderCell={isHeaderRow}
      />
    )}

    {children}

    {hasRightVirtualCell && (
      <VirtualCell
        width={rightVirtualCellWidth}
        colSpan={rightVirtualCellCount}
        isHeaderCell={isHeaderRow}
      />
    )}
  </tr>
);

@ComponentBindings()
export class RowProps {
  @OneWay() className?: string = '';

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @OneWay() leftVirtualCellCount?: number;

  @OneWay() rightVirtualCellCount?: number;

  @OneWay() styles?: CSSAttributes;

  @OneWay() isHeaderRow = false;

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
