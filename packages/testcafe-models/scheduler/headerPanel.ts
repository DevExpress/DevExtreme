const CLASS = {
  headerPanel: 'dx-scheduler-header-panel',
  headerPanelCell: 'dx-scheduler-header-panel-cell',
  groupCell: 'dx-scheduler-group-header-content',
};

export class HeaderPanel {
  readonly element: Selector;

  readonly headerCells: Selector;

  readonly groupCells: Selector;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.headerPanel}`);

    this.headerCells = this.element.find(`.${CLASS.headerPanelCell}`);

    this.groupCells = this.element.find(`.${CLASS.groupCell}`);
  }
}
