import HeaderFilter from './headerFilter';

const CLASSES = {
  header: 'dx-pivotgrid-fields-area',
  field: 'dx-area-field',
  fieldButton: 'dx-header-filter',
};

export default class FilterHeaderArea {
  private readonly element: Selector;

  constructor(selector: Selector) {
    this.element = selector.find(`.${CLASSES.header}`);
  }

  getField(idx = 0): Selector {
    return this.element.find(`.${CLASSES.field}`).nth(idx);
  }

  getHeaderFilterIcon(idx = 0): HeaderFilter {
    return new HeaderFilter(this.getField(idx));
  }
}
