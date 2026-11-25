import type { Locator } from '@playwright/test';
import GridElement from '../gridCore/element';

const CLASS = {
  form: 'dx-form',
  textEditorInput: 'dx-texteditor-input',
  checkbox: 'dx-checkbox',
};

export default class EditForm extends GridElement {
  public readonly form: Locator;

  public readonly saveButton: Locator;

  public readonly cancelButton: Locator;

  constructor(element: Locator, buttons: Locator) {
    super(element);
    this.form = this.element.locator(`.${CLASS.form}`);
    this.saveButton = buttons.nth(0);
    this.cancelButton = buttons.nth(1);
  }

  public getItem(id: string): Locator {
    return this.form.locator(`.${CLASS.textEditorInput}[id*=_${id}], .${CLASS.checkbox}[id*=_${id}]`);
  }
}
