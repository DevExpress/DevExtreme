import HeaderFilter from './headerFilter';

const CLASSES = {
  rowHeader: 'dx-area-description-cell',
  field: 'dx-area-field',
};

export default class RowHeaderArea {
  private readonly element: Selector;

  constructor(selector: Selector) {
    this.element = selector.find(`.${CLASSES.rowHeader}`);
  }

  getField(idx = 0): Selector {
    return this.element.find(`.${CLASSES.field}`).nth(idx);
  }

  getHeaderFilterIcon(idx = 0): HeaderFilter {
    return new HeaderFilter(this.getField(idx));
  }
}
