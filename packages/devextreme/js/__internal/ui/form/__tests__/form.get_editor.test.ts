import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import CheckBox from '@js/ui/check_box';
import Form from '@js/ui/form';
import TextBox from '@js/ui/text_box';
import Button from '@ts/ui/button';

const forms: Form[] = [];

const createForm = (): Form => {
  const $element = $('<div>').appendTo(document.body);
  const form = new Form($element.get(0) as HTMLElement, {
    formData: { name: 'John', isActive: true },
    items: [
      { dataField: 'name' },
      { dataField: 'isActive', editorType: 'dxCheckBox' },
      { itemType: 'button', name: 'submit', buttonOptions: { text: 'Submit' } },
    ],
  });
  forms.push(form);

  return form;
};

describe('Form', () => {
  afterEach(() => {
    forms.forEach((form) => { form.dispose(); });
    forms.length = 0;
    document.body.innerHTML = '';
  });

  describe('getEditor', () => {
    it('should return the text box of a data field', () => {
      const form = createForm();

      expect(form.getEditor('name')).toBeInstanceOf(TextBox);
    });

    it('should return the check box of a data field', () => {
      const form = createForm();

      const editor = form.getEditor('isActive');

      expect(editor).toBeInstanceOf(CheckBox);
      expect(editor?.option('value')).toBe(true);
    });

    it('should return undefined for an unknown field', () => {
      const form = createForm();

      expect(form.getEditor('unknown')).toBeUndefined();
    });
  });

  describe('getButton', () => {
    it('should return the button of a button item', () => {
      const form = createForm();

      expect(form.getButton('submit')).toBeInstanceOf(Button);
    });
  });
});
