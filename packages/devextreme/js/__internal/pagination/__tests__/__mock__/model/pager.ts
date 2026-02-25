const CLASSES = {
  pagination: 'dx-pagination',
};

export class PagerModel {
  constructor(private readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root.querySelector(`.${CLASSES.pagination}`) as HTMLElement;
  }
}
