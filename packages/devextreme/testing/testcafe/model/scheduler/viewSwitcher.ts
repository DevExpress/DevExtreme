import FocusableElement from '../internal/focusable';

const CLASS = {
  viewSwitcher: 'dx-scheduler-view-switcher',
  viewSwitcherDropDownButton: '.dx-scheduler-view-switcher-dropdown-button',

  button: 'dx-button',
};

export default class SchedulerViewSwitcher {
  element: Selector;

  constructor(toolbar: Selector) {
    this.element = toolbar.find(`.${CLASS.viewSwitcher}`);

    if (!this.element) {
      this.element = toolbar.find(`.${CLASS.viewSwitcherDropDownButton}`);
    }
  }

  getButton(text: string): FocusableElement {
    return new FocusableElement(
      this.element.find(`.${CLASS.button}`).withText(text),
    );
  }

  getDropDownButton(): FocusableElement {
    return new FocusableElement(
      this.element.find(`.${CLASS.button}`),
    );
  }
}
