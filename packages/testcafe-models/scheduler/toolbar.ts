import Navigator from './navigator';
import ViewSwitcher from './viewSwitcher';

const CLASS = {
  toolbar: 'dx-scheduler-header',
  toolbarTodayButton: 'dx-scheduler-today',
  menuButton: 'dx-toolbar-menu-container',
  invisible: 'dx-state-invisible',
};

export default class Toolbar {
  readonly element: Selector;

  readonly todayButton: Selector;

  readonly navigator: Navigator;

  readonly viewSwitcher: ViewSwitcher;

  readonly menuButton: Selector;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.toolbar}`);
    this.todayButton = this.element.find(`.${CLASS.toolbarTodayButton}`);
    this.navigator = new Navigator(this.element);
    this.viewSwitcher = new ViewSwitcher(this.element);
    this.menuButton = this.element.find(`.${CLASS.menuButton}`);
  }

  isInvisible() {
    return this.element.hasClass(CLASS.invisible);
  }
}
