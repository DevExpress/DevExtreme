import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import type { PropsWithChildren, PropsWithClassName, PropsWithStyles } from '@ts/core/r1/index';

import { splitNumber } from '../../utils/index';
import { VirtualCell, VirtualCellDefaultProps } from './virtual_cell';

const MAX_COL_SPAN = 1000;

export interface RowProps extends Partial<PropsWithClassName>,
  Partial<PropsWithStyles>,
  PropsWithChildren {
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  leftVirtualCellCount?: number;
  rightVirtualCellCount?: number;
  isHeaderRow?: boolean;
}

export const RowDefaultProps = {
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  isHeaderRow: false,
};

export class Row extends BaseInfernoComponent<RowProps> {
  render(): JSX.Element {
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

    return (
      <tr
        className={className}
        style={normalizeStyles(styles)}
      >
        {
          hasLeftVirtualCell
          && leftVirtualCellCount != null
          && splitNumber(leftVirtualCellCount, MAX_COL_SPAN).map(
            // @ts-ignore
            (colSpan, index) => <VirtualCell
              // @ts-expect-error
              className={`left-virtual-cell-${index}`}
              width={leftVirtualCellWidth * (colSpan / leftVirtualCellCount)}
              colSpan={colSpan}
              isHeaderCell={isHeaderRow ?? VirtualCellDefaultProps.isHeaderCell}
            />,
          )
        }
        {children}
        {
          hasRightVirtualCell
          && rightVirtualCellCount != null
          && splitNumber(rightVirtualCellCount, MAX_COL_SPAN).map(
            // @ts-ignore
            (colSpan, index) => <VirtualCell
              // @ts-expect-error
              className={`right-virtual-cell-${index}`}
              width={rightVirtualCellWidth * (colSpan / rightVirtualCellCount)}
              colSpan={colSpan}
              isHeaderCell={isHeaderRow ?? VirtualCellDefaultProps.isHeaderCell}
            />,
          )
        }
      </tr>
    );
  }
}

Row.defaultProps = RowDefaultProps;
