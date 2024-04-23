import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';

import type { OrdinaryCellProps } from './ordinary_cell';
import { OrdinaryCellDefaultProps } from './ordinary_cell';

export class HeaderCell extends BaseInfernoComponent<OrdinaryCellProps> {
  render(): JSX.Element {
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
