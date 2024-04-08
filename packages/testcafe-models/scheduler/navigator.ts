import { Selector } from 'testcafe';
import Calendar from '../calendar';

const CLASS = {
  navigator: 'dx-scheduler-navigator',
  navigatorButtonNext: 'dx-scheduler-navigator-next',
  navigatorButtonPrev: 'dx-scheduler-navigator-previous',
  navigatorButtonCaption: 'dx-scheduler-navigator-caption',
  calendar: '.dx-scheduler-navigator-calendar',
};

export default class SchedulerNavigator {
  readonly element: Selector;

  readonly nextButton: Selector;

  readonly prevButton: Selector;

  readonly caption: Selector;

  // eslint-disable-next-line class-methods-use-this
  get calendar(): Calendar {
    return new Calendar(CLASS.calendar);
  }

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.navigator}`);
    this.nextButton = Selector(`.${CLASS.navigatorButtonNext}`);
    this.prevButton = Selector(`.${CLASS.navigatorButtonPrev}`);
    this.caption = Selector(`.${CLASS.navigatorButtonCaption}`);
  }
}
