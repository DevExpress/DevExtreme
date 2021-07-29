import Navigator from './navigator';
import ViewSwitcher from './viewSwitcher';

const CLASS = {
  toolbar: 'dx-toolbar',
};

export default class SchedulerToolbar {
  element: Selector;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.toolbar}`);
  }

  getNavigator(): Navigator {
    return new Navigator(this.element);
  }

  getViewSwitcher(): ViewSwitcher {
    return new ViewSwitcher(this.element);
  }
}
