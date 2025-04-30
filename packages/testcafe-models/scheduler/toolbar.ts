import Navigator from './navigator';
import ViewSwitcher from './viewSwitcher';

const CLASS = {
  toolbar: 'dx-toolbar',
  toolbarTodayButton: 'dx-scheduler-today',
  menuButton: 'dx-toolbar-menu-container',
  menuOverlay: 'dx-overlay-content',
};

export default class Toolbar {
  readonly element: Selector;

  readonly todayButton: Selector;

  readonly navigator: Navigator;

  readonly viewSwitcher: ViewSwitcher;

  readonly menuButton: Selector;

  readonly menuOverlay: Selector;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.toolbar}`);
    this.todayButton = this.element.find(`.${CLASS.toolbarTodayButton}`);
    this.navigator = new Navigator(this.element);
    this.viewSwitcher = new ViewSwitcher(this.element);
    this.menuButton = this.element.find(`.${CLASS.menuButton}`);
    this.menuOverlay = this.element.find(`.${CLASS.menuOverlay}`);
  }
}
