import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';
import { exactTextMatcher } from './internal/textMatcher';
import SelectBox from './selectBox';

const CLASS = {
  page: 'dx-page',
  pageSize: 'dx-page-size',
  pageSizes: 'dx-page-sizes',
  prevNavButton: 'dx-prev-button',
  nextNavButton: 'dx-next-button',
  pageIndex: 'dx-page-index',
  info: 'dx-info',
  select: 'dx-selectbox',
  item: 'dx-item',
  numberBox: 'dx-numberbox',
  overlayContent: 'dx-overlay-content',
  selection: 'dx-selection',
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

  public getPageSizeSelectBox(): SelectBox {
    return new SelectBox(this.page, this.element.locator(`.${CLASS.pageSizes} .${CLASS.select}`));
  }

  // The drop-down of the page size select box is rendered into the page body.
  public getPopupPageSizes(): Locator {
    return this.page.locator(`.${CLASS.overlayContent} .${CLASS.item}`);
  }

  public getPageIndexWidget(): Locator {
    return this.element.locator(`.${CLASS.pageIndex}.${CLASS.numberBox}`);
  }

  public getInfoText(): Locator {
    return this.element.locator(`.${CLASS.info}`);
  }

  public getSelectedPages(): Locator {
    return this.element.locator(`.${CLASS.page}.${CLASS.selection}`);
  }

  public getPageByIndex(index: number): Locator {
    return this.element.locator(`.${CLASS.page}`).nth(index);
  }

  public getPagesByText(text: string): Locator {
    return this.element.locator(`.${CLASS.page}`).filter({ hasText: exactTextMatcher(text) });
  }
}
