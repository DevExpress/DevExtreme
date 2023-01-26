import { Selector } from 'testcafe';

const CLASS = {
  navigator: 'dx-scheduler-navigator',
  navigatorButtonNext: 'dx-scheduler-navigator-next',
  navigatorButtonPrev: 'dx-scheduler-navigator-previous',
  navigatorButtonCaption: 'dx-scheduler-navigator-caption',
};

export default class SchedulerNavigator {
  readonly element: Selector;

  readonly nextButton: Selector;

  readonly prevButton: Selector;

  readonly caption: Selector;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.navigator}`);
    this.nextButton = Selector(`.${CLASS.navigatorButtonNext}`);
    this.prevButton = Selector(`.${CLASS.navigatorButtonPrev}`);
    this.caption = Selector(`.${CLASS.navigatorButtonCaption}`);
  }
}
