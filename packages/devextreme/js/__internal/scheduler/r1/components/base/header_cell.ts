import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import type { VNode } from 'inferno';
import { createVNode } from 'inferno';

import type { CellProps } from './ordinary_cell';
import { CellDefaultProps } from './ordinary_cell';

export class HeaderCell extends BaseInfernoComponent<CellProps> {
  render(): VNode {
    const {
      children,
      className,
      colSpan,
      styles,
    } = this.props;

    return createVNode(1, 'th', className, children, 0, {
      style: normalizeStyles(styles),
      colSpan,
    });
  }
}
HeaderCell.defaultProps = CellDefaultProps;
