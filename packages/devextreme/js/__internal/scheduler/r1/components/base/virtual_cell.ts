import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { PropsWithStyles } from '@ts/core/r1/index';
import type { VNode } from 'inferno';
import { createComponentVNode } from 'inferno';

import { renderUtils } from '../../utils/index';
import { HeaderCell } from './header_cell';
import { OrdinaryCell } from './ordinary_cell';

export interface VirtualCellProps extends Partial<PropsWithStyles> {
  width: number;
  colSpan?: number;
  isHeaderCell: boolean;
}

const VirtualCellDefaultProps = {
  width: 0,
  isHeaderCell: false,
};

export class VirtualCell extends BaseInfernoComponent<VirtualCellProps> {
  render(): VNode {
    const {
      colSpan,
      isHeaderCell,
      width,
      styles,
    } = this.props;
    const style = renderUtils.addWidthToStyle(width, styles);
    const Cell = isHeaderCell ? HeaderCell : OrdinaryCell;

    return createComponentVNode(2, Cell, {
      className: 'dx-scheduler-virtual-cell',
      styles: style,
      colSpan,
    });
  }
}
VirtualCell.defaultProps = VirtualCellDefaultProps;
