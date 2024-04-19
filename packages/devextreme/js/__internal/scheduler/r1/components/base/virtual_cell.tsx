import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { PropsWithStyles } from '@ts/core/r1/index';

import { renderUtils } from '../../utils/index';
import { HeaderCell } from './header_cell';
import { OrdinaryCell } from './ordinary_cell';

export interface VirtualCellProps extends Partial<PropsWithStyles> {
  width: number;
  colSpan?: number;
  isHeaderCell: boolean;
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
      width,
      styles,
    } = this.props;
    const modifiedStyles = renderUtils.addWidthToStyle(width, styles);

    const Cell = isHeaderCell ? HeaderCell : OrdinaryCell;

    return (
      <Cell
        className="dx-scheduler-virtual-cell"
        styles={modifiedStyles}
        colSpan={colSpan}
      />
    );
  }
}
VirtualCell.defaultProps = VirtualCellDefaultProps;
