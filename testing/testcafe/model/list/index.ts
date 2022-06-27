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

  // Custom classes
  nestedItem: 'nested-item',
};

export default class List extends Widget {
  items: Selector;

  searchInput: Selector;

  selectAll: ListItem;

  constructor(id: string | Selector) {
    super(id);

    this.items = this.element.find(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
    this.searchInput = this.element.find(`.${CLASS.search} input`);
    this.selectAll = new ListItem(this.element.find(`.${CLASS.selectAllItem}`));
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxList'; }

  getItem(index = 0): ListItem {
    return new ListItem(this.items.nth(index));
  }

  getGroup(index = 0): ListGroup {
    return new ListGroup(this.element.find(`.${CLASS.group}`).nth(index));
  }

  focus(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).focus(); },
      { dependencies: { getInstance } },
    )();
  }

  scrollTo(value: number): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).scrollTo(value); },
      { dependencies: { getInstance, value } },
    )();
  }
}
