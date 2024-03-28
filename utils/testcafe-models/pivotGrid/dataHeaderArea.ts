const CLASSES = {
  dataHeader: 'dx-data-header',
  field: 'dx-area-field',
  box: 'dx-area-box',
};

export default class DataHeaderArea {
  private readonly element: Selector;

  constructor(selector: Selector) {
    this.element = selector.find(`.${CLASSES.dataHeader}`);
  }

  getAction(idx = 0): Selector {
    return this.element.find(`.${CLASSES.field}.${CLASSES.box}`).nth(idx);
  }
}
