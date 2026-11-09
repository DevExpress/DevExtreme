import type { Page } from '@playwright/test';
import Button from '../../button';

const SELECTORS = {
  toolbar: '.dx-scheduler-appointment-popup .dx-popup-title',
  doneButton: '.dx-popup-done.dx-button.dx-widget',
};

export default class AppointmentPopup {
  public readonly saveButton: Button;

  constructor(page: Page) {
    const toolbar = page.locator(SELECTORS.toolbar);

    this.saveButton = new Button(page, toolbar.locator(SELECTORS.doneButton));
  }
}
