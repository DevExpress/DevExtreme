import DataCell from "../dataGrid/data/cell";

const CLASS = {
  expandButton: 'dx-treelist-icon-container',
};

export default class ExpandableCell extends DataCell {
  constructor(dataRow: Selector, index: number, widgetName: string) {
    super(dataRow, index, widgetName);
  }

  getExpandButton(): Selector {
    return this.element.find(`.${CLASS.expandButton}`);
  }
}
