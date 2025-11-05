import { ListItemModel } from './list_item';

const CLASSES = {
  list: 'dx-list',
  item: 'dx-list-item',
};

export class ListModel {
  constructor(protected readonly root: HTMLElement | null) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getItems(): NodeListOf<HTMLElement> | null {
    return this.root?.querySelectorAll(`.${CLASSES.item}`) ?? null;
  }

  public getItem(index = 0): ListItemModel {
    return new ListItemModel(this.getItems()?.[index] ?? null);
  }
}
