import type { PropsWithChildren, PropsWithClassName, PropsWithStyles } from '__internal/core/r1';
import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import type * as CSS from 'csstype';
import type { RefObject } from 'inferno';

import { renderUtils } from '../../utils/index';
import { VirtualRow, VirtualRowDefaultProps } from './virtual_row';

export interface TableProps extends PropsWithClassName,
  PropsWithChildren,
  Partial<PropsWithStyles> {
  topVirtualRowHeight?: number;
  bottomVirtualRowHeight?: number;
  leftVirtualCellWidth?: number;
  rightVirtualCellWidth?: number;
  leftVirtualCellCount?: number;
  rightVirtualCellCount?: number;
  virtualCellsCount?: number;
  height?: number;
  width?: number;
  tableRef?: RefObject<HTMLTableElement>;
}

export const TableDefaultProps: TableProps = {
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

  render(): JSX.Element {
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

    return (
      <table
        ref={tableRef}
        className={className}
        style={normalizeStyles(resultStyles)}
      >
        <tbody>
        {
          hasTopVirtualRow && (
            // @ts-expect-error TS2786
            <VirtualRow
              height={topVirtualRowHeight}
              cellsCount={virtualCellsCount ?? VirtualRowDefaultProps.cellsCount}
              leftVirtualCellWidth={leftVirtualCellWidth
                ?? VirtualRowDefaultProps.leftVirtualCellWidth}
              rightVirtualCellWidth={rightVirtualCellWidth
                ?? VirtualRowDefaultProps.rightVirtualCellWidth}
              leftVirtualCellCount={leftVirtualCellCount}
              rightVirtualCellCount={rightVirtualCellCount}
            />
          )
        }
        {children}
        {
          hasBottomVirtualRow && (
            // @ts-expect-error TS2786
            <VirtualRow
              height={bottomVirtualRowHeight}
              cellsCount={virtualCellsCount ?? VirtualRowDefaultProps.cellsCount}
              leftVirtualCellWidth={leftVirtualCellWidth
                ?? VirtualRowDefaultProps.leftVirtualCellWidth}
              rightVirtualCellWidth={rightVirtualCellWidth
                ?? VirtualRowDefaultProps.rightVirtualCellWidth}
              leftVirtualCellCount={leftVirtualCellCount}
              rightVirtualCellCount={rightVirtualCellCount}
            />
          )
        }
        </tbody>
      </table>
    );
  }
}

Table.defaultProps = TableDefaultProps;
