import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import type { PropsWithChildren, PropsWithClassName, PropsWithStyles } from '@ts/core/r1/index';

export interface OrdinaryCellProps extends Partial<PropsWithStyles>,
  Partial<PropsWithClassName>,
  PropsWithChildren {
  colSpan?: number;
}

export const OrdinaryCellDefaultProps = {};

export class OrdinaryCell extends BaseInfernoComponent<OrdinaryCellProps> {
  render(): JSX.Element {
    const {
      children,
      className,
      colSpan,
      styles,
    } = this.props;

    return (
      <td
        className={className}
        style={normalizeStyles(styles)}
        colSpan={colSpan}
      >
        {children}
      </td>
    );
  }
}

OrdinaryCell.defaultProps = OrdinaryCellDefaultProps;
