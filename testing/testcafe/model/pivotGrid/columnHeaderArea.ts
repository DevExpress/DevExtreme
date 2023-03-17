const CLASSES = {
  columnHeader: 'dx-column-header',
  action: 'dx-pivotgrid-action',
};

export default class ColumnHeaderArea {
  private readonly element: Selector;

  constructor(selector: Selector) {
    this.element = selector.find(`.${CLASSES.columnHeader}`);
  }

  getAction(idx = 0): Selector {
    return this.element.find(`.${CLASSES.action}`).nth(idx);
  }
}
