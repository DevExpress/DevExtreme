import type { Locator } from '@playwright/test';
import FocusableElement from '../internal/focusable';

const CLASS = {
  filterIcon: 'dx-header-filter-icon',
};

export default class HeaderItem extends FocusableElement {
  public getFilterIcon(): Locator {
    return this.element.locator(`.${CLASS.filterIcon}`);
  }
}
