import type { Locator } from '@playwright/test';
import GridElement from '../gridCore/element';

const CLASS = {
  filterIcon: 'dx-header-filter-icon',
};

export default class HeaderItem extends GridElement {
  public getFilterIcon(): Locator {
    return this.element.locator(`.${CLASS.filterIcon}`);
  }
}
