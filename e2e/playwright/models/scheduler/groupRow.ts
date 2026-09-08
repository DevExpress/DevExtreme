import type { Locator } from '@playwright/test';

const CLASS = {
  groupRow: 'dx-scheduler-group-row',
  groupCell: 'dx-scheduler-group-header-content',
};

export class GroupRow {
  public readonly element: Locator;

  public readonly groupCells: Locator;

  constructor(scheduler: Locator) {
    this.element = scheduler.locator(`.${CLASS.groupRow}`);

    this.groupCells = this.element.locator(`.${CLASS.groupCell}`);
  }
}
