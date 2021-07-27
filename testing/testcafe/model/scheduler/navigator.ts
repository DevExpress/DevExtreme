import FocusableElement from '../internal/focusable';

const CLASS = {
  navigator: 'dx-scheduler-navigator',
  navigatorButtonNext: 'dx-scheduler-navigator-next',
  navigatorButtonPrev: 'dx-scheduler-navigator-previous',
  navigatorButtonCaption: 'dx-scheduler-navigator-caption',
};

export default class SchedulerNavigator {
  element: Selector;

  nextDuration: FocusableElement;

  prevDuration: FocusableElement;

  caption: FocusableElement;

  constructor(scheduler: Selector) {
    this.element = scheduler.find(`.${CLASS.navigator}`);
    this.nextDuration = this.getFocusable(CLASS.navigatorButtonNext);
    this.prevDuration = this.getFocusable(CLASS.navigatorButtonPrev);
    this.caption = this.getFocusable(CLASS.navigatorButtonCaption);
  }

  getFocusable(name: string): FocusableElement {
    return new FocusableElement(this.element.find(`.${name}`));
  }
}
