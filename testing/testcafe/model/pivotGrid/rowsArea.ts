const CLASSES = {
  root: 'dx-pivotgrid-vertical-headers',
};

export default class RowsArea {
  private readonly element: Selector;

  constructor(selector: Selector) {
    this.element = selector.find(`.${CLASSES.root}`);
  }

  getCell(idx = 0): Selector {
    return this.element.find('td').nth(idx);
  }
}
