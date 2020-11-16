import FocusableElement from '../internal/focusable';

const CLASS = {
  form: 'dx-form',
  textEditor: 'dx-texteditor',
  textEditorInput: 'dx-texteditor-input',
  invalid: 'dx-invalid',
};

export default class EditForm extends FocusableElement {
  form: Selector;

  saveButton: Selector;

  cancelButton: Selector;

  constructor(element: Selector, buttons: Selector) {
    super(element);
    this.form = this.element.find(`.${CLASS.form}`);
    this.saveButton = buttons.nth(0);
    this.cancelButton = buttons.nth(1);
  }

  getItem(id): Selector {
    return this.form.find(`.${CLASS.textEditorInput}[id*=_${id}], .dx-checkbox[id*=_${id}]`);
  }

  getInvalids(): Selector {
    return this.form.find(`.${CLASS.textEditor}.${CLASS.invalid}`);
  }
}
