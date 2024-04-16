import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import type { PropsWithChildren, PropsWithClassName, PropsWithStyles } from '@ts/core/r1/index';
import type { VNode } from 'inferno';
import { createComponentVNode, createVNode } from 'inferno';

import { splitNumber } from '../../utils/index';
import { VirtualCell } from './virtual_cell';

const MAX_COL_SPAN = 1000;

export interface RowProps extends Partial<PropsWithClassName>,
  Partial<PropsWithStyles>,
  PropsWithChildren {
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  leftVirtualCellCount?: number;
  rightVirtualCellCount?: number;
  isHeaderRow: boolean;
}

export const RowDefaultProps = {
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  isHeaderRow: false,
};

export class Row extends BaseInfernoComponent<RowProps> {
  render(): VNode {
    const {
      children,
      className,
      isHeaderRow,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      styles,
    } = this.props;
    const hasLeftVirtualCell = !!leftVirtualCellCount;
    const hasRightVirtualCell = !!rightVirtualCellCount;

    return createVNode(
      1,
      'tr',
      className,
      [hasLeftVirtualCell
      && leftVirtualCellCount != null
      && splitNumber(leftVirtualCellCount, MAX_COL_SPAN)
        .map((colSpan, index) => createComponentVNode(
          2,
          VirtualCell,
          {
            width: leftVirtualCellWidth * (colSpan / leftVirtualCellCount),
            colSpan,
            isHeaderCell: isHeaderRow,
          },
          'left-virtual-cell-'.concat(index.toString()),
        )),
      children, hasRightVirtualCell
      && rightVirtualCellCount != null
      && splitNumber(rightVirtualCellCount, MAX_COL_SPAN)
        .map((colSpan, index) => createComponentVNode(
          2,
          VirtualCell,
          {
            width: rightVirtualCellWidth * (colSpan / rightVirtualCellCount),
            colSpan,
            isHeaderCell: isHeaderRow,
          },
          'right-virtual-cell-'.concat(index.toString()),
        ))],
      0,
      {
        style: normalizeStyles(styles),
      },
    );
  }
}
Row.defaultProps = RowDefaultProps;
