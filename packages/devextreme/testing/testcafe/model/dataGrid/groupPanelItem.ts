const CLASS = {
  filterButton: 'dx-header-filter',
};

export class GroupPanelItem {
  element: Selector;

  constructor(selector: Selector) {
    this.element = selector;
  }

  getFilterButton(): Selector {
    return this.element.find(`.${CLASS.filterButton}`);
  }
}
