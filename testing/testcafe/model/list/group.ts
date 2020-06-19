import ListItem from './item';

const CLASS = {
  groupHeader: 'dx-list-group-header',
  item: 'dx-list-item',

  // Custom classes
  nestedItem: 'nested-item',
};

export default class ListGroup {
  element: Selector;

  header: Selector;

  items: Selector;

  constructor(element: Selector) {
    this.element = element;
    this.header = element.find(`.${CLASS.groupHeader}`);
    this.items = element.find(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
  }

  getItem(index = 0): ListItem {
    return new ListItem(this.items.nth(index));
  }
}
