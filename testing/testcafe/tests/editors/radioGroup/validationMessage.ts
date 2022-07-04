import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Form from '../../../model/form/form';
import RadioGroup from '../../../model/radioGroup';

fixture`Radio Group ValidationMessage`
  .page(url(__dirname, '../../container.html'));

test('message position is right in material (T1020449)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const form = new Form('#container');

  await form.validate();

  const radioGroup = new RadioGroup('.dx-radiogroup');

  await radioGroup.focus();

  await t
    .expect(await takeScreenshot('radiogroup-horizontal-validation.png', '#radio-form'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
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
