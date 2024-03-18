import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { createVNode } from 'inferno';

import { CellProps } from './m_ordinary_cell';

export const viewFunction = (_ref) => {
  const {
    props: {
      children,
      className,
      colSpan,
      styles,
    },
  } = _ref;
  return createVNode(1, 'th', className, children, 0, {
    style: normalizeStyles(styles),
    colSpan,
  });
};
export class HeaderCell extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: { ...props },
    });
  }
}
HeaderCell.defaultProps = CellProps;
