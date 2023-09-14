const CLASS = {
  groupRow: 'dx-scheduler-group-row',
  groupCell: 'dx-scheduler-group-header-content',
};

export class GroupRow {
  readonly element: Selector;

  readonly groupCells: Selector;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.groupRow}`);

    this.groupCells = this.element.find(`.${CLASS.groupCell}`);
  }
}
