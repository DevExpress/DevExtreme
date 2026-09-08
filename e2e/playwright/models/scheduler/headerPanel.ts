import type { Locator } from '@playwright/test';

const CLASS = {
  headerPanel: 'dx-scheduler-header-panel',
  headerPanelCell: 'dx-scheduler-header-panel-cell',
  groupCell: 'dx-scheduler-group-header-content',
};

export class HeaderPanel {
  public readonly element: Locator;

  public readonly headerCells: Locator;

  public readonly groupCells: Locator;

  constructor(scheduler: Locator) {
    this.element = scheduler.locator(`.${CLASS.headerPanel}`);

    this.headerCells = this.element.locator(`.${CLASS.headerPanelCell}`);

    this.groupCells = this.element.locator(`.${CLASS.groupCell}`);
  }
}
