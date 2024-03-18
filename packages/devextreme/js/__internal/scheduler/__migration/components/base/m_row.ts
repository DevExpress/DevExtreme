import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { createComponentVNode, createVNode } from 'inferno';

import { splitNumber } from '../../utils/index';
import { VirtualCell } from './m_virtual_cell';

const MAX_COL_SPAN = 1000;

export const viewFunction = (_ref) => {
  const {
    hasLeftVirtualCell,
    hasRightVirtualCell,
    props: {
      children,
      className,
      isHeaderRow,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      styles,
    },
  } = _ref;
  return createVNode(1, 'tr', className, [hasLeftVirtualCell && leftVirtualCellCount != null && splitNumber(leftVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => createComponentVNode(2, VirtualCell, {
    width: leftVirtualCellWidth * (colSpan / leftVirtualCellCount),
    colSpan,
    isHeaderCell: isHeaderRow,
  }, 'left-virtual-cell-'.concat(index as any))), children, hasRightVirtualCell && rightVirtualCellCount != null && splitNumber(rightVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => createComponentVNode(2, VirtualCell, {
    width: rightVirtualCellWidth * (colSpan / rightVirtualCellCount),
    colSpan,
    isHeaderCell: isHeaderRow,
  }, 'right-virtual-cell-'.concat(index as any)))], 0, {
    style: normalizeStyles(styles),
  });
};
export const RowProps = {
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  isHeaderRow: false,
};

export class Row extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get hasLeftVirtualCell() {
    const {
      leftVirtualCellCount,
    } = this.props;
    return !!leftVirtualCellCount;
  }

  get hasRightVirtualCell() {
    const {
      rightVirtualCellCount,
    } = this.props;
    return !!rightVirtualCellCount;
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: { ...props },
      hasLeftVirtualCell: this.hasLeftVirtualCell,
      hasRightVirtualCell: this.hasRightVirtualCell,
    });
  }
}
Row.defaultProps = RowProps;
