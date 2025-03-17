import { BaseInfernoComponent, normalizeStyles } from '@ts/core/r1/runtime/inferno/index';
import type { InfernoNode } from 'inferno';

import type { OrdinaryCellProps } from './ordinary_cell';
import { OrdinaryCellDefaultProps } from './ordinary_cell';

export class HeaderCell extends BaseInfernoComponent<OrdinaryCellProps> {
  render(): InfernoNode {
    const {
      children,
      className,
      colSpan,
      styles,
    } = this.props;

    return (
      <th
        className={className}
        style={normalizeStyles(styles)}
        colSpan={colSpan}
      >
        {children}
      </th>
    );
  }
}
HeaderCell.defaultProps = OrdinaryCellDefaultProps;
