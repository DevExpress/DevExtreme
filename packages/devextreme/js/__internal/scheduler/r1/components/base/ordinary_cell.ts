import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import type { PropsWithChildren, PropsWithClassName, PropsWithStyles } from '@ts/core/r1/index';
import type { VNode } from 'inferno';
import { createVNode } from 'inferno';

export interface CellProps extends Partial<PropsWithStyles>,
  Partial<PropsWithClassName>,
  PropsWithChildren {
  colSpan?: number;
}

export const CellDefaultProps = {};

export class OrdinaryCell extends BaseInfernoComponent<CellProps> {
  render(): VNode {
    const {
      children,
      className,
      colSpan,
      styles,
    } = this.props;

    return createVNode(1, 'td', className, children, 0, {
      style: normalizeStyles(styles),
      colSpan,
    });
  }
}

OrdinaryCell.defaultProps = CellDefaultProps;
