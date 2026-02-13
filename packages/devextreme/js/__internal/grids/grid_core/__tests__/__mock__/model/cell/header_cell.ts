import type { HeaderCellAlignment } from './types';

const SELECTORS = {
  headerContent: 'text-content',
  alignmentRight: 'dx-text-content-alignment-right',
  alignmentLeft: 'dx-text-content-alignment-left',
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
    return this.root?.querySelector(`.${this.addWidgetPrefix(SELECTORS.headerContent)}`) ?? null;
  }

  public getAlignment(): HeaderCellAlignment {
    const content = this.getHeaderContent();
    const alignedRight = content?.classList.contains(SELECTORS.alignmentRight);
    const alignedLeft = content?.classList.contains(SELECTORS.alignmentLeft);
    const alignedCenter = alignedLeft && alignedRight;

    switch (true) {
      case alignedCenter:
        return 'center';
      case alignedRight:
        return 'right';
      default:
        return 'left';
    }
  }
}
