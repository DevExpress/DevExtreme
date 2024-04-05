import { Selector } from 'testcafe';

const CLASSES = {
  columnHeader: 'dx-column-header',
  action: 'dx-pivotgrid-action',
  columnIndicators: 'dx-column-indicators',
  headerFilter: {
    icon: 'dx-header-filter',
    menu: 'dx-header-filter-menu',
  },
  popup: 'dx-popup-normal',
  scrollable: 'dx-scrollable-container',
};

export default class ColumnHeaderArea {
  private readonly element: Selector;

  constructor(selector: Selector) {
    this.element = selector.find(`.${CLASSES.columnHeader}`);
  }

  getAction(idx = 0): Selector {
    return this.element.find(`.${CLASSES.action}`).nth(idx);
  }

  // todo: move header filter to seperate file

  // popup is contained in viewport
  // eslint-disable-next-line class-methods-use-this
  getHeaderFilterMenu(): Selector {
    return Selector(`.${CLASSES.headerFilter.menu}`);
  }

  getHeaderFilterIcon(idx = 0): Selector {
    return this.getAction(idx).find(`.${CLASSES.headerFilter.icon}`);
  }

  getHeaderFilterScrollable(): Selector {
    return this.getHeaderFilterMenu().find(`.${CLASSES.scrollable}`);
  }
}
