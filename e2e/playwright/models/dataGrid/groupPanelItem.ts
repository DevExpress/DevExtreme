import type { Locator } from '@playwright/test';
import GridElement from '../gridCore/element';

const CLASS = {
  filterButton: 'dx-header-filter',
};

export default class GroupPanelItem extends GridElement {
  public getFilterButton(): Locator {
    return this.element.locator(`.${CLASS.filterButton}`);
  }
}
