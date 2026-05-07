const CLASSES = {
  headerFilterIcon: 'dx-header-filter-icon',
};

export class HeaderItemModel {
  constructor(private readonly element: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.element;
  }

  public getIcon(): HTMLElement {
    return this.element.querySelector(`.${CLASSES.headerFilterIcon}`) as HTMLElement;
  }
}
