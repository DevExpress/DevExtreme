import DateNavigator from './navigator';
import ViewSwitcher from './viewSwitcher';

const CLASS = {
  toolbar: 'dx-toolbar',
};

export default class SchedulerToolbar {
  element: Selector;

  dateNavigator: DateNavigator;

  viewSwitcher: ViewSwitcher;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.toolbar}`);
    this.dateNavigator = new DateNavigator(this.element);
    this.viewSwitcher = new ViewSwitcher(this.element);
  }
}
