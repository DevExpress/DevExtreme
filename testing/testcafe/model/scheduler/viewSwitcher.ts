import FocusableElement from '../internal/focusable';

const CLASS = {
  viewSwitcher: 'dx-scheduler-view-switcher',

  button: 'dx-button',
};

export default class SchedulerViewSwitcher {
  element: Selector;

  constructor(toolbar: Selector) {
    this.element = toolbar.find(`.${CLASS.viewSwitcher}`);
  }

  getButton(text: string): FocusableElement {
    return new FocusableElement(
      this.element.find(`.${CLASS.button}`).withText(text),
    );
  }
}
