import type { PropsWithChildren, PropsWithClassName, PropsWithStyles } from '__internal/core/r1';
import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import type * as CSS from 'csstype';
import type { RefObject, VNode } from 'inferno';
import { createComponentVNode, createVNode } from 'inferno';

import { renderUtils } from '../../utils/index';
import { VirtualRow } from './virtual_row';

export interface TableProps extends
  PropsWithClassName,
  PropsWithChildren,
  Partial<PropsWithStyles> {
  topVirtualRowHeight: number;
  bottomVirtualRowHeight: number;
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  leftVirtualCellCount?: number;
  rightVirtualCellCount?: number;
  virtualCellsCount: number;
  height?: number;
  width?: number;
  tableRef?: RefObject<HTMLTableElement>;
}

export const TableDefaultProps: TableProps = {
  className: '',
  topVirtualRowHeight: 0,
  bottomVirtualRowHeight: 0,
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  virtualCellsCount: 0,
};

export class Table extends BaseInfernoComponent<TableProps> {
  private getResultStyles(): CSS.Properties<string | number> {
    const {
      height,
      width,
      styles,
    } = this.props;
    const heightAdded = renderUtils.addHeightToStyle(height, styles);
    return renderUtils.addWidthToStyle(width, heightAdded);
  }

  render(): VNode {
    const {
      className,
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      children,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      tableRef,
      virtualCellsCount,
    } = this.props;
    const hasTopVirtualRow = !!topVirtualRowHeight;
    const hasBottomVirtualRow = !!bottomVirtualRowHeight;
    const resultStyles = this.getResultStyles();

    return createVNode(
      1,
      'table',
      className,
      createVNode(
        1,
        'tbody',
        null,
        [hasTopVirtualRow && createComponentVNode(2, VirtualRow, {
          height: topVirtualRowHeight,
          cellsCount: virtualCellsCount,
          leftVirtualCellWidth,
          rightVirtualCellWidth,
          leftVirtualCellCount,
          rightVirtualCellCount,
        }), children, hasBottomVirtualRow && createComponentVNode(2, VirtualRow, {
          height: bottomVirtualRowHeight,
          cellsCount: virtualCellsCount,
          leftVirtualCellWidth,
          rightVirtualCellWidth,
          leftVirtualCellCount,
          rightVirtualCellCount,
        })],
        0,
      ),
      2,
      {
        style: normalizeStyles(resultStyles),
      },
      null,
      tableRef,
    );
  }
}
Table.defaultProps = TableDefaultProps;
