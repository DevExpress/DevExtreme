import { HeaderItemModel } from './header_item';

const CLASSES = {
  headerPanel: 'dx-cardview-headerpanel',
  headerPanelContent: 'dx-cardview-headerpanel-content',
  headerItem: 'dx-cardview-header-item',
};

export class HeaderPanelModel {
  constructor(private readonly root: HTMLElement) {}

  public getContentElement(): HTMLElement {
    return this.root.querySelector(`.${CLASSES.headerPanelContent}`) as HTMLElement;
  }

  public getHeaderItems(): HeaderItemModel[] {
    const content = this.getContentElement();
    const elements = Array.from(content?.querySelectorAll(`.${CLASSES.headerItem}`) ?? []);
    return elements.map((element) => new HeaderItemModel(element as HTMLElement));
  }

  public getHeaderItemByIndex(index: number): HeaderItemModel {
    const items = this.getHeaderItems();
    return items[index];
  }
}
