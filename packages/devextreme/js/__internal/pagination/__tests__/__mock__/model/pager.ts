import Pagination from '@ts/pagination/wrappers/pagination';

const CLASSES = {
  pagination: 'dx-pagination',
};

export class PagerModel {
  constructor(
    private readonly root: HTMLElement,
    private readonly selector = `.${CLASSES.pagination}`,
  ) {}

  public getElement(): HTMLElement {
    return this.root.querySelector(this.selector) as HTMLElement;
  }

  public getInstance(): Pagination {
    return Pagination.getInstance(this.getElement()) as Pagination;
  }
}
