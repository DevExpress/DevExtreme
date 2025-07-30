import type { PropsWithStyles } from '@ts/core/r1/index';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

import { renderUtils } from '../../utils/index';
import { HeaderCell } from './header_cell';
import { OrdinaryCell } from './ordinary_cell';

export interface VirtualCellProps extends Partial<PropsWithStyles> {
  width: number;
  colSpan?: number;
  isHeaderCell: boolean;
  className?: string;
}

export const VirtualCellDefaultProps = {
  width: 0,
  isHeaderCell: false,
};

export class VirtualCell extends BaseInfernoComponent<VirtualCellProps> {
  render(): JSX.Element {
    const {
      colSpan,
      isHeaderCell,
      className = '',
      width,
      styles,
    } = this.props;
    const modifiedStyles = renderUtils.addWidthToStyle(width, styles);

    const Cell = isHeaderCell ? HeaderCell : OrdinaryCell;

    return (
      <Cell
        className={`dx-scheduler-virtual-cell ${className}`}
        styles={modifiedStyles}
        colSpan={colSpan}
      />
    );
  }
}
VirtualCell.defaultProps = VirtualCellDefaultProps;
