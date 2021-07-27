const CLASS = {
  viewSwitcher: 'dx-scheduler-view-switcher',

  button: 'dx-button',
};

export default class SchedulerViewSwitcher {
  element: Selector;

  constructor(toolbar: Selector) {
    this.element = toolbar.find(`.${CLASS.viewSwitcher}`);
  }

  getButtons(): Selector {
    return this.element.find(`.${CLASS.button}`);
  }

  getButton(text: string): Selector {
    return this.element.find(`.${CLASS.button}`).withText(text);
  }
}
