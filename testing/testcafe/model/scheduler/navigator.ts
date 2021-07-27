import { Selector } from 'testcafe';

const CLASS = {
  navigator: 'dx-scheduler-navigator',
  navigatorButtonNext: 'dx-scheduler-navigator-next',
  navigatorButtonPrev: 'dx-scheduler-navigator-previous',
  navigatorButtonCaption: 'dx-scheduler-navigator-caption',
};

export default class SchedulerNavigator {
  element: Selector;

  nextDuration: Selector;

  prevDuration: Selector;

  caption: Selector;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.navigator}`);
    this.nextDuration = Selector(`.${CLASS.navigatorButtonNext}`);
    this.prevDuration = Selector(`.${CLASS.navigatorButtonPrev}`);
    this.caption = Selector(`.${CLASS.navigatorButtonCaption}`);
  }
}
