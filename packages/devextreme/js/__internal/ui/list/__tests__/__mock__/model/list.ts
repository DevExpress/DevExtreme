import { ListItemModel } from './list_item';

const CLASSES = {
  list: 'dx-list',
  item: 'dx-list-item',
};

export class ListModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getItems(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${CLASSES.item}`);
  }

  public getItem(index = 0): ListItemModel {
    return new ListItemModel(this.getItems()[index]);
  }
}
