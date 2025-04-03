import Navigator from './navigator';
import ViewSwitcher from './viewSwitcher';

const CLASS = {
  toolbar: 'dx-toolbar',
  toolbarTodayButton: 'dx-scheduler-today',
};

export default class Toolbar {
  readonly element: Selector;

  readonly todayButton: Selector;

  readonly navigator: Navigator;

  readonly viewSwitcher: ViewSwitcher;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.toolbar}`);
    this.todayButton = this.element.find(`.${CLASS.toolbarTodayButton}`);
    this.navigator = new Navigator(this.element);
    this.viewSwitcher = new ViewSwitcher(this.element);
  }
}
