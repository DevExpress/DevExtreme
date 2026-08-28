import type { Locator } from '@playwright/test';
import FocusableElement from '../internal/focusable';

const CLASS = {
  viewSwitcher: 'dx-scheduler-view-switcher',

  button: 'dx-button',
};

export default class SchedulerViewSwitcher {
  public readonly element: Locator;

  constructor(toolbar: Locator) {
    this.element = toolbar.locator(`.${CLASS.viewSwitcher}`);
  }

  public getButton(text: string): FocusableElement {
    return new FocusableElement(
      this.element.locator(`.${CLASS.button}`).filter({ hasText: text }),
    );
  }

  public getDropDownButton(): FocusableElement {
    return new FocusableElement(
      this.element.locator(`.${CLASS.button}`),
    );
  }
}
