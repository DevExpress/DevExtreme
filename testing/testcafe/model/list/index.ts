import { ClientFunction } from 'testcafe';
import Widget from '../internal/widget';
import ListItem from './item';
import ListGroup from './group';
import { WidgetName } from '../../helpers/createWidget';

const CLASS = {
  list: 'dx-list',
  group: 'dx-list-group',
  item: 'dx-list-item',
  search: 'dx-list-search',
  selectAllItem: 'dx-list-select-all',
  invisible: 'dx-state-invisible',

  // Custom classes
  nestedItem: 'nested-item',
};

export default class List extends Widget {
  searchInput: Selector;

  selectAll: ListItem;

  constructor(id: string | Selector) {
    super(id);

    this.searchInput = this.element.find(`.${CLASS.search} input`);
    this.selectAll = new ListItem(this.element.find(`.${CLASS.selectAllItem}`));
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxList'; }

  getItem(index = 0): ListItem {
    return new ListItem(this.getItems().nth(index));
  }

  getItems(): Selector {
    return this.element.find(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
  }

  getVisibleItems(): Selector {
    return this.element.find(`.${CLASS.item}:not(.${CLASS.invisible})`);
  }

  getGroup(index = 0): ListGroup {
    return new ListGroup(this.element.find(`.${CLASS.group}`).nth(index));
  }

  scrollTo(value: number): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).scrollTo(value); },
      { dependencies: { getInstance, value } },
    )();
  }
}
