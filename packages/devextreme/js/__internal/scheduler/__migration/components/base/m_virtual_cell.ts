import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { CSSAttributes } from '@devextreme-generator/declarations';
import type { VNode } from 'inferno';
import { createComponentVNode } from 'inferno';

import { renderUtils } from '../../utils/index';
import { HeaderCell } from './m_header_cell';
import { OrdinaryCell } from './m_ordinary_cell';

export const viewFunction = (_ref) => {
  const {
    props: {
      colSpan,
      isHeaderCell,
    },
    style,
  } = _ref;
  const Cell = isHeaderCell ? HeaderCell : OrdinaryCell;
  return createComponentVNode(2, Cell, {
    className: 'dx-scheduler-virtual-cell',
    styles: style,
    colSpan,
  });
};

export const VirtualCellProps = {
  width: 0,
  isHeaderCell: false,
};

export class VirtualCell extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get style(): CSSAttributes {
    const {
      width,
      style,
    } = this.props as any;
    return renderUtils.addWidthToStyle(width, style);
  }

  render(): VNode {
    const { props } = this;
    return viewFunction({
      props: { ...props },
      style: this.style,
    });
  }
}
VirtualCell.defaultProps = VirtualCellProps;
