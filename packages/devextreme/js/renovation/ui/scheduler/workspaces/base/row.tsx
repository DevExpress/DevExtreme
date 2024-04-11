import {
  Component, ComponentBindings, JSXComponent, Slot, OneWay, CSSAttributes,
} from '@devextreme-generator/declarations';
import { VirtualCell } from './virtual_cell';
import { splitNumber } from '../../../../../__internal/scheduler/r1/utils/index';

const MAX_COL_SPAN = 1000;

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
    {hasLeftVirtualCell
      && leftVirtualCellCount != null
      && splitNumber(leftVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => (
        <VirtualCell
          key={`left-virtual-cell-${index}`}
          width={leftVirtualCellWidth * (colSpan / leftVirtualCellCount)}
          colSpan={colSpan}
          isHeaderCell={isHeaderRow}
        />
      ))}

    {children}

    {hasRightVirtualCell
      && rightVirtualCellCount != null
      && splitNumber(rightVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => (
        <VirtualCell
          key={`right-virtual-cell-${index}`}
          width={rightVirtualCellWidth * (colSpan / rightVirtualCellCount)}
          colSpan={colSpan}
          isHeaderCell={isHeaderRow}
        />
      ))}
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
    const { leftVirtualCellCount } = this.props;

    return !!leftVirtualCellCount;
  }

  get hasRightVirtualCell(): boolean {
    const { rightVirtualCellCount } = this.props;

    return !!rightVirtualCellCount;
  }
}
