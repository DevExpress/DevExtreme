import FocusableElement from "../internal/focusable";
import DataCell from "../dataGrid/data/cell";

const CLASS = {
  actionContainer: 'dx-treelist-icon-container',
  expandButton: 'dx-treelist-collapsed',
  collapseButton: 'dx-treelist-expanded',
};

export default class ExpandableCell extends FocusableElement {
  constructor(cell: DataCell) {
    super(cell.element);
  }

  getExpandButton(): Selector {
    return this.element.find(`.${CLASS.actionContainer}`).find(`.${CLASS.expandButton}`);
  }

  getCollapseButton(): Selector {
    return this.element.find(`.${CLASS.actionContainer}`).find(`.${CLASS.collapseButton}`);
  }

  isExpanded(): Promise<boolean> {
    return this.getCollapseButton().exists;
  }
}
