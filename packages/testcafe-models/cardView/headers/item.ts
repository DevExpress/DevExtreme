import FocusableElement from '../../internal/focusable';

const CLASS = {
  ascendingIcon: 'dx-icon-sortup',
  descendingIcon: 'dx-icon-sortdown',
  sortingOrder: 'header-item-sorting-order',
  headerFilterIconSelected: 'dx-header-filter-icon--selected'
};

export default class HeaderItem extends FocusableElement {
  widgetName: string;

  constructor(element: Selector, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
  }

  isSortedAscending(): Promise<boolean> {
    return this.element.find(`.${CLASS.ascendingIcon}`).exists;
  }
  isSortedDescending(): Promise<boolean> {
    return this.element.find(`.${CLASS.descendingIcon}`).exists;
  }
  isSorted(): Promise<boolean> {
    return this.element.find(`.${CLASS.ascendingIcon}, .${CLASS.descendingIcon}`).exists;
  }
  getSortIndex(): Promise<string> {
    const orderElement = this.element.find(`.${CLASS.sortingOrder}`);
    return orderElement.innerText;
  }
  
  isHeaderFilterSelected(): Promise<boolean> {
    return this.element.find(`.${CLASS.headerFilterIconSelected}`).exists;
  }
}
