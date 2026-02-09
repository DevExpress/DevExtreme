const CLASSES = {
  headerPanel: 'dx-cardview-headerpanel',
  headerPanelContent: 'dx-cardview-headerpanel-content',
  headerItem: 'dx-cardview-header-item',
};

export class HeaderPanelModel {
  constructor(private readonly root: HTMLElement) {}

  public getContentElement(): HTMLElement | null {
    return this.root.querySelector(`.${CLASSES.headerPanelContent}`);
  }

  public getHeaderItems(): HTMLElement[] {
    const content = this.getContentElement();
    return Array.from(content?.querySelectorAll(`.${CLASSES.headerItem}`) ?? []);
  }

  public getHeaderItemByIndex(index: number): HTMLElement {
    const items = this.getHeaderItems();
    return items[index];
  }
}
