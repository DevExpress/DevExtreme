import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  page: 'dx-page',
  pageSize: 'dx-page-size',
  prevNavButton: 'dx-prev-button',
  nextNavButton: 'dx-next-button',
};

export default class Pagination extends Widget {
  name: WidgetName = 'dxPagination';

  public getPageSize(index: number): Locator {
    return this.element.locator(`.${CLASS.pageSize}`).nth(index);
  }

  public getPrevNavButton(): Locator {
    return this.element.locator(`.${CLASS.prevNavButton}`);
  }

  public getNextNavButton(): Locator {
    return this.element.locator(`.${CLASS.nextNavButton}`);
  }

  public getNavPage(pageText: string): Locator {
    return this.element.locator(`.${CLASS.page}`).filter({ hasText: pageText });
  }
}
