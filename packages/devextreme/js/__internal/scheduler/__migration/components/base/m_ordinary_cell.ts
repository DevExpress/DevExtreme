import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { createVNode } from 'inferno';

export const viewFunction = (_ref) => {
  const {
    props: {
      children,
      className,
      colSpan,
      styles,
    },
  } = _ref;
  return createVNode(1, 'td', className, children, 0, {
    style: normalizeStyles(styles),
    colSpan,
  });
};
export const CellProps = {};

export class OrdinaryCell extends BaseInfernoComponent {
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

OrdinaryCell.defaultProps = CellProps;
