import type { Locator } from '@playwright/test';
import FocusableElement from '../internal/focusable';

const CLASS = {
  form: 'dx-form',
};

export default class EditForm extends FocusableElement {
  public readonly form: Locator;

  public readonly saveButton: Locator;

  public readonly cancelButton: Locator;

  constructor(element: Locator, buttons: Locator) {
    super(element);
    this.form = this.element.locator(`.${CLASS.form}`);
    this.saveButton = buttons.nth(0);
    this.cancelButton = buttons.nth(1);
  }
}
