import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createVNode } from 'inferno';

import { renderUtils } from '../../utils/index';

export const CellBaseProps = {
  className: '',
  isFirstGroupCell: false,
  isLastGroupCell: false,
  startDate: Object.freeze(new Date()),
  endDate: Object.freeze(new Date()),
  allDay: false,
  text: '',
  index: 0,
  contentTemplateProps: Object.freeze({
    data: {},
    index: 0,
  }),
};
export class CellBase extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get classes() {
    const {
      className,
      isFirstGroupCell,
      isLastGroupCell,
    } = this.props as any;
    return renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className);
  }

  render() {
    return createVNode(1, 'td', this.classes, this.props.children, 0, {
      'aria-label': this.props.ariaLabel,
    });
  }
}
CellBase.defaultProps = CellBaseProps;
