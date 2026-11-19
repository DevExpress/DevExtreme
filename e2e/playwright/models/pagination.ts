import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  page: 'dx-page',
  pageSize: 'dx-page-size',
};

export default class Pagination extends Widget {
  public getPageSize(index: number): Locator {
    return this.element.locator(`.${CLASS.pageSize}`).nth(index);
  }

  public getNavPage(pageText: string): Locator {
    return this.element.locator(`.${CLASS.page}`).filter({ hasText: pageText });
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxPagination'; }
}
