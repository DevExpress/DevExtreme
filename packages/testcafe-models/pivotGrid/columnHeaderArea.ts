import { Selector } from 'testcafe';
import HeaderFilter from './headerFilter';

const CLASSES = {
  columnHeader: 'dx-column-header',
  field: 'dx-area-field',
  columnIndicators: 'dx-column-indicators',
  headerFilter: {
    icon: 'dx-header-filter',
    menu: 'dx-header-filter-menu',
  },
  popup: 'dx-popup-normal',
  scrollable: 'dx-scrollable-container',
};

export default class ColumnHeaderArea {
  public readonly element: Selector;

  constructor(selector: Selector) {
    this.element = selector.find(`.${CLASSES.columnHeader}`);
  }

  getField(idx = 0): Selector {
    return this.element.find(`.${CLASSES.field}`).nth(idx);
  }

  // todo: move header filter to seperate file

  // popup is contained in viewport
  // eslint-disable-next-line class-methods-use-this
  getHeaderFilterMenu(): Selector {
    return Selector(`.${CLASSES.headerFilter.menu}`);
  }

  getHeaderFilterIcon(idx = 0): HeaderFilter {
    return new HeaderFilter(this.getField(idx));
  }

  getHeaderFilterScrollable(): Selector {
    return this.getHeaderFilterMenu().find(`.${CLASSES.scrollable}`);
  }
}
