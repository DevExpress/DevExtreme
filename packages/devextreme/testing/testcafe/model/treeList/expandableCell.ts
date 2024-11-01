import DataCell from '../dataGrid/data/cell';
import FocusableElement from '../internal/focusable';

const CLASS = {
  expandButton: 'dx-treelist-icon-container',
};

export default class ExpandableCell extends FocusableElement {
  constructor(cell: DataCell) {
    super(cell.element);
  }

  getExpandButton(): Selector {
    return this.element.find(`.${CLASS.expandButton}`);
  }
}
