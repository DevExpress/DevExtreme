const SELECTORS = {
  headerContent: 'text-content',
};

export class HeaderCellModel {
  constructor(
    protected readonly root: HTMLElement | null,
    protected readonly addWidgetPrefix: (classNames: string) => string,
  ) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getText(): string {
    return this.getHeaderContent()?.textContent ?? '';
  }

  public getHeaderContent(): HTMLElement | null {
    return this.root?.querySelector(this.addWidgetPrefix(`.${SELECTORS.headerContent}`)) ?? null;
  }
}
