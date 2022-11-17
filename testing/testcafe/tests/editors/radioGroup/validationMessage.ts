import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Form from '../../../model/form/form';
import RadioGroup from '../../../model/radioGroup';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`Radio Group ValidationMessage`
  .page(url(__dirname, '../../container.html'));

test('message position is right (T1020449)', async (t) => {
  const form = new Form('#container');

  await form.validate();

  const radioGroup = new RadioGroup('.dx-radiogroup');

  await radioGroup.focus();

  await t.expect(await compareScreenshot(t, `radiogroup-horizontal-validation${getThemePostfix()}.png`, form.element)).ok();
}).before(async () => createWidget('dxForm', {
  width: 300,
  height: 400,
  items: [{
    itemType: 'simple',
    dataField: 'PropertyNameId',
    editorOptions: {
      dataSource: ['HR Manager', 'IT Manager'],
      layout: 'horizontal',
    },
    editorType: 'dxRadioGroup',
    validationRules: [{
      type: 'required',
      message: 'The PropertyNameId field is required.',
    }],
  }, {
    itemType: 'button',
    horizontalAlignment: 'left',
    buttonOptions: {
      text: 'Register',
      type: 'success',
      useSubmitBehavior: true,
    },
  }],
}));
