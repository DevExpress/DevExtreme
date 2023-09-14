const CLASSES = {
  rowHeader: 'dx-area-description-cell',
  action: 'dx-pivotgrid-action',
};

export default class RowHeaderArea {
  private readonly element: Selector;

  constructor(selector: Selector) {
    this.element = selector.find(`.${CLASSES.rowHeader}`);
  }

  getAction(idx = 0): Selector {
    return this.element.find(`.${CLASSES.action}`).nth(idx);
  }
}
